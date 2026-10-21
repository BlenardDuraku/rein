# ROUND 1: Konstruktionsleiter KMU-Maschinenbauer (Zielkunde) (konstruktionsleiter)

**Dossier:** DOSSIER-01-ki-zeichnungsableitung-f-r-maschinenbau.md. **Addenda read:** keine (im Ordner existiert kein ADDENDUM-01*.md).
**Round 1, independent:** no other member's report was read before this one was written.

**Position:** A ja, aber nicht als Desk-Research, sondern als Kundengespräche plus Vergleichstest „SolidWorks 2026 nativ vs. von Hand“ an echten Teilen; danach nur ein eng geschnittenes C (SolidWorks, eine Teilefamilie, Assistent mit Werksnorm-Treue). B und D als Startschritt nein.
**Confidence:** medium

## 1. Position and why

1. **Meine erste Frage ist nicht „gibt es einen Markt“, sondern „was kann mein SolidWorks 2026 schon“.** Wenn wir Subscription haben, bekomme ich die native Auto-Zeichnung (F2) mit dem Update, ohne Beschaffung, ohne neuen Lieferanten, ohne IT-Freigabe. Ein Startup muss sich gegen *diesen* Nullpreis messen, nicht gegen das Zeichnen von Hand. Desk-Research (A im Dossier-Sinn) beantwortet das nicht; nur ein Test an echten Teilen tut es.
2. **Der Mehrwert, für den ich zahlen würde, liegt dort, wo die native Funktion meine Werksnormen ignoriert:** Schriftfeld-/Stücklistenfelder aus PDM, unsere Ansichtsregeln, unsere Bemaßungsgewohnheiten je Teilefamilie (Drehteil, Blech, Schweißbaugruppe), Allgemeintoleranz-Hinweis nach Hausvorgabe. Das ist A1 – und A1 ist die eigentliche Wette des Produkts. Bisher nur Annahme.
3. **Messgröße für mich: Zeit pro Einzelteilzeichnung inkl. Nacharbeit, nicht „Automatisierungsgrad“.** Lieber 70 % sauber und leicht korrigierbar als 95 % mit Fehlern, die ich suchen muss. Ein Tool, das Funktionstoleranzen selbst setzt, erzeugt bei mir Prüfaufwand statt Ersparnis.
4. **Landingpage (D) erreicht mich nicht.** Ich trage mich nicht auf Wartelisten ein; ich glaube meinem Systemhaus, Kollegen und einem Test an eigenen Teilen. Klickzahlen sagen über meine Kaufentscheidung wenig (Annahme aus der Rolle).
5. **Architektur (B) vorab ist für mich wertlos, mit einer Ausnahme:** Die Frage „läuft lokal / Daten verlassen das Haus nicht“ muss vor dem ersten Pilot beantwortbar sein – das ist ein Absatz, kein Projekt.
6. **E (nicht bauen) ist realistisch, falls** der native Test zeigt, dass SolidWorks 2026 mit unserer Vorlage schon ≥ 30–40 % spart. Dann bleibt für ein Add-in zu wenig Differenz, um bei mir eine Beschaffung durchzubringen.

## 2. Where the dossier is wrong, incomplete or mis-posed

- **Falscher Vergleichsmaßstab (E5):** Der Nutzen wird gegen manuelles Zeichnen gerechnet. Relevant ist der *Zusatznutzen gegenüber der nativen SolidWorks-2026-Funktion*. Ohne diese Basislinie ist jede Zahlungsbereitschafts-Rechnung zu hoch.
- **Lizenzfrage fehlt:** Ob die SW-2026-Auto-Zeichnung in allen Stufen (Standard/Professional/Premium, F8) und ohne 3DEXPERIENCE-Anbindung verfügbar ist, steht nicht im Dossier. Ich habe das nicht geprüft; offen. Für die Konkurrenzlage entscheidend.
- **Option fehlt:** „Native Funktion an 20–30 Kundenteilen benchmarken“ ist billiger und aussagekräftiger als A, B, C oder D einzeln und gehört als eigene Option (oder als Kern von A) auf den Tisch.
- **PDM fehlt fast völlig:** Stückliste und Schriftfeld kommen bei uns aus PDM/ERP-Attributen. Wer das nicht sauber liest/schreibt, spart mir keine Zeit. Weder native Funktion noch DraftAid (F6) werden darauf geprüft.
- **Einführungsaufwand fehlt:** Wer pflegt die Regeln/Vorlagen, wer schult, wie lange bis zur ersten Ersparnis? Für mich ein Kostenblock, den das Dossier nicht nennt.
- **E1 ist zu Recht als unbelegt markiert;** auch meine eigene Wahrnehmung (Einzelteilzeichnungen fressen bei Sondermaschinenbau viel Zeit) ist nur Rollenannahme. Gemessen haben wir das nicht – die meisten KMU erfassen Zeit je Auftrag, nicht je Zeichnung (Annahme).
- **„Lernt aus bestehenden Firmenzeichnungen“** ist schwächer als es klingt: Unsere Altzeichnungen sind uneinheitlich (verschiedene Zeichner, alte Normstände). Ein Modell, das daraus lernt, lernt auch die Fehler. Regelbasierte Werksnorm-Abbildung ist für mich glaubwürdiger (Annahme).

## 3. Evidence

| Claim | Type | Source or method |
|---|---|---|
| SW 2026 wählt Vorlage/Blattgröße selbst oder nimmt eine vorgegebene; noch Beta; Ergebnisse „brauchen Anpassungen“, liefern Ansichten, Schnitte, Maße, Basis-GD&T | fact (Reseller-Quellen, nicht unabhängig) | Websuche 2026-10-21: javelin-tech.com „Drawings – What's New in SOLIDWORKS 2026“, trimech.com, solidprofessor.com |
| Wie gut SW 2026 mit stark angepassten Vorlagen/Werksnormen umgeht | nicht bekannt | Dieselbe Websuche fand keinen Test dazu; heißt: nicht gefunden, nicht: existiert nicht |
| Native Funktion kommt für Subscription-Kunden ohne Zusatzbeschaffung | assumption | Rollenwissen; Lizenzstufen nicht geprüft |
| Zusatznutzen über native Funktion < Nutzen über Handzeichnen | estimate | Logik: native Funktion nimmt einen Teil der Ersparnis vorweg; Höhe unbekannt |
| Kaufentscheidung erst nach Test an eigenen Teilen | assumption | Persona-Mandat / Red Line |
| 10 Arbeitsplätze ≈ 35–55 kEUR/Jahr SW-Lizenzen; ein Add-in muss sich daneben rechtfertigen | estimate | E4 aus F8 |

## 4. Risks from this seat

- **C zu früh / zu breit:** Ein Add-in, das alle Teile und beide CADs können will, liefert bei meinen Teilen Mittelmaß – ich verliere zwei Wochen Testzeit und das Vertrauen meiner Leute.
- **Stiller Fehler:** Ein falsch gesetztes oder fehlendes Maß, das in der Prüfung übersehen wird, kostet in der Fertigung ein Vielfaches der gesparten Zeichnungszeit. Das ist der gefährliche, leise Fehler – laute Lücken („hier fehlt Bemaßung“) sind harmlos.
- **D / reine Recherche:** Für mich kein Risiko, aber auch kein Nutzen; das Risiko trägt der Gründer (Fehlsignal aus Klicks oder Desk-Daten).
- **Plattformrisiko:** Kauft er heute, und das nächste SolidWorks-Release macht es nativ, habe ich ein Tool mehr zu pflegen. Ich würde deshalb nur kurz laufende Verträge akzeptieren.
- **Einführung:** Meine Konstrukteure akzeptieren das Tool nicht, wenn es ihre Prüfung nicht erleichtert (markiert, was es gemacht hat).

## 5. The cheapest decisive step

**Größte offene Frage:** Wie viel spart die native SolidWorks-2026-Auto-Zeichnung mit unserer Firmenvorlage schon, und wo genau scheitert sie?

**Schritt:** Mit 3–5 Konstruktionsleitern (je 1 h Gespräch) je 20–30 typische Einzelteile auswählen; ein Konstrukteur zeichnet von Hand, dieselben Teile mit SW-2026-Auto-Zeichnung + Nacharbeit; Zeit inkl. Nacharbeit stoppen und jede Nacharbeit kategorisieren (Vorlage/Schriftfeld, Ansichten, Maße, Toleranzen, Stückliste/PDM). Aufwand: wenige Tage pro Firma, kein Code.

**Vorab festgelegtes Ergebnis, das meine Position ändert:**
- Native Funktion spart bereits ≥ 40 % inkl. Nacharbeit → ich wechsle zu **E** (kein Bedarf für ein Zusatztool bei mir).
- Native Funktion spart < 20 % *und* die Nacharbeit konzentriert sich auf Werksnorm/Schriftfeld/PDM/Bemaßungsregeln einer Teilefamilie → ich unterstütze **C** eng geschnitten und würde einen 2-Wochen-Pilot an 30 eigenen Teilen machen.
- Dazwischen → nur weiter, wenn mindestens 3 Firmen dieselbe Lücke nennen.

## 6. Conditions and red lines

Unterstütze ich ein Produkt nur, wenn:
- es in **meinem** SolidWorks mit **meinen** Vorlagen, Werksnormen und PDM-Attributen läuft, ohne Systemwechsel;
- es **lokal oder in dedizierter EU-Instanz** läuft, Firmenmodelle nicht in ein gemeinsames Modell trainieren;
- es Funktionstoleranzen **nicht** eigenmächtig vergibt und kenntlich macht, was automatisch gesetzt wurde;
- ich vorher einen **kostenlosen oder günstigen Test an 30 eigenen Teilen** über 2 Wochen fahren kann; Ziel ≥ 40 % weniger Zeit pro Einzelteilzeichnung inkl. Nacharbeit, gemessen gegen den nativen Stand, nicht gegen Handarbeit;
- Vertrag kurz kündbar (Plattformrisiko).

Nicht akzeptabel: Abo ohne Test, unkontrollierter Cloud-Upload, Tool, das unsere Normen ignoriert, Multi-CAD-Versprechen statt Funktion bei einer Teilefamilie.

## 7. One line

Erst an echten Teilen messen, was mein SolidWorks 2026 schon selbst kann; nur wenn die Lücke bei Werksnorm, PDM und einer Teilefamilie groß bleibt, lohnt ein eng geschnittenes Add-in – sonst nicht bauen.

Quellen der Websuche: [javelin-tech.com – Drawings, What's New in SOLIDWORKS 2026](https://www.javelin-tech.com/3d/drawings-whats-new-in-solidworks-2026/), [trimech.com – Drawings, What's New in SOLIDWORKS 2026](https://trimech.com/drawings-whats-new-in-solidworks-2026/), [solidprofessor.com – SOLIDWORKS 2026 What's New for Drawings](https://solidprofessor.com/blog/solidworks-2026-whats-new-for-drawings)
