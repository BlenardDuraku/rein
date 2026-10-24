# ROUND 1: Recht und Regulierung (EU AI Act, Gewerbe AT) (recht)

**Dossier:** DOSSIER-01-gruendungsideen.md. **Addenda read:** keine (im Ordner existiert kein ADDENDUM-01*.md).
**Round 1, independent:** no other member's report was read before this one was written.

**Position:** O1 (nebenberuflich testen) mit I5 oder I1, aber erst nach schriftlicher Klärung des Arbeitsvertrags und Gewerbeanmeldung im freien IT-Gewerbe. I2 nur mit schriftlicher Zustimmung des Arbeitgebers, I3 nur ohne Ernährungsberatung.
**Confidence:** medium

## 1. Position and why

Rangfolge nach rechtlicher und regulatorischer Machbarkeit (keine Rechtsberatung):

1. **I5 Vorlagen/Kurse/Content:** geringstes Risiko. Offen sind Konsumentenrecht (FAGG-Widerruf bei digitalen Inhalten, Impressum nach ECG/MedienG) und die Umsatzsteuer bei B2C-Verkauf an Kunden in DE.
2. **I1 KI-Automatisierung für KMU:** freies IT-Gewerbe (Annahme, mit WKO zu bestätigen). Pflichten: Auftragsverarbeitungsvertrag nach Art. 28 DSGVO, n8n-Betrieb auf der Instanz des Kunden, Haftungsbegrenzung im Vertrag. Zwei Fallen: "Buchhaltungsvorbereitung" darf keine Buchhaltung oder Lohnverrechnung werden (vorbehalten nach BiBuG). Und das Angebot nicht "Unternehmensberatung" nennen, weil das ein reglementiertes Gewerbe ist.
3. **I4 Telefon-/Terminassistent:** machbar. Pflicht zur KI-Offenlegung nach Art. 50 AI Act. Dazu kommen Sprachdaten nach DSGVO, Aufzeichnung nur mit Einwilligung (§ 120 StGB beachten) und Drittlandtransfers über die Voice-Anbieter.
4. **I3 nur als Trainingskonzepte:** "Fitnesstrainer" ist ein freies Gewerbe. Individuelle Ernährungsberatung ist auch für Gesunde reglementiert (siehe 2.). Ein KI-Chat zu Gesundheit verschärft die Haftung.
5. **I6 Ticket-/Ersatzteil-Automatisierung:** gewerberechtlich wie I1. Die Kunden sind aber Maschinenbetreiber, also potenziell Kunden des Arbeitgebers. Das wirft Fragen zu Treuepflicht und Konkurrenz auf.

**Nicht in den Top 5: I2.** Hier ist die Nähe zum Arbeitgeber maximal: urheberrechtlich geschützte Handbücher, Geschäftsgeheimnisse (§§ 26a ff. UWG), mögliche Diensterfindung (§§ 6–7 PatG) und direkte Konkurrenz zu den digitalen Service-Tools des Arbeitgebers. Das berührt meine rote Linie. Ohne schriftliche Zustimmung des Arbeitgebers lehne ich I2 ab.

**Kernthese:** Das größte Rechtsrisiko liegt in keiner einzelnen Idee, sondern im **Arbeitsvertrag**. Wer ihn verletzt, riskiert die Entlassung, also das Einkommen, auf dem der ganze Plan beruht.

## 2. Where the dossier is wrong, incomplete or mis-posed

- **F8 ist irreführend.** "Für Gesunde gibt es Wege über bestimmte Gewerbe" klingt nach einem freien Zugang. Laut WKO ist Ernährungsberatung auch für Gesunde Teil des reglementierten Gewerbes "Lebens- und Sozialberatung eingeschränkt auf Ernährungsberatung" (§ 119 GewO). Dafür braucht man ein Studium der Ernährungswissenschaften oder die Diätologie-Ausbildung. Das Fitnesstrainer-Gewerbe deckt Ernährungsberatung ausdrücklich nicht.
- **F9 ist veraltet.** Laut Kanzlei-Sekundärquellen ist der "AI Omnibus" (VO (EU) 2026/1744) am 27.07.2026 in Kraft getreten. Hochrisiko-Pflichten nach Anhang III gelten danach ab 02.12.2027, für Anhang-I-Produkte ab 02.08.2028. Für diese Ideen relevanter sind die Transparenzpflichten nach Art. 50 und die KI-Kompetenzpflicht nach Art. 4. Keine der Ideen ist nach meiner Einschätzung Hochrisiko-KI. Ausnahme: I2/I6, falls sie in Sicherheitsfunktionen von Maschinen eingreifen.
- **F5 braucht eine Präzisierung.** Laut n8n-FAQ ist der Bau von Workflows für Kunden erlaubt, wenn die Kunden sie nicht selbst erstellen oder bearbeiten können. Setup, Wartung und Beratung dürfen verrechnet werden. Riskant ist eine gemeinsame Instanz mit den Zugangsdaten vieler Kunden. Eine Community-Antwort wertet das als "n8n as a service". Den Lizenztext selbst konnte ich nicht abrufen: docs.n8n.io war aus der Sandbox nicht erreichbar.
- **F7 ist richtig, aber unvollständig.** Die Grenze von 55.000 € brutto muss auch im Vorjahr eingehalten sein. Die Toleranz beträgt 10 % (60.500 €). Bei B2C-Digitalverkauf in die EU (I5) gelten eigene Leistungsort-Regeln.
- **F10 ist unvollständig.** Die Entgeltgrenze für Konkurrenzklauseln liegt 2026 laut Sekundärquellen bei 4.620 € brutto im Monat. Ein 20-jähriger Techniker liegt vermutlich darunter (Annahme). Eine nachvertragliche Klausel wäre dann wohl unwirksam. Während des Dienstverhältnisses gelten aber die Treuepflicht und, falls er Angestellter ist, das **Konkurrenzverbot nach § 7 AngG**. Ob er Angestellter oder Arbeiter ist, ist unbekannt und rechtlich entscheidend.
- **Es fehlen:** Sozialversicherung (GSVG-Pflicht bzw. Ausnahme, Mehrfachversicherung neben dem ASVG, zu klären bei der SVS), NeuFöG-Befreiung, unbeschränkte Haftung als Einzelunternehmer (Betriebshaftpflicht), Arbeitnehmererfindungen und Geschäftsgeheimnisse.

## 3. Evidence

| Claim | Type | Source or method |
|---|---|---|
| Ernährungsberatung für Gesunde ist reglementiert (LSB eingeschränkt) | fact | WKO NÖ/Vbg/Sbg, Seiten zur Ernährungsberatung und LSB-Tätigkeitskatalog (Websuche 24.10.2026) |
| Fitnesstrainer ist ein freies Gewerbe ohne Ernährungsberatung | fact | WKO OÖ/Stmk/Vbg, Infoblätter Fitnesstrainer |
| AI Omnibus in Kraft; Hochrisiko ab 12/2027 bzw. 08/2028 | fact (Sekundärquellen) | Kanzlei-Alerts (z. B. Lewis Silkin, 27.07.2026); Amtsblatt nicht selbst geprüft |
| Kleinunternehmer: 55.000 € brutto, 10 % Toleranz, Vorjahresprüfung | fact | USP.gv.at; KPMG AT (2025) |
| n8n: Kunden-Workflows erlaubt, Kunden dürfen sie nicht bearbeiten | fact (FAQ) | n8n License FAQ laut Suchergebnis; Lizenztext nicht gelesen |
| Konkurrenzklausel-Grenze 2026: 4.620 € | fact (Sekundärquelle) | WKO/Kanzleiseiten; Originaldokument nicht gefunden |
| IT-Dienstleistungen sind ein freies Gewerbe | assumption | Dossier F6; nicht selbst verifiziert |
| Keine der Ideen ist Hochrisiko-KI | estimate | eigener Abgleich mit Anhang III; nicht verbindlich |
| Gehalt unter 4.620 € | assumption | Alter und Beruf |

## 4. Risks from this seat

- **Die leise Gefahr:** Er startet I1/I6 und gewinnt einen Kunden, der zugleich Kunde des Arbeitgebers ist. Monate später kommt die Entlassung wegen Vertrauensunwürdigkeit oder Konkurrenz. Vorher merkt man nichts.
- **I1:** Ein Datenleck beim Kunden ohne AV-Vertrag oder ein fehlerhafter Workflow, der Rechnungen oder Angebote verschickt, führt zu unbeschränkter persönlicher Haftung.
- **I3:** eine Abmahnung bzw. ein Verwaltungsstrafverfahren wegen unbefugter Gewerbeausübung, dazu Haftung bei Gesundheitsschäden.
- **I4:** Ein Verstoß gegen die Offenlegungspflicht oder eine Aufzeichnung ohne Einwilligung trifft auch den Betrieb des Kunden. Das kostet Reputation.
- **O0** hat aus Sicht dieser Rolle kein Rechtsrisiko, aber auch keinen Lerneffekt.

## 5. The cheapest decisive step

Er liest den eigenen Dienstvertrag und die Dienstordnung bzw. den Kollektivvertrag (Klauseln zu Nebenbeschäftigung, Geheimhaltung, Erfindungen, Konkurrenz). Danach lässt er das kostenlos bei der **AK OÖ** prüfen und klärt die Gewerbefrage beim **WKO Gründerservice OÖ**. Kosten: 0 €, Dauer: 1–2 Wochen.

**Festgelegtes Ergebnis:** Wenn der Vertrag jede Nebenbeschäftigung genehmigungspflichtig macht, rückt O0 bzw. das Einholen der Genehmigung vor jede Idee. Wenn der Arbeitgeber I2/I6 schriftlich genehmigt, hebe ich I2 auf Platz 2. Wenn der Vertrag freie Tätigkeit außerhalb des Geschäftszweigs erlaubt, bleibe ich bei I5/I1.

## 6. Conditions and red lines

- **Voraussetzungen:** Gewerbe angemeldet, AV-Vertrag und AGB mit Haftungsbegrenzung (Anwalt einmalig), n8n auf Kundeninstanzen, KI-Offenlegung bei I4, Steuerberater für die Umsatzsteuer und die SVS-Frage.
- **Rote Linien:** kein Firmen-Know-how, keine Kundendaten und keine Handbücher des Arbeitgebers. Keine individuelle Ernährungsberatung ohne Befähigung. Kein Start von I2/I6 ohne schriftliche Klärung.

## 7. One line

Rechtlich am sichersten sind I5 und I1 als nebenberuflicher Test. Vor dem ersten Kunden muss der Arbeitsvertrag geprüft sein, und I2 sowie die Ernährungsberatung bleiben tabu, bis Arbeitgeber bzw. Befähigung es erlauben.
