// Eingang: Dateinamen absichern, Zwischenspeicher-Namen bauen, E-Mail zerlegen.

const ALLOWED = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'text/plain', 'text/csv',
  'text/html', 'text/xml', 'application/xml', 'application/json', 'message/rfc822'];

function safeName(name) {
  const base = String(name || 'unbenannt').split(/[\\/]/).pop();
  return base.normalize('NFKD').replace(/[^\w.\-]+/g, '_').replace(/^\.+/, '').slice(-120) || 'unbenannt';
}

function safeMandant(m) {
  return String(m || 'default').toLowerCase().replace(/[^a-z0-9\-]/g, '').slice(0, 40) || 'default';
}

// Zwischenspeicher: Mandant und Zeit stehen im Dateinamen. So kann die Wiederherstellung
// ohne Datenbank erkennen, woher eine Datei kommt. Alles liegt direkt im Spool-Ordner,
// weil n8n beim Schreiben keine Unterordner anlegt.
function spoolPath(spoolDir, mandant, filename, now = new Date(), rand = Math.random()) {
  const stamp = now.toISOString().replace(/[:.]/g, '-');
  const id = Math.floor(rand * 1e9).toString(36);
  const name = `${safeMandant(mandant)}__${stamp}__${id}__${safeName(filename)}`;
  return { dir: spoolDir, name, path: `${spoolDir}/${name}` };
}

function parseSpoolName(name) {
  const m = /^([a-z0-9\-]+)__(\d{4}-\d{2}-\d{2}T[\d\-]+Z)__([a-z0-9]+)__(.+)$/.exec(String(name));
  if (!m) return null;
  const iso = m[2].replace(/^(\d{4}-\d{2}-\d{2}T\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/, '$1:$2:$3.$4Z');
  return { mandant: m[1], at: new Date(iso), filename: m[4] };
}

// E-Mail-Anhänge: Alles wird übernommen (nicht unterstützte Typen landen beim Menschen),
// nur kleine Bilder wie Signatur-Logos werden ausgelassen und im Protokoll vermerkt.
function keepEmailAttachment(mime, sizeBytes) {
  const m = String(mime || '').toLowerCase();
  if (m.startsWith('image/') && sizeBytes < 15 * 1024) return false;
  return true;
}

function isAllowed(mime) {
  return ALLOWED.includes(String(mime || '').toLowerCase().split(';')[0].trim());
}

if (typeof module !== 'undefined') module.exports = { safeName, safeMandant, spoolPath, parseSpoolName, isAllowed, keepEmailAttachment, ALLOWED };
