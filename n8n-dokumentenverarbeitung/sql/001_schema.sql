-- Dokumentenverarbeitung: Datenbank-Schema
-- PostgreSQL 14+. Idempotent: kann mehrfach ausgeführt werden.
-- Alle Zustände liegen in der Datenbank. n8n hält keinen eigenen Zustand,
-- deshalb geht bei einem Absturz von n8n kein Dokument verloren.

create schema if not exists docflow;
set search_path = docflow, public;

-- ---------------------------------------------------------------------------
-- Einstellungen (zur Laufzeit änderbar, ohne Workflows anzufassen)
-- ---------------------------------------------------------------------------
create table if not exists settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

insert into settings (key, value) values
  ('anthropic_url',            '"https://api.anthropic.com/v1/messages"'),  -- oder ein eigenes KI-Gateway
  ('model_primary',            '"claude-opus-5-5"'),
  ('model_secondary',          '"claude-sonnet-5-5"'),
  ('confidence_auto',          '0.90'),        -- ab hier gilt ein Feld als sicher
  ('verify_above_gross',       '1000'),        -- Prüf-Agent ab diesem Bruttobetrag
  ('review_above_gross',       '50000'),       -- ab hier immer Mensch (Vier-Augen-Prinzip)
  ('always_verify_types',      '["rechnung","gutschrift"]'),
  ('max_attempts',             '6'),
  ('backoff_minutes',          '[1,5,15,60,240,720]'),
  ('lock_minutes',             '30'),        -- muss länger sein als der schlimmste Fall für EIN Dokument
  ('claim_batch_size',         '10'),        -- Dokumente pro Ausführung, einzeln nacheinander geholt
  ('max_file_mb',              '22'),
  ('circuit_window_minutes',   '5'),
  ('circuit_min_calls',        '6'),
  ('circuit_failure_ratio',    '0.8'),
  ('circuit_open_minutes',     '5'),
  ('export_mode',              '"both"'),      -- "http" | "file" | "both"
  ('erp_url',                  '""'),          -- leer = kein HTTP-Export
  ('export_dir',               '"/data/export"'),
  ('spool_dir',                '"/data/spool"'),
  ('alert_webhook_url',        '""'),          -- Teams/Slack-Webhook
  ('alert_email_to',           '""'),
  ('alert_email_from',         '"docflow@localhost"'),
  ('review_notify_email_to',   '""'),
  ('heartbeat_url',            '""'),          -- externer Totmann-Schalter (z. B. Healthchecks)
  ('alert_dedupe_minutes',     '30'),
  ('stale_queue_minutes',      '30'),
  ('retention_years',          '7'),           -- Aufbewahrung nach § 132 BAO
  ('review_base_url',          '""')
on conflict (key) do nothing;

create or replace function setting(p_key text) returns jsonb
language sql stable as $$ select value from docflow.settings where key = p_key $$;

create or replace function setting_num(p_key text) returns numeric
language sql stable as $$ select (value #>> '{}')::numeric from docflow.settings where key = p_key $$;

create or replace function setting_text(p_key text) returns text
language sql stable as $$ select value #>> '{}' from docflow.settings where key = p_key $$;

-- ---------------------------------------------------------------------------
-- Dokumente und Aufträge
-- ---------------------------------------------------------------------------
create table if not exists documents (
  id              uuid primary key default gen_random_uuid(),
  mandant         text not null default 'default',
  sha256          text not null,
  filename        text not null,
  mime_type       text not null,
  size_bytes      bigint not null,
  source          text not null,             -- email | webhook | spool
  source_ref      jsonb not null default '{}'::jsonb,
  spool_name      text,
  content         bytea not null,
  received_at     timestamptz not null default now(),
  retention_until date not null,
  unique (mandant, sha256)
);

create table if not exists jobs (
  id               uuid primary key default gen_random_uuid(),
  document_id      uuid not null unique references documents(id),
  mandant          text not null,
  status           text not null default 'queued'
                   check (status in ('queued','processing','retry','review','approved','done','rejected')),
  priority         int  not null default 100,
  attempts         int  not null default 0,
  next_attempt_at  timestamptz not null default now(),
  locked_until     timestamptz,
  locked_by        text,
  last_error       text,
  last_error_class text,
  review_reason    text[],
  review_token     uuid not null default gen_random_uuid(),
  extraction       jsonb,
  verification     jsonb,
  validation       jsonb,
  final_data       jsonb,
  models_used      text[],
  usage            jsonb not null default '{}'::jsonb,
  decided_by       text,
  first_approver   text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists jobs_claim_idx  on jobs (status, next_attempt_at, priority);
create index if not exists jobs_review_idx on jobs (mandant, status) where status = 'review';

-- Revisionssicheres Protokoll: nur anhängen, nie ändern
alter table jobs add column if not exists first_approver text;

create table if not exists job_events (
  id      bigserial primary key,
  job_id  uuid references jobs(id),
  at      timestamptz not null default now(),
  event   text not null,
  actor   text not null default 'system',
  details jsonb not null default '{}'::jsonb
);
create index if not exists job_events_job_idx on job_events (job_id, at);

create or replace function forbid_change() returns trigger language plpgsql as $$
begin
  raise exception 'job_events ist nur anhängbar (Audit-Protokoll)';
end $$;
drop trigger if exists job_events_append_only on job_events;
create trigger job_events_append_only before update or delete on job_events
  for each row execute function forbid_change();

-- Postausgang zum ERP (Outbox-Muster)
create table if not exists exports (
  id              uuid primary key default gen_random_uuid(),
  job_id          uuid not null unique references jobs(id),
  mandant         text not null,
  payload         jsonb not null,
  status          text not null default 'pending'
                  check (status in ('pending','sending','sent','failed')),
  attempts        int not null default 0,
  next_attempt_at timestamptz not null default now(),
  locked_until    timestamptz,
  locked_by       text,
  http_done       boolean not null default false,
  file_done       boolean not null default false,
  last_error      text,
  sent_at         timestamptz,
  created_at      timestamptz not null default now()
);
create index if not exists exports_claim_idx on exports (status, next_attempt_at);
alter table exports add column if not exists locked_by text;

-- KI-Aufrufe (für Schutzschalter und Kosten)
create table if not exists llm_calls (
  id          bigserial primary key,
  at          timestamptz not null default now(),
  job_id      uuid,
  role        text not null,          -- extraktion | pruefung
  model       text not null,
  ok          boolean not null,
  http_status int,
  error       text,
  input_tokens  int,
  output_tokens int
);
create index if not exists llm_calls_at_idx on llm_calls (at);

-- Alarme (mit Entprellung)
create table if not exists alerts (
  id         bigserial primary key,
  at         timestamptz not null default now(),
  severity   text not null check (severity in ('info','warnung','kritisch')),
  alert_key  text not null,
  message    text not null,
  details    jsonb not null default '{}'::jsonb,
  delivered  text[] not null default '{}',
  suppressed boolean not null default false
);
create index if not exists alerts_key_idx on alerts (alert_key, at);

create table if not exists error_log (
  id            bigserial primary key,
  at            timestamptz not null default now(),
  workflow      text,
  node          text,
  execution_id  text,
  message       text,
  details       jsonb not null default '{}'::jsonb
);

create table if not exists spool_imported (
  spool_name  text primary key,
  imported_at timestamptz not null default now(),
  job_id      uuid
);

-- ---------------------------------------------------------------------------
-- Hilfsfunktionen
-- ---------------------------------------------------------------------------
create or replace function log_event(p_job uuid, p_event text, p_details jsonb default '{}'::jsonb, p_actor text default 'system')
returns void language sql as $$
  insert into docflow.job_events (job_id, event, details, actor) values (p_job, p_event, coalesce(p_details,'{}'::jsonb), p_actor);
$$;

-- Dokument annehmen. Doppelte Dateien (gleicher Hash im selben Mandanten) werden erkannt
-- und erzeugen keinen zweiten Auftrag. Dadurch sind Wiederholungen jederzeit gefahrlos.
create or replace function enqueue_document(
  p_mandant text, p_filename text, p_mime text, p_content_b64 text,
  p_source text, p_source_ref jsonb default '{}'::jsonb, p_spool_name text default null,
  p_priority int default 100)
returns table (job_id uuid, document_id uuid, is_duplicate boolean, status text)
language plpgsql as $$
declare
  v_content bytea := decode(p_content_b64, 'base64');
  v_hash    text  := encode(sha256(v_content), 'hex');
  v_mandant text  := coalesce(nullif(trim(p_mandant), ''), 'default');
  v_doc     uuid;
  v_job     uuid;
  v_status  text;
begin

  insert into docflow.documents (mandant, sha256, filename, mime_type, size_bytes, source, source_ref, spool_name, content, retention_until)
  values (v_mandant, v_hash, coalesce(nullif(p_filename,''), 'unbenannt'), coalesce(nullif(p_mime,''), 'application/octet-stream'),
          length(v_content), p_source, coalesce(p_source_ref,'{}'::jsonb), p_spool_name, v_content,
          (current_date + make_interval(years => docflow.setting_num('retention_years')::int))::date)
  on conflict (mandant, sha256) do nothing
  returning id into v_doc;

  if v_doc is null then
    select d.id into v_doc from docflow.documents d where d.mandant = v_mandant and d.sha256 = v_hash;
    select j.id, j.status into v_job, v_status from docflow.jobs j where j.document_id = v_doc;
    perform docflow.log_event(v_job, 'duplikat_empfangen', jsonb_build_object('source', p_source, 'source_ref', p_source_ref, 'filename', p_filename));
    if p_spool_name is not null then
      insert into docflow.spool_imported (spool_name, job_id) values (p_spool_name, v_job) on conflict do nothing;
    end if;
    return query select v_job, v_doc, true, v_status;
    return;
  end if;

  if length(v_content) = 0 then
    insert into docflow.jobs (document_id, mandant, priority, status, review_reason)
    values (v_doc, v_mandant, p_priority, 'review', array['Leere Datei empfangen'])
    returning id into v_job;
  else
    insert into docflow.jobs (document_id, mandant, priority) values (v_doc, v_mandant, p_priority)
    returning id into v_job;
  end if;
  perform docflow.log_event(v_job, 'empfangen', jsonb_build_object('source', p_source, 'filename', p_filename, 'bytes', length(v_content), 'sha256', v_hash));
  if p_spool_name is not null then
    insert into docflow.spool_imported (spool_name, job_id) values (p_spool_name, v_job) on conflict do nothing;
  end if;
  return query select v_job, v_doc, false, (select j.status from docflow.jobs j where j.id = v_job);
end $$;

-- Schutzschalter: Fallen die KI-Aufrufe gehäuft aus, pausiert die Verarbeitung kurz,
-- statt Aufträge sinnlos zu verbrennen. Die Aufträge bleiben in der Warteschlange.
create or replace function circuit_open() returns boolean language plpgsql stable as $$
declare
  v_open_until timestamptz := nullif(docflow.setting_text('circuit_open_until'), '')::timestamptz;
begin
  return v_open_until is not null and v_open_until > now();
end $$;

create or replace function record_llm_call(p_job uuid, p_role text, p_model text, p_ok boolean,
  p_http_status int default null, p_error text default null, p_in int default null, p_out int default null)
returns jsonb language plpgsql as $$
declare
  v_total int; v_failed int; v_opened boolean := false;
begin
  insert into docflow.llm_calls (job_id, role, model, ok, http_status, error, input_tokens, output_tokens)
  values (p_job, p_role, p_model, p_ok, p_http_status, left(p_error, 2000), p_in, p_out);

  if not p_ok then
    select count(*), count(*) filter (where not ok) into v_total, v_failed
    from docflow.llm_calls
    where at > now() - make_interval(mins => docflow.setting_num('circuit_window_minutes')::int);
    if v_total >= docflow.setting_num('circuit_min_calls')
       and v_failed::numeric / v_total >= docflow.setting_num('circuit_failure_ratio')
       and not docflow.circuit_open() then
      insert into docflow.settings (key, value) values
        ('circuit_open_until', to_jsonb((now() + make_interval(mins => docflow.setting_num('circuit_open_minutes')::int))::text))
      on conflict (key) do update set value = excluded.value, updated_at = now();
      v_opened := true;
    end if;
  end if;
  return jsonb_build_object('circuit_opened', v_opened);
end $$;

-- Mehrere KI-Aufrufe eines Durchlaufs verbuchen (Array aus {role, model, ok, http_status, error, input, output})
create or replace function record_llm_calls(p_job uuid, p_calls jsonb) returns jsonb language plpgsql as $$
declare c jsonb; v_opened boolean := false; r jsonb;
begin
  for c in select * from jsonb_array_elements(coalesce(p_calls, '[]'::jsonb)) loop
    r := docflow.record_llm_call(p_job, coalesce(c->>'role','?'), coalesce(c->>'model','?'), coalesce((c->>'ok')::boolean, false),
           (c->>'http_status')::int, c->>'error', (c->>'input')::int, (c->>'output')::int);
    v_opened := v_opened or coalesce((r->>'circuit_opened')::boolean, false);
  end loop;
  if v_opened then
    perform docflow.raise_alert('kritisch', 'circuit_open',
      'KI-Dienst fällt gehäuft aus. Die Verarbeitung pausiert kurz automatisch; alle Dokumente bleiben in der Warteschlange.',
      jsonb_build_object('bis', docflow.setting_text('circuit_open_until')));
  end if;
  return jsonb_build_object('circuit_opened', v_opened);
end $$;

-- Aufträge holen. FOR UPDATE SKIP LOCKED: beliebig viele n8n-Worker können parallel
-- laufen, ohne dass ein Dokument doppelt verarbeitet wird.
create or replace function claim_jobs(p_worker text, p_batch int default null)
returns table (job_id uuid, document_id uuid, mandant text, filename text, mime_type text,
               size_bytes bigint, attempts int, content_b64 text, source_ref jsonb)
language plpgsql as $$
begin
  if docflow.circuit_open() then
    return;
  end if;
  return query
  with picked as (
    select j.id from docflow.jobs j
    where j.status in ('queued','retry') and j.next_attempt_at <= now()
    order by j.priority, j.next_attempt_at
    limit coalesce(p_batch, docflow.setting_num('claim_batch_size')::int)
    for update skip locked
  ), upd as (
    update docflow.jobs j set
      status = 'processing',
      attempts = j.attempts + 1,
      locked_until = now() + make_interval(mins => docflow.setting_num('lock_minutes')::int),
      locked_by = p_worker,
      updated_at = now()
    from picked where j.id = picked.id
    returning j.*
  )
  select u.id, u.document_id, u.mandant, d.filename, d.mime_type, d.size_bytes, u.attempts,
         translate(encode(d.content, 'base64'), E'\n', ''), d.source_ref
  from upd u join docflow.documents d on d.id = u.document_id;

  insert into docflow.job_events (job_id, event, details)
  select j.id, 'verarbeitung_gestartet', jsonb_build_object('worker', p_worker, 'versuch', j.attempts)
  from docflow.jobs j where j.locked_by = p_worker and j.status = 'processing' and j.updated_at >= now() - interval '5 seconds';
end $$;

-- Ergebnis speichern. p_outcome: 'auto' (direkt freigeben) oder 'review' (Mensch prüft).
-- Nur ein Auftrag im Status 'processing' wird übernommen, damit ein verspäteter
-- zweiter Worker nichts überschreibt.
drop function if exists complete_job(uuid, text, text, jsonb, jsonb, jsonb, jsonb, text[], text[], jsonb);
create or replace function complete_job(p_job uuid, p_worker text, p_outcome text,
  p_extraction jsonb, p_verification jsonb, p_validation jsonb, p_final jsonb,
  p_review_reasons text[], p_models text[], p_usage jsonb, p_calls jsonb default '[]'::jsonb)
returns jsonb language plpgsql as $$
declare v_job docflow.jobs;
begin
  perform docflow.record_llm_calls(p_job, p_calls);
  select * into v_job from docflow.jobs where id = p_job for update;
  if v_job.id is null then
    raise exception 'Auftrag % nicht gefunden', p_job;
  end if;
  if v_job.status <> 'processing' or v_job.locked_by is distinct from p_worker then
    perform docflow.log_event(p_job, 'ergebnis_verworfen', jsonb_build_object('grund', 'Auftrag gehört nicht mehr diesem Worker', 'worker', p_worker, 'status', v_job.status));
    return jsonb_build_object('accepted', false, 'status', v_job.status);
  end if;

  -- Duplikatprüfung unter Sperre wiederholen: zwei Kopien derselben Rechnung, die gleichzeitig
  -- auf zwei Workern laufen, dürfen nicht beide automatisch durchgehen.
  if p_outcome = 'auto' then
    perform pg_advisory_xact_lock(hashtext(v_job.mandant || ':' || coalesce(docflow.norm_number(coalesce(p_final, p_extraction)->>'document_number'), p_job::text)));
    declare v_dups text[] := docflow.find_duplicates(p_job, v_job.mandant, coalesce(p_final, p_extraction));
    begin
      if cardinality(v_dups) > 0 then
        p_outcome := 'review';
        p_review_reasons := coalesce(p_review_reasons, '{}') || format('Mögliches Duplikat (gleichzeitig verarbeitet): %s', array_to_string(v_dups, ', '));
      end if;
    end;
  end if;

  update docflow.jobs set
    extraction = p_extraction, verification = p_verification, validation = p_validation,
    final_data = p_final, models_used = p_models, usage = coalesce(p_usage, '{}'::jsonb),
    decided_by = null, first_approver = null,
    review_reason = case when p_outcome = 'review' then p_review_reasons else null end,
    status = case when p_outcome = 'auto' then 'approved' else 'review' end,
    locked_until = null, last_error = null, last_error_class = null, updated_at = now()
  where id = p_job;

  if p_outcome = 'auto' then
    insert into docflow.exports (job_id, mandant, payload)
    values (p_job, v_job.mandant, docflow.export_payload(p_job))
    on conflict (job_id) do nothing;
    perform docflow.log_event(p_job, 'automatisch_freigegeben', jsonb_build_object('modelle', p_models));
  else
    perform docflow.log_event(p_job, 'zur_pruefung', jsonb_build_object('gruende', p_review_reasons));
  end if;
  return jsonb_build_object('accepted', true, 'status', case when p_outcome = 'auto' then 'approved' else 'review' end);
end $$;

-- Fehler verbuchen. Vorübergehende Fehler: neuer Versuch mit wachsender Wartezeit.
-- Nach dem letzten Versuch oder bei dauerhaften Fehlern: ab zum Menschen.
-- Ein Dokument endet nie im Nichts.
drop function if exists fail_job(uuid, text, text, text);
create or replace function fail_job(p_job uuid, p_worker text, p_class text, p_message text, p_calls jsonb default '[]'::jsonb)
returns jsonb language plpgsql as $$
declare
  v_job docflow.jobs;
  v_max int := docflow.setting_num('max_attempts')::int;
  v_backoff jsonb := docflow.setting('backoff_minutes');
  v_wait int;
  v_status text;
begin
  perform docflow.record_llm_calls(p_job, p_calls);
  select * into v_job from docflow.jobs where id = p_job for update;
  if v_job.id is null then
    raise exception 'Auftrag % nicht gefunden', p_job;
  end if;
  if v_job.status <> 'processing' or (p_worker is not null and v_job.locked_by is distinct from p_worker) then
    return jsonb_build_object('accepted', false, 'status', v_job.status);
  end if;

  -- Konfigurationsfehler (z. B. ungültiger API-Schlüssel): sofort Alarm, Dokument aber normal erneut versuchen
  if p_class = 'config' then
    perform docflow.raise_alert('kritisch', 'config_error',
      'Konfigurationsfehler beim KI-Dienst (API-Schlüssel, Berechtigung oder Modellname prüfen). Dokumente warten in der Warteschlange.',
      jsonb_build_object('fehler', left(p_message, 1000)));
    p_class := 'transient';
  end if;

  if p_class = 'transient' and v_job.attempts < v_max then
    v_wait := coalesce((v_backoff ->> least(v_job.attempts - 1, jsonb_array_length(v_backoff) - 1))::int, 60);
    v_status := 'retry';
    update docflow.jobs set status = 'retry', next_attempt_at = now() + make_interval(mins => v_wait),
      locked_until = null, last_error = left(p_message, 4000), last_error_class = p_class, updated_at = now()
    where id = p_job;
    perform docflow.log_event(p_job, 'neuer_versuch_geplant', jsonb_build_object('fehler', left(p_message, 1000), 'warten_min', v_wait, 'versuch', v_job.attempts));
  else
    v_status := 'review';
    update docflow.jobs set status = 'review',
      review_reason = array[case when p_class = 'transient'
                                 then format('Technischer Fehler nach %s Versuchen: %s', v_job.attempts, left(p_message, 300))
                                 else format('Nicht automatisch verarbeitbar: %s', left(p_message, 300)) end],
      locked_until = null, last_error = left(p_message, 4000), last_error_class = p_class, updated_at = now()
    where id = p_job;
    perform docflow.log_event(p_job, 'an_mensch_uebergeben', jsonb_build_object('fehler', left(p_message, 1000), 'klasse', p_class));
    perform docflow.raise_alert(case when p_class = 'transient' then 'kritisch' else 'warnung' end,
      'job_failed:' || p_job::text,
      format('Dokument %s konnte nicht automatisch verarbeitet werden und wartet auf manuelle Prüfung.', p_job),
      jsonb_build_object('job_id', p_job, 'fehler', left(p_message, 1000)));
  end if;
  return jsonb_build_object('accepted', true, 'status', v_status);
end $$;

-- Was ans ERP geht
create or replace function export_payload(p_job uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'job_id', j.id, 'mandant', j.mandant, 'dokument_id', d.id, 'dateiname', d.filename,
    'sha256', d.sha256, 'empfangen', d.received_at, 'quelle', d.source,
    'daten', j.final_data, 'freigabe', case when j.decided_by is null then 'automatisch' else 'manuell' end,
    'freigegeben_von', j.decided_by, 'modelle', j.models_used)
  from docflow.jobs j join docflow.documents d on d.id = j.document_id where j.id = p_job
$$;

-- Prüfentscheidung durch einen Menschen
create or replace function review_decide(p_job uuid, p_token uuid, p_decision text, p_data jsonb, p_reviewer text)
returns jsonb language plpgsql as $$
declare v_job docflow.jobs;
begin
  select * into v_job from docflow.jobs where id = p_job for update;
  if v_job.id is null or p_token is null or v_job.review_token is distinct from p_token then
    return jsonb_build_object('ok', false, 'fehler', 'Auftrag unbekannt oder Token ungültig');
  end if;
  if v_job.status <> 'review' then
    return jsonb_build_object('ok', false, 'fehler', format('Auftrag ist im Status %s, nicht in Prüfung', v_job.status));
  end if;
  if coalesce(nullif(trim(p_reviewer), ''), '') = '' then
    return jsonb_build_object('ok', false, 'fehler', 'Prüfer muss angegeben werden');
  end if;

  if p_decision = 'freigeben' then
    -- Vier-Augen-Prinzip: Über der Freigabegrenze braucht es zwei verschiedene Personen
    declare v_gross numeric := nullif(coalesce(p_data, v_job.final_data, v_job.extraction) #>> '{totals,gross}', '')::numeric;
    begin
      if abs(coalesce(v_gross, 0)) >= docflow.setting_num('review_above_gross') then
        if v_job.first_approver is null then
          update docflow.jobs set first_approver = p_reviewer, final_data = coalesce(p_data, final_data, extraction),
            review_token = gen_random_uuid(), updated_at = now() where id = p_job;
          perform docflow.log_event(p_job, 'erste_freigabe', jsonb_build_object('betrag', v_gross), p_reviewer);
          return jsonb_build_object('ok', true, 'job_id', p_job, 'entscheidung', 'erste_freigabe',
            'hinweis', 'Betrag über Freigabegrenze: Eine zweite Person muss freigeben.');
        elsif lower(v_job.first_approver) = lower(p_reviewer) then
          return jsonb_build_object('ok', false, 'fehler', 'Die zweite Freigabe muss von einer anderen Person kommen.');
        end if;
      end if;
    end;
    update docflow.jobs set status = 'approved', final_data = coalesce(p_data, final_data, extraction),
      decided_by = case when first_approver is null then p_reviewer else first_approver || ' + ' || p_reviewer end,
      review_token = gen_random_uuid(), updated_at = now() where id = p_job;
    if (select final_data from docflow.jobs where id = p_job) is null then
      raise exception 'Keine Daten zum Freigeben vorhanden. Bitte Daten mitsenden.';
    end if;
    insert into docflow.exports (job_id, mandant, payload) values (p_job, v_job.mandant, docflow.export_payload(p_job))
    on conflict (job_id) do update set payload = excluded.payload, status = 'pending', attempts = 0,
      next_attempt_at = now(), http_done = false, file_done = false, last_error = null;
  elsif p_decision = 'ablehnen' then
    update docflow.jobs set status = 'rejected', decided_by = p_reviewer, review_token = gen_random_uuid(), updated_at = now() where id = p_job;
  elsif p_decision = 'erneut_verarbeiten' then
    update docflow.jobs set status = 'queued', attempts = 0, next_attempt_at = now(), decided_by = null, first_approver = null,
      review_token = gen_random_uuid(), review_reason = null, updated_at = now() where id = p_job;
  else
    return jsonb_build_object('ok', false, 'fehler', 'Entscheidung muss freigeben, ablehnen oder erneut_verarbeiten sein');
  end if;
  perform docflow.log_event(p_job, 'pruefentscheidung', jsonb_build_object('entscheidung', p_decision, 'daten_geaendert', p_data is not null), p_reviewer);
  return jsonb_build_object('ok', true, 'job_id', p_job, 'entscheidung', p_decision);
end $$;

-- Export-Postausgang abholen
drop function if exists claim_exports(int);
create or replace function claim_exports(p_worker text, p_batch int default 1)
returns table (export_id uuid, job_id uuid, mandant text, payload jsonb, attempts int, http_done boolean, file_done boolean)
language plpgsql as $$
begin
  return query
  with picked as (
    select e.id from docflow.exports e
    where (e.status = 'pending' and e.next_attempt_at <= now())
       or (e.status = 'sending' and e.locked_until < now())
    order by e.next_attempt_at limit p_batch for update skip locked
  )
  update docflow.exports e set status = 'sending', attempts = e.attempts + 1, locked_by = p_worker,
    locked_until = now() + interval '15 minutes'
  from picked where e.id = picked.id
  returning e.id, e.job_id, e.mandant, e.payload, e.attempts, e.http_done, e.file_done;
end $$;

-- Export-Ergebnis. Exportiert gilt als erledigt, wenn alle konfigurierten Kanäle durch sind.
drop function if exists export_result(uuid, boolean, boolean, text);
create or replace function export_result(p_export uuid, p_worker text, p_http_ok boolean, p_file_ok boolean, p_error text)
returns jsonb language plpgsql as $$
declare
  v_e docflow.exports;
  v_mode text := docflow.setting_text('export_mode');
  v_http_needed boolean := v_mode in ('http','both') and coalesce(docflow.setting_text('erp_url'), '') <> '';
  v_file_needed boolean := v_mode in ('file','both') or not (coalesce(docflow.setting_text('erp_url'), '') <> '');
  v_done boolean;
  v_backoff jsonb := docflow.setting('backoff_minutes');
  v_wait int;
begin
  -- Erfolgreiche Zustellungen immer festhalten, auch von einem verspäteten Lauf
  update docflow.exports set http_done = http_done or coalesce(p_http_ok, false),
                             file_done = file_done or coalesce(p_file_ok, false)
  where id = p_export returning * into v_e;
  if v_e.id is null then raise exception 'Export % nicht gefunden', p_export; end if;
  -- Den Status ändert nur, wem der Export gerade gehört
  if v_e.status <> 'sending' or v_e.locked_by is distinct from p_worker then
    return jsonb_build_object('status', v_e.status, 'hinweis', 'Ergebnis eines verspäteten Laufs: nur Zustellung vermerkt');
  end if;

  v_done := (not v_http_needed or v_e.http_done) and (not v_file_needed or v_e.file_done);
  if v_done then
    update docflow.exports set status = 'sent', sent_at = now(), locked_until = null, last_error = null where id = p_export;
    update docflow.jobs set status = 'done', updated_at = now() where id = v_e.job_id and status = 'approved';
    perform docflow.log_event(v_e.job_id, 'exportiert', jsonb_build_object('http', v_e.http_done, 'datei', v_e.file_done));
    return jsonb_build_object('status', 'sent');
  end if;

  v_wait := coalesce((v_backoff ->> least(v_e.attempts - 1, jsonb_array_length(v_backoff) - 1))::int, 60);
  if v_e.attempts >= docflow.setting_num('max_attempts') then
    update docflow.exports set status = 'failed', locked_until = null, last_error = left(p_error, 4000) where id = p_export;
    perform docflow.log_event(v_e.job_id, 'export_fehlgeschlagen', jsonb_build_object('fehler', left(p_error, 1000)));
    perform docflow.raise_alert('kritisch', 'export_failed:' || p_export::text,
      format('Export für Dokument %s ist endgültig fehlgeschlagen. Die Daten liegen in der Tabelle exports bereit.', v_e.job_id),
      jsonb_build_object('export_id', p_export, 'job_id', v_e.job_id, 'fehler', left(p_error, 1000), 'datei_geschrieben', v_e.file_done));
    return jsonb_build_object('status', 'failed');
  end if;
  update docflow.exports set status = 'pending', locked_until = null, last_error = left(p_error, 4000),
    next_attempt_at = now() + make_interval(mins => v_wait) where id = p_export;
  return jsonb_build_object('status', 'pending', 'warten_min', v_wait);
end $$;

-- Alarm anlegen. Gleiche Alarme innerhalb des Entprell-Fensters werden nur gezählt,
-- nicht erneut verschickt. Rückgabe: soll verschickt werden?
create or replace function raise_alert(p_severity text, p_key text, p_message text, p_details jsonb default '{}'::jsonb)
returns jsonb language plpgsql as $$
declare v_recent boolean; v_id bigint;
begin
  select exists (select 1 from docflow.alerts
                 where alert_key = p_key and not suppressed
                   and at > now() - make_interval(mins => docflow.setting_num('alert_dedupe_minutes')::int))
  into v_recent;
  insert into docflow.alerts (severity, alert_key, message, details, suppressed)
  values (p_severity, p_key, p_message, coalesce(p_details,'{}'::jsonb), v_recent) returning id into v_id;
  return jsonb_build_object('alert_id', v_id, 'send', not v_recent, 'severity', p_severity, 'message', p_message);
end $$;

-- Offene, noch nicht zugestellte Alarme (für den Alarm-Versand)
create or replace function pending_alerts(p_limit int default 50)
returns table (alert_id bigint, severity text, message text, details jsonb, at timestamptz)
language sql as $$
  select id, severity, message, details, at from docflow.alerts
  where not suppressed and cardinality(delivered) = 0 and at > now() - interval '1 day'
  order by at limit p_limit
$$;

create or replace function mark_alert_delivered(p_alert bigint, p_channel text) returns void language sql as $$
  update docflow.alerts set delivered = array_append(delivered, p_channel) where id = p_alert;
$$;

-- Wachhund: hängende Aufträge zurückholen, Gesundheitswerte liefern
create or replace function watchdog() returns jsonb language plpgsql as $$
declare
  v_requeued int; v_exports_requeued int; v_result jsonb;
begin
  with stuck as (
    update docflow.jobs set status = 'retry', next_attempt_at = now(), locked_until = null,
      last_error = 'Worker hat sich nicht zurückgemeldet (Zeitüberschreitung)', last_error_class = 'transient', updated_at = now()
    where status = 'processing' and locked_until < now()
    returning id
  ), ev as (
    insert into docflow.job_events (job_id, event, details)
    select id, 'haengend_zurueckgeholt', '{}'::jsonb from stuck
  )
  select count(*) into v_requeued from stuck;

  -- Aufträge, die beim Zurückholen schon alle Versuche verbraucht haben, gehen an den Menschen
  with exhausted as (
    update docflow.jobs set status = 'review', review_reason = array['Technischer Fehler: Verarbeitung wiederholt abgebrochen'],
      locked_by = null, updated_at = now()
    where status = 'retry' and attempts >= docflow.setting_num('max_attempts')
    returning id
  ), ev as (
    insert into docflow.job_events (job_id, event, details) select id, 'an_mensch_uebergeben', '{"grund":"wiederholt abgebrochen"}'::jsonb from exhausted
  )
  select docflow.raise_alert('kritisch', 'jobs_exhausted', format('%s Dokument(e) nach wiederholtem Abbruch an die manuelle Prüfung übergeben.', count(*)), '{}'::jsonb)
  into v_result from exhausted having count(*) > 0;

  update docflow.exports set status = 'pending', locked_until = null where status = 'sending' and locked_until < now();
  get diagnostics v_exports_requeued = row_count;

  select jsonb_build_object(
    'zeit', now(),
    'haengende_zurueckgeholt', v_requeued,
    'exporte_zurueckgeholt', v_exports_requeued,
    'warteschlange', (select count(*) from docflow.jobs where status in ('queued','retry')),
    'in_arbeit', (select count(*) from docflow.jobs where status = 'processing'),
    'aeltester_wartend_min', coalesce((select round(extract(epoch from now() - min(next_attempt_at)) / 60)
                                         from docflow.jobs where status in ('queued','retry') and next_attempt_at <= now()), 0),
    'zur_pruefung', (select count(*) from docflow.jobs where status = 'review'),
    'neu_zur_pruefung_5min', (select count(*) from docflow.job_events where event = 'zur_pruefung' and at > now() - interval '5 minutes')
                             + (select count(*) from docflow.job_events where event = 'an_mensch_uebergeben' and at > now() - interval '5 minutes'),
    'export_offen', (select count(*) from docflow.exports where status in ('pending','sending')),
    'export_fehlgeschlagen', (select count(*) from docflow.exports where status = 'failed'),
    'schutzschalter_offen', docflow.circuit_open(),
    'ki_fehlerquote_15min', (select round(coalesce(avg(case when ok then 0 else 1 end), 0)::numeric, 2)
                             from docflow.llm_calls where at > now() - interval '15 minutes'),
    'grenze_wartezeit_min', docflow.setting_num('stale_queue_minutes'),
    'heartbeat_url', docflow.setting_text('heartbeat_url')
  ) into v_result;
  return v_result;
end $$;

-- Kennzahlen für Dashboard und Tagesbericht
create or replace function stats(p_mandant text default null, p_days int default 1) returns jsonb language sql stable as $$
  with j as (select * from docflow.jobs where (p_mandant is null or mandant = p_mandant)
             and created_at > now() - make_interval(days => p_days))
  select jsonb_build_object(
    'zeitraum_tage', p_days,
    'mandant', coalesce(p_mandant, 'alle'),
    'empfangen', (select count(*) from j),
    'erledigt', (select count(*) from j where status = 'done'),
    'automatisch', (select count(*) from j where status in ('approved','done') and decided_by is null),
    'manuell_freigegeben', (select count(*) from j where decided_by is not null and status in ('approved','done')),
    'zur_pruefung', (select count(*) from j where status = 'review'),
    'abgelehnt', (select count(*) from j where status = 'rejected'),
    'automatisierungsquote', (select round(100.0 * count(*) filter (where status in ('approved','done') and decided_by is null)
                                     / nullif(count(*) filter (where status in ('approved','done','review','rejected')), 0), 1) from j),
    'ki_tokens_ein', (select coalesce(sum(input_tokens), 0) from docflow.llm_calls c
                      where c.at > now() - make_interval(days => p_days)
                        and (p_mandant is null or c.job_id in (select id from j))),
    'ki_tokens_aus', (select coalesce(sum(output_tokens), 0) from docflow.llm_calls c
                      where c.at > now() - make_interval(days => p_days)
                        and (p_mandant is null or c.job_id in (select id from j))),
    'ki_ausfaelle', (select count(*) from docflow.llm_calls c where not ok and c.at > now() - make_interval(days => p_days))
  )
$$;

-- Prüfliste für die Oberfläche (ohne Dateiinhalt)
create or replace function review_list(p_mandant text default null, p_limit int default 100)
returns table (job_id uuid, mandant text, filename text, received_at timestamptz, review_reason text[],
               review_token uuid, extraction jsonb, verification jsonb, validation jsonb, final_data jsonb)
language sql stable as $$
  select j.id, j.mandant, d.filename, d.received_at, j.review_reason, j.review_token,
         j.extraction, j.verification, j.validation, j.final_data
  from docflow.jobs j join docflow.documents d on d.id = j.document_id
  where j.status = 'review' and (p_mandant is null or j.mandant = p_mandant)
  order by d.received_at limit p_limit
$$;

-- Datei aus dem Zwischenspeicher nachholen (nur wenn noch nicht übernommen)
create or replace function import_spool(p_spool_name text, p_mandant text, p_filename text, p_mime text, p_content_b64 text)
returns jsonb language plpgsql as $$
declare r record;
begin
  if exists (select 1 from docflow.spool_imported where spool_name = p_spool_name) then
    return jsonb_build_object('imported', false, 'grund', 'bereits übernommen');
  end if;
  select * into r from docflow.enqueue_document(p_mandant, p_filename, p_mime, p_content_b64, 'spool',
    jsonb_build_object('spool_name', p_spool_name), p_spool_name);
  return jsonb_build_object('imported', not r.is_duplicate, 'job_id', r.job_id, 'duplikat', r.is_duplicate);
end $$;

-- Fehler eines Workflows protokollieren und Alarm auslösen (für den Fehler-Workflow)
create or replace function log_workflow_error(p_workflow text, p_node text, p_execution text, p_message text, p_details jsonb)
returns jsonb language plpgsql as $$
begin
  insert into docflow.error_log (workflow, node, execution_id, message, details)
  values (p_workflow, p_node, p_execution, left(p_message, 4000), coalesce(p_details, '{}'::jsonb));
  return docflow.raise_alert('kritisch', 'workflow_error:' || coalesce(p_workflow,'?') || ':' || coalesce(p_node,'?'),
    format('Workflow "%s" ist im Schritt "%s" abgebrochen: %s', p_workflow, p_node, left(p_message, 500)),
    jsonb_build_object('execution_id', p_execution));
end $$;

-- Normalisierung für Vergleiche
create or replace function norm_number(p text) returns text language sql immutable as $$
  select nullif(lower(regexp_replace(coalesce(p, ''), '[^[:alnum:]]', '', 'g')), '')
$$;
create or replace function norm_name(p text) returns text language sql immutable as $$
  select nullif(regexp_replace(
           regexp_replace(lower(coalesce(p, '')), '\m(gmbh|ges\.?m\.?b\.?h\.?|ag|kg|og|e\.?u\.?|gesmbh|co|und|&|se|ltd|inc|mbh)\M', '', 'g'),
           '[^[:alnum:]]', '', 'g'), '')
$$;
create or replace function norm_iban(p text) returns text language sql immutable as $$
  select nullif(upper(regexp_replace(coalesce(p, ''), '\s', '', 'g')), '')
$$;

-- Gleicher Aussteller? (UID, IBAN oder bereinigter Name)
create or replace function same_issuer(a jsonb, b jsonb) returns boolean language sql immutable as $$
  select (nullif(upper(regexp_replace(a->>'vat_id', '\s', '', 'g')), '') = nullif(upper(regexp_replace(b->>'vat_id', '\s', '', 'g')), ''))
      or (docflow.norm_iban(a->>'iban') = docflow.norm_iban(b->>'iban'))
      or (docflow.norm_name(a->>'name') = docflow.norm_name(b->>'name'))
$$;

-- Mögliche Duplikate: gleiche Belegnummer beim gleichen Aussteller im selben Mandanten.
-- Berücksichtigt auch Aufträge, die gerade verarbeitet oder geprüft werden.
drop function if exists find_duplicates(uuid, text, text, text);
create or replace function find_duplicates(p_job uuid, p_mandant text, p_data jsonb)
returns text[] language sql stable as $$
  select coalesce(array_agg(j.id::text), '{}') from docflow.jobs j
  where docflow.norm_number(p_data->>'document_number') is not null
    and j.mandant = p_mandant and j.id <> p_job and j.status <> 'rejected'
    and docflow.norm_number(coalesce(j.final_data, j.extraction)->>'document_number') = docflow.norm_number(p_data->>'document_number')
    and coalesce(docflow.same_issuer(coalesce(j.final_data, j.extraction)->'issuer', p_data->'issuer'), false)
$$;

-- Bankverbindung gegen die Historie prüfen (Schutz vor Rechnungsbetrug mit geänderter IBAN).
-- bekannt | neu (Aussteller bekannt, IBAN nicht) | neuer_aussteller | keine
create or replace function iban_status(p_job uuid, p_mandant text, p_data jsonb)
returns text language sql stable as $$
  with hist as (
    select docflow.norm_iban(coalesce(j.final_data, j.extraction)#>>'{issuer,iban}') as iban
    from docflow.jobs j
    where j.mandant = p_mandant and j.id <> p_job and j.status in ('approved','done')
      and coalesce(docflow.same_issuer(coalesce(j.final_data, j.extraction)->'issuer', p_data->'issuer'), false)
  )
  select case
    when docflow.norm_iban(p_data#>>'{issuer,iban}') is null then 'keine'
    when not exists (select 1 from hist) then 'neuer_aussteller'
    when exists (select 1 from hist where iban = docflow.norm_iban(p_data#>>'{issuer,iban}')) then 'bekannt'
    else 'neu' end
$$;

-- Fehlgeschlagenen Export erneut anstoßen (nach Behebung der Ursache)
create or replace function requeue_export(p_job uuid, p_actor text) returns jsonb language plpgsql as $$
begin
  update docflow.exports set status = 'pending', attempts = 0, next_attempt_at = now(), locked_until = null, locked_by = null, last_error = null
  where job_id = p_job and status = 'failed';
  if not found then return jsonb_build_object('ok', false, 'fehler', 'Kein fehlgeschlagener Export für diesen Auftrag'); end if;
  perform docflow.log_event(p_job, 'export_erneut_angestossen', '{}'::jsonb, p_actor);
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------------------
-- Funktionen für das Dashboard
-- ---------------------------------------------------------------------------

-- Dokumentenliste mit Filter und Suche (Dateiname, Belegnummer, Aussteller)
create or replace function docs_list(p_mandant text default null, p_status text default null, p_search text default null, p_limit int default 200)
returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(x order by x->>'empfangen' desc), '[]'::jsonb) from (
    select jsonb_build_object(
      'job_id', j.id, 'mandant', j.mandant, 'dateiname', d.filename, 'status', j.status, 'empfangen', d.received_at,
      'quelle', d.source, 'typ', coalesce(j.final_data, j.extraction)->>'doc_type',
      'belegnummer', coalesce(j.final_data, j.extraction)->>'document_number',
      'aussteller', coalesce(j.final_data, j.extraction)#>>'{issuer,name}',
      'brutto', coalesce(j.final_data, j.extraction)#>>'{totals,gross}',
      'waehrung', coalesce(j.final_data, j.extraction)->>'currency',
      'freigabe', case when j.status in ('approved','done') then coalesce(j.decided_by, 'automatisch') end,
      'gruende', j.review_reason, 'versuche', j.attempts, 'letzter_fehler', j.last_error,
      'export', (select e.status from docflow.exports e where e.job_id = j.id)) as x
    from docflow.jobs j join docflow.documents d on d.id = j.document_id
    where (p_mandant is null or j.mandant = p_mandant)
      and (p_status is null or j.status = p_status)
      and (p_search is null or d.filename ilike '%' || p_search || '%'
           or coalesce(j.final_data, j.extraction)->>'document_number' ilike '%' || p_search || '%'
           or coalesce(j.final_data, j.extraction)#>>'{issuer,name}' ilike '%' || p_search || '%')
    order by d.received_at desc limit p_limit) s
$$;

-- Ein Auftrag mit allen Daten und dem Protokoll
create or replace function job_detail(p_job uuid) returns jsonb language sql stable as $$
  select jsonb_build_object(
    'job_id', j.id, 'mandant', j.mandant, 'status', j.status, 'dateiname', d.filename, 'mime_type', d.mime_type,
    'groesse', d.size_bytes, 'quelle', d.source, 'quelle_info', d.source_ref, 'empfangen', d.received_at, 'sha256', d.sha256,
    'aufbewahren_bis', d.retention_until, 'versuche', j.attempts, 'letzter_fehler', j.last_error,
    'gruende', j.review_reason, 'review_token', case when j.status = 'review' then j.review_token end,
    'erste_freigabe', j.first_approver, 'freigegeben_von', j.decided_by,
    'extraktion', j.extraction, 'pruefung', j.verification, 'validierung', j.validation, 'daten', j.final_data,
    'modelle', j.models_used, 'verbrauch', j.usage,
    'export', (select jsonb_build_object('status', e.status, 'versuche', e.attempts, 'erp', e.http_done, 'datei', e.file_done,
                                         'fehler', e.last_error, 'gesendet', e.sent_at) from docflow.exports e where e.job_id = j.id),
    'verlauf', (select coalesce(jsonb_agg(jsonb_build_object('zeit', ev.at, 'ereignis', ev.event, 'von', ev.actor, 'details', ev.details) order by ev.id), '[]'::jsonb)
                from docflow.job_events ev where ev.job_id = j.id))
  from docflow.jobs j join docflow.documents d on d.id = j.document_id where j.id = p_job
$$;

create or replace function failed_exports(p_mandant text default null) returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(jsonb_build_object('job_id', e.job_id, 'mandant', e.mandant, 'dateiname', d.filename,
    'versuche', e.attempts, 'fehler', e.last_error, 'datei_geschrieben', e.file_done, 'seit', e.created_at) order by e.created_at), '[]'::jsonb)
  from docflow.exports e join docflow.jobs j on j.id = e.job_id join docflow.documents d on d.id = j.document_id
  where e.status = 'failed' and (p_mandant is null or e.mandant = p_mandant)
$$;

create or replace function recent_alerts(p_limit int default 100) returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(jsonb_build_object('id', a.id, 'zeit', a.at, 'stufe', a.severity, 'meldung', a.message,
    'zugestellt', a.delivered, 'unterdrueckt', a.suppressed) order by a.id desc), '[]'::jsonb)
  from (select * from docflow.alerts order by id desc limit p_limit) a
$$;

create or replace function mandanten() returns jsonb language sql stable as $$
  select coalesce(jsonb_agg(m order by m), '[]'::jsonb) from (select distinct mandant m from docflow.jobs) x
$$;

-- Einstellungen, die über das Dashboard geändert werden dürfen (mit Prüfung)
create or replace function settings_editable() returns jsonb language sql stable as $$
  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) from docflow.settings
  where key in ('confidence_auto','verify_above_gross','review_above_gross','always_verify_types','model_primary','model_secondary',
                'export_mode','erp_url','alert_webhook_url','alert_email_to','alert_email_from','heartbeat_url','stale_queue_minutes','max_attempts')
$$;

create or replace function settings_set(p_key text, p_value jsonb, p_actor text) returns jsonb language plpgsql as $$
declare v_old jsonb;
begin
  if p_key not in (select jsonb_object_keys(docflow.settings_editable())) then
    return jsonb_build_object('ok', false, 'fehler', format('Einstellung %s darf hier nicht geändert werden', p_key));
  end if;
  if p_key in ('confidence_auto') and not (jsonb_typeof(p_value) = 'number' and (p_value #>> '{}')::numeric between 0.5 and 1) then
    return jsonb_build_object('ok', false, 'fehler', 'Sicherheitsschwelle muss zwischen 0,5 und 1 liegen');
  end if;
  if p_key in ('verify_above_gross','review_above_gross','stale_queue_minutes','max_attempts')
     and not (jsonb_typeof(p_value) = 'number' and (p_value #>> '{}')::numeric > 0) then
    return jsonb_build_object('ok', false, 'fehler', 'Wert muss eine positive Zahl sein');
  end if;
  if p_key = 'export_mode' and (p_value #>> '{}') not in ('http','file','both') then
    return jsonb_build_object('ok', false, 'fehler', 'Exportweg muss http, file oder both sein');
  end if;
  if p_key = 'always_verify_types' and jsonb_typeof(p_value) <> 'array' then
    return jsonb_build_object('ok', false, 'fehler', 'Liste erwartet');
  end if;
  if p_key not in ('confidence_auto','verify_above_gross','review_above_gross','stale_queue_minutes','max_attempts','always_verify_types')
     and jsonb_typeof(p_value) <> 'string' then
    return jsonb_build_object('ok', false, 'fehler', 'Text erwartet');
  end if;
  select value into v_old from docflow.settings where key = p_key;
  update docflow.settings set value = p_value, updated_at = now() where key = p_key;
  perform docflow.raise_alert('info', 'settings:' || p_key || ':' || now()::text,
    format('Einstellung %s geändert von %s: %s → %s', p_key, coalesce(p_actor, '?'), v_old, p_value), '{}'::jsonb);
  return jsonb_build_object('ok', true, 'key', p_key, 'value', p_value);
end $$;
