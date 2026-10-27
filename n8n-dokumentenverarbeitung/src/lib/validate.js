// Feste Prüfregeln. Sie laufen ohne KI und fangen ab, was eine KI übersehen
// oder falsch lesen könnte. errors = darf nicht automatisch durch,
// warnings = Prüf-Agent einschalten.

const TOLERANCE = 0.05; // € Rundungstoleranz

const round2 = (n) => Math.round(n * 100) / 100;
const isNum = (n) => typeof n === 'number' && Number.isFinite(n);

function isValidDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function ibanValid(iban) {
  const s = String(iban || '').replace(/\s+/g, '').toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(s)) return false;
  const rearranged = s.slice(4) + s.slice(0, 4);
  let rest = 0;
  for (const ch of rearranged) {
    const v = /[A-Z]/.test(ch) ? String(ch.charCodeAt(0) - 55) : ch;
    for (const digit of v) rest = (rest * 10 + Number(digit)) % 97;
  }
  return rest === 1;
}

// Österreichische UID: ATU + 8 Ziffern mit Prüfziffer
function atUidValid(uid) {
  const s = String(uid || '').replace(/\s+/g, '').toUpperCase();
  if (!/^ATU\d{8}$/.test(s)) return false;
  const d = s.slice(3).split('').map(Number);
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    let v = d[i];
    if (i % 2 === 1) { v *= 2; v = Math.floor(v / 10) + (v % 10); }
    sum += v;
  }
  const check = (10 - ((sum + 4) % 10)) % 10;
  return check === d[7];
}

function validateExtraction(x, { today = new Date() } = {}) {
  const errors = [];
  const warnings = [];
  if (!x || typeof x !== 'object') return { errors: ['Kein Ergebnis vorhanden'], warnings, checks: {} };

  const financial = ['rechnung', 'gutschrift'].includes(x.doc_type);
  const commercial = financial || ['bestellung', 'auftragsbestaetigung', 'angebot'].includes(x.doc_type);

  if (x.doc_type === 'sonstiges') warnings.push('Dokumenttyp nicht erkannt');
  if (!x.issuer || !x.issuer.name) errors.push('Aussteller fehlt');
  if (commercial && !x.document_number) errors.push('Belegnummer fehlt');
  if (financial && !x.document_date) errors.push('Belegdatum fehlt');

  for (const f of ['document_date', 'delivery_date', 'due_date']) {
    if (x[f] != null && !isValidDate(x[f])) errors.push(`Ungültiges Datum in ${f}: ${x[f]}`);
  }
  if (isValidDate(x.document_date)) {
    const d = new Date(`${x.document_date}T00:00:00Z`);
    const days = (d - today) / 86400000;
    if (days > 2) errors.push(`Belegdatum liegt in der Zukunft: ${x.document_date}`);
    if (days < -730) warnings.push(`Belegdatum ist älter als zwei Jahre: ${x.document_date}`);
  }

  if (x.currency != null && !/^[A-Z]{3}$/.test(x.currency)) warnings.push(`Unbekannte Währung: ${x.currency}`);
  if (financial && x.currency == null) warnings.push('Währung fehlt');

  const t = x.totals || {};
  const lines = Array.isArray(x.line_items) ? x.line_items : [];
  if (financial && !isNum(t.gross)) errors.push('Bruttobetrag fehlt');
  if (isNum(t.net) && isNum(t.tax) && isNum(t.gross) && Math.abs(round2(t.net + t.tax) - t.gross) > TOLERANCE) {
    errors.push(`Summen passen nicht: netto ${t.net} + Steuer ${t.tax} ≠ brutto ${t.gross}`);
  }
  const lineNets = lines.map((l) => l.net_amount).filter(isNum);
  if (lineNets.length > 0 && lineNets.length === lines.length && isNum(t.net)) {
    const sum = round2(lineNets.reduce((a, b) => a + b, 0));
    if (Math.abs(sum - t.net) > Math.max(TOLERANCE, lines.length * 0.01)) {
      warnings.push(`Positionen ergeben ${sum}, Nettosumme ist ${t.net}`);
    }
  }
  for (const [i, l] of lines.entries()) {
    if (isNum(l.quantity) && isNum(l.unit_price) && isNum(l.net_amount)) {
      const calc = round2(l.quantity * l.unit_price);
      if (Math.abs(calc - l.net_amount) > Math.max(TOLERANCE, Math.abs(l.net_amount) * 0.005)) {
        warnings.push(`Position ${l.position || i + 1}: Menge × Preis = ${calc}, angegeben ${l.net_amount}`);
      }
    }
    if (isNum(l.tax_rate) && ![0, 5, 7, 10, 13, 19, 20].includes(l.tax_rate)) {
      warnings.push(`Position ${l.position || i + 1}: ungewöhnlicher Steuersatz ${l.tax_rate} %`);
    }
  }
  if (x.doc_type !== 'gutschrift' && isNum(t.gross) && t.gross < 0) errors.push('Negativer Betrag auf einem Dokument, das keine Gutschrift ist');

  if (x.issuer && x.issuer.iban && !ibanValid(x.issuer.iban)) errors.push(`IBAN des Ausstellers ungültig: ${x.issuer.iban}`);
  for (const p of ['issuer', 'recipient']) {
    const uid = x[p] && x[p].vat_id;
    if (uid && /^ATU/i.test(uid.replace(/\s+/g, '')) && !atUidValid(uid)) warnings.push(`UID-Nummer (${p}) hat falsche Prüfziffer: ${uid}`);
  }

  if (Array.isArray(x.anomalies) && x.anomalies.length > 0) warnings.push(...x.anomalies.map((a) => `KI-Hinweis: ${a}`));

  const conf = x.field_confidence || {};
  const confValues = Object.values(conf).filter(isNum);
  const minConfidence = confValues.length ? Math.min(...confValues) : 0;
  return { errors, warnings, checks: { minConfidence, gross: isNum(t.gross) ? t.gross : null, lines: lines.length } };
}

if (typeof module !== 'undefined') module.exports = { validateExtraction, ibanValid, atUidValid, isValidDate };
