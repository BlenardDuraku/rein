# VetScribe – Workflow-Bauplan

Stand: 17.10.2026. Grundlage: Recherche und Council-Empfehlung (`RECOMMENDATION.md`).

## Das Prinzip

**Ein Gespräch rein, alle Papiere raus.** Der Tierarzt behandelt und redet wie immer. VetScribe hört zu und erstellt alle Dokumente, die nach der Behandlung anfallen. Der Tierarzt prüft sie, gibt sie mit einem Klick frei, und sie landen dort, wo sie hingehören.

```
Gespräch/Diktat ──► Transkript ──► 7 Entwürfe ──► Prüfen & Freigeben ──► Übergabe
                                       │                 │                    │
                              "Bitte prüfen"-Liste   Protokoll         PVS / PDF / E-Mail
```

Drei Regeln, die nie gebrochen werden:
1. **Alles ist ein Entwurf.** Nichts verlässt die Praxis ohne Freigabe durch den Tierarzt.
2. **Nichts erfinden.** Befunde, Dosierungen, Wartezeiten und Preise kommen nur aus dem Gespräch, aus den Vorlagen der Praxis oder aus geprüften Datenquellen. Fehlt etwas, steht es auf der "Bitte prüfen"-Liste.
3. **Die Praxissoftware bleibt.** VetScribe ersetzt nichts, es füllt nur aus.

---

## Der Ablauf einer Behandlung

### 1. Vor dem Termin (Empfang, 10 Sekunden)
- Patient und Halter aus dem PVS übernehmen (Kopieren oder später per Schnittstelle).
- Hinweis an den Halter: Aushang und Satz in der Datenschutzinformation, dass das Gespräch zur Dokumentation verarbeitet und die Aufnahme danach gelöscht wird.

### 2. Während der Behandlung (Tierarzt, 0 Sekunden extra)
- Aufnahme am Handy, Tablet oder PC starten.
- Ganz normal mit dem Halter reden. Ergänzungen wie "Gewicht 12,4, Temperatur 38,9" einfach laut sagen.

### 3. Direkt danach (Tierarzt, ca. 1 Minute)
VetScribe zeigt die 7 Entwürfe nebeneinander:

| # | Entwurf | Wofür | Wer profitiert |
|---|---|---|---|
| 1 | **Behandlungsbericht (SOAP)** | Pflichtdokumentation in der Akte | Tierarzt |
| 2 | **Besitzerinfo** | Was wurde gemacht, was ist zu Hause zu tun, wann melden | Halter, Empfang (weniger Rückfragen) |
| 3 | **Leistungs-/Rechnungsentwurf** | Erbrachte Leistungen; in DE GOT-Positionen als Vorschlag, in AT nach Praxis-Preisliste | Empfang |
| 4 | **Kostenvoranschlag** | Wenn eine OP/weitere Diagnostik besprochen wurde | Halter, Tierarzt |
| 5 | **Versicherungspaket** | Diagnose, Behandlungsbericht in Klartext, Rechnung als ein PDF zum Einreichen | Halter, Empfang |
| 6 | **Überweisungs-/Befundbrief** | An Klinik, Fachtierarzt oder Labor | Tierarzt |
| 7 | **Erinnerungsvorschlag** | Kontrolltermin, Impfung, Medikamentenende | Empfang, Praxisumsatz |

Dazu die **"Bitte prüfen"-Liste** (gelb): fehlende Angaben, unsichere Medikamentennamen, unklare Dosierungen.

Der Tierarzt korrigiert, falls nötig, und klickt **Freigeben**. VetScribe protokolliert: wer, wann, was geändert.

### 4. Übergabe (Empfang oder automatisch)
- **Bericht → PVS:** Ein-Klick-Kopie im passenden Format (später direkt per Schnittstelle).
- **Besitzerinfo + Versicherungspaket → Halter:** per E-Mail oder ausgedruckt mitgeben.
- **Rechnungsentwurf → PVS:** Leistungen werden vom Empfang im PVS abgerechnet.
- **Erinnerung → PVS-Recall oder E-Mail an Halter** (nach Freigabe).
- **Audio:** wird nach erfolgreicher Verarbeitung gelöscht.

### 5. Am Abend
Nichts mehr nachschreiben. Das ist das Verkaufsversprechen.

---

## Was die Praxis einstellt (macht es "High-End")

- **Eigene Vorlagen:** Aufbau des Berichts, Briefkopf, Tonfall der Besitzerinfo.
- **Eigene Abkürzungen und Hausmittel:** "AU o.b.B.", praxiseigene Präparate und Standarddosierungen.
- **Preisliste / GOT-Sätze:** damit der Rechnungsentwurf und der Kostenvoranschlag stimmen.
- **Lernen aus Korrekturen:** Was der Tierarzt regelmäßig ändert, macht VetScribe beim nächsten Mal richtig.

---

## Roadmap

| Stufe | Inhalt | Wann |
|---|---|---|
| **V1 – Behandlungs-Copilot** | 7 Entwürfe, Freigabe mit Protokoll, Praxis-Vorlagen, EU-Spracherkennung, Ein-Klick-Kopie/PDF/E-Mail | Pilot mit 3 Praxen |
| **V2 – Empfang & Integration** | Anfragen-Sortierer für E-Mails/Nachrichten ("Befund da?", "Termin?"), Versand freigegebener Erinnerungen, Schnittstelle zu 1–2 PVS oder PVS-Partnerschaft | wenn V1 bezahlt wird |
| **V3 – Nutztier-Modul** | Diktat am Hof (offline), Abgabebeleg-Entwurf, Wartezeiten nur aus geprüfter Arzneimitteldatenbank, Vorbereitung der Jahresmeldung (AT: AGES bis 31. März; DE: TAM-DB) als Export zur Prüfung | nach Rechtsprüfung |
| **Später prüfen** | Telefon-KI, Heimtierdatenbank-Registrierung (AT), Reisebescheinigungen/Heimtierausweis | nach Messung im Pilot |

### Was wir bewusst NICHT bauen

| Aufgabe | Warum nicht |
|---|---|
| Abrechnung, Kassa, Buchhaltung | Kern der Praxissoftware; wir liefern nur den Entwurf |
| Hausapotheke (Wareneingang/-ausgang) | Kern der Praxissoftware; rechtlich heikel |
| Betäubungsmittel-Buch | Strenge Formvorschriften; Praxissoftware oder Papier |
| Automatische Behördenmeldungen | Verantwortung liegt beim Tierarzt; nur Export zur Prüfung |
| Terminkalender, Dienstplan, QM-Handbuch | Andere Produkte machen das gut; kein Bezug zum Gespräch |
| Eigene Patientenakte | Das wäre eine zweite Praxissoftware |

---

## Rechtliche Mindestausstattung vor dem ersten Pilot

- Verarbeitung von Audio und Text in der EU; Auftragsverarbeitungsvertrag (AVV) mit jeder Praxis und allen Unterdienstleistern.
- Muster-Halterinformation (Aushang + Text für die Datenschutzinformation der Praxis).
- Audio nach Verarbeitung löschen; Aufbewahrung der Texte gemäß Vorgabe der Praxis.
- Freigabeprotokoll.
- Kurzprüfung durch einen Datenschutzjuristen.

---

## Was VetScribe von Wettbewerbern unterscheidet

Andere KI-Schreiber (auch auf Deutsch) erzeugen vor allem den Behandlungsbericht. VetScribe erzeugt **die ganze Papierarbeit nach der Behandlung**: Bericht, Halterinfo, Rechnungsentwurf, Kostenvoranschlag, Versicherungspaket, Überweisung, Erinnerung. Und es passt sich an die Praxis an (Vorlagen, Abkürzungen, Preisliste). Das muss im Pilot gegen echte Wettbewerber getestet werden.

---

## Preis und Pilot (Vorschlag, ungeprüft)

- **Pilot:** 3 Kleintierpraxen, 4 Wochen gratis, dafür Zeitmessung (Tierarzt *und* Empfang) und Referenzrecht.
- **Preisanker:** 150–250 € pro Tierarzt und Monat, wenn mindestens 30 Minuten pro Tag gespart werden (Annahme aus dem Council, in Gesprächen prüfen).
- **Erfolgskriterium für V2:** mindestens 2 von 3 Pilotpraxen zahlen danach.

---

## Was vom heutigen Prototyp schon da ist

Der VetScribe-Prototyp (Repo `glanz`, Sicherung in `rein/vetscribe/`) kann bereits: Diktat im Browser, Bericht (SOAP), Besitzerinfo, Medikamente, Leistungen, "Bitte prüfen"-Liste. Für V1 fehlen: Kostenvoranschlag, Versicherungspaket, Überweisungsbrief, Erinnerungsvorschlag, Freigabe mit Protokoll, Praxis-Vorlagen und Preisliste, EU-Spracherkennung mit Audio-Löschung, Login und Speicherung.
