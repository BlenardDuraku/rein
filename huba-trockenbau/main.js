// HUBA Trockenbau – Seitenlogik
(function () {
  'use strict';

  // ── Einstellungen ────────────────────────────────────────────────
  // Production-URL des n8n-Webhooks (Anfrage-Workflow). Leer = Formular öffnet das Mailprogramm.
  var WEBHOOK_URL = '';
  // Kontaktdaten – hier eintragen, dann werden alle Telefon- und Mail-Links automatisch gesetzt.
  var CONTACT_EMAIL = '';
  var CONTACT_PHONE = ''; // z. B. '+43 660 1234567'

  // Kontaktdaten in alle Links übernehmen
  if (CONTACT_PHONE) {
    document.querySelectorAll('[data-phone]').forEach(function (a) {
      a.href = 'tel:' + CONTACT_PHONE.replace(/[^+0-9]/g, '');
      var label = a.querySelector('.ph');
      if (label) { label.textContent = CONTACT_PHONE; label.classList.remove('ph'); }
    });
  }
  if (CONTACT_EMAIL) {
    document.querySelectorAll('[data-email]').forEach(function (a) {
      a.href = 'mailto:' + CONTACT_EMAIL;
      var label = a.querySelector('.ph');
      if (label) { label.textContent = CONTACT_EMAIL; label.classList.remove('ph'); }
    });
  }

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // ── Mobile Navigation ────────────────────────────────────────────
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('hauptnav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Schließen' : 'Menü';
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && nav.classList.contains('is-open')) toggle.click();
    });
  }

  // ── Hero: Wand baut sich einmal auf ──────────────────────────────
  var wall = document.querySelector('.wall');
  if (wall) {
    var build = function () { requestAnimationFrame(function () { wall.classList.add('is-built'); }); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build); else build();
  }

  // ── Q-Stufen ─────────────────────────────────────────────────────
  var LEVELS = {
    1: {
      title: 'Q1 – Grundverspachtelung',
      desc: 'Fugen und Schraubenköpfe werden einmal gefüllt, überstehendes Material wird abgestoßen. Spachtelspuren dürfen sichtbar bleiben.',
      use: 'Fliesen, Platten, Untergründe die verkleidet werden'
    },
    2: {
      title: 'Q2 – Standardverspachtelung',
      desc: 'Fugen werden nachgespachtelt und geschliffen, bis der Übergang zur Platte nicht mehr zu sehen ist. Der übliche Standard für Raufaser und matte Wandfarben.',
      use: 'Raufaser, matte Farben, grobe Strukturtapeten'
    },
    3: {
      title: 'Q3 – Sonderverspachtelung',
      desc: 'Zusätzlich zur Q2 wird die gesamte Fläche dünn überzogen, damit die Poren des Kartons geschlossen sind. Feine Strukturen und Farben bleiben gleichmäßig.',
      use: 'Feine Tapeten, matte bis halbmatte Farben, feiner Putz'
    },
    4: {
      title: 'Q4 – Vollflächige Verspachtelung',
      desc: 'Die ganze Fläche wird mehrfach gespachtelt oder vollflächig verputzt und geschliffen. Selbst im Streiflicht bleiben kaum Unebenheiten sichtbar.',
      use: 'Glatte Glanzfarben, Lacke, Glattputz, Wände mit Streiflicht'
    }
  };

  var qButtons = Array.prototype.slice.call(document.querySelectorAll('.q-switch [data-q]'));
  var qPanel = document.querySelector('.q-panel');
  var qTitle = document.querySelector('[data-q-title]');
  var qDesc = document.querySelector('[data-q-desc]');
  var qUse = document.querySelector('[data-q-use]');

  function selectLevel(btn, focus) {
    var level = btn.getAttribute('data-q');
    qButtons.forEach(function (b) {
      var on = b === btn;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    if (focus) btn.focus();
    qPanel.setAttribute('data-level', level);
    qTitle.textContent = LEVELS[level].title;
    qDesc.textContent = LEVELS[level].desc;
    qUse.textContent = LEVELS[level].use;
  }

  if (qButtons.length && qPanel) {
    qButtons.forEach(function (btn, i) {
      btn.tabIndex = btn.getAttribute('aria-checked') === 'true' ? 0 : -1;
      btn.addEventListener('click', function () { selectLevel(btn, false); });
      btn.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = qButtons[(i + 1) % qButtons.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = qButtons[(i - 1 + qButtons.length) % qButtons.length];
        if (next) { e.preventDefault(); selectLevel(next, true); }
      });
    });
  }

  // ── Anfrageformular ──────────────────────────────────────────────
  var form = document.getElementById('anfrage');
  if (!form) return;
  var status = form.querySelector('.form-status');
  var submit = form.querySelector('button[type="submit"]');

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = 'form-status field-full' + (kind ? ' is-' + kind : '');
  }

  function collect() {
    var d = {};
    ['name', 'email', 'phone', 'location', 'service', 'area', 'message', 'website'].forEach(function (k) {
      d[k] = (form.elements[k] && form.elements[k].value || '').trim();
    });
    return d;
  }

  function validate(d) {
    var problems = [];
    var name = form.elements.name;
    var email = form.elements.email;
    name.setAttribute('aria-invalid', String(d.name.length < 2));
    email.setAttribute('aria-invalid', String(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)));
    if (d.name.length < 2) problems.push('Bitte Ihren Namen angeben.');
    if (email.getAttribute('aria-invalid') === 'true') problems.push('Bitte eine gültige E-Mail-Adresse angeben.');
    return problems;
  }

  function openMailClient(d) {
    if (!CONTACT_EMAIL) {
      setStatus('Das Formular ist im Entwurf noch nicht verbunden.', 'error');
      return;
    }
    var body = 'Name: ' + d.name + '\nE-Mail: ' + d.email + '\nTelefon: ' + d.phone +
      '\nOrt: ' + d.location + '\nLeistung: ' + d.service + '\nFläche: ' + d.area + ' m²\n\n' + d.message;
    window.location.href = 'mailto:' + CONTACT_EMAIL +
      '?subject=' + encodeURIComponent('Anfrage: ' + d.service + ' – ' + d.name) +
      '&body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = collect();
    var problems = validate(d);
    if (problems.length) {
      setStatus(problems.join(' '), 'error');
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    if (!WEBHOOK_URL || !window.fetch) { openMailClient(d); return; }

    submit.disabled = true;
    setStatus('Anfrage wird gesendet …');
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (json) {
        if (res.ok) {
          form.reset();
          setStatus('Anfrage gesendet. Sie bekommen gleich eine Bestätigung per E-Mail.', 'ok');
        } else if (res.status === 400 && json.errors) {
          setStatus(json.errors.join(' '), 'error');
        } else {
          throw new Error('server');
        }
      });
    }).catch(function () {
      setStatus('Senden fehlgeschlagen – Ihr Mailprogramm wird geöffnet.', 'error');
      openMailClient(d);
    }).then(function () { submit.disabled = false; });
  });
})();
