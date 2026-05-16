// Minimal local screenshot script using Playwright
// - Serves the repo locally (no external network)
// - Captures mobile screenshots without printing them here

import { createServer } from 'http';
import { stat, readFile, mkdir } from 'fs/promises';
import { extname, join, resolve } from 'path';
import { chromium } from 'playwright';

const root = resolve(process.cwd());
const port = 8787;
const outDir = join(root, 'assets', '_screens');

const types = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
]);

const server = createServer(async (req, res) => {
  try {
    const urlPath = req.url === '/' ? '/index.html' : req.url;
    const filePath = join(root, decodeURIComponent(urlPath.split('?')[0].replace(/^\//, '')));
    const st = await stat(filePath);
    if (!st.isFile()) throw new Error('Not a file');
    const data = await readFile(filePath);
    const ct = types.get(extname(filePath).toLowerCase()) || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': ct });
    res.end(data);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

async function ensureDir(dir) {
  try { await mkdir(dir, { recursive: true }); } catch {}
}

async function run() {
  await ensureDir(outDir);
  await new Promise((resolve) => server.listen(port, resolve));

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const url = `http://localhost:${port}/index.html`;

  const sizes = [
    { name: 'iphone-se', width: 320, height: 720 },
    { name: 'iphone-12pro', width: 390, height: 844 },
    { name: 'pixel-7', width: 412, height: 915 },
  ];

  for (const s of sizes) {
    await page.setViewportSize({ width: s.width, height: s.height });
    await page.goto(url, { waitUntil: 'networkidle' });
    // Give reveal/JS a moment to settle
    await page.waitForTimeout(350);
    const outPath = join(outDir, `mobile-${s.name}.png`);
    await page.screenshot({ path: outPath, fullPage: false });
  }

  await browser.close();
  server.close();
}

run().catch((err) => {
  console.error(err);
  try { server.close(); } catch {}
  process.exit(1);
});

