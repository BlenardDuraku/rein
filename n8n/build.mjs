// Erzeugt die n8n-Workflows (Import in n8n: Workflows → Import from File):
//   duraku-anfrage-workflow.json      Website-Formular → prüfen → speichern → Mails
//   duraku-status-workflow.json       Status-Buttons aus den Mails (Angebot gesendet, Auftrag, …)
//   duraku-nachfassen-workflow.json   Täglich 9 Uhr: Erinnerung, Nachfragen, Bewertungsbitte
// Code-Node-Inhalte liegen als echte JS-Dateien daneben, damit sie lesbar und testbar bleiben.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const code = (file) => readFileSync(join(dir, file), 'utf8');

const OWNER_EMAIL = 'duraku-glanz@outlook.com';
const TABLE = { __rl: true, mode: 'name', value: 'duraku_anfragen', cachedResultName: 'duraku_anfragen' };

// Spalten der Tabelle "duraku_anfragen" (wird vom Nachfass-Workflow einmalig angelegt).
const COLUMNS = [
  ['token', 'string'],
  ['name', 'string'],
  ['email', 'string'],
  ['phone', 'string'],
  ['service', 'string'],
  ['message', 'string'],
  ['status', 'string'],
  ['createdAt', 'string'],
  ['statusAt', 'string'],
  ['ownerReminded', 'number'],
  ['followUps', 'number'],
  ['reviewSent', 'number'],
];

let idCounter = 0;
const uuid = (prefix) => `${prefix}-0000-4000-8000-${String(++idCounter).padStart(12, '0')}`;

const node = (wf, name, type, typeVersion, position, parameters, extra = {}) => ({
  id: uuid(wf),
  name,
  type,
  typeVersion,
  position,
  ...extra,
  parameters,
});

const ifTrue = (wf, field) => ({
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
    conditions: [
      {
        id: uuid(wf),
        leftValue: `={{ $json.${field} }}`,
        rightValue: '',
        operator: { type: 'boolean', operation: 'true', singleValue: true },
      },
    ],
    combinator: 'and',
  },
  options: {},
});

const respondJson = (code, body) => ({
  respondWith: 'json',
  responseBody: body,
  options: { responseCode: code },
});

const respondHtml = (body) => ({
  respondWith: 'text',
  responseBody: body,
  options: {
    responseCode: 200,
    responseHeaders: { entries: [{ name: 'Content-Type', value: 'text/html; charset=utf-8' }] },
  },
});

const columnsDefined = (values) => ({
  mappingMode: 'defineBelow',
  value: values,
  matchingColumns: [],
  schema: Object.keys(values).map((id) => ({
    id,
    displayName: id,
    required: false,
    defaultMatch: false,
    display: true,
    type: COLUMNS.find(([c]) => c === id)[1],
    canBeUsedToMatch: true,
  })),
  attemptToConvertTypes: false,
  convertFieldsToString: false,
});

const byToken = (expr) => ({
  matchType: 'allConditions',
  filters: { conditions: [{ keyName: 'token', condition: 'eq', keyValue: expr }] },
});

const outlookSend = (to, subject, body, additionalFields) => ({
  resource: 'message',
  operation: 'send',
  toRecipients: to,
  subject,
  bodyContent: body,
  additionalFields: { bodyContentType: 'html', ...additionalFields },
});

const link = (...targets) => [targets.map((t) => ({ node: t, type: 'main', index: 0 }))];
const outputs = (...lists) => lists.map((l) => l.map((t) => ({ node: t, type: 'main', index: 0 })));

const write = (file, workflow) => {
  writeFileSync(join(dir, file), JSON.stringify({ ...workflow, pinData: {} }, null, 2) + '\n');
  console.log(`n8n/${file} geschrieben`);
};

// ─── 1. Website-Anfragen ────────────────────────────────────────────────────────────────

const L = "$('Anfrage prüfen').item.json";
const ownerMail = `=<div style="font-family:Arial,sans-serif;max-width:600px">
<h2 style="color:#1d4ed8;margin:0 0 12px">Neue Anfrage über die Website</h2>
<table style="border-collapse:collapse;width:100%">
<tr><td style="padding:6px 12px 6px 0;color:#64748b">Name</td><td style="padding:6px 0"><strong>{{ ${L}.html.name }}</strong></td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#64748b">E-Mail</td><td style="padding:6px 0"><a href="mailto:{{ ${L}.html.email }}">{{ ${L}.html.email }}</a></td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#64748b">Telefon</td><td style="padding:6px 0">{{ ${L}.html.phone || '–' }}</td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#64748b">Leistung</td><td style="padding:6px 0">{{ ${L}.html.service }}</td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#64748b">Eingegangen</td><td style="padding:6px 0">{{ ${L}.receivedAt }}</td></tr>
</table>
<h3 style="margin:16px 0 6px">Nachricht</h3>
<div style="background:#f1f5f9;padding:12px;border-radius:6px">{{ ${L}.html.message || '<em>Keine Nachricht</em>' }}</div>
<h3 style="margin:20px 0 8px">Status setzen</h3>
<div>{{ $('Lead vorbereiten').item.json.buttonsHtml }}</div>
<p style="color:#64748b;font-size:12px;margin-top:12px">Nach dem Klick „Angebot gesendet“ fasst das System nach 3 und 7 Tagen automatisch beim Kunden nach.
Auf diese Mail antworten = Antwort geht direkt an den Kunden.</p>
</div>`;

const customerMail = `=<div style="font-family:Arial,sans-serif;max-width:600px">
<p>Hallo {{ ${L}.html.name }},</p>
<p>vielen Dank für Ihre Anfrage zu <strong>{{ ${L}.html.service }}</strong>. Wir haben sie erhalten und melden uns in der Regel innerhalb von 24 Stunden mit einem Angebot.</p>
<p>Bei dringenden Fragen erreichen Sie uns telefonisch unter <a href="tel:+4367764165633">0677 64165633</a>.</p>
<p>Freundliche Grüße<br><strong>Duraku Glanzservice</strong><br>Fenster- &amp; Glasreinigung in Linz &amp; Umgebung</p>
<hr style="border:none;border-top:1px solid #e2e8f0">
<p style="color:#64748b;font-size:12px">Ihre Angaben:<br>{{ ${L}.html.summary }}</p>
</div>`;

const R = "$('Lead vorbereiten').item.json.row";
write('duraku-anfrage-workflow.json', {
  name: 'Duraku Glanzservice – Website-Anfragen',
  nodes: [
    node('a1f0c001', 'Anfrage empfangen', 'n8n-nodes-base.webhook', 2, [0, 300],
      { httpMethod: 'POST', path: 'duraku-anfrage', responseMode: 'responseNode', options: { allowedOrigins: '*' } },
      { webhookId: 'a1f0c001-0000-4000-8000-0000000000aa' }),
    node('a1f0c001', 'Anfrage prüfen', 'n8n-nodes-base.code', 2, [220, 300],
      { jsCode: code('anfrage-pruefen.js') }, { onError: 'continueErrorOutput' }),
    node('a1f0c001', 'Spam?', 'n8n-nodes-base.if', 2, [440, 300], ifTrue('c0000001', 'spam')),
    // Bots bekommen "Erfolg" zu sehen, damit sie nicht weiterprobieren.
    node('a1f0c001', 'Spam still verwerfen', 'n8n-nodes-base.respondToWebhook', 1.1, [660, 120],
      respondJson(200, '={{ { "ok": true } }}')),
    node('a1f0c001', 'Gültig?', 'n8n-nodes-base.if', 2, [660, 400], ifTrue('c0000001', 'valid')),
    node('a1f0c001', 'Fehler 400 melden', 'n8n-nodes-base.respondToWebhook', 1.1, [880, 600],
      respondJson(400, '={{ { "ok": false, "errors": $json.errors } }}')),
    node('a1f0c001', 'Token erzeugen', 'n8n-nodes-base.crypto', 2, [880, 380],
      { action: 'generate', dataPropertyName: 'token', encodingType: 'uuid' }),
    node('a1f0c001', 'Lead vorbereiten', 'n8n-nodes-base.code', 2, [1100, 380],
      { jsCode: code('lead-vorbereiten.js') }, { onError: 'continueErrorOutput' }),
    // Scheitert das Speichern, geht die Mail trotzdem raus – keine Anfrage geht verloren.
    node('a1f0c001', 'Lead speichern', 'n8n-nodes-base.dataTable', 1.1, [1320, 380], {
      resource: 'row',
      operation: 'insert',
      dataTableId: TABLE,
      columns: columnsDefined(Object.fromEntries(COLUMNS.map(([c]) => [c, `={{ ${R}.${c} }}`]))),
      options: {},
    }, { onError: 'continueRegularOutput' }),
    node('a1f0c001', 'Mail an Duraku', 'n8n-nodes-base.microsoftOutlook', 2, [1540, 380],
      outlookSend(OWNER_EMAIL, `=Neue Anfrage: {{ ${L}.data.service }} – {{ ${L}.data.name }}`, ownerMail,
        { replyTo: `={{ ${L}.data.email }}`, importance: 'High' }),
      { retryOnFail: true, maxTries: 3, waitBetweenTries: 5000, onError: 'continueErrorOutput' }),
    // Nicht kritisch: Die Anfrage ist bereits bei Duraku angekommen.
    node('a1f0c001', 'Bestätigung an Kunden', 'n8n-nodes-base.microsoftOutlook', 2, [1760, 300],
      outlookSend(`={{ ${L}.data.email }}`, 'Ihre Anfrage bei Duraku Glanzservice', customerMail,
        { replyTo: OWNER_EMAIL }),
      { retryOnFail: true, maxTries: 2, waitBetweenTries: 5000, onError: 'continueRegularOutput' }),
    node('a1f0c001', 'Erfolg melden', 'n8n-nodes-base.respondToWebhook', 1.1, [1980, 300],
      respondJson(200, '={{ { "ok": true } }}')),
    // Website fällt dann auf das Mailprogramm zurück.
    node('a1f0c001', 'Fehler 500 melden', 'n8n-nodes-base.respondToWebhook', 1.1, [1760, 520],
      respondJson(500, '={{ { "ok": false, "errors": ["Versand fehlgeschlagen"] } }}')),
    node('a1f0c001', 'Hinweis', 'n8n-nodes-base.stickyNote', 1, [-20, -60], {
      width: 640,
      height: 260,
      content:
        '## Website-Anfragen Duraku Glanzservice\n' +
        '1. Zuerst den Workflow „Nachfassen“ importieren und dort „Tabelle anlegen“ einmal ausführen.\n' +
        '2. Beide Outlook-Nodes: Microsoft-Outlook-Zugangsdaten (OAuth2) für duraku-glanz@outlook.com wählen.\n' +
        '3. Workflow aktivieren, **Production URL** des Webhooks auf der Website in `WEBHOOK_URL` eintragen.\n\n' +
        'Spam wird still verworfen, ungültige Daten bekommen 400, scheitert die Mail an Duraku, ' +
        'bekommt die Website 500 und öffnet als Ausweichlösung das Mailprogramm.',
    }),
  ],
  connections: {
    'Anfrage empfangen': { main: link('Anfrage prüfen') },
    'Anfrage prüfen': { main: outputs(['Spam?'], ['Fehler 500 melden']) },
    'Spam?': { main: outputs(['Spam still verwerfen'], ['Gültig?']) },
    'Gültig?': { main: outputs(['Token erzeugen'], ['Fehler 400 melden']) },
    'Token erzeugen': { main: link('Lead vorbereiten') },
    'Lead vorbereiten': { main: outputs(['Lead speichern'], ['Fehler 500 melden']) },
    'Lead speichern': { main: link('Mail an Duraku') },
    'Mail an Duraku': { main: outputs(['Bestätigung an Kunden'], ['Fehler 500 melden']) },
    'Bestätigung an Kunden': { main: link('Erfolg melden') },
  },
  settings: { executionOrder: 'v1', timezone: 'Europe/Vienna', saveDataErrorExecution: 'all' },
});

// ─── 2. Status-Buttons ──────────────────────────────────────────────────────────────────

write('duraku-status-workflow.json', {
  name: 'Duraku Glanzservice – Status-Buttons',
  nodes: [
    node('b2f0c002', 'Status-Link geklickt', 'n8n-nodes-base.webhook', 2, [0, 120],
      { httpMethod: 'GET', path: 'duraku-status', responseMode: 'responseNode', options: {} },
      { webhookId: 'b2f0c002-0000-4000-8000-0000000000aa' }),
    node('b2f0c002', 'Bestätigungsseite', 'n8n-nodes-base.code', 2, [220, 120],
      { jsCode: code('status-seite.js') }),
    node('b2f0c002', 'Seite anzeigen', 'n8n-nodes-base.respondToWebhook', 1.1, [440, 120],
      respondHtml('={{ $json.html }}')),
    node('b2f0c002', 'Status bestätigt', 'n8n-nodes-base.webhook', 2, [0, 420],
      { httpMethod: 'POST', path: 'duraku-status-ok', responseMode: 'responseNode', options: {} },
      { webhookId: 'b2f0c002-0000-4000-8000-0000000000bb' }),
    node('b2f0c002', 'Anfrage suchen', 'n8n-nodes-base.dataTable', 1.1, [220, 420], {
      resource: 'row',
      operation: 'get',
      dataTableId: TABLE,
      ...byToken('={{ $json.body.t }}'),
      limit: 1,
    }, { alwaysOutputData: true }),
    node('b2f0c002', 'Status prüfen', 'n8n-nodes-base.code', 2, [440, 420],
      { jsCode: code('status-pruefen.js') }),
    node('b2f0c002', 'Änderung nötig?', 'n8n-nodes-base.if', 2, [660, 420], ifTrue('c0000002', 'changed')),
    node('b2f0c002', 'Status speichern', 'n8n-nodes-base.dataTable', 1.1, [880, 340], {
      resource: 'row',
      operation: 'update',
      dataTableId: TABLE,
      ...byToken('={{ $json.token }}'),
      columns: columnsDefined({ status: '={{ $json.status }}', statusAt: '={{ $json.statusAt }}' }),
      options: {},
    }, { onError: 'continueErrorOutput' }),
    node('b2f0c002', 'Fehler anzeigen', 'n8n-nodes-base.respondToWebhook', 1.1, [1100, 240], respondHtml(
      '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>Fehler</title></head><body style="font-family:Arial,sans-serif;max-width:420px;margin:48px auto;padding:0 16px;text-align:center">' +
      '<h2>Nicht gespeichert</h2><p>Der Status konnte gerade nicht gespeichert werden. Bitte in ein paar Minuten erneut auf den Button in der E-Mail klicken.</p></body></html>')),
    node('b2f0c002', 'Ergebnis anzeigen', 'n8n-nodes-base.respondToWebhook', 1.1, [1100, 420],
      respondHtml("={{ $('Status prüfen').item.json.html }}")),
    node('b2f0c002', 'Hinweis', 'n8n-nodes-base.stickyNote', 1, [-20, -140], {
      width: 600,
      height: 200,
      content:
        '## Status-Buttons\nKlick in der Mail → Bestätigungsseite (GET) → „Bestätigen“ (POST) → Status speichern.\n' +
        'Der Zwischenschritt verhindert, dass Link-Scanner von Mailprogrammen den Status ändern.\n\n' +
        'Einfach aktivieren – keine Zugangsdaten nötig.',
    }),
  ],
  connections: {
    'Status-Link geklickt': { main: link('Bestätigungsseite') },
    'Bestätigungsseite': { main: link('Seite anzeigen') },
    'Status bestätigt': { main: link('Anfrage suchen') },
    'Anfrage suchen': { main: link('Status prüfen') },
    'Status prüfen': { main: link('Änderung nötig?') },
    'Änderung nötig?': { main: outputs(['Status speichern'], ['Ergebnis anzeigen']) },
    'Status speichern': { main: outputs(['Ergebnis anzeigen'], ['Fehler anzeigen']) },
  },
  settings: { executionOrder: 'v1', timezone: 'Europe/Vienna', saveDataErrorExecution: 'all' },
});

// ─── 3. Nachfassen ──────────────────────────────────────────────────────────────────────

const A = "$('Fällige Aktionen').item.json";
write('duraku-nachfassen-workflow.json', {
  name: 'Duraku Glanzservice – Nachfassen',
  nodes: [
    node('c3f0c003', 'Täglich 9 Uhr', 'n8n-nodes-base.scheduleTrigger', 1.2, [0, 300],
      { rule: { interval: [{ field: 'days', daysInterval: 1, triggerAtHour: 9 }] } }),
    node('c3f0c003', 'Alle Anfragen laden', 'n8n-nodes-base.dataTable', 1.1, [220, 300], {
      resource: 'row',
      operation: 'get',
      dataTableId: TABLE,
      matchType: 'anyCondition',
      filters: {
        conditions: ['neu', 'angebot', 'erledigt'].map((s) => ({ keyName: 'status', condition: 'eq', keyValue: s })),
      },
      returnAll: true,
    }),
    node('c3f0c003', 'Fällige Aktionen', 'n8n-nodes-base.code', 2, [440, 300], { jsCode: code('nachfassen.js') }),
    node('c3f0c003', 'Mail senden', 'n8n-nodes-base.microsoftOutlook', 2, [660, 300],
      outlookSend('={{ $json.to }}', '={{ $json.subject }}', '={{ $json.html }}', { replyTo: '={{ $json.replyTo }}' }),
      { retryOnFail: true, maxTries: 2, waitBetweenTries: 5000, onError: 'continueErrorOutput' }),
    node('c3f0c003', 'Als erledigt markieren', 'n8n-nodes-base.dataTable', 1.1, [880, 220], {
      resource: 'row',
      operation: 'update',
      dataTableId: TABLE,
      ...byToken(`={{ ${A}.token }}`),
      columns: columnsDefined({
        ownerReminded: `={{ ${A}.update.ownerReminded }}`,
        followUps: `={{ ${A}.update.followUps }}`,
        reviewSent: `={{ ${A}.update.reviewSent }}`,
      }),
      options: {},
    }),
    // Fehlgeschlagene Mails bleiben offen – der nächste Lauf versucht sie erneut.
    node('c3f0c003', 'Morgen erneut versuchen', 'n8n-nodes-base.noOp', 1, [880, 400], {}),
    node('c3f0c003', 'Einmalig: Tabelle anlegen', 'n8n-nodes-base.manualTrigger', 1, [0, 620], {}),
    node('c3f0c003', 'Tabelle anlegen', 'n8n-nodes-base.dataTable', 1.1, [220, 620], {
      resource: 'table',
      operation: 'create',
      tableName: TABLE.value,
      columns: { column: COLUMNS.map(([name, type]) => ({ name, type })) },
      options: {},
    }),
    node('c3f0c003', 'Hinweis', 'n8n-nodes-base.stickyNote', 1, [-20, -60], {
      width: 700,
      height: 300,
      content:
        '## Nachfassen (täglich 9 Uhr)\n' +
        '- Anfrage seit 20 h „neu“ → Erinnerung an Duraku\n' +
        '- „Angebot gesendet“ seit 3 / 7 Tagen → 1. / 2. Nachfrage beim Kunden\n' +
        '- „Erledigt“ seit 1 Tag → Bitte um Google-Bewertung\n\n' +
        '**Einrichtung:** 1. Unten „Tabelle anlegen“ einmal ausführen. 2. Outlook-Zugangsdaten wählen. ' +
        '3. Im Node „Fällige Aktionen“ `GOOGLE_REVIEW_URL` eintragen (leer = keine Bewertungsmails). 4. Aktivieren.',
    }),
  ],
  connections: {
    'Täglich 9 Uhr': { main: link('Alle Anfragen laden') },
    'Alle Anfragen laden': { main: link('Fällige Aktionen') },
    'Fällige Aktionen': { main: link('Mail senden') },
    'Mail senden': { main: outputs(['Als erledigt markieren'], ['Morgen erneut versuchen']) },
    'Einmalig: Tabelle anlegen': { main: link('Tabelle anlegen') },
  },
  settings: { executionOrder: 'v1', timezone: 'Europe/Vienna', saveDataErrorExecution: 'all' },
});
