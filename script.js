document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. ANIMAÇÃO DE ENTRADA INICIAL (PAGE LOAD)
       ========================================================================== */
    // Anima os elementos do topo (Hero / Page Header) em cascata ao carregar a página
    const heroElements = document.querySelectorAll('.page-header .reveal-fade-up, .page-header .reveal-zoom, .hero .reveal-fade-up');
    
    setTimeout(() => {
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('is-revealed');
            }, index * 120); // 120ms de intervalo entre cada elemento
        });
    }, 100);

    /* ==========================================================================
       2. NAVBAR, MENU MOBILE & BARRA DE PROGRESSO
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Cria dinamicamente a Barra de Progresso de Leitura/Scroll
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress-bar';
    if (navbar) navbar.appendChild(scrollProgress);

    // Efeito Glassmorphism + Atualização do Scroll
    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        // Atualiza a barra de progresso no topo
        if (scrollProgress) {
            scrollProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
        }

        // Ativa classe scrolled na navbar
        if (scrollTop > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Alternar menu mobile
    const toggleMenu = () => {
        const isActive = navMenu.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
        hamburgerBtn.setAttribute('aria-expanded', isActive);
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', toggleMenu);
    }

    // Fechar menu mobile ao clicar em qualquer link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       3. ANIMAÇÕES DE REVEAL NO SCROLL COM ATRASO SEQUENCIAL (STAGGER)
       ========================================================================== */
    // Aplica atrasos automáticos aos elementos filhos dentro de grelhas (grids)
    const grids = document.querySelectorAll('.certificate-grid, .skills-grid, .grid-container');
    grids.forEach(grid => {
        const children = grid.querySelectorAll('.certificate-card, .skill-card, .card');
        children.forEach((child, index) => {
            // Atraso intercalado por coluna
            child.style.transitionDelay = `${(index % 4) * 0.1}s`;
        });
    });

    // Seleção de todos os elementos com classes de reveal
    const revealElements = document.querySelectorAll(
        '.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-zoom, .reveal-scale, .certificate-card'
    );

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const revealOptions = {
            root: null,
            rootMargin: '0px 0px -6% 0px', // Ativa um pouco antes do elemento chegar ao centro da tela
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    // Remove da observação após revelar para poupar memória do navegador
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback para dispositivos sem suporte ou preferências de movimento reduzido
        revealElements.forEach(el => el.classList.add('is-revealed'));
    }

    /* ==========================================================================
       4. EFEITO 3D TILT NOS CARDS (INTERAÇÃO DE RATO)
       ========================================================================== */
    const interactiveCards = document.querySelectorAll('.certificate-card, .project-card, .cta-box');

    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            // Desativa o efeito 3D em ecrãs de telemóvel/touch
            if (window.innerWidth < 768) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -7; // Inclinação vertical
            const rotateY = ((x - centerX) / centerX) * 7;  // Inclinação horizontal

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    /* ==========================================================================
       5. SCROLLSPY (DESTAQUE AUTOMÁTICO DO MENU DE NAVEGAÇÃO)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    const updateActiveNavLink = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            }
        });
    };

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
});
