#!/bin/bash
# Ende-zu-Ende-Szenarien gegen eine laufende Testumgebung (n8n auf :5678, Mock auf :18080, Postgres docflow_e2e).
# Voraussetzung: Workflows importiert und aktiv, Zugangsdaten wie in README beschrieben (Testschlüssel siehe unten).
set -u
DIR=$(mktemp -d)
N8N=http://127.0.0.1:5678/webhook
IN="X-API-Key: geheim"            # DF API-Schlüssel (Eingang, Status)
RV="X-API-Key: pruefer-geheim"    # DF Prüfer-API
Q="psql -h /tmp -p 54329 -U postgres -d docflow_e2e -At"
pdf() { printf '%%PDF-1.4\n%% NR:%s\n%%%%EOF\n' "$1" > "$DIR/$1.pdf"; echo "$DIR/$1.pdf"; }
upload() { curl -s -H "$IN" -H "X-Mandant: bau-ag" -F "datei=@$1;type=application/pdf" $N8N/dokument-eingang; }
wait_for() { local sql=$1 want=$2 t=0; until [ "$($Q -c "$sql")" = "$want" ] || [ $t -gt 300 ]; do sleep 3; t=$((t+3)); done; }
ok() { if [ "$1" = "$2" ]; then echo "  OK   $3"; else echo "  FEHLER $3 (erwartet '$2', bekommen '$1')"; FAIL=1; fi; }
FAIL=0

echo "1) Erste Rechnung eines neuen Lieferanten → muss zur Prüfung (Schutz vor Rechnungsbetrug)"
until upload "$(pdf RE-1001)" > $DIR/r1.json && grep -q job_id $DIR/r1.json; do sleep 3; done
J1=$(node -e "console.log(require('$DIR/r1.json').job_id)")
wait_for "select status from docflow.jobs where id='$J1'" review
ok "$($Q -c "select status from docflow.jobs where id='$J1'")" review "Status Prüfung"
ok "$($Q -c "select array_to_string(review_reason,';') like '%Erste Rechnung dieses Ausstellers%' from docflow.jobs where id='$J1'")" t "Grund: neuer Aussteller"
ok "$($Q -c "select string_agg(model||':'||ok, ',' order by id) from docflow.llm_calls where job_id='$J1'")" "claude-opus-5-5:false,claude-sonnet-5-5:true,claude-opus-5-5:true" "Überlastung → Ersatzmodell → Prüf-Agent"

echo "2) Prüf-API: Schutz und Freigabe"
ok "$(curl -s -o /dev/null -w '%{http_code}' -H "$IN" $N8N/pruefung/offen)" 403 "Eingangs-Schlüssel darf nicht prüfen"
T1=$($Q -c "select review_token from docflow.jobs where id='$J1'")
ok "$(curl -s -H "$RV" -H 'Content-Type: application/json' -d "{\"job_id\":\"$J1\",\"entscheidung\":\"freigeben\",\"pruefer\":\"x\"}" $N8N/pruefung/entscheidung | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).ok)")" false "Freigabe ohne Token abgelehnt"
ok "$(curl -s -H "$RV" -H 'X-Pruefer: anna.huber' -H 'Content-Type: application/json' -d "{\"job_id\":\"$J1\",\"token\":\"$T1\",\"entscheidung\":\"freigeben\"}" $N8N/pruefung/entscheidung | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).ok)")" true "Freigabe mit Token und Prüfer aus Header"
wait_for "select status from docflow.jobs where id='$J1'" done
ok "$($Q -c "select status||'/'||decided_by from docflow.jobs where id='$J1'")" "done/anna.huber" "Exportiert, Prüfer protokolliert"
ok "$($Q -c "select http_done::text||file_done::text from docflow.exports where job_id='$J1'")" truetrue "ERP (nach 500 erneut) und Datei"
ok "$(ls /data/export | grep -c "$J1")" 1 "Exportdatei mit festem Namen"

echo "3) Zweite Rechnung desselben Lieferanten, bekannte IBAN → automatisch"
J2=$(upload "$(pdf RE-1002)" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).job_id)")
wait_for "select status from docflow.jobs where id='$J2'" done
ok "$($Q -c "select status||'/'||coalesce(decided_by,'auto') from docflow.jobs where id='$J2'")" "done/auto" "Automatisch freigegeben und exportiert"

echo "4) Gleiche Rechnung als anderer Scan → Duplikat zur Prüfung"
printf '%%PDF-1.4\n%% Scan Baustelle NR:RE-1002\n%%%%EOF\n' > $DIR/scan.pdf
J3=$(upload $DIR/scan.pdf | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).job_id)")
wait_for "select status from docflow.jobs where id='$J3'" review
ok "$($Q -c "select array_to_string(review_reason,';') like '%Duplikat%' from docflow.jobs where id='$J3'")" t "Duplikat erkannt"

echo "5) Datenbank fällt während des Uploads aus"
su postgres -s /bin/bash -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/pgtest/data stop -m fast" > /dev/null
R5=$(upload "$(pdf LS-77)")
ok "$(echo "$R5" | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).status)")" zwischengespeichert "Bestätigung trotz DB-Ausfall"
ok "$(ls /data/spool | grep -c LS-77)" 1 "Datei im Zwischenspeicher"
su postgres -s /bin/bash -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/pgtest/data -o '-p 54329 -k /tmp' -l /var/tmp/pgtest/log start" > /dev/null
sleep 3
# Datei künstlich altern lassen (Wiederherstellung wartet 10 Minuten)
f=$(ls /data/spool | grep LS-77); old=$(date -u -d '-15 min' +%Y-%m-%dT%H-%M-%S-000Z)
mv "/data/spool/$f" "/data/spool/$(echo "$f" | sed -E "s/__[0-9T:-]+Z__/__${old}__/")"
wait_for "select count(*) from docflow.documents where source='spool'" 1
ok "$($Q -c "select count(*) from docflow.documents where source='spool'")" 1 "Automatisch aus dem Zwischenspeicher nachgeholt"
ok "$(curl -s 127.0.0.1:18080/log | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).some(x=>x.path==='/notfall'))")" true "Notfall-Alarm ohne Datenbank verschickt"

echo
[ $FAIL = 0 ] && echo "ALLE SZENARIEN BESTANDEN" || echo "ES GAB FEHLER"
