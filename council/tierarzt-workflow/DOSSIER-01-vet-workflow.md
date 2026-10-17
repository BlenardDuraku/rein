# DOSSIER 01: High-End Bürokratie-Workflow für Tierarztpraxen

**Convened:** 2026-10-17. **Question:** Welchen Umfang und welche Form soll ein KI-Produkt haben, das Tierarztpraxen die Bürokratie abnimmt?

This is the identical factual record every member works from. **Check it and report where it is
wrong, incomplete or mis-posed.** Later numbered addenda (ADDENDUM-01A, 01B, ...) win where
they conflict with this file.

## 0. The question in one line

Was soll das Produkt übernehmen, für wen zuerst, und soll es die bestehende Praxissoftware ersetzen oder ergänzen?

## 1. Options on the table

| Option | What it means | Reversible? | Rough cost / time |
|---|---|---|---|
| Do nothing | VetScribe bleibt reiner Dokumentations-Prototyp | ja | 0 |
| A. Nur Dokumentation perfektionieren | Diktat → Bericht, Besitzerbrief, Leistungen; nichts weiter | ja | gering |
| B. KI-Schicht über bestehender Praxissoftware | Ein Gespräch/Diktat erzeugt alle Folgedokumente (Bericht, Besitzerinfo, Rechnungsentwurf, Versicherungsunterlagen, Abgabebeleg-Entwurf, Erinnerungen, Überweisungsbrief); Übergabe an die vorhandene Praxissoftware per Schnittstelle, Export oder Kopieren | ja | mittel |
| C. Eigene komplette Praxissoftware | Termine, Patientenakte, Abrechnung, Hausapotheke, Meldungen, alles neu | schwer | sehr hoch |
| D. Nutztier-Fokus | Bestandsbetreuung, Abgabebelege, Antibiotika-Meldedaten | ja | mittel–hoch |

## 2. Market or domain

- **Deutschland:** 11.216 niedergelassene Tierärzt:innen (31.12.2025), davon 8.644 in Einzelpraxen; 5.930 Kleintier-, 989 Pferde-, 718 Nutztierpraktiker (Mehrfachzuordnung möglich). Zahl der *Praxen* wird nicht erfasst.
- **Österreich:** keine Statistik gefunden (gesucht: allgemeine Websuche).
- **Bestehende Software:** Praxen nutzen in der Regel ein Praxisverwaltungssystem (PVS) mit Patientenakte, Abrechnung, Hausapotheke; in DE z. B. Vetera, easyVET, debevet, inBehandlung (laut Vergleichsartikeln, keine Marktanteile bekannt).
- **KI-Doku-Wettbewerber:** international mehrere KI-Schreibassistenten für Tierärzte (z. B. ScribbleVet, VetRec, Talkatoo, HappyDoc); deutsche Sprachqualität und EU-Hosting unklar.

## 3. Goal, constraints and success measures

- **Goal:** Ein Produkt, für das Praxen gern einen hohen Monatspreis zahlen, weil es täglich messbar Arbeit abnimmt.
- **Measure of success:** gesparte Minuten pro Tierarzt/Tag; Anteil Praxen, die nach Test zahlen; Fehlerquote in erzeugten Dokumenten.
- **Constraints:** ein Gründer mit KI; DSGVO; Tierarzneimittelrecht; Praxen haben bereits ein PVS.
- **Who decides, and by when:** der Gründer; kein fixes Datum.

## 4. Facts

| # | Fact | Source | Date of source |
|---|---|---|---|
| F1 | DE: 11.216 niedergelassene Tierärzt:innen, 5.930 Kleintierpraktiker. | Bundestierärztekammer, Statistik 2025 | 2025-12-31 |
| F2 | DE: GOT (Gebührenordnung für Tierärzte) ist verbindlich, 1- bis 4-facher Satz, reformiert 2022. In anderen EU-Ländern gibt es laut Bundesregierung keine vergleichbare Gebührenordnung. | gesetze.legal/bund/got; BT-Drs. 21/4442 | 2022; 2026 |
| F3 | AT: Das Tierarzneimittelkontrollgesetz (TAKG) wurde zum 1.1.2024 durch das Tierarzneimittelgesetz (TAMG) abgelöst; Dokumentation von Wareneingang und -ausgang der Hausapotheke; Antibiotika-Abgabe/-Anwendung elektronisch aufzuzeichnen und an AGES zu melden (VO BGBl. II 83/2014, ggf. angepasst). | AVS-Handbuch Tierarzneimittel; RIS BGBl. II 83/2014 | 2024; 2014 |
| F4 | DE: Antibiotika-Meldepflicht für Hunde und Katzen auf 2030 verschoben (erste Meldung bis 14.1.2030). Seit 1.1.2026 Erfassung für Pferde, Schafe, Ziegen, Gänse, Enten, Kaninchen (Lebensmittel), Fische; erste Meldung bis 14.1.2027 in der TAM-DB (HI-Tier). Für Rind, Schwein, Huhn, Pute meldet der Tierarzt. | BVL-Stand 23.12.2025 (RP Gießen); DTBl 03/2026; LALLF MV | 2025–2026 |
| F5 | AT: Hunde müssen gechippt und in der Heimtierdatenbank registriert sein; Tierärzte setzen den Chip und können registrieren; laut NÖ seit 1.1.2025 Erfassung von Hund und Halterdaten beim Chippen durch den Tierarzt (ID Austria). | oesterreich.gv.at; noe.gv.at | 2025 |
| F6 | DE-Verbände (BTK, bpt u. a.) beklagen in einer Resolution wachsenden Bürokratie- und Meldeaufwand; eine repräsentative Zeitmessung für Tierarztpraxen wurde nicht gefunden. | BTK Resolution Bürokratie; doccheck; BT-Drucksache | div. |
| F7 | Tierkrankenversicherungen: Erstattung meist nach Einreichung der Rechnung durch Halter; Direktabrechnung mit Praxis nur bei einzelnen Versicherern und mit Zustimmung der Praxis. | Versicherer-Seiten (AGILA, DA Direkt) | 2026 |
| F8 | Gesundheits-/Halterdaten: EU-Hosting und Auftragsverarbeitungsvertrag (AVV) nötig, wenn ein Dienstleister Daten verarbeitet. | DSGVO Art. 28 | – |

## 5. Estimates and assumptions

| # | Estimate or assumption | Basis or method | What would falsify it |
|---|---|---|---|
| E1 | Dokumentation kostet Tierärzte 1–2 Stunden pro Tag. | Frühere Beratung; keine DACH-Messung gefunden (F6) | Zeitmessung in 5 Praxen |
| E2 | Bürokratie-Aufgaben einer Kleintierpraxis (Inventar, nicht vollständig): Behandlungsdokumentation; Besitzerinfos/Entlassungsbriefe; Rechnungen (DE: GOT-konform); Kostenvoranschläge; Versicherungsunterlagen; Überweisungs- und Befundbriefe; Laboraufträge/-befunde; Impferinnerungen, Recalls; Hausapotheke (Wareneingang/-ausgang, Abgabebelege); Betäubungsmittel-Dokumentation; Antibiotika-Aufzeichnungen; Einverständniserklärungen (OP, Narkose, Euthanasie); EU-Heimtierausweis/Impfpass; Chip-Registrierung (AT); Gesundheitszeugnisse/Reisebescheinigungen; Mahnwesen; Telefon/Terminorganisation; Röntgen-Dokumentation; Personal-/Dienstplanung; QM/Hygiene-Dokumentation. | Zusammenstellung aus Quellen F3–F7 und Allgemeinwissen; nicht vollständig geprüft | Praxisinterviews ergänzen/streichen Punkte |
| E3 | Viele dieser Aufgaben erledigt das PVS bereits teilweise (Abrechnung, Hausapotheke, Recalls). | Funktionsbeschreibungen von PVS in Vergleichsartikeln | Demo zweier PVS |
| E4 | Zahlungsbereitschaft 99–199 € pro Tierarzt und Monat für Dokumentations-KI. | Frühere Beratung; Analogie zu US-Anbietern; ungemessen | Preisgespräche mit Praxen |
| E5 | Viele PVS bieten keine offene Schnittstelle zum Schreiben in die Akte. | Annahme | Anfrage bei 3 PVS-Anbietern |

## 6. What is not known

- Wo genau die Zeit in einer Praxis verloren geht (Tierarzt vs. Empfang vs. Abend): keine Messung gefunden.
- Österreichische Praxiszahlen und PVS-Landschaft in AT: nicht gefunden.
- Ob und wie PVS Schnittstellen öffnen: nicht recherchiert.
- Deutschsprachige KI-Doku-Wettbewerber mit EU-Hosting: Suche ergab keine klare Antwort; nicht gefunden heißt nicht, dass es keine gibt.

## 7. Positions already held

- Der Gründer möchte "die komplette Bürokratie" übernehmen und ein High-End-Programm anbieten, nichts, was Praxen nicht brauchen (Position zu prüfen).
- Eine frühere KI-Beratung hat Dokumentation (SOAP, Besitzerinfo) als Einstieg empfohlen (Position zu prüfen).

## 8. What the council is asked

1. Welche Bürokratie-Aufgaben gehören in Version 1, welche später, welche nie?
2. Ersetzen (Option C) oder ergänzen (Option B) der bestehenden Praxissoftware?
3. Kleintier oder Nutztier zuerst?
4. Was darf die KI selbst erledigen, was nur als Entwurf mit Freigabe?
5. What is the cheapest step that would settle the biggest open question, and what result would change the decision?
