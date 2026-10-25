// JSON-Schema für die strukturierte Ausgabe der KI. Die API garantiert,
// dass die Antwort genau diesem Schema entspricht.

const nullable = (type) => ({ anyOf: [{ type }, { type: 'null' }] });

const PARTY = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'address', 'vat_id', 'iban'],
  properties: {
    name: nullable('string'),
    address: nullable('string'),
    vat_id: nullable('string'),
    iban: nullable('string'),
  },
};

const DOC_TYPES = ['bestellung', 'auftragsbestaetigung', 'lieferschein', 'rechnung', 'gutschrift', 'angebot', 'anfrage', 'sonstiges'];

const EXTRACTION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['doc_type', 'language', 'issuer', 'recipient', 'document_number', 'document_date', 'order_reference',
    'delivery_date', 'due_date', 'currency', 'line_items', 'totals', 'payment_terms', 'field_confidence', 'anomalies', 'summary'],
  properties: {
    doc_type: { type: 'string', enum: DOC_TYPES },
    language: { type: 'string' },
    issuer: PARTY,
    recipient: PARTY,
    document_number: nullable('string'),
    document_date: nullable('string'),
    order_reference: nullable('string'),
    delivery_date: nullable('string'),
    due_date: nullable('string'),
    currency: nullable('string'),
    line_items: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['position', 'article_number', 'description', 'quantity', 'unit', 'unit_price', 'net_amount', 'tax_rate'],
        properties: {
          position: nullable('string'),
          article_number: nullable('string'),
          description: { type: 'string' },
          quantity: nullable('number'),
          unit: nullable('string'),
          unit_price: nullable('number'),
          net_amount: nullable('number'),
          tax_rate: nullable('number'),
        },
      },
    },
    totals: {
      type: 'object',
      additionalProperties: false,
      required: ['net', 'tax', 'gross'],
      properties: { net: nullable('number'), tax: nullable('number'), gross: nullable('number') },
    },
    payment_terms: nullable('string'),
    field_confidence: {
      type: 'object',
      additionalProperties: false,
      required: ['doc_type', 'issuer', 'document_number', 'document_date', 'line_items', 'totals'],
      properties: {
        doc_type: { type: 'number' },
        issuer: { type: 'number' },
        document_number: { type: 'number' },
        document_date: { type: 'number' },
        line_items: { type: 'number' },
        totals: { type: 'number' },
      },
    },
    anomalies: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
  },
};

const VERIFICATION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['verdict', 'corrected', 'findings'],
  properties: {
    verdict: { type: 'string', enum: ['bestaetigt', 'korrigiert', 'unsicher'] },
    corrected: EXTRACTION_SCHEMA,
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['field', 'problem', 'severity'],
        properties: {
          field: { type: 'string' },
          problem: { type: 'string' },
          severity: { type: 'string', enum: ['info', 'warnung', 'fehler'] },
        },
      },
    },
  },
};

if (typeof module !== 'undefined') module.exports = { EXTRACTION_SCHEMA, VERIFICATION_SCHEMA, DOC_TYPES };
