/* ============================================================
   OMPRAKASH RAMALINGAM RETHNAM — ACADEMIC PORTFOLIO
   main.js
   ============================================================ */

(function () {
    'use strict';

    /* ==================== THEME TOGGLE ==================== */
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');

    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    /* ==================== NAVBAR SCROLL ==================== */
    const navbar = document.getElementById('navbar');

    const handleScroll = () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNav();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    /* ==================== ACTIVE NAV LINK ==================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    /* ==================== HAMBURGER MENU ==================== */
    const hamburger = document.getElementById('hamburger');
    const navLinksEl = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinksEl.classList.toggle('open');
    });

    // Close on nav link click (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinksEl.classList.remove('open');
        });
    });

    /* ==================== SMOOTH SCROLL ==================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
            const top = target.getBoundingClientRect().top + window.scrollY - navH;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ==================== SCROLL REVEAL ==================== */
    const animateEls = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });

    animateEls.forEach(el => observer.observe(el));

    // Immediately reveal anything already in the viewport (e.g. fast page loads)
    setTimeout(() => {
        animateEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    }, 50);

    /* ==================== PUBLICATION FILTER ==================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const pubGroups = document.querySelectorAll('.pub-year-group');
    const pubCountEl = document.getElementById('pubCount');

    function updatePubCount(filter) {
        let count = 0;
        pubGroups.forEach(g => {
            if (filter === 'all' || g.getAttribute('data-type') === filter) count++;
        });
        pubCountEl.textContent = `${count} publication${count !== 1 ? 's' : ''}`;
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update button states
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show/hide publication groups
            pubGroups.forEach(group => {
                const type = group.getAttribute('data-type');
                if (filter === 'all' || type === filter) {
                    group.classList.remove('hidden');
                } else {
                    group.classList.add('hidden');
                }
            });

            updatePubCount(filter);
        });
    });

    updatePubCount('all');

    /* ==================== PROGRESS BAR ==================== */
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        background: linear-gradient(90deg, #3b82f6, #8b5cf6);
        z-index: 9999;
        transition: width 0.1s linear;
        pointer-events: none;
    `;
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const pct = Math.min((scrollTop / docHeight) * 100, 100);
        progressBar.style.width = pct + '%';
    }, { passive: true });

})();
