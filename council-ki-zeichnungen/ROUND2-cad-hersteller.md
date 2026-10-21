# ROUND 2: CAD-Hersteller-Perspektive (Konkurrenz-Archetyp) (cad-hersteller)

**Read:** ROUND1-TALLY.md, every ADDENDUM-01*, and all Round 1 reports.

**Vote:** A
**Changed from round 1:** no
**Confidence:** medium

## 1. Vote and reason

Ich stimme für A („Messen, dann eng bauen“), aber nur mit einer Bedingung: **Der Spike startet erst, wenn mindestens ein unterschriebener, bezahlter Pilot vorliegt.** Die Preisfrage gehört deshalb schon in die 5–10 parallelen Gespräche von A. Damit übernehme ich den Kern von investor (B), ohne auf den Benchmark zu verzichten.

Begründung aus Herstellersicht:
- **Die Addenda haben die Lage für ein Startup verschlechtert.**
  - 01A item 2 (fact): Die native Funktion macht auch Stückliste, Positionsnummern, Revisionstabelle und Stapelbetrieb. Damit ist der Dossier-Umfang von C praktisch schon Roadmap-Kern.
  - 01A item 1 (fact): 2027 ist da und bewirbt Zeichnungen aus Prompts.
  - 01B item 10 (fact): Fusion hat automatische Zeichnungen schon seit Januar 2024, also noch früher, als ich in Runde 1 geschrieben hatte.
  - Das Muster „Hersteller baut es selbst und verbessert es jedes Jahr“ ist belegt.
- **Übrig bleibt nur, was ein Plattformanbieter langsam macht** (assumption aus der Anreizlogik): Werksnormen und Hausstil je Kunde, Bemaßungsregeln je Teilefamilie, PDM-Attribute und eventuell der lokale Betrieb. Ob diese Lücke groß ist, ist empirisch. Deshalb kommt der Benchmark zuerst, und zwar mit dem **aktuellen Release 2027**. Gegen 2026 zu messen, hieße gegen ein veraltetes Ziel zu messen.
- **Warum nicht D (E sofort):** Eine Nische im Hausstil ist plausibel und bisher nicht widerlegt. Der Test kostet wenig. E ist ein vorab festgelegtes Ergebnis, kein Startschritt.

## 2. Response to other members

| Member | Point | Agree / disagree | Why |
|---|---|---|---|
| investor | Eine gemessene Lücke ist noch keine Zahlungsbereitschaft. Erst Geld, dann Bau. | Teils zu | Er hat recht: Meine Karte verlangt beides, ein besseres Ergebnis *und* Kunden, die extra zahlen. Er irrt aber, wenn das Pilotangebot ohne eigenen Test kommen soll. Ein Konstruktionsleiter, der die Bordfunktion kennt, sagt zu einem vagen Angebot Nein (assumption). Erst die Benchmark-Zahlen machen das Angebot konkret. Deshalb bündeln: Benchmark und Preisfrage in denselben 2–4 Wochen. |
| it-datenschutz | Datensouveränität (lokal statt Cloud) ist das Unterscheidungsmerkmal. | Teils zu | Richtig ist die Faktenlage: Laut 01B item 11 braucht die native Funktion Cloud Services und eine Plattformverbindung (fact). Falsch ist die Annahme, das sei ein dauerhafter Burggraben. Ein Hersteller in dieser Lage würde bei genug Gegenwind von Großkunden wahrscheinlich eine lokale oder Private-Cloud-Variante nachreichen (estimate). Als Zusatzargument taugt das, als alleiniger Produktkern (Option C) nicht. |
| cad-entwickler | Firmenstil ist meist Regel, kein ML. Das Add-in muss ≥ 20 Pp. besser sein als die native Funktion. | Zu | Das ist das richtige Abbruchkriterium, weil es gegen die Bordfunktion misst und nicht gegen Handarbeit. Regeln sind außerdem schwerer zu kopieren als ein generisches Modell, weil sie beim Kunden liegen. |
| qs-normen | Differenzierung über Prüfbarkeit und Herkunftskennzeichnung | Teils zu | Normprüfung gegen den aktuellen Normstand (z. B. ISO 22081, 01B item 14) ist kundenspezifische Arbeit, die Hersteller langsam machen. Eine einfache Markierung „KI-gesetzt“ kann der Hersteller dagegen in einem Release nachbauen (estimate). Sie ist also Pflicht, aber kein Burggraben. |
| konstruktionsleiter | Kurz kündbare Verträge wegen Plattformrisiko | Zu | Aus Herstellersicht ist das realistisch. Es bedeutet aber auch, dass der Gründer nach jedem Release neu beweisen muss, dass sich das Add-in lohnt. |

## 3. Corrections accepted or disputed

- **01B item 9 (DraftAid-Preis) akzeptiert.** Mein Runde-1-Punkt, der niedrige Preis setze einen Anker, ist damit hinfällig. Neu gelesen heißt der Befund: Der Spezialist geht auf Volumenkunden mit 200+ Zeichnungen im Monat und nicht auf kleine KMU.
- **01B item 10 akzeptiert.** Fusion hat die Funktion seit Januar 2024. Belegt ausgeliefert ist als KI-Teil aber nur die Normteilerkennung. Mein Satz „KI-Erweiterung Anfang 2025 live“ war zu weit.
- **01B item 13 akzeptiert, mit Folgen für meine Runde-1-Bedingung.** Es wurde keine API für Auto-Generate Drawing gefunden (unverified). Damit kann ein Add-in nicht direkt auf der nativen Funktion aufsetzen. Es kann höchstens deren *Ergebnis* nachbearbeiten (Regeln auf eine erzeugte Zeichnung anwenden) oder daneben bauen. Das ist fragiler, weil jedes Release das Ausgabeformat ändern kann. cad-entwickler sollte das im Benchmark testen.
- **01B item 14 (Partnerprogramm, Gold verlangt 5 Referenzen) akzeptiert.** Der Weg in den Reseller-Kanal führt erst über zahlende Kunden. Das ist ein weiterer Grund, das Geld früh abzufragen.

## 4. What would reverse this vote

Die Schwellen werden vorab festgelegt, gemessen an SolidWorks 2027 mit der Firmenvorlage.
- **Wechsel zu D (E):**
  - wenn nativ plus Nacharbeit schon **≥ 40 %** gegenüber manuell spart und der Rest überwiegend Funktion und Toleranzen betrifft, oder
  - wenn **0 von 5–10** Gesprächen einen bezahlten Pilot zusagen.
  - Den Wert für E senke ich von 50 % auf 40 %, damit er zu konstruktionsleiter und cad-entwickler passt.
- **Spike (A wird fortgesetzt):**
  - wenn die native Ersparnis **< 25 %** liegt und **≥ 60 %** der Nacharbeit Hausstil, Werksnorm oder PDM betrifft, und
  - wenn mindestens 1 bezahlter Pilot zugesagt ist (meine Bedingung).
- **Wechsel zu B:** wenn der Benchmark eine Lücke zeigt, die Gespräche aber keine Zahlungszusage bringen. Dann gilt investor's Pfad, also Geld vor Bau.

## 5. Dissent to record

Ich stimme mit der Mehrheit für A, möchte aber einen Hinweis festhalten: **Selbst ein positiver Benchmark hat ein Verfallsdatum.** Die native Funktion trägt noch das Beta-Label und wird jedes Jahr nachgebessert (01A items 1–2). Eine Lücke, die heute 30 % ausmacht, kann nach 1–2 Releases zu klein sein (estimate). Die Empfehlung sollte deshalb festschreiben:
1. den Benchmark bei jedem Hauptrelease wiederholen,
2. als Produktkern nur kundenspezifische Regeln und Daten verwenden, nicht die Ableitungstechnik selbst,
3. vor dem Spike prüfen, ob es Systemhaus-Makros gibt, die dieselbe Lücke schon füllen.
