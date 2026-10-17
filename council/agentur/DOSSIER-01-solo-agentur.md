# DOSSIER 01: Solo-KI-Automatisierungsagentur starten

**Convened:** 2026-10-17. **Question:** Soll der Gründer alleine eine KI-Prozessautomatisierungs-Agentur starten, und wie soll er mit der Lücke umgehen, dass Claude die Workflows baut, er selbst n8n aber nicht gut beherrscht?

This is the identical factual record every member works from. **Check it and report where it is
wrong, incomplete or mis-posed.** Later numbered addenda (ADDENDUM-01A, 01B, ...) win where
they conflict with this file.

## 0. The question in one line

Agentur ja oder nein, in welcher Form, und welches Liefermodell (wer baut, wer versteht, wer wartet) passt zu einem 20-jährigen Solo-Gründer in Linz mit KI als Werkzeug.

## 1. Options on the table

| Option | What it means | Reversible? | Rough cost / time |
|---|---|---|---|
| Do nothing | Keine Agentur; Fokus auf VetScribe-SaaS und bestehenden Reinigungsbetrieb | ja | 0 € |
| Agentur, Claude baut n8n-Workflows | Gründer verkauft, Claude erstellt die Workflows, Gründer lernt nebenbei | ja | n8n ab ca. 20–60 €/Monat oder Self-Hosting; Zeit für Akquise |
| Agentur, Claude schreibt Code statt n8n | Automatisierungen als Skripte/Programme mit Claude Code statt visuellem Tool | ja | ähnlich; höhere Einarbeitung für Verständnis |
| Nischen-Agentur + VetScribe | Automatisierung nur für eine Branche (z. B. Tierarztpraxen), VetScribe mitverkaufen | ja | wie oben, Fokus auf eine Branche |
| Erst lernen, dann verkaufen | 1–3 Monate eigene/gratis Projekte bauen, bevor zahlende Kunden kommen | ja | Zeit, kein Umsatz in dieser Phase |

## 2. Market or domain

- Zielkunden: KMU in Oberösterreich/Österreich mit wiederkehrender Büroarbeit (E-Mails, Belege, Angebote, Datenübertrag zwischen Programmen).
- Wettbewerb nach Typ: klassische IT-Dienstleister, andere Solo-Automatisierer und Agenturen, Software-Hersteller mit eingebauten KI-Funktionen, Firmen, die selbst mit KI-Werkzeugen automatisieren.
- Werkzeuge: n8n (visuelles Workflow-Tool, selbst hostbar oder Cloud), vergleichbare Tools, KI-Modelle per API, KI-Coding-Assistenten.
- Marktgröße für OÖ: nicht ermittelt (siehe §6).

## 3. Goal, constraints and success measures

- **Goal:** Bis zu 300.000 € Umsatz pro Jahr alleine; langfristig tragfähig; wenig belastender Kundenkontakt.
- **Measure of success:** Umsatz, Anteil wiederkehrender Einnahmen, Stunden pro Woche, Stabilität der Kundenlösungen.
- **Constraints:** eine Person; wenig Kapital (Annahme); Gründer fühlt sich bei technischen Fachfragen im Kundengespräch unsicher; österreichisches Recht.
- **Who decides, and by when:** der Gründer; kein fixes Datum.

## 4. Facts

| # | Fact | Source | Date of source |
|---|---|---|---|
| F1 | IT-Dienstleistungen ("Dienstleistungen in der automatischen Datenverarbeitung und Informationstechnik", § 153 GewO) sind in Österreich ein freies Gewerbe (kein Befähigungsnachweis). | RIS § 153 GewO; WKO-Gründungsmappe IT | RIS-Fassung seit 2002; WKO-Mappe ohne Datum |
| F2 | Kleinunternehmergrenze Umsatzsteuer in Österreich: 55.000 € brutto pro Jahr seit 1.1.2025; bis 10 % Überschreitung toleriert. | usp.gv.at, Kleinunternehmerregelung ab 2025 | 2025 |
| F3 | n8n steht unter der "Sustainable Use License". Workflows für Kunden zu bauen und zu beraten gilt als erlaubt. Kundenworkflows und Zugangsdaten dauerhaft auf einer eigenen n8n-Instanz zu hosten und als Dienst zu verkaufen, erfordert laut Community-Antworten und Drittanbieter-Guides eine kostenpflichtige Lizenz. | community.n8n.io (Forum-Threads); nordflux.de; ssdnodes.com. Primärer Lizenztext nicht erreicht. | 2025–2026 |
| F4 | n8n Cloud: Starter ca. 20–24 €/Monat, Pro ca. 50–60 €/Monat (ausführungsbasiert); Community Edition selbst gehostet ohne Lizenzgebühr. | mehrere Drittanbieter-Preisübersichten 2026 | 2026 |
| F5 | EU AI Act Art. 4 (KI-Kompetenz) gilt seit 2.2.2025 für Anbieter und Betreiber von KI-Systemen. | TÜV-Consulting, Fraunhofer Academy u. a. | 2025 |
| F6 | Gründer: 20 Jahre, Linz; betreibt einen Fensterreinigungsbetrieb (Gewerbe Reinigung); hat einen VetScribe-Prototyp (KI-Dokumentation für Tierärzte) bauen lassen; kennt n8n nicht gut. | Aussage des Gründers | 2026-10 |

## 5. Estimates and assumptions

| # | Estimate or assumption | Basis or method | What would falsify it |
|---|---|---|---|
| E1 | 300.000 €/Jahr wären z. B. 10 Projekte × 8.000 € plus 30 Wartungsverträge × 500 €/Monat (≈ 260.000 €). | Rechenbeispiel; Preise aus früherer Beratung, nicht aus Marktdaten | Echte Angebote in OÖ werden zu deutlich niedrigeren Preisen angenommen |
| E2 | Eine Person hat nach Akquise und Verwaltung ca. 1.200–1.400 verrechenbare Stunden pro Jahr. 300.000 € entsprechen dann ca. 215–250 € pro Stunde effektiv. | Annahme: 45 Arbeitswochen, 40–50 % der Zeit verrechenbar | Zeiterfassung im ersten Jahr |
| E3 | KI-Werkzeuge können lauffähige n8n-Workflows (JSON) und Skripte erzeugen; Qualität bei Fehlerbehandlung und Sonderfällen ist schwankend. | Allgemeine Erfahrung, keine Messung | Test: 5 echte Workflows bauen und Fehlerquote messen |
| E4 | Gründer hat wenig Startkapital. | Annahme | Aussage des Gründers |

## 6. What is not known

- Typischer Umsatz von Solo-Automatisierungsagenturen in Österreich: keine Daten gefunden (gesucht: allgemeine Websuche; keine Statistik erreicht). Nicht gefunden heißt nicht, dass es keine gibt.
- Zahlungsbereitschaft von KMU in OÖ für Automatisierung: keine Daten.
- Wie schnell der Gründer n8n/Integrationen lernt: nicht gemessen.
- Ob es eine Änderung von AI Act Art. 4 durch ein EU-Omnibus-Paket 2026 gibt: in Sekundärquellen erwähnt, nicht verifiziert.

## 7. Positions already held

- Der Gründer neigt zur Agentur mit Claude-gebauten Workflows (Position zu prüfen).
- Eine frühere KI-Beratung hat eine Nischen-Agentur für Prozessautomatisierung plus VetScribe empfohlen und von KI-Werbung abgeraten (Position zu prüfen, nicht Fakt).

## 8. What the council is asked

1. Soll der Gründer eine Solo-Automatisierungsagentur starten, und in welcher Form?
2. Ist das Liefermodell "Claude baut, Gründer versteht es nur teilweise" tragfähig? Was muss der Gründer mindestens selbst können?
3. Wie soll er mit Fachfragen von Kunden umgehen, die er nicht beantworten kann?
4. Ist 300.000 €/Jahr alleine realistisch, und in welchem Zeitraum?
5. What is the cheapest step that would settle the biggest open question, and what result would change the decision?
