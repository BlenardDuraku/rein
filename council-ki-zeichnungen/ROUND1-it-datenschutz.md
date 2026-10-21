# ROUND 1: IT-Leiter / Datenschutz beim Kunden (it-datenschutz)

**Dossier:** DOSSIER-01-ki-zeichnungsableitung-f-r-maschinenbau.md. **Addenda read:** keine vorhanden (geprüft per Verzeichnisliste am 2026-10-21).
**Round 1, independent:** no other member's report was read before this one was written.

**Position:** A zuerst, aber als Kundeninterviews mit IT-/Datenfragen im Pflichtteil, unmittelbar gefolgt von einem schlanken B (Datenfluss-/Sicherheitskonzept: lokal laufendes Add-in, mandantengetrenntes Lernen); C erst danach und nur lokal; D allein liefert mir nichts.
**Confidence:** medium

## 1. Position and why

1. **Datenhaltung ist kein Feature, sondern Eintrittskarte.** Aus meiner Sicht ist das 3D-Modell samt Zeichnungsarchiv das Firmenvermögen. Ein Produkt, das „aus bestehenden Firmenzeichnungen lernt“, verlangt genau den Zugriff, den ich am stärksten kontrolliere. Ich lege ein Veto ein, bevor die Konstruktionsleitung überhaupt einen Preis hört, wenn nicht klar ist, wo Modelle und Trainingsdaten verarbeitet werden (Annahme, gestützt auf die Rolle „IT als Vetoinstanz“ im Dossier §2).
2. **Hier kann ein Startup tatsächlich gegen die CAD-Hersteller gewinnen. Ob es das tut, ist offen.** Die nativen KI-Funktionen von SolidWorks 2026 sind, soweit öffentlich sichtbar, an Cloud Services und die 3DEXPERIENCE-Plattform gebunden. Für den KI-Begleiter wird „Cloud Services activated and access to your company's 3DEXPERIENCE platform“ verlangt (Reseller-Blog goengineer.com). Für AutoGenerate Drawing habe ich nicht gefunden, ob die Verarbeitung lokal oder in der Cloud läuft (siehe §3). Ein Add-in, das nachweisbar vollständig lokal läuft und pro Kunde getrennt lernt, wäre für Firmen mit strengen NDAs oder TISAX-Pflichten ein echtes Unterscheidungsmerkmal. Das gilt nur, wenn die native Funktion tatsächlich Daten abfließen lässt. Das ist ungeprüft.
3. **Warum A vor C:** Ein Prototyp, dessen Architektur schon eine Cloud-Pipeline für das Training voraussetzt, ist für meine Gruppe wertlos und lässt sich teuer zurückbauen. Die Datenfrage muss vor der ersten Zeile Code entschieden sein. Das Entscheidungskonzept B ist billig (Tage) und gehört direkt hinter die Interviews.
4. **Warum D wenig bringt:** Eine Landingpage misst Klicks, aber kein Freigabeverhalten der IT. Kein IT-Leiter trägt sich auf eine Warteliste ein. Die eigentliche Hürde (Sicherheitsfragebogen, NDA, AV-Vertrag) bleibt unsichtbar.
5. **Ich gewinne** durch ein Tool, das Schatten-IT verhindert: Ohne genehmigte Lösung laden Konstrukteure Teile womöglich in frei verfügbare KI-Dienste hoch (Annahme, typischer blinder Fleck meiner Rolle). **Ich verliere**, wenn ein Add-in die CAD-Installation destabilisiert oder ein mandantenübergreifendes Modell Know-how zwischen Wettbewerbern durchsickern lässt.

## 2. Where the dossier is wrong, incomplete or mis-posed

- **Die zentrale Frage meiner Karte fehlt im Dossier:** Wo werden Modelle und Trainingsdaten verarbeitet, bei SolidWorks 2026 (F2/F3), Creo 13 (F4) und DraftAid (F6)? Ich habe nachgesehen: draftaid.io war vom Sandbox-Netz aus nicht erreichbar (DNS-Fehler). Die Websuche zu SolidWorks 2026 brachte keine offizielle Aussage zu Verarbeitungsort oder Trainingsnutzung. Das bedeutet „nicht gefunden“, nicht „existiert nicht“.
- **F6 ist unter Datenschutzsicht mehrdeutig:** „80–90 % nach Training auf Firmenzeichnungen“ sagt nicht, *wo* trainiert wird und ob ein gemeinsames Modell entsteht. Für mich ist genau das der Unterschied zwischen „prüfbar“ und „Veto“.
- **Die rechtlichen Fragen in §6 sind zu pauschal.** Ich schlage vor, sie aufzuteilen. Das ist keine Rechtsberatung, nur geflaggt:
  (a) *Exportkontrolle:* Technische Daten zu Dual-Use-Gütern (EU-Dual-Use-VO 2021/821) können schon durch Übertragung oder Bereitstellung auf Servern außerhalb der EU berührt sein. Eine Cloud-Verarbeitung außerhalb der EU ist daher ein Rechtsthema und nicht nur ein Vertragsthema.
  (b) *DSGVO:* Bei CAD-Daten ist sie meist nachrangig. Sie greift aber bei Schriftfeldern (Namen und Kürzel von Zeichnern) und bei jeder Nutzungs- oder Leistungsprotokollierung. Hier kommt zusätzlich die Mitbestimmung des Betriebsrats nach § 87 Abs. 1 Nr. 6 BetrVG ins Spiel; vgl. die rote Linie des Zeichners zur Überwachung.
  (c) *EU AI Act:* Ob ein Zeichnungsassistent als Hochrisiko-System gilt (etwa als Sicherheitsbauteil im Sinne von Anhang I oder im Zusammenspiel mit der Maschinenverordnung 2023/1230), ist offen und muss juristisch geprüft werden.
  (d) *Geschäftsgeheimnisgesetz:* Fehlende „angemessene Geheimhaltungsmaßnahmen“ können den Schutz als Geschäftsgeheimnis gefährden. Eine unkontrollierte Weitergabe an einen Dienstleister ist deshalb auch für die Rechtsposition des Kunden relevant.
- **„Option B“ ist falsch zugeschnitten:** Das Dossier behandelt Datenschutz und On-Prem als Unterpunkt von B. Für den Vertrieb an KMU mit Automotive-Kunden ist das aber eine Produktentscheidung mit Wirkung auf Kosten (kein zentrales Training, schwächere Skaleneffekte bei ML) und gehört in A, also ins Geschäftsmodell.
- **Es fehlt eine Kostenfolge:** Lokales, mandantenspezifisches Lernen verschlechtert vermutlich die Modellqualität und erhöht den Supportaufwand. Diese Spannung zur Hoffnung „lernt aus Firmenzeichnungen“ benennt das Dossier nicht.

## 3. Evidence

| Claim | Type | Source or method |
|---|---|---|
| SolidWorks-2026-KI-Begleiter setzt aktivierte Cloud Services und Zugang zur 3DEXPERIENCE-Plattform voraus | fact (Sekundärquelle, Reseller) | goengineer.com „AI in SOLIDWORKS“, per Websuche 2026-10-21 |
| Verarbeitungsort und Trainingsnutzung von AutoGenerate Drawing | nicht gefunden | Websuche (Treffer: Reseller-Blogs, solidworks.com-eBook, controleng.com); keine offizielle Aussage gefunden |
| Ein Blog behauptet zentrale Verarbeitung „in the Dassault Systèmes Cloud“ und Mistral-Integration | Behauptung einer Drittquelle, unbestätigt | ohmycad.com (Reseller/Blog) |
| DraftAid-Datenhandhabung | nicht geprüft | draftaid.io/faq nicht erreichbar (DNS-Fehler aus der Sandbox) |
| IT hat bei KMU mit Automotive-Kunden faktisch ein Vetorecht über Tools, die CAD-Daten verarbeiten | assumption | Rollenbeschreibung; TISAX-Anforderungen nicht im Einzelnen geprüft |
| Exportkontrolle betrifft auch technische Daten bei Übertragung in Drittländer | fact (Rechtsrahmen), Anwendung im Einzelfall offen | EU-VO 2021/821; juristisch zu prüfen |
| Lokales Training pro Kunde kostet Modellqualität bzw. Entwicklungsaufwand | estimate | Allgemeine ML-Erfahrung: weniger Daten je Modell; nicht gemessen |

## 4. Risks from this seat

- **A:** Interviews ohne Gespräch mit der IT erzeugen falsche Zuversicht. Die Konstruktionsleitung sagt Ja, die IT lehnt drei Monate später ab. Das ist ein **stiller** Fehler, weil er erst im Einkauf sichtbar wird.
- **B:** Gering. Riskant wird es nur, wenn B zur Cloud-first-Architektur „weil einfacher“ führt.
- **C:** Prototypen werden oft mit echten Kundendaten auf dem Laptop des Gründers trainiert, ohne NDA oder AV-Vertrag. Ein einziger Vorfall beendet das Vertrauen im regionalen Mittelstand. Außerdem könnte ein Add-in mit Systemrechten CAD-Updates oder PDM stören.
- **D:** Weckt Erwartungen („lernt aus Ihren Zeichnungen“), ohne Datenfragen zu beantworten. Das ist reputationsschädlich, wenn Interessenten Daten schicken wollen.
- **E:** Für mich neutral. Die Schatten-IT-Gefahr bleibt aber bestehen, mit oder ohne dieses Produkt.

## 5. The cheapest decisive step

Fünf bis acht Gespräche mit IT-Leitern bzw. Informationssicherheitsbeauftragten von Maschinenbau-KMU (30 Minuten, parallel zu den Konstruktionsleiter-Interviews in A). Grundlage ist ein einseitiges Datenfluss-Blatt mit zwei Varianten: (1) komplett lokales Add-in, Lernen nur auf kundeneigenen Daten im eigenen Netz; (2) dedizierte EU-Instanz, vertraglich ausgeschlossenes Fremdtraining. Ergänzend: die offizielle Datenverarbeitungsdokumentation von SolidWorks 2026 AutoGenerate Drawing beschaffen (Systemhaus fragen, 1 Stunde).

**Vorab festgelegt, was meine Position ändert:**
- Sagen ≥ 4 von 6 IT-Verantwortlichen, die native Cloud-Funktion sei für sie *ohnehin akzeptabel* (oder zeigt die Dokumentation, dass sie lokal verarbeitet), dann ist „lokal und datensouverän“ **kein** Unterscheidungsmerkmal. Ich würde dann eher zu E bzw. „nur mit anderer Differenzierung“ tendieren.
- Lehnen ≥ 4 von 6 sogar Variante (2) ab und akzeptieren nur (1), dann muss die Architektur strikt On-Prem sein. Das ist die klare Vorgabe für B und C.

## 6. Conditions and red lines

- Firmendaten trainieren **kein mandantenübergreifendes Modell**, außer bei ausdrücklicher, widerruflicher Zustimmung (Opt-in).
- Keine Datenübertragung ohne NDA und, wo personenbezogene Daten betroffen sind, AV-Vertrag. Verarbeitung außerhalb der EU nur nach geklärter Exportkontrolle.
- Das Add-in läuft mit Benutzerrechten, ohne Telemetrie auf Personenebene, und ist mit der jeweiligen CAD-Version getestet. Es muss sich sauber deinstallieren lassen.
- Ein Sicherheitsfragebogen (z. B. VDA-ISA-orientiert) muss vor dem ersten Pilot beantwortbar sein.
- Pilotdaten im Prototyp: nur synthetische oder vom Kunden freigegebene Teile, bevorzugt beim Kunden vor Ort.

## 7. One line

Bauen ist aus meiner Sicht nur vertretbar als lokal laufendes, mandantengetrennt lernendes Add-in. Deshalb gehört die IT-Datenfrage in die Interviews von A und als kurzes Konzept B vor jeden Prototyp. Ob „datensouverän“ gegenüber der nativen SolidWorks-Funktion wirklich ein Unterscheidungsmerkmal ist, muss diese Woche geprüft werden, bevor jemand darauf baut.

Quellen der eigenen Recherche: [goengineer.com – AI in SOLIDWORKS](https://www.goengineer.com/en-us/blog/ai-in-solidworks), [ohmycad.com – Mistral AI SolidWorks 2026](https://ohmycad.com/en/mistral-ai-solidworks-2026-cloud-startups/), [controleng.com – AI buzz in SOLIDWORKS](https://www.controleng.com/whats-here-today-the-ai-buzz-in-solidworks-cad-3dexperience/), [SOLIDWORKS 2026 Enhancements eBook](https://www.solidworks.com/sites/default/filesd10/2025-08/SOLIDWORKS-2026-Enhancements-eBook-Whats-New.pdf).
