(function () {
    'use strict';
    const root = document.documentElement;
    const button = document.getElementById('labTheme');
    function setTheme(theme) {
        root.dataset.theme = theme === 'dark' ? 'dark' : 'light';
        if (button) {
            button.textContent = root.dataset.theme === 'dark' ? 'Light theme' : 'Dark theme';
            button.setAttribute('aria-label', 'Switch to ' + (root.dataset.theme === 'dark' ? 'light' : 'dark') + ' theme');
        }
    }
    let saved = 'light';
    try { saved = localStorage.getItem('theme') || 'light'; } catch (_) { /* Local downloads may disable storage. */ }
    setTheme(saved);
    if (button) button.addEventListener('click', function () {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        try { localStorage.setItem('theme', next); } catch (_) { /* Theme still works for this page. */ }
    });
})();
