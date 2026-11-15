/* ==========================================================================
   GN · PIXEL ART
   Fonte única de toda a arte em pixel do portfólio:
   - ícones 8-bit (renderizados como SVG com shape-rendering="crispEdges")
   - sprite do personagem (usado no 3D como voxels e no fallback 2D)
   - tela animada do monitor (textura do 3D e fallback 2D)

   Este arquivo é compilado por `npm run build` em dois formatos:
     js/pixel-art.js  → script clássico (window.GNPixel), funciona até em file://
     js/hero3d.js     → módulo com Three.js (carregado só quando necessário)
   ========================================================================== */

export const PALETTE = {
  bg: '#05070B',
  surface: '#0A0E14',
  blueDark: '#0A1F44',
  blue: '#1565C0',
  blueLight: '#4EA8DE',
  greenDark: '#0B3D2E',
  green: '#27AE60',
  greenLight: '#6FE3A0',
  text: '#F5F7FA',
  muted: '#94A3B8',
};

/* --------------------------------------------------------------------------
   ÍCONES  (bitmaps: '#' = pixel preenchido, '.' = vazio)
   -------------------------------------------------------------------------- */
export const ICONS = {
  pin: ['..####..', '.######.', '.##..##.', '.##..##.', '.######.', '..####..', '...##...', '....#...'],
  target: ['..####..', '.#....#.', '#..##..#', '#.#..#.#', '#.#..#.#', '#..##..#', '.#....#.', '..####..'],
  book: ['.######.', '#.####.#', '#.#..#.#', '#.####.#', '#.#..#.#', '#.####.#', '#......#', '.######.'],
  cap: ['...##...', '..####..', '.######.', '########', '.######.', '.#.##.#.', '.#....#.', '..#..#..'],
  brief: ['..####..', '..#..#..', '########', '#......#', '########', '#..##..#', '#......#', '########'],
  rocket: ['...##...', '..####..', '..#..#..', '..####..', '.######.', '.######.', '#.#..#.#', '..#..#..'],
  bolt: ['....###.', '...###..', '..###...', '.######.', '...###..', '..###...', '..##....', '.#......'],
  chat: ['########', '#......#', '#.#..#.#', '#......#', '########', '..#.....', '.#......', '#.......'],
  trophy: ['########', '#.####.#', '#.####.#', '.######.', '..####..', '...##...', '..####..', '.######.'],
  bulb: ['..####..', '.######.', '.######.', '.######.', '..####..', '..####..', '...##...', '..####..'],
  star: ['...##...', '...##...', '########', '.######.', '..####..', '.######.', '.##..##.', '.#....#.'],
  gear: ['...##...', '.######.', '.######.', '###..###', '###..###', '.######.', '.######.', '...##...'],
  chip: ['.#.##.#.', '########', '#.####.#', '########', '########', '#.####.#', '########', '.#.##.#.'],
  code: ['........', '.#....#.', '##....##', '#..##..#', '#..##..#', '##....##', '.#....#.', '........'],
  db: ['..####..', '.######.', '########', '.######.', '########', '.######.', '########', '..####..'],
  wrench: ['.##..##.', '.##..##.', '.######.', '..####..', '..####..', '...##...', '...##...', '...##...'],
  lock: ['..####..', '.#....#.', '.#....#.', '########', '###..###', '###..###', '###..###', '########'],
  globe: ['..####..', '.#.##.#.', '#..##..#', '########', '########', '#..##..#', '.#.##.#.', '..####..'],
  leaf: ['.....###', '...#####', '..######', '.#######', '.######.', '#.####..', '#.##....', '#.......'],
  check: ['........', '......##', '.....##.', '#...##..', '##.##...', '.###....', '..#.....', '........'],
  chart: ['#.......', '#.....##', '#.....##', '#..##.##', '#..##.##', '#.###.##', '#.###.##', '########'],
  palette: ['..####..', '.######.', '##.##.##', '######.#', '##.####.', '######..', '.######.', '..####..'],
  scroll: ['.######.', '#.####.#', '#......#', '#.####.#', '#......#', '#.####.#', '#......#', '.######.'],
  mail: ['########', '##....##', '#.#..#.#', '#..##..#', '#......#', '#......#', '#......#', '########'],
  phone: ['..####..', '..#..#..', '..#..#..', '..#..#..', '..#..#..', '..####..', '..#..#..', '..####..'],
  hourglass: ['########', '.#....#.', '..#..#..', '...##...', '...##...', '..#..#..', '.#.##.#.', '########'],
  helmet: ['..####..', '.######.', '########', '########', '#......#', '########', '........', '........'],
  cycle: ['..####..', '.#...###', '#.....#.', '#.......', '.......#', '.#.....#', '###...#.', '..####..'],
  robot: ['...##...', '..####..', '########', '#.#..#.#', '########', '#.####.#', '########', '.#....#.'],
  factory: ['#..#....', '#..#.#..', '#######.', '########', '#.#.#.##', '########', '########', '########'],
  gamepad: ['........', '.######.', '##.###.#', '#..###.#', '##.####.', '########', '##....##', '.#....#.'],
  note: ['...#####', '...#...#', '...#...#', '...#...#', '.###.###', '####.###', '.##..##.', '........'],
  video: ['........', '######..', '#....#.#', '#....###', '#....###', '#....#.#', '######..', '........'],
  coin: ['..####..', '.######.', '##.##.##', '##.###..', '###.###.', '##.##.##', '.######.', '..####..'],
  ruler: ['.......#', '......##', '.....###', '....###.', '...###..', '..###...', '.###....', '####....'],
  camera: ['........', '..####..', '########', '#..##..#', '#.####.#', '#.####.#', '#..##..#', '########'],
  butterfly: ['##....##', '###..###', '########', '.######.', '..####..', '.######.', '###..###', '.##..##.'],
  heart: ['.##..##.', '########', '########', '########', '.######.', '..####..', '...##...', '........'],
  arrowup: ['...##...', '..####..', '.######.', '########', '...##...', '...##...', '...##...', '...##...'],
  copy: ['#####...', '#...#...', '#.#####.', '#.#...#.', '#.#...#.', '#.#...#.', '..#####.', '........'],
  ext: ['....####', '.....###', '#.....##', '##...#.#', '.##.#..#', '..###...', '.###....', '.#.#....'],
  user: ['..####..', '.######.', '.######.', '..####..', '.######.', '########', '########', '########'],
  /* ícones grandes dos projetos */
  ball: [
    '....######....',
    '..##########..',
    '.####..##..###',
    '.###.#..#.####',
    '####..##..####',
    '###..####..###',
    '###.######.###',
    '###..####..###',
    '####..##..####',
    '.###.#..#.####',
    '.####..##..###',
    '..##########..',
    '....######....',
  ],
  capybara: [
    '................',
    '.........####...',
    '...####.######..',
    '..######.#####..',
    '.#.#########.##.',
    '.############.#.',
    '###############.',
    '###############.',
    '.##############.',
    '.#.##########.#.',
    '..##.##..##.##..',
    '..##.##..##.##..',
  ],
  bigGear: [
    '.....##..##.....',
    '....####.###....',
    '..############..',
    '.##############.',
    '.####......####.',
    '####........####',
    '####........####',
    '.####......####.',
    '.##############.',
    '..############..',
    '....####.###....',
    '.....##..##.....',
  ],
};

/** Gera um SVG nítido (crispEdges) a partir de um bitmap. Usa currentColor. */
export function iconSVG(name, extra = '') {
  const rows = ICONS[name];
  if (!rows) return '';
  const h = rows.length;
  const w = rows[0].length;
  let d = '';
  // Une pixels adjacentes da mesma linha para gerar menos <rect>
  rows.forEach((row, y) => {
    let x = 0;
    while (x < w) {
      if (row[x] === '#') {
        let len = 1;
        while (x + len < w && row[x + len] === '#') len++;
        d += `M${x} ${y}h${len}v1h-${len}z`;
        x += len;
      } else x++;
    }
  });
  return `<svg class="pxi-svg ${extra}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true" focusable="false"><path fill="currentColor" d="${d}"/></svg>`;
}

/** Substitui todo `[data-px="nome"]` pelo SVG do ícone correspondente. */
export function hydrateIcons(root = document) {
  root.querySelectorAll('[data-px]:not([data-px-ready])').forEach((el) => {
    const svg = iconSVG(el.dataset.px);
    if (svg) {
      el.innerHTML = svg;
      el.setAttribute('data-px-ready', '');
    }
  });
}

/* --------------------------------------------------------------------------
   PERSONAGEM (16 x 24) — desenvolvedor de óculos, camiseta azul
   H cabelo · S pele · s pele sombra · G armação · W lente · M boca
   T camiseta · t camiseta sombra · g detalhe verde · P calça · B tênis
   -------------------------------------------------------------------------- */
export const DEV_SPRITE = [
  '................',
  '.....HHHHHH.....',
  '....HHHHHHHH....',
  '...HHHHHHHHHH...',
  '...HHHHHHHHHH...',
  '...HSSSSSSSSH...',
  '...GGGGGGGGGG...',
  '...GWWGSSGWWG...',
  '...GGGGSSGGGG...',
  '....SSSSSSSS....',
  '....SSSMMSSS....',
  '.....SSSSSS.....',
  '......ssss......',
  '..TTTTTTTTTTTT..',
  '.TTTTTTTTTTTTTT.',
  '.TTTgTTTTTTgTTT.',
  '.TTTTTTTTTTTTTT.',
  '.SSTTTTTTTTTTSS.',
  '.SSTTtttttTTTSS.',
  '..SSPPPPPPPPSS..',
  '....PPPPPPPP....',
  '....PPP..PPP....',
  '....PPP..PPP....',
  '....BBB..BBB....',
];

export const SPRITE_COLORS = {
  H: '#10161f',
  S: '#b07a52',
  s: '#8f6140',
  G: '#05070b',
  W: '#9fd4ff',
  M: '#6b3d2a',
  T: '#1565c0',
  t: '#0a1f44',
  g: '#27ae60',
  P: '#0a1f44',
  B: '#e9eef5',
};

/* --------------------------------------------------------------------------
   TELA DO MONITOR — "código" animado em blocos coloridos
   Cada linha: [recuo, [[tamanho, cor], ...]]
   -------------------------------------------------------------------------- */
const C = { k: '#4EA8DE', s: '#6FE3A0', t: '#F5F7FA', d: '#5b7aa6', b: '#1565C0' };
const CODE = [
  [0, [[5, C.k], [3, C.t], [1, C.d], [4, C.s]]],
  [2, [[6, C.t], [1, C.d], [9, C.s]]],
  [2, [[5, C.t], [1, C.d], [12, C.s]]],
  [2, [[7, C.t], [1, C.d], [14, C.s]]],
  [0, [[1, C.d]]],
  [0, [[3, C.k], [8, C.b], [2, C.t]]],
  [2, [[4, C.t], [3, C.d], [7, C.s], [2, C.d]]],
  [2, [[6, C.k], [5, C.t]]],
  [0, [[1, C.d]]],
];

/** Máquina de digitação: devolve `progress` (0..1) e desenha no canvas 2D. */
export class ScreenTyper {
  constructor(width = 160, height = 120) {
    this.w = width;
    this.h = height;
    this.total = CODE.reduce((n, l) => n + l[1].reduce((a, s) => a + s[0], 0), 0);
    this.t = 0;
    this.speed = 14; // blocos por segundo
    this.hold = 2.4; // segundos exibindo "BUILD OK"
  }

  update(dt) {
    this.t += dt;
  }

  /** Estado atual: quantos blocos visíveis e se terminou. */
  get state() {
    const typeTime = this.total / this.speed;
    const cycle = typeTime + this.hold + 0.6;
    const c = this.t % cycle;
    const done = c >= typeTime;
    return { shown: Math.min(this.total, Math.floor(c * this.speed)), done, fade: c > typeTime + this.hold };
  }

  draw(ctx, forceDone = false) {
    const { w, h } = this;
    const st = forceDone ? { shown: this.total, done: true, fade: false } : this.state;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = PALETTE.surface;
    ctx.fillRect(0, 0, w, h);

    // barra de título
    ctx.fillStyle = PALETTE.blueDark;
    ctx.fillRect(0, 0, w, 11);
    ctx.fillStyle = PALETTE.blueLight;
    ctx.fillRect(4, 4, 3, 3);
    ctx.fillStyle = PALETTE.green;
    ctx.fillRect(9, 4, 3, 3);
    ctx.fillStyle = '#3b4a63';
    ctx.fillRect(14, 4, 3, 3);
    ctx.fillStyle = '#9fb3d1';
    ctx.fillRect(w - 38, 4, 22, 3); // "nome do arquivo"

    // calha de números de linha
    ctx.fillStyle = '#0d1522';
    ctx.fillRect(0, 11, 14, h - 11);

    // linhas de código
    let remaining = st.shown;
    const lh = 9;
    let caret = null;
    CODE.forEach((line, i) => {
      const y = 17 + i * lh;
      ctx.fillStyle = '#2a3b57';
      ctx.fillRect(5, y + 1, 4, 3); // número da linha
      let x = 18 + line[0] * 4;
      for (const [len, color] of line[1]) {
        const n = Math.min(len, remaining);
        if (n > 0) {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, n * 4 - 1, 5);
          caret = { x: x + n * 4, y };
        }
        remaining -= n;
        x += len * 4 + 2;
        if (remaining <= 0) break;
      }
    });

    // cursor piscando
    if (!st.done && caret && Math.floor(this.t * 3) % 2 === 0) {
      ctx.fillStyle = PALETTE.greenLight;
      ctx.fillRect(caret.x, caret.y - 1, 3, 7);
    }

    // selo "BUILD OK" ao terminar
    if (st.done && !st.fade) {
      const bw = 62;
      const bx = w - bw - 8;
      const by = h - 24;
      ctx.fillStyle = PALETTE.greenDark;
      ctx.fillRect(bx, by, bw, 15);
      ctx.fillStyle = PALETTE.green;
      ctx.fillRect(bx, by, bw, 2);
      ctx.fillRect(bx, by + 13, bw, 2);
      // check
      ctx.fillStyle = PALETTE.greenLight;
      [[0, 4], [1, 5], [2, 6], [3, 5], [4, 4], [5, 3], [6, 2], [7, 1]].forEach(([cx, cy]) =>
        ctx.fillRect(bx + 6 + cx * 2, by + 3 + cy, 2, 2),
      );
      ctx.fillStyle = PALETTE.text;
      ctx.fillRect(bx + 26, by + 5, 28, 2);
      ctx.fillRect(bx + 26, by + 9, 18, 2);
    }

    // "scanline" leve
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    for (let y = 12; y < h; y += 3) ctx.fillRect(0, y, w, 1);
  }
}

/* --------------------------------------------------------------------------
   FALLBACK 2D — cena estática em pixel art (sem WebGL / pouca capacidade)
   -------------------------------------------------------------------------- */
export function drawSprite(ctx, sprite, colors, x, y, px) {
  sprite.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const c = colors[row[i]];
      if (c) {
        ctx.fillStyle = c;
        ctx.fillRect(x + i * px, y + j * px, px, px);
      }
    }
  });
}

export function drawFallback(canvas) {
  const W = 320;
  const H = 240;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, W, H);

  // estrelas / bits
  const bits = [
    [30, 40, '#1565c0'], [60, 90, '#27ae60'], [250, 50, '#4ea8de'], [290, 120, '#27ae60'],
    [20, 160, '#4ea8de'], [275, 190, '#1565c0'], [120, 24, '#6fe3a0'], [200, 20, '#1565c0'],
  ];
  bits.forEach(([x, y, c]) => {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, 3, 3);
  });

  // ilha (blocos escalonados)
  const layers = [
    [40, 190, 240, 10, '#0f2a57'],
    [58, 200, 204, 10, '#0a1f44'],
    [84, 210, 152, 10, '#0b3d2e'],
    [116, 220, 88, 8, '#0a1f44'],
  ];
  layers.forEach(([x, y, w, h, c]) => {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
  });
  ctx.fillStyle = '#27ae60';
  ctx.fillRect(40, 188, 240, 3);

  // mesa
  ctx.fillStyle = '#0a1f44';
  ctx.fillRect(60, 160, 120, 8);
  ctx.fillRect(66, 168, 6, 20);
  ctx.fillRect(168, 168, 6, 20);
  ctx.fillStyle = '#27ae60';
  ctx.fillRect(60, 160, 120, 2);

  // monitor
  ctx.fillStyle = '#0a0e14';
  ctx.fillRect(70, 88, 100, 66);
  ctx.fillStyle = '#1565c0';
  ctx.fillRect(70, 88, 100, 2);
  ctx.fillRect(112, 154, 16, 6);
  const screen = document.createElement('canvas');
  screen.width = 160;
  screen.height = 120;
  const sctx = screen.getContext('2d');
  new ScreenTyper(160, 120).draw(sctx, true);
  ctx.drawImage(screen, 75, 93, 90, 56);

  // personagem
  drawSprite(ctx, DEV_SPRITE, SPRITE_COLORS, 200, 112, 3);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(200, 184, 48, 4);
  return true;
}
