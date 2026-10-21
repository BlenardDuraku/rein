# ROUND 1: Qualitätssicherung / Normen (qs-normen)

**Dossier:** DOSSIER-01-ki-zeichnungsableitung-f-r-maschinenbau.md. **Addenda read:** keine vorhanden (geprüft: keine ADDENDUM-01*.md im Ordner).
**Round 1, independent:** no other member's report was read before this one was written.

**Position:** A ja, aber als Messung statt reiner Desk-Research: zuerst die native SolidWorks-2026-Autozeichnung an 10–20 echten Teilen mit QS-Fehlerklassifikation (laut/leise) prüfen; gebaut wird, wenn überhaupt, nur ein Assistent, der Ansichten, Formmaße und Schriftfeld vorschlägt und Funktionstoleranzen ausdrücklich dem Menschen lässt.
**Confidence:** medium

## 1. Position and why

1. **Der Wert und das Risiko liegen in verschiedenen Teilen der Zeichnung.** Ansichten anordnen, Schnitte setzen, Schriftfeld (ISO 7200) und Stückliste füllen ist regelhaft und fehlertolerant: ein Fehler fällt dort meist auf (laut). Funktionsmaße, Bezugssystem und Form-/Lagetoleranzen nach ISO 1101 / ISO 5459 setzen voraus, dass man die Funktion des Teils kennt. Fehler dort sehen auf dem Blatt plausibel aus und werden erst in Montage oder Reklamation sichtbar (leise). Meine Seat gewinnt durch einheitlichere Layouts und verliert massiv durch leise Toleranzfehler.
2. **„Aus Firmenzeichnungen lernen“ heißt auch: alte Fehler und alte Normstände lernen.** Altbestände enthalten Überbemaßung, fehlende Bezüge und z. B. „ISO 2768-mK“, obwohl ISO 2768-2 (die K-Klasse für Form/Lage) 2021 durch ISO 22081 ersetzt wurde (Quelle in §3). Ein Modell, das den Hausstil kopiert, reproduziert den Normstand von vor 2021. Der Bestand ist kein geprüfter Ground Truth.
3. **Die Erfolgsgröße im Dossier belohnt das Falsche.** „Freigabe ohne wesentliche Nacharbeit“ steigt auch dann, wenn Prüfer müde durchwinken. Aus QS-Sicht zählt, ob nach Freigabe mehr Normabweichungen, Fertigungsrückfragen und Reklamationen entstehen als bei manuell erstellten Zeichnungen.
4. **Die Konkurrenz besteht schon dort, wo es leicht ist.** SolidWorks 2026 erzeugt laut Reseller-Quellen Ansichten, Bohrungsbeschriftungen und sogar GD&T-Rahmen und Bezüge, im Beta-Stadium und mit Nacharbeit (F2, eigene Suche). Ein Startup, das dasselbe besser machen will, muss sich daher entweder am Hausstil/Werksnorm oder an der Prüfbarkeit unterscheiden. Prüfbarkeit (jedes Element markiert als „von KI vorgeschlagen / aus Modell-PMI übernommen / vom Menschen gesetzt“) wäre aus meiner Sicht das stärkere, für QS kaufrelevante Merkmal.
5. Option A allein als Desk-Research bringt meiner Seat nichts, weil die entscheidende Frage (wie hoch ist die Quote leiser Fehler) empirisch ist. C ohne vorher festgelegtes Prüfprotokoll lehne ich ab: dann misst man Geschwindigkeit, nicht Korrektheit. D ist für meine Seat neutral, gibt aber keinen Qualitätsbeleg.

## 2. Where the dossier is wrong, incomplete or mis-posed

- **Meine Kernfrage fehlt ganz:** Wie viel Zeichnungszeit entfällt auf Layout/Formmaße, wie viel auf Funktionstolerierung? E1 (30–50 %, unbelegt) wirft beides zusammen. Selbst wenn E1 stimmt, ist der automatisierbare Anteil kleiner.
- **F2 ist einseitig dargestellt.** Dass SolidWorks 2026 Form-/Lagetoleranzen automatisch setzt, steht im Dossier als Fähigkeit. Aus QS-Sicht ist das ein Risiko und eine Marktlücke: Wer prüft diese automatisch gesetzten Toleranzen? Außerdem erfordert die Funktion laut Reseller eine 3DEXPERIENCE-Verbindung (Cloud-Aspekt, relevant für it-datenschutz), und Beta-Funktionen sind laut Reseller nicht für Produktionsarbeit gedacht. Beides fehlt im Dossier.
- **DraftAids „80–90 % Genauigkeit“ (F6) ist ohne Definition wertlos.** Pro Zeichnung, pro Maß, pro Ansicht? Bei 50 Maßen je Zeichnung wären 10 % Fehler fünf falsche Maße je Blatt. Dass DraftAid keine Toleranzen setzt, ist ein relevanter Beleg dafür, dass der Spezialist den schwierigen Teil auslässt.
- **Normenbasis unvollständig/veraltet:** Das Dossier nennt keine Norm. Relevant sind u. a. ISO 128 (Darstellung), ISO 129-1:2018 (Bemaßung), ISO 1101/ISO 5459 (GPS, Bezüge), ISO 8015 (Grundsätze, Unabhängigkeitsprinzip), ISO 2768-1 (Allgemeintoleranzen Längen/Winkel, weiterhin gültig), ISO 22081:2021 (ersetzt ISO 2768-2), ISO 7200 (Schriftfeld). Ein Produkt, das Normkonformität prüfen kann, ist eine mögliche Differenzierung, die das Dossier nicht erwähnt.
- **Fehlende Option:** Modellbasierte Definition (PMI/MBD, z. B. DimXpert in SolidWorks, nach ISO 16792). Stehen Toleranzen bereits vom Konstrukteur im 3D-Modell, ist das Übertragen auf die Zeichnung deterministisch und braucht keine KI. Das wäre ein sicherer Zuschnitt: KI für das Layout, Toleranzen nur aus vom Menschen gesetzter PMI.
- **F11 ist richtig, aber zu kurz.** Zeichnungen sind Teil der technischen Unterlagen nach der Maschinenverordnung. Es fehlt die Konsequenz: Das Tool braucht einen nachvollziehbaren Freigabeweg und eine Kennzeichnung, wer was gesetzt hat, sonst ist das Audit-Ergebnis gefährdet. Ob das Tool selbst unter den EU AI Act fällt, ist ungeprüft (meine Annahme: eher nicht als Hochrisiko-System, das gehört aber in die Rechtsberatung).

## 3. Evidence

| Claim | Type | Source or method |
|---|---|---|
| ISO 22081:2021 ersetzt ISO 2768-2:1989; Klassen H/K/L für Form/Lage entfallen; ISO 2768-1 bleibt | fact | Websuche 2026-10-21: iteh.eu Katalog ISO 22081:2021; dinmedia.de (DIN EN ISO 22081:2022-10); Tagungsbeitrag ICMD 2022 (atlantis-press.com) |
| SolidWorks-2026-Autozeichnung erzeugt Ansichten, Schnitte, Bohrungsbeschriftungen, GD&T-Rahmen und Bezüge; Beta; Nacharbeit nötig; 3DEXPERIENCE-Verbindung nötig | fact (Sekundärquellen, Reseller) | Websuche: solidprofessor.com „SOLIDWORKS 2026 – What's New for Drawings?“; hawkridgesys.com Blog. Eine konkrete Liste unterstützter/nicht unterstützter GD&T-Elemente habe ich dort **nicht gefunden**; das heißt nicht, dass es sie nicht gibt (Release Notes nicht gelesen) |
| DraftAid setzt keine Toleranzen | fact (Herstellerangabe) | Dossier F6, draftaid.io/faq (nicht selbst nachgeprüft) |
| Fehler in Funktionstoleranzen sind meist leise, Layoutfehler meist laut | estimate | QS-Erfahrungsregel dieser Seat; nicht gemessen |
| Altbestände enthalten überholte Normverweise und Tolerierungsfehler | assumption | Plausibel wegen Normwechsel 2021; Anteil unbekannt, prüfbar per Stichprobe |
| Der automatisierbare Anteil der Zeichnungszeit ist deutlich kleiner als E1 | assumption | Folgt aus der Trennung Layout/Tolerierung; keine Daten |

## 4. Risks from this seat

- **C (Prototyp) ohne Prüfprotokoll:** Die Demo sieht gut aus, Toleranzen „passen ungefähr“, der Pilotkunde gibt frei, die Fertigung baut nach. Fehler zeigt sich Wochen später als Montageproblem. Das ist die leise Fehlerart, die ich am meisten fürchte.
- **Lernen aus Altzeichnungen:** Das Modell zementiert alte Normstände und Hausfehler, und zwar mit dem Anschein von Konsistenz.
- **Automation bias:** Je besser die Vorschläge aussehen, desto flüchtiger prüft der Konstrukteur. Die Freigabe wird zur Unterschrift ohne Prüfung. Das betrifft alle Optionen, die bis zum Produkt führen.
- **A/D allein:** Risiko für QS gering, aber sie erzeugen Zahlungsbereitschafts-Signale ohne jeden Qualitätsbeleg; das Produkt wird dann auf ein Versprechen hin verkauft, das niemand gemessen hat.
- **E:** Für meine Seat kein Schaden; der Kunde nutzt dann die native Beta-Funktion, mit genau dem Prüfproblem, das ein gutes Drittprodukt lösen könnte.

## 5. The cheapest decisive step

**Schritt:** Ein QS-Blindtest der nativen SolidWorks-2026-Autozeichnung (Kosten: eine vorhandene Lizenz, ca. 2–4 Personentage). 10–20 reale Einzelteile aus zwei Familien (z. B. Drehteil, Blechteil) automatisch ableiten lassen, mit Firmenvorlage. Ein Prüfer, der nicht weiß, welche Zeichnung von der Maschine stammt, klassifiziert jede Abweichung gegen die manuelle Referenzzeichnung: (a) Layout/Darstellung, (b) Formmaß fehlt/falsch, (c) Funktionsmaß/Toleranz/Bezug falsch, und jeweils **laut** (fällt beim normalen Prüfen auf) oder **leise** (plausibel, aber falsch). Dazu die Zeit für Korrektur messen.

**Vorab festgelegtes Ergebnis, das meine Position ändert:**
- Wenn die native Funktion bei Layout und Formmaßen schon ≥ 80 % brauchbar ist **und** praktisch keine leisen Fehler in (c) macht, gibt es für ein Startup kaum eine QS-relevante Lücke: dann E oder ein anderer Zuschnitt (z. B. Normprüfung bestehender Zeichnungen statt Ableitung).
- Wenn die Layout-Ergebnisse schwach oder vorlagenfremd sind, aber (c) leise Fehler enthält, ist die Lücke genau „Hausstil + Prüfbarkeit“: dann unterstütze ich C als eng geschnittenen Assistenten.
- Mein Card-Kriterium bleibt der Maßstab fürs Produkt: Nach menschlicher Freigabe dürfen KI-Zeichnungen nicht mehr Normabweichungen und Fertigungsrückfragen erzeugen als manuelle (gleiche Teile, gleicher Prüfer). Wird das verfehlt, bin ich gegen einen Rollout.

## 6. Conditions and red lines

- **Rote Linie:** Keine automatisch vergebenen Funktionstoleranzen, Passungen oder Bezugssysteme ohne ausdrückliche menschliche Freigabe je Element. Toleranzen kommen aus vom Menschen gesetzter PMI oder werden nur als markierter Vorschlag angezeigt.
- **Rote Linie:** Keine Zeichnung ohne nachvollziehbaren Prüf-/Freigabeschritt, der im PDM dokumentiert ist.
- **Bedingung:** Herkunftskennzeichnung jedes Elements (KI-Vorschlag / aus Modell / manuell), sichtbar beim Prüfen, nicht auf dem freigegebenen Blatt.
- **Bedingung:** Trainingsdaten werden vorher per Stichprobe auf Normstand geprüft (z. B. Verweise auf ISO 2768-2 aufspüren); der Kunde entscheidet, welcher Normstand gelernt wird.
- **Bedingung:** Unsicherheit wird laut gemeldet: lieber „hier konnte ich nicht bemaßen“ als ein plausibles falsches Maß.
- **Bedingung:** Erfolgsmessung über Fehler nach Freigabe (Rückfragen, Reklamationen), nicht über die Freigabequote.

## 7. One line

Erst messen, wie viele leise Fehler die vorhandene SolidWorks-Automatik macht; danach höchstens einen prüfbaren Assistenten für Layout und Formmaße bauen, der Funktionstoleranzen dem Menschen überlässt.

Sources (Websuche 2026-10-21): [solidprofessor.com – SOLIDWORKS 2026 What's New for Drawings](https://solidprofessor.com/blog/swx-2026-whats-new-for-drawings/), [hawkridgesys.com – Upgrading SOLIDWORKS 2026](https://hawkridgesys.com/blog/upgrading-solidworks-2026-new-features), [iteh.eu – ISO 22081:2021](https://iteh.eu/catalog/standards/iso/5bb1f91d-50a4-44cf-bdbf-3652b92dd8ee/iso-22081-2021), [dinmedia.de – DIN EN ISO 22081](https://www.dinmedia.de/en/standard/din-en-iso-22081/356826589), [ICMD 2022 (atlantis-press.com)](https://www.atlantis-press.com/article/126000178.pdf)
