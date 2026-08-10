document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. NAVBAR & MENU MOBILE
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Efeito Glassmorphism no scroll
    const handleScroll = () => {
        if (window.scrollY > 30) {
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
        
        // Bloqueia o scroll do body quando o menu está aberto
        document.body.style.overflow = isActive ? 'hidden' : '';
    };

    hamburgerBtn.addEventListener('click', toggleMenu);

    // Fechar menu ao clicar num link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       2. ANIMAÇÕES DE REVEAL (INTERSECTION OBSERVER)
       ========================================================================== */
    // Seleciona todos os elementos que possuem classes de animação de entrada
    const revealElements = document.querySelectorAll(
        '.reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-zoom, .reveal-scale'
    );

    // Verifica preferência do usuário (prefers-reduced-motion) para não forçar o JS
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const revealOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px', // Ativa quando o elemento passa 10% da parte inferior da tela
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    // Desobserva o elemento após animar (ocorre apenas 1 vez)
                    observer.unobserve(entry.target);
                }
            });
        }, revealOptions);

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: se o navegador não suportar ou o usuário preferir sem animação
        revealElements.forEach(el => el.classList.add('is-revealed'));
    }

});