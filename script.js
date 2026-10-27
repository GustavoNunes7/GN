document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Barra de progresso de leitura.
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress-bar';
    if (navbar) navbar.appendChild(scrollProgress);

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

        scrollProgress.style.width = `${Math.min(Math.max(scrollPercent, 0), 100)}%`;
        if (navbar) navbar.classList.toggle('scrolled', scrollTop > 30);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Menu mobile: protege contra elementos ausentes e mantém acessibilidade.
    const closeMenu = () => {
        if (!hamburgerBtn || !navMenu) return;
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('active', isActive);
            hamburgerBtn.setAttribute('aria-expanded', String(isActive));
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        navLinks.forEach(link => link.addEventListener('click', closeMenu));
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeMenu();
        });
    }

    // Revelação progressiva dos elementos ao entrarem na área visível.
    const revealSelector = [
        '.reveal-fade-up',
        '.reveal-fade-left',
        '.reveal-fade-right',
        '.reveal-zoom',
        '.reveal-scale',
        '.certificate-card'
    ].join(', ');

    const revealElements = document.querySelectorAll(revealSelector);

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach(element => element.classList.add('is-revealed'));
    } else {
        // Revela o conteúdo inicial imediatamente para evitar um hero preso invisível.
        document.querySelectorAll('.hero .reveal-fade-up, .hero .reveal-fade-left')
            .forEach((element, index) => {
                window.setTimeout(() => element.classList.add('is-revealed'), index * 120);
            });

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            });
        }, {
            root: null,
            rootMargin: '0px 0px -5% 0px',
            threshold: 0.08
        });

        revealElements.forEach(element => {
            if (!element.closest('.hero')) revealObserver.observe(element);
        });
    }

    // Atraso discreto nos cartões para criar um efeito sequencial.
    document.querySelectorAll('.certificate-grid, .skills-grid, .projetos-grid').forEach(grid => {
        grid.querySelectorAll('.certificate-card, .skill-card, .projeto-card').forEach((card, index) => {
            card.style.transitionDelay = `${(index % 4) * 90}ms`;
        });
    });

    // Tilt 3D: os seletores agora correspondem às classes reais do HTML.
    const interactiveCards = document.querySelectorAll('.certificate-card, .projeto-card, .cta-box');
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (supportsHover && !prefersReducedMotion) {
        interactiveCards.forEach(card => {
            card.addEventListener('pointermove', event => {
                if (window.innerWidth < 768 || !card.classList.contains('is-revealed')) return;

                const rect = card.getBoundingClientRect();
                if (!rect.width || !rect.height) return;

                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                const rotateX = (0.5 - y) * 7;
                const rotateY = (x - 0.5) * 7;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('pointerleave', () => {
                card.style.transform = '';
            });
        });
    }

    // Destaque do link da seção atual.
    const sections = document.querySelectorAll('section[id]');
    const updateActiveNavLink = () => {
        const marker = window.scrollY + 140;
        let activeId = '';

        sections.forEach(section => {
            if (marker >= section.offsetTop && marker < section.offsetTop + section.offsetHeight) {
                activeId = section.id;
            }
        });

        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === `#${activeId}`;
            link.classList.toggle('active', Boolean(activeId) && isActive);
        });
    };

    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
});
