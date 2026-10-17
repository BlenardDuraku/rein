# HUBA Trockenbau – Website (Entwurf)

Statische Website ohne Build-Schritt: `index.html` im Browser öffnen oder den Ordner auf einen
beliebigen Webspace bzw. Vercel/Netlify hochladen.

**Status: Entwurf.** Gelb markierte Stellen sind Platzhalter. Nicht veröffentlichen, bevor Huba
Inhalte geliefert und freigegeben hat.

## Was Huba liefern muss

- [ ] Logo (SVG oder PNG) – bis dahin ist „HUBA Trockenbau“ als Schriftzug gesetzt
- [ ] Region / Einsatzgebiet
- [ ] Telefon, E-Mail, Adresse, Erreichbarkeit → in `main.js` (`CONTACT_PHONE`, `CONTACT_EMAIL`) und im Kontaktblock
- [ ] Welche Leistungen stimmen, welche fehlen (Liste unter „Leistungen“)
- [ ] Frist fürs Angebot (Ablauf, Schritt 3)
- [ ] 4–8 Projektfotos mit Projektname, Ort und Leistung (quer, mind. 1600 px breit)
- [ ] Text „Über uns“: Inhaber, seit wann, Team, Besonderheiten, Meisterbetrieb, Zertifikate
- [ ] Impressumsdaten (Firmenwortlaut, UID, Firmenbuch, Gewerbe, Behörde, WKO-Innung)
- [ ] Hosting-Anbieter und Mailanbieter für die Datenschutzerklärung

## Fertigstellen

1. Platzhalter ersetzen, Projektfotos als `<img src="…" alt="…">` in die `.shot`-Felder setzen.
2. Formular verbinden: n8n-Workflow aus `../n8n` für Huba anpassen (Empfänger, Texte) und die
   Production URL in `main.js` bei `WEBHOOK_URL` eintragen.
   Das Formular schickt zusätzlich `location` (Ort) und `area` (Fläche) – im Workflow
   (`anfrage-pruefen.js`) die Leistungsliste und diese Felder ergänzen.
3. In allen drei HTML-Dateien `class="draft"` am `<body>` entfernen.
4. Datenschutzerklärung und Impressum fachlich prüfen lassen.

## Design

- Farben aus dem Material: Gipsplatten-Grau, verzinkter Stahl, Schlagschnur-Blau als Akzent.
  Die Leistungen sind mit den echten Plattenfarben markiert (Rot = Brandschutz, Grün = imprägniert).
- Hero: Schnitt durch eine Trockenbauwand, die sich beim Laden einmal aufbaut
  (bei „Bewegung reduzieren“ sofort fertig).
- Q1–Q4-Regler erklärt die Oberflächenqualität im Streiflicht.
- Schrift „Archivo“ (SIL Open Font License, `fonts/OFL.txt`) liegt lokal – keine Verbindung zu Google Fonts.
- Keine Cookies, kein Tracking, keine externen Abhängigkeiten.
