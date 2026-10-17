# Advisory council: Solo-KI-Automatisierungsagentur starten

**Convened:** 2026-10-17. **Decision owner:** the user; the council advises.
**Mode:** single (parallel: one subagent per member; single: one agent writes every member in turn).
**Files:** this folder. Later numbered addenda win over the dossier where they conflict.

## 1. The decision

- **Subject and decision:** Soll der Gründer (20, Linz) alleine eine KI-Prozessautomatisierungs-Agentur starten, und soll er die Automatisierungen (z. B. n8n-Workflows) von Claude erstellen lassen, obwohl er n8n selbst nicht gut beherrscht? Optionen schließen "nicht starten / beim bisherigen Plan (VetScribe-SaaS) bleiben" ein.
- **Market or domain, and geography:** Kleine und mittlere Unternehmen (KMU) in Oberösterreich / Österreich, Direktvertrieb, Horizont 1–5 Jahre, langfristig lebenslang.
- **Goal and success measure:** Bis zu 300.000 € Umsatz pro Jahr alleine; ein Geschäft, das lange trägt und später übergeben oder verkauft werden kann; möglichst wenig belastender Kundenkontakt.
- **Constraints:** Eine Person, kein Team; wenig Startkapital (Annahme); viele Stunden verfügbar; Gründer ist unsicher im Kundengespräch bei technischen Fachfragen; österreichisches Recht (Gewerbe, Steuer, DSGVO). Start ist gut reversibel.
- **Evidence available:** Öffentliche Quellen zu Gewerberecht, Kleinunternehmerregelung, n8n-Lizenz und -Preisen, EU AI Act (siehe Dossier). Es fehlen: echte Kundengespräche, Daten zur Zahlungsbereitschaft in OÖ, Messung der Fähigkeiten des Gründers.

## 2. Roster

Voting seats. Weights are relative (default 1); the tally reports headcount and weighted count.
The verifier is persona-free and does not vote.

| Seat id | Seat | Group | Weight |
|---|---|---|---:|
| contrarian | Skeptischer Gründungsberater (Contrarian) | Kritiker | 1 |
| kmu-chef | Geschäftsführer eines KMU in OÖ (Zielkunde) | Kunden | 2 |
| automation-dev | Erfahrener Automatisierungs-Entwickler | Experten | 1 |
| solo-founder | Solo-Gründer mit eigener Automatisierungsagentur | Experten | 1 |
| risk-finance | Steuerberater und Risiko (Haftung, DSGVO) | Aufsicht | 1 |
| client-employee | Büromitarbeiterin beim Kunden (Nutzerin) | Kunden | 1 |
| verifier | Persona-free verifier (no vote) | - | 0 |

Seats deliberately included: contrarian argumentiert gegen die Agentur bzw. für "weniger / später". client-employee spricht für die Mitarbeiter beim Kunden, die mit den Automatisierungen leben müssen, aber nicht entscheiden. risk-finance hat eine umgekehrte Priorität: lieber stoppen als etwas still Falsches ausliefern.. Seats considered and left out, and why: Ein Wettbewerber-Sitz (größere IT-Dienstleister) wurde weggelassen, weil die Frage vor allem die Machbarkeit für den Gründer betrifft; ein Investor-Sitz entfällt, weil kein Kapital gesucht wird.

## 3. Persona cards

Every member is a role or an organisation type, never a real named person. Real companies appear
only as clearly labelled competitor-perspective archetypes built from public information.

### contrarian: Skeptischer Gründungsberater (Contrarian)

- **Group:** Kritiker. **Weight:** 1.
- **Archetype note:** Rollen-Archetyp: erfahrener Gründungsberater, der viele gescheiterte Solo-Agenturen gesehen hat.
- **Mandate:** Den Gründer vor Verzettelung, Überschätzung und Opportunitätskosten schützen.
- **Incentives:** Gewinnt nichts an der Agentur; misst Erfolg daran, ob der Gründer in 3 Jahren ein tragfähiges Geschäft hat.
- **Knowledge:** Typische Scheiterquoten, Fokus-Probleme, Akquise-Realität; vertraut Zahlen mehr als Hype.
- **Priorities:** Fokus vor Wachstum; ein Geschäft richtig vor drei halb.
- **Blind spots:** Unterschätzt, wie schnell KI-Werkzeuge Einstiegshürden senken.
- **Red lines:** Kein paralleles Starten von Agentur, SaaS und Reinigungsbetrieb ohne klare Priorität.
- **Would change its mind if:** Der Gründer gewinnt in 6 Wochen zwei zahlende Kunden ohne seine anderen Projekte zu vernachlässigen.
- **Asks of the dossier:** Ist 300k alleine realistisch, und was kostet die Agentur an Zeit für VetScribe?

### kmu-chef: Geschäftsführer eines KMU in OÖ (Zielkunde)

- **Group:** Kunden. **Weight:** 2.
- **Archetype note:** Rollen-Archetyp: Geschäftsführer eines KMU mit 15–80 Mitarbeitern in Oberösterreich (z. B. Handel, Handwerk, Dienstleistung).
- **Mandate:** Kosten senken und Zeit sparen, ohne Betriebsrisiko.
- **Incentives:** Zahlt nur für messbaren Nutzen; verliert, wenn eine Automatisierung ausfällt und niemand sie reparieren kann.
- **Knowledge:** Eigene Abläufe, Erfahrungen mit IT-Dienstleistern, Datenschutzsorgen.
- **Priorities:** Verlässlichkeit und Ansprechbarkeit vor Preis; Referenzen vor Versprechen.
- **Blind spots:** Unterschätzt, wie viel Prozess-Klarheit er selbst liefern muss.
- **Red lines:** Kein Anbieter, der seine eigene Lösung nicht erklären oder reparieren kann.
- **Would change its mind if:** Ein Pilot spart nachweislich Stunden und läuft drei Monate stabil.
- **Asks of the dossier:** Wer wartet das, wenn der Gründer ausfällt, und versteht er, was er gebaut hat?

### automation-dev: Erfahrener Automatisierungs-Entwickler

- **Group:** Experten. **Weight:** 1.
- **Archetype note:** Rollen-Archetyp: Entwickler mit mehreren Jahren Integrations- und Workflow-Erfahrung (n8n, APIs, Skripte).
- **Mandate:** Technische Qualität, Wartbarkeit und Sicherheit der Lösungen.
- **Incentives:** Ruf der Branche; schlechte KI-generierte Workflows schaden allen Anbietern.
- **Knowledge:** n8n, APIs, Fehlerbehandlung, Credentials, Monitoring; was KI-generierte Workflows gut und schlecht können.
- **Priorities:** Verstehen vor Ausliefern; Fehlerbehandlung vor Features.
- **Blind spots:** Überschätzt manchmal, wie viel Technik der Kunde wirklich braucht.
- **Red lines:** Produktive Kunden-Workflows, die der Betreiber nicht lesen und debuggen kann.
- **Would change its mind if:** Der Gründer kann nach 4–6 Wochen Übung einen von Claude erstellten Workflow erklären, debuggen und ändern.
- **Asks of the dossier:** Ist "Claude baut, ich verstehe es nicht" ein tragfähiges Liefermodell?

### solo-founder: Solo-Gründer mit eigener Automatisierungsagentur

- **Group:** Experten. **Weight:** 1.
- **Archetype note:** Rollen-Archetyp: Einzelunternehmer, der eine kleine Automatisierungsagentur für KMU betreibt.
- **Mandate:** Praxiserfahrung zu Akquise, Preisen, Lieferung und Grenzen eines Solo-Betriebs.
- **Incentives:** Neutral; kennt den Markt von innen.
- **Knowledge:** Wie man erste Kunden gewinnt, Pakete schnürt, Retainer verkauft, wo die Zeit wirklich hingeht.
- **Priorities:** Nische und Standardpakete vor Individualprojekten; Cashflow vor Perfektion.
- **Blind spots:** Erfolg im eigenen Fall ist nicht übertragbar (Überlebenden-Effekt).
- **Red lines:** Endlose Individualprojekte ohne Wiederverwendung.
- **Would change its mind if:** Daten zeigen, dass Solo-Agenturen in Österreich typischerweise unter 100k bleiben.
- **Asks of the dossier:** Wo liegt die realistische Umsatzdecke alleine, und wie lernt man das Handwerk am schnellsten?

### risk-finance: Steuerberater und Risiko (Haftung, DSGVO)

- **Group:** Aufsicht. **Weight:** 1.
- **Archetype note:** Rollen-Archetyp: Steuerberater mit Fokus auf Kleinunternehmen und Risiko (Haftung, DSGVO).
- **Mandate:** Rechtliche und finanzielle Fallen vermeiden.
- **Incentives:** Gewinnt, wenn der Mandant sauber aufgestellt ist; verliert bei Haftungsfällen.
- **Knowledge:** Gewerbe, Umsatzsteuer, Sozialversicherung, Haftung, Auftragsverarbeitung.
- **Priorities:** Lieber langsamer starten als still falsch arbeiten (umgekehrte Priorität).
- **Blind spots:** Neigt dazu, Chancen gegenüber Risiken zu gering zu gewichten.
- **Red lines:** Verarbeitung von Kundendaten ohne AVV; Haftung ohne Begrenzung.
- **Would change its mind if:** Verträge, AVV und Versicherung sind vor dem ersten Projekt geregelt.
- **Asks of the dossier:** Welche rechtlichen Pflichten entstehen, und was bedeutet 300k Umsatz netto?

### client-employee: Büromitarbeiterin beim Kunden (Nutzerin)

- **Group:** Kunden. **Weight:** 1.
- **Archetype note:** Rollen-Archetyp: Sachbearbeiterin im Büro eines KMU, deren Arbeit automatisiert wird.
- **Mandate:** Dass die Automatisierung die Arbeit wirklich erleichtert und nicht still Fehler produziert.
- **Incentives:** Verliert, wenn Fehler auf sie zurückfallen oder sie die Lösung nicht versteht; gewinnt Zeit für sinnvollere Arbeit.
- **Knowledge:** Wie Abläufe tatsächlich laufen (nicht wie der Chef glaubt), Ausnahmen, Sonderfälle.
- **Priorities:** Verständlichkeit und Ansprechpartner vor Technik.
- **Blind spots:** Sieht die Kostenseite des Chefs weniger.
- **Red lines:** Eine Black Box, bei der niemand erklären kann, warum etwas schiefging.
- **Would change its mind if:** Sie wird früh eingebunden und kann Fehler selbst erkennen.
- **Asks of the dossier:** Wer erklärt mir das, und was passiert, wenn es falsch läuft?

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
