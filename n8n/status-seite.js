// n8n Code-Node "Bestätigungsseite": Klick auf einen Status-Button in der Mail zeigt erst diese Seite.
// Geändert wird erst nach dem Bestätigen – so lösen Link-Scanner von Mailprogrammen nichts aus.
const q = $input.first().json.query ?? {};

const LABELS = {
  angebot: 'Angebot gesendet',
  auftrag: 'Auftrag erhalten',
  erledigt: 'Erledigt',
  abgesagt: 'Abgesagt',
};

const token = String(q.t ?? '');
const action = String(q.a ?? '');
const valid = /^[0-9a-f-]{36}$/i.test(token) && Object.hasOwn(LABELS, action);

const page = (body) => `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Status ändern – Duraku Glanzservice</title></head>
<body style="font-family:Arial,sans-serif;max-width:420px;margin:48px auto;padding:0 16px;text-align:center;color:#0f172a">
${body}</body></html>`;

const html = valid
  ? page(`<h2>Status ändern</h2>
<p>Anfrage auf <strong>„${LABELS[action]}“</strong> setzen?</p>
<form method="post" action="duraku-status-ok">
<input type="hidden" name="t" value="${token}"><input type="hidden" name="a" value="${action}">
<button type="submit" style="padding:12px 24px;font-size:16px;border:0;border-radius:6px;background:#2563eb;color:#fff;cursor:pointer">Bestätigen</button>
</form>`)
  : page('<h2>Ungültiger Link</h2><p>Dieser Link ist unvollständig. Bitte den Button direkt aus der E-Mail verwenden.</p>');

return [{ json: { html } }];
