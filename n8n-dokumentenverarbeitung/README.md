# Ausfallsichere KI-Dokumentenverarbeitung mit n8n und Claude

Eingehende Geschäftsdokumente (Rechnungen, Bestellungen, Lieferscheine, Angebote, Anfragen) werden automatisch gelesen, von einem zweiten KI-Agenten gegengeprüft, gegen feste Regeln validiert und an das ERP übergeben. Was nicht eindeutig ist, landet bei einem Menschen. Ein Dokument geht nie verloren und wird nie doppelt verbucht.

Ausgelegt für Konzerne mit mehreren Gesellschaften (Mandanten) und tausenden Dokumenten pro Tag.

## Was das System macht

```
 E-Mail-Postfach ─┐                                   ┌─► ERP (HTTP, mit Idempotenz-Schlüssel)
 Scanner / Portal ┼─► Eingang ─► Warteschlange ─► KI ─┤
 (HTTP-Upload)    │   (Zwischen-   (PostgreSQL)   │   └─► Exportdatei (Ersatzweg / Archiv)
                  │    speicher)                  │
                  │                               ├─► Prüf-Agent (zweites Augenpaar)
                  │                               ├─► Feste Prüfregeln (Summen, IBAN, UID, Datum)
                  │                               └─► Mensch (Prüfliste über API)
                  │
 Wachhund, Alarm-Versand, Notfall-Alarm und Wiederherstellung laufen daneben.
```

| Workflow | Aufgabe |
|---|---|
| DF 01 Eingang E-Mail | Liest ein Postfach, zerlegt Anhänge. Eine E-Mail ohne Anhang wird selbst zum Dokument, z. B. eine Anfrage. |
| DF 02 Eingang HTTP | Upload-Schnittstelle für Scanner, Portale und andere Systeme (`POST /webhook/dokument-eingang`) |
| DF 03 Verarbeitung | Die KI-Agenten: Auslesen, Gegenprüfen, Regeln anwenden, entscheiden |
| DF 04 Export ERP | Übergabe ans ERP; bei Ausfall zusätzlich als Datei |
| DF 05 Wachhund | Holt hängende Aufträge zurück, erkennt Staus, sendet ein Lebenszeichen und um 6:55 Uhr den Tagesbericht |
| DF 06 Alarm-Versand | Teams/Slack → E-Mail → Datei, jeweils als Ersatz für den vorherigen Kanal |
| DF 07 Zwischenspeicher nachholen | Übernimmt Dateien, die während eines Datenbankausfalls angekommen sind |
| DF 08 API Prüfung und Status | Prüfliste, Freigabe, Originaldokument, Kennzahlen für das Dashboard |
| DF 09 Fehlerbehandlung | Fängt jeden Absturz eines Workflows ab |
| DF 10 Notfall-Alarm | Alarmiert auch dann, wenn die Datenbank weg ist |

## Die KI-Agenten

1. **Auslese-Agent** (Claude Opus 5.5): liest PDF, Bild, Text oder XML und liefert ein festes JSON-Schema mit Kopfdaten, Positionen, Summen, Bankverbindung, einer Sicherheit je Feld und Auffälligkeiten. Die strukturierte Ausgabe der API garantiert gültiges JSON.
2. **Prüf-Agent** (Claude Opus 5.5, höhere Denktiefe): bekommt das Original und das Ergebnis, prüft jedes Feld, rechnet nach und korrigiert bei Bedarf. Er läuft, wenn:
   - das Dokument eine Rechnung oder Gutschrift ist,
   - der Betrag über der Prüfgrenze liegt,
   - die KI unsicher war,
   - oder eine Regel warnt.
3. **Feste Prüfregeln** (ohne KI):
   - Netto + Steuer = Brutto, Positionssummen, Menge × Preis
   - IBAN-Prüfziffer und österreichische UID-Prüfziffer
   - gültige Daten, kein Datum in der Zukunft, Pflichtfelder je Dokumenttyp
   - Duplikate (gleiche Belegnummer beim gleichen Aussteller)
4. **Vier-Augen-Prinzip der Agenten:** Automatisch freigegeben wird nur, wenn beide Agenten bei den kritischen Feldern übereinstimmen: Belegnummer, Datum, IBAN, Summen und Anzahl der Positionen. Zusätzlich gilt:
   - Der Prüf-Agent hat nichts korrigiert und keine Warnung gemeldet.
   - Die KI hat keine Auffälligkeit notiert.
   - Alle Regeln sind erfüllt.

   Sonst entscheidet ein Mensch.
5. **Schutz vor Rechnungsbetrug:** Die IBAN wird mit früheren freigegebenen Belegen desselben Ausstellers verglichen (gleiche UID, IBAN oder bereinigter Firmenname). Eine neue Bankverbindung oder die erste Rechnung eines neuen Lieferanten geht immer an einen Menschen. Das prüft die Datenbank, nicht die KI.
6. **Freigabegrenze:** Ab einem einstellbaren Betrag (Standard 50.000 €) prüft immer ein Mensch, und es braucht **zwei verschiedene Personen** für die Freigabe.

Schutz gegen manipulierte Dokumente (Prompt-Injection): Die KI behandelt den Dokumentinhalt ausdrücklich als Daten, hat keine Werkzeuge und kann nur das Schema ausfüllen. Ein Täuschungsversuch landet als Auffälligkeit beim Menschen, und die festen Regeln prüfen zusätzlich, zum Beispiel eine geänderte IBAN.

## Für jeden Fehler ein Ersatz

| Was ausfällt | Was passiert |
|---|---|
| Claude überlastet (429/529), Zeitüberschreitung, 5xx | Bis zu 3 Wiederholungen im Knoten, dann **Ersatzmodell** (Claude Sonnet 5.5), dann ein neuer Versuch nach 1, 5, 15, 60, 240 und 720 Minuten |
| Claude lehnt eine Anfrage ab (Sicherheitsfilter) | Automatischer Ersatz über `fallbacks: "default"` direkt in der API, sonst an den Menschen |
| Claude fällt flächendeckend aus | **Schutzschalter**: Die Verarbeitung pausiert 5 Minuten, statt Versuche zu verbrennen. Alarm. Alle Dokumente bleiben in der Warteschlange. |
| Anfrage wird abgewiesen (HTTP 400) | Ersatzmodell ohne Zusatzfunktionen, sonst an den Menschen |
| API-Schlüssel ungültig (401/403) | Sofortiger kritischer Alarm. Die Dokumente warten und werden nach der Korrektur verarbeitet. |
| Prüf-Agent fällt aus | Ersatz-Prüfer (zweites Modell). Fällt auch der aus, entscheidet ein Mensch. Ohne Prüfung gibt es nie eine automatische Freigabe. |
| Datenbank fällt beim Eingang aus | Die Datei wird in den **Zwischenspeicher** geschrieben. Der Absender bekommt trotzdem eine Bestätigung, ein Notfall-Alarm geht raus, DF 07 holt die Datei automatisch nach. Dateien, die sich über eine Stunde nicht übernehmen lassen, lösen einen Alarm aus. |
| Datenbank UND Zwischenspeicher fallen aus | HTTP-Absender bekommt `503` und sendet erneut. Bei E-Mail geht ein Notfall-Alarm mit der Message-ID raus. |
| n8n oder ein Worker stürzt mitten in der Verarbeitung ab | Der Auftrag ist gesperrt, aber nicht verloren. Der Wachhund gibt ihn nach Ablauf der Sperre frei. |
| Zwei Worker greifen gleichzeitig zu | `FOR UPDATE SKIP LOCKED`: Jeder Auftrag geht an genau einen Worker. Ein verspäteter Worker kann ein Ergebnis nicht überschreiben. |
| Dieselbe Datei kommt zweimal | Erkennung über SHA-256 je Mandant. Es entsteht kein zweiter Auftrag, der Eingang wird im Protokoll vermerkt. |
| Dieselbe Rechnung als anderer Scan, auch gleichzeitig auf zwei Workern | Duplikatprüfung über Belegnummer und Aussteller. Sie wird beim Speichern unter einer Datenbanksperre wiederholt, damit nie zwei Kopien automatisch durchgehen. |
| E-Mail wurde in Outlook schon geöffnet | Wird trotzdem geholt. Mails werden nicht als gelesen markiert. |
| Anhang mit unbekanntem Typ (z. B. Word, Excel) | Wird nicht verworfen, sondern geht mit Begründung an einen Menschen. Nur kleine Bilder wie Signatur-Logos werden ausgelassen und vermerkt. |
| Leere oder kaputte Datei | Wird zum Prüffall und reißt die anderen Dokumente derselben E-Mail nicht mit. |
| Einstellung versehentlich ungültig | Die Schutzgrenzen werden nicht still abgeschaltet. Alles geht zur Prüfung. |
| ERP nicht erreichbar | Postausgang (Outbox) mit Wiederholungen. Ab dem 3. Versuch wird zusätzlich eine Exportdatei abgelegt. Das ERP bekommt einen `Idempotency-Key`, damit eine Wiederholung nicht doppelt bucht. Jeder Export gehört genau einem Lauf, ein verspäteter Lauf kann den Status nicht überschreiben. |
| Teams/Slack-Alarm schlägt fehl | E-Mail, danach eine Datei im Alarmordner. Scheitert auch die Datei, folgt der Notfall-Alarm. |
| Datenbank fällt ganz aus | Notfall-Alarm über Umgebungsvariablen statt Datenbank, entprellt (höchstens alle 15 Minuten dieselbe Meldung) |
| Ganzes System steht | Externer **Totmann-Schalter** (`heartbeat_url`, z. B. Healthchecks). Bleibt das Lebenszeichen aus, alarmiert der externe Dienst. |
| Dokument nicht lesbar, zu groß oder Typ unbekannt | An den Menschen, mit Grund |

## Getestet

- **Logik:** 17 Unit-Tests (`npm test`): Prüfregeln, IBAN und UID, Entscheidungen, Anfragen, Fehlerklassen, Schema-Vorgaben.
- **Datenbank:** alle Funktionen gegen PostgreSQL 16 getestet.
- **Ende-zu-Ende in n8n 2.44.6** mit simuliertem Claude- und ERP-Server (`tests/e2e/mock-server.js`). Alle Fälle wurden real durchgespielt:
  - Upload, Schlüsselprüfung (403), Duplikat (200) und falscher Dateityp (415)
  - Claude überlastet → Ersatzmodell → Prüf-Agent → automatische Freigabe
  - ERP gibt 500 → erneuter Versuch → zugestellt, dazu die Exportdatei
  - Datenbank abgeschaltet während eines Uploads → Zwischenspeicher, Bestätigung an den Absender, Notfall-Alarm → nach dem Neustart automatisch nachgeholt
  - Duplikat → Prüfliste → Originaldokument abrufen → falsches Token abgelehnt → Freigabe mit Korrektur → Export
  - Claude komplett ausgefallen → wiederholte Versuche → Schutzschalter offen und Alarm → nach Ende des Ausfalls verarbeitet

- **Wiederholbarer Ende-zu-Ende-Test:** `tests/e2e/run.sh` mit 15 Prüfpunkten, zuletzt alle bestanden. Er deckt ab:
  - neuer Lieferant → Prüfung
  - Schlüsseltrennung der APIs
  - Freigabe ohne Token wird abgelehnt
  - Freigabe mit Prüfer aus dem Header
  - zweite Rechnung → automatisch
  - Duplikat als anderer Scan
  - Datenbankausfall → Zwischenspeicher → Nachholen und Notfall-Alarm
- **Unabhängige Schwachstellenanalyse:** Ein separater KI-Agent hat das System gezielt auf Datenverlust, Doppelverarbeitung, Wettlaufsituationen und Sicherheitslücken untersucht. Alle 15 Befunde sind behoben, die Tests oben laufen nach den Korrekturen.

**Nicht getestet:** echte Claude-Antworten auf echte Belege, echtes ERP, E-Mail-Postfach (IMAP) und SMTP. Vor dem Produktivbetrieb deshalb einen Pilot mit 100–200 echten, anonymisierten Belegen fahren und die Ergebnisse stichprobenartig prüfen.

## Einrichtung

1. `cp .env.example .env` und die Werte eintragen. Dann `docker compose up -d`. Das Schema `sql/001_schema.sql` wird beim ersten Start automatisch angelegt.
2. In n8n diese **Zugangsdaten** anlegen. Die Namen müssen genau so lauten; nach dem Import die Zugangsdaten in den Knoten einmal auswählen.
   - `DF Postgres`: Datenbank docflow
   - `DF Anthropic API`: Typ *Header Auth*, Name `x-api-key`, Wert = API-Schlüssel
   - `DF API-Schlüssel`: Typ *Header Auth*, z. B. Name `X-API-Key` und ein langer Zufallswert. Für Upload und Status. Diesen Schlüssel bekommen Scanner und Portale.
   - `DF Prüfer-API`: eigener Schlüssel nur für die Prüfoberfläche. Damit können Scanner nie selbst freigeben.
   - `DF Postfach Eingang`: IMAP
   - `DF SMTP`: Mailversand für Alarme und Tagesbericht
3. Workflows importieren: `n8n import:workflow --separate --input=workflows/`, danach alle außer DF 09 und DF 10 aktivieren. Diese beiden laufen nur, wenn sie aufgerufen werden.
4. Einstellungen in der Datenbank setzen, mindestens:
   ```sql
   update docflow.settings set value = '"https://erp.example.at/api/belege"' where key = 'erp_url';
   update docflow.settings set value = '"https://example.webhook.office.com/..."' where key = 'alert_webhook_url';
   update docflow.settings set value = '"buchhaltung@example.at"' where key = 'alert_email_to';
   update docflow.settings set value = '"https://hc-ping.com/<id>"' where key = 'heartbeat_url';
   ```
5. Für jede weitere Gesellschaft mit eigenem Postfach DF 01 kopieren und im Knoten *E-Mail zerlegen* den `MANDANT` ändern. Beim HTTP-Upload kommt der Mandant aus dem Header `X-Mandant`.
6. Aufräumen per Cron auf dem Host: Exportdateien und den Zwischenspeicher nach z. B. 30 Tagen löschen. Der Zwischenspeicher enthält nur Dateien aus Datenbankausfällen. Die Belege selbst liegen revisionssicher in der Datenbank (`retention_until`, standardmäßig 7 Jahre nach § 132 BAO).

## Einstellungen (Tabelle `docflow.settings`)

| Schlüssel | Standard | Bedeutung |
|---|---|---|
| `model_primary` / `model_secondary` | `claude-opus-5-5` / `claude-sonnet-5-5` | Haupt- und Ersatzmodell |
| `anthropic_url` | Claude-API | Alternativ ein eigenes KI-Gateway |
| `confidence_auto` | 0.90 | Ab dieser Sicherheit gilt ein Feld als sicher |
| `verify_above_gross` | 1000 | Prüf-Agent ab diesem Bruttobetrag |
| `review_above_gross` | 50000 | Ab hier immer Mensch |
| `always_verify_types` | rechnung, gutschrift | Diese Typen prüft immer der Prüf-Agent |
| `max_attempts`, `backoff_minutes` | 6, [1,5,15,60,240,720] | Wiederholungen |
| `circuit_*` | 6 Aufrufe, 80 %, 5 min | Schutzschalter |
| `export_mode` | both | `http`, `file` oder `both` |
| `stale_queue_minutes` | 30 | Alarm, wenn ein Dokument länger wartet |

## Schnittstellen (für Dashboard und Prüfoberfläche)

Upload und Status mit `DF API-Schlüssel`, alle Prüf-Aufrufe mit `DF Prüfer-API`. Den Namen des Prüfers am besten ein SSO-Proxy im Header `X-Pruefer` setzen lassen, dann kann ihn niemand im Anfragetext fälschen.

| Aufruf | Zweck |
|---|---|
| `POST /webhook/dokument-eingang` | Datei hochladen (multipart, ein Feld). Header `X-Mandant`, optional `X-Referenz` und `X-Prioritaet` (kleiner = früher). |
| `GET /webhook/pruefung/offen?mandant=…` | Offene Prüffälle mit Gründen, Ergebnissen beider Agenten und Token |
| `GET /webhook/dokument?job_id=…&token=…` | Originaldatei für die Prüfansicht |
| `POST /webhook/pruefung/entscheidung` | `{job_id, token, entscheidung: freigeben/ablehnen/erneut_verarbeiten, daten?}`, Prüfer aus `X-Pruefer` oder `pruefer`. Über der Freigabegrenze ist eine zweite Freigabe durch eine andere Person nötig. |
| `POST /webhook/export/erneut` | `{job_id}`: einen endgültig fehlgeschlagenen Export nach Behebung der Ursache erneut senden |
| `GET /webhook/status?mandant=…` | Kennzahlen: heute, 7 und 30 Tage, Automatisierungsquote, Warteschlange, KI-Verbrauch |

## Kosten (Schätzung)

Listenpreise Claude Opus 5.5: 4 $ pro Million Eingabe-Token, 20 $ pro Million Ausgabe-Token. Ein zweiseitiger Beleg braucht grob 5.000 Eingabe- und 2.000 Ausgabe-Token, also etwa **0,06 $**. Mit dem Prüf-Agenten sind es etwa **0,15 $**. Das sind Schätzungen; echte Werte stehen nach dem Pilot in `docflow.llm_calls`. Für große Rückstände ohne Eile wäre die Batch-API halb so teuer.

## Rechtliches und Betrieb

- **n8n-Lizenz:** n8n steht unter der *Sustainable Use License*. Ein Unternehmen darf es für eigene interne Zwecke betreiben. Ein Dienstleister richtet es deshalb auf der Infrastruktur des Kunden ein, nicht als eigenen Dienst für mehrere Kunden. Funktionen wie SSO oder Log-Streaming brauchen die n8n-Enterprise-Lizenz des Kunden.
- **Datenschutz:** Belege enthalten personenbezogene Daten. Nötig sind ein Auftragsverarbeitungsvertrag mit Anthropic und, falls ein Dienstleister das System betreut, auch mit diesem. Für das KI-Gateway bzw. den Datenstandort gelten die Vorgaben des Kunden.
- **EU AI Act:** Belegverarbeitung ist keine Hochrisiko-Anwendung. Die Mitarbeitenden, die Prüffälle bearbeiten, sollten wissen, dass eine KI vorsortiert hat.
- Rechtliche Punkte vor dem Echtbetrieb mit der Rechtsabteilung bzw. Datenschutzbeauftragten klären.

## Entwicklung

```
npm test               # Logik-Tests
node build/build.mjs   # Workflows neu erzeugen (workflows/*.json)
DF_DEBUG=1 node build/build.mjs   # zusätzlich alle Ausführungen speichern (Fehlersuche)
```

Die Logik der Code-Knoten liegt in `src/lib/` und wird beim Build in die Workflows eingebettet. Änderungen also dort machen, nicht in den JSON-Dateien.
