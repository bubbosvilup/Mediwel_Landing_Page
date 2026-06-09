const { test } = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const html = readFileSync(resolve(__dirname, '..', 'index.html'), 'utf8');
const text = html.replace(/\s+/g, ' ');
const cssPath = resolve(__dirname, '..', 'styles', 'mediwell-premium-balanced.css');
const css = html.match(/<style id="mediwell-styles">([\s\S]*?)<\/style>/i)?.[1] || '';
const stylesDir = resolve(__dirname, '..', 'styles');

function collectCssFiles(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  const entries = [];
  for (const entry of require('node:fs').readdirSync(dir, { withFileTypes: true })) {
    const entryPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') {
        continue;
      }
      entries.push(...collectCssFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith('.css')) {
      entries.push(entryPath);
    }
  }

  return entries;
}

test('keeps HTML CSS and safe JavaScript embedded in one WordPress-compatible page', () => {
  assert.match(html, /<style id="mediwell-styles">[\s\S]*?<\/style>/i);
  assert.match(html, /<script>[\s\S]*?IntersectionObserver[\s\S]*?<\/script>/i);
  assert.doesNotMatch(html, /<link\s+rel="stylesheet"/i);
  assert.doesNotMatch(html, /@import/i);
  assert.equal(existsSync(cssPath), false);
  assert.deepEqual(collectCssFiles(stylesDir), []);
  assert.doesNotMatch(html, /<nav[\s>]/i);
  assert.match(html, /<footer class="mw-footer" aria-label="Footer MediWell">/i);
  assert.match(html, /<div class="mw-footer-orbits" aria-hidden="true">/i);
  assert.match(css, /\.mw-footer-orb-1\s*\{[\s\S]*--mw-orb-color:\s*rgba\(81,\s*193,\s*147,\s*0\.26\)/i);
  assert.match(css, /@keyframes\s+mw-footer-drift-a/i);
  assert.doesNotMatch(html, /mw-footer-bubbles|mw-bubble|float-bubble/i);
  assert.doesNotMatch(html, /Ã|Â|â|�/);
  assert.match(html, /COLORI PRINCIPALI DEL DESIGN PRECEDENTE/);
});

test('uses the client hero and pricing copy without forbidden wording or individual studio cards', () => {
  assert.doesNotMatch(text, /\bambulatori?\b/i);
  assert.doesNotMatch(text, /\bASL\b/i);
  assert.doesNotMatch(text, /\bcertificat\w*\b/i);
  assert.doesNotMatch(text, /mezzi pubblici/i);
  assert.doesNotMatch(text, /Studio (Medico )?(Uno|Due|Tre|Quattro|Cinque|[1-5])/i);
  assert.match(text, /Nuova apertura a Faenza/i);
  assert.match(text, /2 settembre 2026/i);
  assert.match(text, /Studi sanitari pronti all'uso, prenotabili a giornata\./i);
  assert.match(html, /class="mw-kicker"[\s\S]*?<strong>Nuova apertura a Faenza<\/strong>/i);
  assert.doesNotMatch(text, /: ottimizza i costi, azzera gli sprechi e blocca la tua giornata ideale prima del lancio ufficiale/i);
  assert.match(html, /<p class="mw-section-index"><span>01<\/span> Il modello<\/p>[\s\S]*?<h2 id="costi-title">Condivisione intelligente e tariffe trasparenti<\/h2>/);
  assert.match(text, /Fino a €98,00 al giorno · IVA inclusa/i);
  assert.match(text, /prenotazioni avvengono esclusivamente a giornata intera/i);
  assert.match(text, /non è richiesto alcun investimento iniziale/i);
});

test('presents the client studios overview once', () => {
  assert.match(html, /<p class="mw-section-index"><span>02<\/span> Gli spazi<\/p>[\s\S]*?<h2 id="studi-title">Arredi a regolazione elettrica in un contesto esclusivo<\/h2>/);
  assert.match(text, /metrature da 12 a 15 mq/);
  assert.match(text, /scrivanie regolabili motorizzate/i);
  assert.match(text, /sedie comfort per pazienti o clienti/i);
  assert.match(text, /appendiabiti/i);
  assert.match(text, /armadietti di archiviazione con chiave privata/i);
  assert.match(text, /lettini medici elettrici/i);
  assert.match(text, /lettini fisioterapici elettrici/i);
  assert.match(text, /poltrone multifunzionali elettriche/i);
});

test('explains the three-step technology flow with the client details', () => {
  assert.match(html, /<p class="mw-section-index"><span>03<\/span> Sistema smart<\/p>[\s\S]*?<h2 id="tecnologia-title">Indipendenza operativa e tutela della privacy<\/h2>/i);
  assert.match(text, /Prenotazione online:/i);
  assert.match(text, /www\.mediwell\.it/i);
  assert.match(text, /disponibilità in tempo reale/i);
  assert.match(text, /Accesso autonomo:/i);
  assert.match(text, /codice digitale personale/i);
  assert.match(text, /tastiera elettronica/i);
  assert.match(text, /dalle 7:00 alle 20:00/i);
  assert.match(text, /Citofono privato:/i);
  assert.match(text, /citofono privato collegato alla tua stanza/i);
});

test('keeps the parking message and the September 2 2026 launch countdown', () => {
  assert.match(text, /Dove siamo: posizione strategica a Faenza senza stress da parcheggio/i);
  assert.match(text, /Via Fornarina 12\/D a Faenza/i);
  assert.match(text, /100 metri/i);
  assert.match(text, /parcheggio ampio e completamente gratuito/i);
  assert.match(text, /2 settembre 2026/i);
  assert.match(html, /2026-09-02T07:00:00\+02:00/);
  assert.match(text, /all'Apertura Ufficiale/i);
});

test('keeps WhatsApp outside the demonstrative required-fields form', () => {
  const form = html.match(/<form\b[\s\S]*?<\/form>/i)?.[0] || '';
  assert.ok(form, 'expected a form element');
  assert.doesNotMatch(form, /wa\.me/i);
  assert.match(html, /wa\.me\/393930593500/i);
  assert.match(form, /name="nome-cognome"[\s\S]*?required/i);
  assert.match(form, /name="professione"[\s\S]*?required/i);
  assert.match(form, /name="telefono"[\s\S]*?required/i);
  assert.match(form, /name="email"[\s\S]*?required/i);
  assert.match(form, /name="privacy"[\s\S]*?required/i);
  assert.match(form, /Compila il modulo per bloccare la tua precedenza/i);
  assert.match(form, /Professione o Specializzazione/i);
  assert.match(form, /Numero di Telefono o WhatsApp/i);
  assert.match(html, /data-demo="true"/);
});

test('keeps the WhatsApp contact fixed when embedded inside WordPress content', () => {
  assert.match(html, /<aside class="mw-floating-contact" aria-label="Contatto rapido">/);
  assert.match(css, /\.mw-floating-contact\s*\{[\s\S]*position:\s*fixed/i);
  assert.match(css, /\.mw-floating-contact\s+a\s*\{[\s\S]*width:\s*56px[\s\S]*height:\s*56px/i);
  assert.match(css, /\.mw-floating-contact\s+svg\s*\{[\s\S]*width:\s*25px[\s\S]*height:\s*25px/i);
  assert.doesNotMatch(css, /body\s*>\s*aside/);
});

test('keeps the inline premium variant responsive and accessible', () => {
  assert.ok(css, 'expected the isolated premium CSS variant');
  assert.match(css, /--mw-blue:\s*#0c4b80/i);
  assert.match(css, /--mw-pink:\s*#c1517f/i);
  assert.match(css, /--mw-green:\s*#51c193/i);
  assert.match(css, /\.mw-floating-contact\s*\{[\s\S]*position:\s*fixed/i);
  assert.match(css, /#costi\s*\{[^}]*overflow:\s*hidden/i);
  assert.match(css, /:focus-visible/i);
  assert.match(css, /@media\s*\(min-width:\s*768px\)/i);
  assert.match(css, /@media\s*\(min-width:\s*1024px\)/i);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
});

test('uses remote MediWell photography and progressive reveal hooks', () => {
  for (const source of [
    'https://mediwell.it/wp-content/uploads/2026/06/sala_attesa_1600x1124.jpeg',
    'https://mediwell.it/wp-content/uploads/2026/06/studio_overview_1024x1024.jpeg',
    'https://mediwell.it/wp-content/uploads/2026/06/attaccapanni_1500x1500.jpeg'
  ]) {
    assert.match(html, new RegExp(source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }

  assert.match(html, /class="[^"]*mw-hero-visual/i);
  assert.match(html, /class="[^"]*mw-reveal/i);
  assert.match(html, /IntersectionObserver/);
});

test('adds selective motion while preserving reduced-motion support', () => {
  assert.match(html, /mw-reveal-left/);
  assert.match(html, /mw-reveal-right/);
  assert.match(html, /mw-reveal-stagger/);
  assert.match(html, /mw-launch-date/);
  assert.match(html, /mw-countdown-reveal/);
  assert.match(css, /--mw-item-delay/);
  assert.match(html, /style\.setProperty\('--mw-item-delay'/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
});

test('uses the official logo and optimized remote photography markup', () => {
  assert.match(
    html,
    /<img class="mw-brand-logo" src="https:\/\/mediwell\.it\/wp-content\/uploads\/2026\/06\/logoMedi_Centrato\.png"/
  );
  assert.doesNotMatch(html, /class="mw-brand-mark"/);
  const heroShell = html.match(/<div class="mw-photo-shell">[\s\S]*?<\/div>/)?.[0] || '';
  assert.ok(heroShell, 'expected hero image shell');
  const heroImage = heroShell.match(
    /<img[\s\S]*?src="https:\/\/mediwell\.it\/wp-content\/uploads\/2026\/06\/sala_attesa_1600x1124\.jpeg"[\s\S]*?alt="Sala d'attesa MediWell"[\s\S]*?width="1600"[\s\S]*?height="1124"[\s\S]*?decoding="async"[\s\S]*?fetchpriority="high"[\s\S]*?>/
  )?.[0] || '';
  assert.ok(heroImage, 'expected hero image block');
  assert.doesNotMatch(heroImage, /loading="lazy"/);

  const studioFigure = html.match(/<figure class="[^"]*\bmw-space-photo\b[^"]*">[\s\S]*?<\/figure>/)?.[0] || '';
  assert.ok(studioFigure, 'expected studio figure');
  const studioImage = studioFigure.match(
    /<img[\s\S]*?src="https:\/\/mediwell\.it\/wp-content\/uploads\/2026\/06\/studio_overview_1024x1024\.jpeg"[\s\S]*?alt="Vista d'insieme di uno studio MediWell"[\s\S]*?loading="lazy"[\s\S]*?width="1024"[\s\S]*?height="1024"[\s\S]*?decoding="async"[\s\S]*?>/
  )?.[0] || '';
  assert.ok(studioImage, 'expected studio image block');
  assert.doesNotMatch(studioImage, /fetchpriority="high"/);

  const benefitsPhoto = html.match(/<article class="[^"]*\bmw-benefits-photo\b[^"]*"[\s\S]*?<\/article>/)?.[0] || '';
  assert.ok(benefitsPhoto, 'expected benefits photo');
  assert.match(benefitsPhoto, /src="https:\/\/mediwell\.it\/wp-content\/uploads\/2026\/06\/attaccapanni_1500x1500\.jpeg"/);
  assert.match(benefitsPhoto, /loading="lazy"/);
  assert.match(benefitsPhoto, /decoding="async"/);
});
