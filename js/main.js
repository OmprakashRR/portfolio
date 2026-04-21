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

    /* ==================== QUICK NAV ==================== */
    const quickNav = document.getElementById('quickNav');
    const quickNavToggle = document.getElementById('quickNavToggle');
    const quickNavMenu = document.getElementById('quickNavMenu');

    // Show after scrolling past hero
    window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight * 0.5) {
            quickNav.classList.add('visible');
        } else {
            quickNav.classList.remove('visible');
            quickNav.classList.remove('open');
        }
    }, { passive: true });

    quickNavToggle.addEventListener('click', () => {
        quickNav.classList.toggle('open');
    });

    // Close menu and smooth scroll on link click
    quickNavMenu.querySelectorAll('.qn-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
                const top = target.getBoundingClientRect().top + window.scrollY - navH;
                window.scrollTo({ top, behavior: 'smooth' });
            }
            quickNav.classList.remove('open');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!quickNav.contains(e.target)) {
            quickNav.classList.remove('open');
        }
    });

    /* ==================== AI CHAT ==================== */
    const AI_ENDPOINT = 'https://digital-twin.omprakashrr.workers.dev/';
    const aiChat = document.getElementById('aiChat');
    const aiToggle = document.getElementById('aiChatToggle');
    const aiForm = document.getElementById('aiChatForm');
    const aiInput = document.getElementById('aiChatText');
    const aiSend = document.getElementById('aiChatSend');
    const aiMessages = document.getElementById('aiChatMessages');
    const aiHistory = [];

    aiToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        aiChat.classList.toggle('open');
        if (aiChat.classList.contains('open')) {
            setTimeout(() => aiInput.focus(), 100);
        }
    });

    function appendMessage(role, text) {
        const div = document.createElement('div');
        div.className = `ai-msg ai-msg-${role}`;
        div.textContent = text;
        aiMessages.appendChild(div);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        return div;
    }

    function appendTyping() {
        const div = document.createElement('div');
        div.className = 'ai-msg ai-msg-bot ai-msg-typing';
        div.innerHTML = '<span></span><span></span><span></span>';
        aiMessages.appendChild(div);
        aiMessages.scrollTop = aiMessages.scrollHeight;
        return div;
    }

    aiForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = aiInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        aiHistory.push({ role: 'user', content: text });
        aiInput.value = '';
        aiSend.disabled = true;

        const typing = appendTyping();

        try {
            const res = await fetch(AI_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: aiHistory }),
            });
            const data = await res.json();
            typing.remove();

            if (data.reply) {
                appendMessage('bot', data.reply);
                aiHistory.push({ role: 'assistant', content: data.reply });
            } else {
                appendMessage('bot', "Sorry, I'm having trouble responding right now. Please try again, or email omprakash.rethnam@tudublin.ie directly.");
            }
        } catch (err) {
            typing.remove();
            appendMessage('bot', "Sorry, I couldn't connect. Please try again in a moment.");
        } finally {
            aiSend.disabled = false;
            aiInput.focus();
        }
    });

})();
