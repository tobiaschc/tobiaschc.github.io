# Tobías Chavarría — Freelance DevOps / Data Engineer Portfolio

A minimalist, fast, and fully static single‑page portfolio to attract B2B clients and demonstrate technical credibility. Built with semantic HTML, modern CSS, and a sprinkle of vanilla JavaScript. Ready for GitHub Pages and Cloudflare Pages.

## File Structure

```
.
├── index.html          # Single-page site with all sections
├── styles.css          # Minimal, premium design with light/dark themes
├── script.js           # Dark mode toggle, reveal animations, AI chat widget
├── chat-config.js      # Worker URL for the AI chat (safe to commit, not secret)
├── chat-worker/        # Cloudflare Worker powering the AI chat assistant
│   ├── worker.js        # Proxy to Workers AI — no need to edit
│   ├── config.js         # 🔒 gitignored — your system prompt, filled from config.example.js
│   ├── config.example.js # Template for your Worker config
│   ├── wrangler.toml     # Worker deployment config
│   └── DEPLOY.md         # Step-by-step chat setup guide
├── assets/
│   └── favicon.svg    # Simple SVG favicon
├── .gitignore
└── README.md
```

## Local Usage

- Open `index.html` directly in a browser, or
- Serve locally (optional) for clean URLs and CSP testing:
  - Python: `python3 -m http.server 8080` then visit `http://localhost:8080`

No build step, no dependencies.

## Deploy on GitHub Pages

1. Create a new GitHub repository and push this project.
2. In GitHub: Settings → Pages → Build and deployment.
3. Source: Deploy from a branch → Branch: `main` → Folder: `/ (root)` → Save.
4. Your site will be available at `https://<username>.github.io/<repo>`.

Optional (custom domain):
- Set your domain’s DNS `CNAME` to `<username>.github.io`.
- In GitHub Pages, set Custom domain to your domain (e.g., `tobiaschavarria.com`).
- Enable HTTPS.

## Deploy on Cloudflare Pages

1. Create a new project and connect your GitHub repository.
2. Build settings:
   - Framework preset: None
   - Build command: None
   - Output directory: `/`
3. Deploy. Cloudflare will serve the static files as-is.

Custom domain on Cloudflare Pages:
- Add your domain in Pages → Custom domains and follow the DNS wizard.
- Ensure `www` and apex are covered (CNAME/ALIAS as instructed by Cloudflare).

## AI Chat Assistant (optional)

A floating chat widget lets visitors ask questions about your background. It's powered by Llama 3.3 via Cloudflare Workers AI, proxied through a Cloudflare Worker — no server to maintain, runs on Cloudflare's free tier.

The widget is **hidden by default** and only appears once `CHAT_WORKER_URL` in `chat-config.js` is set — nothing to break until you deploy it.

**Setup:**

1. Configure your profile:
   ```bash
   cp chat-worker/config.example.js chat-worker/config.js
   ```
   Edit `chat-worker/config.js` — it's pre-filled with your current experience, skills, and services from this site, but review it and keep it in sync as your background changes. This file is gitignored and never committed.

2. Deploy the Worker — full steps in [chat-worker/DEPLOY.md](chat-worker/DEPLOY.md):
   ```bash
   cd chat-worker
   npm install -g wrangler
   wrangler login
   wrangler kv:namespace create RATE_LIMIT_KV   # paste the id into wrangler.toml
   wrangler deploy
   ```

3. Add the resulting Worker URL to `chat-config.js`:
   ```js
   const CHAT_WORKER_URL = "https://tobiaschc-cv-chat.yoursubdomain.workers.dev";
   ```

Redeploy the Worker (`wrangler deploy`) any time you update `chat-worker/config.js`.

## Edit Content

- Page content: `index.html` (sections: Hero, About, Services, Tech Stack, Projects, Process, Contact, Footer)
- Copy tweaks: edit inline text in each section in `index.html`
- Design: adjust CSS variables (colors, spacing, radii, shadows) in `styles.css`
- Dark mode behavior & reveal animation: `script.js`
- Favicon: replace `assets/favicon.svg` with your own if desired

## Customization Checklist

- [ ] Update `<title>` and meta description in `index.html`
- [ ] Replace `og:url` canonical link with your domain
- [ ] Update email (`mailto:`) in Contact section
- [ ] Update LinkedIn and GitHub profile URLs
- [ ] Swap example project details with real projects
- [ ] Adjust color variables in `styles.css` to your brand
- [ ] Verify contrast in both light/dark modes
- [ ] Test keyboard navigation and focus states
- [ ] Deploy to GitHub Pages and/or Cloudflare Pages
- [ ] Set up custom domain and HTTPS
- [ ] (Optional) Deploy the AI chat Worker and set `CHAT_WORKER_URL` in `chat-config.js`

## License (MIT)

Copyright (c) 2026 Tobías Chavarría

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

