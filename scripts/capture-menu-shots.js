'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const OUT = '/opt/cursor/artifacts/screenshots';
const PORT = 8765;

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
};

function serve(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  const filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end(); return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

async function shot(page, name) {
  const file = path.join(OUT, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log('saved', file);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = http.createServer(serve);
  await new Promise((resolve) => server.listen(PORT, '127.0.0.1', resolve));

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector('#loading.hidden', { timeout: 15000 });
    await page.waitForSelector('#menu:not(.hidden)', { timeout: 5000 });
    await new Promise((r) => setTimeout(r, 1800));

    await shot(page, 'menu-battle-mobile.png');

    const tabs = [
      ['shop', 'menu-shop-mobile.png'],
      ['pets', 'menu-pets-mobile.png'],
      ['character', 'menu-character-mobile.png'],
      ['inventory', 'menu-equipment-mobile.png'],
    ];
    for (const [tab, file] of tabs) {
      await page.click(`#tabbar .tabbtn[data-tab="${tab}"]`);
      await new Promise((r) => setTimeout(r, 450));
      await shot(page, file);
    }

    await page.click('#settingsbtn');
    await new Promise((r) => setTimeout(r, 350));
    await shot(page, 'menu-settings-mobile.png');

    // Desktop layout
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${PORT}/#battle`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('#loading.hidden', { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 900));
    await shot(page, 'menu-battle-desktop.png');
  } finally {
    await browser.close();
    server.close();
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
