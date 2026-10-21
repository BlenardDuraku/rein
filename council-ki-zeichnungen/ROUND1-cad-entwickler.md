# ROUND 1: CAD-Softwareentwickler (SolidWorks-/Creo-API) (cad-entwickler)

**Dossier:** DOSSIER-01-ki-zeichnungsableitung-f-r-maschinenbau.md. **Addenda read:** keine (im Ordner existiert kein ADDENDUM-01*.md).
**Round 1, independent:** no other member's report was read before this one was written.

**Position:** Zuerst ein 1-2-wöchiger Benchmark der nativen SolidWorks-2026-Auto-Zeichnung an echten Kundenteilen, dann ein auf 3-4 Wochen begrenzter Spike (SolidWorks, eine Teilefamilie, regelbasiert, Assistent statt Automat). A nur schlank und parallel dazu, B und D jetzt nicht. Option C in der Fassung des Dossiers lehne ich ab.
**Confidence:** medium

## 1. Position and why

1. **Die technische Kernfrage hat sich verschoben.** Die Frage ist nicht mehr, ob man Ansichten und Maße per API erzeugen kann. Das geht seit Jahren, und SolidWorks 2026 bringt laut F2 einen eigenen „Auto-Generate Drawing“-Befehl (Beta) mit. Die Frage ist, was nach der nativen Funktion noch fehlt und ob ein Add-in genau diese Lücke robust schließt. Das lässt sich nur am Teil prüfen, nicht am Schreibtisch. Reine Desk-Research (A) beantwortet es nicht, weil es keinen unabhängigen Praxistest gibt (Dossier §6).
2. **Option C ist im Dossier falsch geschnitten.** „Eine ganze Baugruppe mit Einzelteilzeichnungen, Ansichten, Bemaßung, Stückliste und Schriftfeld“ ist kein Prototyp, das ist das Produkt. 1-3 Monate (E3) halte ich dafür für zu optimistisch. Machbar in 3-4 Wochen ist dagegen eine Teilefamilie, etwa Blechteile oder rotationssymmetrische Drehteile, mit Vorlage, Schriftfeld aus Custom Properties, Standardansichten, Bohrungsbeschriftungen und einer regelbasierten Bemaßung, die Vorschläge macht. Stückliste und Schriftfeld sind per API Routine. Gute Bemaßung ist schwer. Toleranzen sind der Teil, den man nicht automatisieren sollte.
3. **„Lernt aus Firmenzeichnungen“ ist der riskanteste Teil der Idee, und das Dossier behandelt ihn nicht.** Um Trainingsdaten aus .slddrw zu holen, muss jede Zeichnung in einer lizenzierten SolidWorks-Sitzung geöffnet werden: Ansichten, Maße und Referenzen auf Kanten auslesen. Das ist langsam. Altzeichnungen enthalten oft lose oder überschriebene Maße. Viele Bestandszeichnungen kommen aus Vorgängersystemen (DWG/PDF) und sind nicht assoziativ. Das meiste, was als „Firmenstil“ gilt (Vorlage, Maßstab, Ansichtswahl, Schriftfeld, Bemaßungsnorm), ist Konfiguration und Regel. Dafür braucht man kein ML. ML lohnt sich höchstens für die Auswahl und Anordnung von Maßen, und erst, wenn die Regeln nicht mehr reichen.
4. **Nur ein CAD-System, und zwar SolidWorks.** Begründung: API und Add-in-Modell (.NET) sind verbreitet und gut dokumentiert. Creo wäre ein zweites Produkt: Object TOOLKIT C++ und der lizenzierte Teil von OTK Java kosten Geld, J-Link heißt jetzt „OTK Java Free“ und ist frei, aber eingeschränkt. Creo bringt außerdem eigene Versions- und Deploymentfragen mit. Multi-CAD am ersten Tag widerspricht meinem Mandat.
5. **Was ich gewinne oder verliere:** Ein eng gefasster Spike mit klarem Abbruchkriterium schützt meine Reputation. Was meine Reputation zerstört: ein Versprechen wie „vollautomatisch, beide Systeme, aus Bestandsdaten gelernt“, das nach sechs Monaten beim Kunden instabil läuft. Gegen meine eigene Neigung: Ohne 3-5 Firmen, die echte Teile und Vorlagen liefern, kann ich nicht sinnvoll testen. Etwas Ansprache, also ein Teil von A, muss deshalb parallel laufen.

## 2. Where the dossier is wrong, incomplete or mis-posed

- **Option fehlt:** „Benchmark der nativen Funktion“. Das ist der billigste technische Schritt, und er liegt vor A, B, C und D. Ohne ihn hängt die Antwort auf Ratsfrage 1 (Differenzierung) in der Luft.
- **F2 ist an einer Stelle unsicher.** Meine Websuche fand für den neuen Befehl Ansichten, vorgeschlagene Maße, Bohrungsbeschriftungen und eine Vorlagen-/Blattgrößen-Vorhersage. Bei Baugruppen kommen Stückliste, Positionsnummern und Revisionstabelle dazu (Javelin, TriMech, SolidWorks-Blog). Dass Form- und Lagetoleranzen automatisch gesetzt werden, habe ich in diesen Treffern nicht bestätigt gefunden. Gefunden habe ich es nicht, ausgeschlossen ist es damit nicht. Der Verifier sollte das prüfen, weil die Differenzierung bei Toleranzen davon abhängt.
- **Unbekannt ist, ob „Auto-Generate Drawing“ über die API erreichbar ist.** Gesucht habe ich per Websuche, gefunden habe ich nichts. Das ist wichtig: Wenn ja, kann man auf der nativen Funktion aufsetzen und muss nur Firmenregeln nachziehen. Wenn nein, baut man neben ihr her.
- **E3 vermischt zwei Dinge:** einen Spike (2-4 Wochen) und einen Prototyp für ganze Baugruppen (meine Schätzung: eher 3-6 Monate bis zu etwas, das bei einem Kunden stabil läuft).
- **Es fehlen Betriebsfragen,** die die Machbarkeit stark bestimmen: unterstützte SolidWorks-Versionen (Kunden ziehen Releases verzögert nach), PDM-Integration (Check-in, Dateinamen, Revisionen), Laufzeit pro Teil und Batch-Betrieb.
- **Fehlende bekannte Alternativen:** die eingebaute Bemaßungsfunktion „Modellelemente einfügen“ (aus Teile-Maßen und DimXpert/MBD), der Taskplaner und Systemhaus-Makros. Viele KMU haben schon Makros für Vorlage und Schriftfeld. Der Ausgangspunkt ist also nicht null (Annahme aus Projekterfahrung des Archetyps).

## 3. Evidence

| Claim | Type | Source or method |
|---|---|---|
| SolidWorks 2026 hat den Befehl „Auto-Generate Drawing“ (Beta): Ansichten, vorgeschlagene Maße, Bohrungsbeschriftungen; Vorlage/Blattgröße wird vorhergesagt | fact (Hersteller- und Reseller-Quellen) | Websuche 2026-10-21: blogs.solidworks.com „What's New 2026 - Design“; javelin-tech.com/3d/drawings-whats-new-in-solidworks-2026; trimech.com |
| Bei Baugruppen automatisch Stückliste, Positionsnummern, Revisionstabelle | fact (Reseller-Sekundärquelle) | dieselbe Suche, Reseller-Zusammenfassungen |
| Automatische Form-/Lagetoleranzen in SolidWorks 2026 | in meiner Suche nicht bestätigt | dieselbe Suche, kein Treffer; nicht ausgeschlossen |
| API-Zugang zu Auto-Generate Drawing | unbekannt | Websuche ohne Treffer; zu prüfen in der API-Hilfe 2026 |
| J-Link heißt jetzt „Object TOOLKIT Java Free“ und ist lizenzfrei, solange nur das pfc-Paket genutzt wird; der volle OTK Java und Toolkit C/C++ sind lizenzpflichtig | fact | ptc.com Support-Artikel CS190307 / CS188737; PTC-Community-Threads (teilweise alt) |
| Spike für eine Teilefamilie: 3-4 Wochen; Prototyp für Baugruppen bis Kundenreife: 3-6 Monate | estimate | Erfahrungsschätzung des Archetyps; nicht gemessen |
| Extraktion von Trainingsdaten braucht eine laufende, lizenzierte SolidWorks-Instanz und dauert Sekunden pro Zeichnung | estimate / assumption | Archetyp-Erfahrung; durch eine Messung an 100 Zeichnungen leicht zu prüfen |
| Der „Firmenstil“ ist überwiegend durch Regeln und Konfiguration abbildbar | assumption | zu prüfen durch Analyse von 50 Zeichnungen eines Pilotkunden |

## 4. Risks from this seat

- **A allein:** Wochen an Recherche ohne Antwort auf die eigentliche Frage. Der Gründer entscheidet dann auf Basis von Reseller-Marketing. Das Scheitern fällt nicht auf.
- **B zuerst:** ein Architekturpapier für Trainingspipeline und On-Prem-Backend, bevor feststeht, ob man überhaupt ML braucht. Klassische Fehlinvestition.
- **C wie im Dossier:** Der Umfang explodiert, und Version 1 ist nach drei Monaten nicht fertig.
- **D:** Klicks sagen nichts über Machbarkeit. Es entsteht ein Versprechen, das die Technik vielleicht nicht halten kann.
- **Leises Risiko im Produkt:** Automatisch erzeugte Maße, die plausibel aussehen, aber an der falschen Bezugskante hängen oder einen Maßstrang doppelt oder unvollständig führen. Der Zeichner sieht das bei der Freigabe nicht, und QS bezahlt es später. Deshalb gehört eine sichtbare Kennzeichnung „KI-gesetzt / ungeprüft“ in die Architektur ab Tag 1.
- **Plattformrisiko:** Jedes SolidWorks-Release kann die native Funktion verbessern und das Add-in entwerten. Der Benchmark muss bei jedem Release wiederholt werden.

## 5. The cheapest decisive step

**Benchmark, 1-2 Wochen:** 20-30 echte Teile (eine Teilefamilie) von 2-3 KMU mit deren Vorlagen. Für jedes Teil wird (a) eine Zeichnung mit „Auto-Generate Drawing“ aus SolidWorks 2026 erstellt, (b) ein erfahrener Zeichner stoppt die Nacharbeit bis zur Freigabe, (c) es wird gegen die vorhandene Firmenzeichnung verglichen. Parallel werden in der API-Hilfe 2026 die Zugriffsmöglichkeiten geprüft.

**Vorab festgelegt:** Senkt die native Funktion die Zeit pro Teil schon um ≥ 40 % inklusive Nacharbeit, und sind die Abweichungen überwiegend Stilfragen, die ein Kunde selbst konfigurieren kann, dann wechsle ich zu „E bzw. nur als schmale Regel-Erweiterung auf der nativen Funktion“. Spart sie < 20 %, oder liegen die Fehler systematisch bei Firmenvorlagen und Werksnorm-Bemaßung, dann empfehle ich den Spike. Danach gilt dasselbe Kriterium für das Add-in: ≥ 40 % gegenüber manuell und ≥ 20 Prozentpunkte besser als die native Funktion. Wird das nicht erreicht, wird abgebrochen.

## 6. Conditions and red lines

- Unterstützt wird nur dann: ein CAD-System (SolidWorks), eine Teilefamilie, ein fester Zeitrahmen, Abbruchkriterium vorher schriftlich festgelegt.
- Die Lösung macht Vorschläge, die markiert und korrigierbar sind. Funktionstoleranzen setzt sie nie automatisch.
- Zuerst lokal laufen lassen (Add-in ohne Cloud). ML erst dort, wo Regeln messbar scheitern.
- Keine Zusage „vollautomatisch, alle Teile, beide CAD-Systeme“ im ersten Jahr. Kein Versprechen „KI konstruiert selbst“. Kein Creo vor einem zahlenden SolidWorks-Piloten.

## 7. One line

Zuerst wird gemessen, was SolidWorks 2026 an echten Teilen schon kann. Danach kommt ein enger, zeitlich begrenzter Spike für eine Teilefamilie, regelbasiert und als Assistent, statt Marktpapier, Architekturpapier oder Baugruppen-Prototyp.

Sources: [SolidWorks-Blog What's New 2026](https://blogs.solidworks.com/products/solidworks/whats-new-in-solidworks-2026-design), [Javelin Drawings 2026](https://www.javelin-tech.com/3d/drawings-whats-new-in-solidworks-2026/), [TriMech Drawings 2026](https://trimech.com/drawings-whats-new-in-solidworks-2026/), [PTC CS190307](https://www.ptc.com/en/support/article/CS190307), [PTC CS188737](https://www.ptc.com/en/support/article/CS188737)
