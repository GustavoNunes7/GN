/* ==========================================================================
   GN · HERO 3D
   Cena voxel "GN_DEV_ROOM": uma ilha flutuante com um computador, o
   personagem pixelado do desenvolvedor, cubos com as tecnologias orbitando,
   partículas e um chão em grade.

   Truque de estilo: a cena é renderizada em baixa resolução (1/2 ou 1/3 do
   tamanho do canvas) e ampliada com `image-rendering: pixelated`. Isso dá o
   visual de pixel art real e ainda poupa GPU.
   ========================================================================== */
import * as THREE from 'three';
import { DEV_SPRITE, SPRITE_COLORS, ScreenTyper, PALETTE } from './pixel-art.js';

const col = (hex) => new THREE.Color(hex);
const easeOutBack = (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** WebGL realmente disponível? */
export function webglOk() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{reduced:boolean, mobile:boolean, onFail:()=>void}} opts
 */
export async function init(canvas, opts) {
  const { reduced = false, mobile = false, onFail = () => {} } = opts;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(col(PALETTE.bg), 16, 34);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
  camera.position.set(7.4, 5.6, 12.5);
  camera.lookAt(0.6, 1.4, 0);

  /* ---------------- luzes ---------------- */
  scene.add(new THREE.AmbientLight(0x8aa4d6, 1.35));
  const sun = new THREE.DirectionalLight(0xffffff, 2.1);
  sun.position.set(6, 10, 8);
  scene.add(sun);
  const glowBlue = new THREE.PointLight(0x1565c0, 60, 16, 2);
  glowBlue.position.set(-4, 3, 4);
  scene.add(glowBlue);
  const glowGreen = new THREE.PointLight(0x27ae60, 40, 14, 2);
  glowGreen.position.set(4.5, 1.5, 3.5);
  scene.add(glowGreen);

  const world = new THREE.Group();
  scene.add(world);

  const lambert = (hex, extra = {}) => new THREE.MeshLambertMaterial({ color: col(hex), ...extra });
  const unit = new THREE.BoxGeometry(1, 1, 1);
  const box = (w, h, d, hex, x = 0, y = 0, z = 0, parent = world) => {
    const m = new THREE.Mesh(unit, lambert(hex));
    m.scale.set(w, h, d);
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };

  /* ---------------- ilha flutuante ---------------- */
  const island = new THREE.Group();
  world.add(island);
  box(8, 0.5, 5.6, PALETTE.blueDark, 0, -0.25, 0, island);
  box(6.6, 0.5, 4.4, '#0c2a52', 0, -0.75, 0, island);
  box(5, 0.5, 3.2, PALETTE.greenDark, 0, -1.25, 0, island);
  box(3.2, 0.5, 2.2, PALETTE.blueDark, 0, -1.75, 0, island);
  box(1.6, 0.5, 1.2, '#0c2a52', 0, -2.25, 0, island);
  box(8.1, 0.12, 5.7, PALETTE.green, 0, 0.03, 0, island).scale.y = 0.12;

  // piso em "tiles"
  const tiles = new THREE.InstancedMesh(unit, lambert('#ffffff'), 8 * 5);
  const m4 = new THREE.Matrix4();
  let ti = 0;
  for (let ix = 0; ix < 8; ix++) {
    for (let iz = 0; iz < 5; iz++) {
      m4.compose(
        new THREE.Vector3(-3.5 + ix, 0.11, -2 + iz + 0.1),
        new THREE.Quaternion(),
        new THREE.Vector3(0.94, 0.1, 0.94),
      );
      tiles.setMatrixAt(ti, m4);
      tiles.setColorAt(ti, col((ix + iz) % 2 ? '#10305e' : '#0b2347'));
      ti++;
    }
  }
  island.add(tiles);

  /* ---------------- mesa + computador ---------------- */
  const desk = new THREE.Group();
  desk.position.set(-1.1, 0.16, -0.5);
  island.add(desk);
  box(3.9, 0.2, 1.7, '#0a1f44', 0, 1.1, 0, desk);
  box(3.9, 0.06, 1.7, PALETTE.green, 0, 1.22, 0, desk).scale.set(3.95, 0.06, 1.75);
  [[-1.8, -0.7], [1.8, -0.7], [-1.8, 0.7], [1.8, 0.7]].forEach(([x, z]) => box(0.2, 1.0, 0.2, '#0a1f44', x, 0.5, z, desk));

  // monitor
  const monitor = new THREE.Group();
  monitor.position.set(-0.2, 1.3, -0.25);
  monitor.rotation.y = 0.2;
  desk.add(monitor);
  box(0.9, 0.08, 0.6, '#0a0e14', 0, 0.04, 0, monitor);
  box(0.18, 0.55, 0.18, '#0a0e14', 0, 0.3, 0, monitor);
  box(2.3, 1.5, 0.14, '#0a0e14', 0, 1.3, 0, monitor);
  box(2.3, 0.05, 0.16, PALETTE.blue, 0, 2.03, 0, monitor);

  const screenCanvas = document.createElement('canvas');
  screenCanvas.width = 160;
  screenCanvas.height = 120;
  const sctx = screenCanvas.getContext('2d');
  const typer = new ScreenTyper(160, 120);
  const screenTex = new THREE.CanvasTexture(screenCanvas);
  screenTex.magFilter = THREE.NearestFilter;
  screenTex.minFilter = THREE.NearestFilter;
  screenTex.generateMipmaps = false;
  screenTex.colorSpace = THREE.SRGBColorSpace;
  typer.draw(sctx, reduced);
  screenTex.needsUpdate = true;
  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.1, 1.3),
    new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }),
  );
  screenMesh.position.set(0, 1.3, 0.08);
  monitor.add(screenMesh);

  // teclado (teclas instanciadas que "piscam" enquanto digita)
  const kb = new THREE.Group();
  kb.position.set(-0.1, 1.24, 0.45);
  kb.rotation.y = 0.15;
  desk.add(kb);
  box(1.7, 0.07, 0.55, '#0f1621', 0, 0.04, 0, kb);
  const KEYS_X = 11;
  const KEYS_Z = 3;
  const keys = new THREE.InstancedMesh(unit, lambert('#ffffff'), KEYS_X * KEYS_Z);
  const keyColors = [col('#1565c0'), col('#4ea8de'), col('#27ae60'), col('#cfe3ff')];
  let k = 0;
  for (let ix = 0; ix < KEYS_X; ix++) {
    for (let iz = 0; iz < KEYS_Z; iz++) {
      m4.compose(
        new THREE.Vector3(-0.72 + ix * 0.144, 0.1, -0.17 + iz * 0.17),
        new THREE.Quaternion(),
        new THREE.Vector3(0.11, 0.06, 0.12),
      );
      keys.setMatrixAt(k, m4);
      keys.setColorAt(k, keyColors[(ix + iz) % 4]);
      k++;
    }
  }
  kb.add(keys);
  box(0.28, 0.06, 0.4, '#0f1621', 1.2, 0.04, 0.05, kb); // mouse

  // torre com LEDs
  const tower = new THREE.Group();
  tower.position.set(1.55, 1.2, -0.2);
  desk.add(tower);
  box(0.6, 1.2, 0.9, '#0f1621', 0, 0.6, 0, tower);
  box(0.62, 0.05, 0.92, PALETTE.blue, 0, 1.2, 0, tower);
  const leds = [0, 1, 2].map((i) => {
    const m = new THREE.Mesh(unit, new THREE.MeshBasicMaterial({ color: col(PALETTE.green) }));
    m.scale.set(0.1, 0.1, 0.05);
    m.position.set(-0.16 + i * 0.16, 0.9, 0.47);
    tower.add(m);
    return m;
  });

  // caneca + vapor (pixels subindo)
  box(0.26, 0.3, 0.26, '#cfe3ff', -1.55, 1.38, 0.5, desk);
  box(0.28, 0.05, 0.28, PALETTE.green, -1.55, 1.55, 0.5, desk);
  const steam = [0, 1, 2].map((i) => {
    const m = new THREE.Mesh(unit, new THREE.MeshBasicMaterial({ color: col('#cfe3ff'), transparent: true, opacity: 0.6 }));
    m.scale.setScalar(0.07);
    desk.add(m);
    return { m, o: i / 3 };
  });

  /* ---------------- personagem em voxels ---------------- */
  const VOX = 0.085;
  const DEPTH = 3;
  const rows = DEV_SPRITE.length;
  const cols = DEV_SPRITE[0].length;
  const cells = [];
  DEV_SPRITE.forEach((row, j) => {
    for (let i = 0; i < cols; i++) {
      const ch = row[i];
      if (ch === '.') continue;
      for (let z = 0; z < DEPTH; z++) {
        cells.push({ i, j, z, ch });
      }
    }
  });
  const hero = new THREE.InstancedMesh(unit, lambert('#ffffff'), cells.length);
  const targets = [];
  const starts = [];
  const tmpColor = new THREE.Color();
  const rnd = (a, b) => a + Math.random() * (b - a);
  cells.forEach((c, n) => {
    const x = (c.i - cols / 2 + 0.5) * VOX;
    const y = (rows - c.j - 0.5) * VOX;
    const z = (c.z - DEPTH / 2 + 0.5) * VOX;
    targets.push(new THREE.Vector3(x, y, z));
    starts.push(new THREE.Vector3(x + rnd(-2.5, 2.5), y + rnd(1, 4), z + rnd(-2.5, 2.5)));
    tmpColor.set(SPRITE_COLORS[c.ch]);
    if (c.z > 0) tmpColor.multiplyScalar(c.z === 2 ? 0.55 : 0.8); // profundidade sombreada
    hero.setColorAt(n, tmpColor);
  });
  hero.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const heroGroup = new THREE.Group();
  heroGroup.position.set(2.75, 0.16, 0.9);
  heroGroup.rotation.y = -0.55;
  heroGroup.add(hero);
  island.add(heroGroup);
  // sombra
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 0.8),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(2.75, 0.2, 0.95);
  island.add(shadow);

  const q = new THREE.Quaternion();
  const sc = new THREE.Vector3(VOX * 0.98, VOX * 0.98, VOX * 0.98);
  const pos = new THREE.Vector3();
  const placeVoxels = (t) => {
    for (let n = 0; n < cells.length; n++) {
      const delay = (n % 37) / 37 * 0.35;
      const p = easeOutCubic(clamp01((t - delay) / 0.9));
      pos.lerpVectors(starts[n], targets[n], p);
      m4.compose(pos, q, sc);
      hero.setMatrixAt(n, m4);
    }
    hero.instanceMatrix.needsUpdate = true;
  };
  placeVoxels(reduced ? 99 : 0);

  /* ---------------- cubos de tecnologia ---------------- */
  const LABELS = ['HTML', 'CSS', 'JS', 'PY', 'JAVA', 'NODE', 'SQL', 'GIT'];
  const labelCount = mobile ? 6 : LABELS.length;
  const mkLabelTex = (text, accent) => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    g.fillStyle = PALETTE.blueDark;
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = accent;
    g.fillRect(0, 0, 64, 5);
    g.fillRect(0, 59, 64, 5);
    g.fillRect(0, 0, 5, 64);
    g.fillRect(59, 0, 5, 64);
    g.fillStyle = PALETTE.text;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const size = text.length > 3 ? 11 : 16;
    g.font = `${size}px "Press Start 2P", monospace`;
    g.fillText(text, 32, 34);
    const t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  try {
    await document.fonts.load('16px "Press Start 2P"');
  } catch {
    /* segue com a fonte de fallback */
  }
  const orbit = new THREE.Group();
  world.add(orbit);
  const cubes = [];
  const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < labelCount; i++) {
    const accent = i % 2 ? PALETTE.green : PALETTE.blue;
    const mat = new THREE.MeshLambertMaterial({ map: mkLabelTex(LABELS[i], accent), emissive: col(accent), emissiveIntensity: 0.12 });
    const m = new THREE.Mesh(cubeGeo, mat);
    const s = 0.62 + (i % 3) * 0.08;
    m.scale.setScalar(s);
    orbit.add(m);
    cubes.push({ m, a: (i / labelCount) * Math.PI * 2, r: 4.5 + (i % 2) * 0.6, y: 1.2 + (i % 4) * 0.85, s });
  }

  /* ---------------- partículas ---------------- */
  const PN = mobile ? 90 : 170;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(PN * 3);
  const pCol = new Float32Array(PN * 3);
  const pSpd = new Float32Array(PN);
  const palette = [col(PALETTE.blueLight), col(PALETTE.green), col('#cfe3ff'), col(PALETTE.blue)];
  for (let i = 0; i < PN; i++) {
    pPos[i * 3] = rnd(-9, 9);
    pPos[i * 3 + 1] = rnd(-3, 7);
    pPos[i * 3 + 2] = rnd(-6, 6);
    pSpd[i] = rnd(0.15, 0.5);
    const c = palette[i % palette.length];
    pCol.set([c.r, c.g, c.b], i * 3);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  const points = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ size: 0.13, vertexColors: true, sizeAttenuation: true, transparent: true, opacity: 0.9 }),
  );
  world.add(points);

  /* ---------------- chão em grade (movimento sutil) ---------------- */
  const grid = new THREE.GridHelper(60, 60, col(PALETTE.blue), col(PALETTE.blueDark));
  grid.position.y = -4.2;
  grid.material.transparent = true;
  grid.material.opacity = 0.55;
  scene.add(grid);

  /* ---------------- tamanho / pixelização ---------------- */
  let pixelScale = 2;
  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    pixelScale = w >= 1000 ? 3 : 2;
    renderer.setSize(Math.max(1, Math.round(w / pixelScale)), Math.max(1, Math.round(h / pixelScale)), false);
    camera.aspect = w / h;
    // em telas estreitas afasta a câmera para caber a cena
    camera.position.set(7.4, 5.6, 12.5);
    // afasta a câmera para a cena caber no palco (mais em telas estreitas)
    const k2 = 1.28 * (camera.aspect < 1 ? 1 + (1 - camera.aspect) * 0.65 : camera.aspect < 1.4 ? 1.08 : 1);
    camera.position.multiplyScalar(k2);
    camera.lookAt(0.3, 0.9, 0);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* ---------------- interação ---------------- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0, last: -99 };
  const onMove = (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    mouse.last = performance.now() / 1000;
  };
  if (!reduced && matchMedia('(pointer:fine)').matches) window.addEventListener('pointermove', onMove, { passive: true });

  /* ---------------- loop ---------------- */
  let last = performance.now();
  let raf = 0;
  let visible = true;
  let running = false;
  let t = 0;
  let intro = 0;
  const introDur = 1.6;

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    stop();
    onFail();
  });

  const frame = () => {
    const nowMs = performance.now();
    const dt = Math.min((nowMs - last) / 1000, 0.05);
    last = nowMs;
    t += dt;
    intro = Math.min(intro + dt, 10);
    const now = performance.now() / 1000;

    // entrada: ilha "pula" para o lugar, pixels do personagem convergem
    const ip = easeOutBack(clamp01(intro / introDur));
    island.scale.setScalar(Math.max(0.001, ip));
    island.position.y = (1 - clamp01(intro / introDur)) * -3;
    if (intro < 3) placeVoxels(intro - 0.2);

    // parallax com o mouse (ou sway automático quando parado/touch)
    const idle = now - mouse.last > 2.5;
    const autoX = Math.sin(t * 0.35) * 0.5;
    const autoY = Math.cos(t * 0.27) * 0.25;
    const tx = idle ? autoX : mouse.tx;
    const ty = idle ? autoY : mouse.ty;
    mouse.x += (tx - mouse.x) * 0.05;
    mouse.y += (ty - mouse.y) * 0.05;
    world.rotation.y = -0.38 + mouse.x * 0.42;
    world.rotation.x = mouse.y * 0.06;
    world.position.y = Math.sin(t * 0.9) * 0.12;
    heroGroup.rotation.y = -0.55 + mouse.x * 0.35;
    heroGroup.position.y = 0.16 + Math.round(Math.sin(t * 2.2) * 2) * 0.02;

    // tela digitando + teclas piscando
    typer.update(dt);
    typer.draw(sctx);
    screenTex.needsUpdate = true;
    if (Math.floor(t * 8) !== Math.floor((t - dt) * 8)) {
      const n = (Math.random() * KEYS_X * KEYS_Z) | 0;
      keys.setColorAt(n, keyColors[(Math.random() * 4) | 0]);
      keys.instanceColor.needsUpdate = true;
    }
    leds.forEach((l, i) => (l.material.color.set(Math.sin(t * 3 + i * 1.7) > -0.2 ? PALETTE.greenLight : PALETTE.greenDark)));
    steam.forEach((s) => {
      const p = (t * 0.4 + s.o) % 1;
      s.m.position.set(-1.55 + Math.sin(p * 6 + s.o * 9) * 0.06, 1.7 + p * 0.55, 0.5);
      s.m.material.opacity = 0.6 * (1 - p);
    });

    // cubos orbitando
    cubes.forEach((c, i) => {
      const a = c.a + t * 0.22;
      c.m.position.set(Math.cos(a) * c.r, c.y + Math.sin(t * 1.1 + i) * 0.18, Math.sin(a) * c.r * 0.72);
      c.m.rotation.y = t * 0.6 + i;
      c.m.rotation.x = Math.sin(t * 0.5 + i) * 0.25;
      const pop = easeOutBack(clamp01((intro - 0.6 - i * 0.12) / 0.7));
      c.m.scale.setScalar(Math.max(0.001, c.s * pop));
    });

    // partículas subindo
    const arr = pGeo.attributes.position.array;
    for (let i = 0; i < PN; i++) {
      arr[i * 3 + 1] += pSpd[i] * dt;
      if (arr[i * 3 + 1] > 7) arr[i * 3 + 1] = -3;
    }
    pGeo.attributes.position.needsUpdate = true;

    grid.position.z = (t * 0.6) % 1;

    renderer.render(scene, camera);
  };

  const loop = () => {
    if (!running) return;
    frame();
    raf = requestAnimationFrame(loop);
  };
  const start = () => {
    if (running || reduced || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  // pausa fora da tela / aba oculta
  const io = new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    visible ? start() : stop();
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  if (reduced) {
    // movimento reduzido: um único quadro estático, já montado
    intro = 10;
    t = 4;
    frame();
  } else {
    start();
  }

  return {
    destroy() {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      renderer.dispose();
    },
  };
}
