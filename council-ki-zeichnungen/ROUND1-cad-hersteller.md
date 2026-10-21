# ROUND 1: CAD-Hersteller-Perspektive (Konkurrenz-Archetyp) (cad-hersteller)

**Dossier:** DOSSIER-01-ki-zeichnungsableitung-f-r-maschinenbau.md. **Addenda read:** keine (im Ordner existiert kein ADDENDUM-01*.md; geprüft per `ls`).
**Round 1, independent:** no other member's report was read before this one was written.

**Position:** Nicht das generische Produkt „3D rein, Zeichnung raus“ bauen, denn das ist unser Kern-Roadmap-Feature. Wenn überhaupt, dann ein schmales Add-in, das Werksnormen und Hausstil eines Kunden auf unsere native Funktion aufsetzt. Starten mit A, eng gefasst als Benchmark der nativen Funktion an echten Kundenteilen; C erst danach.
**Confidence:** medium

## 1. Position and why

1. **Die generische Zeichnungsableitung gehört zum Kern der Plattform, nicht in eine Nische.** Ein Hersteller in dieser Lage hat das Feature schon angekündigt und ausgeliefert (F2, F3: SolidWorks 2026, Beta). Ein zweiter großer Hersteller liefert seit Ende 2024 „Automated Drawings“ in Fusion (siehe §3; fehlt im Dossier). Diese Firmen veröffentlichen jedes Jahr ein Release. Ein Startup, das dieselbe Funktion für alle Teile verspricht, verkauft etwas, das in 12–24 Monaten „im Wartungsvertrag enthalten“ ist. Ein Hersteller in dieser Lage würde genau damit argumentieren, über Reseller, die den Kunden ohnehin jährlich besuchen.
2. **Was ein Hersteller eher spät oder schlecht macht:** Werksnormen, Hausvorlagen und kundenspezifische Bemaßungslogik („so bemaßen *wir* Drehteile“), die aus dem Bestand gelernt werden. Dazu kommen On-Prem-Betrieb ohne Cloud-Zwang und Multi-CAD. Plattformanbieter optimieren auf den Durchschnitt aller Kunden und schieben KI-Funktionen eher Richtung Cloud bzw. 3DEXPERIENCE (F3 läuft im 3DEXPERIENCE-Kontext). Genau hier liegt eine Lücke, die ein Hersteller als Partner-Add-in dulden würde. Das ist eine Annahme aus der Anreizlogik, nicht aus Insiderwissen.
3. **Drittanbieter sind willkommen, solange sie Lücken füllen und die Plattform stärken.** Ein Add-in, das unsere native Funktion *nutzt* und nachjustiert (Vorlagen, Stil, Prüfregeln), macht unser Produkt wertvoller. Ein Add-in, das sie *ersetzt*, kopieren wir. Das Partnerprogramm ist dafür das formale Werkzeug: Registrierung, Lizenzschlüssel, Gold-Zertifizierung (§3). Außerdem ist es der Weg in den Reseller-Kanal, den das Dossier als Vertriebsoption nennt.
4. **Die Nutzerneigung „A zuerst“ ist richtig, aber im Dossier falsch geschnitten.** Desk-Research und Geschäftsmodell-Tabellen beantworten die entscheidende Frage nicht: Wie groß ist die Lücke zwischen nativer SolidWorks-2026-Automatik und einer freigabefähigen Zeichnung *nach Hausstandard*? Diese Frage ist empirisch. Sie lässt sich nur durch einen Test an echten Kundenteilen klären, nicht durch Lektüre.
5. **D (Landingpage) bringt aus Sicht dieser Seite wenig.** Klicks von Konstrukteuren messen Neugier, keine Zahlungsbereitschaft gegen ein Feature, das sie im nächsten Update erwarten (Annahme).
6. **E (nicht bauen) ist realistisch, wenn der Benchmark keine große Lücke zeigt.** Das ist für den Gründer unbequem, aber der Hersteller-Anreiz läuft genau dorthin: die Lücke selbst schließen.

## 2. Where the dossier is wrong, incomplete or mis-posed

- **Wettbewerb unvollständig:** Autodesk Fusion „Automated Drawings“ fehlt. Es ist seit Ende 2024 verfügbar und wurde Anfang 2025 KI-gestützt erweitert (Blattlayout je Komponente, Stil anwenden, Normteile ausblenden). Damit hat schon der *zweite* große Hersteller die Funktion, und das Muster „Hersteller baut es selbst“ ist belegt, nicht nur prognostiziert. Siemens NX: Ich habe per Websuche keine KI-Zeichnungsableitung gefunden (nur Rapid Dimension, AI-Sketch, Copilot). Das heißt nicht, dass es sie nicht gibt.
- **Frage 8.1 ist falsch gestellt.** „Lohnt es sich angesichts nativer Funktionen?“ unterstellt, das native Feature sei statisch. Die richtige Frage lautet: Was bleibt übrig, wenn das native Feature in 2–3 Releases aus der Beta kommt? Bei einem 12–24-Monats-Horizont fällt das genau in die Verkaufsphase des Gründers.
- **Creo-Lage einseitig dargestellt:** F4 („nicht gefunden“) und F5 (Advanced Framework) zusammen heißen, dass PTC regelbasierte Automatik bereits als *kostenpflichtiges Zusatzmodul* verkauft. Für einen Startup-Angriff auf Creo ist das eher ein Gegenargument. PTC monetarisiert genau diesen Bedarf schon und hat mit „Automate Alpha“ (F4) die Richtung angedeutet.
- **Reseller-Kanal unterbelichtet:** DACH-Systemhäuser verkaufen eigene Automatisierungs-Tools und Dienstleistungen (Vorlagen, Makros). Laut Dossier §6 wurde das „nicht systematisch gesucht“. Diese Systemhäuser sind zugleich möglicher Vertriebspartner und direkter Konkurrent. Ich habe das nicht geprüft.
- **E4 (35–55 kEUR Lizenzkosten) ist kein Budgetbeleg.** Diese Ausgabe ist gebunden. Der relevante Vergleich ist das Budget *zusätzlich* zur Subscription, die der Kunde schon zahlt und in der das native Feature enthalten ist.
- **DraftAid (F6) wird als Wettbewerber gezeigt, aber nicht als Signal gelesen.** Wenn dessen Preise bei 20–40 USD/Monat liegen (Drittquelle, unbestätigt), setzt das einen niedrigen Preisanker für den generischen Fall.

## 3. Evidence

| Claim | Type | Source or method |
|---|---|---|
| Autodesk Fusion hat „Automated Drawings“ seit Ende 2024, KI-Erweiterung (Layout, Stil, Normteile entfernen) Anfang 2025 live | fact (Sekundärquellen) | Websuche 2026-10-21: adsknews.autodesk.com „Autodesk AI strengthens Fusion and Alias“; fabbaloo.com „AI Takes on Sketching and Drawings in Autodesk Fusion“; themanufacturer.com |
| Keine KI-Zeichnungsableitung in Siemens NX gefunden | Suchergebnis, kein Nichtexistenz-Beleg | Websuche 2026-10-21; gefunden nur Rapid Dimension (drwe.de), AI-Sketch (compositesworld.com), Copilot (blogs.sw.siemens.com) |
| SolidWorks Partner Program: Registrierungspflicht für Partner-Add-ins seit 2021, Lizenzschlüssel, Gold-Zertifizierung mit UI-Richtlinien | fact | help.solidworks.com API Programming Guide „SolidWorks Partner Program“ (2021/2024); solidworks.com Application Questionnaire Aug 2023 |
| SolidWorks 2026 hat native KI-Zeichnungserstellung (Beta, braucht Nacharbeit) | fact (aus Dossier F2/F3, nicht nachgeprüft) | Dossier |
| PTC verkauft Zeichnungsautomatik als Zusatzmodul | fact (aus Dossier F5) + Interpretation | Dossier F5 |
| Hersteller kopieren erfolgreiche Add-in-Funktionen typischerweise innerhalb von 1–3 Releases | assumption | Anreizlogik der Persona; Muster Fusion/SolidWorks als Indiz, kein Beleg für die Zeitspanne |
| Hausstil/Werksnormen-Anpassung ist für Plattformanbieter nachrangig | assumption | Anreiz (Durchschnittskunde, Cloud-Upsell); Gegenprobe: Benchmark §5 |

## 4. Risks from this seat

- **C ohne vorherigen Benchmark (leises Risiko):** Der Gründer baut 1–3 Monate eine Funktion nach, die SolidWorks 2026 schon zu großen Teilen mitbringt. Das merkt er erst im Kundentermin, wenn der Konstruktionsleiter sagt: „Das macht mein Update doch auch.“
- **Erfolg ist ebenfalls riskant:** Wenn das Add-in gut läuft und generisch ist, wird es nachgebaut. Erfolg macht das Produkt sichtbar. Schutz bieten nur kundenspezifische Daten und Regeln sowie On-Prem-Vertrauen, nicht die Ableitungstechnik.
- **Plattformabhängigkeit:** API-Änderungen, Partner-Listung und Reseller-Zugang liegen beim Hersteller. Wer sich gegen die native Funktion positioniert statt auf ihr aufzusetzen, verliert den Kanal.
- **Creo-Pfad:** Dort konkurriert der Gründer mit einem bezahlten Herstellermodul (F5) und kostenpflichtigem Toolkit-Zugang (laut Persona-Karte cad-entwickler). Das ist teurer und langsamer.
- **A zu breit:** Wochen Desk-Research erzeugen Marktgrößen-Tabellen, aber keine Antwort auf die Lückenfrage. Dieser Fehler fällt nicht auf.

## 5. The cheapest decisive step

**Benchmark der nativen SolidWorks-2026-Zeichnungsautomatik an 20–30 echten Einzelteilen von 2–3 KMU, mit deren Vorlagen und Werksnormen.** Ein Konstrukteur des Kunden misst dabei Minuten bis zur freigabefähigen Zeichnung: (a) manuell, (b) nativ plus Nacharbeit. Dazu kommt eine Liste, *welche* Nacharbeit nötig war (Stil/Norm vs. Funktion/Toleranz). Aufwand: 1–2 Wochen; eine SolidWorks-2026-Lizenz oder die Lizenz des Kunden; kein Code.

**Vorab festgelegt, was meine Position ändert:**
- Spart nativ plus Nacharbeit schon ≥ 50 % gegenüber manuell, *und* betrifft die restliche Nacharbeit überwiegend Funktion/Toleranzen (nicht automatisierbar, F6/qs-Red-Line), dann gibt es keinen Raum für ein Startup → **E**.
- Liegt die native Ersparnis < 25 %, *und* sind ≥ 60 % der Nacharbeit Stil-/Normanpassungen, die sich aus dem Zeichnungsbestand lernen lassen, dann ist die Lücke real und herstellerfern → **C** als schmales Add-in auf der nativen Funktion, SolidWorks-first. Das wäre zugleich der Beleg, den meine Karte unter „Would change its mind if“ verlangt (der zweite Teil, Zahlungsbereitschaft, bliebe zu prüfen).
- Dazwischen: offen, abhängig von Zahlungsbereitschaft (Pilotzusage).

## 6. Conditions and red lines

- Unterstützung (als „Markt duldet es“) nur für ein Produkt, das auf der Herstellerplattform aufsetzt, ein Hausstil-/Normen-/Prüf-Layer ist und kein Ersatz der Ableitung. Registriert im Partnerprogramm, verkaufbar über Reseller.
- Kein Pitch „vollautomatische Zeichnung für alle Teile“. Das ist die Hersteller-Roadmap, und dort verliert ein Startup.
- Keine Multi-CAD-Strategie von Tag 1. Creo erst, wenn SolidWorks-Kunden zahlen.
- Differenzierung muss in Daten und Vertrauen liegen (kundenspezifisch, On-Prem, kein Fremdtraining), nicht in einer Technik, die ein Hersteller in einem Release nachbaut.

## 7. One line

Die generische KI-Zeichnung baut der Hersteller selbst. Ein Startup überlebt nur als Hausstil- und Werksnorm-Layer auf der nativen Funktion, und ob diese Lücke groß genug ist, klärt ein zweiwöchiger Benchmark an echten Teilen, nicht ein Businessplan.
