/* ==========================================================================
   GN · RECURSOS DA HOME
   - Skill Tree interativa (nós, estados e painel de detalhes)
   - Conquistas (achievements) a partir de GN_DATA
   - Terminal interativo (comandos com dados reais do portfólio)
   - Easter eggs (logo GN, código clássico e moedas escondidas)
   ========================================================================== */
(() => {
  'use strict';
  if (document.body.dataset.page !== 'home') return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const D = window.GN_DATA || { certificates: [], achievements: [] };
  const S = () => window.GNSettings;
  const sfx = (n) => S() && S().sfx(n);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hydrate = (root) => window.GNPixel && window.GNPixel.hydrateIcons(root || document);
  const clean = (t) => (t || '').replace(/\s+/g, ' ').trim();
  const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt != null) n.textContent = txt; return n; };

  /* ---------- Segredos descobertos (persistidos) ---------- */
  let secrets = { coins: [], logo: false, konami: false };
  try { secrets = { ...secrets, ...(JSON.parse(localStorage.getItem('gn-secrets') || '{}') || {}) }; } catch { /* ignora */ }
  const saveSecrets = () => { try { localStorage.setItem('gn-secrets', JSON.stringify(secrets)); } catch { /* ignora */ } };
  const secretDone = (id) => (id === 's-coins' ? secrets.coins.length >= 3 : id === 's-logo' ? secrets.logo : id === 's-konami' ? secrets.konami : false);

  /* ---------- Toast ---------- */
  const toast = el('div', 'gn-toast'); toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite'); toast.hidden = true;
  document.body.append(toast);
  let toastTimer = 0;
  function showToast(title, text) {
    toast.textContent = '';
    toast.append(el('b', '', title), el('span', '', text));
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.classList.remove('show'); setTimeout(() => { toast.hidden = true; }, 350); }, 3600);
  }

  /* ---------- Explosão de pixels ---------- */
  function pixelBurst(x, y, n = 16) {
    if (reduced) return;
    const colors = ['#27ae60', '#6fe3a0', '#4ea8de', '#1565c0', '#f5f7fa'];
    for (let i = 0; i < n; i++) {
      const p = el('i', 'px-confetti');
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.5, d = 40 + Math.random() * 70;
      p.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 20}px;background:${colors[i % colors.length]}`;
      document.body.append(p);
      setTimeout(() => p.remove(), 900);
    }
  }

  /* ==========================================================================
     SKILL TREE
     ========================================================================== */
  const STATE = { learned: 'Aprendido', dev: 'Em desenvolvimento', next: 'Próximo objetivo' };
  function setupSkillTree() {
    const nodes = $$('.skill-node');
    const box = $('#skillDetail');
    if (!nodes.length || !box) return;
    const icon = $('.skill-detail-icon', box), cat = $('.skill-detail-cat', box), name = $('.skill-detail-name', box);
    const desc = $('.skill-detail-desc', box), badge = $('#skillDetailState');

    nodes.forEach((n) => {
      n.dataset.sfx = 'special';
      // As habilidades são apresentadas sem rótulos de progresso ou níveis.
      n.removeAttribute('data-state');
      n.addEventListener('click', () => {
        nodes.forEach((o) => { o.classList.toggle('is-selected', o === n); o.setAttribute('aria-pressed', String(o === n)); });
        const src = $('.pxi', n);
        icon.dataset.px = src ? src.dataset.px : 'sparkle';
        icon.removeAttribute('data-px-ready'); icon.textContent = '';
        hydrate(box);
        cat.textContent = `// ${n.dataset.cat.toUpperCase()}`;
        name.textContent = $('.skill-name', n).textContent;
        desc.textContent = n.dataset.desc;
        if (badge) badge.hidden = true;
        box.classList.remove('pulse'); void box.offsetWidth; box.classList.add('pulse');
        if (!reduced) {
          for (let i = 0; i < 8; i++) {
            const b = el('i', 'skill-burst'), a = (Math.PI * 2 * i) / 8;
            b.style.setProperty('--dx', `${Math.cos(a) * 34}px`); b.style.setProperty('--dy', `${Math.sin(a) * 22}px`);
            n.append(b); setTimeout(() => b.remove(), 650);
          }
        }
      });
    });
  }

  /* ==========================================================================
     CONQUISTAS
     ========================================================================== */
  let achFilter = 'Todas';
  function renderAchievements() {
    const grid = $('#achGrid'), filters = $('#achFilters'), count = $('#achCount');
    if (!grid || !filters) return;
    // Exibe somente marcos reais; segredos continuam existindo no terminal/easter eggs.
    const list = D.achievements.filter((a) => a.status !== 'secret');
    const cats = ['Todas', ...Array.from(new Set(list.map((a) => a.cat)))];

    filters.textContent = '';
    cats.forEach((c) => {
      const n = c === 'Todas' ? list.length : list.filter((a) => a.cat === c).length;
      const b = el('button', 'chip'); b.type = 'button'; b.setAttribute('aria-pressed', String(c === achFilter));
      b.append(document.createTextNode(c + ' '), el('small', '', String(n)));
      b.addEventListener('click', () => { achFilter = c; renderAchievements(); });
      filters.append(b);
    });

    count.textContent = String(list.length).padStart(2, '0');
    grid.textContent = '';
    list.filter((a) => achFilter === 'Todas' || a.cat === achFilter).forEach((a, i) => {
      const card = el('article', 'ach-card px');
      card.style.setProperty('--i', String(i % 9));
      const ic = el('span', 'pxi ach-icon'); ic.dataset.px = a.icon;
      const body = el('div', 'ach-body');
      body.append(el('small', 'ach-cat', a.cat.toUpperCase()));
      const h = el('h3');
      if (a.href) { const l = el('a', 'ach-link', a.name); l.href = a.href; h.append(l); }
      else h.textContent = a.name;
      body.append(h, el('p', '', a.desc));
      card.append(ic, body);
      grid.append(card);
    });
    hydrate(grid);
  }

  function unlockSecret(id) {
    const a = D.achievements.find((x) => x.id === id);
    saveSecrets(); renderAchievements();
    if (a) showToast('🏆 CONQUISTA DESBLOQUEADA', a.name);
    sfx('unlock');
  }

  /* ==========================================================================
     TERMINAL
     ========================================================================== */
  function setupTerminal() {
    const out = $('#termScreen'), form = $('#termForm'), input = $('#termInput'), chips = $('#termChips');
    if (!out || !form || !input) return;
    const history = []; let hi = 0;

    const row = (parts, cls) => {
      const d = el('div', 'tl' + (cls ? ' ' + cls : ''));
      (Array.isArray(parts) ? parts : [parts]).forEach((p) => {
        if (typeof p === 'string') d.append(document.createTextNode(p));
        else if (p.href) {
          const a = el('a', 'link-px', p.a); a.href = p.href;
          if (/^https?:/.test(p.href)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
          d.append(a);
        } else if (p.b) d.append(el('b', '', p.b));
        else if (p.em) d.append(el('em', '', p.em));
      });
      out.append(d);
    };
    const gap = () => out.append(el('div', 'tl gap'));
    const done = () => { out.scrollTop = out.scrollHeight; };

    const nodes = () => $$('.skill-node').map((n) => ({ cat: n.dataset.cat, name: $('.skill-name', n).textContent, state: n.dataset.state }));
    const projects = () => $$('.projeto-card[data-project]').map((c) => ({
      name: c.dataset.project, status: clean($('.status-chip', c).textContent), desc: clean($('.projeto-info > p', c).textContent),
      tech: $$('.tech-tags span', c).map((t) => t.textContent), github: ($('.projeto-links a', c) || {}).href || '',
    }));

    const CMDS = {
      help() {
        row([{ b: 'Comandos disponíveis' }]);
        [['PERFIL', ''], ['about', 'quem é Gustavo Nunes'], ['whoami', 'identifica o visitante'], ['journey', 'trajetória'], ['contact', 'formas de contato'],
          ['TECNOLOGIA', ''], ['skills', 'habilidades por categoria'], ['stack', 'resumo das tecnologias'], ['projects', 'projetos em destaque'], ['certificates', 'certificados (ex.: certificates senai)'],
          ['NAVEGAÇÃO', ''], ['home', 'volta ao início'], ['github', 'abre os repositórios'], ['terminal', 'informações deste terminal'],
          ['PERSONALIZAÇÃO', ''], ['theme light|dark', 'altera o tema'], ['immersive on|off', 'modo imersivo'], ['music on|off', 'trilha musical'], ['effects on|off', 'efeitos sonoros'],
          ['SISTEMA', ''], ['help', 'mostra esta ajuda'], ['clear', 'limpa a tela']]
          .forEach(([c, d]) => { if (!d) row([{ b: c }]); else row([{ em: c.padEnd(18, ' ') }, d], 'pre'); });
      },
      about() {
        const p = $('.about-text p');
        row([{ b: 'Gustavo Nunes da Silva' }, ' — System Developer · Guarulhos-SP']);
        row(clean(p && p.textContent));
        const hud = $$('.hud-card .hud-row').map((r) => `${clean($('.hud-k', r).textContent)} ${clean($('.hud-v', r).textContent)}`);
        hud.forEach((h) => row(h, 'dim'));
      },
      skills() {
        const by = {};
        nodes().forEach((n) => { (by[n.cat] = by[n.cat] || []).push(n); });
        Object.keys(by).forEach((c) => {
          row([{ b: c }]);
          by[c].forEach((n) => row(['  • ' + n.name + ' ', { em: `[${(STATE[n.state] || '').toLowerCase()}]` }], 'pre'));
        });
      },
      projects() {
        projects().forEach((p, i) => {
          row([{ b: `${i + 1}. ${p.name}` }, '  ', { em: `[${p.status.toLowerCase()}]` }]);
          row('   ' + p.desc, 'pre');
          row('   Tecnologias: ' + p.tech.join(', '), 'pre dim');
          if (p.github) row(['   ', { a: p.github.replace('https://', ''), href: p.github }], 'pre');
        });
      },
      certificates(arg) {
        const id = (arg || '').toLowerCase();
        const inst = D.certificates.find((c) => c.id === id);
        if (id && !inst) { row(`Instituição não encontrada: ${arg}. Use: ${D.certificates.map((c) => c.id).join(', ')}`, 'err'); return; }
        if (inst) {
          row([{ b: inst.name }, ` — ${inst.items.length} certificado(s)`]);
          inst.items.forEach((t) => row('  • ' + t, 'pre'));
          row(['  ', { a: 'Abrir página completa →', href: inst.page }], 'pre');
          return;
        }
        const total = D.certificates.reduce((s, c) => s + c.items.length, 0);
        row([{ b: `${total} certificados` }, ' em 5 instituições']);
        D.certificates.forEach((c) => row([`  • ${c.name}: ${c.items.length}  `, { a: 'abrir', href: c.page }, { em: `  (certificates ${c.id})` }], 'pre'));
      },
      contact() {
        $$('.contact-row > a').forEach((a) => {
          row([{ em: clean($('.k', a) ? $('.k', a).textContent : '').padEnd(10, ' ') }, { a: clean($('.v', a).textContent).replace(/\s*↗$/, ''), href: a.href }], 'pre');
        });
      },
      journey() {
        $$('.timeline-item').forEach((t) => {
          row([{ em: clean($('.timeline-date', t).textContent) + '  ' }, { b: clean($('h3', t).textContent) }]);
          row('   ' + clean($('p', t).textContent), 'pre dim');
        });
      },
      achievements() {
        D.achievements.filter((a) => a.status !== 'secret').forEach((a) => {
          row([a.status === 'done' ? '[✔] ' : '[…] ', { b: a.name }, ` — ${a.desc}`], 'pre');
        });
        row('Existem conquistas secretas. Boa exploração!', 'dim');
      },
      theme(arg) {
        const v = (arg || '').toLowerCase();
        if (v !== 'light' && v !== 'dark') { row(`Tema atual: ${S().get('theme')}. Use: theme light | dark`); return; }
        S().set('theme', v); row(`Tema alterado para ${v}.`);
      },
      immersive(arg) {
        const v = (arg || '').toLowerCase();
        if (v !== 'on' && v !== 'off') { row(`Modo imersivo: ${S().get('immersive') ? 'on' : 'off'}. Use: immersive on | off`); return; }
        S().set('immersive', v === 'on'); row(`Modo imersivo ${v === 'on' ? 'ativado (Esc para sair)' : 'desativado'}.`);
      },
      sound(arg) {
        const v = (arg || '').toLowerCase();
        if (v !== 'on' && v !== 'off') { row(`Sons: ${S().get('sound') ? 'on' : 'off'}. Use: sound on | off`); return; }
        S().set('sound', v === 'on'); row(`Sons ${v === 'on' ? 'ativados' : 'desativados'}.`);
      },
      stack() {
        row([{ b: 'GN · TECH STACK' }]);
        [['Web', 'HTML · CSS · JavaScript · Tailwind CSS · Bootstrap'], ['Back-end', 'Node.js · Express · Python · Java'], ['Dados', 'SQLite · MySQL'], ['Mobile', 'React Native · Android Studio · Expo'], ['IoT', 'Arduino · ESP8266'], ['Ferramentas', 'Git · GitHub · VS Code · Figma · Vercel']].forEach(([k,v]) => row([{ em: k.padEnd(13, ' ') }, v], 'pre'));
      },
      music(arg) {
        const v = (arg || '').toLowerCase();
        if (v !== 'on' && v !== 'off') { row(`Música: ${S().get('music') ? 'on' : 'off'}. Use: music on | off`); return; }
        S().set('sound', true); S().set('effects', false); S().set('music', v === 'on');
        row(`Trilha musical ${v === 'on' ? 'ativada' : 'desativada'}; efeitos sonoros desligados.`);
      },
      effects(arg) {
        const v = (arg || '').toLowerCase();
        if (v !== 'on' && v !== 'off') { row(`Efeitos sonoros: ${S().get('effects') ? 'on' : 'off'}. Use: effects on | off`); return; }
        S().set('effects', v === 'on'); row(`Efeitos sonoros ${v === 'on' ? 'ativados' : 'desativados'}.`);
      },
      home() { location.hash = 'home'; row('Voltando ao início.'); },
      github() { row([{ a: 'github.com/GustavoNunes7', href: 'https://github.com/GustavoNunes7' }]); },
      terminal() { row('GN.OS terminal · comandos interativos · histórico com ↑ e ↓ · autocomplete com Tab.'); },
      whoami() { row('visitante — bem-vindo ao portfólio do GN.'); },
      clear() { out.textContent = ''; },
    };

    function run(raw) {
      const line = clean(raw);
      if (!line) return;
      history.push(line); hi = history.length;
      row([{ em: 'gn@portfolio:~$ ' }, line], 'cmd');
      const [cmd, ...rest] = line.split(' ');
      const key = cmd.toLowerCase();
      if (line.toLowerCase() === 'sudo hire gn') {
        row('[sudo] permissão concedida. 🎉', 'ok');
        row(['Que ótimo! Fale comigo em ', { a: 'contato', href: '#contato' }, ' — vamos construir algo.']);
      } else if (Object.prototype.hasOwnProperty.call(CMDS, key)) {
        CMDS[key](rest.join(' '));
      } else {
        row(`comando não encontrado: ${cmd}. Digite "help" para ver as opções.`, 'err');
      }
      if (key !== 'clear') gap();
      done();
    }

    form.addEventListener('submit', (e) => { e.preventDefault(); sfx('key'); run(input.value); input.value = ''; });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) input.value = history[--hi]; }
      else if (e.key === 'ArrowDown') { e.preventDefault(); input.value = hi < history.length - 1 ? history[++hi] : (hi = history.length, ''); }
      else if (e.key === 'Tab') {
        const v = input.value.toLowerCase();
        if (!v) return;
        const m = Object.keys(CMDS).filter((c) => c.startsWith(v));
        if (m.length === 1) { e.preventDefault(); input.value = m[0]; }
      }
    });
    out.addEventListener('click', () => { if (finePointer) input.focus({ preventScroll: true }); });

    ['help', 'about', 'skills', 'stack', 'projects', 'certificates', 'contact', 'github', 'clear'].forEach((c) => {
      const b = el('button', 'chip', c); b.type = 'button';
      b.addEventListener('click', () => { run(c); if (finePointer) input.focus({ preventScroll: true }); });
      chips.append(b);
    });

    row([{ b: 'GN.OS terminal v1.0' }]);
    row('Digite "help" para ver os comandos ou use os botões abaixo.', 'dim');
    gap();

    $$('.nav-icon-btn[href="#terminal"]').forEach((a) => a.addEventListener('click', () => {
      if (finePointer) setTimeout(() => input.focus({ preventScroll: true }), 700);
    }));
  }

  /* ==========================================================================
     EASTER EGGS
     ========================================================================== */
  function setupEggs() {
    // 1) Logo GN: 5 cliques seguidos
    const logo = $('.navbar .logo');
    if (logo) {
      let clicks = [];
      logo.addEventListener('click', () => {
        const now = Date.now();
        clicks = clicks.filter((t) => now - t < 3000); clicks.push(now);
        if (clicks.length >= 5) {
          clicks = [];
          const r = logo.getBoundingClientRect();
          pixelBurst(r.left + r.width / 2, r.top + r.height / 2, 24);
          if (!secrets.logo) { secrets.logo = true; unlockSecret('s-logo'); }
          else { showToast('> GN.OS', 'Você já conhece esse segredo. 😉'); sfx('special'); }
        }
      });
    }

    // 2) Código clássico
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let pos = 0;
    document.addEventListener('keydown', (e) => {
      if (e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) { pos = 0; return; }
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = k === code[pos] ? pos + 1 : (k === code[0] ? 1 : 0);
      if (pos === code.length) {
        pos = 0;
        pixelBurst(innerWidth / 2, innerHeight / 2, 36);
        if (!secrets.konami) { secrets.konami = true; unlockSecret('s-konami'); }
        else { showToast('> GN.OS', '+30 vidas. Mas você já sabia. 😎'); sfx('special'); }
      }
    });

    // 3) Moedas escondidas (3)
    const spots = [
      { sel: '.verse', id: 'coin-1' },
      { sel: '#trajetoria .sec-head', id: 'coin-2' },
      { sel: '.footer-links', id: 'coin-3' },
    ];
    spots.forEach((s) => {
      const host = $(s.sel);
      if (!host || secrets.coins.includes(s.id)) return;
      const b = el('button', 'secret-coin'); b.type = 'button'; b.dataset.sfx = 'none';
      b.setAttribute('aria-label', 'Moeda secreta'); b.title = '?';
      const i = el('span', 'pxi'); i.dataset.px = 'coin'; b.append(i);
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        secrets.coins.push(s.id);
        const r = b.getBoundingClientRect();
        pixelBurst(r.left + r.width / 2, r.top + r.height / 2, 10);
        b.remove();
        if (secrets.coins.length >= 3) unlockSecret('s-coins');
        else { saveSecrets(); showToast('🪙 MOEDA SECRETA', `${secrets.coins.length}/3 encontradas`); sfx('coin'); }
      });
      host.classList.add('has-coin');
      host.append(b);
    });
    hydrate();

    console.log('%cGN.OS', 'background:#0b3d2e;color:#6fe3a0;padding:4px 8px;font-weight:bold', 'Olá, dev! Há segredos escondidos neste portfólio. 🕹️');
  }

  setupSkillTree();
  renderAchievements();
  setupTerminal();
  setupEggs();
})();
