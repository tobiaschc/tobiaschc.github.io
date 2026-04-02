// Dark mode toggle with preference persistence
// - Respects `prefers-color-scheme`
// - Saves user choice in localStorage
(function () {
  const storageKey = 'theme-preference';
  const classDark = 'theme-dark';

  const getPreference = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    const isDark = theme === 'dark';
    document.body.classList.toggle(classDark, isDark);
    const toggle = document.getElementById('theme-toggle');
    if (toggle) toggle.setAttribute('aria-pressed', String(isDark));
  };

  // Initialize
  applyTheme(getPreference());

  // Bind toggle
  window.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const header = document.querySelector('.header');
    const menuBtn = document.getElementById('menu-toggle');
    const headerNav = document.getElementById('header-nav');
    if (menuBtn && header && headerNav) {
      menuBtn.addEventListener('click', () => {
        const open = header.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(open));
      });
      // Close menu when a link is clicked
      headerNav.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.tagName === 'A') {
          header.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const next = document.body.classList.contains(classDark) ? 'light' : 'dark';
        localStorage.setItem(storageKey, next);
        applyTheme(next);
      });
    }

    // Update footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Subtle reveal on scroll
    const revealNodes = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        }
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
      revealNodes.forEach((n) => io.observe(n));
    } else {
      // Fallback: reveal immediately
      revealNodes.forEach((n) => n.classList.add('in-view'));
    }

    // Highlight active nav link based on scroll
    const navLinks = Array.from(document.querySelectorAll('.site-nav a, .header-nav a'));
    const sectionIds = navLinks.map((a) => a.getAttribute('href')).filter(Boolean).filter((h) => h.startsWith('#'));
    const sectionEls = sectionIds
      .map((id) => document.querySelector(id))
      .filter((el) => el && (el.id === 'about' || el.id === 'services' || el.id === 'tech' || el.id === 'projects' || el.id === 'writing' || el.id === 'process' || el.id === 'contact'));

    const linkFor = (id) => navLinks.find((a) => a.getAttribute('href') === `#${id}`);
    let activeId = null;

    const setActive = (id) => {
      if (id === activeId) return;
      activeId = id;
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    };

    if ('IntersectionObserver' in window && sectionEls.length) {
      const spy = new IntersectionObserver((entries) => {
        // Choose the most visible entry near the top
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      }, { rootMargin: '-30% 0px -60% 0px', threshold: [0.1, 0.25, 0.5, 0.75, 1] });
      sectionEls.forEach((el) => spy.observe(el));
    }
  });
})();
