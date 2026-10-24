# ROUND 1: KI-Technik-Experte (ki-experte)

**Dossier:** DOSSIER-01-gruendungsideen.md. **Addenda read:** keine (keine ADDENDUM-01*.md vorhanden zum Zeitpunkt des Schreibens).
**Round 1, independent:** no other member's report was read before this one was written.

**Position:** Nebenberuflich (O1) starten mit einem eng geschnittenen I1: KI-Dokumentenverarbeitung und Integration in bestehende Systeme für produzierende KMU, mit gemessener Genauigkeit statt "Chatbot"; I3 und reine Templates streichen.
**Confidence:** medium

## 1. Position and why

Top 5, gereiht:

1. **I1, verengt: "Dokumente rein, saubere Daten ins ERP"** (Bestellungen, Lieferscheine, Anfragen, Angebote, Eingangsrechnungen-Vorbereitung). Diese Idee wird mit besseren Modellen *wertvoller*: Extraktionsgenauigkeit steigt, Kosten pro Dokument sinken, aber die Arbeit (Anbindung an lokale Altsysteme, Validierungsregeln, Ausnahmebehandlung, Monitoring) bleibt beim Integrator. Genauigkeit ist messbar, das passt zum KMU-Kriterium "≥ 5 Std./Woche gespart".
2. **I6, betreiberseitig: Störmeldungs- und Ersatzteil-Aufnahme für Maschinenbetreiber** (herstellerunabhängig). Echter Domänenvorteil (E4), strukturierbare Daten, profitiert vom Modellfortschritt. Erst nach Vertragsprüfung und nicht bei Kunden des Arbeitgebers; als zweiter Schritt aus I1-Kunden heraus.
3. **I4 als Zusatzmodul, nicht als eigenes Produkt.** Technisch heute machbar, aber die Voice-Plattformen kommodifizieren schnell; als Standalone-Produkt ist es ein Wrapper. Als Baustein im I1-Paket (Anruf → Auftrag ins System) sinnvoll.
4. **I2 nur als herstellerunabhängiges Betreiber-Werkzeug.** Technisch das attraktivste (RAG über Handbücher, Fehlercodes, Einsatzberichte), aber die wertvollen Daten gehören dem Hersteller bzw. Arbeitgeber. Ohne eigenen Datenzugang ist es ein Prompt auf fremden Dokumenten – meine rote Linie.
5. **I5 nur als Vertriebskanal**, nicht als Umsatzquelle. Workflow-Vorlagen verlieren Wert, sobald Modelle Workflows aus Beschreibungen erzeugen (Annahme, siehe Evidenz). Deutschsprachiger Content über reale KMU-Fälle baut aber Vertrauen.

Gestrichen: **I3**. Ein Fitness-/Ernährungs-Coach auf einem fremden LLM ist genau das, was allgemeine Chat-Assistenten gratis tun; plus Berufsrechtsrisiko (F8). "Voll automatisiert" ist für keine B2B-Idee in 12 Monaten realistisch: Zuverlässige KI-Systeme brauchen Menschen für Ausnahmen, Wartung und Modellwechsel.

## 2. Where the dossier is wrong, incomplete or mis-posed

- **F5 ist zu großzügig formuliert.** Der Lizenztext (siehe Evidenz) erlaubt Nutzung nur "for your own internal business purposes". Dass Beratung/Workflow-Bau für Kunden erlaubt ist, stammt aus n8ns Erläuterungen, nicht aus dem Lizenztext selbst. Praktische Folge: n8n soll auf dem Konto/Server *des Kunden* laufen (dessen interne Nutzung); ein eigenes n8n, auf dem I4/I6 als Multi-Kunden-Dienst laufen, ist voraussichtlich lizenzpflichtig (Embed-/Enterprise-Lizenz). Für ein skalierbares Produkt (I2/I4/I6) muss der Stack daher anders gewählt werden (eigener Code oder Apache/MIT-lizenzierte Tools).
- **Laufende KI-Kosten fehlen.** Für I4 nennt das Dossier "pro Minute", aber keine Zahl. Drittanbieter-Übersichten nennen ca. 0,07–0,30 USD/Min. all-in.
- **Fehlende Frage:** Wer haftet für falsche KI-Ausgaben, und wie wird Genauigkeit gemessen? Keine Idee hat ein Qualitätskriterium.
- **E3 ist zu eng:** Nicht nur E-Mail-Zusammenfassungen, auch einfache Automatisierungen und Workflow-Erstellung werden Plattformfunktion. Das trifft I5 und das "Standard-Workflow"-I1 direkt.
- **Fehlende Option:** Verengung von I1 auf einen Dokumenttyp/eine Branche statt "alles für alle KMU".

## 3. Evidence

| Claim | Type | Source or method |
|---|---|---|
| n8n-Lizenz erlaubt Nutzung "only for your own internal business purposes or for non-commercial or personal use"; Weitergabe nur gratis/nichtkommerziell | fact | LICENSE.md im n8n-GitHub-Repo (master), per curl abgerufen 2026-10-24; docs.n8n.io war aus der Sandbox nicht erreichbar (DNS-Fehler) |
| Kunden-Beratung erlaubt laut n8n | assumption (nicht verifiziert) | Bekannt aus n8n-FAQ; FAQ heute nicht abrufbar |
| Voice-Agents kosten ca. 0,07–0,30 USD/Min. all-in | fact (Drittquellen, teils Anbieter-Blogs) | Websuche: retellai.com/blog/ai-voice-agent-pricing…, ringly.io/blog/ai-voice-agent-pricing, 11x.ai/guides/vapi-pricing |
| Handwerksbetrieb mit 300 Anrufen × 2 Min. = ca. 40–180 USD/Monat KI-Kosten | estimate | 600 Min. × obige Spanne |
| Dokumentenextraktion erreicht bei sauberen Geschäftsdokumenten oft > 90 % Feldgenauigkeit, bei Scans/Handschrift deutlich weniger | estimate | Eigene Erfahrung des Archetyps; nicht für OÖ gemessen |
| Workflow-Plattformen bieten bzw. bauen KI-gestützte Workflow-Erstellung | assumption | Branchentrend; nicht heute geprüft |
| Allgemeine Chat-Assistenten liefern Trainings-/Ernährungspläne kostenlos | assumption (breit beobachtbar) | nicht systematisch geprüft |

## 4. Risks from this seat

- **I1 (stille Gefahr):** Workflows laufen, bis eine API oder ein Modell sich ändert; dann scheitern sie leise und falsche Daten landen im ERP. Ohne Monitoring und Testdatensatz wird der Wartungsvertrag zur Haftungsfalle.
- **I4:** Halluzinierte Termine/Preise am Telefon; Margendruck, weil Plattformen direkt an Betriebe verkaufen.
- **I2/I6:** Nutzung von Arbeitgeber-Wissen oder -Dokumenten – rechtlich und für das Vertrauen fatal.
- **Lizenz:** Ein Multi-Kunden-n8n-Hosting fällt erst auf, wenn es skaliert.
- **O0:** Das Fenster, in dem "kann KI zuverlässig integrieren" knapp ist, verengt sich nicht schnell; O0 kostet wenig, aber auch Lernzeit am echten Kunden.

## 5. The cheapest decisive step

Ein Wochenend-Prototyp mit **echten Dokumenten eines KMU** (z. B. 50 Bestellungen oder Lieferscheine, anonymisiert, mit schriftlicher Erlaubnis): Extraktion in eine Tabelle/ERP-Format, Feldgenauigkeit gegen manuell erfasste Werte messen. Kosten: < 20 € API-Gebühren, ca. 10 Stunden.
**Vorab festgelegt:** ≥ 90 % korrekte Felder → I1 verengt verfolgen und Pilot anbieten. < 80 % nach einer Woche Nacharbeit → Dokumenttyp wechseln oder auf I4 als Einstieg umschwenken. Parallel: Arbeitsvertrag lesen; verbietet er Nebentätigkeit, wird O0 meine Position.

## 6. Conditions and red lines

- Unterstützt nur Ideen mit eigener Integrations-, Daten- oder Validierungsleistung; kein Produkt, dessen Wert ein Prompt ist.
- Jedes System braucht einen Testdatensatz, Fehler-Monitoring und eine menschliche Ausnahmebehandlung.
- n8n nur auf Kunden-Infrastruktur oder mit passender Lizenz.
- Keine Daten, Handbücher oder Kundenkontakte des Arbeitgebers.

## 7. One line

Bau Zuverlässigkeit und Integration rund um Dokumente produzierender KMU, nicht Wrapper – das wird mit besseren Modellen mehr wert, Fitness-Chatbots und Templates werden es nicht.
