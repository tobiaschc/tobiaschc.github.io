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
    const sectionEls = navLinks
      .map((a) => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    if (sectionEls.length) {
      let activeId = null;
      let lockUntil = 0;

      const applyActive = (id) => {
        if (id === activeId) return;
        activeId = id;
        navLinks.forEach((a) => {
          const match = a.getAttribute('href') === '#' + id;
          if (match) a.classList.add('active');
          else a.classList.remove('active');
        });
      };

      // On nav click: highlight immediately, lock scroll detection
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          const id = link.getAttribute('href');
          if (!id) return;
          applyActive(id.substring(1));
          lockUntil = Date.now() + 1500;
        });
      });

      const detectActiveSection = () => {
        if (Date.now() < lockUntil) return;

        const windowH = window.innerHeight;

        // Walk sections bottom-to-top: first one whose top is in
        // the upper 60% of the viewport wins
        for (let i = sectionEls.length - 1; i >= 0; i--) {
          const rect = sectionEls[i].getBoundingClientRect();
          if (rect.top < windowH * 0.6) {
            applyActive(sectionEls[i].id);
            return;
          }
        }

        // Fallback: first section
        applyActive(sectionEls[0].id);
      };

      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(() => {
            detectActiveSection();
            ticking = false;
          });
        }
      }, { passive: true });
      detectActiveSection();
    }
  });
})();
