const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { chromium } = require('playwright');

const filePath = resolve(__dirname, '..', 'prenota.html');
const html = readFileSync(filePath, 'utf8');
let browser;
let server;
let pageUrl;

test('keeps the booking hero compact and free of a portrait overlay', () => {
  assert.doesNotMatch(html, /\.mw-booking-header:before/i);
  assert.match(
    html,
    /\.mw-prenota-container\s+\.mw-booking-header\s*\{[\s\S]*?min-height:\s*clamp\(380px,\s*52vh,\s*500px\)/i
  );
});

before(async () => {
  server = createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(readFileSync(filePath));
  });
  await new Promise((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));
  pageUrl = `http://127.0.0.1:${server.address().port}/prenota.html`;
  browser = await chromium.launch({ channel: 'chrome', headless: true });
});

after(async () => {
  await browser.close();
  await new Promise((resolveServer) => server.close(resolveServer));
});

for (const viewport of [
  { name: 'desktop', width: 1440, height: 1000, maxHeroHeight: 500 },
  { name: 'mobile', width: 390, height: 844, maxHeroHeight: 390 }
]) {
  test(`renders a readable photo-free booking hero on ${viewport.name}`, async () => {
    const page = await browser.newPage({ viewport });
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });

    const state = await page.locator('.mw-booking-header').evaluate((hero) => {
      const title = hero.querySelector('h1');
      const subtitle = hero.querySelector('.mw-subtitle');
      const heroBox = hero.getBoundingClientRect();
      const titleBox = title.getBoundingClientRect();
      const subtitleBox = subtitle.getBoundingClientRect();

      return {
        height: Math.round(heroBox.height),
        overlayContent: getComputedStyle(hero, '::before').content,
        titleInside: titleBox.left >= heroBox.left && titleBox.right <= heroBox.right,
        subtitleInside: subtitleBox.left >= heroBox.left && subtitleBox.right <= heroBox.right,
        overflow: document.documentElement.scrollWidth > window.innerWidth
      };
    });

    assert.equal(state.overlayContent, 'none');
    assert.ok(state.height <= viewport.maxHeroHeight, `hero is ${state.height}px tall`);
    assert.equal(state.titleInside, true);
    assert.equal(state.subtitleInside, true);
    assert.equal(state.overflow, false);

    await page.close();
  });
}
