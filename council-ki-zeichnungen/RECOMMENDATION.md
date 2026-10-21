# RECOMMENDATION: KI-Zeichnungsableitung für Maschinenbau: bauen, und womit starten?

**Recommendation:** Noch nichts bauen. Zuerst 2–4 Wochen bei echten Firmen messen: die native Zeichnungsautomatik im aktuellen SolidWorks-Release an 20–30 echten Teilen testen und dieselben Firmen (Konstruktion und IT) befragen, mit konkretem Pilotpreis. Ein enger, befristeter Spike folgt nur, wenn vorab festgelegte Schwellen erreicht sind und mindestens eine schriftliche Pilotzusage vorliegt. Sonst nicht bauen (E).
**Council vote:** option A: 6 of 7 seats, weighted 7 of 8. **Dissent:** investor (option B, „erst Geld, dann Bau“).
**Confidence:** medium. Der Rat ist sich über den ersten Schritt einig. Ob es überhaupt eine Lücke gibt, für die jemand zahlt, weiß aber noch niemand, und die native Funktion des Herstellers verbessert sich jedes Jahr.
**Decision owner:** the user. The council is a simulation that advises; it does not decide.

## 1. What to do

**Deine Neigung „A = Markt-/Konkurrenzrecherche zuerst“ hat der Rat geprüft und in dieser Form verworfen.** Kein Sitz unterstützt reine Desk-Research, kein Sitz eine Landingpage, eine Architektur oder einen Prototyp als ersten Schritt. Dein A bleibt richtig in der Reihenfolge („erst klären, dann bauen“). Geklärt wird aber durch Messung beim Kunden, nicht durch Lektüre.

**Schritt 0 (vor allem anderen, 1 Tag):** Schreib für dich auf, welches Budget, welche Laufzeit, welche CAD-/Programmierkenntnisse und welche Kontakte zu Maschinenbaufirmen du hast (ROUND2-investor §1.5). Ohne Zugang zu 2–3 Firmen mit echten Teilen ist der Hauptschritt nicht machbar. Dann gilt Option B (nur Gespräche mit Preisfrage).

**Hauptschritt (2–4 Wochen, kein Code):**
1. **Benchmark der nativen Funktion** im *aktuellen* SolidWorks-Release (2027, ADDENDUM-01A item 1), beim Kunden, auf dessen Lizenz und in dessen Netz, mit NDA und schriftlicher IT-Freigabe (ROUND2-it-datenschutz §1):
   - 20–30 echte Einzelteile **einer** Teilefamilie (z. B. Drehteile oder Blech) von 2–3 KMU, mit deren Vorlage und PDM-Attributen.
   - Gemessen werden **Erzeugen + Prüfen + Korrigieren** im Vergleich zum Selbstzeichnen, anonym, ohne Personenbezug (ROUND2-zeichner §1).
   - Ein zweiter Prüfer, der nicht weiß, woher die Zeichnung stammt, sortiert jede Abweichung nach Art (Stil/Norm, Formmaß, Funktion/Toleranz/Bezug, PDM) und als **laut** oder **leise** (ROUND2-qs-normen §1).
   - Dazu wird protokolliert: Welche Daten verlassen das Netz? Ist die Funktion am Arbeitsplatz überhaupt freigeschaltet? Ist sie per API erreichbar (ADDENDUM-01B items 11, 13)?
2. **5–10 Gespräche mit denselben und weiteren Firmen**, davon mindestens 5 mit IT-/Sicherheitsverantwortlichen:
   - Zeitaufteilung: Neuableitung, Änderung/Revision, Prüfung.
   - Ein einseitiges Datenfluss-Blatt (lokal vs. EU-Instanz).
   - Am Ende ein **konkretes Pilotangebot mit Preis** (z. B. 3–5 kEUR für 2 Wochen an 30 eigenen Teilen).
3. **Vorab schriftlich festgelegte Schwellen** (Synthese aus den Round-2-Berichten):
   - **→ E (nicht bauen)**, wenn eines davon zutrifft:
     - Die native Funktion spart mit Firmenvorlage **≥ 40 %** inkl. Prüfen und Korrigieren, die Restkorrektur betrifft überwiegend Toleranzen oder Kundenkonfiguration, und sie macht in der Klasse Funktion/Toleranz praktisch keine leisen Fehler.
     - **0 Pilotzusagen**.
     - ≥ 4 von 6 IT-Leitern akzeptieren die cloudgebundene native Funktion, *und* es zeigt sich keine Lücke bei Hausstil oder Prüfbarkeit.
   - **→ Spike**, wenn alles davon zutrifft:
     - Die native Ersparnis ist gering (< 20–25 %), *oder* die native Funktion erzeugt leise Fehler.
     - Der Großteil der Nacharbeit ist Werksnorm, Hausstil, PDM oder Bemaßungsregeln einer Teilefamilie.
     - Es gibt **mindestens eine schriftliche Pilotzusage** zu einem genannten Preis.
     - Mindestens 2 von 3 Benchmark-Firmen bestätigen, dass ein lokales Add-in zum Pilot zugelassen würde.
   - **Dazwischen:** Weiter geht es nur, wenn ≥ 3 Firmen dieselbe Lücke nennen.
   - **Eine Schwelle, die nur Zeit misst, ist ungültig** (ROUND2-qs-normen §5).

**Wenn der Spike kommt (3–4 Wochen, mit schriftlichem Abbruchkriterium):**
- SolidWorks only, eine Teilefamilie, regelbasiert, kein ML, lokal, mit Benutzerrechten.
- Ein **markierender Assistent**: Jedes gesetzte Element ist als „KI-Vorschlag, ungeprüft“ gekennzeichnet.
- Funktionstoleranzen werden **nie** automatisch gesetzt. Sie kommen nur aus menschlich gesetzter PMI.
- Am besten als Nachbearbeitungs- und Prüf-Add-in auf einer nativ erzeugten Zeichnung, nicht als zweite Ableitungsmaschine (ROUND2-cad-entwickler §1.2).
- Erfolgskriterium: ≥ 20 Prozentpunkte besser als die native Funktion, und nicht mehr leise Fehler als bei manuellen Zeichnungen. Wird das verfehlt, wird abgebrochen.

**Nicht jetzt:** Creo, Multi-CAD, Lernen aus Bestandszeichnungen per ML, „KI konstruiert selbst“, Landingpage.

## 2. Why

1. **Der Kern des Produkts ist schon beim Kunden.** SolidWorks erzeugt seit Version 2026 Zeichnungen samt Ansichten, Bemaßungsvorschlägen, GD&T-Rahmen, Stückliste, Positionsnummern und Revisionstabelle im Stapelbetrieb, als Beta. Version 2027 ist da. Autodesk Fusion hat die Funktion seit Januar 2024 (ADDENDUM-01A items 1–2, 01B items 10, 12). Ein Startup konkurriert deshalb mit einer Funktion, die der Kunde schon bezahlt hat, nicht mit Handarbeit (ROUND1-konstruktionsleiter §1.1; ROUND1-cad-hersteller §1.1).
2. **Die mögliche Lücke ist empirisch und lässt sich in Wochen messen.** Dafür braucht es keine Monate Entwicklung. Die Kandidaten für eine Lücke sind Werksnorm und Hausstil, Prüfbarkeit (laute und leise Fehler) und lokaler Betrieb statt Cloud (ROUND1-TALLY §D3). Kein unabhängiger Praxistest der nativen Funktion wurde gefunden (DOSSIER §6, VERIFICATION V-Zeilen zu F2).
3. **Wo der Wert liegt, liegt auch das Risiko.** Layout-Fehler fallen auf. Fehler in Funktionstoleranzen sehen plausibel aus und zeigen sich erst in der Fertigung. Nach der Produkthaftungsrichtlinie 2024/2853 kann außerdem der Softwareanbieter selbst haften (ADDENDUM-01A item 7; ROUND2-qs-normen §1). Deshalb werden die Toleranzen dem Menschen gelassen und alles wird markiert.

## 3. Dissent

| Seat | Dissent in its strongest form | What would prove it right |
|---|---|---|
| investor | Eine Lücke gegenüber einer Beta-Funktion ist ein bewegliches Ziel: Der Hersteller bringt etwa jährlich ein Release, und jede Messung veraltet. Eine Zahlungszusage veraltet nicht. Der Kunde hat die native Funktion bereits bezahlt (35–55 kEUR/Jahr bei 10 Plätzen, gebundenes Budget). Ein Startup verkauft also nur die Differenz, und die wird jährlich kleiner. Wer nach einer gemessenen Lücke direkt baut, verwechselt Machbarkeit mit Nachfrage. Deshalb sollte der Benchmark selbst als **bezahlter** Pilot verkauft werden (3–5 kEUR). Gebaut wird erst bei ≥ 3 von 10 bezahlten Zusagen, bei 0–1 gilt E (ROUND2-investor §5). | Der Benchmark zeigt eine Lücke, aber in den Gesprächen sagt niemand einen Pilot zu einem genannten Preis zu. Oder die Firmen machen kostenlos mit, ziehen sich aber vor einer Bezahlung zurück. |

Vorbehalte innerhalb der Mehrheit, nicht abgeschwächt:
- **it-datenschutz:** Die IT ist im Mittelstand ein Veto, nicht nur ein Gesprächspartner. Jede Spike-Schwelle braucht ein IT-Kriterium (≥ 2 von 3 Firmen bestätigen schriftlich, dass ein lokales Add-in zum Pilot zugelassen würde). Schon der Benchmark ist ein Datenfluss: Laut 01B item 11 kann die native Funktion Daten an die Herstellerplattform schicken. Er braucht deshalb NDA, IT-Freigabe und den Ausschluss exportkontrollierter Teile (ROUND2-it-datenschutz §1, §5).
- **qs-normen:** Ein Befund wie „spart 50 %, setzt aber still falsche Bezüge“ ist weder ein Grund für E noch ein Grund zu bauen. Er ist ein eigener Befund: Die Lücke liegt dann in der Prüfbarkeit (ROUND2-qs-normen §5).
- **cad-hersteller:** Auch ein positiver Benchmark hat ein Verfallsdatum. Deshalb muss der Benchmark bei jedem Hauptrelease wiederholt werden. Der Produktkern dürfen nur kundenspezifische Regeln und Daten sein. Vorher ist zu prüfen, ob Systemhaus-Makros die Lücke schon füllen (ROUND2-cad-hersteller §5).
- **cad-entwickler:** Der Spike soll als Nachbearbeitungs- und Prüf-Add-in geschnitten sein, ohne ML, und das Abbruchkriterium wird vorher schriftlich festgelegt (ROUND2-cad-entwickler §5).

**Offene Bedingung (nicht einheitlich):** Wie viel Zusage vor dem Spike nötig ist, bewerten die Sitze unterschiedlich:
- qs-normen und cad-entwickler: ≥ 1 schriftliche Absichtserklärung.
- konstruktionsleiter: ≥ 2 schriftliche Zusagen.
- cad-hersteller: ≥ 1 *bezahlter*, unterschriebener Pilot.
- zeichner: ≥ 1 Pilotfirma, die Teile und einen Konstrukteur stellt.
- investor: ≥ 3 bezahlte.

Die Empfehlung setzt das Minimum (≥ 1 schriftliche Zusage zu genanntem Preis). Je mehr Zusagen, desto sicherer.

## 4. Risks and mitigations

| Risk | Who raised it | Likelihood / impact | Mitigation or early warning |
|---|---|---|---|
| Gemessene Lücke wird mit Zahlungsbereitschaft verwechselt | investor | mittel / hoch | Preisfrage in jedem Gespräch; Spike nur mit schriftlicher Zusage |
| Native Funktion schließt die Lücke im nächsten Release | cad-hersteller, investor | hoch / hoch | Benchmark je Release wiederholen; Produktkern = Kundenregeln und Daten; kurz kündbare Verträge einplanen |
| Leise Toleranz- und Maßfehler gelangen in die Fertigung (auch durch die native Funktion) | qs-normen, zeichner, konstruktionsleiter | mittel / sehr hoch | Keine automatischen Funktionstoleranzen; Herkunftsmarkierung; Messung an Fehlern nach Freigabe |
| IT stoppt den Pilot nach Zusage der Konstruktion | it-datenschutz | mittel / hoch | IT-Gespräche als Pflichtteil; IT-Kriterium in der Spike-Schwelle; Sicherheitsfragebogen vorbereiten |
| Kundendaten auf dem Laptop des Gründers, ohne NDA | it-datenschutz | mittel / sehr hoch (Vertrauensverlust) | Benchmark nur beim Kunden, auf dessen Lizenz; NDA; nur freigegebene Teile |
| Kein API-Zugang zur nativen Funktion: Ein Add-in muss daneben bauen | cad-entwickler | unbekannt / mittel | In Woche 1 mit API-Hilfe 2027 prüfen; Nachbearbeitungs-Zuschnitt |
| Lernen aus Altzeichnungen zementiert alte Normstände (z. B. ISO 2768-2 statt ISO 22081) | qs-normen | mittel / mittel | Kein ML im ersten Spike; Bestände per Stichprobe auf Normstand prüfen |
| Produkt wird zur Leistungsüberwachung, Konstrukteure boykottieren still | zeichner | gering–mittel / mittel | Keine Telemetrie auf Personenebene; anonyme Messung; Betriebsratsfrage an einen Juristen |
| Haftung des Anbieters nach Produkthaftungsrichtlinie 2024/2853 | verifier (01A item 7) | unbekannt / hoch | Rechtsberatung vor erstem bezahltem Pilot; Markierung und Protokoll ohne Personenbezug |

## 5. Open questions

- Liegt die eigentliche Zeitlast in der Erstableitung oder in Änderungen und Prüfung (ROUND1-TALLY §D4)? Davon hängt ab, wofür ein Spike gebaut wird. Das klärt die Zeitaufteilung in den Gesprächen.
- Ist die Auto-Zeichnung per API erreichbar (01B item 13, UNVERIFIED)?
- Welche Daten schickt die native Funktion tatsächlich an die Herstellerplattform, und stört das die Kunden-IT (01B item 11)?
- Wie verbreitet sind SolidWorks und Creo in DACH-KMU? Wie viele CAD-Arbeitsplätze gibt es? Nicht gefunden (01A item 5).
- Rechtsfragen für einen Anwalt, nicht vom Rat beantwortet:
  - Produkthaftung des Softwareanbieters
  - AI-Act-Einordnung
  - Exportkontrolle bei Cloud-Verarbeitung (Dual-Use-VO 2021/821)
  - Mitbestimmung des Betriebsrats (§ 87 BetrVG)
  - Geschäftsgeheimnisgesetz
- Wie viel Zusage vor dem Spike nötig ist, bleibt zwischen den Sitzen offen (siehe §3).

## 6. Next steps

| Step | Owner | Cost / time | Result that would change the decision |
|---|---|---|---|
| 0. Budget, Laufzeit, Fähigkeiten und Firmenkontakte aufschreiben | Gründer | 1 Tag | Kein Zugang zu 2–3 Firmen mit echten Teilen → nur Gespräche mit Preisfrage (Option B); Budget reicht nicht für einen 3–4-Wochen-Spike → E |
| 1. Benchmark-Protokoll, Fehlerklassen, Schwellen und Datenfluss-Blatt schriftlich festlegen; NDA-Vorlage | Gründer | 2–3 Tage | — (Voraussetzung) |
| 2. 2–3 Firmen für den Benchmark gewinnen, 5–10 Gespräche (≥ 5 mit IT) inkl. Preisangebot | Gründer | 2–4 Wochen parallel | 0 Pilotzusagen → E |
| 3. Benchmark der nativen Funktion im aktuellen Release an 20–30 Teilen, beim Kunden | Gründer + Konstrukteur des Kunden + Zweitprüfer | 1–2 Wochen | Native ≥ 40 % inkl. Prüfen, Rest überwiegend Toleranzen, keine leisen Funktionsfehler → E |
| 4. API-Zugang zur nativen Funktion in der API-Hilfe 2027 prüfen | Gründer oder Entwickler | 1 Tag | Zugang vorhanden → Add-in kann aufsetzen statt daneben bauen |
| 5. Prüfen, ob Systemhaus-Makros die gemessene Lücke schon füllen | Gründer | 1–2 Tage | Ja → E oder anderer Zuschnitt |
| 6. Nur bei erreichten Schwellen: Spike 3–4 Wochen, eine Teilefamilie, regelbasiert, markierend, lokal | Gründer oder Entwickler | 3–4 Wochen | Add-in nicht ≥ 20 Pp. besser als nativ oder mehr leise Fehler als manuell → Abbruch |
| 7. Vor erstem bezahltem Pilot: Rechtsberatung (Haftung, Export, AI Act, BetrVG) | Gründer + Anwalt | einige Stunden | Unüberwindbare Rechtslage → Zuschnitt ändern |

## 7. What changed during the session

- **ADDENDUM-01A item 1:** SolidWorks 2027 ist erschienen. Der Benchmark muss den aktuellen Release testen.
- **01A item 2:** Die native Funktion deckt auch Stückliste, Positionsnummern, Revisionstabelle und Stapelbetrieb ab. Damit entspricht sie fast der Dossier-Option C. Alle Sitze sehen dadurch eine kleinere Lücke.
- **01A item 7:** Der Softwareanbieter kann nach der neuen Produkthaftungsrichtlinie selbst haften. Das hat die Forderungen nach Markierung und „keine automatischen Toleranzen“ verstärkt.
- **01B item 9:** DraftAid verkauft Jahreslizenzen für 200+ Zeichnungen/Monat, nicht 20–40 USD/Monat. Der Hinweis kam vom investor, der verifier hat ihn bestätigt.
- **01B item 10:** Fusion hat automatische Zeichnungen seit Januar 2024.
- **01B item 11:** Die native KI ist an Cloud/3DEXPERIENCE gebunden. Das stützt „lokal“ als mögliche Differenzierung, beweist sie aber nicht.
- **01B item 13:** Kein API-Zugang zur nativen Auto-Zeichnung gefunden.
- **Stimmwechsel:** it-datenschutz wechselte von „Daten zuerst“ (Tally-Option C) zu A, mit IT-Bedingungen. Begründung: ROUND1-cad-entwickler §4, ROUND1-konstruktionsleiter §1.5 und 01B item 11.
- **Übernahmen aus der Minderheitsposition:** Fünf Sitze haben den Kern des investor-Einwands übernommen (Preisfrage in den Gesprächen, Zusage vor dem Spike): konstruktionsleiter, qs-normen, cad-entwickler, cad-hersteller, zeichner.
- **Unbelegte Faustzahl:** Die im Chat genannte Zahl „30–50 % der Zeit für Zeichnungen“ ist unbelegt (01A item 8). Die einzige gefundene Messung (IBM 1977/78) nennt 25 %.

## 8. Limits of this council

- **Simulierte Perspektiven, keine echten Stakeholder.** Alle Positionen sind Hypothesen über das, was Konstruktionsleiter, Konstrukteure, QS, IT, Investoren und Hersteller denken könnten. Bestätigen können das nur echte Gespräche und der Benchmark selbst.
- **Parallelmodus:** Jedes Mitglied war ein eigener Agent mit derselben Modellbasis. Die Unabhängigkeit ist also nur strukturell, nicht inhaltlich echt.
- **Einstimmigkeit beim ersten Schritt ist ein Warnsignal.** Das Dossier hat in §6 „wie gut ist die native Funktion“ als Lücke benannt und damit die Benchmark-Idee nahegelegt. Der Gegen-Sitz hat seinen Fall aber eigenständig vertreten und bis zum Ende gehalten.
- **Belege:** Der Faktenprüfer konnte Seiten nicht direkt abrufen. Alle Belege stammen aus Suchmaschinen-Auszügen. Viele Quellen zur SolidWorks-Funktion sind Reseller-Blogs. 6 von 63 Aussagen blieben unbestätigt (VERIFICATION.md).
- **Fehlende Sitze:**
  - CAD-Systemhaus/Reseller (möglicher Kanal und Konkurrent mit eigenen Makros)
  - Fertigung/Werkstatt als Leser der Zeichnungen
  - Jurist
- **Unbekannt sind die Ressourcen des Gründers.** Ohne sie ist die Empfehlung nur bedingt gültig (siehe Schritt 0).
- **Keine Rechts-, Steuer- oder Investitionsberatung.** Rechtsfragen gehören zu einem Anwalt.
