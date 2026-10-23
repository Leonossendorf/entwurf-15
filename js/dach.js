(function () {
  var TEILE = {"first": {"nr": 1, "kurz": "First", "titel": "First & Grat", "frage": "Firstziegel locker, Mörtel bröckelt oder nach dem Sturm fehlt oben etwas?", "text": "Wir befestigen den First neu oder erneuern ihn, damit oben wieder alles dicht ist."}, "kamin": {"nr": 2, "kurz": "Schornstein", "titel": "Schornstein-Anschluss", "frage": "Feuchte Flecken rund um den Schornstein, innen oder außen?", "text": "Oft ist der Anschluss zwischen Schornstein und Dach undicht. Wir dichten ihn wieder ab."}, "gaube": {"nr": 3, "kurz": "Gaube", "titel": "Dachausbau & Gauben", "frage": "Mehr Platz und mehr Licht unterm Dach?", "text": "Dachausbau und Gauben, passend zu Ihrem Haus eingedeckt und angeschlossen."}, "fenster": {"nr": 4, "kurz": "Dachfenster", "titel": "Dachfenster", "frage": "Zu dunkel unterm Dach, oder zieht es am alten Fenster?", "text": "Dachfenster neu einbauen oder austauschen, sauber ins Dach eingebunden."}, "ziegel": {"nr": 5, "kurz": "Ziegel", "titel": "Ziegel & Dachfläche", "frage": "Ein Ziegel verrutscht, gebrochen, oder es tropft?", "text": "Einzelne Ziegel tauschen wir schnell aus. Ist das Dach in die Jahre gekommen, decken wir es neu ein."}, "daemmung": {"nr": 6, "kurz": "Dämmung", "titel": "Dämmung & Unterdach", "frage": "Im Winter kalt, im Sommer heiß unterm Dach?", "text": "Dachdämmung, am besten zusammen mit einer Neueindeckung oder dem Ausbau."}, "rinne": {"nr": 7, "kurz": "Dachrinne", "titel": "Dachrinne & Fallrohr", "frage": "Rinne läuft über, tropft oder hängt durch?", "text": "Dachrinne und Fallrohr reinigen, reparieren oder erneuern."}};
  var aktiv = null;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function waehle(teil, opts) {
    var d = TEILE[teil];
    if (!d) return;
    aktiv = teil;
    $$('[data-teil]').forEach(function (el) {
      var an = el.getAttribute('data-teil') === teil;
      el.classList.toggle('an', an);
      if (el.hasAttribute('aria-pressed')) el.setAttribute('aria-pressed', an ? 'true' : 'false');
    });
    $('#tafel-nr').textContent = d.nr;
    $('#tafel-titel').textContent = d.titel;
    $('#tafel-frage').textContent = d.frage;
    $('#tafel-text').textContent = d.text;
    var tafel = $('#tafel');
    tafel.classList.remove('neu'); void tafel.offsetWidth; tafel.classList.add('neu');
    if (opts && opts.scroll) {
      var held = $('.held-bild');
      var y = held.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  $$('.nadel').forEach(function (n) {
    n.addEventListener('click', function () { waehle(n.getAttribute('data-teil')); });
    n.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); waehle(n.getAttribute('data-teil')); }
    });
  });
  $$('.stelle').forEach(function (b) {
    b.addEventListener('click', function () { waehle(b.getAttribute('data-teil')); });
  });
  $$('.leistung').forEach(function (b) {
    b.addEventListener('click', function () { waehle(b.getAttribute('data-teil'), { scroll: true }); });
  });

  $('#tafel-knopf').addEventListener('click', function () {
    if (aktiv) $('#f-stelle').value = aktiv;
    var art = { gaube: 'Ausbau oder Dachfenster', fenster: 'Ausbau oder Dachfenster', daemmung: 'Dämmung' }[aktiv] || 'Schaden oder Reparatur';
    $$('input[name="art"]').forEach(function (r) { r.checked = r.value === art; });
  });

  // Beim Laden einmal ruhig zeigen, wie es geht: der verrutschte Ziegel
  setTimeout(function () { if (!aktiv) waehle('ziegel'); }, 900);

  var form = $('#formular');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = new FormData(form);
    var stelle = form.querySelector('#f-stelle');
    var fotos = $('#f-foto').files.length;
    var zeilen = [
      ['Stelle', stelle.options[stelle.selectedIndex].text],
      ['Worum', f.get('art')],
      ['Wie eilig', f.get('eile')],
      ['Fotos', fotos ? fotos + ' angehängt' : 'keine'],
      ['Name', f.get('name') || '–'],
      ['Telefon', f.get('tel') || '–'],
      ['Ort', f.get('ort') || '–'],
      ['Nachricht', f.get('text') || '–']
    ];
    var z = $('#zusammenfassung');
    z.innerHTML = '<p class="zf-titel">So käme Ihre Anfrage bei Matthias Terbrack an</p><dl>' +
      zeilen.map(function (r) { return '<dt>' + r[0] + '</dt><dd></dd>'; }).join('') + '</dl>' +
      '<p class="zf-hinweis">Im Entwurf wird nichts versendet.</p>';
    var dds = z.querySelectorAll('dd');
    zeilen.forEach(function (r, i) { dds[i].textContent = r[1]; });
    z.hidden = false;
    z.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();
