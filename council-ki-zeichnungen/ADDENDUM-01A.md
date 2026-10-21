# ADDENDUM 01A: corrections to DOSSIER 01

**Wins over DOSSIER-01-ki-zeichnungsableitung-f-r-maschinenbau.md and earlier addenda where they conflict.** Corrections and
measurements only. No member's position, vote or reasoning appears here.

Items are numbered on from the previous addendum so every correction has one stable number.
Quelle aller Prüfungen: VERIFICATION.md (Abschnitt 1, Dossier-Durchgang). Hinweis: Der Prüfer konnte Seiten nicht direkt abrufen, alle Belege stammen aus Suchmaschinen-Auszügen der genannten Seiten.

## 1. SolidWorks 2027 ist bereits erschienen

- **The dossier said:** Stand der Herstellerfunktion = SolidWorks 2026 (F2, F3, §2, Frage 1).
- **Correct:** SOLIDWORKS 2027 PR1 ist laut Technical Alert seit 10.08.2026 für Abo-Kunden verfügbar. Offizielle 2027-Seiten bewerben KI-Werkzeuge, die Fertigungszeichnungen erzeugen, auch aus kurzen Prompts. Reifegrad (allgemein freigegeben oder Beta) ungeklärt.
- **Source:** https://www.solidworks.com/media/drawings-and-mbd-whats-new-solidworks-2027 ; https://www.solidworks.com/sw/support/customerbulletins.html?atime=90 (V11)
- **Found by:** verifier
- **Matters because:** Frage 1 und jeder Benchmark der nativen Funktion. Gemessen werden muss der aktuelle Release, nicht 2026.

## 2. Native SolidWorks-Funktion deckt auch Stückliste, Positionsnummern, Revisionstabelle und Stapelbetrieb ab

- **The dossier said:** F2 nennt Vorlage/Blattgröße, Ansichten, Schnitte, Bohrungsbeschriftungen, Form-/Lagetoleranzen, Referenzmaße.
- **Correct:** Zusätzlich fügt die Funktion bei Baugruppen Stücklisten, automatische Positionsnummern und Revisionstabellen ein und verarbeitet mehrere Teile/Baugruppen im Hintergrund. Das ist nahezu der in Option C beschriebene Umfang. Der Beta-Status ist offiziell (Befehlsname „Auto Generate Drawing (Beta)“), nicht nur Reseller-Aussage.
- **Source:** solidsolutions.co.uk (Nov. 2025); javelin-tech.com; trimech.com; blogs.solidworks.com Tag „auto-generate-drawing-beta“ (V8, V9)
- **Found by:** verifier
- **Matters because:** Option C und die Differenzierungsfrage.

## 3. Prompt-gesteuerte Zeichnungserzeugung: Primärquelle vorhanden

- **The dossier said:** F3 nur aus Sekundärquelle (EBSCO).
- **Correct:** SOLIDWORKS-Blog Feb. 2026 (2026x FD01) beschreibt die Beta selbst. Creo-AI-Assistent-Stufen (Advise/Assist/Automate) bestätigt auf PTCs eigener „What's New“-Seite; Assist und Automate sind separate Extensions.
- **Source:** https://blogs.solidworks.com/solidworksblog/2026/02/whats-new-in-solidworks-2026x-fd01-design-and-modeling.html ; https://www.ptc.com/en/products/cad/creo/whats-new (V10, V13)
- **Found by:** verifier
- **Matters because:** Belastbarkeit von F3/F4 (Inhalt unverändert).

## 4. Creo Advanced Framework ist eng begrenzt und regelbasiert

- **The dossier said:** F5: AFX erzeugt Komponentenzeichnungen automatisch und bemaßt Profil-/Blechteile automatisch.
- **Correct:** Nur für mit AFX zusammengebaute Komponenten (Gestell-/Stahlbau) und für Profil- und plattenförmige Teile (nicht allgemein Blech). Regelbasiert über `drawing_setup.txt`, keine KI. Keine allgemeine Creo-Zeichnungsautomatik. Creo 13 ohne KI-Zeichnungsautomatik bleibt „nicht gefunden“ (mit Positivkontrolle).
- **Source:** support.ptc.com AFX-Hilfe (R7–R13); support.ptc.com „What's New: Creo Parametric 13“ (V14, V15)
- **Found by:** verifier
- **Matters because:** Einschätzung der Wettbewerbslage bei Creo.

## 5. Zahl der Maschinenbau-Unternehmen ist auffindbar

- **The dossier said:** §2/§6: Zahl der Unternehmen nicht gefunden.
- **Correct:** ZEW-Branchenreport Innovationen (Jan. 2026): ca. 10.486 Maschinenbau-Unternehmen mit ≥ 5 Beschäftigten in Deutschland 2024 (1,17 Mio. Beschäftigte); Spaltenzuordnung im Auszug nicht ganz eindeutig, amtlich prüfbar über Destatis GENESIS 42271-0002. Zusatz zu F1: Die „gut 1 Mio.“ beziehen sich auf Betriebe ≥ 50 MA; inklusive kleinerer Betriebe schätzte der VDMA Ende 2024 > 1,2 Mio. Die −2,4 % (dpa) und −2,2 % sind verschiedene Stände (Schätzung Dez. 2025 vs. Jahresbilanz), kein Widerspruch. CAD-Arbeitsplätze und Marktanteile weiter nicht gefunden.
- **Source:** https://www.zew.de/fileadmin/FTP/brarep_inno/issue/2025/BR-Inno26_17.pdf ; uamr.de; boerse-online.de (V1–V5)
- **Found by:** verifier
- **Matters because:** Marktgrößen-Abschätzung (Option A).

## 6. Drawer AI ist kein Zeichnungswerkzeug

- **The dossier said:** F9 führt Drawer AI unter KI-Startups für Zeichnungen in Architektur/Bau.
- **Correct:** Drawer AI wird als KI-Kalkulationssystem (Estimating) für Elektro-Fachbetriebe beschrieben (5 Mio. USD Seed, Okt. 2024), nicht als Zeichnungserzeuger.
- **Source:** https://commercialobserver.com/2024/10/drawer-ai-seed-round/ (V27)
- **Found by:** verifier
- **Matters because:** Wettbewerbsbild F9 (geringe Bedeutung).

## 7. Haftung: nicht nur beim Maschinenhersteller

- **The dossier said:** §3: „Haftung für Zeichnungen liegt beim Maschinenhersteller (F11).“
- **Correct:** Die Maschinenverordnung regelt die Konformitätsverantwortung des Herstellers, nicht die zivilrechtliche Haftung insgesamt. Die neue Produkthaftungsrichtlinie (EU) 2024/2853 erfasst Software einschließlich KI ausdrücklich als Produkt; Umsetzungsfrist 9.12.2026, gilt für danach in Verkehr gebrachte Produkte. Ein Softwareanbieter kann damit selbst haften (ersatzfähige Schäden begrenzt). Keine Rechtsberatung – gehört zu einem Anwalt.
- **Source:** https://www.frankfurt-main.ihk.de/recht/uebersicht-alle-rechtsthemen/vertragsrecht-und-e-commerce-recht/uebersicht/neue-regelungen-zur-produkthaftung-2026-7177184 (V32)
- **Found by:** verifier
- **Matters because:** Frage 4 (Bedingungen Haftung/Freigabe) und Risiko jeder Bau-Option.

## 8. Weiter unbestätigt

- **The dossier said:** futuretools-Warnhinweis zu DraftAid (F6); kein großer Funding-Deal für Maschinenbau-Zeichnungsableitung (F9); A2 Fachkräftemangel; E1 (30–50 % Zeichnungszeit).
- **Correct:** Alle vier bleiben UNVERIFIED bzw. unbelegt. Für E1 ist die einzige gefundene Messung eine IBM-Studie von 1977/78 (ein Unternehmen, vor CAD): 25 % im Mittel, einzelne Abteilungen ≥ 40 %.
- **Source:** VERIFICATION.md V22, V28, V40 und E1-Zeile
- **Found by:** verifier
- **Matters because:** Wertrechnung E5 und Wettbewerbsbild.

## Disagreements recorded, not adjudicated

Keine bisher.

## Standing instruction

Check this record too. Report anything further, and prefer checking a source or running the
analysis over arguing about it.
