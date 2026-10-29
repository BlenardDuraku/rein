// n8n Code-Node "Status prüfen": prüft den bestätigten Status-Klick gegen die gespeicherte Anfrage.
const body = $('Status bestätigt').first().json.body ?? {};

const LABELS = {
  angebot: 'Angebot gesendet',
  auftrag: 'Auftrag erhalten',
  erledigt: 'Erledigt',
  abgesagt: 'Abgesagt',
};

const token = String(body.t ?? '');
const action = String(body.a ?? '');
const row = $input
  .all()
  .map((item) => item.json)
  .find((r) => r && r.token && r.token === token);

const escapeHtml = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let changed = false;
let title;
let text;
if (!Object.hasOwn(LABELS, action) || !row) {
  title = 'Link ungültig';
  text = 'Diese Anfrage wurde nicht gefunden. Bitte den Button direkt aus der E-Mail verwenden.';
} else if (row.status === action) {
  title = 'Schon erledigt';
  text = `Die Anfrage von <strong>${escapeHtml(row.name)}</strong> steht bereits auf „${LABELS[action]}“.`;
} else {
  changed = true;
  title = 'Gespeichert ✓';
  text = `Die Anfrage von <strong>${escapeHtml(row.name)}</strong> steht jetzt auf „${LABELS[action]}“.`;
}

const html = `<!doctype html><html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${title} – Duraku Glanzservice</title></head>
<body style="font-family:Arial,sans-serif;max-width:420px;margin:48px auto;padding:0 16px;text-align:center;color:#0f172a">
<h2>${title}</h2><p>${text}</p><p style="color:#64748b">Dieses Fenster kann geschlossen werden.</p></body></html>`;

return [{ json: { changed, token, status: action, statusAt: new Date().toISOString(), html } }];
