// Erzeugt n8n/duraku-anfrage-workflow.json (Import in n8n: Workflows → Import from File).
// Code-Node-Inhalt liegt als echte JS-Datei daneben, damit er lesbar und testbar bleibt.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const validateCode = readFileSync(join(dir, 'anfrage-pruefen.js'), 'utf8');

const OWNER_EMAIL = 'duraku-glanz@outlook.com';

const ifTrue = (id, field) => ({
  conditions: {
    options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
    conditions: [
      {
        id,
        leftValue: `={{ $json.${field} }}`,
        rightValue: '',
        operator: { type: 'boolean', operation: 'true', singleValue: true },
      },
    ],
    combinator: 'and',
  },
  options: {},
});

const respond = (code, body) => ({
  respondWith: 'json',
  responseBody: body,
  options: { responseCode: code },
});

const ownerMail = `<div style="font-family:Arial,sans-serif;max-width:600px">
<h2 style="color:#1d4ed8;margin:0 0 12px">Neue Anfrage über die Website</h2>
<table style="border-collapse:collapse;width:100%">
<tr><td style="padding:6px 12px 6px 0;color:#64748b">Name</td><td style="padding:6px 0"><strong>{{ $json.html.name }}</strong></td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#64748b">E-Mail</td><td style="padding:6px 0"><a href="mailto:{{ $json.html.email }}">{{ $json.html.email }}</a></td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#64748b">Telefon</td><td style="padding:6px 0">{{ $json.html.phone || '–' }}</td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#64748b">Leistung</td><td style="padding:6px 0">{{ $json.html.service }}</td></tr>
<tr><td style="padding:6px 12px 6px 0;color:#64748b">Eingegangen</td><td style="padding:6px 0">{{ $json.receivedAt }}</td></tr>
</table>
<h3 style="margin:16px 0 6px">Nachricht</h3>
<div style="background:#f1f5f9;padding:12px;border-radius:6px">{{ $json.html.message || '<em>Keine Nachricht</em>' }}</div>
<p style="color:#64748b;font-size:12px;margin-top:16px">Tipp: Einfach auf diese Mail antworten – die Antwort geht direkt an den Kunden.</p>
</div>`;

const customerMail = `<div style="font-family:Arial,sans-serif;max-width:600px">
<p>Hallo {{ $('Anfrage prüfen').item.json.html.name }},</p>
<p>vielen Dank für Ihre Anfrage zu <strong>{{ $('Anfrage prüfen').item.json.html.service }}</strong>. Wir haben sie erhalten und melden uns in der Regel innerhalb von 24 Stunden mit einem Angebot.</p>
<p>Bei dringenden Fragen erreichen Sie uns telefonisch unter <a href="tel:+4367764165633">0677 64165633</a>.</p>
<p>Freundliche Grüße<br><strong>Duraku Glanzservice</strong><br>Fenster- &amp; Glasreinigung in Linz &amp; Umgebung</p>
<hr style="border:none;border-top:1px solid #e2e8f0">
<p style="color:#64748b;font-size:12px">Ihre Angaben:<br>{{ $('Anfrage prüfen').item.json.html.summary }}</p>
</div>`;

const workflow = {
  name: 'Duraku Glanzservice – Website-Anfragen',
  nodes: [
    {
      id: 'a1f0c001-0000-4000-8000-000000000001',
      name: 'Anfrage empfangen',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 2,
      position: [0, 300],
      webhookId: 'a1f0c001-0000-4000-8000-0000000000aa',
      parameters: {
        httpMethod: 'POST',
        path: 'duraku-anfrage',
        responseMode: 'responseNode',
        options: { allowedOrigins: '*' },
      },
    },
    {
      id: 'a1f0c001-0000-4000-8000-000000000002',
      name: 'Anfrage prüfen',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [220, 300],
      onError: 'continueErrorOutput',
      parameters: { jsCode: validateCode },
    },
    {
      id: 'a1f0c001-0000-4000-8000-000000000003',
      name: 'Spam?',
      type: 'n8n-nodes-base.if',
      typeVersion: 2,
      position: [440, 300],
      parameters: ifTrue('c0000001-0000-4000-8000-000000000001', 'spam'),
    },
    {
      id: 'a1f0c001-0000-4000-8000-000000000004',
      name: 'Spam still verwerfen',
      type: 'n8n-nodes-base.respondToWebhook',
      typeVersion: 1.1,
      position: [660, 120],
      // Bots bekommen "Erfolg" zu sehen, damit sie nicht weiterprobieren.
      parameters: respond(200, '={{ { "ok": true } }}'),
    },
    {
      id: 'a1f0c001-0000-4000-8000-000000000005',
      name: 'Gültig?',
      type: 'n8n-nodes-base.if',
      typeVersion: 2,
      position: [660, 400],
      parameters: ifTrue('c0000001-0000-4000-8000-000000000002', 'valid'),
    },
    {
      id: 'a1f0c001-0000-4000-8000-000000000006',
      name: 'Fehler 400 melden',
      type: 'n8n-nodes-base.respondToWebhook',
      typeVersion: 1.1,
      position: [880, 560],
      parameters: respond(400, '={{ { "ok": false, "errors": $json.errors } }}'),
    },
    {
      id: 'a1f0c001-0000-4000-8000-000000000007',
      name: 'Mail an Duraku',
      type: 'n8n-nodes-base.microsoftOutlook',
      typeVersion: 2,
      position: [880, 300],
      retryOnFail: true,
      maxTries: 3,
      waitBetweenTries: 5000,
      onError: 'continueErrorOutput',
      parameters: {
        resource: 'message',
        operation: 'send',
        toRecipients: OWNER_EMAIL,
        subject: '=Neue Anfrage: {{ $json.data.service }} – {{ $json.data.name }}',
        bodyContent: '=' + ownerMail,
        additionalFields: {
          bodyContentType: 'html',
          replyTo: '={{ $json.data.email }}',
          importance: 'High',
        },
      },
    },
    {
      id: 'a1f0c001-0000-4000-8000-000000000008',
      name: 'Bestätigung an Kunden',
      type: 'n8n-nodes-base.microsoftOutlook',
      typeVersion: 2,
      position: [1100, 220],
      retryOnFail: true,
      maxTries: 2,
      waitBetweenTries: 5000,
      // Nicht kritisch: Die Anfrage ist bereits bei Duraku angekommen.
      onError: 'continueRegularOutput',
      parameters: {
        resource: 'message',
        operation: 'send',
        toRecipients: "={{ $('Anfrage prüfen').item.json.data.email }}",
        subject: 'Ihre Anfrage bei Duraku Glanzservice',
        bodyContent: '=' + customerMail,
        additionalFields: { bodyContentType: 'html', replyTo: OWNER_EMAIL },
      },
    },
    {
      id: 'a1f0c001-0000-4000-8000-000000000009',
      name: 'Erfolg melden',
      type: 'n8n-nodes-base.respondToWebhook',
      typeVersion: 1.1,
      position: [1320, 220],
      parameters: respond(200, '={{ { "ok": true } }}'),
    },
    {
      id: 'a1f0c001-0000-4000-8000-000000000010',
      name: 'Fehler 500 melden',
      type: 'n8n-nodes-base.respondToWebhook',
      typeVersion: 1.1,
      position: [1100, 420],
      // Website fällt dann auf das Mailprogramm zurück – keine Anfrage geht verloren.
      parameters: respond(500, '={{ { "ok": false, "errors": ["Versand fehlgeschlagen"] } }}'),
    },
    {
      id: 'a1f0c001-0000-4000-8000-000000000011',
      name: 'Hinweis',
      type: 'n8n-nodes-base.stickyNote',
      typeVersion: 1,
      position: [-20, -60],
      parameters: {
        width: 620,
        height: 260,
        content:
          '## Website-Anfragen Duraku Glanzservice\n' +
          '1. Beide Outlook-Nodes: Microsoft-Outlook-Zugangsdaten (OAuth2) für duraku-glanz@outlook.com wählen.\n' +
          '2. Workflow aktivieren, dann die **Production URL** des Webhooks kopieren.\n' +
          '3. URL auf der Website in `WEBHOOK_URL` eintragen.\n\n' +
          'Spam (Honeypot-Feld) wird still verworfen, ungültige Daten bekommen 400, ' +
          'scheitert die Mail an Duraku, bekommt die Website 500 und öffnet als Ausweichlösung das Mailprogramm.',
      },
    },
  ],
  connections: {
    'Anfrage empfangen': { main: [[{ node: 'Anfrage prüfen', type: 'main', index: 0 }]] },
    'Anfrage prüfen': {
      main: [
        [{ node: 'Spam?', type: 'main', index: 0 }],
        [{ node: 'Fehler 500 melden', type: 'main', index: 0 }],
      ],
    },
    'Spam?': {
      main: [
        [{ node: 'Spam still verwerfen', type: 'main', index: 0 }],
        [{ node: 'Gültig?', type: 'main', index: 0 }],
      ],
    },
    'Gültig?': {
      main: [
        [{ node: 'Mail an Duraku', type: 'main', index: 0 }],
        [{ node: 'Fehler 400 melden', type: 'main', index: 0 }],
      ],
    },
    'Mail an Duraku': {
      main: [
        [{ node: 'Bestätigung an Kunden', type: 'main', index: 0 }],
        [{ node: 'Fehler 500 melden', type: 'main', index: 0 }],
      ],
    },
    'Bestätigung an Kunden': { main: [[{ node: 'Erfolg melden', type: 'main', index: 0 }]] },
  },
  settings: { executionOrder: 'v1', timezone: 'Europe/Vienna', saveDataErrorExecution: 'all' },
  pinData: {},
};

writeFileSync(join(dir, 'duraku-anfrage-workflow.json'), JSON.stringify(workflow, null, 2) + '\n');
console.log('n8n/duraku-anfrage-workflow.json geschrieben');
