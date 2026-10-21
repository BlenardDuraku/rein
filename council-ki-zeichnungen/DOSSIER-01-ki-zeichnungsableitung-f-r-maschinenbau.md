# DOSSIER 01: KI-Zeichnungsableitung für Maschinenbau: bauen, und womit starten?

**Convened:** 2026-10-21. **Question:** Soll ein KI-Produkt zur automatischen Zeichnungsableitung für Maschinenbaufirmen gebaut werden, und wenn ja, mit welchem ersten Schritt?

This is the identical factual record every member works from. **Check it and report where it is
wrong, incomplete or mis-posed.** Later numbered addenda (ADDENDUM-01A, 01B, ...) win where
they conflict with this file.

Hinweis zur Entstehung: Dieses Dossier wurde aus einer kurzen Web-Recherche am 2026-10-21 zusammengestellt. Viele Quellen sind Reseller-Blogs, Aggregatoren oder Wettbewerber-Blogs, keine Primärquellen. Das ist bei jedem Fakt vermerkt.

## 0. The question in one line

Soll der Gründer ein Produkt bauen, das aus Creo-/SolidWorks-3D-Modellen Fertigungszeichnungen inkl. Stückliste, Bemaßung und Schriftfeld automatisch erzeugt und aus bestehenden Firmenzeichnungen lernt – und falls ja, mit welchem ersten Schritt (A, B, C oder D), oder nicht bzw. später (E)?

## 1. Options on the table

| Option | What it means | Reversible? | Rough cost / time |
|---|---|---|---|
| A. Markt-/Konkurrenzrecherche & Geschäftsmodell | Desk-Research, Wettbewerbsanalyse, Preis-/Umsatzrechnung, ggf. Kundeninterviews | Ja, voll | Wenige Wochen, kaum Geld (Schätzung) |
| B. Technische Architektur | Konzept für Add-in, Backend, Trainingspipeline, Datenschutz/On-Prem | Ja | 1–4 Wochen (Schätzung) |
| C. Prototyp SolidWorks-Add-in | Funktionierendes Add-in, das für eine Baugruppe Einzelteilzeichnungen mit Ansichten, Bemaßung, Stückliste, Schriftfeld erzeugt | Ja, aber Zeit gebunden | 1–3 Monate für einen Entwickler mit API-Erfahrung (Schätzung, siehe E3) |
| D. Landingpage zur Nachfragevalidierung | Website mit Nutzenversprechen, Warteliste/Demo-Anfrage, gezielte Ansprache | Ja | Tage bis 2 Wochen + Werbe-/Ansprachebudget (Schätzung) |
| E. Nicht bauen / später | Idee parken oder anderes Projekt verfolgen | Ja | Opportunitätskosten der Idee |

Die Optionen schließen sich nicht zwingend aus; der Rat kann eine Reihenfolge oder Kombination empfehlen.

## 2. Market or domain

- **Kunden:** Maschinen- und Anlagenbauer in DACH, besonders KMU und Sondermaschinenbau mit vielen Einzelteilzeichnungen. Nutzer: Konstrukteure / technische Produktdesigner. Käufer: Konstruktionsleitung, Geschäftsführung; IT als Vetoinstanz.
- **Größe (Deutschland):** gut 1 Mio. Beschäftigte im Maschinen- und Anlagenbau Ende 2025 (Betriebe ≥ 50 Beschäftigte), Rückgang ca. 2,2–2,4 % ggü. 2024 (F1). Zahl der Unternehmen und Zahl der CAD-Arbeitsplätze: nicht gefunden (siehe §6).
- **Wettbewerb nach Typ:**
  - *CAD-Hersteller selbst:* SolidWorks 2026 mit KI-gestützter automatischer Zeichnungserstellung (F2, F3); Creo 13 mit KI-Assistent, Zeichnungsautomatisierung dort nicht nachgewiesen, aber Creo Advanced Framework kann automatisch Komponentenzeichnungen erzeugen (F4, F5).
  - *Spezialisierte KI-Startups:* DraftAid (YC W24, SolidWorks + Inventor, kein Creo) (F6); weitere KI-Startups eher in Architektur/Bau (F9).
  - *Regelbasierte Konfiguratoren:* DriveWorks (SolidWorks-Add-in für Varianten inkl. Zeichnungen) (F7).
  - *Text-to-CAD (für die Langfrist-Vision „KI konstruiert selbst“):* z. B. Zoo; gut bei einfachen Teilen, schwach bei komplexen (F10).
- **Trends:** Alle großen CAD-Hersteller bauen 2025/2026 KI in ihre Produkte ein (F2–F4). Fachkräftemangel im Maschinenbau (Annahme A2, nicht belegt in diesem Dossier).

## 3. Goal, constraints and success measures

- **Goal:** Ein tragfähiges Produkt mit zahlenden Kunden im DACH-Maschinenbau.
- **Measure of success:** zahlende/unterschriebene Pilotkunden; gesparte Stunden pro Zeichnung inkl. Nacharbeit; Anteil KI-Zeichnungen, die nach menschlicher Prüfung ohne wesentliche Änderung freigegeben werden.
- **Constraints:** Budget, Zeit, Teamgröße und eigene Fähigkeiten des Gründers (Programmieren? Konstruktionserfahrung? Kontakte?) sind **unbekannt**. Haftung für Zeichnungen liegt beim Maschinenhersteller (F11). Konstruktionsdaten sind sensibles Know-how.
- **Who decides, and by when:** Der Gründer (Nutzer). Kein Termin genannt.

## 4. Facts

| # | Fact | Source | Date of source |
|---|---|---|---|
| F1 | Maschinen- und Anlagenbau Deutschland: gut 1 Mio. Beschäftigte Ende 2025, −2,2 % (≈ −22.000) ggü. 2024; Basis: Betriebe ≥ 50 Beschäftigte. Eine dpa-Meldung nennt −2,4 %. VDMA vertritt ca. 3.600 Mitgliedsunternehmen (nicht Gesamtzahl der Branche). | industrial-production.de „Jahresbilanz im Maschinen- und Anlagenbau“; boerse-online.de (dpa-AFX); produktion.de | 2026 bzw. 2025 |
| F2 | SolidWorks 2026 (GA November 2025) enthält KI-gestützte Zeichnungserstellung: schlägt Vorlage/Blattgröße vor, skaliert und ordnet Ansichten, erkennt Geometrie für Schnittansichten, setzt Bohrungsbeschriftungen, Form-/Lagetoleranzen und Referenzmaße. Laut einem Reseller noch Beta-Status, Ergebnisse brauchen Nacharbeit. | 3ds.com Newsroom; solidsolutions.co.uk (Reseller-Blog, Nov. 2025/Jan. 2026); javelin-tech.com (Reseller) | 2025–2026 |
| F3 | Im Rollout 2026x FD01 wird „prompt-guided drawing generation“ als Beta genannt (3DEXPERIENCE/SolidWorks). | CAD/CAM Update via EBSCO (Sekundärquelle) | 2026 |
| F4 | PTC Creo 13 / Creo+ 13.3 erschienen 10. Juni 2026 mit „Creo AI Assistant“ (Advise live, Assist Beta, Automate Alpha laut einem Wettbewerber-Blog). Automatische KI-Zeichnungserstellung in Creo 13 wurde **nicht** gefunden (Suche: Web, ptc.com-News, develop3d). | ptc.com News 2026; develop3d.com; getleo.ai (Wettbewerber-Blog) | 2026 |
| F5 | Creo Advanced Framework (Zusatzmodul) kann Komponentenzeichnungen automatisch erzeugen und Profil-/Blechteile automatisch bemaßen. | support.ptc.com Hilfe | aktuell |
| F6 | DraftAid: Startup (Toronto, YC W24), Plugin für SolidWorks und Inventor; Creo, CATIA, NX nicht unterstützt. Eigene FAQ: „bis 80–90 % Genauigkeit nach Training auf Firmenzeichnungen“; setzt **keine Toleranzen** automatisch. Preise nur aus Drittquellen (20–40 USD/Monat bzw. „ab 29 USD/Monat“), nicht offiziell. Pre-Seed ca. 500 kUSD (Feb. 2024) laut Aggregator. Ein Tool-Verzeichnis (futuretools.io) hat es mit einem Warnhinweis markiert. | draftaid.io/faq; shyft.ai; theaireport.ai; pitchbook/extruct (Aggregatoren) | 2024–2026 |
| F7 | DriveWorks: SolidWorks-Add-in, erzeugt regelbasiert Modell- und Zeichnungsvarianten inkl. Ansichtsplatzierung und Bemaßung für standardisierte Produktfamilien. | develop3d.com; trimech.com (Reseller) | — |
| F8 | SolidWorks Design Standard: 3.480 EUR/Jahr (≈ 290 EUR/Monat) je Arbeitsplatz, Professional ≈ 4.152 EUR/Jahr, Premium ≈ 5.496 EUR/Jahr (netto laut Reseller). | solidworks.com/de Preisseite; ohmycad.com (Reseller) | 2026 |
| F9 | KI-Startups für Zeichnungen finden sich 2024–2026 v. a. in Architektur/Bau (Synaps 3,6 M USD Pre-Seed; Drawer AI; Genia 3 M USD Pre-Seed). Kein großer verifizierter Funding-Deal speziell für Maschinenbau-Zeichnungsableitung gefunden. | trendingtopics.eu; seedtable/vcbacked (Aggregatoren); trysignalbase | 2024–2026 |
| F10 | Text-to-CAD (Zoo): in einem Test gut bei einfachen, maßlich spezifizierten Teilen; scheiterte an einem 24-Zahn-Zahnrad und an einem Ventilblock mit Innenkanälen; im Wesentlichen Einzelteile, keine Baugruppen. | wevolver.com Test (undatiert); docs.zoo.dev; getleo.ai (Wettbewerber) | undatiert / 2026 |
| F11 | EU-Maschinenverordnung 2023/1230 gilt ab 20. Januar 2027; Hersteller müssen technische Unterlagen nach Anhang IV erstellen und mind. 10 Jahre bereithalten; Verantwortung liegt beim Hersteller. | IHK Nordwestfalen, IHK Nürnberg; Uni Wuppertal Vortrag | 2023–2025 |
| F12 | Studie (Contact Software, Fraunhofer IPK, VDI; ca. 2011, n=1.401, Rücklauf ≈ 6 %): fast zwei Drittel der Konstrukteure verwenden ≤ 20 % ihrer Arbeitszeit für Kernaufgaben (Entwickeln, Konstruieren, Absichern). Den Zeitanteil speziell für **Zeichnungserstellung** misst sie nicht. | industrial-production.de „Kommunikation muss verbessert werden“ | ca. 2011 |

## 5. Estimates and assumptions

| # | Estimate or assumption | Basis or method | What would falsify it |
|---|---|---|---|
| E1 | Konstrukteure verbringen 30–50 % ihrer Zeit mit Zeichnungserstellung/-änderung. | **Unbelegte Faustzahl**, vom Dossier-Autor in einem früheren Gespräch genannt; keine Quelle gefunden (siehe F12, das etwas anderes misst). | Zeiterfassung bei 3–5 Firmen oder eine Studie mit anderem Wert |
| E2 | SolidWorks ist bei KMU verbreiteter, Creo eher bei größeren Firmen. | Anekdotisch (Foren 2014, G2-Reviewer-Verteilung, Stellenanzeigen); keine Marktstudie gefunden | Marktdaten/Reseller-Zahlen für DACH |
| E3 | Prototyp-Add-in (C) für eine Teilefamilie: 1–3 Monate für eine Person mit SolidWorks-API-Erfahrung. | Grobe Schätzung des Dossier-Autors, nicht gemessen | Ein Spike von 2–4 Wochen |
| E4 | Ein Kunde mit 10 CAD-Arbeitsplätzen zahlt bereits ca. 35–55 kEUR/Jahr für SolidWorks-Lizenzen. | 10 × F8 (Standard bis Premium) | Tatsächliche Lizenzmischung/Rabatte |
| E5 | Wert der Zeitersparnis: Bei z. B. 10 % Ersparnis × 1.600 h/Jahr × 70 EUR/h Vollkosten ≈ 11.000 EUR pro Konstrukteur und Jahr. | Rechenbeispiel mit angenommenen Werten (10 %, 1.600 h, 70 EUR/h); keine der drei Zahlen ist belegt | Echte Stundensätze und gemessene Ersparnis |
| E6 | Verkaufszyklen im Industrie-Mittelstand für neue Software dauern Monate, nicht Wochen. | Allgemeine B2B-Erfahrung, nicht belegt | Erste Pilotgespräche |
| A1 | Firmen wollen ihren eigenen Zeichnungsstil (Werksnormen, Vorlagen) – und genau das bieten die nativen Funktionen nicht gut. | Annahme; DraftAid wirbt mit Training auf Firmendaten (F6) | Kundeninterviews; Tests der nativen SolidWorks-2026-Funktion mit Firmenvorlagen |
| A2 | Fachkräftemangel in der Konstruktion erhöht die Zahlungsbereitschaft. | Annahme; durch F1 (Beschäftigungsrückgang) eher in Frage gestellt | Daten zu offenen Konstruktionsstellen |

## 6. What is not known

- **Fähigkeiten und Ressourcen des Gründers** (Programmieren, CAD-Erfahrung, Budget, Zeit, Kontakte zu Firmen): nicht angegeben; der Nutzer wurde gefragt, hat nicht geantwortet.
- **Anzahl Maschinenbauunternehmen und CAD-Arbeitsplätze in DACH; Marktanteile SolidWorks vs. Creo:** Websuche ergab keine belastbaren Zahlen (gesucht: allgemeine Websuche, Statista-/VDMA-Treffer). Nicht gesucht: Destatis WZ 28, Reseller-Geschäftsberichte.
- **Wie gut die native SolidWorks-2026-Zeichnungsautomatik in der Praxis ist**, besonders mit Firmenvorlagen und Werksnormen: nur Reseller-Aussagen („braucht Nacharbeit“, „Beta“), kein unabhängiger Test gefunden.
- **Ob Creo 13 automatische KI-Zeichnungen hat:** nicht gefunden; Suche hätte es in Release-Meldungen finden müssen, ist aber nicht ausgeschlossen.
- **Zahlungsbereitschaft** der Zielkunden: keine Daten.
- **Weitere Wettbewerber in DACH** (z. B. CAD-Systemhäuser mit eigenen Automatisierungs-Tools): nicht systematisch gesucht.
- **Rechtliche Fragen** (Haftung für KI-erzeugte Zeichnungen, EU AI Act, Exportkontrolle von Konstruktionsdaten): nur geflaggt, nicht geprüft; gehören zu einem Rechtsanwalt.

## 7. Positions already held

- **Neigung des Nutzers (zu prüfen):** Auf die Frage nach dem Startschritt hat der Nutzer „A“ geantwortet, also Markt-/Konkurrenzrecherche & Geschäftsmodell zuerst. Der Rat soll diese Neigung prüfen, nicht übernehmen.
- **Frühere Einschätzung des Dossier-Autors (zu prüfen):** Zeichnungsableitung ist heute machbar, „KI konstruiert selbst“ ist eine Langfrist-Vision; ein Add-in ist nötig, eine reine Website reicht nicht; SolidWorks zuerst; On-Prem/kundenspezifische Modelle wegen Know-how-Schutz. Diese Einschätzung stammt aus einem Chat ohne Recherche und enthielt die unbelegte Zahl E1.

## 8. What the council is asked

1. Lohnt es sich angesichts der nativen KI-Zeichnungsfunktionen in SolidWorks 2026 (F2, F3) und spezialisierter Startups (F6) überhaupt, dieses Produkt zu bauen? Wenn ja, worin müsste die Differenzierung liegen?
2. Welcher Startschritt (A, B, C, D) oder welche Kombination/Reihenfolge – oder E (nicht/später)?
3. Welcher Produktzuschnitt für den Einstieg (CAD-System, Teilefamilie, Grad der Automatisierung: Assistent vs. vollautomatisch, Umgang mit Toleranzen)?
4. Welche Bedingungen bei Daten, Haftung und Freigabeprozess muss das Produkt von Anfang an erfüllen, damit Kunden es einsetzen?
5. Was ist der günstigste Schritt, der die größte offene Frage entscheidet, und welches Ergebnis würde die Entscheidung ändern?
