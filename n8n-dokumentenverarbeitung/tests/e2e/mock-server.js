// Simulierter Claude-API- und ERP-Server für den End-to-End-Test.
// Spielt gezielt Ausfälle ein: erster KI-Aufruf → 529 (überlastet), erster ERP-Aufruf → 500.
const http = require('node:http');
const log = [];
let claudeCalls = 0;
let erpCalls = 0;
let claudeMode = 'normal'; // normal | down

const extraction = {
  doc_type: 'rechnung', language: 'de',
  issuer: { name: 'Muster Bau GmbH', address: 'Linz', vat_id: 'ATU13585627', iban: 'AT611904300234573201' },
  recipient: { name: 'Kunde AG', address: 'Wien', vat_id: null, iban: null },
  document_number: 'RE-2026-001', document_date: '2026-10-20', order_reference: 'B-77', delivery_date: null,
  due_date: '2026-11-19', currency: 'EUR',
  line_items: [{ position: '1', article_number: 'A1', description: 'Gipskarton', quantity: 10, unit: 'Stk', unit_price: 12.5, net_amount: 125, tax_rate: 20 }],
  totals: { net: 125, tax: 25, gross: 150 }, payment_terms: '30 Tage',
  field_confidence: { doc_type: 0.99, issuer: 0.98, document_number: 0.97, document_date: 0.97, line_items: 0.96, totals: 0.98 },
  anomalies: [], summary: 'Rechnung',
};

function reply(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

http.createServer((req, res) => {
  let raw = '';
  req.on('data', (c) => { raw += c; });
  req.on('end', () => {
    let body = {};
    try { body = JSON.parse(raw || '{}'); } catch (e) { /* */ }
    log.push({ at: new Date().toISOString(), path: req.url, headers: req.headers, model: body.model, system: (body.system || '').slice(0, 40), keys: Object.keys(body) });
    if (req.url === '/log') return reply(res, 200, log);
    if (req.url.startsWith('/mode/')) { claudeMode = req.url.slice(6); return reply(res, 200, { claudeMode }); }
    if (req.url === '/v1/messages') {
      claudeCalls++;
      if (req.headers['x-api-key'] !== 'test-key') return reply(res, 401, { type: 'error', error: { type: 'authentication_error', message: 'invalid x-api-key' } });
      if (claudeCalls === 1 || claudeMode === 'down') return reply(res, 529, { type: 'error', error: { type: 'overloaded_error', message: 'Overloaded' } });
      const isVerify = String(body.system || '').startsWith('Du bist ein unabhängiger Prüfer');
      const parts = (body.messages && body.messages[0] && body.messages[0].content) || [];
      let result;
      if (isVerify) {
        // Prüfer bestätigt das übergebene Ergebnis unverändert
        const t = parts.map((p) => p.text || '').join('');
        const m = /<ergebnis>([\s\S]*)<\/ergebnis>/.exec(t);
        result = { verdict: 'bestaetigt', corrected: m ? JSON.parse(m[1]) : extraction, findings: [] };
      } else {
        // Belegnummer aus dem Dokument lesen ("NR:...") – so verhält sich der Mock je Dokument anders
        const doc = parts.find((p) => p.type === 'document');
        const raw = doc ? Buffer.from(doc.source.data, 'base64').toString('latin1') : '';
        const nr = (/NR:([\w-]+)/.exec(raw) || [])[1] || 'RE-2026-001';
        result = { ...extraction, document_number: nr };
      }
      const text = JSON.stringify(result);
      return reply(res, 200, { id: 'msg_test', type: 'message', role: 'assistant', model: body.model, stop_reason: 'end_turn',
        content: [{ type: 'thinking', thinking: '' }, { type: 'text', text }], usage: { input_tokens: 1200, output_tokens: 300 } });
    }
    if (req.url === '/erp') {
      erpCalls++;
      if (erpCalls === 1) return reply(res, 500, { fehler: 'ERP gerade nicht verfügbar' });
      return reply(res, 201, { ok: true, beleg: 'ERP-4711' });
    }
    reply(res, 404, {});
  });
}).listen(18080, '127.0.0.1', () => console.log('Mock läuft auf 18080'));
