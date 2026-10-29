# n8n: Anfrage-zu-Auftrag-System

Drei Workflows, die zusammen jede Website-Anfrage bis zum Auftrag begleiten.
Duraku muss nur noch kontrollieren und per Klick den Status setzen.

```
Website-Formular ──► 1. Website-Anfragen ──► Tabelle „duraku_anfragen“ (Status: neu)
                         │                         ▲
                         ├─► Mail an Duraku mit Status-Buttons
                         └─► Bestätigung an den Kunden
                                                   │
Klick auf Button ──► 2. Status-Buttons ────────────┘  (Bestätigungsseite → Status speichern)

Täglich 9 Uhr ──► 3. Nachfassen
                    ├─ „neu“ seit 20 Std.            → Erinnerung an Duraku
                    ├─ „Angebot gesendet“ seit 3 Tg.  → 1. Nachfrage beim Kunden
                    ├─ „Angebot gesendet“ seit 7 Tg.  → 2. (letzte) Nachfrage
                    └─ „Erledigt“ seit 1 Tag          → Bitte um Google-Bewertung
```

**Status:** neu → Angebot gesendet → Auftrag erhalten → Erledigt (oder Abgesagt).
Bei „Auftrag erhalten“ und „Abgesagt“ hört das Nachfassen auf.

## Einrichten

Voraussetzung: n8n mit „Data tables“ (aktuelle n8n-Version).

1. **Workflows importieren:** In n8n *Workflows → Import from File*, nacheinander:
   `duraku-nachfassen-workflow.json`, `duraku-status-workflow.json`, `duraku-anfrage-workflow.json`.
2. **Tabelle anlegen:** Im Workflow „Nachfassen“ unten den Node *Einmalig: Tabelle anlegen* einmal ausführen.
3. **Outlook verbinden:** In allen Outlook-Nodes (Anfragen: 2, Nachfassen: 1) die Zugangsdaten für
   `duraku-glanz@outlook.com` wählen.
4. **Google-Bewertungslink** (optional): Im Workflow „Nachfassen“, Node *Fällige Aktionen*, `GOOGLE_REVIEW_URL`
   eintragen. Den Link gibt es im Google-Unternehmensprofil unter „Nach Rezensionen fragen“. Leer = keine Bewertungsmails.
5. **Alle drei Workflows aktivieren.**
6. **Website verbinden:** Production URL des Webhooks „Anfrage empfangen“ in `index.html` (beide Kopien) eintragen:
   ```js
   var WEBHOOK_URL = 'https://DEIN-N8N/webhook/duraku-anfrage';
   ```
7. **Testen:** Eine Anfrage über die Website schicken, in der Mail auf „Angebot gesendet“ klicken und bestätigen.
   Der Status ist dann unter *Data tables → duraku_anfragen* zu sehen.

Die Status-Buttons ermitteln die Adresse der n8n-Instanz automatisch. Zeigen sie ins Leere, in den Nodes
*Lead vorbereiten* und *Fällige Aktionen* `STATUS_URL_OVERRIDE` auf `https://DEIN-N8N/webhook/duraku-status` setzen.

## Sicherheit und Datenschutz

- Jede Anfrage bekommt einen zufälligen Schlüssel; nur wer die Mail hat, kann den Status ändern.
- Ein Klick öffnet erst eine Bestätigungsseite. Link-Scanner von Mailprogrammen ändern so nichts.
- Alle Kundendaten werden vor dem Einfügen in Mails entschärft (kein eingeschleustes HTML).
- Jede Mail an Kunden enthält einen Abmeldehinweis. **Hinweis, keine Rechtsberatung:** Bewertungsbitten
  per E-Mail gelten rechtlich oft als Werbung. Vor dem Einschalten prüfen lassen, ob eine Einwilligung
  (z. B. Häkchen im Formular) nötig ist.
- Die Tabelle wächst mit jeder Anfrage. Alte Einträge (z. B. älter als 2 Jahre) regelmäßig löschen.

## Dateien

| Datei | Zweck |
|---|---|
| `duraku-*-workflow.json` | Workflows zum Importieren (erzeugt von `build.mjs`) |
| `anfrage-pruefen.js` | Prüfung, Spamschutz und Entschärfung der Formulardaten |
| `lead-vorbereiten.js` | Datensatz und Status-Buttons für neue Anfragen |
| `status-seite.js`, `status-pruefen.js` | Bestätigungsseite und Prüfung der Status-Klicks |
| `nachfassen.js` | Regeln fürs tägliche Nachfassen und die Mail-Texte |
| `build.mjs` | Erzeugt die JSON-Dateien: `node n8n/build.mjs` |
| `test.mjs` | Tests der Code-Bausteine: `node n8n/test.mjs` |

Änderungen in den `.js`-Dateien machen, dann `node n8n/test.mjs` und `node n8n/build.mjs` ausführen.
