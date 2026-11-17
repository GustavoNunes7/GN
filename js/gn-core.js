/* ==========================================================================
   GN · NÚCLEO (todas as páginas)
   - Central de configurações (engrenagem na navbar): tema, sons, música,
     efeitos, volumes, modo imersivo e tela de inicialização.
   - Motor de áudio (Web Audio API, sem arquivos): trilha 8-bit/lo-fi e
     efeitos curtos. Nada toca antes da primeira interação do visitante e
     nenhum som é emitido durante a rolagem.
   - Persistência em localStorage ("gn-game-settings").
   API pública: window.GNSettings { get, set, sfx, subscribe }
   ========================================================================== */
(() => {
  'use strict';

  const KEY = 'gn-game-settings';
  const doc = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);

  /* ---------- Estado + persistência ---------- */
  const DEFAULTS = { theme: 'dark', sound: true, music: true, effects: true, musicVol: 45, sfxVol: 70, immersive: false, boot: true };
  const clampVol = (v, d) => (Number.isFinite(+v) ? Math.max(0, Math.min(100, Math.round(+v))) : d);
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch { saved = {}; }
  const state = {
    theme: saved.theme === 'light' ? 'light' : 'dark',
    sound: true,
    music: true,
    effects: false,
    musicVol: clampVol(saved.musicVol ?? saved.volume, DEFAULTS.musicVol), // "volume" = chave antiga
    sfxVol: clampVol(saved.sfxVol, DEFAULTS.sfxVol),
    immersive: saved.immersive === true,
    boot: saved.boot !== false,
  };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* sem storage */ } };
  // Preferência inicial do portfólio: trilha ligada, efeitos sonoros desligados.
  save();
  const listeners = new Set();
  const emit = (k) => listeners.forEach((fn) => { try { fn(k, state[k], state); } catch { /* ignora */ } });

  /* ==========================================================================
     MOTOR DE ÁUDIO
     ========================================================================== */
  const Audio = (() => {
    const AC = window.AudioContext || window.webkitAudioContext;
    let ctx = null, master = null, musicBus = null, sfxBus = null, lowpass = null, noise = null;
    let timer = 0, nextT = 0, stepN = 0, running = false, unlocked = false, lastSfx = 0;

    const BPM = 84, STEP = 60 / BPM / 2; // colcheias
    const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
    // Lá menor: Am – F – C – G
    const CH = [
      { bass: 45, arp: [57, 60, 64, 67], pad: [57, 60, 64] },
      { bass: 41, arp: [53, 57, 60, 64], pad: [53, 57, 60] },
      { bass: 48, arp: [55, 60, 64, 67], pad: [55, 60, 64] },
      { bass: 43, arp: [55, 59, 62, 67], pad: [55, 59, 62] },
    ];
    const ARP = [0, 1, 2, 3, 2, 1, 2, 3];
    const LEAD = [69, 72, 74, 76, 79, 76, 72];

    function build() {
      if (ctx || !AC) return !!ctx;
      try {
        ctx = new AC();
        const comp = ctx.createDynamicsCompressor();
        master = ctx.createGain();
        musicBus = ctx.createGain();
        sfxBus = ctx.createGain();
        lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass'; lowpass.frequency.value = 2300; lowpass.Q.value = 0.4;
        lowpass.connect(musicBus);
        musicBus.connect(master); sfxBus.connect(master);
        master.connect(comp); comp.connect(ctx.destination);
        const len = ctx.sampleRate;
        noise = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = noise.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        applyGains(true);
        return true;
      } catch { ctx = null; return false; }
    }

    function applyGains(instant) {
      if (!ctx) return;
      const t = ctx.currentTime, r = instant ? 0 : 0.08;
      const set = (param, v) => { param.cancelScheduledValues(t); param.setTargetAtTime(v, t, r || 0.001); };
      set(master.gain, state.sound ? 0.9 : 0);
      set(musicBus.gain, state.music ? (state.musicVol / 100) * 0.85 : 0);
      set(sfxBus.gain, state.effects ? (state.sfxVol / 100) * 1.1 : 0);
    }

    function env(g, t, a, peak, d) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(peak, t + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    }
    function osc(type, f, t, a, d, peak, dest, slideTo) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + a + d);
      env(g, t, a, peak, d);
      o.connect(g); g.connect(dest);
      o.start(t); o.stop(t + a + d + 0.05);
    }
    function hit(t, dur, peak, type, freq, q) {
      const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = noise; f.type = type; f.frequency.value = freq; f.Q.value = q || 0.7;
      env(g, t, 0.002, peak, dur);
      s.connect(f); f.connect(g); g.connect(musicBus);
      s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
    }

    function scheduleStep(n, t) {
      const bar = Math.floor(n / 8), s = n % 8, ch = CH[bar % 4];
      // arpejo 8-bit (quadrada suave)
      if (!(s % 2 === 1 && Math.random() < 0.2)) osc('square', mtof(ch.arp[ARP[s]]), t, 0.004, 0.2, 0.03, lowpass);
      // baixo
      if (s === 0 || s === 3 || s === 6) osc('triangle', mtof(ch.bass), t, 0.01, s === 0 ? 0.55 : 0.28, 0.13, musicBus);
      // pad
      if (s === 0) ch.pad.forEach((m) => osc('sine', mtof(m - 12), t, 0.5, STEP * 7, 0.022, lowpass));
      // bateria lo-fi
      if (s === 0 || s === 4) osc('sine', 140, t, 0.002, 0.16, 0.2, musicBus, 45);
      if (s === 2 || s === 6) hit(t, 0.12, 0.05, 'bandpass', 1800, 0.8);
      if (s % 2 === 1) hit(t, 0.03, 0.018, 'highpass', 7000, 0.7);
      // melodia esparsa
      if (s % 2 === 0 && bar % 2 === 1 && Math.random() < 0.45) {
        osc('triangle', mtof(LEAD[Math.floor(Math.random() * LEAD.length)]), t, 0.01, 0.45, 0.05, lowpass);
      }
    }
    function pump() {
      if (!ctx || ctx.state !== 'running') return;
      while (nextT < ctx.currentTime + 0.4) { scheduleStep(stepN, nextT); nextT += STEP; stepN++; }
    }

    function startMusic() {
      if (running || !ctx || ctx.state !== 'running') return;
      running = true; nextT = ctx.currentTime + 0.1; stepN = 0;
      timer = setInterval(pump, 120); pump();
    }
    function stopMusic() { running = false; clearInterval(timer); timer = 0; }

    /** Liga/desliga a trilha conforme as preferências. */
    function sync() {
      const want = unlocked && state.sound && state.music;
      if (want) startMusic(); else stopMusic();
      applyGains();
    }

    /** Deve ser chamado de dentro de um gesto do usuário (clique, toque, tecla). */
    function unlock() {
      if (!build()) return Promise.resolve(false);
      if (ctx.state === 'running') { unlocked = true; sync(); return Promise.resolve(true); }
      return ctx.resume().then(() => { unlocked = ctx.state === 'running'; sync(); return unlocked; }).catch(() => false);
    }

    const SFX = {
      click: (t) => osc('square', 680, t, 0.003, 0.05, 0.05, sfxBus, 480),
      nav: (t) => { osc('triangle', 520, t, 0.003, 0.07, 0.07, sfxBus); osc('triangle', 780, t + 0.05, 0.003, 0.09, 0.06, sfxBus); },
      open: (t) => { osc('square', 440, t, 0.003, 0.08, 0.04, sfxBus); osc('square', 660, t + 0.07, 0.003, 0.12, 0.04, sfxBus); },
      close: (t) => { osc('square', 660, t, 0.003, 0.08, 0.04, sfxBus); osc('square', 440, t + 0.07, 0.003, 0.12, 0.04, sfxBus); },
      on: (t) => osc('square', 880, t, 0.003, 0.09, 0.045, sfxBus, 1175),
      off: (t) => osc('square', 520, t, 0.003, 0.1, 0.045, sfxBus, 330),
      special: (t) => [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => osc('square', f, t + i * 0.05, 0.003, 0.1, 0.04, sfxBus)),
      coin: (t) => { osc('square', 987.77, t, 0.002, 0.07, 0.05, sfxBus); osc('square', 1318.5, t + 0.07, 0.002, 0.28, 0.05, sfxBus); },
      unlock: (t) => [523.25, 659.25, 783.99, 659.25, 783.99, 1046.5].forEach((f, i) => osc('triangle', f, t + i * 0.08, 0.004, 0.16, 0.08, sfxBus)),
      key: (t) => osc('square', 1200, t, 0.002, 0.025, 0.025, sfxBus),
    };
    function sfx(name) {
      if (!state.sound || !state.effects || !SFX[name]) return;
      const now = performance.now();
      if (now - lastSfx < 45) return;
      lastSfx = now;
      unlock().then((ok) => { if (ok && ctx) SFX[name](ctx.currentTime + 0.005); });
    }

    // Libera o áudio na primeira interação "normal" (política dos navegadores).
    const gestures = ['pointerdown', 'pointerup', 'click', 'keydown', 'touchstart', 'touchend'];
    const onGesture = () => {
      unlock().then((ok) => { if (ok) gestures.forEach((g) => document.removeEventListener(g, onGesture, true)); });
    };
    gestures.forEach((g) => document.addEventListener(g, onGesture, true));

    // A trilha não é suspensa ao alternar para uma aba de certificados.
    // A aba original permanece como anfitriã do áudio durante a navegação.
    document.addEventListener('visibilitychange', () => {
      if (!ctx || document.hidden) return;
      if (ctx.state !== 'running') ctx.resume().then(sync).catch(() => {});
    });

    return { sfx, sync, applyGains, unlock };
  })();

  /* ==========================================================================
     TEMA · MODO IMERSIVO
     ========================================================================== */
  function applyTheme() {
    if (state.theme === 'light') doc.setAttribute('data-theme', 'light'); else doc.removeAttribute('data-theme');
    const m = $('meta[name="theme-color"]');
    if (m) m.setAttribute('content', state.theme === 'light' ? '#f1f5f9' : '#05070B');
  }
  function applyImmersive() {
    if (state.immersive) doc.setAttribute('data-immersive', 'on'); else doc.removeAttribute('data-immersive');
    const b = $('#immersiveExit');
    if (b) b.hidden = !state.immersive;
  }

  /* ==========================================================================
     PAINEL DE CONFIGURAÇÕES
     ========================================================================== */
  const root = $('#gameSettings');
  const trigger = $('#settingsTrigger');
  let panel = null;
  const isHome = document.body.dataset.page === 'home';

  function buildPanel() {
    panel = document.createElement('div');
    panel.className = 'settings-panel';
    panel.id = 'settingsPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Configurações do portfólio');
    panel.hidden = true;
    panel.innerHTML = `
      <div class="settings-heading"><span>CONFIGURAÇÕES</span><button type="button" class="settings-close" id="settingsClose" aria-label="Fechar configurações">×</button></div>
      <div class="settings-row"><div><strong>Tema</strong><small>Claro ou escuro</small></div><button class="settings-option" id="themeToggle" type="button"></button></div>
      <div class="settings-row"><div><strong>Sons</strong><small>Desliga tudo de uma vez</small></div><button class="settings-switch" id="soundToggle" type="button" role="switch"></button></div>
      <div class="settings-row settings-row-col">
        <div class="settings-line"><div><strong>Música</strong><small>Trilha 8-bit / lo-fi</small></div><button class="settings-switch" id="musicToggle" type="button" role="switch"></button></div>
        <label class="settings-volume"><span>VOLUME DA MÚSICA <output id="musicVolOut"></output></span><input id="musicVolume" type="range" min="0" max="100" step="1" /></label>
      </div>
      <div class="settings-row settings-row-col">
        <div class="settings-line"><div><strong>Efeitos sonoros</strong><small>Cliques e navegação</small></div><button class="settings-switch" id="effectsToggle" type="button" role="switch"></button></div>
        <label class="settings-volume"><span>VOLUME DOS EFEITOS <output id="sfxVolOut"></output></span><input id="sfxVolume" type="range" min="0" max="100" step="1" /></label>
      </div>
      <div class="settings-row"><div><strong>Modo imersivo</strong><small>Interface mais limpa</small></div><button class="settings-switch" id="immersiveToggle" type="button" role="switch"></button></div>
      ${isHome ? '<div class="settings-row"><div><strong>Tela de inicialização</strong><small>Animação rápida ao abrir</small></div><button class="settings-switch" id="bootToggle" type="button" role="switch"></button></div>' : ''}
      <p class="settings-hint">O áudio só começa depois da sua primeira interação com a página. Esc fecha este painel.</p>`;
    root.append(panel);
    if (window.GNPixel) window.GNPixel.hydrateIcons(document);
  }

  function setSwitch(el, on) {
    if (!el) return;
    el.setAttribute('aria-checked', String(on));
    el.textContent = on ? '♫' : '♪';
    el.setAttribute('aria-label', on ? 'Ativado' : 'Desativado');
    el.classList.toggle('is-on', on);
  }
  function renderPanel() {
    const q = (id) => $('#' + id, panel);
    const th = q('themeToggle');
    th.textContent = state.theme === 'light' ? 'CLARO' : 'ESCURO';
    th.setAttribute('aria-label', `Tema atual: ${state.theme === 'light' ? 'claro' : 'escuro'}. Alternar.`);
    setSwitch(q('soundToggle'), state.sound);
    setSwitch(q('musicToggle'), state.music);
    setSwitch(q('effectsToggle'), state.effects);
    setSwitch(q('immersiveToggle'), state.immersive);
    setSwitch(q('bootToggle'), state.boot);
    q('musicVolume').value = state.musicVol; q('musicVolOut').textContent = state.musicVol + '%';
    q('sfxVolume').value = state.sfxVol; q('sfxVolOut').textContent = state.sfxVol + '%';
    ['musicToggle', 'effectsToggle', 'musicVolume', 'sfxVolume'].forEach((id) => { q(id).disabled = !state.sound; });
    q('musicVolume').disabled = !state.sound || !state.music;
    q('sfxVolume').disabled = !state.sound || !state.effects;
    panel.classList.toggle('is-muted', !state.sound);
  }

  function set(key, val) {
    if (!(key in state) || state[key] === val) return;
    state[key] = val;
    save();
    if (key === 'theme') applyTheme();
    if (key === 'immersive') applyImmersive();
    if (['sound', 'music', 'musicVol', 'sfxVol', 'effects'].includes(key)) Audio.sync();
    if (panel) renderPanel();
    emit(key);
  }

  function openPanel(open) {
    if (!panel) return;
    if (open !== panel.hidden) return;
    panel.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? 'Fechar configurações' : 'Abrir configurações');
    if (open) {
      // fecha o menu mobile, se aberto
      const burger = $('.hamburger-btn.active'); if (burger) burger.click();
    }
    Audio.sfx(open ? 'open' : 'close');
  }

  function wirePanel() {
    const q = (id) => $('#' + id, panel);
    trigger.addEventListener('click', () => openPanel(panel.hidden));
    q('settingsClose').addEventListener('click', () => { openPanel(false); trigger.focus(); });
    q('themeToggle').addEventListener('click', () => { set('theme', state.theme === 'light' ? 'dark' : 'light'); Audio.sfx('on'); });
    const sw = (id, key) => q(id)?.addEventListener('click', () => {
      const next = !state[key];
      set(key, next);
      if (key === 'sound' && next) Audio.unlock().then(() => Audio.sfx('on'));
      else if (next) Audio.sfx('on'); else if (key !== 'sound' && key !== 'effects') Audio.sfx('off');
      if (key === 'effects' && !next) { /* silencioso ao desligar */ }
    });
    sw('soundToggle', 'sound'); sw('musicToggle', 'music'); sw('effectsToggle', 'effects');
    sw('immersiveToggle', 'immersive'); sw('bootToggle', 'boot');
    q('musicVolume').addEventListener('input', (e) => set('musicVol', clampVol(e.target.value, state.musicVol)));
    q('sfxVolume').addEventListener('input', (e) => set('sfxVol', clampVol(e.target.value, state.sfxVol)));
    q('sfxVolume').addEventListener('change', () => Audio.sfx('click'));

    // fecha ao clicar/tocar fora
    document.addEventListener('pointerdown', (e) => {
      if (!panel.hidden && !root.contains(e.target)) openPanel(false);
    });
  }

  /* ---------- Esc: fecha painel → sai do modo imersivo ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (panel && !panel.hidden) { openPanel(false); trigger.focus(); return; }
    if (state.immersive && !$('.nav-menu.active')) { set('immersive', false); Audio.sfx('close'); }
  });

  /* ---------- Botão de saída do modo imersivo ---------- */
  function buildImmersiveExit() {
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'immersiveExit'; b.className = 'immersive-exit'; b.hidden = !state.immersive;
    b.innerHTML = '<span aria-hidden="true">✕</span> SAIR DO MODO IMERSIVO <kbd>Esc</kbd>';
    b.addEventListener('click', () => set('immersive', false));
    document.body.append(b);
  }

  /* ---------- Sons de interface (cliques), nunca na rolagem ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('a[href], button, [data-sfx]');
    if (!t || t.closest('#settingsPanel') || t.id === 'settingsTrigger' || t.id === 'immersiveExit' || t.matches('.term-send')) return;
    const forced = t.closest('[data-sfx]');
    if (forced) { if (forced.dataset.sfx !== 'none') Audio.sfx(forced.dataset.sfx); return; }
    if (t.matches('.hamburger-btn')) { setTimeout(() => Audio.sfx(t.getAttribute('aria-expanded') === 'true' ? 'open' : 'close'), 0); return; }
    if (t.matches('.nav-link, .nav-icon-btn, .logo, .scroll-cue, .page-nav a')) { Audio.sfx('nav'); return; }
    if (t.matches('.copy-btn')) { Audio.sfx('special'); return; }
    Audio.sfx('click');
  }, true);

  /* ---------- Inicialização ---------- */
  applyTheme();
  applyImmersive();
  if (root && trigger) { buildPanel(); renderPanel(); wirePanel(); }
  buildImmersiveExit();

  window.GNSettings = {
    get: (k) => (k ? state[k] : { ...state }),
    set,
    sfx: Audio.sfx,
    subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
  };
})();
