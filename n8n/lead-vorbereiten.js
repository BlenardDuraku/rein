// n8n Code-Node "Lead vorbereiten": baut den Tabellen-Datensatz und die Status-Buttons für die Mail an Duraku.

// Leer lassen = Adresse wird aus der n8n-Instanz abgeleitet. Nur setzen, falls die Buttons ins Leere zeigen.
const STATUS_URL_OVERRIDE = '';

const statusUrl =
  STATUS_URL_OVERRIDE || $execution.resumeUrl.replace(/webhook-waiting\/.*$/, '') + 'webhook/duraku-status';

const ACTIONS = [
  ['angebot', 'Angebot gesendet', '#2563eb'],
  ['auftrag', 'Auftrag erhalten', '#16a34a'],
  ['erledigt', 'Erledigt', '#0f766e'],
  ['abgesagt', 'Abgesagt', '#64748b'],
];

const lead = $('Anfrage prüfen').first().json;
const token = String($input.first().json.token);
const now = new Date().toISOString();

const buttonsHtml = ACTIONS.map(
  ([action, label, color]) =>
    `<a href="${statusUrl}?t=${encodeURIComponent(token)}&amp;a=${action}" ` +
    `style="display:inline-block;margin:0 6px 6px 0;padding:8px 14px;border-radius:6px;` +
    `background:${color};color:#fff;text-decoration:none;font-weight:bold">${label}</a>`
).join('');

return [
  {
    json: {
      row: {
        token,
        ...lead.data,
        status: 'neu',
        createdAt: now,
        statusAt: now,
        ownerReminded: 0,
        followUps: 0,
        reviewSent: 0,
      },
      buttonsHtml,
    },
  },
];
