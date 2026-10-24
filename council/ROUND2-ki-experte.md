# ROUND 2: KI-Technik-Experte (ki-experte)

**Read:** ROUND1-TALLY.md, every ADDENDUM-01*, and all Round 1 reports.

**Vote:** A
**Changed from round 1:** no
**Confidence:** medium

## 1. Vote and reason

Option A, mit Platz 1 in der Variante "Dokumente rein, saubere Daten ins ERP" für produzierende KMU. Aus meinem Mandat ist das die Idee, die mit besseren Modellen **mehr** wert wird: Extraktion wird genauer und billiger, die Arbeit bleibt aber beim Integrator (Anbindung an lokale Altsysteme, Validierungsregeln, Ausnahmen, Monitoring). Genauigkeit ist messbar, und das passt direkt zum Pilotkriterium des kmu-kunde (≥ 5 Std./Woche).

Neue Evidenz stützt meine Abgrenzung, ändert sie aber nicht: n8n hat einen "AI Workflow Builder", der Workflows aus natürlicher Sprache erzeugt (Fakt, VERIFICATION V27). Damit verlieren Vorlagen (I5) und generisches "Workflow-Bauen" schneller an Wert, als das Dossier mit E3 annimmt. Was übrig bleibt, ist Zuverlässigkeit am echten Kundensystem. Genau die verkauft A.

Bedingungen: Vertrag zuerst (Konsens 7/7), n8n nur auf der Instanz des Kunden (ADDENDUM 01A Punkt 6), jedes System mit Testdatensatz, Fehler-Monitoring und manueller Ausnahme-Warteschlange.

## 2. Response to other members

| Member | Point | Agree / disagree | Why |
|---|---|---|---|
| investor | I2+I6 ist der einzige unfaire Vorteil, I1 nur Brücke | teils | Richtig: Felddaten aus Störfällen werden mit besseren Modellen wertvoller, nicht überflüssig. Falsch: Heute hat er **keine eigenen** Daten. Ohne Datenzugang ist I2 ein Prompt auf fremden Handbüchern, also meine rote Linie. Die Daten entstehen erst bei Betreiber-Kunden, und an die kommt er über A. B ist deshalb die Fortsetzung von A, kein Gegenmodell. |
| plattform | Die leise Gefahr ist Preisverfall, nicht Verdrängung | zustimmen | Technisch richtig (Schätzung): Wenn Kunden Workflows selbst erzeugen, fällt der Preis für Bauen. Genau deshalb soll er Messung und Wartung verkaufen (Genauigkeitsbericht pro Monat), nicht den Bau. Mit seinem Punkt "Vor-Ort-Anteil" bin ich einig. |
| skeptiker | Gehaltsersatz ist nebenberuflich rechnerisch nicht erreichbar | zustimmen in der Rechnung, nicht im Schluss | Die Arithmetik stimmt (V34). Sie spricht gegen das Erfolgsmaß, nicht gegen den Test. Mit der SVS-Ausnahme (ADDENDUM 01A Punkt 5) kostet der Test ca. 13 €/Monat plus API-Kosten < 20 € für den Prototyp (Schätzung). Seine Deckel (10 h, 1.000 €) übernehme ich in A. |
| kmu-kunde | Erreichbarkeit tagsüber ist K.-o.-Kriterium | zustimmen, technische Antwort | Das ist lösbar, ohne den Job zu gefährden: Workflows so bauen, dass sie bei Fehlern **laut** scheitern (Alarm an Kunden und ihn), Dokumente in eine manuelle Warteschlange fallen und nichts Falsches ins ERP schreiben. Dann ist "Reparatur am Abend" ein Verzug, kein Datenschaden. Zugesagt wird nächster Werktag, nicht sofort. |
| recht | I5 zuerst wegen geringstem Rechtsrisiko | ablehnen | Rechtlich richtig, technisch die am schnellsten entwertete Idee (V27). Geringes Risiko bei geringem und sinkendem Wert ist kein guter Start. |

## 3. Corrections accepted or disputed

- **Punkt 6 (n8n-Lizenz):** akzeptiert; stammt aus meinem eigenen Round-1-Fund. Folge für A: eine Instanz pro Kunde. Für ein späteres Mehrkunden-Produkt (B) braucht es einen anderen Stack (eigener Code oder permissiv lizenzierte Werkzeuge) oder eine kommerzielle Lizenz.
- **Punkt 1 (Art. 50):** akzeptiert. Bestätigt, I4 nur als Zusatzmodul zu führen.
- **Punkt 7 (Digital.PLUS 26):** akzeptiert. A muss sich ohne Förderung über die gemessene Zeitersparnis rechnen.
- Meine Round-1-Zahl zu Voice-Kosten (0,07–0,30 USD/Min.) ist bestätigt (V21), aber nur über Sekundärquellen.

## 4. What would reverse this vote

- Der Wochenend-Prototyp mit 50 echten Dokumenten erreicht nach einer Woche Nacharbeit < 80 % korrekte Felder, auch mit einem zweiten Dokumenttyp: dann fällt meine Begründung für A weg.
- Hin zu B: Wenn ≥ 3 A-Kunden aus der Fertigung dasselbe Instandhaltungsproblem mit **eigenen** Daten (Störfälle, Einsatzberichte) zeigen und der Arbeitgeber schriftlich keine Bedenken hat. Das ist mein Kriterium für den Wechsel (Tally-Frage G2).
- Hin zu C: Der Vertrag verbietet jede Nebentätigkeit.

## 5. Dissent to record

none. Ein Vorbehalt soll in die Empfehlung: "Voll automatisiert" ist technisch für keine B2B-Idee in 12 Monaten realistisch (Schätzung). Zuverlässige Systeme brauchen einen Menschen für Ausnahmen, Wartung und Modellwechsel.
