const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const rootDir = resolve(__dirname, '..');
const bookingCopyFiles = [
  'prenota.html',
  'come-funziona.html',
  'studio-uno.html',
  'studio-due.html',
  'studio-tre.html',
  'studio-quattro.html',
  'studio-cinque.html',
  'chi-siamo.html',
  'homepage.html',
  'carrello.html',
  'checkout.html',
  'mio-account.html'
];

const misleadingBookingPatterns = [
  /tariffe?\s+orarie/i,
  /fascia\s+oraria/i,
  /slot/i,
  /pacchetto\s+ore/i,
  /prenoti\s+solo\s+le\s+ore/i,
  /ore\s+che\s+ti\s+servono/i,
  /disponibilit(?:&agrave;|à)\s+e\s+orari/i
];

test('keeps booking copy aligned to full-day reservations', () => {
  for (const fileName of bookingCopyFiles) {
    const html = readFileSync(resolve(rootDir, fileName), 'utf8');

    for (const pattern of misleadingBookingPatterns) {
      assert.doesNotMatch(html, pattern, `${fileName} contains misleading hourly booking copy`);
    }
  }
});
