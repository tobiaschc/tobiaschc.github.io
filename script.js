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
    document.querySelectorAll('.theme-toggle').forEach((t) => {
      t.setAttribute('aria-pressed', String(isDark));
    });
  };

  applyTheme(getPreference());

  window.addEventListener('DOMContentLoaded', () => {
    // Mobile menu
    const header = document.querySelector('.header');
    const menuBtn = document.getElementById('menu-toggle');
    const headerNav = document.getElementById('header-nav');

    if (menuBtn && header && headerNav) {
      headerNav.setAttribute('hidden', '');

      const setMenu = (open) => {
        header.classList.toggle('open', open);
        document.body.classList.toggle('menu-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        if (open) headerNav.removeAttribute('hidden');
        else headerNav.setAttribute('hidden', '');
      };

      menuBtn.addEventListener('click', () => setMenu(!header.classList.contains('open')));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && header.classList.contains('open')) setMenu(false);
      });
      window.matchMedia('(min-width: 881px)').addEventListener('change', () => setMenu(false));
      headerNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') setMenu(false);
      });
    }

    // Theme toggles
    document.querySelectorAll('.theme-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        const next = document.body.classList.contains(classDark) ? 'light' : 'dark';
        localStorage.setItem(storageKey, next);
        applyTheme(next);
      });
    });

    // Footer year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    // Scroll reveal
    const revealNodes = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        }
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
      revealNodes.forEach((n) => io.observe(n));
    } else {
      revealNodes.forEach((n) => n.classList.add('in-view'));
    }

    // Active nav tracking
    const navLinks = Array.from(document.querySelectorAll('.site-nav a'));
    const sectionIds = navLinks.map((a) => a.getAttribute('href')).filter((h) => h && h.startsWith('#'));
    const sectionEls = sectionIds.map((id) => document.querySelector(id)).filter(Boolean);

    let activeId = null;
    const setActive = (id) => {
      if (id === activeId) return;
      activeId = id;
      navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    };

    if ('IntersectionObserver' in window && sectionEls.length) {
      const spy = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      }, { rootMargin: '-20% 0px -60% 0px', threshold: [0.1, 0.3, 0.5, 0.75] });
      sectionEls.forEach((el) => spy.observe(el));
    }
  });
})();
