const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { chromium } = require('playwright');

const filePath = resolve(__dirname, '..', 'come-funziona.html');
const html = readFileSync(filePath, 'utf8');
let browser;
let server;
let pageUrl;

test('keeps the how-it-works hero compact and free of a portrait overlay', () => {
  assert.match(
    html,
    /<h1>Prenotare uno studio non &egrave; mai stato cos&igrave; semplice\.<\/h1>/i
  );
  assert.doesNotMatch(html, /<\/?br\b/i);
  assert.doesNotMatch(html, /\.mw-how-hero:before/i);
  assert.match(html, /\.mw-how-page\s+\.mw-how-hero\s*\{[\s\S]*?min-height:\s*clamp\(420px,\s*58vh,\s*540px\)/i);
});

before(async () => {
  server = createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(readFileSync(filePath));
  });
  await new Promise((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));
  pageUrl = `http://127.0.0.1:${server.address().port}/come-funziona.html`;
  browser = await chromium.launch({ channel: 'chrome', headless: true });
});

after(async () => {
  await browser.close();
  await new Promise((resolveServer) => server.close(resolveServer));
});

for (const viewport of [
  { name: 'desktop', width: 1440, height: 1000, maxHeroHeight: 540 },
  { name: 'mobile', width: 390, height: 844, maxHeroHeight: 480 }
]) {
  test(`renders a compact photo-free hero on ${viewport.name}`, async () => {
    const page = await browser.newPage({ viewport });
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });

    const state = await page.locator('.mw-how-hero').evaluate((hero) => ({
      height: Math.round(hero.getBoundingClientRect().height),
      overlayContent: getComputedStyle(hero, '::before').content,
      overflow: document.documentElement.scrollWidth > window.innerWidth
    }));
    assert.equal(state.overlayContent, 'none');
    assert.ok(state.height <= viewport.maxHeroHeight, `hero is ${state.height}px tall`);
    assert.equal(state.overflow, false);

    await page.close();
  });
}
