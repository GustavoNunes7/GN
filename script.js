/* ==========================================================================
   GN · PORTFÓLIO — script.js (JavaScript puro, sem dependências)
   Usado por index.html e por todas as páginas de cursos.
   - Núcleo (todas as páginas): ícones pixel, navbar, menu, progresso, reveal,
     tilt 3D, cursor pixel, botão "voltar ao topo".
   - Home: boot, scrollspy, digitação, Hero 3D (carregado sob demanda),
     timeline, filtros de certificados, contato.
   O Three.js vive em js/hero3d.js e só é baixado na home, depois do boot.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isHome = document.body.dataset.page === 'home';
  const store = {
    get: (k) => { try { return sessionStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { sessionStorage.setItem(k, v); } catch { /* ignora */ } },
  };

  /* ---------- Ícones pixel ---------- */
  const hydrate = () => window.GNPixel && window.GNPixel.hydrateIcons(document);
  hydrate();

  /* ---------- Reveal ao rolar ---------- */
  let revealStarted = false;
  function startReveal() {
    if (revealStarted) return;
    revealStarted = true;
    const items = $$('[data-reveal]');
    const show = (el) => {
      el.classList.add('is-revealed');
      // depois da entrada, a transição vira "rápida" para o tilt acompanhar o mouse
      setTimeout(() => el.classList.add('settled'), 1100);
    };
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-revealed', 'settled'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Navbar, progresso, to-top, parallax (um único listener) ---------- */
  const navbar = $('#navbar');
  const bar = $('#progressBar');
  const toTop = $('#toTop');
  const grid = $('.bg-grid');
  const timeline = $('#timeline');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    if (navbar) navbar.classList.toggle('scrolled', y > 30);
    if (toTop) toTop.classList.toggle('show', y > 640);
    if (grid && !reduced) grid.style.setProperty('--sy', y);
    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const p = (window.innerHeight * 0.62 - r.top) / r.height;
      timeline.style.setProperty('--tl', Math.max(0, Math.min(1, p)).toFixed(3));
    }
  }
  const requestTick = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

  /* ---------- Menu mobile ---------- */
  const burger = $('.hamburger-btn');
  const menu = $('#navMenu');
  function setMenu(open) {
    if (!burger || !menu) return;
    menu.classList.toggle('active', open);
    burger.classList.toggle('active', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && menu) {
    burger.addEventListener('click', () => setMenu(!menu.classList.contains('active')));
    $$('.nav-link', menu).forEach((l) => l.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Tilt 3D + brilho nos cards ---------- */
  if (finePointer && !reduced) {
    $$('[data-tilt]').forEach((card) => {
      const max = card.classList.contains('projeto-card') && card.classList.contains('featured') ? 4 : 8;
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', `${((px - 0.5) * 2 * max).toFixed(2)}deg`);
        card.style.setProperty('--rx', `${((0.5 - py) * 2 * max).toFixed(2)}deg`);
        card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ---------- Cursor pixel (só mouse) ---------- */
  const cursor = $('#pxCursor');
  if (cursor && finePointer && !reduced) {
    let cx = 0, cy = 0, raf = 0;
    const paint = () => { raf = 0; cursor.style.transform = `translate(${cx - 5}px, ${cy - 5}px)`; };
    window.addEventListener('pointermove', (e) => {
      cx = e.clientX; cy = e.clientY;
      cursor.classList.add('on');
      if (!raf) raf = requestAnimationFrame(paint);
      cursor.classList.toggle('big', !!e.target.closest && !!e.target.closest('a, button, [data-tilt]'));
    }, { passive: true });
    document.addEventListener('pointerleave', () => cursor.classList.remove('on'));
  }

  if (!isHome) { startReveal(); return; }

  /* ==========================================================================
     HOME
     ========================================================================== */

  /* ---------- Scrollspy ---------- */
  const links = new Map($$('.nav-menu a[href^="#"]').map((a) => [a.getAttribute('href').slice(1), a]));
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a, id) => {
          const on = id === en.target.id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach((s) => spy.observe(s));
  }

  /* ---------- Digitação no Hero ---------- */
  function startTyping() {
    const el = $('#typeText');
    if (!el || reduced) return;
    const phrases = [
      'transformando ideias em código',
      'construindo soluções para problemas reais',
      'aprendendo algo novo a cada commit',
      'evoluindo na tecnologia todos os dias',
    ];
    let p = 0, i = 0, del = false;
    const tick = () => {
      const full = phrases[p];
      i += del ? -1 : 1;
      el.textContent = full.slice(0, i);
      let wait = del ? 28 : 55 + Math.random() * 45;
      if (!del && i === full.length) { del = true; wait = 1900; }
      else if (del && i === 0) { del = false; p = (p + 1) % phrases.length; wait = 380; }
      setTimeout(tick, wait);
    };
    el.textContent = '';
    setTimeout(tick, 500);
  }

  /* ---------- Hero 3D (sob demanda) com fallback em pixel art 2D ---------- */
  function setupHero() {
    const stage = $('#heroStage');
    const canvas = $('#heroCanvas');
    const poster = $('#heroPoster');
    if (!stage || !canvas || !poster) return;
    if (window.GNPixel && window.GNPixel.drawFallback) window.GNPixel.drawFallback(poster);

    // Mantém o cenário 3D ativo também em dispositivos móveis.
    // O renderer já usa pixel ratio 1, sem antialias e modo low-power.

    const mobile = matchMedia('(max-width: 760px)').matches;
    const load = () => {
      import(new URL('js/hero3d.js', document.baseURI).href)
        .then(async (mod) => {
          if (!mod.webglOk()) return;
          const hero = await mod.init(canvas, {
            reduced,
            mobile,
            onFail: () => stage.classList.remove('ready'),
          });
          stage.classList.add('ready');
          window.__gnHero = hero;
        })
        .catch(() => { /* mantém o fallback 2D */ });
    };
    if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 1500 });
    else setTimeout(load, 300);
  }

  /* ---------- Filtros de certificados ---------- */
  function setupCertFilters() {
    const wrap = $('#certFilters');
    const barEl = $('#instBar');
    const cards = $$('#certGrid .cert');
    if (!wrap || !barEl) return;
    const chips = $$('.chip', wrap);
    const el = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt) n.textContent = txt; return n; };

    chips.forEach((chip) => chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      let shown = 0;
      cards.forEach((card) => {
        const ok = f === 'all' || card.dataset.inst === f;
        card.hidden = !ok;
        card.classList.remove('in');
        if (ok) {
          // cards ocultos ao carregar ainda precisam aparecer: força o estado revelado
          card.classList.add('is-revealed', 'settled');
          void card.offsetWidth;
          card.style.animationDelay = `${Math.min(shown, 8) * 45}ms`;
          if (!reduced) card.classList.add('in');
          shown++;
        }
      });
      barEl.textContent = '';
      const line = el('span');
      if (f === 'all') {
        line.append(el('b', '', 'Todos'), document.createTextNode(` — ${chip.dataset.desc}`));
        barEl.append(line);
      } else {
        line.append(el('em', '', chip.dataset.kicker), document.createTextNode('  '), el('b', '', chip.dataset.title));
        barEl.append(line, el('span', '', chip.dataset.desc));
        if (chip.dataset.href) {
          const a = el('a', 'link-px', 'Abrir página completa →');
          a.href = chip.dataset.href;
          barEl.append(a);
        }
      }
    }));
  }

  /* ---------- Contato (terminal + copiar) ---------- */
  function setupContact() {
    const toast = $('#contactToast');
    let timer = 0;
    $$('.copy-btn').forEach((btn) => btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      let ok = false;
      try { await navigator.clipboard.writeText(text); ok = true; } catch {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.cssText = 'position:fixed;opacity:0;top:0';
        document.body.append(ta); ta.select();
        try { ok = document.execCommand('copy'); } catch { ok = false; }
        ta.remove();
      }
      const label = btn.textContent;
      if (ok) {
        btn.classList.add('ok'); btn.textContent = 'OK!';
        if (toast) toast.textContent = `> ${btn.dataset.what} copiado para a área de transferência.`;
      } else if (toast) {
        toast.textContent = `> Não foi possível copiar automaticamente: ${text}`;
      }
      clearTimeout(timer);
      timer = setTimeout(() => { btn.classList.remove('ok'); btn.textContent = ok ? 'COPIAR' : label; }, 1800);
    }));

    const cmd = $('#termCmd');
    const box = $('.cta-box');
    if (!cmd || !box || reduced || !('IntersectionObserver' in window)) return;
    const full = '$ gn --connect  ✔ canal aberto';
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      cmd.textContent = '';
      let n = 0;
      const type = () => { cmd.textContent = full.slice(0, ++n); if (n < full.length) setTimeout(type, 22); };
      type();
    }, { threshold: 0.35 });
    io.observe(box);
  }

  /* ---------- Boot ---------- */
  function boot() {
    const el = $('#boot');
    const go = () => {
      startReveal();
      const t = $('#heroTitle');
      if (t) t.classList.add('go');
      startTyping();
      setupHero();
    };
    if (!el || reduced || store.get('gn-booted')) {
      if (el) el.remove();
      go();
      return;
    }
    const log = $('#bootLog');
    const fill = $('#bootBar');
    const lines = ['carregando módulos…', 'montando o cenário 3D…', 'compilando pixels…', 'pronto. bem-vindo!'];
    let i = 0, finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      store.set('gn-booted', '1');
      el.classList.add('done');
      setTimeout(() => el.remove(), 600);
      go();
    };
    const step = () => {
      if (finished) return;
      log.textContent = '';
      lines.slice(0, i + 1).forEach((l, k) => {
        const row = document.createElement('div');
        row.textContent = '> ' + l;
        if (k < i) row.style.opacity = '0.55';
        log.append(row);
      });
      fill.style.width = `${Math.round(((i + 1) / lines.length) * 100)}%`;
      i++;
      if (i < lines.length) setTimeout(step, 260); else setTimeout(finish, 380);
    };
    step();
    $('#bootSkip').addEventListener('click', finish);
    setTimeout(finish, 3000); // rede de segurança
  }

  setupCertFilters();
  setupContact();
  boot();
})();
