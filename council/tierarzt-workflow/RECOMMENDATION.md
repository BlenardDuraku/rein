# RECOMMENDATION: High-End Bürokratie-Workflow für Tierarztpraxen

**Recommendation:** Baue einen "Behandlungs-Copilot": Aus einem Gespräch/Diktat entstehen alle Folgedokumente als Entwürfe, die der Tierarzt mit einem Klick freigibt und in seine bestehende Praxissoftware übernimmt. Keine eigene Praxissoftware, keine automatischen Behördenmeldungen in Version 1.
**Council vote:** Option A: 5 of 7 seats, weighted 6 of 8. **Dissent:** tfa (B), pvs-anbieter (C).
**Confidence:** medium, because alle Stimmen simuliert sind, keine Zeitmessung in echten Praxen existiert (V8) und es bereits deutschsprachige Wettbewerber gibt (ADDENDUM-01A item 2).
**Decision owner:** the user. The council is a simulation that advises; it does not decide.

## 1. What to do

Version 1 erzeugt aus einer Behandlung sieben Entwürfe: Behandlungsbericht, Besitzerinfo, Leistungs-/Rechnungsentwurf, Kostenvoranschlag, Versicherungspaket, Überweisungs-/Befundbrief, Erinnerungsvorschlag. Freigabe mit Protokoll; Übergabe per Ein-Klick-Kopie, PDF oder E-Mail. Details: `WORKFLOW-BAUPLAN.md` in diesem Ordner.

Erster Schritt: 10 Kleintierpraxen in OÖ fragen, welche eine Aufgabe sie abgeben würden, und an einem Tag am Empfang einer Praxis Strichliste führen.

## 2. Why

1. **Kein PVS-Wechsel:** Praxen wechseln ihre Praxissoftware nicht; Abrechnung, Hausapotheke und Meldungen sind deren Kern (ROUND1-praxisinhaber §1.1, ROUND1-pvs-anbieter §1.1). 7 von 7 Seats lehnen eine eigene Komplettsoftware ab.
2. **Differenzierung durch Breite des Ausgangs, nicht der Sprache:** Wettbewerber schreiben vor allem SOAP-Notizen; "Deutsch + DSGVO" allein unterscheidet nicht mehr (ADDENDUM-01A item 2; ROUND2-contrarian §1). Sieben Folgedokumente aus einem Gespräch lösen deutlich mehr der Abend- und Empfangsarbeit.
3. **Rechtlich sauber:** Entwürfe mit Freigabe und Protokoll halten die Verantwortung beim Tierarzt; Meldungen bleiben im PVS (ROUND1-recht §1.1, ROUND2-recht §1).

## 3. Dissent

| Seat | Dissent in its strongest form | What would prove it right |
|---|---|---|
| tfa | Ein Tool, das nur Tierärzten Zeit spart, verschiebt Arbeit zum Empfang. Die Verwaltung wird größtenteils am Empfang gemacht; wer ihn nicht von Anfang an mitdenkt, baut für die halbe Praxis. | Im Pilot sparen Tierärzte Zeit, der Empfang arbeitet gleich viel oder mehr. |
| pvs-anbieter | Ohne Integration wird ein Einzelgründer von PVS-Anbietern verdrängt, die "gut genug" KI gratis mitliefern. Kunden und Daten liegen beim PVS; früher PVS-Partner ist der einzige stabile Vertriebsweg. | Ein großer PVS führt innerhalb von 12 Monaten eine KI-Doku ohne Aufpreis ein. |

## 4. Risks and mitigations

| Risk | Who raised it | Likelihood / impact | Mitigation or early warning |
|---|---|---|---|
| Falscher, plausibel wirkender Entwurf wird ungeprüft übernommen | recht, tierhalter | mittel / hoch | Pflicht-Freigabe, Hervorhebung unsicherer Stellen, "fehlt/prüfen"-Liste |
| Dosis/Wartezeit erfunden | nutztier-ta, recht | mittel / hoch | Nur übernehmen, was gesagt wurde; keine Wartezeiten aus KI |
| PVS baut eigene KI-Doku | pvs-anbieter | mittel / hoch | Schnell starten; Breite der Ausgänge; Partnergespräche parallel |
| Arbeit wandert zum Empfang | tfa | mittel / mittel | Empfang im Pilot mitmessen; Versicherungspaket und Besitzerinfo in V1 |
| Audio-Datenschutz | recht, tierhalter | niedrig / hoch | EU-Verarbeitung, Audio nach Verarbeitung löschen, Halterinformation |
| Wettbewerber mit gleicher Idee | verifier (V13) | hoch / mittel | Wettbewerber testen; auf Folgedokumente und Lernfähigkeit setzen |

## 5. Open questions

- Abendarbeit der Tierärzte oder Telefon am Empfang: was ist größer? (Tally D1, keine Messung)
- Bietet ein PVS-Anbieter in AT/DE eine offene Schnittstelle oder ein Partnerprogramm?
- Wie gut ist der Wettbewerber vetzi auf Deutsch und welche Dokumente erzeugt er?
- Gilt die Chip-Erfassungspflicht bundesweit (ADDENDUM-01A item 3)?

## 6. Next steps

| Step | Owner | Cost / time | Result that would change the decision |
|---|---|---|---|
| 10 Praxen: "Welche eine Aufgabe würden Sie abgeben?" | Gründer | 1–2 Wochen | Mehrheit nennt Telefon → Option B |
| 1 Tag Strichliste am Empfang | Gründer | 1 Tag | Telefon > 40 % der Empfangszeit → Empfangs-Modul vorziehen |
| Wettbewerber (vetzi u. a.) testen | Gründer | 1 Tag | Wettbewerber liefert schon alle 7 Dokumente → andere Differenzierung nötig |
| 3 PVS-Anbieter nach Schnittstelle/Partnerprogramm fragen | Gründer | 2 Wochen | Offene Schnittstelle → Integration in V1 |
| Pilot in 3 Praxen mit Zeitmessung (Tierarzt + Empfang) | Gründer | 4 Wochen | < 30 min/Tag Ersparnis → Preis/Umfang überdenken |
| Datenschutz-Kurzprüfung + Halterinformation | Gründer + Jurist | 1–2 Wochen | Audio nicht EU-verarbeitbar → Architektur ändern |

## 7. What changed during the session

- ADDENDUM-01A item 2 (deutschsprachiger Wettbewerber) änderte die Begründung von contrarian: Differenzierung durch Breite der Folgedokumente statt Sprache.
- ADDENDUM-01A item 1 senkte die Bedeutung der AT-Antibiotika-Meldung für ein Nutztier-Modul; der Abgabebeleg-Entwurf wurde wichtiger.
- Kein Seat änderte seine Stimme zwischen den Runden.

## 8. Limits of this council

- **Simulation:** Alle Stimmen sind Archetypen, keine echten Tierärzte, Angestellten, Halter oder Anbieter.
- **Single-agent mode:** Alle Mitglieder wurden von einem Agenten in einem Kontext geschrieben.
- **Ungeprüft:** Zeitaufwand in Praxen (V8), Zahlungsbereitschaft, PVS-Schnittstellen, österreichische Praxiszahlen, TGD-Dokumentation (V10), Qualität der Wettbewerber.
- **Echte Prüfungen, die folgen sollten:** Interviews und Zeitmessung in Praxen, Gespräch mit der Tierärztekammer, Datenschutzjurist, Test der Wettbewerber, Anfragen bei PVS-Anbietern.
