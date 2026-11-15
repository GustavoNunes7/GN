# 🎮 Portfólio GN · Gustavo Nunes

Portfólio de **Gustavo Nunes — Desenvolvedor de Sistemas em formação**, com identidade **pixel art + HUD de jogo + 3D**, mantendo as cores originais do GN.

🔗 **Deploy:** https://gustavonunes7.github.io/GN/

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white)

## ✨ O que tem

- **Hero 3D voxel (Three.js):** ilha flutuante com computador digitando, personagem pixelado, cubos de tecnologia orbitando e partículas; reage ao mouse. Renderizado em baixa resolução e ampliado (`image-rendering: pixelated`) — pixel art real e barato para a GPU.
- **Boot "GN.OS"**, glitch controlado no título, digitação, HUD (`PLAYER / CLASS / CURRENT MISSION`).
- **Sobre** como *player profile*; **Skill Tree** por categoria (sem níveis ou porcentagens inventados); **Projetos** com card principal em destaque e hover 3D; **Trajetória** em timeline que "enche" ao rolar; **Certificados** com miniaturas e filtro por instituição; **Contato** em formato de terminal com botões de copiar.
- Navbar com indicador de seção, barra de progresso, menu mobile, botão de voltar ao topo, cursor pixel (só mouse).

## ⚡ Desempenho e acessibilidade

- O Three.js (`js/hero3d.js`) só é baixado na home, após o boot e em *idle*. Antes disso (e em dispositivos fracos, *save-data*, 2G ou sem WebGL) aparece a **arte 2D em pixel art** como alternativa.
- Renderização pausa fora da tela e com a aba oculta.
- `prefers-reduced-motion`: sem boot, glitch, ticker, tilt ou animações; o 3D vira um quadro estático.
- Fontes locais (sem Google Fonts), imagens com `loading="lazy"`, `skip-link`, foco visível, alvos de toque ≥ 44px, sem scroll horizontal.

## 📂 Estrutura

```text
index.html            Página principal
styles.css            Design system (tokens, componentes, seções, responsivo)
script.js             Comportamento (JS puro) — todas as páginas
páginaCursos/         Páginas de certificados (SENAI, SESI, SEBRAE, Bradesco, Extras)
src/                  Fontes do pixel art e da cena 3D  ← edite aqui
js/                   Arquivos gerados a partir de src/ (publicados no Pages)
tools/build.mjs       Build (esbuild)
images/ fonts/ certificados/
```

## 🛠️ Desenvolvimento

O site é 100% estático (funciona no GitHub Pages). Só é necessário Node se for **alterar `src/`**:

```bash
npm install
npm run build        # gera js/pixel-art.js e js/hero3d.js
python3 -m http.server 8000   # ou qualquer servidor estático
```

> Abra por um servidor local (não `file://`): o módulo 3D usa `import()`.

## 🖼️ Prévias dos projetos

Os cards usam **arte pixel ilustrativa** (marcada como "arte ilustrativa"), pois não há capturas reais dos projetos no repositório. Para usar capturas reais, adicione as imagens em `images/projetos/` e troque o bloco `.preview-art` do card em `index.html` por um `<img>`.

## 🎨 Paleta

`#05070B` fundo · `#0A0E14` superfície · `#0A1F44` / `#1565C0` azuis · `#0B3D2E` / `#27AE60` verdes · `#F5F7FA` texto · `#94A3B8` texto secundário.
