# ROUND 1: Erfahrener Automatisierungs-Entwickler (automation-dev)

**Dossier:** DOSSIER-01-solo-agentur.md. **Addenda read:** none.
**Round 1, independent:** no other member's report was read before this one was written.

**Position:** Claude bauen lassen ist richtig, aber nur, wenn der Gründer jeden ausgelieferten Workflow lesen, erklären und reparieren kann; vorher keine produktiven Kundenprojekte.
**Confidence:** high

## 1. Position and why

1. **KI als Bauwerkzeug ist Stand der Technik.** Profis nutzen heute KI, um Workflows und Code zu erzeugen. Das ist kein Schummeln. Der Unterschied zwischen Profi und Laie ist nicht, wer tippt, sondern wer *versteht*, was ausgeliefert wird.
2. **Die Schwachstellen von KI-generierten Workflows liegen genau dort, wo es teuer wird:** Fehlerbehandlung (was passiert, wenn die API nicht antwortet?), Sonderfälle (Rechnung ohne Rechnungsnummer), doppelte Ausführung, Zugangsdaten im Klartext, keine Benachrichtigung bei Ausfall. Das sieht man nur, wenn man den Workflow versteht.
3. **Die Mindest-Kompetenz ist lernbar und überschaubar.** Für 80 % der KMU-Automatisierungen reichen: Trigger, HTTP-Requests, JSON lesen, IF/Switch, Schleifen, Fehler-Workflow, Credentials, Logs lesen. Das sind Wochen, nicht Jahre, wenn man täglich übt.
4. **Claude ist auch der beste Lehrer dafür.** Statt "bau mir das" heißt es: "bau mir das und erkläre jeden Knoten", dann selbst kaputt machen und reparieren.
5. **n8n vs. Code:** Für den Einstieg ist n8n besser, weil der Kunde den Ablauf *sehen* kann. Das hilft im Gespräch und bei der Übergabe.

## 2. Where the dossier is wrong, incomplete or mis-posed

- Die Frage "Claude baut, Gründer versteht nur teilweise" ist falsch gestellt. Die richtige Frage ist: **Welche Mindest-Kompetenz braucht er, bevor er ausliefert?**
- **Lizenzfrage (F3) ist für das Geschäftsmodell wichtig:** Wenn er Kundenworkflows auf *seinem* Server hostet und monatlich verrechnet, kann eine kostenpflichtige n8n-Lizenz nötig sein. Sauberer Weg: Instanz läuft auf Konto/Server des Kunden, der Gründer baut und wartet. Das muss vor dem ersten Wartungsvertrag geklärt sein.
- Es fehlt: Monitoring und Ausfallbenachrichtigung als Pflichtbestandteil jedes Angebots.

## 3. Evidence

| Claim | Type | Source or method |
|---|---|---|
| Typische Fehlerquellen von Workflows (Fehlerbehandlung, Duplikate, Credentials) | assumption | Berufserfahrung des Archetyps; nicht gemessen |
| Mindest-Kompetenz in 4–8 Wochen erlernbar bei täglicher Übung | estimate | Umfang der genannten Grundbausteine |
| Hosting für Kunden kann Lizenz erfordern | fact (unverified) | DOSSIER F3 |

## 4. Risks from this seat

- **Stiller Datenfehler:** Ein Workflow verbucht drei Monate lang Belege falsch, und niemand merkt es. Das ist schlimmer als ein lauter Absturz.
- Zugangsdaten des Kunden (E-Mail, Buchhaltung) liegen ungeschützt.

## 5. The cheapest decisive step

Fünf typische KMU-Workflows mit Claude bauen (E-Mail-Sortierung, Beleg-Auslesen, Angebot aus Formular, CRM-Sync, Benachrichtigung) und bei jedem absichtlich drei Fehler einbauen. **Ändert meine Position:** Wenn der Gründer nach 4 Wochen die Fehler ohne Hilfe findet und erklärt, ist er lieferfähig. Wenn nicht, muss er länger lernen oder mit einem Entwickler zusammenarbeiten.

## 6. Conditions and red lines

- Jeder ausgelieferte Workflow hat Fehlerbehandlung, Logging und Ausfallbenachrichtigung.
- Keine Workflows mit Kundendaten, die der Gründer nicht erklären kann.

## 7. One line

Claude als Baumeister ja, aber der Gründer muss der Bauleiter sein, der jeden Fehler findet.
