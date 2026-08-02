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

    // AI chat widget
    const workerUrl = typeof CHAT_WORKER_URL !== 'undefined' ? CHAT_WORKER_URL : '';
    if (workerUrl) initChatWidget(workerUrl);
  });

  function initChatWidget(workerUrl) {
    const fab = document.getElementById('chat-fab');
    const panel = document.getElementById('chat-panel');
    const closeBtn = document.getElementById('chat-close');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const messagesEl = document.getElementById('chat-messages');
    const suggestionsEl = document.getElementById('chat-suggestions');
    if (!fab || !panel || !form || !input || !messagesEl) return;

    const SUGGESTIONS = [
      "What are you working on now?",
      "What kind of projects do you take on?",
      "What's your tech stack?",
      "How can I contact you?",
    ];

    let history = [];
    let initialized = false;
    let isLoading = false;
    let open = false;

    fab.hidden = false;

    function appendBubble(role, text) {
      const el = document.createElement('div');
      el.className = `chat-bubble ${role}`;
      el.textContent = text;
      messagesEl.appendChild(el);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return el;
    }

    function renderSuggestions() {
      if (!suggestionsEl) return;
      suggestionsEl.innerHTML = '';
      SUGGESTIONS.forEach((q) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chat-suggestion';
        btn.textContent = q;
        btn.addEventListener('click', () => {
          input.value = q;
          suggestionsEl.innerHTML = '';
          sendMessage();
        });
        suggestionsEl.appendChild(btn);
      });
    }

    function initChat() {
      if (initialized) return;
      initialized = true;
      appendBubble('assistant', "Hi! I'm an AI assistant trained on Tobías's background. Ask me anything.");
      renderSuggestions();
    }

    function setOpen(next) {
      open = next;
      panel.classList.toggle('open', open);
      panel.setAttribute('aria-hidden', String(!open));
      if (open) {
        initChat();
        setTimeout(() => input.focus(), 150);
      }
    }

    fab.addEventListener('click', () => setOpen(!open));
    closeBtn?.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && open) setOpen(false);
    });

    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 90) + 'px';
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    async function sendMessage() {
      if (isLoading) return;
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      input.style.height = 'auto';
      appendBubble('user', text);
      history.push({ role: 'user', content: text });

      const typingEl = appendBubble('assistant', 'thinking…');
      typingEl.classList.add('typing');
      isLoading = true;
      sendBtn.disabled = true;

      try {
        const res = await fetch(workerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history.slice(-10) }),
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        typingEl.remove();
        appendBubble('assistant', data.reply);
        history.push({ role: 'assistant', content: data.reply });
      } catch (err) {
        typingEl.remove();
        appendBubble('assistant', 'Sorry, something went wrong. Please try again or reach out directly.');
      } finally {
        isLoading = false;
        sendBtn.disabled = false;
      }
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      sendMessage();
    });
  }
})();
