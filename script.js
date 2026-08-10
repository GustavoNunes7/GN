document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MENU MOBILE (Abrir / Fechar)
       ========================================================================== */
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function toggleMenu() {
        mobileBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Acessibilidade
        const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
        mobileBtn.setAttribute('aria-expanded', !isExpanded);
    }

    mobileBtn.addEventListener('click', toggleMenu);

    // Fechar o menu mobile ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       2. EFEITO NAVBAR SCROLL (Fundo Blur / Sombra)
       ========================================================================== */
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled'); // Para manter um padding menor, mude a classe se desejar. Aqui aplicamos a sombra.
            if(window.scrollY === 0) navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       3. ANIMAÇÃO DE REVEAL ON SCROLL (Intersection Observer)
       ========================================================================== */
    const reveals = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15, // Aciona quando 15% do elemento estiver visível
        rootMargin: "0px 0px -50px 0px" // Dispara um pouco antes de aparecer completamente
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Se não quiser que a animação repita, descomente a linha abaixo
                // observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

});