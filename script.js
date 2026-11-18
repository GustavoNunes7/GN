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


  /* Configurações (tema, áudio, modo imersivo) agora vivem em js/gn-core.js */

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
    const bootOn = !window.GNSettings || window.GNSettings.get('boot') !== false;
    if (!el || reduced || !bootOn || store.get('gn-booted')) {
      if (el) el.remove();
      go();
      return;
    }
    const log = $('#bootLog');
    const fill = $('#bootBar');
    const pct = $('#bootPct');
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
      const p = Math.round(((i + 1) / lines.length) * 100);
      fill.style.width = `${p}%`;
      if (pct) pct.textContent = `${p}%`;
      i++;
      if (i < lines.length) setTimeout(step, 240); else setTimeout(finish, 320);
    };
    step();
    $('#bootSkip').addEventListener('click', finish);
    setTimeout(finish, 2500); // rede de segurança
  }

  setupCertFilters();
  setupContact();
  boot();
  /* ---------- Certificados: navegação interna sem recarregar a página ---------- */
  const certOverview = $('.certificate-overview');
  const certDetail = $('#certificateDetail');
  const certContent = $('#certificateDetailContent');
  const certBack = $('#certificateBack');
  const certPages = {"senai":"<main id=\"main\">\n      <section class=\"page-header\">\n        <div class=\"container\">\n          <p class=\"crumbs\" data-reveal><a href=\"./index.html\">home</a> / <a href=\"./index.html#certificados\">certificados</a> / <span>senai</span></p>\n          <img class=\"inst-logo\" src=\"./images/cursos/senai.jpg\" alt=\"Logo SENAI\" />\n          <h1 data-reveal style=\"--d: 1\">Certificados <span>SENAI</span></h1>\n          <p data-reveal style=\"--d: 2\">Estudante de Desenvolvimento de Sistemas. Histórico de competências transversais e qualificações técnicas adquiridas no SENAI.</p>\n        </div>\n      </section>\n\n      <section class=\"page-section\">\n        <div class=\"container\">\n          <div class=\"certificate-grid\">\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"code\"></span>\n            <div>\n              <h3>Tecnologia da Informação e Comunicação</h3>\n              <p>Competência Transversal</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"chip\"></span>\n            <div>\n              <h3>Lógica de Programação</h3>\n              <p>Competência Transversal</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"chart\"></span>\n            <div>\n              <h3>Excel Básico</h3>\n              <p>Ferramentas Office</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"lock\"></span>\n            <div>\n              <h3>Por dentro da Segurança Cibernética</h3>\n              <p>Segurança da Informação</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"robot\"></span>\n            <div>\n              <h3>Ética na Inteligência Artificial</h3>\n              <p>Tecnologias Emergentes</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"gear\"></span>\n            <div>\n              <h3>Fundamentos da Inteligência Artificial</h3>\n              <p>Fluência Digital</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"factory\"></span>\n            <div>\n              <h3>Desenvolvimento a Indústria 4.0</h3>\n              <p>Inovação Industrial</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"globe\"></span>\n            <div>\n              <h3>Cidadania Digital e Uso Consciente da Internet</h3>\n              <p>Ética Digital</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"leaf\"></span>\n            <div>\n              <h3>Desvendando ESG</h3>\n              <p>Sustentabilidade e Governança</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"leaf\"></span>\n            <div>\n              <h3>Desvendando a Descarbonização</h3>\n              <p>Meio Ambiente</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"cycle\"></span>\n            <div>\n              <h3>Geração de Valor Circular e Modelos de Negócios</h3>\n              <p>Negócios</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"scroll\"></span>\n            <div>\n              <h3>Fundamentos da Gestão de Projetos Aplicados</h3>\n              <p>Gestão e Indústria</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"palette\"></span>\n            <div>\n              <h3>Design Thinking</h3>\n              <p>Metodologias Ágeis</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"bulb\"></span>\n            <div>\n              <h3>Empreender SENAI</h3>\n              <p>Empreendedorismo</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"hourglass\"></span>\n            <div>\n              <h3>Gestão do Tempo</h3>\n              <p>Soft Skills</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"helmet\"></span>\n            <div>\n              <h3>Segurança no Trabalho</h3>\n              <p>Competência Transversal</p>\n              \n            </div>\n          </article>\n          <article class=\"mini-card px\" data-reveal>\n            <span class=\"pxi\" data-px=\"check\"></span>\n            <div>\n              <h3>Compliance: Prevenir, Identificar e Corrigir</h3>\n              <p>Modo de Agir</p>\n              \n            </div>\n          </article>\n          </div>\n        </div>\n      </section>\n\n      <div class=\"container page-nav\">\n        <a href=\"./index.html\" class=\"btn\"><span class=\"pxi\" data-px=\"arrowup\" style=\"transform:rotate(-90deg)\"></span>Página inicial</a>\n        <a href=\"./index.html#certificados\" class=\"btn btn-ghost\"><span class=\"pxi\" data-px=\"scroll\"></span>Todos os certificados</a>\n      </div>\n    </main>","sebrae":"<main id=\"main\">\n      <section class=\"page-header\">\n        <div class=\"container\">\n          <p class=\"crumbs\" data-reveal><a href=\"./index.html\">home</a> / <a href=\"./index.html#certificados\">certificados</a> / <span>sebrae</span></p>\n          <img class=\"inst-logo\" src=\"./images/cursos/sebrae.jpg\" alt=\"Logo SEBRAE\" />\n          <h1 data-reveal style=\"--d: 1\">Cursos <span>SEBRAE</span></h1>\n          <p data-reveal style=\"--d: 2\">Trilha Vitrine Sebrae — desenvolvimento pessoal, atitude empreendedora e criatividade.</p>\n        </div>\n      </section>\n\n      <section class=\"page-section\">\n        <div class=\"container\">\n          <div class=\"certificate-grid\">\n            <article class=\"cert px\" data-reveal data-tilt>\n              <div class=\"cert-thumb\"><img src=\"./images/thumbs/sebrae-vai-la-e-faz.jpg\" alt=\"Miniatura do certificado Vai Lá e Faz\" width=\"560\" height=\"396\" loading=\"lazy\" decoding=\"async\" /></div>\n              <div class=\"cert-info\">\n                <h3>Vai Lá e Faz</h3>\n                <p>Vitrine Sebrae</p>\n                <div class=\"cert-actions\"><a href=\"./certificados/Vitrine%20Sebrae/Vai%20L%C3%A1%20e%20Faz.pdf\" class=\"link-px\" target=\"_blank\" rel=\"noopener noreferrer\">Ver original ↗</a><a href=\"./certificados/Vitrine%20Sebrae/Vai%20L%C3%A1%20e%20Faz.pdf\" class=\"link-px\" download=\"Vai Lá e Faz.pdf\">Baixar ↓</a></div>\n              </div>\n              <span class=\"glare\" aria-hidden=\"true\"></span>\n            </article>\n            <article class=\"cert px\" data-reveal data-tilt>\n              <div class=\"cert-thumb\"><img src=\"./images/thumbs/sebrae-cheio-de-atitude.jpg\" alt=\"Miniatura do certificado Cheio de Atitude\" width=\"560\" height=\"396\" loading=\"lazy\" decoding=\"async\" /></div>\n              <div class=\"cert-info\">\n                <h3>Cheio de Atitude</h3>\n                <p>Vitrine Sebrae</p>\n                <div class=\"cert-actions\"><a href=\"./certificados/Vitrine%20Sebrae/Cheio%20de%20Atitude.pdf\" class=\"link-px\" target=\"_blank\" rel=\"noopener noreferrer\">Ver original ↗</a><a href=\"./certificados/Vitrine%20Sebrae/Cheio%20de%20Atitude.pdf\" class=\"link-px\" download=\"Cheio de Atitude.pdf\">Baixar ↓</a></div>\n              </div>\n              <span class=\"glare\" aria-hidden=\"true\"></span>\n            </article>\n            <article class=\"cert px\" data-reveal data-tilt>\n              <div class=\"cert-thumb\"><img src=\"./images/thumbs/sebrae-fala-ai.jpg\" alt=\"Miniatura do certificado Fala aí\" width=\"560\" height=\"396\" loading=\"lazy\" decoding=\"async\" /></div>\n              <div class=\"cert-info\">\n                <h3>Fala aí</h3>\n                <p>Vitrine Sebrae</p>\n                <div class=\"cert-actions\"><a href=\"./certificados/Vitrine%20Sebrae/Fala%20a%C3%AD.pdf\" class=\"link-px\" target=\"_blank\" rel=\"noopener noreferrer\">Ver original ↗</a><a href=\"./certificados/Vitrine%20Sebrae/Fala%20a%C3%AD.pdf\" class=\"link-px\" download=\"Fala aí.pdf\">Baixar ↓</a></div>\n              </div>\n              <span class=\"glare\" aria-hidden=\"true\"></span>\n            </article>\n            <article class=\"cert px\" data-reveal data-tilt>\n              <div class=\"cert-thumb\"><img src=\"./images/thumbs/sebrae-meu-sucesso.jpg\" alt=\"Miniatura do certificado Meu Sucesso\" width=\"560\" height=\"396\" loading=\"lazy\" decoding=\"async\" /></div>\n              <div class=\"cert-info\">\n                <h3>Meu Sucesso</h3>\n                <p>Vitrine Sebrae</p>\n                <div class=\"cert-actions\"><a href=\"./certificados/Vitrine%20Sebrae/Meu%20Sucesso.pdf\" class=\"link-px\" target=\"_blank\" rel=\"noopener noreferrer\">Ver original ↗</a><a href=\"./certificados/Vitrine%20Sebrae/Meu%20Sucesso.pdf\" class=\"link-px\" download=\"Meu Sucesso.pdf\">Baixar ↓</a></div>\n              </div>\n              <span class=\"glare\" aria-hidden=\"true\"></span>\n            </article>\n            <article class=\"cert px\" data-reveal data-tilt>\n              <div class=\"cert-thumb\"><img src=\"./images/thumbs/sebrae-criativos.jpg\" alt=\"Miniatura do certificado Criativos: O que são? Onde vivem? Do que se alimentam?\" width=\"560\" height=\"396\" loading=\"lazy\" decoding=\"async\" /></div>\n              <div class=\"cert-info\">\n                <h3>Criativos: O que são? Onde vivem? Do que se alimentam?</h3>\n                <p>Vitrine Sebrae</p>\n                <div class=\"cert-actions\"><a href=\"./certificados/Vitrine%20Sebrae/Criativos%20O%20que%20s%C3%A3o%20Onde%20vivem%20Do%20que%20se%20alimentam.pdf\" class=\"link-px\" target=\"_blank\" rel=\"noopener noreferrer\">Ver original ↗</a><a href=\"./certificados/Vitrine%20Sebrae/Criativos%20O%20que%20s%C3%A3o%20Onde%20vivem%20Do%20que%20se%20alimentam.pdf\" class=\"link-px\" download=\"Criativos O que são Onde vivem Do que se alimentam.pdf\">Baixar ↓</a></div>\n              </div>\n              <span class=\"glare\" aria-hidden=\"true\"></span>\n            </article>\n            <article class=\"cert px\" data-reveal data-tilt>\n              <div class=\"cert-thumb\"><img src=\"./images/thumbs/sebrae-fui-la-e-fiz.jpg\" alt=\"Miniatura do certificado Fui lá e fiz\" width=\"560\" height=\"396\" loading=\"lazy\" decoding=\"async\" /></div>\n              <div class=\"cert-info\">\n                <h3>Fui lá e fiz</h3>\n                <p>Vitrine Sebrae</p>\n                <div class=\"cert-actions\"><a href=\"./certificados/Vitrine%20Sebrae/Fui%20l%C3%A1%20e%20fiz.pdf\" class=\"link-px\" target=\"_blank\" rel=\"noopener noreferrer\">Ver original ↗</a><a href=\"./certificados/Vitrine%20Sebrae/Fui%20l%C3%A1%20e%20fiz.pdf\" class=\"link-px\" download=\"Fui lá e fiz.pdf\">Baixar ↓</a></div>\n              </div>\n              <span class=\"glare\" aria-hidden=\"true\"></span>\n            </article>\n            <article class=\"cert px\" data-reveal data-tilt>\n              <div class=\"cert-thumb\"><img src=\"./images/thumbs/sebrae-metamorfose.jpg\" alt=\"Miniatura do certificado Essa Metamorfose Ambulante\" width=\"560\" height=\"396\" loading=\"lazy\" decoding=\"async\" /></div>\n              <div class=\"cert-info\">\n                <h3>Essa Metamorfose Ambulante</h3>\n                <p>Vitrine Sebrae</p>\n                <div class=\"cert-actions\"><a href=\"./certificados/Vitrine%20Sebrae/Essa%20Metamorfose%20Ambulante.pdf\" class=\"link-px\" target=\"_blank\" rel=\"noopener noreferrer\">Ver original ↗</a><a href=\"./certificados/Vitrine%20Sebrae/Essa%20Metamorfose%20Ambulante.pdf\" class=\"link-px\" download=\"Essa Metamorfose Ambulante.pdf\">Baixar ↓</a></div>\n              </div>\n              <span class=\"glare\" aria-hidden=\"true\"></span>\n            </article>\n          </div>\n        </div>\n      </section>\n\n      <div class=\"container page-nav\">\n        <a href=\"./index.html\" class=\"btn\"><span class=\"pxi\" data-px=\"arrowup\" style=\"transform:rotate(-90deg)\"></span>Página inicial</a>\n        <a href=\"./index.html#certificados\" class=\"btn btn-ghost\"><span class=\"pxi\" data-px=\"scroll\"></span>Todos os certificados</a>\n      </div>\n    </main>","sesi":"<main id=\"main\">\n      <section class=\"page-header\">\n        <div class=\"container\">\n          <p class=\"crumbs\" data-reveal><a href=\"./index.html\">home</a> / <a href=\"./index.html#certificados\">certificados</a> / <span>sesi</span></p>\n          <img class=\"inst-logo\" src=\"./images/cursos/sesi.jpg\" alt=\"Logo SESI\" />\n          <h1 data-reveal style=\"--d: 1\">Certificados <span>SESI</span></h1>\n          <p data-reveal style=\"--d: 2\">Participações e conquistas alcançadas na instituição SESI.</p>\n        </div>\n      </section>\n\n      <section class=\"page-section\">\n        <div class=\"container\">\n          <div class=\"certificate-grid\">\n            <article class=\"cert px\" data-reveal data-tilt>\n              <div class=\"cert-thumb\"><img src=\"./images/thumbs/sesi-selibi-2025.jpg\" alt=\"Miniatura do certificado Participação Selibi 2025\" width=\"560\" height=\"401\" loading=\"lazy\" decoding=\"async\" /></div>\n              <div class=\"cert-info\">\n                <h3>Participação Selibi 2025</h3>\n                <p>Evento / Competição</p>\n                <div class=\"cert-actions\"><a href=\"./certificados/Sesi/Selibi2025.jpg\" class=\"link-px\" target=\"_blank\" rel=\"noopener noreferrer\">Ver original ↗</a><a href=\"./certificados/Sesi/Selibi2025.jpg\" class=\"link-px\" download=\"Selibi2025.jpg\">Baixar ↓</a></div>\n              </div>\n              <span class=\"glare\" aria-hidden=\"true\"></span>\n            </article>\n            <article class=\"cert px\" data-reveal data-tilt>\n              <div class=\"cert-thumb\"><img src=\"./images/thumbs/sesi-canguru-2025.jpg\" alt=\"Miniatura do certificado Canguru de Matemática 2025\" width=\"560\" height=\"301\" loading=\"lazy\" decoding=\"async\" /></div>\n              <div class=\"cert-info\">\n                <h3>Canguru de Matemática 2025</h3>\n                <p>Olimpíada / Participação</p>\n                <div class=\"cert-actions\"><a href=\"./certificados/Sesi/Canguru%202025.png\" class=\"link-px\" target=\"_blank\" rel=\"noopener noreferrer\">Ver original ↗</a><a href=\"./certificados/Sesi/Canguru%202025.png\" class=\"link-px\" download=\"Canguru 2025.png\">Baixar ↓</a></div>\n              </div>\n              <span class=\"glare\" aria-hidden=\"true\"></span>\n            </article>\n          </div>\n        </div>\n      </section>\n\n      <div class=\"container page-nav\">\n        <a href=\"./index.html\" class=\"btn\"><span class=\"pxi\" data-px=\"arrowup\" style=\"transform:rotate(-90deg)\"></span>Página inicial</a>\n        <a href=\"./index.html#certificados\" class=\"btn btn-ghost\"><span class=\"pxi\" data-px=\"scroll\"></span>Todos os certificados</a>\n      </div>\n    </main>","fundacaoBradesco":"<main id=\"main\">\n      <section class=\"page-header\">\n        <div class=\"container\">\n          <p class=\"crumbs\" data-reveal><a href=\"./index.html\">home</a> / <a href=\"./index.html#certificados\">certificados</a> / <span>fundação bradesco</span></p>\n          <img class=\"inst-logo\" src=\"./images/cursos/fundacaoBradesco.jpg\" alt=\"Logo Fundação Bradesco\" />\n          <h1 data-reveal style=\"--d: 1\">Fundação <span>Bradesco</span></h1>\n          <p data-reveal style=\"--d: 2\">Cursos de qualificação e aperfeiçoamento profissional.</p>\n        </div>\n      </section>\n\n      <section class=\"page-section\">\n        <div class=\"container\">\n          <div class=\"certificate-grid\">\n            <article class=\"cert px\" data-reveal data-tilt>\n              <div class=\"cert-thumb\"><img src=\"./images/thumbs/bradesco-educacao-financeira.jpg\" alt=\"Miniatura do certificado Educação Financeira\" width=\"560\" height=\"433\" loading=\"lazy\" decoding=\"async\" /></div>\n              <div class=\"cert-info\">\n                <h3>Educação Financeira</h3>\n                <p>Fundação Bradesco</p>\n                <div class=\"cert-actions\"><a href=\"./certificados/Funda%C3%A7%C3%A3o%20Bradesco/Certificado_Educa%C3%A7%C3%A3o_Financeira.pdf\" class=\"link-px\" target=\"_blank\" rel=\"noopener noreferrer\">Ver original ↗</a><a href=\"./certificados/Funda%C3%A7%C3%A3o%20Bradesco/Certificado_Educa%C3%A7%C3%A3o_Financeira.pdf\" class=\"link-px\" download=\"Certificado_Educação_Financeira.pdf\">Baixar ↓</a></div>\n              </div>\n              <span class=\"glare\" aria-hidden=\"true\"></span>\n            </article>\n          </div>\n        </div>\n      </section>\n\n      <div class=\"container page-nav\">\n        <a href=\"./index.html\" class=\"btn\"><span class=\"pxi\" data-px=\"arrowup\" style=\"transform:rotate(-90deg)\"></span>Página inicial</a>\n        <a href=\"./index.html#certificados\" class=\"btn btn-ghost\"><span class=\"pxi\" data-px=\"scroll\"></span>Todos os certificados</a>\n      </div>\n    </main>","outrosCursos":"<main id=\"main\">\n      <section class=\"page-header\">\n        <div class=\"container\">\n          <p class=\"crumbs\" data-reveal><a href=\"./index.html\">home</a> / <a href=\"./index.html#certificados\">certificados</a> / <span>extras</span></p>\n          \n          <h1 data-reveal style=\"--d: 1\">Certificados <span>Extras</span></h1>\n          <p data-reveal style=\"--d: 2\">Confira meus cursos complementares e certificados, que ampliam meus conhecimentos e habilidades em tecnologia.</p>\n        </div>\n      </section>\n\n      <section class=\"page-section\">\n        <div class=\"container\">\n          <div class=\"certificate-grid\">\n            <article class=\"cert px\" data-reveal data-tilt>\n              <div class=\"cert-thumb\"><img src=\"./images/thumbs/extras-conecta.jpg\" alt=\"Miniatura do certificado Conecta — Comunicação &amp; Multimídia\" width=\"560\" height=\"394\" loading=\"lazy\" decoding=\"async\" /></div>\n              <div class=\"cert-info\">\n                <h3>Conecta — Comunicação &amp; Multimídia</h3>\n                <p>Curso realizado na Igreja</p>\n                <div class=\"cert-actions\"><a href=\"./certificados/Extras/ConectaMidia.jpg\" class=\"link-px\" target=\"_blank\" rel=\"noopener noreferrer\">Ver original ↗</a><a href=\"./certificados/Extras/ConectaMidia.jpg\" class=\"link-px\" download=\"Conecta-Comunicação&amp;Multimídia.jpg\">Baixar ↓</a></div>\n              </div>\n              <span class=\"glare\" aria-hidden=\"true\"></span>\n            </article>\n            <article class=\"cert px\" data-reveal data-tilt>\n              <div class=\"cert-thumb\"><img src=\"./images/thumbs/extras-gemini.jpg\" alt=\"Miniatura do certificado Gemini Academy para Universitários 2026\" width=\"560\" height=\"396\" loading=\"lazy\" decoding=\"async\" /></div>\n              <div class=\"cert-info\">\n                <h3>Gemini Academy para Universitários 2026</h3>\n                <p>Funcionalidades do Google Gemini</p>\n                <div class=\"cert-actions\"><a href=\"./certificados/Extras/GeminiAcademy.jpg\" class=\"link-px\" target=\"_blank\" rel=\"noopener noreferrer\">Ver original ↗</a><a href=\"./certificados/Extras/GeminiAcademy.jpg\" class=\"link-px\" download=\"Gemini Academy para Universitários 2026.jpg\">Baixar ↓</a></div>\n              </div>\n              <span class=\"glare\" aria-hidden=\"true\"></span>\n            </article>\n          </div>\n        </div>\n      </section>\n\n      <div class=\"container page-nav\">\n        <a href=\"./index.html\" class=\"btn\"><span class=\"pxi\" data-px=\"arrowup\" style=\"transform:rotate(-90deg)\"></span>Página inicial</a>\n        <a href=\"./index.html#certificados\" class=\"btn btn-ghost\"><span class=\"pxi\" data-px=\"scroll\"></span>Todos os certificados</a>\n      </div>\n    </main>"};
  function showCertificateCategory(name) {
    if (!certOverview || !certDetail || !certContent || !certPages[name]) return;
    certContent.innerHTML = certPages[name];
    certOverview.hidden = true;
    certDetail.hidden = false;
    hydrate();
    certContent.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-revealed','settled'));
    certContent.querySelectorAll('[data-tilt]').forEach(el => {
      if (finePointer && !reduced) el.addEventListener('pointermove', (e) => {
        const r=el.getBoundingClientRect(), px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
        el.style.setProperty('--ry', ((px-.5)*12).toFixed(2)+'deg');
        el.style.setProperty('--rx', ((.5-py)*12).toFixed(2)+'deg');
      });
      el.addEventListener('pointerleave',()=>{el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg');});
    });
    history.replaceState(null,'','#certificados-'+name);
    $('#certificados').scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
  }
  function showCertificateOverview() {
    if (!certOverview || !certDetail) return;
    certDetail.hidden = true; certOverview.hidden = false;
    history.replaceState(null,'','#certificados');
    $('#certificados').scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
  }
  if (certOverview && certDetail) {
    certOverview.addEventListener('click',e=>{
      const card=e.target.closest('[data-cert-category]');
      if(!card)return;
      e.preventDefault(); showCertificateCategory(card.dataset.certCategory);
    });
    certBack?.addEventListener('click',showCertificateOverview);
    const route=location.hash.match(/^#certificados-(.+)$/);
    if(route) showCertificateCategory(route[1]);
  }

})();