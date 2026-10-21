# ROUND 2: IT-Leiter / Datenschutz beim Kunden (it-datenschutz)

**Read:** ROUND1-TALLY.md, every ADDENDUM-01*, and all Round 1 reports.

**Vote:** A (mit Bedingungen, siehe §1)
**Changed from round 1:** yes: ROUND1-cad-entwickler §4 („B zuerst: Architekturpapier, bevor feststeht, ob man überhaupt ML braucht – klassische Fehlinvestition“) und ROUND1-konstruktionsleiter §1.5 („die Frage ‚läuft lokal‘ ist ein Absatz, kein Projekt“); dazu ADDENDUM-01B item 11, das die Cloud-Bindung der nativen Funktion bestätigt und meine Datenfrage damit innerhalb des Benchmarks prüfbar macht.
**Confidence:** medium

## 1. Vote and reason

In Runde 1 wollte ich vor Benchmark und Code ein eigenes Datenfluss-Konzept (Option C der Tally). Davon rücke ich ab, aber nicht von der Sache. Zwei Argumente haben mich überzeugt. Erstens: Eine Architektur-Vorgabe „lokal vs. EU-Instanz, getrenntes Lernen pro Kunde“ ist verfrüht, solange offen ist, ob überhaupt ML gelernt wird. cad-entwickler und konstruktionsleiter halten den Hausstil überwiegend für Regel und Konfiguration (Annahme beider Sitze). Ein rein regelbasiertes, lokales Add-in ohne Training löst meine Hauptsorge, das mandantenübergreifende Modell, schon durch seine Bauart. Zweitens: Option A enthält bereits die Gespräche mit IT-Leitern und als Spike-Bedingung „lokal“. Was ich brauche, steckt also schon in A. Eine eigene Option würde nur Zeit kosten.

**Bedingungen für meine Stimme** (sie sind Teil des Votums, keine Wünsche):
1. **Der Benchmark selbst ist ein Datenfluss.** Laut 01B item 11 (Fakt, Reseller-Quellen) braucht Auto-Generate Drawing Cloud Services bzw. eine Plattformverbindung. Wer echte Kundenteile durch die native Funktion schickt, überträgt also womöglich Konstruktionsdaten an eine Herstellerplattform. Deshalb gilt: Vor dem ersten Teil liegen eine NDA und eine schriftliche Freigabe der Kunden-IT vor. Der Benchmark läuft auf der Lizenz und im Netz des Kunden, nicht auf dem Laptop des Gründers. Teile mit Exportkontroll-Bezug sind ausgeschlossen. Ob reine Cloud-Verarbeitung eine Ausfuhr im Sinne der Dual-Use-VO ist, bleibt laut 01B item 14 eine Auslegungsfrage. Das ist eine Rechtsfrage und gehört zu einem Anwalt.
2. **IT-Gespräche als Pflichtteil.** Von den 5–10 Gesprächen in A sind mindestens 5 mit IT- oder ISB-Verantwortlichen zu führen. Grundlage ist mein einseitiges Datenfluss-Blatt mit zwei Varianten. Das ist ein Gesprächsinstrument, kein Architekturprojekt (Schätzung: 1 Tag).
3. **Die Datenfrage wird im Benchmark mitgemessen:** Welche Daten verlassen bei der nativen Funktion das Netz? Antwort aus der offiziellen Dokumentation oder vom Systemhaus. Bisher habe ich dazu nichts Offizielles gefunden (Runde 1, §3).
4. Der Spike nach A läuft lokal, mit Benutzerrechten, ohne Training über Kunden hinweg und nur mit freigegebenen Pilotdaten.

## 2. Response to other members

| Member | Point | Agree / disagree | Why |
|---|---|---|---|
| cad-entwickler | B vor dem Benchmark ist eine Fehlinvestition; „Firmenstil“ ist meist Regel und kein ML | Agree | Ohne ML entfällt das schwerste Datenrisiko (Training über Kunden hinweg). Das ist sicherer als jede Vertragsklausel. Mein Runde-1-B hätte Aufwand in ein Problem gesteckt, das vielleicht gar nicht entsteht. |
| cad-entwickler | Trainingsdaten-Extraktion braucht lizenzierte SolidWorks-Sitzungen | Agree, mit Ergänzung | Wo diese Sitzungen laufen, ist eine Datenfrage: beim Kunden, nicht beim Gründer. |
| cad-hersteller | Ein Add-in soll auf der nativen Funktion *aufsetzen* | Teilweise disagree | Setzt es auf einer cloudgebundenen Funktion auf (01B item 11), erbt es deren Datenfluss. Dann fällt „lokal“ als Unterscheidungsmerkmal weg. Ob die native Funktion per API erreichbar ist, ist ohnehin offen (01B item 13). Das Aufsetzen darf deshalb keine Vorgabe vor dem Benchmark sein. |
| investor | Zuerst bezahlte Pilotzusagen (Tally-Option B) | Teilweise agree | Richtig ist, dass eine gemessene Lücke noch keine Zahlungsbereitschaft beweist. Aber eine Pilotzusage der Konstruktionsleitung ohne IT-Freigabe ist der stille Fehler, den ich in Runde 1 beschrieben habe. In der Kaufphase wird sie wieder zurückgezogen (Annahme). Die Preisfrage gehört in die Gespräche von A, nicht davor. |
| konstruktionsleiter | Die Datenfrage muss vor dem Pilot beantwortbar sein, das ist „ein Absatz“ | Agree | Für den Pilot reicht ein Absatz. Für die erste Kundenbestellung reicht er nicht: Dann ist ein Sicherheitsfragebogen nötig (z. B. VDA-ISA-orientiert). Diese Lücke unterschätzt der Sitz. |
| zeichner | Keine personenbezogene Leistungsmessung | Agree | Das deckt sich mit meiner Linie „keine Telemetrie auf Personenebene“. Die Zeitmessung im Benchmark muss anonymisiert sein. Ob der Betriebsrat mitbestimmen muss (§ 87 BetrVG), sollte ein Jurist klären. |

## 3. Corrections accepted or disputed

- **01B item 11 (Cloud-Bindung): accepted.** Das stützt meine Hypothese „lokal als Unterscheidungsmerkmal“, beweist sie aber nicht. Ob Kunden die Cloud-Bindung stört, bleibt ungeprüft. Ein Einwand: Laut Item arbeiten „viele Skills auf lokalen Dateien“. Mit dem Login ist also nicht automatisch belegt, dass Geometrie hochgeladen wird. Das muss der Benchmark klären (Bedingung 3).
- **01B item 13 (kein API-Zugang gefunden): accepted.** Für meinen Sitz ist das eher günstig, denn ein eigenständiges lokales Add-in bleibt dann ohnehin der Weg.
- **01A item 7 (Produkthaftungsrichtlinie 2024/2853): accepted.** Das betrifft meinen Sitz indirekt. Ein Anbieter, der selbst haften kann, braucht nachvollziehbare Protokolle. Die müssen ohne Personenbezug auskommen. Keine Rechtsberatung.
- **01B item 14 (Dual-Use): accepted.** Daraus folgt Bedingung 1.

## 4. What would reverse this vote

- **Zu Tally-Option C zurück:** Der Gründer plant den Benchmark mit Kundenteilen auf eigener Hardware, auf eigener Lizenz oder ohne NDA, oder die IT-Gespräche fallen aus A heraus.
- **Zu D (E):** Mindestens 4 von 6 IT-Verantwortlichen akzeptieren die cloudgebundene native Funktion ohnehin, *und* der Benchmark zeigt keine Lücke bei Hausstil oder Prüfbarkeit. Dann bleibt keines der drei Unterscheidungsmerkmale übrig.
- **Zu B (investor):** Gespräche, in denen die IT von Anfang an dabei ist, ergeben ≥ 3 Zusagen für einen bezahlten Pilot *mit* IT-Freigabe, noch bevor der Benchmark fertig ist. Dann wäre das Geld-Signal belastbar und der Benchmark nachrangig.

## 5. Dissent to record

Ich stimme mit der Mehrheit, halte aber einen Vorbehalt fest, damit die Empfehlung ihn nicht abschwächt. Option A misst Lücke und Zahlungsbereitschaft, behandelt die IT aber nur als Gesprächspartner neben anderen. Im Mittelstand mit Automotive-Kunden ist die IT jedoch ein Veto (Annahme aus der Rollenbeschreibung, Dossier §2). Ein Benchmark, der eine echte Lücke zeigt, nützt nichts, wenn das Produkt danach den Sicherheitsfragebogen nicht besteht. Deshalb muss jede Schwelle für den Spike nach A ein IT-Kriterium enthalten, zum Beispiel: Mindestens 2 von 3 Benchmark-Firmen bestätigen schriftlich, dass ein lokales Add-in in der beschriebenen Form zum Pilot zugelassen würde. Ohne dieses Kriterium startet der Spike auf einer ungeprüften Annahme. Das ist dasselbe Risiko, das investor beim Thema Geld benennt.
