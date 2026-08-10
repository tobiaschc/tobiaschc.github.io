# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **minimalist, static single-page portfolio** (no build step, no dependencies for the main site). It's served directly as static HTML/CSS/JS, designed to run on GitHub Pages or Cloudflare Pages.

The main portfolio (`index.html`, `styles.css`, `script.js`) has zero external dependencies. An optional AI chat assistant (`chat-worker/`) is powered by Cloudflare Workers and Llama 3.3 (requires separate deployment).

## Local Development

### Running the Site

No build step needed. Two options:

1. **Direct browser**: Open `index.html` directly in your browser.
2. **Local server** (recommended for testing CSP and clean URLs):
   ```bash
   python3 -m http.server 8080
   ```
   Then visit `http://localhost:8080`

### Editing Content

- **Page content & text**: Edit sections directly in `index.html` (Hero, Experience, About, Services, Tech Stack, Projects, Process, Contact, Footer)
- **Design & colors**: Adjust CSS variables in `styles.css` (look for `--color-*`, `--spacing-*`, `--radius-*`, `--shadow-*`)
- **Interactive behavior**: `script.js` handles dark mode toggle and reveal animations
- **Chat config**: `chat-config.js` sets the Worker URL for the AI widget
- **Favicon**: Replace `assets/favicon.svg`

## Architecture

### Main Files

| File | Purpose |
|------|---------|
| `index.html` | Single page with all sections; semantic HTML with ARIA labels for accessibility |
| `styles.css` | Premium minimal design; CSS variables for theming; supports light/dark modes via `prefers-color-scheme` |
| `script.js` | Dark mode toggle (persists to localStorage), Intersection Observer for reveal animations, AI chat widget init |
| `chat-config.js` | Exposes `CHAT_WORKER_URL` to the page (safe, not a secret) |
| `chat-worker/` | Optional Cloudflare Worker that proxies chat requests to Workers AI |

### Design System

- **Colors**: Light & dark modes automatically applied based on system preference; toggle via header button
- **Layout**: Desktop sidebar nav, mobile header with hamburger menu, responsive flex layout
- **Typography**: Inter Tight (display, headings), Inter (body) from Google Fonts
- **Reveal animations**: Fade-in on scroll using Intersection Observer (triggered at 10% visibility)

### Chat Widget (Optional)

**Hidden by default** — only appears if `CHAT_WORKER_URL` is set in `chat-config.js`.

- `chat-worker/worker.js`: Cloudflare Worker; proxies chat requests to Workers AI with rate limiting
- `chat-worker/config.js` (git-ignored): System prompt, profile data, context for the AI — **never committed**
- `chat-worker/config.example.js`: Template showing structure for `config.js`
- `chat-worker/wrangler.toml`: Worker deployment config (AI binding, KV namespace for rate limits)
- `chat-worker/DEPLOY.md`: Step-by-step deployment guide

To deploy chat: copy `config.example.js` to `config.js`, edit your profile, run `wrangler deploy` from `chat-worker/`, then add the returned URL to `chat-config.js`.

## Key Design Decisions

1. **Zero build step**: Static HTML/CSS/JS. No npm, webpack, or transpiler. Reduces friction for edits and hosting.
2. **Semantic HTML**: Proper heading hierarchy, ARIA labels, skip link for accessibility.
3. **CSS variables for theming**: Easy light/dark mode switching without duplicate CSS.
4. **Vanilla JS only**: No framework; Intersection Observer for animations, localStorage for dark mode persistence.
5. **Chat as optional enhancement**: Widget hidden until deployed; site is fully functional without it.
6. **Workers for chat**: Offloads AI inference to Cloudflare (free tier eligible), keeps site static.

## Common Tasks

### Update Site Content
1. Edit text in `index.html` sections
2. Test locally: `python3 -m http.server 8080`
3. Commit with appropriate message (use the `conventional-commit` skill)
4. Push to `main` → auto-deploys via GitHub/Cloudflare Pages

### Tweak Design
1. Adjust CSS variables in `styles.css` (or add new scoped styles in the appropriate section)
2. Test light & dark modes: toggle theme button locally
3. Verify contrast & readability at viewport sizes (use browser DevTools)

### Update Chat Profile
1. Edit `chat-worker/config.js` (only local, git-ignored)
2. Run `cd chat-worker && wrangler deploy`
3. Verify chat widget works on the live site

### Deploy to Production
- **GitHub Pages**: Push to `main` → Settings → Pages → Deploy from `main` branch, root folder
- **Cloudflare Pages**: Connect repo → Framework: None, Build command: None, Output: `/`

## Styling Notes

- **Focus states**: All interactive elements have `:focus-visible` for keyboard navigation
- **Responsive breakpoints**: Use CSS `@media (max-width: 768px)` and `@media (prefers-color-scheme: dark)`
- **Viewport meta**: Set to `width=device-width, initial-scale=1` for mobile-first design
- **Custom scrollbar** (dark mode): Defined in `::-webkit-scrollbar` rules

## Gitignore & Secrets

- `chat-worker/config.js` is git-ignored: **never commit your system prompt or personal config**
- `.wrangler/` build artifacts ignored
- `.vscode/` and `.idea/` editor configs ignored
- CV source files in `cv/` ignored except `cv/tobias_chavarria_c_CV.pdf` (the published PDF)

## Performance & Accessibility

- **No external JS**: Faster load, no third-party tracking
- **Google Fonts preconnect**: Speeds up font delivery
- **ARIA labels**: Semantic nav, skip link, theme toggle button
- **Dark mode**: Respects system preference, can be overridden with toggle
- **Mobile-friendly**: Hamburger menu on small screens, sidebar nav on desktop
- **Stateless animations**: CSS transitions and Intersection Observer (no janky JS)

## Deployment Notes

Both GitHub Pages and Cloudflare Pages require no build step:
- GitHub: Source = `main` branch, folder = `/`
- Cloudflare: Framework = None, Build command = None, Output directory = `/`

For custom domain: update DNS CNAME and configure in respective hosting dashboard. HTTPS is automatic.
