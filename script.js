(function () {
  'use strict';

  var app = document.getElementById('app');
  var houses = [
    { name: 'Casa 1', people: '' },
    { name: 'Casa 2', people: '' }
  ];
  var results = [];
  var current = null;

  /* ---------- utilidades ---------- */
  function enc(o) { return btoa(unescape(encodeURIComponent(JSON.stringify(o)))); }
  function dec(s) { return JSON.parse(decodeURIComponent(escape(atob(s)))); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function link(o) { return location.href.split('#')[0] + '#r=' + enc(o); }

  /* ---------- tela de cadastro ---------- */
  function viewSetup(err) {
    var h = '<h1>🎁 Amigo Secreto</h1>' +
      '<p class="s">Agrupe as pessoas por casa: ninguém tira alguém da própria casa. ' +
      'Nem você vai ver quem tirou quem.</p>';

    houses.forEach(function (c, i) {
      h += '<div class="card">' +
        '<div class="row b"><b>Casa ' + (i + 1) + '</b>' +
        (houses.length > 2 ? '<button class="g sm" data-act="rm" data-i="' + i + '">Remover</button>' : '') +
        '</div>' +
        '<label>Nome da casa</label>' +
        '<input data-f="name" data-i="' + i + '" value="' + esc(c.name) + '">' +
        '<label>Pessoas (uma por linha)</label>' +
        '<textarea data-f="people" data-i="' + i + '">' + esc(c.people) + '</textarea>' +
        '</div>';
    });

    h += '<div class="row">' +
      '<button class="g" data-act="add">+ Adicionar casa</button>' +
      '<button data-act="draw">Sortear</button></div>';
    if (err) h += '<div class="err">' + err + '</div>';
    app.innerHTML = h;
  }

  /* ---------- sorteio ---------- */
  function draw() {
    var ppl = [], seen = {};

    for (var i = 0; i < houses.length; i++) {
      var ns = houses[i].people.split('\n')
        .map(function (x) { return x.trim(); })
        .filter(Boolean);
      for (var j = 0; j < ns.length; j++) {
        var k = ns[j].toLowerCase();
        if (seen[k]) return viewSetup('O nome "' + esc(ns[j]) + '" aparece repetido. Use nomes diferentes.');
        seen[k] = 1;
        ppl.push({ n: ns[j], h: i });
      }
    }

    if (ppl.length < 3) return viewSetup('Coloque pelo menos 3 pessoas.');

    var cnt = {};
    ppl.forEach(function (p) { cnt[p.h] = (cnt[p.h] || 0) + 1; });
    for (var h in cnt) {
      if (cnt[h] * 2 > ppl.length) {
        var nome = houses[h].name || ('Casa ' + (+h + 1));
        return viewSetup('A casa "' + esc(nome) + '" tem gente demais: não dá pra sortear sem ninguém pegar alguém da própria casa.');
      }
    }

    var res = null;
    for (var t = 0; t < 5000 && !res; t++) {
      var tg = ppl.slice();
      for (var a = tg.length - 1; a > 0; a--) {
        var b = Math.floor(Math.random() * (a + 1));
        var x = tg[a]; tg[a] = tg[b]; tg[b] = x;
      }
      var ok = true;
      for (var m = 0; m < ppl.length; m++) {
        if (ppl[m].h === tg[m].h) { ok = false; break; }
      }
      if (ok) res = tg;
    }

    if (!res) return viewSetup('Não consegui sortear com essas regras. Tente de novo.');

    viewResults(ppl.map(function (p, i) { return { n: p.n, t: res[i].n }; }));
  }

  /* ---------- tela do organizador (sem mostrar resultados) ---------- */
  function viewResults(out) {
    results = out;
    var h = '<h1>✅ Sorteio feito!</h1>' +
      '<p class="s">Mande para cada pessoa o link dela. Você não vê quem tirou quem aqui. ' +
      'Cada link só mostra o resultado de quem o abrir.</p>';

    out.forEach(function (o, i) {
      h += '<div class="card row b"><b>' + esc(o.n) + '</b><span class="row">' +
        '<button class="sm" data-act="wa" data-i="' + i + '">WhatsApp</button>' +
        '<button class="g sm" data-act="cp" data-i="' + i + '">Copiar link</button>' +
        '</span></div>';
    });

    h += '<p class="note">Peça para cada pessoa abrir o link e guardar o resultado em segredo. 🤫</p>' +
      '<button class="g" data-act="back">Voltar e refazer</button>';
    app.innerHTML = h;
  }

  function whatsapp(i) {
    var o = results[i];
    var msg = 'Oi, ' + o.n + '! Seu amigo secreto está aqui (só você deve abrir): ' + link(o);
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
  }

  function copy(i, btn) {
    var t = link(results[i]);
    function done() { btn.textContent = 'Copiado ✓'; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(done, function () { window.prompt('Copie o link:', t); });
    } else {
      window.prompt('Copie o link:', t);
    }
  }

  /* ---------- tela de quem recebe o link ---------- */
  function viewReveal(o) {
    current = o;
    app.innerHTML = '<div class="c"><h1>🎁 Olá, ' + esc(o.n) + '!</h1>' +
      '<p class="s">Seu amigo secreto está escondido. Certifique-se de que ninguém está olhando a tela.</p>' +
      '<div id="box"><button data-act="show">Toque para revelar</button></div>' +
      '<p class="note">Depois de ver, é só fechar a página. Você pode abrir o link de novo se esquecer.</p></div>';
  }

  function showResult() {
    document.getElementById('box').innerHTML =
      '<div>Você tirou:</div><div class="big">' + esc(current.t) + '</div>' +
      '<button class="g" data-act="hide">Esconder</button>';
  }

  function hideResult() {
    document.getElementById('box').innerHTML = '<button data-act="show">Toque para revelar</button>';
  }

  /* ---------- eventos ---------- */
  app.addEventListener('input', function (e) {
    var f = e.target.getAttribute('data-f');
    if (f) houses[+e.target.getAttribute('data-i')][f] = e.target.value;
  });

  app.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-act]');
    if (!btn) return;
    var i = +btn.getAttribute('data-i');
    switch (btn.getAttribute('data-act')) {
      case 'add':
        houses.push({ name: 'Casa ' + (houses.length + 1), people: '' });
        viewSetup(); break;
      case 'rm': houses.splice(i, 1); viewSetup(); break;
      case 'draw': draw(); break;
      case 'back': viewSetup(); break;
      case 'wa': whatsapp(i); break;
      case 'cp': copy(i, btn); break;
      case 'show': showResult(); break;
      case 'hide': hideResult(); break;
    }
  });

  /* ---------- início ---------- */
  var m = location.hash.match(/^#r=(.+)$/);
  if (m) {
    try { viewReveal(dec(m[1])); return; } catch (err) { /* link inválido: cai no cadastro */ }
  }
  viewSetup();
})();
