// n8n Code-Node "Anfrage prüfen": validiert und bereinigt die Formulardaten der Website.
const body = $input.first().json.body ?? {};

const SERVICES = ['Fensterreinigung', 'Wintergärten', 'Büroreinigung', 'Mehrere Leistungen'];

const oneLine = (v, max) => String(v ?? '').replace(/[\u0000-\u001F\u007F]+/g, ' ').trim().slice(0, max);
const multiLine = (v, max) =>
  String(v ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, max);
const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Honeypot: Das Feld "website" ist für Menschen unsichtbar – nur Bots füllen es aus.
const spam = oneLine(body.website, 200) !== '';

const data = {
  name: oneLine(body.name, 100),
  email: oneLine(body.email, 254).toLowerCase(),
  phone: oneLine(body.phone, 40),
  service: oneLine(body.service, 50),
  message: multiLine(body.message, 3000),
};

const errors = [];
if (data.name.length < 2) errors.push('Bitte einen Namen angeben.');
if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.push('Bitte eine gültige E-Mail-Adresse angeben.');
if (data.phone && !/^[+0-9 ()\/-]{6,40}$/.test(data.phone)) errors.push('Telefonnummer enthält ungültige Zeichen.');
if (!SERVICES.includes(data.service)) data.service = 'Mehrere Leistungen';

const html = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, escapeHtml(v)]));
html.message = html.message.replace(/\n/g, '<br>');
html.summary = [
  `Name: ${html.name}`,
  `E-Mail: ${html.email}`,
  `Telefon: ${html.phone || '–'}`,
  `Leistung: ${html.service}`,
].join('<br>');

const receivedAt = new Date().toLocaleString('de-AT', { timeZone: 'Europe/Vienna' });

return [{ json: { spam, valid: !spam && errors.length === 0, errors, data, html, receivedAt } }];
