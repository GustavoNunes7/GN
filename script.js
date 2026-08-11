/* ==========================================================================
   VARIÁVEIS DE TEMA (DARK PREMIUM)
   ========================================================================== */
   :root {
    /* Cores Principais */
    --black-bg: #05070b;
    --black-surface: #0a0e14;
    --black-elevated: #111823;
    
    --blue-dark: #0A1F44;
    --blue-accent: #1565C0;
    --blue-light: #4ea8de;
    
    --green-dark: #0B3D2E;
    --green-accent: #145A32;
    --green-light: #27ae60;

    /* Textos */
    --text-primary: #F5F7FA;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;

    /* Efeitos & Bordas */
    --glass-bg: rgba(10, 14, 20, 0.65);
    --glass-border: rgba(255, 255, 255, 0.08);
    --card-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.8);
    
    /* Tipografia */
    --font-sans: 'Inter', sans-serif;
    --font-mono: 'Fira Code', monospace;
    
    --transition-fast: 0.2s ease;
    --transition-smooth: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    
    --radius-md: 12px;
    --radius-lg: 20px;
}

/* ==========================================================================
   RESET & ACESSIBILIDADE
   ========================================================================== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
    scroll-padding-top: 90px;
}

body {
    font-family: var(--font-sans);
    background-color: var(--black-bg);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
    position: relative;
}

/* Navegação por teclado */
:focus-visible {
    outline: 2px solid var(--blue-light);
    outline-offset: 4px;
    border-radius: 4px;
}

a { text-decoration: none; color: inherit; }
ul { list-style: none; }
img { max-width: 100%; height: auto; display: block; }

/* ==========================================================================
   BACKGROUND ANIMADO PREMIUM
   ========================================================================== */
.premium-bg {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: -2;
    background: 
        radial-gradient(circle at 15% 20%, rgba(10, 45, 100, 0.16), transparent 40%),
        radial-gradient(circle at 85% 70%, rgba(8, 65, 45, 0.13), transparent 40%),
        var(--black-bg);
}

/* Bolhas de luz sutis */
.premium-bg::before, .premium-bg::after {
    content: '';
    position: absolute;
    width: 50vw; height: 50vw;
    border-radius: 50%;
    filter: blur(120px);
    opacity: 0.5;
    animation: floatBlob 20s infinite alternate linear;
}

.premium-bg::before {
    top: -10%; left: -10%;
    background: var(--blue-dark);
}

.premium-bg::after {
    bottom: -10%; right: -10%;
    background: var(--green-dark);
    animation-delay: -10s;
}

.tech-grid {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: -1;
    background-image: 
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    opacity: 0.4;
    mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
    -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
}

@keyframes floatBlob {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(5%, 10%) scale(1.1); }
}

/* ==========================================================================
   LAYOUT GERAL
   ========================================================================== */
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.section { padding: 100px 0; }

.section-title {
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 700;
    margin-bottom: 3rem;
    letter-spacing: -0.5px;
}

.section-title::after {
    content: ''; display: block;
    width: 50px; height: 3px;
    background: linear-gradient(90deg, var(--blue-accent), var(--green-light));
    margin-top: 10px;
    border-radius: 4px;
}

/* ==========================================================================
   BOTÕES E LINKS (MICROINTERAÇÕES)
   ========================================================================== */
.btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 12px 28px;
    font-size: 1rem; font-weight: 500;
    border-radius: 8px;
    transition: var(--transition-smooth);
    cursor: pointer;
    border: 1px solid transparent;
}

.btn-primary {
    background: var(--blue-accent);
    color: #fff;
    box-shadow: 0 0 15px rgba(21, 101, 192, 0.2);
}

.btn-primary:hover {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(21, 101, 192, 0.4);
}

.btn-secondary {
    background: var(--green-dark);
    color: #fff;
    border: 1px solid var(--green-accent);
}

.btn-secondary:hover {
    background: var(--green-accent);
    transform: translateY(-2px);
}

.btn-outline {
    background: transparent;
    border-color: var(--glass-border);
    color: var(--text-primary);
}

.btn-outline:hover {
    border-color: var(--blue-light);
    background: rgba(78, 168, 222, 0.05);
    transform: translateY(-2px);
}

.link-texto {
    color: var(--blue-light);
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: var(--transition-fast);
}

.link-texto:hover {
    color: #fff;
    gap: 8px; /* microinteração da seta movendo */
}

/* ==========================================================================
   NAVBAR (GLASSMORPHISM)
   ========================================================================== */
.navbar {
    position: fixed; top: 0; left: 0; width: 100%;
    z-index: 1000;
    transition: var(--transition-smooth);
    padding: 24px 0;
}

.navbar.scrolled {
    padding: 16px 0;
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--glass-border);
}

.nav-container {
    display: flex; justify-content: space-between; align-items: center;
}

.logo {
    font-size: 1.5rem; font-weight: 700;
    letter-spacing: -1px;
}

.logo span { color: var(--blue-accent); }

.nav-list {
    display: flex; gap: 32px; align-items: center;
}

.nav-link {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
    transition: var(--transition-fast);
    position: relative;
}

.nav-link:hover { color: var(--text-primary); }

/* Underline animado */
.nav-link:not(.btn-nav)::after {
    content: ''; position: absolute;
    width: 0; height: 2px;
    bottom: -4px; left: 0;
    background: var(--blue-accent);
    transition: width var(--transition-smooth);
}
.nav-link:not(.btn-nav):hover::after { width: 100%; }

.btn-nav {
    border: 1px solid var(--glass-border);
    padding: 8px 20px;
    border-radius: 6px;
}
.btn-nav:hover {
    background: rgba(255,255,255,0.05);
    border-color: var(--text-secondary);
}

/* Menu Mobile Hamburger */
.hamburger-btn {
    display: none;
    background: transparent; border: none;
    cursor: pointer; z-index: 1001;
    width: 30px; height: 20px;
    position: relative;
}

.hamburger-line {
    position: absolute; left: 0;
    width: 100%; height: 2px;
    background: var(--text-primary);
    transition: var(--transition-smooth);
    border-radius: 2px;
}
.hamburger-line:nth-child(1) { top: 0; }
.hamburger-line:nth-child(2) { top: 9px; }
.hamburger-line:nth-child(3) { top: 18px; }

.hamburger-btn.active .hamburger-line:nth-child(1) {
    top: 9px; transform: rotate(45deg);
}
.hamburger-btn.active .hamburger-line:nth-child(2) {
    opacity: 0;
}
.hamburger-btn.active .hamburger-line:nth-child(3) {
    top: 9px; transform: rotate(-45deg);
}

/* ==========================================================================
   HERO
   ========================================================================== */
.hero {
    min-height: 100vh;
    display: flex; align-items: center;
    padding-top: 80px;
}

.hero-wrapper {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 60px;
    align-items: center;
}

.hero-tag {
    color: var(--blue-light);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.hero-title {
    font-size: clamp(3rem, 5vw, 4.5rem);
    line-height: 1.1;
    font-weight: 800;
    margin-bottom: 24px;
    letter-spacing: -1.5px;
}

.hero-title span:first-child {
    background: linear-gradient(to right, #fff, var(--text-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.cursor-blink {
    color: var(--green-light);
    animation: blink 1s step-end infinite;
}

@keyframes blink { 50% { opacity: 0; } }

.hero-subtitle {
    font-size: 1.1rem;
    color: var(--text-secondary);
    margin-bottom: 40px;
    max-width: 500px;
}

.hero-actions { display: flex; gap: 16px; }

/* Code Window Premium */
.code-window {
    background: var(--black-surface);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
    overflow: hidden;
    transform: perspective(1000px) rotateY(-5deg);
    transition: var(--transition-smooth);
}

.code-window:hover {
    transform: perspective(1000px) rotateY(0deg) translateY(-10px);
    border-color: rgba(78, 168, 222, 0.3);
    box-shadow: 0 30px 60px rgba(10, 31, 68, 0.5);
}

.code-header {
    background: #0f141d;
    padding: 12px 16px;
    display: flex; gap: 8px;
    border-bottom: 1px solid var(--glass-border);
}

.dot { width: 12px; height: 12px; border-radius: 50%; }
.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27c93f; }

.code-body {
    padding: 24px;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--text-primary);
    line-height: 1.5;
    overflow-x: auto;
}

.keyword { color: #c678dd; }
.string { color: #98c379; }
.operator { color: #56b6c2; }

/* ==========================================================================
   SOBRE MIM
   ========================================================================== */
.sobre-grid {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 60px;
    align-items: center;
}

.sobre-image-wrapper {
    position: relative;
    border-radius: var(--radius-lg);
}

.image-glow {
    position: absolute;
    inset: -10px;
    background: linear-gradient(45deg, var(--blue-accent), var(--green-dark));
    filter: blur(20px);
    opacity: 0.3;
    z-index: 0;
    transition: var(--transition-smooth);
}

.sobre-image-wrapper:hover .image-glow { opacity: 0.6; }

.sobre-foto {
    position: relative;
    z-index: 1;
    border-radius: var(--radius-lg);
    border: 1px solid var(--glass-border);
    box-shadow: var(--card-shadow);
    transition: var(--transition-smooth);
}

.sobre-image-wrapper:hover .sobre-foto {
    transform: translateY(-5px);
    border-color: rgba(255,255,255,0.15);
}

.sobre-text p {
    color: var(--text-secondary);
    font-size: 1.05rem;
    margin-bottom: 20px;
}

.sobre-highlights {
    display: flex; gap: 24px; margin-top: 32px;
}

.highlight-item {
    display: flex; align-items: center; gap: 10px;
    background: var(--black-surface);
    padding: 12px 20px;
    border-radius: 100px;
    border: 1px solid var(--glass-border);
    font-size: 0.9rem; font-weight: 500;
}

/* ==========================================================================
   HABILIDADES
   ========================================================================== */
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
}

.skill-card {
    background: var(--black-surface);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: 32px;
    transition: var(--transition-smooth);
}

.skill-card:hover {
    transform: translateY(-8px);
    border-color: var(--blue-accent);
    background: var(--black-elevated);
    box-shadow: 0 10px 30px rgba(10, 31, 68, 0.4);
}

.skill-header {
    display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
}

.skill-icon {
    font-size: 1.8rem;
    background: var(--glass-bg);
    padding: 12px;
    border-radius: 12px;
}

.skill-card h3 { font-size: 1.2rem; font-weight: 600; }

.skill-list { display: flex; flex-direction: column; gap: 12px; }

.skill-list li {
    color: var(--text-secondary);
    font-size: 0.95rem;
    display: flex; align-items: center; gap: 8px;
}
.skill-list li::before {
    content: '▹'; color: var(--blue-light); font-size: 1.2rem;
}

/* ==========================================================================
   PROJETOS
   ========================================================================== */
.projetos-wrapper {
    display: flex; flex-direction: column; gap: 40px;
}

.projeto-card {
    background: var(--black-surface);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: var(--transition-smooth);
}

.projeto-card:hover {
    border-color: var(--glass-border);
    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
}

/* Projeto Destaque (Principal) */
.projeto-card.featured {
    display: grid; grid-template-columns: 1fr 1fr;
    align-items: stretch;
}

.projeto-card.featured:hover {
    border-color: var(--green-dark);
}

.projeto-imagem {
    overflow: hidden;
    position: relative;
}

.projeto-imagem img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.6s ease;
}

.projeto-card:hover .projeto-imagem img {
    transform: scale(1.05);
}

.projeto-info { padding: 40px; display: flex; flex-direction: column; justify-content: center;}

.projeto-info h3 { font-size: 1.5rem; margin-bottom: 16px; }
.projeto-info p { color: var(--text-secondary); margin-bottom: 24px; }

.tech-tags {
    display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 32px;
}

.tech-tags span {
    font-family: var(--font-mono); font-size: 0.8rem;
    color: var(--blue-light);
    background: rgba(78, 168, 222, 0.1);
    padding: 6px 12px; border-radius: 4px;
}

.projeto-links { display: flex; gap: 16px; }

/* Projetos Secundários Grid */
.projetos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 40px;
}

.projeto-card.normal .projeto-info { padding: 32px; }
.projeto-card.normal:hover { border-color: var(--blue-dark); transform: translateY(-5px); }

/* ==========================================================================
   TRAJETÓRIA (TIMELINE)
   ========================================================================== */
.timeline {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
    padding-left: 20px;
}

.timeline::before {
    content: ''; position: absolute;
    top: 0; left: 24px; width: 2px; height: 100%;
    background: linear-gradient(to bottom, var(--blue-accent), var(--green-dark), transparent);
}

.timeline-item { position: relative; padding-bottom: 40px; padding-left: 40px; }

.timeline-marker {
    position: absolute; left: 18px; top: 0;
    width: 14px; height: 14px;
    border-radius: 50%;
    background: var(--black-bg);
    border: 2px solid var(--blue-light);
    box-shadow: 0 0 10px rgba(78, 168, 222, 0.5);
    z-index: 2;
}

.timeline-date {
    display: block; font-family: var(--font-mono); font-size: 0.85rem;
    color: var(--green-light); margin-bottom: 8px;
}

.timeline-content h3 { font-size: 1.2rem; margin-bottom: 8px; color: var(--text-primary); }
.timeline-content p { color: var(--text-secondary); font-size: 0.95rem; }

/* ==========================================================================
   CERTIFICADOS (ESCALÁVEIS)
   ========================================================================== */
.certificate-institution { margin-bottom: 60px; }

.institution-header { margin-bottom: 24px; border-bottom: 1px solid var(--glass-border); padding-bottom: 16px; }

.institution-label {
    font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px;
    color: var(--text-muted);
}
.institution-header h3 { font-size: 1.8rem; margin-top: 4px; color: #fff; }

.certificate-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
}

.certificate-card {
    background: var(--black-surface);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-md);
    padding: 24px;
    display: flex; gap: 16px; align-items: flex-start;
    transition: var(--transition-smooth);
}

.certificate-card:hover {
    background: var(--black-elevated);
    border-color: var(--glass-border);
    transform: translateY(-4px) scale(1.01);
}

.cert-icon { font-size: 2rem; background: var(--glass-bg); padding: 12px; border-radius: 12px; }

.cert-info h4 { font-size: 1.05rem; margin-bottom: 12px; font-weight: 500;}

/* ==========================================================================
   CONTATO & FOOTER
   ========================================================================== */
.cta-box {
    background: linear-gradient(135deg, var(--black-elevated), var(--blue-dark));
    border: 1px solid rgba(255,255,255,0.05);
    padding: 80px 40px;
    border-radius: var(--radius-lg);
    text-align: center;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.cta-box h2 { font-size: clamp(2rem, 4vw, 3rem); line-height: 1.2; margin-bottom: 16px; }
.cta-box p { color: var(--text-secondary); margin-bottom: 40px; max-width: 600px; margin-inline: auto;}

.cta-buttons { display: flex; justify-content: center; flex-wrap: wrap; gap: 16px; }

.footer {
    text-align: center; padding: 40px 0; border-top: 1px solid var(--glass-border);
    margin-top: 50px;
}
.footer p { color: var(--text-muted); font-size: 0.9rem; }

/* ==========================================================================
   ANIMAÇÕES DE ENTRADA (REVEAL)
   ========================================================================== */
.reveal-fade-up { opacity: 0; transform: translateY(30px); transition: opacity 0.8s ease, transform 0.8s ease; filter: blur(3px); }
.reveal-fade-left { opacity: 0; transform: translateX(30px); transition: opacity 0.8s ease, transform 0.8s ease; filter: blur(3px); }
.reveal-fade-right { opacity: 0; transform: translateX(-30px); transition: opacity 0.8s ease, transform 0.8s ease; filter: blur(3px); }
.reveal-zoom { opacity: 0; transform: scale(0.9); transition: opacity 0.8s ease, transform 0.8s ease; filter: blur(3px); }
.reveal-scale { opacity: 0; transform: scale(0.95); transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }

/* Classe ativada via JS */
.is-revealed { opacity: 1; transform: translate(0) scale(1); filter: blur(0); }

/* Respeito à preferência do usuário por movimento reduzido */
@media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
    .reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-zoom, .reveal-scale {
        opacity: 1; transform: none; filter: none; transition: none;
    }
}

/* ==========================================================================
   MEDIA QUERIES (RESPONSIVIDADE)
   ========================================================================== */
/* Tablet & Notebooks pequenos */
@media screen and (max-width: 1024px) {
    .sobre-grid { grid-template-columns: 1fr; }
    .sobre-image-wrapper { max-width: 400px; margin: 0 auto; order: -1; }
    .projeto-card.featured { grid-template-columns: 1fr; }
}

/* Mobile */
@media screen and (max-width: 768px) {
    .hero-wrapper { grid-template-columns: 1fr; text-align: center; }
    .hero-actions { justify-content: center; }
    .hero-subtitle { margin-inline: auto; }
    .code-window { display: none; /* Oculta na tela pequena para não poluir */ }
    
    .hamburger-btn { display: block; }
    
    .nav-menu {
        position: fixed; top: 0; right: -100%; width: 100%; height: 100vh;
        background: rgba(5, 7, 11, 0.98);
        backdrop-filter: blur(20px);
        display: flex; align-items: center; justify-content: center;
        transition: right var(--transition-smooth);
    }
    .nav-menu.active { right: 0; }
    .nav-list { flex-direction: column; gap: 40px; text-align: center; font-size: 1.2rem; }
    
    .cta-buttons { flex-direction: column; width: 100%; }
    .cta-buttons .btn { width: 100%; }
}

/* Mobile pequeno (ex: 320px) */
@media screen and (max-width: 375px) {
    .section { padding: 60px 0; }
    .sobre-image-wrapper { max-width: 100%; }
    .projeto-info { padding: 24px; }
    .timeline::before { left: 16px; }
    .timeline-marker { left: 10px; }
    .timeline-item { padding-left: 30px; }
}

/* ==========================================================================
   REGRAS E ESTILOS DAS ANIMAÇÕES (REVEAL & INTERAÇÕES)
   ========================================================================== */

/* Barra de Progresso no Topo */
.scroll-progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #00d2ff, #3a7bd5);
    box-shadow: 0 0 10px rgba(0, 210, 255, 0.7);
    transition: width 0.1s ease-out;
    z-index: 1001;
}

/* Base de Transição para Elementos de Entrada */
.reveal-fade-up,
.reveal-fade-left,
.reveal-fade-right,
.reveal-zoom,
.reveal-scale,
.certificate-card {
    opacity: 0;
    will-change: transform, opacity, filter;
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                filter 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Tipos de Entradas Diferentes */
.reveal-fade-up {
    transform: translateY(40px);
    filter: blur(4px);
}

.reveal-fade-left {
    transform: translateX(-40px);
    filter: blur(4px);
}

.reveal-fade-right {
    transform: translateX(40px);
    filter: blur(4px);
}

.reveal-zoom {
    transform: scale(0.85);
    filter: blur(6px);
}

.reveal-scale {
    transform: scale(0.92) translateY(20px);
}

/* Estado Visível (Revealed) */
.reveal-fade-up.is-revealed,
.reveal-fade-left.is-revealed,
.reveal-fade-right.is-revealed,
.reveal-zoom.is-revealed,
.reveal-scale.is-revealed,
.certificate-card.is-revealed {
    opacity: 1;
    transform: translateY(0) translateX(0) scale(1);
    filter: blur(0px);
}

/* Suporte a transição suave no Tilt 3D */
.certificate-card,
.project-card,
.cta-box {
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), 
                box-shadow 0.25s ease, 
                border-color 0.25s ease;
    transform-style: preserve-3d;
}
