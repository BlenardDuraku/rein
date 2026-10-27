// Entscheidungslogik: Braucht es den Prüf-Agenten? Darf das Ergebnis automatisch durch?
// Grundsatz: Im Zweifel entscheidet ein Mensch. Automatisch geht nur durch,
// was eindeutig, plausibel und (wo nötig) von einem zweiten Agenten bestätigt ist.

const norm = (v) => (v == null ? null : String(v).toLowerCase().replace(/[\s.\-/]/g, ''));
const numEq = (a, b) => (a == null && b == null) || (typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= 0.05);

function needsVerification({ extraction, validation, settings }) {
  const reasons = [];
  const gross = validation.checks.gross;
  if (validation.warnings.length > 0) reasons.push('Warnungen der Prüfregeln');
  if (!(validation.checks.minConfidence >= settings.confidence_auto)) reasons.push('KI war sich nicht sicher genug');
  if (gross != null && !(Math.abs(gross) < settings.verify_above_gross)) reasons.push('Betrag über Prüfgrenze');
  if ((settings.always_verify_types || []).includes(extraction.doc_type)) reasons.push(`Dokumenttyp ${extraction.doc_type} wird immer geprüft`);
  return { required: reasons.length > 0, reasons };
}

// Vergleicht die kritischen Felder zweier Ergebnisse (Vier-Augen-Prinzip zweier Agenten).
function compareCritical(a, b) {
  const diffs = [];
  if (!a || !b) return ['Vergleich nicht möglich'];
  if (a.doc_type !== b.doc_type) diffs.push(`Dokumenttyp: ${a.doc_type} / ${b.doc_type}`);
  if (norm(a.document_number) !== norm(b.document_number)) diffs.push(`Belegnummer: ${a.document_number} / ${b.document_number}`);
  if (a.document_date !== b.document_date) diffs.push(`Belegdatum: ${a.document_date} / ${b.document_date}`);
  if (norm(a.issuer && a.issuer.iban) !== norm(b.issuer && b.issuer.iban)) diffs.push('IBAN des Ausstellers weicht ab');
  for (const k of ['net', 'tax', 'gross']) {
    if (!numEq(a.totals && a.totals[k], b.totals && b.totals[k])) diffs.push(`Summe ${k}: ${a.totals && a.totals[k]} / ${b.totals && b.totals[k]}`);
  }
  const la = (a.line_items || []).length;
  const lb = (b.line_items || []).length;
  if (la !== lb) diffs.push(`Anzahl Positionen: ${la} / ${lb}`);
  return diffs;
}

// Endentscheidung. verification = {ok, data} | {ok:false, error} | null (nicht nötig)
// Streng: Automatisch geht nur durch, was ohne jede Auffälligkeit ist.
function decide({ extraction, validation, verification, verificationRequired, duplicates, ibanStatus, settings, revalidate }) {
  const reasons = [];
  let final = extraction;

  // Ungültige Einstellungen dürfen die Schutzgrenzen nie still abschalten
  for (const k of ['confidence_auto', 'verify_above_gross', 'review_above_gross']) {
    if (!Number.isFinite(settings[k])) reasons.push(`Einstellung ${k} ist ungültig: alles geht zur Prüfung`);
  }

  if (validation.errors.length > 0) reasons.push(...validation.errors.map((e) => `Prüfregel: ${e}`));
  if (duplicates && duplicates.length > 0) {
    reasons.push(`Mögliches Duplikat: gleiche Belegnummer bereits vorhanden (${duplicates.join(', ')})`);
  }
  if (Array.isArray(extraction.anomalies) && extraction.anomalies.length > 0) {
    reasons.push(...extraction.anomalies.map((a) => `KI-Hinweis: ${a}`));
  }

  // Schutz vor Rechnungsbetrug: neue Bankverbindung oder neuer Lieferant mit Bankverbindung
  if (['rechnung', 'gutschrift'].includes(extraction.doc_type)) {
    if (ibanStatus === 'neu') reasons.push('Bankverbindung des Ausstellers ist neu (bisher andere IBAN)');
    if (ibanStatus === 'neuer_aussteller') reasons.push('Erste Rechnung dieses Ausstellers mit Bankverbindung');
  }

  if (verificationRequired) {
    if (!verification || !verification.ok) {
      reasons.push(`Prüf-Agent nicht verfügbar: ${(verification && verification.error) || 'kein Ergebnis'}`);
    } else {
      const v = verification.data;
      const diffs = compareCritical(extraction, v.corrected);
      const findings = (v.findings || []).filter((f) => f.severity === 'fehler' || f.severity === 'warnung');
      if (v.verdict === 'unsicher') reasons.push('Prüf-Agent: Dokument erlaubt keine sichere Aussage');
      if (v.verdict === 'korrigiert') reasons.push('Prüf-Agent hat Werte korrigiert');
      if (diffs.length > 0) reasons.push(...diffs.map((d) => `Agenten uneinig: ${d}`));
      if (findings.length > 0) reasons.push(...findings.map((f) => `Prüf-Agent: ${f.field}: ${f.problem}`));
      // Bei Übereinstimmung der kritischen Felder gilt die Fassung des Prüfers; sie muss alle Regeln erfüllen
      if (diffs.length === 0) {
        final = v.corrected;
        const re = revalidate ? revalidate(final) : null;
        if (re) {
          reasons.push(...re.errors.map((e) => `Prüfregel nach Prüfung: ${e}`));
          reasons.push(...re.warnings.filter((w) => !w.startsWith('KI-Hinweis')).map((w) => `Warnung nach Prüfung: ${w}`));
        }
      }
    }
  } else if (validation.warnings.length > 0) {
    reasons.push(...validation.warnings.map((w) => `Warnung: ${w}`));
  }

  const gross = validation.checks.gross;
  if (gross != null && Math.abs(gross) >= settings.review_above_gross) {
    reasons.push(`Betrag ${gross} über Freigabegrenze ${settings.review_above_gross}: Vier-Augen-Prinzip`);
  }
  if (extraction.doc_type === 'sonstiges') reasons.push('Dokumenttyp nicht erkannt');

  return { outcome: reasons.length === 0 ? 'auto' : 'review', reasons: [...new Set(reasons)], final };
}

if (typeof module !== 'undefined') module.exports = { needsVerification, compareCritical, decide };
