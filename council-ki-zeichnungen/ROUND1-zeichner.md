# ROUND 1: Konstrukteur / technischer Zeichner (Endnutzer) (zeichner)

**Dossier:** DOSSIER-01-ki-zeichnungsableitung-f-r-maschinenbau.md. **Addenda read:** keine vorhanden (Ordner geprüft, keine ADDENDUM-01*.md).
**Round 1, independent:** no other member's report was read before this one was written.

**Position:** Erst A, aber als Werkbank-Recherche (eigene Zeichnungen gegen die native SolidWorks-2026-Automatik testen und Konstrukteure befragen), keine Desk-Recherche; danach ein enger Assistent (C) für eine Teilefamilie, der Vorschläge markiert und keine Toleranzen vergibt. D allein lehne ich ab.
**Confidence:** medium

## 1. Position and why

1. **Die Konkurrenz ist das Update, das ich schon habe, nicht DraftAid.** SolidWorks 2026 erzeugt laut Hersteller und mehreren Resellern Ansichten, Bohrungsbeschriftungen und vorgeschlagene Maße als Startblatt, das man nachbearbeitet (F2, siehe auch eigene Suche §3). Ein Zusatztool ist für mich nur dann etwas wert, wenn ich damit *weniger korrigieren muss als mit der Bordfunktion*. Das kann niemand am Schreibtisch klären, man muss es an echten Teilen ausprobieren.
2. **Was mir Zeit frisst, ist nicht das Anordnen der Ansichten, sondern Änderungen und das Prüfen.** (Annahme aus der Sicht dieses Sitzes.) Ansichten platzieren und Bohrungstabellen setzen geht mit Vorlagen und Makros schon heute schnell. Teuer sind die Bemaßung nach Funktion und Fertigung (Bezugssystem, Prüfmaße, was die Werkstatt braucht) und Revisionen, bei denen Maße „hängen“ bleiben. Ein Produkt, das nur die Erstableitung beschleunigt, verfehlt den größeren Teil der Zeit.
3. **Ein versteckter Maßfehler kostet mehr als jede Ersparnis.** Mein Kürzel steht im Schriftfeld. Wenn ich jede KI-Zeichnung Maß für Maß gegen das Modell prüfen muss, weil ich nicht sehe, was die KI gesetzt hat, spare ich nichts. Das Tool muss deshalb jedes automatisch gesetzte Element sichtbar kennzeichnen (Layer/Farbe/Attribut „KI-Vorschlag, ungeprüft“), bis ich es bestätige.
4. **Assistent statt Automat.** Vollautomatische Zeichnungen inklusive Toleranzen lehne ich ab. Brauchbar wäre ein Assistent, der Vorschläge macht, die ich einzeln annehme, und der lernt, wie *unsere* Werksnorm aussieht (Schriftfeld, Ansichtsanordnung, Bemaßungsstil). Hier, und nicht in der „KI konstruiert“-Vision, liegt die mögliche Lücke gegenüber der Bordfunktion (A1). Belegt ist sie noch nicht.
5. **Was ich gewinne oder verliere:** Gewinne ich Zeit für Konstruktion, bin ich dafür. Wird das Tool aber zur Leistungsmessung („Zeichnungen pro Stunde“) genutzt oder als Argument gegen eine Neubesetzung, verliere ich, und die Akzeptanz in der Abteilung fällt. Dass ich beim Kauf wenig mitrede, heißt nicht, dass ich es nicht still boykottieren kann.

## 2. Where the dossier is wrong, incomplete or mis-posed

- **Option A ist falsch zugeschnitten.** Als Desk-Research (Wettbewerb, Preise) beantwortet A die entscheidende Frage nicht, nämlich ob die Bordfunktion für KMU-Teile mit Werksnorm „gut genug“ ist. Eine Option „A′: Werkbanktest“ fehlt: 20 echte Teile mit der nativen SolidWorks-2026-Funktion ableiten und die Korrekturzeit stoppen. Das ist billiger als C und aussagekräftiger als D.
- **Die Erfolgsmessung im Dossier ist unvollständig.** „Freigabe ohne wesentliche Nacharbeit“ (§3) misst nicht, wie lange das Prüfen dauert. Eine KI-Zeichnung, die ohne Änderung freigegeben wird, für die ich aber 40 Minuten prüfen musste, ist kein Gewinn. Gemessen werden muss *Erzeugen + Prüfen + Korrigieren* gegen *Selbstzeichnen*, und dazu die Zahl der versteckten Fehler, die erst später gefunden werden.
- **E1 (30–50 % Zeichnungszeit) ist unbelegt**, das räumt das Dossier selbst ein. Meine Persona-Karte nennt 50–70 %, das ist eine Archetyp-Annahme und ebenfalls kein Beleg. Außerdem fehlt die Aufteilung in Neuableitung, Änderung/Revision und Prüfung, und genau davon hängt der Produktzuschnitt ab (siehe 1.2).
- **Änderungsmanagement fehlt völlig.** Das Dossier spricht nur über die Erstableitung. Was passiert mit KI-Maßen, wenn sich das Modell ändert? Wie verhält sich das Tool im PDM-Freigabeprozess (Revision, Index)?
- **Baugruppen- und Schweißzeichnungen sind nicht erwähnt.** Im Sondermaschinenbau sind sie häufig, und dort sind Positionsnummern und Stücklistenlogik das Mühsame. Das Dossier nennt die Stückliste nur als Feature.
- **F2 zu GD&T sollte vorsichtiger formuliert werden.** Eigene Suche (siehe §3): Ein Reseller-Blog nennt die automatisch gesetzten Form-/Lagetoleranzen „basic“, sie müssen geprüft und ergänzt werden. Unabhängige Tests mit Genauigkeitswerten habe ich nicht gefunden. Gesucht habe ich in einer einzigen Websuche, das ist nicht dasselbe wie „es gibt keine“.
- **Die Frage, wer die Zeichnung verantwortet, beantwortet das Dossier nur aus Herstellersicht** (F11). Wer intern unterschreibt (Ersteller/Prüfer) und wie eine KI-Beteiligung dokumentiert wird, ist offen. Das ist meine Kernfrage.

## 3. Evidence

| Claim | Type | Source or method |
|---|---|---|
| SolidWorks 2026 erzeugt Startblatt mit Ansichten und vorgeschlagenen Maßen, Beta, Nacharbeit nötig, GD&T „basic“ | fact (Hersteller + Reseller, keine unabhängige Prüfung) | Eigene Websuche 2026-10-21: blogs.solidworks.com „Skip the Blank Sheet…“; javelin-tech.com, goengineer.com, solidprofessor.com „What's New for Drawings“ |
| Unabhängige Genauigkeitsmessung der Bordfunktion existiert | unbekannt: in einer Websuche nichts gefunden, nicht ausgeschlossen | wie oben |
| Hauptzeitfresser sind Funktionsbemaßung, Änderungen und Prüfung, nicht das Ansichtslayout | assumption (Sitz-Erfahrung) | prüfbar per Zeiterfassung, siehe §5 |
| Prüfaufwand kann die Ersparnis auffressen, wenn KI-Elemente nicht gekennzeichnet sind | estimate | Überlegung: Ohne Kennzeichnung muss jedes Maß gegen das Modell geprüft werden, also ungefähr so lange wie beim Selbstbemaßen eines einfachen Teils |
| DraftAid setzt keine Toleranzen | fact (Herstellerangabe) | F6, draftaid.io/faq (nicht selbst geprüft) |
| Endnutzer-Ablehnung bei Leistungsüberwachung | assumption | Persona-Rote-Linie; in DE zudem betriebsverfassungsrechtlich relevant (Mitbestimmung bei technischen Überwachungseinrichtungen, §87 BetrVG). Rechtliche Details gehören zum Juristen |

## 4. Risks from this seat

- **A (Desk):** Sie bestätigt bloß, „es gibt einen Markt“, und übersieht, dass die Bordfunktion für viele Teile reicht. Das Risiko ist ein leiser Fehlstart.
- **B:** Sie ist für mich ohne Wirkung, aber Architektur ohne Praxistest optimiert womöglich das Falsche (Erstableitung statt Änderung).
- **C (zu breit):** Mehrarbeit durch Korrekturen, Frust, und das Tool landet nach drei Wochen in der Schublade. Das ist ein offensichtlicher Fehler.
- **C (vollautomatisch, ohne Kennzeichnung):** Ein **leiser Fehler**: Ein plausibel aussehendes, falsches Maß oder eine falsche Toleranz geht durch, weil der Prüfer der „fertig“ aussehenden Zeichnung vertraut. Für mich ist das das schlimmste Szenario, weil mein Kürzel darauf steht.
- **D:** Klicks von Geschäftsführern sagen nichts darüber, ob Konstrukteure das Tool im Alltag nutzen. Ein Abo, das gekauft und nicht genutzt wird, ist ein Scheinerfolg.
- **E:** Für mich harmlos. Die Bordfunktion wird ohnehin besser.

## 5. The cheapest decisive step

**Werkbanktest in 1–2 Tagen:** 20 reale Einzelteile einer Teilefamilie (z. B. Frästeile oder Blech) aus einem KMU nehmen, mit der nativen SolidWorks-2026-Automatik und der Firmenvorlage ableiten und von einem erfahrenen Konstrukteur werkstattfertig machen lassen. Gemessen werden die Zeit für *Erzeugen + Prüfen + Korrigieren* gegen die Zeit für Selbstzeichnen (Stichprobe oder Erfahrungswert) sowie die Zahl der Fehler, die ein zweiter Prüfer danach noch findet. Parallel fünf Konstrukteure fragen, wie sich ihre Zeichnungszeit auf Neuableitung, Änderung und Prüfung verteilt.

**Vorab festgelegt:** Braucht die Bordfunktion inklusive Korrektur **weniger als 50 %** der Selbstzeichen-Zeit und bleiben keine versteckten Maßfehler übrig, ist die Lücke für ein Zusatztool zu klein, und ich wechsle zu **E** bzw. „nur, wenn Werksnorm-Lernen nachweislich mehr bringt“. Liegt sie **über 70 %** oder erzeugt sie mehrere versteckte Fehler, ist die Lücke real, und ich unterstütze **C als Assistent** für diese Teilefamilie. Dazwischen entscheidet, ob der Zeitanteil der Änderungen groß ist. Ist er groß, gehört der Zuschnitt auf Änderungen statt auf die Erstableitung.

## 6. Conditions and red lines

- Jedes von der KI gesetzte Element ist bis zur Bestätigung sichtbar markiert. Ein Protokoll zeigt, was die KI gemacht hat und was ein Mensch.
- Toleranzen und Passungen werden nur vorgeschlagen und nie still gesetzt. Ihre Freigabe ist ein eigener Schritt.
- Ersteller und Prüfer bleiben Menschen. Die KI-Beteiligung wird im Schriftfeld oder PDM-Attribut dokumentiert. Ich unterschreibe nichts, was ich nicht prüfen konnte.
- Das Tool erfasst keine personenbezogene Arbeitsgeschwindigkeit und hat kein Leistungs-Dashboard über Einzelne.
- Es läuft in meinem SolidWorks, bricht meine Vorlagen und Werksnormen nicht und lässt sich abschalten. Wird es ausgeschaltet, bleibt die Zeichnung ganz normal bearbeitbar (keine toten Maße).
- Ich lehne ab: das Versprechen „vollautomatisch, keine Prüfung nötig“ und eine Einführung, ohne dass Konstrukteure im Pilot mitmessen.

## 7. One line

Ich kaufe, nutze und verantworte nur einen markierenden Assistenten, der mir nachweislich mehr Zeit spart als das SolidWorks-Update, das ich ohnehin bekomme. Deshalb zuerst 20 echte Teile gegen die Bordfunktion testen, dann eng bauen oder es lassen.
