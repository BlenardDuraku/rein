// Erzeugt die n8n-Workflows (workflows/*.json) aus den Bausteinen in src/.
// Aufruf: node build/build.mjs
// Die Logik der Code-Knoten liegt in src/lib/*.js und wird hier eingebettet,
// damit sie außerhalb von n8n getestet werden kann (tests/).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lib = (name) => readFileSync(join(root, 'src/lib', `${name}.js`), 'utf8');
const LIBS = {
  schema: lib('schema'), claude: lib('claude'), validate: lib('validate'), decide: lib('decide'), intake: lib('intake'),
};

// Feste IDs, damit Workflows sich gegenseitig finden (Fehler-Workflow, Unter-Workflows)
export const IDS = {
  emailIntake: 'DfEingangEmail01',
  webhookIntake: 'DfEingangHttp001',
  worker: 'DfVerarbeitung01',
  exporter: 'DfExportErp00001',
  watchdog: 'DfWachhund000001',
  alerts: 'DfAlarmVersand01',
  spool: 'DfSpoolRecover01',
  api: 'DfApiPruefung001',
  errors: 'DfFehlerbehand01',
  emergency: 'DfNotfallAlarm01',
};

const CRED = {
  postgres: { postgres: { id: 'DF_POSTGRES', name: 'DF Postgres' } },
  anthropic: { httpHeaderAuth: { id: 'DF_ANTHROPIC', name: 'DF Anthropic API' } },
  api: { httpHeaderAuth: { id: 'DF_API_KEY', name: 'DF API-Schlüssel' } },
  reviewer: { httpHeaderAuth: { id: 'DF_REVIEW_KEY', name: 'DF Prüfer-API' } },
  admin: { httpHeaderAuth: { id: 'DF_ADMIN_KEY', name: 'DF Admin-API' } },
  imap: { imap: { id: 'DF_IMAP', name: 'DF Postfach Eingang' } },
  smtp: { smtp: { id: 'DF_SMTP', name: 'DF SMTP' } },
};

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const DASHBOARD_HTML = readFileSync(join(root, 'dashboard/index.html'), 'utf8');
const SPOOL_DIR = '/data/spool';
const ALERT_DIR = '/data/alerts';

// --------------------------------------------------------------------------
// Bausteine
// --------------------------------------------------------------------------
class Wf {
  constructor(id, name, { errorWorkflow = true } = {}) {
    this.id = id; this.name = name; this.nodes = []; this.connections = {}; this.x = 0;
    this.settings = { executionOrder: 'v1', saveDataErrorExecution: 'all', saveDataSuccessExecution: process.env.DF_DEBUG ? 'all' : 'none',
      saveManualExecutions: true, saveExecutionProgress: !!process.env.DF_DEBUG, callerPolicy: 'workflowsFromSameOwner' };
    if (errorWorkflow) this.settings.errorWorkflow = IDS.errors;
  }
  add(name, type, typeVersion, parameters, extra = {}) {
    if (this.nodes.some((n) => n.name === name)) throw new Error(`Doppelter Knotenname ${name} in ${this.name}`);
    const pos = extra.position || [this.x, extra.y || 0];
    if (!extra.position) this.x += 240;
    const node = { parameters, id: `${this.id}-${this.nodes.length + 1}`, name, type, typeVersion, position: pos };
    for (const k of ['credentials', 'onError', 'retryOnFail', 'maxTries', 'waitBetweenTries', 'alwaysOutputData', 'executeOnce', 'notes', 'webhookId']) {
      if (extra[k] !== undefined) node[k] = extra[k];
    }
    this.nodes.push(node);
    return name;
  }
  link(from, to, fromOutput = 0, toInput = 0) {
    this.connections[from] ??= { main: [] };
    const main = this.connections[from].main;
    while (main.length <= fromOutput) main.push([]);
    main[fromOutput].push({ node: to, type: 'main', index: toInput });
  }
  chain(...names) { for (let i = 0; i < names.length - 1; i++) this.link(names[i], names[i + 1]); }
  json() {
    const names = new Set(this.nodes.map((n) => n.name));
    for (const [from, c] of Object.entries(this.connections)) {
      if (!names.has(from)) throw new Error(`${this.name}: Verbindung von unbekanntem Knoten ${from}`);
      for (const out of c.main) for (const t of out) if (!names.has(t.node)) throw new Error(`${this.name}: Verbindung zu unbekanntem Knoten ${t.node}`);
    }
    return { id: this.id, name: this.name, active: false, nodes: this.nodes, connections: this.connections, settings: this.settings, pinData: {}, tags: [], meta: { templateCredsSetupCompleted: false } };
  }
}

const code = (jsCode, mode = 'runOnceForEachItem') => ({ mode, language: 'javaScript', jsCode });
const withLibs = (names, body) => `${names.map((n) => LIBS[n]).join('\n')}\n// ---- Knotenlogik ----\n${body}`;

const sql = (query, params) => ({
  operation: 'executeQuery',
  query,
  options: params ? { queryReplacement: `={{ ${params} }}` } : {},
});
const pg = (wf, name, query, params, extra = {}) => wf.add(name, 'n8n-nodes-base.postgres', 2.6, sql(query, params), { credentials: CRED.postgres, ...extra });
// Jede Zeile einzeln ausführen: ein fehlerhaftes Element darf die anderen nicht mitreißen
const pgEach = (wf, name, query, params, extra = {}) => {
  const n = pg(wf, name, query, params, extra);
  wf.nodes.find((x) => x.name === n).parameters.options.queryBatching = 'independently';
  return n;
};
const notfall = (wf, name, wait = false, extra = {}) => wf.add(name, 'n8n-nodes-base.executeWorkflow', 1.2, {
  source: 'database', workflowId: { __rl: true, value: IDS.emergency, mode: 'id' }, options: { waitForSubWorkflow: wait },
}, extra);
// Datei für den Zwischenspeicher aus dem Base64-Inhalt bauen
const spoolBinaryJs = (srcNode) => `
const src = $('${srcNode}').item.json;
return { json: { ...src, db_error: $json.error || null }, binary: { data: { data: src.content_b64, mimeType: src.mime_type, fileName: src.filename } } };`;

const ifNode = (wf, name, leftExpr, op = 'true', extra = {}) => wf.add(name, 'n8n-nodes-base.if', 2.2, {
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
    conditions: [{
      id: `${name}-c1`, leftValue: `={{ ${leftExpr} }}`, rightValue: '',
      operator: op === 'true' ? { type: 'boolean', operation: 'true', singleValue: true } : op,
    }],
    combinator: 'and',
  },
  options: {},
}, extra);

const schedule = (wf, name, rule) => wf.add(name, 'n8n-nodes-base.scheduleTrigger', 1.2, { rule: { interval: [rule] } });

const claudeHttp = (wf, name, extra = {}) => wf.add(name, 'n8n-nodes-base.httpRequest', 4.2, {
  method: 'POST',
  url: "={{ $('Einstellungen laden').first().json.s.anthropic_url || '" + ANTHROPIC_URL + "' }}",
  authentication: 'genericCredentialType',
  genericAuthType: 'httpHeaderAuth',
  sendHeaders: true,
  specifyHeaders: 'json',
  jsonHeaders: '={{ JSON.stringify($json.req.headers) }}',
  sendBody: true,
  specifyBody: 'json',
  jsonBody: '={{ JSON.stringify($json.req.body) }}',
  options: { timeout: 180000, response: { response: { fullResponse: true, neverError: true, responseFormat: 'json' } } },
}, { credentials: CRED.anthropic, retryOnFail: true, maxTries: 2, waitBetweenTries: 5000, onError: 'continueErrorOutput', ...extra });

const SETTINGS_SQL = 'select jsonb_object_agg(key, value) as s from docflow.settings';

// --------------------------------------------------------------------------
// 01 Eingang E-Mail
// --------------------------------------------------------------------------
function emailIntake() {
  const wf = new Wf(IDS.emailIntake, 'DF 01 Eingang E-Mail');
  // Mails werden NICHT als gelesen markiert und auch dann geholt, wenn jemand sie in Outlook schon geöffnet hat.
  // n8n merkt sich die zuletzt verarbeitete Nachricht (trackLastMessageId).
  const t = wf.add('Postfach überwachen', 'n8n-nodes-base.emailReadImap', 2, {
    mailbox: 'INBOX', postProcessAction: 'nothing', downloadAttachments: true, format: 'resolved',
    dataPropertyAttachmentsPrefixName: 'attachment_', options: { customEmailConfig: '["UNDELETED"]', trackLastMessageId: true },
  }, { credentials: CRED.imap });

  const split = wf.add('E-Mail zerlegen', 'n8n-nodes-base.code', 2, code(withLibs(['intake', 'claude'], `
// Mandant dieses Postfachs. Für weitere Gesellschaften den Workflow kopieren und hier ändern.
const MANDANT = 'default';
const SPOOL_DIR = '${SPOOL_DIR}';
const out = [];
const items = $input.all();
for (let i = 0; i < items.length; i++) {
  const item = items[i];
  const mail = item.json;
  const ref = { quelle: 'email', von: mail.from && (mail.from.text || mail.from.value?.[0]?.address), betreff: mail.subject,
                message_id: mail.messageId, datum: mail.date, ausgelassen: [] };
  const docs = [];
  for (const key of Object.keys(item.binary || {})) {
    const b = item.binary[key];
    const buf = await this.helpers.getBinaryDataBuffer(i, key);
    const filename = safeName(b.fileName || key);
    const mime = normalizeMime(b.mimeType, filename);
    // Alles übernehmen; nicht unterstützte Typen landen später mit Begründung beim Menschen.
    // Nur kleine Bilder (Signatur-Logos) werden ausgelassen und vermerkt.
    if (!keepEmailAttachment(mime, buf.length)) { ref.ausgelassen.push(filename); continue; }
    docs.push({ filename, mime, b64: buf.toString('base64') });
  }
  // Ohne Anhang ist die E-Mail selbst das Dokument (z. B. eine Anfrage)
  if (docs.length === 0) {
    const text = [\`Von: \${ref.von || ''}\`, \`Betreff: \${mail.subject || ''}\`, \`Datum: \${mail.date || ''}\`, '', mail.text || mail.textAsHtml || mail.html || ''].join('\\n');
    docs.push({ filename: safeName(\`email-\${(mail.subject || 'ohne-betreff').slice(0, 60)}.txt\`), mime: 'text/plain', b64: Buffer.from(text, 'utf8').toString('base64') });
  }
  for (const d of docs) {
    out.push({ json: { mandant: MANDANT, filename: d.filename, mime_type: d.mime, content_b64: d.b64, source: 'email', source_ref: ref,
                       spool: spoolPath(SPOOL_DIR, MANDANT, d.filename) }, pairedItem: { item: i } });
  }
}
return out;`), 'runOnceForAllItems'));

  const db = pgEach(wf, 'In Warteschlange stellen',
    'select * from docflow.enqueue_document($1, $2, $3, $4, $5, $6::jsonb)',
    "[$json.mandant, $json.filename, $json.mime_type, $json.content_b64, $json.source, JSON.stringify($json.source_ref)]",
    { onError: 'continueRegularOutput' });
  const failed = ifNode(wf, 'Speichern fehlgeschlagen?', '!$json.job_id');
  // Ersatzweg: Datenbank nicht erreichbar → Datei in den Zwischenspeicher, DF 07 holt sie nach
  const bin = wf.add('Für Zwischenspeicher vorbereiten', 'n8n-nodes-base.code', 2, code(spoolBinaryJs('E-Mail zerlegen')));
  const spool = wf.add('Zwischenspeicher schreiben', 'n8n-nodes-base.readWriteFile', 1, {
    operation: 'write', fileName: '={{ $json.spool.path }}', dataPropertyName: 'data', options: {},
  }, { onError: 'continueRegularOutput' });
  const alarm = wf.add('Alarm bauen', 'n8n-nodes-base.code', 2, code(`
const src = $('Für Zwischenspeicher vorbereiten').item.json;
const spooled = !$json.error;
return { json: { severity: spooled ? 'warnung' : 'kritisch',
  message: spooled
    ? \`Datenbank nicht erreichbar. E-Mail-Anhang "\${src.filename}" liegt im Zwischenspeicher und wird automatisch nachgeholt.\`
    : \`Datenbank UND Zwischenspeicher nicht erreichbar. E-Mail "\${src.source_ref.betreff}" von \${src.source_ref.von} (Message-ID \${src.source_ref.message_id}) muss manuell nachgereicht werden.\`,
  details: { db_fehler: src.db_error, spool_fehler: $json.error || null, datei: src.filename } } };`));
  const notify = notfall(wf, 'Notfall-Alarm');
  wf.chain(t, split, db, failed);
  wf.link(failed, bin, 0);
  wf.chain(bin, spool, alarm, notify);
  return wf.json();
}

// --------------------------------------------------------------------------
// 02 Eingang HTTP (Scanner, ERP, Portal)
// --------------------------------------------------------------------------
function webhookIntake() {
  const wf = new Wf(IDS.webhookIntake, 'DF 02 Eingang HTTP');
  const hook = wf.add('Datei empfangen', 'n8n-nodes-base.webhook', 2, {
    httpMethod: 'POST', path: 'dokument-eingang', authentication: 'headerAuth', responseMode: 'responseNode', options: { rawBody: false },
  }, { credentials: CRED.api, webhookId: 'df-dokument-eingang' });

  const accept = wf.add('Datei annehmen', 'n8n-nodes-base.code', 2, code(withLibs(['intake', 'claude'], `
const SPOOL_DIR = '${SPOOL_DIR}';
const item = $input.first();
const keys = Object.keys(item.binary || {});
const h = item.json.headers || {};
const mandant = safeMandant(h['x-mandant'] || (item.json.query || {}).mandant);
if (keys.length !== 1) {
  return [{ json: { reject: true, http_status: 400, body: { ok: false, fehler: 'Bitte genau eine Datei pro Anfrage senden (multipart/form-data).' } } }];
}
const b = item.binary[keys[0]];
const filename = safeName(b.fileName || 'upload');
const mime = normalizeMime(b.mimeType, filename);
if (!isAllowed(mime)) {
  return [{ json: { reject: true, http_status: 415, body: { ok: false, fehler: \`Dateityp \${mime} wird nicht unterstützt.\`, erlaubt: ALLOWED } } }];
}
const buf = await this.helpers.getBinaryDataBuffer(0, keys[0]);
return [{ json: { reject: false, mandant, filename, mime_type: mime, content_b64: buf.toString('base64'), source: 'webhook',
                  source_ref: { quelle: 'http', referenz: h['x-referenz'] || null, absender_ip: h['x-forwarded-for'] || null },
                  priority: Number(h['x-prioritaet']) || 100, spool: spoolPath(SPOOL_DIR, mandant, filename) } }];`), 'runOnceForAllItems'));

  const rejected = ifNode(wf, 'Abgelehnt?', '$json.reject');
  const db = pg(wf, 'In Warteschlange stellen',
    'select * from docflow.enqueue_document($1, $2, $3, $4, $5, $6::jsonb, null, $7)',
    "[$json.mandant, $json.filename, $json.mime_type, $json.content_b64, $json.source, JSON.stringify($json.source_ref), $json.priority]",
    { onError: 'continueRegularOutput' });
  const stored = ifNode(wf, 'Gespeichert?', '!!$json.job_id');
  const okAnswer = wf.add('Antwort gespeichert', 'n8n-nodes-base.code', 2, code(`
return { json: { http_status: $json.is_duplicate ? 200 : 202, body: { ok: true, job_id: $json.job_id, duplikat: $json.is_duplicate, status: $json.status } } };`));
  const bin = wf.add('Für Zwischenspeicher vorbereiten', 'n8n-nodes-base.code', 2, code(spoolBinaryJs('Datei annehmen')));
  const spool = wf.add('Zwischenspeicher schreiben', 'n8n-nodes-base.readWriteFile', 1, {
    operation: 'write', fileName: '={{ $json.spool.path }}', dataPropertyName: 'data', options: {},
  }, { onError: 'continueRegularOutput' });
  const spoolAnswer = wf.add('Antwort Ersatzweg', 'n8n-nodes-base.code', 2, code(`
const src = $('Für Zwischenspeicher vorbereiten').item.json;
const spooled = !$json.error;
return { json: spooled
  ? { http_status: 202, body: { ok: true, job_id: null, status: 'zwischengespeichert', hinweis: 'Datei ist sicher gespeichert und wird automatisch verarbeitet.' },
      severity: 'warnung', message: \`Datenbank nicht erreichbar. Upload "\${src.filename}" liegt im Zwischenspeicher und wird automatisch nachgeholt.\` }
  : { http_status: 503, body: { ok: false, fehler: 'Speicherung derzeit nicht möglich. Bitte später erneut senden.' },
      severity: 'kritisch', message: \`Datenbank UND Zwischenspeicher nicht erreichbar. Upload "\${src.filename}" wurde mit 503 abgelehnt.\` },
  details: { db_fehler: src.db_error, spool_fehler: $json.error || null } };`));
  const respond = wf.add('Antworten', 'n8n-nodes-base.respondToWebhook', 1.1, {
    respondWith: 'json', responseBody: '={{ JSON.stringify($json.body) }}', options: { responseCode: '={{ $json.http_status }}' },
  });
  const notify = notfall(wf, 'Notfall-Alarm');
  wf.chain(hook, accept, rejected);
  wf.link(rejected, respond, 0);
  wf.link(rejected, db, 1);
  wf.link(db, stored);
  wf.link(stored, okAnswer, 0);
  wf.link(stored, bin, 1);
  wf.link(okAnswer, respond);
  wf.chain(bin, spool, spoolAnswer, respond);
  wf.link(spoolAnswer, notify);
  return wf.json();
}

// --------------------------------------------------------------------------
// 03 Verarbeitung (KI-Agenten)
// --------------------------------------------------------------------------
function worker() {
  const wf = new Wf(IDS.worker, 'DF 03 Verarbeitung');
  const t = schedule(wf, 'Alle 30 Sekunden', { field: 'seconds', secondsInterval: 30 });
  const s = pg(wf, 'Einstellungen laden', SETTINGS_SQL);
  // Aufträge einzeln holen: Die Sperre muss nur ein Dokument abdecken, nicht einen ganzen Stapel.
  const slots = wf.add('Plätze anlegen', 'n8n-nodes-base.code', 2, code(`
const n = Math.max(1, Number($('Einstellungen laden').first().json.s.claim_batch_size) || 10);
return Array.from({ length: n }, (_, i) => ({ json: { platz: i + 1 } }));`, 'runOnceForAllItems'));
  const loop = wf.add('Für jeden Platz', 'n8n-nodes-base.splitInBatches', 3, { batchSize: 1, options: {} });
  const claim = pg(wf, 'Auftrag holen', 'select * from docflow.claim_jobs($1, 1)', '[$execution.id]');

  const settingsJs = `const S = $('Einstellungen laden').first().json.s;`;
  const AI = ['schema', 'claude'];

  const prep = wf.add('Extraktion vorbereiten', 'n8n-nodes-base.code', 2, code(withLibs(AI, `
${settingsJs}
const job = $json;
const ctx = { job, worker: $execution.id, calls: [], models: [], route: 'call' };
const r = buildExtractionRequest(job, S.model_primary, { extractionSchema: EXTRACTION_SCHEMA, effort: 'medium' });
if (r.error) { ctx.route = 'fail'; ctx.failure = { class: r.errorClass, message: r.error }; }
else ctx.req = r;
return { json: ctx };`)));

  const canCall = ifNode(wf, 'Anfrage möglich?', "$json.route === 'call'");
  const h1 = claudeHttp(wf, 'Claude Extraktion (Hauptmodell)');

  const evalJs = (prevNode, role, model, nextBuilder) => `
${settingsJs}
const ctx = { ...$('${prevNode}').first().json };
const res = $json;
let r;
if (res.statusCode === undefined) {
  r = { ok: false, errorClass: classifyNetworkError(res.error || res), error: 'Netzwerkfehler: ' + JSON.stringify(res.error || res).slice(0, 300) };
} else {
  r = parseClaudeResponse(res);
}
ctx.calls = [...(ctx.calls || []), { role: '${role}', model: ${model}, ok: r.ok, http_status: r.status || null, error: r.ok ? null : r.error,
                                     input: r.usage ? r.usage.input : null, output: r.usage ? r.usage.output : null }];
delete ctx.req;
${nextBuilder}
return { json: ctx };`;

  const e1 = wf.add('Hauptmodell auswerten', 'n8n-nodes-base.code', 2, code(withLibs(AI, evalJs('Extraktion vorbereiten', 'extraktion', 'S.model_primary', `
if (r.ok) { ctx.extraction = r.data; ctx.models.push(r.model || S.model_primary); ctx.route = 'ok'; }
else if (r.errorClass === 'transient' || (r.errorClass === 'permanent' && r.status === 400)) {
  // Ersatz: zweites Modell, ohne Zusatzfunktionen, die eine 400 ausgelöst haben könnten
  const alt = buildExtractionRequest(ctx.job, S.model_secondary, { extractionSchema: EXTRACTION_SCHEMA, effort: 'medium', useFallback: r.status !== 400 });
  ctx.req = alt; ctx.route = 'secondary'; ctx.primaryError = r;
} else { ctx.route = 'fail'; ctx.failure = { class: r.errorClass, message: r.error }; }`))));

  const ok1 = ifNode(wf, 'Hauptmodell erfolgreich?', "$json.route === 'ok'");
  const try2 = ifNode(wf, 'Ersatzmodell versuchen?', "$json.route === 'secondary'");
  const h2 = claudeHttp(wf, 'Claude Extraktion (Ersatzmodell)');
  const e2 = wf.add('Ersatzmodell auswerten', 'n8n-nodes-base.code', 2, code(withLibs(AI, evalJs('Hauptmodell auswerten', 'extraktion', 'S.model_secondary', `
if (r.ok) { ctx.extraction = r.data; ctx.models.push(r.model || S.model_secondary); ctx.route = 'ok'; }
else {
  // Beide Modelle ausgefallen: vorübergehend → später erneut, sonst an den Menschen
  const cls = [ctx.primaryError.errorClass, r.errorClass].includes('transient') ? 'transient' : r.errorClass;
  ctx.route = 'fail'; ctx.failure = { class: cls, message: \`Hauptmodell: \${ctx.primaryError.error} | Ersatzmodell: \${r.error}\` };
}`))));
  const ok2 = ifNode(wf, 'Ersatzmodell erfolgreich?', "$json.route === 'ok'");

  const take = wf.add('Extraktion übernehmen', 'n8n-nodes-base.code', 2, code('return { json: $json };'));
  const dups = pg(wf, 'Dubletten und Bankverbindung prüfen',
    'select docflow.find_duplicates($1::uuid, $2, $3::jsonb) as dups, docflow.iban_status($1::uuid, $2, $3::jsonb) as iban',
    '[$json.job.job_id, $json.job.mandant, JSON.stringify($json.extraction)]');

  const check = wf.add('Prüfregeln anwenden', 'n8n-nodes-base.code', 2, code(withLibs([...AI, 'validate', 'decide'], `
${settingsJs}
const ctx = { ...$('Extraktion übernehmen').first().json };
ctx.duplicates = $json.dups || [];
ctx.ibanStatus = $json.iban;
ctx.validation = validateExtraction(ctx.extraction);
const settings = { confidence_auto: Number(S.confidence_auto), verify_above_gross: Number(S.verify_above_gross),
                   review_above_gross: Number(S.review_above_gross), always_verify_types: S.always_verify_types || [] };
ctx.settings = settings;
const need = needsVerification({ extraction: ctx.extraction, validation: ctx.validation, settings });
ctx.verificationRequired = need.required;
ctx.verificationReasons = need.reasons;
if (need.required) {
  const r = buildVerificationRequest(ctx.job, ctx.extraction, S.model_primary, { verificationSchema: VERIFICATION_SCHEMA, effort: 'high' });
  if (r.error) { ctx.verification = { ok: false, error: r.error }; ctx.route = 'decide'; }
  else { ctx.req = r; ctx.route = 'verify'; }
} else ctx.route = 'decide';
return { json: ctx };`)));

  const needV = ifNode(wf, 'Prüf-Agent nötig?', "$json.route === 'verify'");
  const h3 = claudeHttp(wf, 'Claude Prüf-Agent (Hauptmodell)');
  const v1 = wf.add('Prüf-Agent auswerten', 'n8n-nodes-base.code', 2, code(withLibs(AI, evalJs('Prüfregeln anwenden', 'pruefung', 'S.model_primary', `
if (r.ok) { ctx.verification = { ok: true, data: r.data, model: r.model || S.model_primary }; ctx.models.push(r.model || S.model_primary); ctx.route = 'decide'; }
else if (r.errorClass === 'transient' || (r.errorClass === 'permanent' && r.status === 400)) {
  ctx.req = buildVerificationRequest(ctx.job, ctx.extraction, S.model_secondary, { verificationSchema: VERIFICATION_SCHEMA, effort: 'high', useFallback: r.status !== 400 });
  ctx.route = 'secondary'; ctx.verifyError = r;
} else { ctx.verification = { ok: false, error: r.error }; ctx.route = 'decide'; }`))));
  const try4 = ifNode(wf, 'Ersatz-Prüfer versuchen?', "$json.route === 'secondary'");
  const h4 = claudeHttp(wf, 'Claude Prüf-Agent (Ersatzmodell)');
  const v2 = wf.add('Ersatz-Prüfer auswerten', 'n8n-nodes-base.code', 2, code(withLibs(AI, evalJs('Prüf-Agent auswerten', 'pruefung', 'S.model_secondary', `
if (r.ok) { ctx.verification = { ok: true, data: r.data, model: r.model || S.model_secondary }; ctx.models.push(r.model || S.model_secondary); }
else ctx.verification = { ok: false, error: \`\${ctx.verifyError.error} | Ersatz: \${r.error}\` };
ctx.route = 'decide';`))));

  const decideNode = wf.add('Entscheiden', 'n8n-nodes-base.code', 2, code(withLibs(['validate', 'decide'], `
const ctx = { ...$json };
const d = decide({ extraction: ctx.extraction, validation: ctx.validation, verification: ctx.verification,
                   verificationRequired: ctx.verificationRequired, duplicates: ctx.duplicates, ibanStatus: ctx.ibanStatus, settings: ctx.settings,
                   revalidate: (x) => validateExtraction(x) });
const usage = (ctx.calls || []).reduce((a, c) => ({ input: a.input + (c.input || 0), output: a.output + (c.output || 0) }), { input: 0, output: 0 });
return { json: { job_id: ctx.job.job_id, worker: ctx.worker, outcome: d.outcome, reasons: d.reasons, final: d.final,
  extraction: ctx.extraction, verification: ctx.verification || null,
  validation: { ...ctx.validation, pruef_agent_gruende: ctx.verificationReasons, duplikate: ctx.duplicates, iban_status: ctx.ibanStatus },
  models: [...new Set(ctx.models)], usage, calls: ctx.calls } };`)));

  const save = pg(wf, 'Ergebnis speichern',
    `select docflow.complete_job($1::uuid, $2, $3, $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb,
  array(select jsonb_array_elements_text($8::jsonb)), array(select jsonb_array_elements_text($9::jsonb)), $10::jsonb, $11::jsonb) as r`,
    "[$json.job_id, $json.worker, $json.outcome, JSON.stringify($json.extraction), JSON.stringify($json.verification), JSON.stringify($json.validation), JSON.stringify($json.final), JSON.stringify($json.reasons), JSON.stringify($json.models), JSON.stringify($json.usage), JSON.stringify($json.calls)]");

  const failPrep = wf.add('Fehler vorbereiten', 'n8n-nodes-base.code', 2, code(`
const ctx = $json;
return { json: { job_id: ctx.job.job_id, worker: ctx.worker, class: ctx.failure.class, message: ctx.failure.message, calls: ctx.calls || [] } };`));
  const fail = pg(wf, 'Fehler verbuchen',
    'select docflow.fail_job($1::uuid, $2, $3, $4, $5::jsonb) as r',
    '[$json.job_id, $json.worker, $json.class, $json.message, JSON.stringify($json.calls)]');
  const next = wf.add('Nächster Auftrag', 'n8n-nodes-base.noOp', 1, {});

  wf.chain(t, s, slots, loop);
  wf.link(loop, claim, 1);
  wf.link(claim, prep);
  wf.link(prep, canCall);
  wf.link(canCall, h1, 0); wf.link(canCall, failPrep, 1);
  wf.link(h1, e1, 0); wf.link(h1, e1, 1);
  wf.link(e1, ok1);
  wf.link(ok1, take, 0); wf.link(ok1, try2, 1);
  wf.link(try2, h2, 0); wf.link(try2, failPrep, 1);
  wf.link(h2, e2, 0); wf.link(h2, e2, 1);
  wf.link(e2, ok2);
  wf.link(ok2, take, 0); wf.link(ok2, failPrep, 1);
  wf.chain(take, dups, check, needV);
  wf.link(needV, h3, 0); wf.link(needV, decideNode, 1);
  wf.link(h3, v1, 0); wf.link(h3, v1, 1);
  wf.link(v1, try4);
  wf.link(try4, h4, 0); wf.link(try4, decideNode, 1);
  wf.link(h4, v2, 0); wf.link(h4, v2, 1);
  wf.link(v2, decideNode);
  wf.chain(decideNode, save, next);
  wf.chain(failPrep, fail, next);
  wf.link(next, loop);
  return wf.json();
}

// --------------------------------------------------------------------------
// 04 Export ans ERP (Postausgang mit Datei als Ersatzweg)
// --------------------------------------------------------------------------
function exporter() {
  const wf = new Wf(IDS.exporter, 'DF 04 Export ERP');
  const t = schedule(wf, 'Jede Minute', { field: 'minutes', minutesInterval: 1 });
  const s = pg(wf, 'Einstellungen laden', SETTINGS_SQL);
  const slots = wf.add('Plätze anlegen', 'n8n-nodes-base.code', 2, code(`
return Array.from({ length: 20 }, (_, i) => ({ json: { platz: i + 1 } }));`, 'runOnceForAllItems'));
  const loop = wf.add('Für jeden Platz', 'n8n-nodes-base.splitInBatches', 3, { batchSize: 1, options: {} });
  const claim = pg(wf, 'Export holen', 'select * from docflow.claim_exports($1, 1)', '[$execution.id]');
  const prep = wf.add('Export vorbereiten', 'n8n-nodes-base.code', 2, code(`
const S = $('Einstellungen laden').first().json.s;
const e = $json;
const erp = (S.erp_url || '').trim();
const mode = S.export_mode || 'both';
const httpNeeded = erp !== '' && (mode === 'http' || mode === 'both');
return { json: { ...e, erp_url: erp, mode, export_dir: S.export_dir || '/data/export',
  do_http: httpNeeded && !e.http_done, http_ok: null, http_error: null } };`));
  const doHttp = ifNode(wf, 'An ERP senden?', '$json.do_http');
  const h = wf.add('An ERP senden', 'n8n-nodes-base.httpRequest', 4.2, {
    method: 'POST', url: '={{ $json.erp_url }}', sendHeaders: true,
    headerParameters: { parameters: [
      { name: 'Idempotency-Key', value: '={{ $json.job_id }}' },
      { name: 'X-Mandant', value: '={{ $json.mandant }}' },
    ] },
    sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify($json.payload) }}',
    options: { timeout: 60000, response: { response: { fullResponse: true, neverError: true, responseFormat: 'text' } } },
  }, { retryOnFail: true, maxTries: 3, waitBetweenTries: 5000, onError: 'continueErrorOutput' });
  const hEval = wf.add('ERP-Antwort auswerten', 'n8n-nodes-base.code', 2, code(`
const ctx = { ...$('Export vorbereiten').first().json };
const code = $json.statusCode;
ctx.http_ok = code >= 200 && code < 300;
ctx.http_error = ctx.http_ok ? null : (code ? \`ERP antwortet HTTP \${code}: \${String($json.body || '').slice(0, 300)}\` : 'ERP nicht erreichbar: ' + JSON.stringify($json.error || $json).slice(0, 300));
return { json: ctx };`));
  const fileCheck = wf.add('Datei-Export nötig?', 'n8n-nodes-base.code', 2, code(`
const ctx = { ...$json };
const fileMode = ctx.mode === 'file' || ctx.mode === 'both' || !ctx.erp_url;
// Ersatzweg: Ist das ERP ab dem 3. Versuch nicht erreichbar, wird zusätzlich eine Datei abgelegt
const fallback = ctx.do_http && !ctx.http_ok && ctx.attempts >= 3;
ctx.do_file = !ctx.file_done && (fileMode || fallback);
ctx.file_fallback = fallback && !fileMode;
return { json: ctx };`));
  const doFile = ifNode(wf, 'Datei schreiben?', '$json.do_file');
  const bin = wf.add('Datei-Export vorbereiten', 'n8n-nodes-base.code', 2, code(`
const ctx = $json;
const name = \`\${ctx.job_id}.json\`;
const data = Buffer.from(JSON.stringify(ctx.payload, null, 2), 'utf8').toString('base64');
// Fester Dateiname: Eine Wiederholung überschreibt die Datei, statt eine zweite anzulegen
return { json: { ...ctx, file_path: \`\${ctx.export_dir}/\${ctx.mandant}__\${name}\` },
         binary: { data: { data, mimeType: 'application/json', fileName: name } } };`));
  const write = wf.add('Datei schreiben', 'n8n-nodes-base.readWriteFile', 1, {
    operation: 'write', fileName: '={{ $json.file_path }}', dataPropertyName: 'data', options: {},
  }, { onError: 'continueRegularOutput' });
  const sum = wf.add('Ergebnis zusammenfassen', 'n8n-nodes-base.code', 2, code(`
let ctx = $json;
let fileOk = null;
if (ctx.export_id === undefined) {
  // Schreibfehler: Kontext aus dem vorherigen Schritt holen
  ctx = { ...$('Datei-Export vorbereiten').first().json };
  fileOk = false;
  ctx.file_error = $json.error;
} else if (ctx.file_path) {
  fileOk = true;
}
const errors = [ctx.http_error, ctx.file_error].filter(Boolean).join(' | ');
return { json: { export_id: ctx.export_id, http_ok: ctx.do_http ? ctx.http_ok : null, file_ok: fileOk, error: errors || null } };`));
  const save = pg(wf, 'Ergebnis verbuchen', 'select docflow.export_result($1::uuid, $2, $3::boolean, $4::boolean, $5) as r',
    '[$json.export_id, $execution.id, $json.http_ok, $json.file_ok, $json.error]');
  const next = wf.add('Nächster Export', 'n8n-nodes-base.noOp', 1, {});
  wf.chain(t, s, slots, loop);
  wf.link(loop, claim, 1);
  wf.link(claim, prep);
  wf.link(prep, doHttp);
  wf.link(doHttp, h, 0); wf.link(doHttp, fileCheck, 1);
  wf.link(h, hEval, 0); wf.link(h, hEval, 1);
  wf.link(hEval, fileCheck);
  wf.link(fileCheck, doFile);
  wf.link(doFile, bin, 0); wf.link(doFile, sum, 1);
  wf.chain(bin, write, sum, save, next);
  wf.link(next, loop);
  return wf.json();
}

// --------------------------------------------------------------------------
// 05 Wachhund und Tagesbericht
// --------------------------------------------------------------------------
function watchdog() {
  const wf = new Wf(IDS.watchdog, 'DF 05 Wachhund');
  const t = schedule(wf, 'Alle 5 Minuten', { field: 'minutes', minutesInterval: 5 });
  const w = pg(wf, 'Zustand prüfen', 'select docflow.watchdog() as w');
  const evalNode = wf.add('Auffälligkeiten bewerten', 'n8n-nodes-base.code', 2, code(`
const w = $input.first().json.w;
const a = [];
if (w.aeltester_wartend_min > w.grenze_wartezeit_min)
  a.push(['kritisch', 'queue_stale', \`Warteschlange staut sich: ältestes Dokument wartet seit \${w.aeltester_wartend_min} Minuten (\${w.warteschlange} wartend).\`]);
if (w.haengende_zurueckgeholt > 0)
  a.push(['warnung', 'stuck_jobs', \`\${w.haengende_zurueckgeholt} hängende Verarbeitung(en) wurden automatisch neu eingeplant.\`]);
if (w.export_fehlgeschlagen > 0)
  a.push(['kritisch', 'exports_failed', \`\${w.export_fehlgeschlagen} Export(e) endgültig fehlgeschlagen. Daten liegen in docflow.exports bereit.\`]);
if (w.schutzschalter_offen)
  a.push(['kritisch', 'circuit_open_watch', 'Schutzschalter offen: KI-Dienst gestört, Verarbeitung pausiert automatisch.']);
if (w.ki_fehlerquote_15min >= 0.3 && !w.schutzschalter_offen)
  a.push(['warnung', 'llm_errors', \`Erhöhte KI-Fehlerquote: \${Math.round(w.ki_fehlerquote_15min * 100)} % in 15 Minuten.\`]);
if (w.neu_zur_pruefung_5min > 0)
  a.push(['info', 'review_new', \`\${w.neu_zur_pruefung_5min} neue(s) Dokument(e) zur Prüfung, insgesamt \${w.zur_pruefung} offen.\`]);
return a.map(([severity, key, message]) => ({ json: { severity, key, message, details: w } }));`, 'runOnceForAllItems'));
  const raise = pg(wf, 'Alarm anlegen', 'select docflow.raise_alert($1, $2, $3, $4::jsonb) as r',
    '[$json.severity, $json.key, $json.message, JSON.stringify($json.details)]');
  const hb = ifNode(wf, 'Totmann-Schalter konfiguriert?', "!!$('Zustand prüfen').first().json.w.heartbeat_url", 'true', { position: [480, 220] });
  const ping = wf.add('Lebenszeichen senden', 'n8n-nodes-base.httpRequest', 4.2, {
    method: 'GET', url: "={{ $('Zustand prüfen').first().json.w.heartbeat_url }}", options: { timeout: 15000 },
  }, { retryOnFail: true, maxTries: 3, waitBetweenTries: 3000, onError: 'continueRegularOutput', position: [720, 220] });
  wf.chain(t, w, evalNode, raise);
  wf.link(w, hb);
  wf.link(hb, ping, 0);

  // Tagesbericht
  const t2 = wf.add('Täglich 6:55', 'n8n-nodes-base.scheduleTrigger', 1.2, { rule: { interval: [{ field: 'cronExpression', expression: '55 6 * * *' }] } }, { position: [0, 480] });
  const st = pg(wf, 'Kennzahlen laden', `select m.mandant, docflow.stats(case when m.mandant = 'alle' then null else m.mandant end, 1) as s,
  docflow.setting_text('alert_email_to') as an, docflow.setting_text('alert_email_from') as von
from (select distinct mandant from docflow.jobs union all select 'alle') m`, null, { position: [240, 480] });
  const fmt = wf.add('Bericht formatieren', 'n8n-nodes-base.code', 2, code(`
const rows = $input.all().map((i) => i.json);
const an = rows[0] ? rows[0].an : '';
const von = rows[0] ? rows[0].von : '';
const cells = (s) => [s.empfangen, s.automatisch, s.manuell_freigegeben, s.zur_pruefung, s.abgelehnt, (s.automatisierungsquote ?? '–') + ' %', s.ki_ausfaelle];
const head = ['Mandant', 'Empfangen', 'Automatisch', 'Manuell freigegeben', 'Offen zur Prüfung', 'Abgelehnt', 'Automatisierung', 'KI-Ausfälle'];
const html = '<h2>Dokumentenverarbeitung: Tagesbericht</h2><table border="1" cellpadding="6" style="border-collapse:collapse">'
  + '<tr>' + head.map((h) => '<th>' + h + '</th>').join('') + '</tr>'
  + rows.map((r) => '<tr><td>' + r.mandant + '</td>' + cells(r.s).map((c) => '<td>' + c + '</td>').join('') + '</tr>').join('')
  + '</table><p>Zeitraum: letzte 24 Stunden.</p>';
return [{ json: { an, von, html, send: !!an } }];`, 'runOnceForAllItems'), { position: [480, 480] });
  const canSend = ifNode(wf, 'Empfänger hinterlegt?', '$json.send', 'true', { position: [720, 480] });
  const mail = wf.add('Bericht senden', 'n8n-nodes-base.emailSend', 2.1, {
    fromEmail: '={{ $json.von }}', toEmail: '={{ $json.an }}', subject: 'Dokumentenverarbeitung: Tagesbericht',
    emailFormat: 'html', html: '={{ $json.html }}', options: {},
  }, { credentials: CRED.smtp, onError: 'continueRegularOutput', retryOnFail: true, maxTries: 3, waitBetweenTries: 5000, position: [960, 480] });
  wf.chain(t2, st, fmt, canSend);
  wf.link(canSend, mail, 0);
  return wf.json();
}

// --------------------------------------------------------------------------
// 06 Alarm-Versand: Teams/Slack → E-Mail → Datei
// --------------------------------------------------------------------------
function alerts() {
  const wf = new Wf(IDS.alerts, 'DF 06 Alarm-Versand');
  const t = schedule(wf, 'Jede Minute', { field: 'minutes', minutesInterval: 1 });
  const load = pg(wf, 'Alarme laden', `select a.*, docflow.setting_text('alert_webhook_url') as webhook,
  docflow.setting_text('alert_email_to') as email_to, docflow.setting_text('alert_email_from') as email_from
from docflow.pending_alerts(50) a`);
  const prep = wf.add('Nachricht bauen', 'n8n-nodes-base.code', 2, code(`
const icon = { kritisch: '🔴', warnung: '🟠', info: '🔵' }[$json.severity] || '';
const text = \`\${icon} [\${$json.severity.toUpperCase()}] Dokumentenverarbeitung: \${$json.message}\`;
return { json: { ...$json, text, has_webhook: !!($json.webhook || '').trim(), has_email: !!($json.email_to || '').trim() } };`));
  const viaHook = ifNode(wf, 'Webhook hinterlegt?', '$json.has_webhook');
  const hook = wf.add('An Teams/Slack senden', 'n8n-nodes-base.httpRequest', 4.2, {
    method: 'POST', url: '={{ $json.webhook }}', sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify({ text: $json.text }) }}', options: { timeout: 15000 },
  }, { retryOnFail: true, maxTries: 3, waitBetweenTries: 3000, onError: 'continueErrorOutput' });
  const markHook = pg(wf, 'Zugestellt: Webhook', "select docflow.mark_alert_delivered($1, 'webhook')", "[$('Nachricht bauen').item.json.alert_id]");
  const back = wf.add('Kontext zurückholen', 'n8n-nodes-base.code', 2, code("return { json: $('Nachricht bauen').item.json };"));
  const viaMail = ifNode(wf, 'E-Mail hinterlegt?', '$json.has_email');
  const mail = wf.add('Per E-Mail senden', 'n8n-nodes-base.emailSend', 2.1, {
    fromEmail: '={{ $json.email_from }}', toEmail: '={{ $json.email_to }}', subject: '={{ $json.text.slice(0, 150) }}',
    emailFormat: 'text', text: '={{ $json.text + "\\n\\nDetails:\\n" + JSON.stringify($json.details, null, 2) }}', options: {},
  }, { credentials: CRED.smtp, retryOnFail: true, maxTries: 3, waitBetweenTries: 5000, onError: 'continueErrorOutput' });
  const markMail = pg(wf, 'Zugestellt: E-Mail', "select docflow.mark_alert_delivered($1, 'email')", "[$('Nachricht bauen').item.json.alert_id]");
  const fileCtx = wf.add('Als Datei ablegen', 'n8n-nodes-base.code', 2, code(`
const a = $('Nachricht bauen').item.json;
const data = Buffer.from(JSON.stringify(a, null, 2), 'utf8').toString('base64');
return { json: a, binary: { data: { data, mimeType: 'application/json', fileName: \`alarm-\${a.alert_id}.json\` } } };`));
  const write = wf.add('Alarmdatei schreiben', 'n8n-nodes-base.readWriteFile', 1, {
    operation: 'write', fileName: `=${ALERT_DIR}/alarm-{{ new Date().toISOString().slice(0,10) }}-{{ $json.alert_id }}.json`, dataPropertyName: 'data', options: {},
  }, { onError: 'continueRegularOutput' });
  const fileOk = ifNode(wf, 'Datei geschrieben?', '!$json.error');
  const markFile = pg(wf, 'Zugestellt: Datei', "select docflow.mark_alert_delivered($1, 'datei')", "[$('Nachricht bauen').item.json.alert_id]");
  const lastResort = notfall(wf, 'Notfall-Alarm');
  wf.chain(t, load, prep, viaHook);
  wf.link(viaHook, hook, 0); wf.link(viaHook, back, 1);
  wf.link(hook, markHook, 0); wf.link(hook, back, 1);
  wf.link(back, viaMail);
  wf.link(viaMail, mail, 0); wf.link(viaMail, fileCtx, 1);
  wf.link(mail, markMail, 0); wf.link(mail, fileCtx, 1);
  wf.chain(fileCtx, write, fileOk);
  wf.link(fileOk, markFile, 0);
  wf.link(fileOk, lastResort, 1);
  return wf.json();
}

// --------------------------------------------------------------------------
// 07 Wiederherstellung aus dem Zwischenspeicher
// --------------------------------------------------------------------------
function spoolRecovery() {
  const wf = new Wf(IDS.spool, 'DF 07 Zwischenspeicher nachholen');
  const t = schedule(wf, 'Alle 5 Minuten', { field: 'minutes', minutesInterval: 5 });
  const paths = wf.add('Ordner bestimmen', 'n8n-nodes-base.code', 2, code(`
// Im Zwischenspeicher liegen nur Dateien aus Datenbank-Ausfällen; übernommene erkennt die Datenbank
return [{ json: { selector: '${SPOOL_DIR}/*' } }];`, 'runOnceForAllItems'));
  const read = wf.add('Dateien lesen', 'n8n-nodes-base.readWriteFile', 1, {
    operation: 'read', fileSelector: '={{ $json.selector }}', options: {},
  }, { onError: 'continueRegularOutput' });
  const prep = wf.add('Dateien prüfen', 'n8n-nodes-base.code', 2, code(withLibs(['intake', 'claude'], `
const out = [];
const items = $input.all();
for (let i = 0; i < items.length; i++) {
  const it = items[i];
  if (!it.binary || !it.binary.data) continue;
  const name = it.binary.data.fileName || it.json.fileName;
  const meta = parseSpoolName(name);
  if (!meta) continue;
  // Junge Dateien überspringen: der Eingangs-Workflow ist eventuell noch dabei
  if (Date.now() - meta.at.getTime() < 10 * 60 * 1000) continue;
  const buf = await this.helpers.getBinaryDataBuffer(i, 'data');
  out.push({ json: { spool_name: name, alter_min: Math.round((Date.now() - meta.at.getTime()) / 60000), mandant: meta.mandant, filename: meta.filename,
    mime_type: normalizeMime(it.binary.data.mimeType, meta.filename), content_b64: buf.toString('base64') } });
}
return out;`), 'runOnceForAllItems'));
  const imp = pgEach(wf, 'Nachholen', 'select docflow.import_spool($1, $2, $3, $4, $5) as r',
    '[$json.spool_name, $json.mandant, $json.filename, $json.mime_type, $json.content_b64]', { onError: 'continueRegularOutput' });
  const count = wf.add('Zählen', 'n8n-nodes-base.code', 2, code(`
const all = $input.all();
const n = all.filter((i) => i.json.r && i.json.r.imported).length;
// Dateien, die sich seit über einer Stunde nicht übernehmen lassen
const stuck = all.map((i, idx) => ({ i, src: $('Dateien prüfen').all()[idx] })).filter(({ i, src }) => i.json.error && src && src.json.alter_min > 60).map(({ src }) => src.json.spool_name);
const out = [];
if (n > 0) out.push({ json: { severity: 'warnung', key: 'spool_recovered', message: \`\${n} Dokument(e) aus dem Zwischenspeicher nachgeholt. Ursache war vermutlich ein kurzer Datenbankausfall.\` } });
if (stuck.length > 0) out.push({ json: { severity: 'kritisch', key: 'spool_stuck', message: \`\${stuck.length} Datei(en) im Zwischenspeicher lassen sich nicht übernehmen: \${stuck.slice(0, 5).join(', ')}\` } });
return out;`, 'runOnceForAllItems'));
  const raise = pg(wf, 'Alarm anlegen', "select docflow.raise_alert($1, $2, $3, '{}'::jsonb)", '[$json.severity, $json.key, $json.message]');
  wf.chain(t, paths, read, prep, imp, count, raise);
  return wf.json();
}

// --------------------------------------------------------------------------
// 08 API und Dashboard
// --------------------------------------------------------------------------
function api() {
  const wf = new Wf(IDS.api, 'DF 08 API und Dashboard');
  let row = 0;
  const respond = (name, pos) => wf.add(name, 'n8n-nodes-base.respondToWebhook', 1.1, {
    respondWith: 'json', responseBody: '={{ JSON.stringify($json.body) }}', options: { responseCode: '={{ $json.http_status }}' },
  }, { position: pos });
  // Webhook → SQL → Antwort. answer: JS-Ausdruck, der aus $json den Antwortkörper baut
  const endpoint = ({ method, path, cred, label, query, params, answer }) => {
    const y = row++ * 180;
    const h = wf.add(`${method} ${path}`, 'n8n-nodes-base.webhook', 2, {
      httpMethod: method, path, authentication: 'headerAuth', responseMode: 'responseNode', options: {},
    }, { credentials: cred, webhookId: `df-${path.replace(/\//g, '-')}-${method.toLowerCase()}`, position: [0, y] });
    const q = pg(wf, label, query, params, { onError: 'continueRegularOutput', position: [240, y] });
    const c = wf.add(`Antwort ${label}`, 'n8n-nodes-base.code', 2, code(`
if ($json.error) return { json: { http_status: 400, body: { ok: false, fehler: String($json.error).slice(0, 300) } } };
${answer}`), { position: [480, y] });
    const r = respond(`Antworten ${label}`, [720, y]);
    wf.chain(h, q, c, r);
  };
  const prueferExpr = "$json.headers['x-pruefer'] || $json.body.pruefer || null";
  const mandantExpr = "$json.query.mandant || null";

  endpoint({ method: 'GET', path: 'status', cred: CRED.reviewer, label: 'Kennzahlen',
    query: `select docflow.stats($1, 1) as heute, docflow.stats($1, 7) as woche, docflow.stats($1, 30) as monat,
  (select count(*) from docflow.jobs where status in ('queued','retry') and ($1::text is null or mandant = $1)) as warteschlange,
  (select count(*) from docflow.jobs where status = 'processing' and ($1::text is null or mandant = $1)) as in_arbeit,
  (select count(*) from docflow.jobs where status = 'review' and ($1::text is null or mandant = $1)) as zur_pruefung,
  (select count(*) from docflow.exports where status = 'failed' and ($1::text is null or mandant = $1)) as export_fehlgeschlagen,
  docflow.circuit_open() as schutzschalter_offen, docflow.mandanten() as mandanten, now() as zeit`,
    params: `[${mandantExpr}]`, answer: "return { json: { http_status: 200, body: { ok: true, ...$json } } };" });

  endpoint({ method: 'GET', path: 'pruefung/offen', cred: CRED.reviewer, label: 'Prüfliste',
    query: "select coalesce(jsonb_agg(to_jsonb(r)), '[]'::jsonb) as liste from docflow.review_list($1) r",
    params: `[${mandantExpr}]`, answer: "return { json: { http_status: 200, body: { ok: true, faelle: $json.liste } } };" });

  // Prüfer-Identität bevorzugt aus dem Header X-Pruefer, den ein SSO-Proxy setzt
  endpoint({ method: 'POST', path: 'pruefung/entscheidung', cred: CRED.reviewer, label: 'Entscheidung',
    query: 'select docflow.review_decide($1::uuid, $2::uuid, $3, $4::jsonb, $5) as r',
    params: `[$json.body.job_id, $json.body.token || null, $json.body.entscheidung, $json.body.daten ? JSON.stringify($json.body.daten) : null, ${prueferExpr}]`,
    answer: "return { json: { http_status: $json.r.ok ? 200 : 409, body: $json.r } };" });

  endpoint({ method: 'GET', path: 'dokumente', cred: CRED.reviewer, label: 'Dokumentenliste',
    query: 'select docflow.docs_list($1, $2, $3, $4) as liste',
    params: `[${mandantExpr}, $json.query.status || null, $json.query.suche || null, Math.min(Number($json.query.limit) || 200, 1000)]`,
    answer: "return { json: { http_status: 200, body: { ok: true, dokumente: $json.liste } } };" });

  endpoint({ method: 'GET', path: 'auftrag', cred: CRED.reviewer, label: 'Auftrag',
    query: 'select docflow.job_detail($1::uuid) as a', params: '[$json.query.job_id]',
    answer: "return { json: $json.a ? { http_status: 200, body: { ok: true, auftrag: $json.a } } : { http_status: 404, body: { ok: false, fehler: 'Auftrag nicht gefunden' } } };" });

  endpoint({ method: 'GET', path: 'exporte/fehlgeschlagen', cred: CRED.reviewer, label: 'Fehlgeschlagene Exporte',
    query: 'select docflow.failed_exports($1) as liste', params: `[${mandantExpr}]`,
    answer: "return { json: { http_status: 200, body: { ok: true, exporte: $json.liste } } };" });

  endpoint({ method: 'POST', path: 'export/erneut', cred: CRED.reviewer, label: 'Export erneut',
    query: 'select docflow.requeue_export($1::uuid, $2) as r', params: `[$json.body.job_id, ${prueferExpr} || 'dashboard']`,
    answer: "return { json: { http_status: $json.r.ok ? 200 : 409, body: $json.r } };" });

  endpoint({ method: 'GET', path: 'alarme', cred: CRED.reviewer, label: 'Alarme',
    query: 'select docflow.recent_alerts(200) as liste', params: null,
    answer: "return { json: { http_status: 200, body: { ok: true, alarme: $json.liste } } };" });

  endpoint({ method: 'GET', path: 'einstellungen', cred: CRED.reviewer, label: 'Einstellungen lesen',
    query: 'select docflow.settings_editable() as s', params: null,
    answer: "return { json: { http_status: 200, body: { ok: true, einstellungen: $json.s } } };" });

  // Ändern nur mit eigenem Admin-Schlüssel
  endpoint({ method: 'POST', path: 'einstellungen', cred: CRED.admin, label: 'Einstellung ändern',
    query: 'select docflow.settings_set($1, $2::jsonb, $3) as r',
    params: `[$json.body.schluessel, JSON.stringify($json.body.wert), ${prueferExpr} || 'admin']`,
    answer: "return { json: { http_status: $json.r.ok ? 200 : 400, body: $json.r } };" });

  // Originaldokument (Binärantwort)
  const y = row++ * 180;
  const h4 = wf.add('GET dokument', 'n8n-nodes-base.webhook', 2, {
    httpMethod: 'GET', path: 'dokument', authentication: 'headerAuth', responseMode: 'responseNode', options: {},
  }, { credentials: CRED.reviewer, webhookId: 'df-dokument', position: [0, y] });
  const doc = pg(wf, 'Dokument laden', `select d.filename, d.mime_type, translate(encode(d.content, 'base64'), E'\\n', '') as b64
from docflow.jobs j join docflow.documents d on d.id = j.document_id
where j.id = $1::uuid`, '[$json.query.job_id]', { onError: 'continueRegularOutput', alwaysOutputData: true, position: [240, y] });
  const found = ifNode(wf, 'Gefunden?', '!!$json.b64', 'true', { position: [480, y] });
  const bin = wf.add('Als Datei', 'n8n-nodes-base.code', 2, code(`
return { json: {}, binary: { data: { data: $json.b64, mimeType: $json.mime_type, fileName: $json.filename } } };`), { position: [720, y - 40] });
  const r4 = wf.add('Datei ausliefern', 'n8n-nodes-base.respondToWebhook', 1.1, { respondWith: 'binary', options: {} }, { position: [960, y - 40] });
  const nf = wf.add('Nicht gefunden', 'n8n-nodes-base.code', 2, code("return { json: { http_status: 404, body: { ok: false, fehler: 'Dokument nicht gefunden' } } };"), { position: [720, y + 60] });
  const r5 = respond('Antworten nicht gefunden', [960, y + 60]);
  wf.chain(h4, doc, found);
  wf.link(found, bin, 0); wf.link(found, nf, 1);
  wf.link(bin, r4); wf.link(nf, r5);

  // Das Dashboard selbst (enthält keine Geheimnisse; die Schlüssel gibt der Nutzer beim Anmelden ein)
  const y2 = row++ * 180;
  const hd = wf.add('GET dashboard', 'n8n-nodes-base.webhook', 2, {
    httpMethod: 'GET', path: 'dashboard', authentication: 'none', responseMode: 'responseNode', options: {},
  }, { webhookId: 'df-dashboard', position: [0, y2] });
  const rd = wf.add('Dashboard ausliefern', 'n8n-nodes-base.respondToWebhook', 1.1, {
    respondWith: 'text', responseBody: DASHBOARD_HTML,
    options: { responseHeaders: { entries: [
      { name: 'Content-Type', value: 'text/html; charset=utf-8' },
      { name: 'Cache-Control', value: 'no-store' },
      { name: 'X-Frame-Options', value: 'DENY' },
      { name: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' blob: data:; frame-src 'self' blob:; object-src blob:" },
    ] } },
  }, { position: [240, y2] });
  wf.link(hd, rd);
  return wf.json();
}

// --------------------------------------------------------------------------
// 09 Fehlerbehandlung (für alle Workflows)
// --------------------------------------------------------------------------
function errorHandler() {
  const wf = new Wf(IDS.errors, 'DF 09 Fehlerbehandlung', { errorWorkflow: false });
  const t = wf.add('Bei Fehler', 'n8n-nodes-base.errorTrigger', 1, {});
  const fmt = wf.add('Fehler aufbereiten', 'n8n-nodes-base.code', 2, code(`
const e = $json;
const exec = e.execution || {};
const err = exec.error || e.trigger?.error || {};
return { json: {
  workflow: (e.workflow && e.workflow.name) || '?', node: exec.lastNodeExecuted || err.node?.name || '?',
  execution_id: String(exec.id || ''), message: err.message || 'Unbekannter Fehler',
  details: { url: exec.url || null, stack: String(err.stack || '').slice(0, 2000), modus: exec.mode || null } } };`));
  const log = pg(wf, 'Fehler protokollieren', 'select docflow.log_workflow_error($1, $2, $3, $4, $5::jsonb) as r',
    '[$json.workflow, $json.node, $json.execution_id, $json.message, JSON.stringify($json.details)]', { onError: 'continueErrorOutput' });
  const back = wf.add('Datenbank nicht erreichbar', 'n8n-nodes-base.code', 2, code(`
const f = $('Fehler aufbereiten').item.json;
return { json: { severity: 'kritisch', message: \`Workflow "\${f.workflow}" abgebrochen (\${f.node}): \${f.message}. Zusätzlich ist die Datenbank nicht erreichbar.\`, details: f } };`));
  const notify = wf.add('Notfall-Alarm', 'n8n-nodes-base.executeWorkflow', 1.2, {
    source: 'database', workflowId: { __rl: true, value: IDS.emergency, mode: 'id' }, options: { waitForSubWorkflow: true },
  });
  wf.chain(t, fmt, log);
  wf.link(log, back, 1);
  wf.link(back, notify);
  return wf.json();
}

// --------------------------------------------------------------------------
// 10 Notfall-Alarm (ohne Datenbank): Webhook → E-Mail → Datei
// Konfiguration über Umgebungsvariablen, weil die Datenbank ausgefallen sein kann.
// --------------------------------------------------------------------------
function emergency() {
  const wf = new Wf(IDS.emergency, 'DF 10 Notfall-Alarm', { errorWorkflow: false });
  const t = wf.add('Aufruf', 'n8n-nodes-base.executeWorkflowTrigger', 1.1, { inputSource: 'passthrough' });
  const prep = wf.add('Nachricht bauen', 'n8n-nodes-base.code', 2, code(`
// Entprellen: Fällt die Datenbank aus, scheitern alle Workflows gleichzeitig. Gleiche Meldungen höchstens alle 15 Minuten.
const sd = $getWorkflowStaticData('global');
sd.sent = sd.sent || {};
const now = Date.now();
for (const k of Object.keys(sd.sent)) if (now - sd.sent[k] > 15 * 60000) delete sd.sent[k];
const out = [];
for (const it of $input.all()) {
  const m = it.json.message || 'Unbekannter Notfall';
  const key = m.replace(/[0-9a-f-]{36}|\\d+/g, '#').slice(0, 120);
  if (sd.sent[key]) continue;
  sd.sent[key] = now;
  out.push({ json: { ...it.json, text: \`🔴 [NOTFALL] Dokumentenverarbeitung: \${m}\`, webhook: $env.DOCFLOW_ALERT_WEBHOOK || '',
    email_to: $env.DOCFLOW_ALERT_EMAIL || '', email_from: $env.DOCFLOW_ALERT_EMAIL_FROM || 'docflow@localhost' } });
}
return out;`, 'runOnceForAllItems'));
  const viaHook = ifNode(wf, 'Webhook hinterlegt?', '!!$json.webhook');
  const hook = wf.add('An Teams/Slack senden', 'n8n-nodes-base.httpRequest', 4.2, {
    method: 'POST', url: '={{ $json.webhook }}', sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify({ text: $json.text }) }}', options: { timeout: 15000 },
  }, { retryOnFail: true, maxTries: 3, waitBetweenTries: 3000, onError: 'continueErrorOutput' });
  const back = wf.add('Kontext zurückholen', 'n8n-nodes-base.code', 2, code("return { json: $('Nachricht bauen').item.json };"));
  const viaMail = ifNode(wf, 'E-Mail hinterlegt?', '!!$json.email_to');
  const mail = wf.add('Per E-Mail senden', 'n8n-nodes-base.emailSend', 2.1, {
    fromEmail: '={{ $json.email_from }}', toEmail: '={{ $json.email_to }}', subject: '={{ $json.text.slice(0, 150) }}',
    emailFormat: 'text', text: '={{ $json.text + "\\n\\n" + JSON.stringify($json.details || {}, null, 2) }}', options: {},
  }, { credentials: CRED.smtp, retryOnFail: true, maxTries: 3, waitBetweenTries: 5000, onError: 'continueErrorOutput' });
  const fileCtx = wf.add('Als Datei ablegen', 'n8n-nodes-base.code', 2, code(`
const a = $('Nachricht bauen').item.json;
const data = Buffer.from(JSON.stringify(a, null, 2), 'utf8').toString('base64');
return { json: a, binary: { data: { data, mimeType: 'application/json', fileName: 'notfall.json' } } };`));
  const write = wf.add('Notfalldatei schreiben', 'n8n-nodes-base.readWriteFile', 1, {
    operation: 'write', fileName: `=${ALERT_DIR}/notfall-{{ new Date().toISOString().replace(/[:.]/g, '-') }}.json`, dataPropertyName: 'data', options: {},
  }, { onError: 'continueRegularOutput' });
  wf.chain(t, prep, viaHook);
  wf.link(viaHook, hook, 0); wf.link(viaHook, back, 1);
  wf.link(hook, back, 1);
  wf.link(back, viaMail);
  wf.link(viaMail, mail, 0); wf.link(viaMail, fileCtx, 1);
  wf.link(mail, fileCtx, 1);
  wf.chain(fileCtx, write);
  return wf.json();
}

// --------------------------------------------------------------------------
const builders = { '01-eingang-email': emailIntake, '02-eingang-http': webhookIntake, '03-verarbeitung': worker, '04-export-erp': exporter,
  '05-wachhund': watchdog, '06-alarm-versand': alerts, '07-zwischenspeicher-nachholen': spoolRecovery, '08-api-dashboard': api,
  '09-fehlerbehandlung': errorHandler, '10-notfall-alarm': emergency };

const outDir = join(root, 'workflows');
mkdirSync(outDir, { recursive: true });
for (const [file, build] of Object.entries(builders)) {
  const wf = build();
  writeFileSync(join(outDir, `${file}.json`), `${JSON.stringify(wf, null, 2)}\n`);
  console.log(`${file}.json  ${wf.nodes.length} Knoten`);
}
