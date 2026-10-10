# n8n-Workflow: Website-Anfragen

Das Kontaktformular der Website schickt Anfragen an n8n. n8n prüft sie, schickt
Duraku eine formatierte Mail und dem Kunden eine automatische Bestätigung.

```
Website-Formular ──► Webhook ──► Anfrage prüfen ──► Spam? ──ja──► 200 (still verworfen)
                                     │                 │
                                     │ (Fehler)        nein
                                     ▼                 ▼
                              Fehler 500 ◄──┐       Gültig? ──nein──► 400 + Fehlermeldungen
                                            │          │ ja
                                            └─(Fehler)─ Mail an Duraku (3 Versuche)
                                                        ▼
                                              Bestätigung an Kunden ──► 200 OK
```

Bei einer 500-Antwort öffnet die Website automatisch das Mailprogramm. So geht keine Anfrage verloren.

## Einrichten

1. In n8n: **Workflows → Import from File** → `duraku-anfrage-workflow.json`.
2. In den Nodes **Mail an Duraku** und **Bestätigung an Kunden**: Microsoft-Outlook-Zugangsdaten
   (OAuth2) für `duraku-glanz@outlook.com` anlegen bzw. auswählen.
3. Workflow **aktivieren**, im Node **Anfrage empfangen** die **Production URL** kopieren.
4. In `index.html` (beide Kopien) die URL eintragen:
   ```js
   var WEBHOOK_URL = 'https://DEIN-N8N/webhook/duraku-anfrage';
   ```
   Solange das Feld leer ist, funktioniert das Formular wie bisher über das Mailprogramm.
5. Optional: Im Webhook-Node unter *Allowed Origins (CORS)* `*` durch die echte Domain der Website ersetzen.

## Dateien

| Datei | Zweck |
|---|---|
| `duraku-anfrage-workflow.json` | Workflow zum Importieren (wird erzeugt) |
| `anfrage-pruefen.js` | Code des Nodes „Anfrage prüfen“ (Validierung, Spamschutz, HTML-Escaping) |
| `build.mjs` | Erzeugt die JSON-Datei: `node n8n/build.mjs` |

Änderungen am Workflow in `build.mjs` bzw. `anfrage-pruefen.js` machen und danach neu erzeugen.
