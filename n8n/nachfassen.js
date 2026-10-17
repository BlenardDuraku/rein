// n8n Code-Node "Fällige Aktionen": entscheidet jeden Morgen, wer welche Mail bekommt.
//  - Anfrage seit 20 h "neu"                 → Erinnerung an Duraku (einmal)
//  - "Angebot gesendet" seit 3 bzw. 7 Tagen → 1. bzw. 2. Nachfrage beim Kunden
//  - "Erledigt" seit 1 Tag                   → Bitte um Google-Bewertung (nur wenn Link gesetzt)

const OWNER_EMAIL = 'duraku-glanz@outlook.com';
const OWNER_PHONE = '0677 64165633';
// Google-Bewertungslink (Google Unternehmensprofil → "Nach Rezensionen fragen"). Leer = keine Bewertungsmails.
const GOOGLE_REVIEW_URL = '';
// Leer lassen = Adresse wird aus der n8n-Instanz abgeleitet.
const STATUS_URL_OVERRIDE = '';

const HOUR = 36e5;
const DAY = 24 * HOUR;
const now = Date.now();

const statusUrl =
  STATUS_URL_OVERRIDE || $execution.resumeUrl.replace(/webhook-waiting\/.*$/, '') + 'webhook/duraku-status';

const escapeHtml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const ACTIONS = [
  ['angebot', 'Angebot gesendet', '#2563eb'],
  ['auftrag', 'Auftrag erhalten', '#16a34a'],
  ['erledigt', 'Erledigt', '#0f766e'],
  ['abgesagt', 'Abgesagt', '#64748b'],
];
const buttons = (token) =>
  ACTIONS.map(
    ([action, label, color]) =>
      `<a href="${statusUrl}?t=${encodeURIComponent(token)}&amp;a=${action}" ` +
      `style="display:inline-block;margin:0 6px 6px 0;padding:8px 14px;border-radius:6px;` +
      `background:${color};color:#fff;text-decoration:none;font-weight:bold">${label}</a>`
  ).join('');

const wrap = (inner) => `<div style="font-family:Arial,sans-serif;max-width:600px">${inner}</div>`;
const signature = `<p>Freundliche Grüße<br><strong>Duraku Glanzservice</strong><br>
Fenster- &amp; Glasreinigung in Linz &amp; Umgebung<br>Tel. ${OWNER_PHONE}</p>`;
const optOut = `<p style="color:#64748b;font-size:12px">Sie möchten keine weiteren E-Mails von uns?
Antworten Sie einfach mit „Abmelden“.</p>`;

const since = (iso) => {
  const t = Date.parse(iso);
  return Number.isNaN(t) ? 0 : now - t;
};

const out = [];
for (const { json: row } of $input.all()) {
  if (!row || !row.token || !row.email) continue;

  const name = escapeHtml(row.name);
  const service = escapeHtml(row.service);
  const state = {
    ownerReminded: Number(row.ownerReminded) || 0,
    followUps: Number(row.followUps) || 0,
    reviewSent: Number(row.reviewSent) || 0,
  };
  const send = (mail, update) => out.push({ json: { token: row.token, ...mail, update: { ...state, ...update } } });

  if (row.status === 'neu' && !state.ownerReminded && since(row.createdAt) >= 20 * HOUR) {
    send(
      {
        kind: 'erinnerung',
        to: OWNER_EMAIL,
        replyTo: row.email,
        subject: `Erinnerung: Anfrage von ${row.name} wartet noch`,
        html: wrap(`<h2 style="color:#b45309;margin:0 0 12px">Diese Anfrage wartet noch auf Antwort</h2>
<p><strong>${name}</strong> – ${service}<br>
<a href="mailto:${escapeHtml(row.email)}">${escapeHtml(row.email)}</a> · ${escapeHtml(row.phone) || 'kein Telefon'}<br>
Eingegangen: ${new Date(row.createdAt).toLocaleString('de-AT', { timeZone: 'Europe/Vienna' })}</p>
<div style="background:#f1f5f9;padding:12px;border-radius:6px">${escapeHtml(row.message).replace(/\n/g, '<br>') || '<em>Keine Nachricht</em>'}</div>
<p style="margin-top:16px">Status setzen:</p>${buttons(row.token)}`),
      },
      { ownerReminded: 1 }
    );
  } else if (row.status === 'angebot' && state.followUps === 0 && since(row.statusAt) >= 3 * DAY) {
    send(
      {
        kind: 'nachfrage-1',
        to: row.email,
        replyTo: OWNER_EMAIL,
        subject: `Ihr Angebot für ${row.service} – Duraku Glanzservice`,
        html: wrap(`<p>Hallo ${name},</p>
<p>wir wollten kurz nachfragen, ob unser Angebot für <strong>${service}</strong> gut angekommen ist und ob Sie dazu noch Fragen haben.</p>
<p>Antworten Sie einfach auf diese E-Mail oder rufen Sie uns an – wir finden gerne einen passenden Termin.</p>
${signature}${optOut}`),
      },
      { followUps: 1 }
    );
  } else if (row.status === 'angebot' && state.followUps === 1 && since(row.statusAt) >= 7 * DAY) {
    send(
      {
        kind: 'nachfrage-2',
        to: row.email,
        replyTo: OWNER_EMAIL,
        subject: `Kurze letzte Nachfrage zu Ihrem Angebot`,
        html: wrap(`<p>Hallo ${name},</p>
<p>nur eine kurze letzte Nachfrage zu unserem Angebot für <strong>${service}</strong>.
Falls der Zeitpunkt gerade nicht passt, ist das kein Problem – melden Sie sich einfach, wenn es so weit ist.</p>
${signature}${optOut}`),
      },
      { followUps: 2 }
    );
  } else if (row.status === 'erledigt' && !state.reviewSent && GOOGLE_REVIEW_URL && since(row.statusAt) >= DAY) {
    send(
      {
        kind: 'bewertung',
        to: row.email,
        replyTo: OWNER_EMAIL,
        subject: 'Danke für Ihren Auftrag – Duraku Glanzservice',
        html: wrap(`<p>Hallo ${name},</p>
<p>vielen Dank, dass Sie uns mit <strong>${service}</strong> beauftragt haben. Wir hoffen, Sie haben wieder den vollen Durchblick!</p>
<p>Wenn Sie zufrieden waren, würde uns eine kurze Google-Bewertung sehr helfen – das dauert nur eine Minute:</p>
<p><a href="${escapeHtml(GOOGLE_REVIEW_URL)}" style="display:inline-block;padding:10px 18px;border-radius:6px;background:#2563eb;color:#fff;text-decoration:none;font-weight:bold">Jetzt bewerten</a></p>
<p>Und falls etwas nicht gepasst hat, antworten Sie bitte direkt auf diese Mail – wir kümmern uns darum.</p>
${signature}${optOut}`),
      },
      { reviewSent: 1 }
    );
  }
}

return out;
