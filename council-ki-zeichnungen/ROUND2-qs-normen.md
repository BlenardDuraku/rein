# ROUND 2: Qualitätssicherung / Normen (qs-normen)

**Read:** ROUND1-TALLY.md, every ADDENDUM-01*, and all Round 1 reports.

**Vote:** A
**Changed from round 1:** no
**Confidence:** medium

## 1. Vote and reason

A („Messen, dann eng bauen“), unter einer Bedingung: Der Benchmark muss ein **QS-Protokoll** haben und nicht nur Zeit messen. Ein zweiter Prüfer, der die Herkunft der Zeichnung nicht kennt, klassifiziert jede Abweichung nach Art (Stil/Norm, Formmaß, Funktion/Toleranz/Bezug, PDM) und als laut oder leise. Die Schwellen für E und für den Spike werden **vorab** schriftlich festgelegt und enthalten neben der Zeitersparnis auch die Zahl leiser Fehler in der Klasse Funktion/Toleranz.

Begründung aus meinem Mandat: Seit 01B item 12 ist es Fakt, dass die native Funktion Form-/Lagetoleranzrahmen und Bezüge setzt, von Resellern als „basic“ beschrieben. Damit tritt genau die Fehlerart, die ich am meisten fürchte, schon heute beim Kunden auf, und zwar mit dem Update und ohne Beschaffung. Ein Benchmark, der nur Minuten stoppt, würde eine native Funktion belohnen, die schnell ist und still falsch toleriert. 01A item 2 (Stückliste, Positionsnummern, Revisionstabelle sind nativ) verkleinert die Layout-Lücke. Die mögliche Differenzierung verschiebt sich deshalb zu Prüfbarkeit und Werksnorm (Schätzung). Die Erstableitung als solche ist es eher nicht mehr.

Zu Tally-Frage 2: Ein Spike darf ohne bezahlten Pilot starten, aber nur wenn es mindestens eine schriftliche Pilot-Absichtserklärung gibt und der Spike höchstens 4 Wochen dauert (siehe investor unten).

## 2. Response to other members

| Member | Point | Agree / disagree | Why |
|---|---|---|---|
| investor | Eine gemessene Lücke ist noch keine Zahlungsbereitschaft. | Agree | Richtig, und das ist das Hauptrisiko von Option A. Deshalb gehört die Preisfrage mit konkretem Pilotpreis in dieselben 5–10 Gespräche. Die kostet keine zusätzliche Zeit. |
| investor | Benchmark nur innerhalb bezahlter Piloten (Option B). | Disagree | Ohne eigene Messung verkauft der Gründer ein Versprechen. Ein Pilot, den der Kunde mitgestaltet, misst außerdem meist Geschwindigkeit und nicht Korrektheit. Die leise Fehlerquote braucht ein Protokoll, das *vor* dem Verkauf steht (Annahme aus QS-Erfahrung). |
| cad-hersteller | Bleibt nach nativ ≥ 50 % Ersparnis nur Toleranzarbeit übrig, folgt E. | Disagree (teilweise) | Aus QS-Sicht ist das gerade keine leere Nische. Setzt die native Funktion Toleranzen (01B item 12) und macht dort leise Fehler, ist ein Prüf- und Herkunfts-Layer auf der nativen Funktion ein möglicher Zuschnitt. Das wäre ein Layer, der auf der Plattform aufsetzt, also kein Ersatz, und passt damit zu seiner eigenen Bedingung. |
| cad-hersteller | Auf der nativen Funktion aufsetzen, nicht daneben bauen. | Agree | Wenn es geht, ja. Aber 01B item 13: Ein API-Zugang wurde nicht gefunden. Das muss der Benchmark klären. |
| zeichner | Erfolgsmaß „Erzeugen + Prüfen + Korrigieren“; versteckte Fehler zählen. | Agree | Das deckt sich mit meiner Fehlerklassifikation. Seine Markierungspflicht ist meine Herkunftskennzeichnung. |
| cad-entwickler | Schwellen ≥ 40 % gegenüber manuell und ≥ 20 Pp. besser als nativ. | Agree, mit Zusatz | Reine Zeitschwellen genügen nicht. Ich ergänze: Nach Freigabe gibt es in der Klasse Funktion/Toleranz nicht mehr leise Fehler als bei manuellen Zeichnungen (gleiche Teile, gleicher Prüfer). |
| it-datenschutz | Erst ein Datenfluss-Konzept, dann Benchmark (Option C). | Disagree mit der Reihenfolge | Die IT-Fragen gehören in die Gespräche von A, ein vorgeschaltetes Konzept ist nicht nötig. Der Benchmark selbst läuft beim Kunden mit seiner Lizenz und braucht kein eigenes Backend. |

## 3. Corrections accepted or disputed

- **01B item 14 (Beta-Status):** Akzeptiert. Meine Round-1-Aussage, Beta-Funktionen seien „nicht für Produktionsarbeit gedacht“, war irreführend (V52). Offiziell steht dort „under evaluation“, ein Verbot gibt es nicht. Das verschärft das QS-Risiko eher, denn Kunden dürfen die Funktion produktiv nutzen.
- **01B item 12 (GD&T „basic“):** Akzeptiert. Es ist der wichtigste Punkt für meinen Sitz (siehe §1).
- **01B item 14 (ISO 22081 ersetzt ISO 2768-2):** Bestätigt. Meine Bedingung bleibt, dass Trainings- und Regelbestände vorher auf den Normstand geprüft werden.
- **01A item 7 (Produkthaftung, Software als Produkt):** Akzeptiert, keine Rechtsberatung. Daraus folgt für mich: Herkunftskennzeichnung und ein dokumentierter Freigabeschritt im PDM sind auch eine Haftungsfrage des Anbieters, nicht nur eine Auditfrage des Kunden.
- **01B item 11 (Cloud-Bindung):** Akzeptiert. Für QS ist das neutral, für it-datenschutz relevant.

## 4. What would reverse this vote

- **Zu D (E):** Die native Funktion im aktuellen Release (2027, 01A item 1) ist bei Layout und Formmaßen zu ≥ 80 % brauchbar, macht in der Blindprüfung praktisch keine leisen Fehler in der Klasse Funktion/Toleranz, und die Gespräche zeigen keinen Bedarf an Prüfbarkeit.
- **Zu B:** Die Gespräche finden ohnehin statt, und ein vorab definiertes QS-Protokoll wird Vertragsbestandteil jedes bezahlten Piloten. Dann ist die Reihenfolge „Geld zuerst“ für mich annehmbar.

## 5. Dissent to record

Keine Dissens-Position, mein Sitz gehört zur Mehrheit. Ich verlange aber, dass die Empfehlung einen Vorbehalt übernimmt: **Eine E- oder Bau-Schwelle, die nur Zeitersparnis misst, ist aus QS-Sicht ungültig.** Ein Ergebnis wie „spart 50 %, aber setzt still falsche Bezüge“ darf weder als „native reicht, also E“ noch als „unser Add-in ist schneller, also bauen“ gelesen werden. Es ist ein eigener Befund: Dann liegt die Lücke in der Prüfbarkeit. Meine rote Linie bleibt: Keine automatisch vergebenen Funktionstoleranzen ohne menschliche Freigabe je Element, und keine Zeichnung ohne nachvollziehbaren Prüf- und Freigabeschritt.
