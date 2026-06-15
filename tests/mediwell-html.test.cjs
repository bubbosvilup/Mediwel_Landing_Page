const { test } = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const html = readFileSync(resolve(__dirname, '..', 'index.html'), 'utf8');
const text = html.replace(/\s+/g, ' ');
const cssPath = resolve(__dirname, '..', 'styles', 'mediwell-premium-balanced.css');
const css = html.match(/<style id="mediwell-styles">([\s\S]*?)<\/style>/i)?.[1] || '';
const stylesDir = resolve(__dirname, '..', 'styles');
const rootDir = resolve(__dirname, '..');

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
  assert.match(html, /Email:\s*<a href="mailto:info@mediwell\.it">info@mediwell\.it<\/a>/);
  assert.match(html, /Pec:\s*<a href="mailto:meeby@pec\.it">meeby@pec\.it<\/a>/);
  assert.match(html, /Servizio Clienti:\s*<a href="tel:\+393930593500">\+39 393 059 3500<\/a>/);
  assert.match(text, /P\.IVA: 02550260398/);
  assert.match(text, /R\.Imprese: RA212065/);
  assert.match(text, /Sede operativa Via Fornarina, 12\/D, 48018 Faenza RA, Italia/);
  assert.match(html, /COLORI PRINCIPALI DEL DESIGN PRECEDENTE/);
});

test('uses the client hero and pricing copy without forbidden wording or individual studio cards', () => {
  assert.doesNotMatch(text, /\bambulatori?\b/i);
  assert.doesNotMatch(text, /\bASL\b/i);
  assert.doesNotMatch(text, /\bcertificat\w*\b/i);
  assert.doesNotMatch(text, /mezzi pubblici/i);
  assert.match(text, /Nuova apertura a Faenza/i);
  assert.match(text, /7 settembre 2026/i);
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

test('adds the interactive floorplan immediately after the hero', () => {
  const heroIndex = html.indexOf('<section id="hero"');
  const floorplanIndex = html.indexOf('<section id="piantina"');
  const costsIndex = html.indexOf('<section id="costi"');

  assert.ok(heroIndex >= 0, 'expected hero section');
  assert.ok(floorplanIndex > heroIndex, 'expected floorplan after hero');
  assert.ok(costsIndex > floorplanIndex, 'expected model section after floorplan');
  assert.match(html, /<h2 id="piantina-title">Esplora gli spazi MediWell<\/h2>/);
  assert.match(html, /src="https:\/\/mediwell\.it\/wp-content\/uploads\/2026\/06\/senza-puntini-blu-1\.png"/);
  assert.match(html, /width="1672"/);
  assert.match(html, /height="941"/);
});

test('renders all floorplan hotspots as accessible buttons', () => {
  const hotspotMatches = html.match(/class="mw-floorplan-hotspot"/g) || [];
  assert.equal(hotspotMatches.length, 11);

  for (const label of [
    'Studio 1',
    'Studio 2',
    'Sala aspetto',
    'Studio 3',
    'Studio 4',
    'Studio 5',
    'Entrata disabili',
    'Ingresso',
    'Area privata',
    'Bagno pazienti',
    'Bagno privato medici'
  ]) {
    assert.match(html, new RegExp(`aria-label="Apri dettagli: ${label}"`));
  }

  assert.match(html, /data-floorplan-area="studio-1"/);
  assert.match(html, /data-floorplan-area="entrata-disabili"/);
  assert.match(html, /data-floorplan-area="area-privata"/);
  assert.match(html, /data-floorplan-area="bagno-pazienti"/);
  assert.match(html, /data-floorplan-area="bagno-medici"/);
});

test('keeps floorplan modal content data ready for future images', () => {
  assert.match(html, /var floorplanAreas = \{/);
  assert.match(html, /image:\s*null/);
  assert.match(html, /image\.src/);
  assert.match(html, /image\.alt/);
  assert.match(html, /mw-floorplan-modal-media/);
  assert.match(html, /href="#interesse"/);
});

test('adds premium floorplan motion hooks with branded pulse colors', () => {
  assert.match(css, /\.mw-floorplan-is-active/i);
  assert.match(css, /\.mw-floorplan-stage::before/i);
  assert.match(css, /\.mw-floorplan-stage::after/i);
  assert.match(css, /@keyframes\s+mw-floorplan-scan/i);
  assert.match(css, /@keyframes\s+mw-floorplan-ignite/i);
  assert.match(css, /@keyframes\s+mw-hotspot-arrive/i);
  assert.match(css, /@keyframes\s+mw-hotspot-ambient/i);
  assert.match(css, /\.mw-floorplan-hotspot\.is-selected/i);
  assert.match(css, /rgba\(193,\s*81,\s*127/i);
  assert.match(css, /rgba\(81,\s*193,\s*147/i);
  assert.match(html, /style="--x:\s*16\.0%;\s*--y:\s*60\.4%;\s*--i:\s*0;"/);
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

test('keeps the parking message and the September 7 2026 launch countdown', () => {
  assert.match(text, /Dove siamo: posizione strategica a Faenza senza stress da parcheggio/i);
  assert.match(text, /Via Fornarina 12\/D a Faenza/i);
  assert.match(text, /100 metri/i);
  assert.match(text, /parcheggio ampio e completamente gratuito/i);
  assert.match(text, /7 settembre 2026/i);
  assert.match(html, /<p class="mw-header-meta">Faenza <span>07\.09\.26<\/span><\/p>/i);
  assert.match(html, /<h2 id="lancio-title">07<span>\.<\/span>09<span>\.<\/span>26<\/h2>/i);
  assert.match(html, /2026-09-07T07:00:00\+02:00/);
  assert.match(text, /all'Apertura Ufficiale/i);
});

test('uses the Fluent Forms shortcode instead of the old demonstrative form', () => {
  assert.match(html, /wa\.me\/393930593500/i);
  assert.match(html, /<div class="mw-fluent-form-shell mw-reveal mw-reveal-right">\s*\[fluentform id="2"\]\s*<\/div>/i);
  assert.match(css, /label\s*\{[\s\S]*text-transform:\s*uppercase[\s\S]*\}/i);
  assert.match(css, /\.mw-fluent-form-shell\s+label\s*\{[\s\S]*text-transform:\s*none/i);
  assert.doesNotMatch(html, /<form\b/i);
  assert.doesNotMatch(html, /id="interest-form"|data-demo="true"|id="form-success"|nome-cognome/i);
  assert.doesNotMatch(html, /document\.getElementById\('interest-form'\)/);
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

test('keeps studio pages complete and internal page links normalized', () => {
  const pageSlugs = [
    'chi-siamo',
    'come-funziona',
    'contatti',
    'cookie-policy',
    'faq',
    'homepage',
    'prenota',
    'privacy-policy',
    'studi-medici',
    'studio-uno',
    'studio-due',
    'studio-tre',
    'studio-quattro',
    'studio-cinque',
    'termini-e-condizioni'
  ];

  const allHtmlFiles = [
    'index.html',
    ...pageSlugs.map((slug) => `${slug}.html`)
  ];

  for (const fileName of allHtmlFiles) {
    const pageHtml = readFileSync(resolve(rootDir, fileName), 'utf8');
    assert.doesNotMatch(
      pageHtml,
      new RegExp(`href="/(?:${pageSlugs.join('|')})"`),
      `${fileName} has an internal page link without trailing slash`
    );
    assert.doesNotMatch(
      pageHtml,
      /https:\/\/mediwell\.it\/wp-content\/uploads\/2026\/04\/https:\/\//,
      `${fileName} has a duplicated remote image URL`
    );
  }

  for (const [fileName, studioName, studioNumber] of [
    ['studio-due.html', 'Studio Due', '02'],
    ['studio-tre.html', 'Studio Tre', '03'],
    ['studio-quattro.html', 'Studio Quattro', '04'],
    ['studio-cinque.html', 'Studio Cinque', '05']
  ]) {
    const studioHtml = readFileSync(resolve(rootDir, fileName), 'utf8');
    assert.match(studioHtml, /<div class="mw-studio-product">/);
    assert.match(studioHtml, new RegExp(`<h1>${studioName}</h1>`));
    assert.match(studioHtml, new RegExp(`Calendario Studio ${studioNumber}`));
    assert.match(studioHtml, /<section id="prenota-studio" class="mw-booking-section">/);
    assert.match(studioHtml, /<button class="mw-tab active" type="button" data-tab="descrizione">Descrizione<\/button>/);
    assert.match(studioHtml, /<footer class="mw-footer" aria-label="Footer MediWell">/);
    assert.match(studioHtml, /document\.addEventListener\("DOMContentLoaded"/);
    assert.equal((studioHtml.match(/class="mw-related-card"/g) || []).length, 4);
  }
});
