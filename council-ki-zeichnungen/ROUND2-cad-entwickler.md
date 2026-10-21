# ROUND 2: CAD-Softwareentwickler (SolidWorks-/Creo-API) (cad-entwickler)

**Read:** ROUND1-TALLY.md, every ADDENDUM-01*, and all Round 1 reports.

**Vote:** A
**Changed from round 1:** no
**Confidence:** medium

## 1. Vote and reason

A ist im Kern meine Position aus Runde 1: erst messen, dann eng und befristet bauen oder aufhören. Die Addenda haben die Begründung verschärft, aber nicht umgedreht.

1. **Die Lücke ist kleiner geworden, und sie ist schwerer zu greifen.** Die native Funktion macht auch Stückliste, Positionsnummern, Revisionstabelle und Stapelbetrieb (01A item 2, fact). Damit fällt alles weg, was per API Routine ist. Übrig bleiben Werksnorm-Bemaßung, PDM-Attribute, Hausvorlagen und Prüfbarkeit. Ob das reicht, sagt nur der Benchmark. Er muss auf SolidWorks 2027 laufen, nicht auf 2026 (01A item 1, fact).
2. **Ein Add-in kann wahrscheinlich nicht auf der nativen Funktion aufsetzen.** In der API-Hilfe 2026 wurde keine Methode für Auto-Generate Drawing gefunden (01B item 13; UNVERIFIED, nicht ausgeschlossen). Wenn das stimmt, hat man zwei Wege. Entweder baut man daneben eine eigene Ableitung über die klassische API, also Ansichten, InsertModelAnnotations und eigene Bemaßungsregeln. Oder man baut ein Nachbearbeitungs-Add-in, das eine nativ erzeugte Zeichnung öffnet und nach Werksregeln korrigiert, markiert und prüft. Der zweite Weg ist kleiner, robuster und genau der Zuschnitt aus Option A (estimate). Er gehört deshalb als Messgröße in den Spike: Wie viele der gemessenen Korrekturen kann ein Regel-Add-in nach der nativen Erzeugung automatisch erledigen?
3. **Ergänzung zu A, übernommen vom investor:** Der Spike startet erst, wenn mindestens eine Firma schriftlich zugesagt hat, ihn danach als Pilot zu einem genannten Preis zu nutzen (Absichtserklärung, nicht unbedingt Vorkasse). Die Preisfrage gehört deshalb in die 5–10 Gespräche aus A. Damit sind die Fragen G1 und G2 beantwortet: Benchmark, Zahlungsfrage und IT-Fragen passen in dieselben 2–4 Wochen, weil es dieselben Firmen sind.
4. **Gemeinsame E-Schwelle (G4), mein Vorschlag:** Native Funktion (2027) spart ≥ 40 % gegenüber manuell inklusive Prüfung, und die Restkorrekturen sind überwiegend Toleranzen oder Kundenkonfiguration → E. Sonst Spike, und für das Add-in gilt dann: ≥ 20 Prozentpunkte besser als nativ, sonst Abbruch. Dazu kommt ein Geldkriterium: keine einzige Pilotzusage → E.

## 2. Response to other members

| Member | Point | Agree / disagree | Why |
|---|---|---|---|
| investor | Erst Zahlungszusage, Benchmark nur in bezahlten Piloten (Option B) | teils | Recht hat er damit, dass eine gemessene Lücke noch kein Umsatz ist. Deshalb übernehme ich die Pilotzusage als Bedingung für den Spike. Falsch ist die Reihenfolge: Ein Konstruktionsleiter, der die native Funktion kennt, zahlt 3–5 kEUR nicht für ein Versprechen. Er zahlt, wenn ihm jemand konkrete Zahlen an Teilen zeigt, die seinen eigenen ähneln (assumption, stützt sich auf konstruktionsleiter §1.1 und §6). |
| cad-hersteller | Add-in soll auf der nativen Funktion „aufsetzen“, im Partnerprogramm | teils | Die strategische Richtung stimmt: Hausstil-Layer statt Ersatz. Ein API-Zugang zum Aufsetzen ist aber nicht belegt (01B item 13). Real heißt „aufsetzen“ dann „nachbearbeiten“. Das Partnerprogramm kostet außerdem: Gold verlangt 5 Kundenreferenzen und Tests vor jedem Release (01B item 14, fact). Für Jahr 1 reicht die Registrierung. |
| it-datenschutz | Datenfluss-Konzept B vor jedem Code (Option C) | teils | Recht hat er damit, dass die Architektur lokal sein muss. Die native Funktion ist an Cloud bzw. Plattform gebunden (01B item 11), und lokal ist dann ein echter Unterschied. Ein Konzept braucht es dafür nicht: Ein regelbasiertes Add-in ohne Training ist von Haus aus lokal. Die Entscheidung ist ein Absatz im Spike-Auftrag, kein eigener Schritt. Seine IT-Fragen gehören in die Gespräche aus A. |
| zeichner | Änderungen und Prüfung sind der größere Zeitblock | zustimmend | Für meinen Sitz ist das technisch wichtig: Maße, die beim Modellwechsel „hängen“, sind ein API-Problem (Referenzen auf Kanten). Ein Assistent, der nach einer Revision verwaiste oder geänderte Maße markiert, ist eng, regelbasiert und von der nativen Erstableitung kaum abgedeckt (assumption). Die Zeitaufteilung muss deshalb in die Gespräche. |
| qs-normen | Toleranzen nur aus menschlich gesetzter PMI | zustimmend | Das ist deterministisch und per API (DimXpert/InsertModelAnnotations) machbar (fact: Methode existiert, 01B item 13 Positivkontrolle). Es senkt außerdem das Haftungsrisiko nach 01A item 7. |

## 3. Corrections accepted or disputed

- **01A item 1 (SW 2027):** akzeptiert. Benchmark auf 2027. Die Funktion bewegt sich jedes Jahr; der Benchmark wird bei jedem Release wiederholt.
- **01A item 2 (Stückliste, Positionsnummern, Stapel):** akzeptiert. Bestätigt meine Runde-1-Ablehnung von Dossier-C: Dessen Umfang baut der Hersteller schon.
- **01A item 7 (Produkthaftung, Software als Produkt):** akzeptiert. Folge für die Architektur: Herkunftsmarkierung jedes gesetzten Elements und keine automatischen Toleranzen sind ab Tag 1 Pflicht, nicht erst eine spätere Ausbaustufe.
- **01B item 11 (Cloud-Bindung):** akzeptiert, mit Einschränkung: Belege sind Reseller-Quellen. Ob Kunden das stört, ist offen.
- **01B item 13 (kein API-Zugang gefunden):** akzeptiert als UNVERIFIED. Das ist die technische Weichenfrage; sie wird in Woche 1 mit API-Hilfe 2027 und einer Testmakro-Aufzeichnung geprüft.
- **01B item 14 (OTK Java Free):** akzeptiert; ändert nichts, Creo bleibt draußen.

## 4. What would reverse this vote

- **Zu D (E):** Die native Funktion (2027) spart mit Firmenvorlage ≥ 40 % inklusive Prüfung, und die Restkorrekturen sind überwiegend Toleranzen. Oder keine der 5–10 Firmen gibt eine Pilotzusage zu einem genannten Preis.
- **Zu B (investor):** Der Gründer kommt nicht an echte Teile, ohne vorher Geld zu verlangen. Dann ist der bezahlte Pilot der einzige Weg zum Benchmark.
- **Zu C:** ≥ 4 von 6 IT-Leitern lehnen die cloudgebundene native Funktion ab. Dann wird lokal zum Hauptargument, und die Datenfrage muss vor dem Spike entschieden sein.

## 5. Dissent to record

none (A ist Mehrheitsoption). Festgehalten werden soll ein technischer Vorbehalt innerhalb von A: Der Spike ist auf eine Teilefamilie und 3–4 Wochen begrenzt und wird bevorzugt als Nachbearbeitungs- und Prüf-Add-in geschnitten, nicht als zweite Ableitungsmaschine neben der nativen. Das Abbruchkriterium wird vorher schriftlich festgelegt. „Lernen aus Bestandszeichnungen“ (ML) gehört nicht in den ersten Spike.
