const { test } = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const rootDir = resolve(__dirname, '..');

const pages = [
  {
    fileName: 'carrello.html',
    title: 'Carrello',
    shortcode: '[woocommerce_cart]',
    requiredCopy: [
      /riepiloga le richieste di prenotazione/i,
      /giornata intera/i
    ]
  },
  {
    fileName: 'checkout.html',
    title: 'Checkout',
    shortcode: '[woocommerce_checkout]',
    requiredCopy: [
      /completa la prenotazione/i,
      /pagamento sicuro/i,
      /giornata intera/i
    ]
  },
  {
    fileName: 'mio-account.html',
    title: 'Area personale',
    shortcode: '[woocommerce_my_account]',
    requiredCopy: [
      /ordini/i,
      /informazioni di prenotazione/i
    ]
  }
];

const misleadingBookingPatterns = [
  /tariffe?\s+orarie/i,
  /fascia\s+oraria/i,
  /fasce\s+orarie/i,
  /slot/i,
  /pacchetto\s+ore/i,
  /booking by hour/i,
  /hourly/i
];

test('adds MediWell WooCommerce shortcode wrapper pages', () => {
  for (const page of pages) {
    const filePath = resolve(rootDir, page.fileName);
    assert.equal(existsSync(filePath), true, `${page.fileName} should exist`);

    const html = readFileSync(filePath, 'utf8');
    assert.match(html, new RegExp(`<title>${page.title} \\| MediWell<\\/title>`, 'i'));
    assert.match(html, new RegExp(`<h1>${page.title}<\\/h1>`, 'i'));
    assert.equal((html.match(new RegExp(page.shortcode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length, 1);
    assert.match(html, /class="mw-woocommerce-page"/);
    assert.match(html, /class="mw-woocommerce-shortcode-card"/);
    assert.match(html, /<footer class="mw-footer" aria-label="Footer MediWell">/);

    for (const requiredCopy of page.requiredCopy) {
      assert.match(html, requiredCopy, `${page.fileName} missing expected copy`);
    }

    for (const misleadingPattern of misleadingBookingPatterns) {
      assert.doesNotMatch(html, misleadingPattern, `${page.fileName} contains misleading hourly wording`);
    }
  }
});
