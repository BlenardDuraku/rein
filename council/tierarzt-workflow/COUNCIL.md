# Advisory council: High-End Bürokratie-Workflow für Tierarztpraxen

**Convened:** 2026-10-17. **Decision owner:** the user; the council advises.
**Mode:** single (parallel: one subagent per member; single: one agent writes every member in turn).
**Files:** this folder. Later numbered addenda win over the dossier where they conflict.

## 1. The decision

- **Subject and decision:** Welchen Umfang und welche Form soll ein KI-Produkt haben, das Tierarztpraxen die Bürokratie abnimmt: nur Dokumentation (wie VetScribe heute), eine KI-Schicht über der bestehenden Praxissoftware, eine komplette eigene Praxissoftware, oder gar nichts Neues?
- **Market or domain, and geography:** Tierarztpraxen in Österreich und Deutschland (Kleintier zuerst, Gemischt/Nutztier geprüft), Direktvertrieb an Praxen, Horizont 1–3 Jahre.
- **Goal and success measure:** Ein Produkt, für das Praxen gern einen hohen Monatspreis zahlen, weil es messbar Stunden spart, rechtssicher ist und wirklich gebraucht wird; von einer Person mit KI baubar und betreibbar.
- **Constraints:** Ein Gründer (20) mit KI-Werkzeugen, wenig Kapital; DSGVO, Tierarzneimittelrecht (AT/DE), Berufsrecht; Praxen haben fast immer schon eine Praxissoftware; Fehler in Pflichtdokumentation haben Folgen für den Tierarzt.
- **Evidence available:** Öffentliche Quellen zu TAMG (AT/DE), Antibiotika-Meldungen, Heimtierdatenbank, GOT, Tierärztestatistik, Wettbewerbern (siehe Dossier). Es fehlen: Gespräche mit echten Praxen, Messung, wo die Zeit wirklich hingeht, Schnittstellen der Praxissoftware.

## 2. Roster

Voting seats. Weights are relative (default 1); the tally reports headcount and weighted count.
The verifier is persona-free and does not vote.

| Seat id | Seat | Group | Weight |
|---|---|---|---:|
| contrarian | Skeptischer Produktberater (Scope-Kritiker) | Kritiker | 1 |
| praxisinhaber | Inhaberin einer Kleintierpraxis (Käuferin) | Kunden | 2 |
| tfa | Tiermedizinische Fachangestellte / Ordinationsassistenz | Kunden | 1 |
| nutztier-ta | Gemischt-/Nutztierpraktiker | Kunden | 1 |
| pvs-anbieter | Etablierter Praxissoftware-Anbieter (Wettbewerber-Archetyp) | Wettbewerb | 1 |
| recht | Datenschutz- und Tierarzneimittelrecht-Experte | Aufsicht | 1 |
| tierhalter | Tierhalterin (Endkundin der Praxis) | Kunden | 1 |
| verifier | Persona-free verifier (no vote) | - | 0 |

Seats deliberately included: contrarian argumentiert gegen "komplette Bürokratie" (Scope). tfa spricht für die Angestellten, die den Großteil der Verwaltung tatsächlich machen, aber nicht kaufen; tierhalter für die Endkunden. recht hat umgekehrte Priorität (lieber nicht automatisieren als falsch).. Seats considered and left out, and why: Ein Tierarzneimittel-Großhändler und eine Tierversicherung wurden weggelassen; ihre Sicht fließt über pvs-anbieter und tierhalter ein. Ein Investor-Sitz entfällt.

## 3. Persona cards

Every member is a role or an organisation type, never a real named person. Real companies appear
only as clearly labelled competitor-perspective archetypes built from public information.

### contrarian: Skeptischer Produktberater (Scope-Kritiker)

- **Group:** Kritiker. **Weight:** 1.
- **Archetype note:** Rollen-Archetyp: Produktberater für Software-Startups.
- **Mandate:** Den Gründer davor bewahren, zu viel auf einmal zu bauen.
- **Incentives:** Gewinnt nichts; misst Erfolg an zahlenden Kunden nach 12 Monaten.
- **Knowledge:** Produkt-Fokus, Scope Creep, Wettbewerb gegen etablierte Systeme.
- **Priorities:** Ein Problem perfekt vor zehn halb.
- **Blind spots:** Unterschätzt, dass Kunden manchmal wirklich ein Komplettpaket wollen.
- **Red lines:** "Komplette Bürokratie" als erstes Produkt.
- **Would change its mind if:** Praxen sagen in Interviews mehrheitlich, dass sie nur für das Gesamtpaket zahlen würden.
- **Asks of the dossier:** Was ist das eine Problem, für das Praxen sofort zahlen?

### praxisinhaber: Inhaberin einer Kleintierpraxis (Käuferin)

- **Group:** Kunden. **Weight:** 2.
- **Archetype note:** Rollen-Archetyp: Inhaberin einer Kleintierpraxis mit 2–4 Tierärzt:innen und 3–6 Angestellten.
- **Mandate:** Wirtschaftlich gesunde Praxis, weniger Abendarbeit, Personal halten.
- **Incentives:** Zahlt für Zeitersparnis; verliert bei Ausfällen, Datenschutzproblemen, Doppelarbeit.
- **Knowledge:** Praxisalltag, ihre Praxissoftware, Fachkollegen, Kammer.
- **Priorities:** Funktioniert mit meiner bestehenden Software vor neuer Funktion.
- **Blind spots:** Unterschätzt, wie viel Verwaltung ihr Team erledigt.
- **Red lines:** Kein zweites System, in das alles doppelt eingegeben werden muss.
- **Would change its mind if:** Eine Woche Test spart nachweislich mindestens 30 Minuten pro Tierarzt und Tag.
- **Asks of the dossier:** Was nimmt mir am Abend wirklich Arbeit ab?

### tfa: Tiermedizinische Fachangestellte / Ordinationsassistenz

- **Group:** Kunden. **Weight:** 1.
- **Archetype note:** Rollen-Archetyp: Tiermedizinische Fachangestellte (DE) bzw. Ordinationsassistentin (AT) am Empfang.
- **Mandate:** Dass Empfang, Telefon, Rechnungen, Erinnerungen und Nachfragen bewältigbar bleiben.
- **Incentives:** Gewinnt Zeit und Ruhe; verliert, wenn neue Tools mehr Klicks bedeuten.
- **Knowledge:** Telefonflut, Terminchaos, Versicherungsfragen, Rechnungen, Impferinnerungen.
- **Priorities:** Weniger Telefon und Nacharbeit vor schicker Technik.
- **Blind spots:** Sieht Pflichtmeldungen und Rechtliches weniger.
- **Red lines:** Ein Tool, das Fehler produziert, die sie ausbügeln muss.
- **Would change its mind if:** Ein Test reduziert Anrufe oder Rückfragen spürbar.
- **Asks of the dossier:** Wo geht im Empfang die meiste Zeit verloren?

### nutztier-ta: Gemischt-/Nutztierpraktiker

- **Group:** Kunden. **Weight:** 1.
- **Archetype note:** Rollen-Archetyp: Tierarzt in Gemischtpraxis mit Rind/Schwein-Betreuung.
- **Mandate:** Bestandsbetreuung, Arzneimittel- und Antibiotika-Pflichten korrekt und schnell erledigen.
- **Incentives:** Gewinnt bei weniger Meldeaufwand; verliert bei falschen Meldungen (Behörde, Sanktionen).
- **Knowledge:** TAMG, Antibiotika-Meldungen, Abgabebelege, Betriebsbesuche, TGD (AT).
- **Priorities:** Rechtssicherheit vor Komfort.
- **Blind spots:** Kleintier-Probleme (Besitzerkommunikation) sind ihm fremd.
- **Red lines:** Automatische Meldungen ohne Kontrolle durch den Tierarzt.
- **Would change its mind if:** Ein Tool erstellt Abgabebelege und Meldedaten fehlerfrei aus dem Diktat am Hof.
- **Asks of the dossier:** Ist die Nutztier-Bürokratie nicht der größere Schmerz?

### pvs-anbieter: Etablierter Praxissoftware-Anbieter (Wettbewerber-Archetyp)

- **Group:** Wettbewerb. **Weight:** 1.
- **Archetype note:** Wettbewerber-Archetyp auf Basis öffentlicher Informationen über etablierte Praxisverwaltungssysteme für Tierärzte in DACH. Keine internen Fakten eines bestimmten Unternehmens.
- **Mandate:** Marktanteil halten, Kunden im eigenen System halten.
- **Incentives:** Verliert, wenn ein Neuer Kernfunktionen übernimmt; gewinnt, wenn er Neues zukaufen oder nachbauen kann.
- **Knowledge:** Abrechnung, Hausapotheke, Meldungen, Schnittstellen, lange Kundenbeziehungen.
- **Priorities:** Kundenbindung vor Offenheit.
- **Blind spots:** Unterschätzt, wie schnell KI-Funktionen gebaut werden können.
- **Red lines:** Gibt Schnittstellen nicht freiwillig her.
- **Would change its mind if:** Ein Neuer zeigt, dass er ohne Schnittstelle nützlich ist.
- **Asks of the dossier:** Womit konkurriert der Gründer, und was baut ein PVS-Anbieter in 12 Monaten selbst?

### recht: Datenschutz- und Tierarzneimittelrecht-Experte

- **Group:** Aufsicht. **Weight:** 1.
- **Archetype note:** Rollen-Archetyp: Jurist für Datenschutz und Tierarzneimittelrecht (AT/DE).
- **Mandate:** Rechtssichere Verarbeitung von Halter- und Behandlungsdaten; korrekte Pflichtdokumentation.
- **Incentives:** Gewinnt nichts am Produkt; verliert, wenn Praxen durch das Tool rechtswidrig handeln.
- **Knowledge:** DSGVO, TAMG (AT/DE), EU-VO 2019/6, Berufsrecht, Aufzeichnungspflichten.
- **Priorities:** Lieber nicht automatisieren als still falsch (umgekehrte Priorität).
- **Blind spots:** Unterschätzt den Nutzen pragmatischer Lösungen.
- **Red lines:** KI, die Pflichtmeldungen ohne Freigabe des Tierarztes abschickt.
- **Would change its mind if:** Jede Pflichtdokumentation bleibt Entwurf mit Freigabe und Protokoll.
- **Asks of the dossier:** Welche Teile der Bürokratie darf KI überhaupt übernehmen?

### tierhalter: Tierhalterin (Endkundin der Praxis)

- **Group:** Kunden. **Weight:** 1.
- **Archetype note:** Rollen-Archetyp: Hundehalterin mit Tierkrankenversicherung.
- **Mandate:** Verständliche Informationen, schnelle Rechnungen, unkomplizierte Versicherungsabwicklung.
- **Incentives:** Gewinnt bei Klarheit und weniger Vorkasse-Stress; verliert bei Datenschutzproblemen.
- **Knowledge:** Ihr Tier, Rechnungen, Versicherung, Impftermine.
- **Priorities:** Verständlichkeit und Vertrauen vor Technik.
- **Blind spots:** Sieht Praxisaufwand nicht.
- **Red lines:** Gespräche aufnehmen ohne Information oder Einwilligung.
- **Would change its mind if:** Sie wird transparent informiert und bekommt bessere Unterlagen.
- **Asks of the dossier:** Was habe ich als Kundin davon?

## 4. Rules for this session

1. Round 1 is independent: a member reads this file (its own card and the rules), the dossier and
   any addenda, and nothing written by another member.
2. Addenda carry corrections and measurements only, never a member's position or reasoning.
3. The tally is written only after every Round 1 report is in, and offers options, not a verdict.
4. No urgency framing. The user's current leaning, if any, is a position to test, not a premise.
5. Members check the dossier and say where it is wrong, incomplete or mis-posed.
6. Evidence beats argument: every factual claim carries a source or is labelled estimate or assumption.
7. A member changes its vote in Round 2 only by naming the argument or evidence that changed it.
8. Raw member reports are kept as written; nothing is replaced by a summary.
