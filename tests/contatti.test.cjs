const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { chromium } = require('playwright');

const filePath = resolve(__dirname, '..', 'contatti.html');
const html = readFileSync(filePath, 'utf8');
const markup = html.replace(/<style[\s\S]*?<\/style>/gi, '');
let browser;
let server;
let pageUrl;

test('uses the approved no-header contact hub without form placeholders', () => {
  assert.match(markup, /Un contatto diretto\.[\s\S]*Una risposta concreta\./i);
  assert.doesNotMatch(markup, /<header\b/i);
  assert.doesNotMatch(markup, /<form\b|<input\b|<textarea\b/i);
  assert.doesNotMatch(markup, /Via Esempio|0546 1234567|Mappa di Faenza|Placeholder/i);
  assert.doesNotMatch(markup, /Lun\s*-\s*Ven|Sab:\s*09:00/i);
});

test('publishes only verified MediWell contact destinations', () => {
  assert.match(html, /href="https:\/\/wa\.me\/393930593500"/i);
  assert.match(html, /href="tel:\+393930593500"/i);
  assert.match(html, /href="mailto:info@mediwell\.it"/i);
  assert.match(html, /href="mailto:meeby@pec\.it"/i);
  assert.match(html, /Via Fornarina,?\s*12\/D/i);
  assert.match(html, /google\.com\/maps\/search\/\?api=1&amp;query=/i);
  assert.match(html, /wp-content\/uploads\/2026\/06\/WA_colori\.png/i);
});

test('keeps the canonical MediWell footer', () => {
  assert.match(html, /<footer class="mw-footer" aria-label="Footer MediWell">/i);
  assert.match(html, /P\.IVA:\s*02550260398/i);
  assert.match(html, /R\.Imprese:\s*RA212065/i);
});

before(async () => {
  server = createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(readFileSync(filePath));
  });
  await new Promise((resolveServer) => server.listen(0, '127.0.0.1', resolveServer));
  pageUrl = `http://127.0.0.1:${server.address().port}/contatti.html`;
  browser = await chromium.launch({ channel: 'chrome', headless: true });
});

after(async () => {
  await browser.close();
  await new Promise((resolveServer) => server.close(resolveServer));
});

for (const viewport of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 }
]) {
  test(`renders the WhatsApp contact hub without overflow on ${viewport.name}`, async () => {
    const page = await browser.newPage({ viewport });
    await page.goto(pageUrl, { waitUntil: 'domcontentloaded' });

    const cta = page.locator('.mw-contact-whatsapp');
    await assert.doesNotReject(() => cta.waitFor({ state: 'visible' }));
    assert.equal(await cta.getAttribute('href'), 'https://wa.me/393930593500');
    assert.equal(await page.locator('form').count(), 0);
    assert.equal(await page.locator('header').count(), 0);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      true
    );

    const spacing = await page.evaluate(() => {
      const grid = document.querySelector('.mw-contact-grid').getBoundingClientRect();
      const location = document.querySelector('.mw-contact-location').getBoundingClientRect();
      const footer = document.querySelector('.mw-footer').getBoundingClientRect();
      return {
        above: Math.round(location.top - grid.bottom),
        below: Math.round(footer.top - location.bottom)
      };
    });
    assert.ok(
      Math.abs(spacing.above - spacing.below) <= 2,
      `location card spacing is unbalanced: ${spacing.above}px above, ${spacing.below}px below`
    );

    await page.close();
  });
}
