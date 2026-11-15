// Gera os arquivos de js/ a partir de src/ (o site em si continua 100% estático).
//   js/pixel-art.js  → script clássico (window.GNPixel) — funciona até abrindo o index.html direto
//   js/hero3d.js     → módulo ES com Three.js (carregado sob demanda pelo script.js)
import { build } from 'esbuild';

const common = { bundle: true, minify: true, legalComments: 'none', target: 'es2020', logLevel: 'info' };

await build({ ...common, entryPoints: ['src/pixel-art.js'], outfile: 'js/pixel-art.js', format: 'iife', globalName: 'GNPixel' });
await build({ ...common, entryPoints: ['src/hero3d.js'], outfile: 'js/hero3d.js', format: 'esm' });
