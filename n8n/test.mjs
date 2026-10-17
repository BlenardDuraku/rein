// Tests für die Code-Nodes: node n8n/test.mjs
// Führt die JS-Dateien mit nachgebildeten n8n-Variablen ($input, $, $execution) aus.
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
const dir = dirname(fileURLToPath(import.meta.url));
const run = (file, ctx) => {
  const src = readFileSync(`${dir}/${file}`, 'utf8');
  const items = ctx.items ?? [];
  const $input = { first: () => items[0], all: () => items };
  const $ = (n) => ({ first: () => ctx.nodes[n], item: ctx.nodes[n] });
  const $execution = { resumeUrl: 'https://n8n.example.at/webhook-waiting/123?signature=abc' };
  return new Function('$input', '$', '$execution', src)($input, $, $execution);
};
let fail = 0; const check = (name, cond) => { console.log(cond ? 'OK  ' : 'FAIL', name); if (!cond) fail++; };

// anfrage-pruefen
const ap = (body) => run('anfrage-pruefen.js', { items: [{ json: { body } }] })[0].json;
check('valid request', ap({ name: 'Max Muster', email: 'Max@Example.at', service: 'Wintergärten', message: '<b>x</b>' }).valid);
check('honeypot = spam', ap({ name: 'Bot', email: 'a@b.cc', website: 'http://x' }).spam);
check('invalid email rejected', !ap({ name: 'Max', email: 'nope' }).valid);
check('message escaped', ap({ name: 'Max', email: 'a@b.at', message: '<b>x</b>' }).html.message === '&lt;b&gt;x&lt;/b&gt;');

// lead-vorbereiten
const tok = '3f2a6b1c-1111-4222-8333-444455556666';
const lead = run('lead-vorbereiten.js', { items: [{ json: { token: tok } }], nodes: { 'Anfrage prüfen': { json: { data: { name: 'Max', email: 'm@x.at', phone: '', service: 'Wintergärten', message: 'Hi' } } } } })[0].json;
check('lead row status neu', lead.row.status === 'neu' && lead.row.token === tok && lead.row.followUps === 0 && lead.row.name === 'Max');
check('buttons use derived URL', lead.buttonsHtml.includes(`https://n8n.example.at/webhook/duraku-status?t=${tok}&amp;a=angebot`));

// status-seite
const page = (q) => run('status-seite.js', { items: [{ json: { query: q } }] })[0].json.html;
check('confirm page valid', page({ t: tok, a: 'auftrag' }).includes('Auftrag erhalten') && page({ t: tok, a: 'auftrag' }).includes('action="duraku-status-ok"'));
check('confirm page rejects bad action', page({ t: tok, a: '<script>' }).includes('Ungültiger Link'));
check('confirm page rejects bad token', page({ t: '"><x', a: 'angebot' }).includes('Ungültiger Link'));
check('confirm page rejects proto key', page({ t: tok, a: 'toString' }).includes('Ungültiger Link'));

// status-pruefen
const sp = (body, rows) => run('status-pruefen.js', { items: rows.map((r) => ({ json: r })), nodes: { 'Status bestätigt': { json: { body } } } })[0].json;
const row = { token: tok, name: '<b>Max</b>', status: 'neu' };
let r = sp({ t: tok, a: 'angebot' }, [row]);
check('change neu->angebot', r.changed && r.status === 'angebot' && r.html.includes('&lt;b&gt;Max'));
r = sp({ t: tok, a: 'neu' }, [row]); check('reject unknown action', !r.changed && r.html.includes('ungültig'));
r = sp({ t: 'x', a: 'angebot' }, [{}]); check('not found (empty result)', !r.changed && r.html.includes('nicht gefunden'));
r = sp({ t: tok, a: 'neu' === 'x' ? '' : 'angebot' }, [{ ...row, status: 'angebot' }]); check('same status no change', !r.changed && r.html.includes('bereits'));
r = sp({ t: 'other', a: 'angebot' }, [row]); check('token mismatch', !r.changed);

// nachfassen
const ago = (h) => new Date(Date.now() - h * 36e5).toISOString();
const base = { token: tok, name: 'Max', email: 'm@x.at', phone: '', service: 'Fensterreinigung', message: 'a\nb', ownerReminded: 0, followUps: 0, reviewSent: 0 };
const nf = (rows, review = '') => {
  let src = readFileSync(`${dir}/nachfassen.js`, 'utf8');
  if (review) src = src.replace("const GOOGLE_REVIEW_URL = '';", `const GOOGLE_REVIEW_URL = '${review}';`);
  const items = rows.map((r) => ({ json: r }));
  return new Function('$input', '$execution', src)({ all: () => items }, { resumeUrl: 'https://n8n.example.at/webhook-waiting/9' }).map((i) => i.json);
};
let o = nf([{ ...base, status: 'neu', createdAt: ago(21), statusAt: ago(21) }]);
check('owner reminder after 20h', o.length === 1 && o[0].kind === 'erinnerung' && o[0].to === 'duraku-glanz@outlook.com' && o[0].update.ownerReminded === 1 && o[0].html.includes('webhook/duraku-status?t='));
check('no reminder after 10h', nf([{ ...base, status: 'neu', createdAt: ago(10), statusAt: ago(10) }]).length === 0);
check('no second reminder', nf([{ ...base, status: 'neu', ownerReminded: 1, createdAt: ago(50), statusAt: ago(50) }]).length === 0);
o = nf([{ ...base, status: 'angebot', createdAt: ago(100), statusAt: ago(73) }]);
check('followup 1 after 3d', o.length === 1 && o[0].kind === 'nachfrage-1' && o[0].to === 'm@x.at' && o[0].update.followUps === 1);
check('no followup at 2d', nf([{ ...base, status: 'angebot', createdAt: ago(100), statusAt: ago(48) }]).length === 0);
o = nf([{ ...base, status: 'angebot', followUps: 1, createdAt: ago(200), statusAt: ago(24 * 7 + 1) }]);
check('followup 2 after 7d', o.length === 1 && o[0].kind === 'nachfrage-2' && o[0].update.followUps === 2);
check('stop after 2 followups', nf([{ ...base, status: 'angebot', followUps: 2, createdAt: ago(900), statusAt: ago(800) }]).length === 0);
check('no review without URL', nf([{ ...base, status: 'erledigt', createdAt: ago(100), statusAt: ago(30) }]).length === 0);
o = nf([{ ...base, status: 'erledigt', createdAt: ago(100), statusAt: ago(30) }], 'https://g.page/r/abc/review');
check('review with URL', o.length === 1 && o[0].kind === 'bewertung' && o[0].html.includes('g.page/r/abc/review') && o[0].update.reviewSent === 1);
o = nf([{ ...base, name: '<img src=x>', status: 'angebot', createdAt: ago(100), statusAt: ago(80) }]);
check('html escaped in customer mail', !o[0].html.includes('<img') && o[0].html.includes('&lt;img'));
check('auftrag/abgesagt ignored', nf([{ ...base, status: 'auftrag', createdAt: ago(900), statusAt: ago(900) }, { ...base, status: 'abgesagt', createdAt: ago(900), statusAt: ago(900) }]).length === 0);
console.log(fail ? `${fail} FEHLGESCHLAGEN` : 'Alle Tests bestanden');
process.exit(fail ? 1 : 0);
