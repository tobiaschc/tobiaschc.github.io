# Tobías Chavarría — Freelance DevOps / Data Engineer Portfolio

A minimalist, fast, and fully static single‑page portfolio to attract B2B clients and demonstrate technical credibility. Built with semantic HTML, modern CSS, and a sprinkle of vanilla JavaScript. Ready for GitHub Pages and Cloudflare Pages.

## File Structure

```
.
├── index.html        # Single-page site with all sections
├── styles.css        # Minimal, premium design with light/dark themes
├── script.js         # Dark mode toggle + subtle reveal animations
├── assets/
│   └── favicon.svg   # Simple SVG favicon
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

