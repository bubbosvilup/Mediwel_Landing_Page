# MediWell One-Page Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the MediWell landing page into a more elegant, performant, animated one-page WordPress-ready document while preserving the client's content and the existing commercial structure.

**Architecture:** Keep all production HTML, CSS, and safe dependency-free JavaScript inside `index.html`. Keep only optimized image files under `assets/mediwell/`, use the supplied WordPress logo URL for the GitHub Pages preview, and retain regression coverage through static Node tests plus a headless Playwright layout test.

**Tech Stack:** HTML5, inline CSS, vanilla JavaScript, Node.js test runner, Playwright, temporary `npx sharp-cli` image conversion.

---

## File Map

- Modify: `index.html`
  - Becomes the only production code document: HTML, inline `<style>`, inline JavaScript.
- Delete: `styles/mediwell-premium-balanced.css`
  - Its content is inlined into `index.html`; keeping it would violate the single-page code contract.
- Modify: `tests/mediwell-html.test.cjs`
  - Verifies single-file embedding, typography hooks, logo, responsive image markup, and motion hooks.
- Create: `tests/mediwell-layout.test.cjs`
  - Serves the page locally and verifies computed responsive layout behavior with Playwright.
- Create: `assets/mediwell/mediwell-hero-designed-waiting-room.webp`
- Create: `assets/mediwell/mediwell-studio-treatment-room.webp`
- Create: `assets/mediwell/mediwell-location-waiting-room.webp`
  - Modern-format equivalents of the current JPG photography.
- Modify: `assets/mediwell/README.md`
  - Documents JPG fallbacks, generated WebP assets, and the external preview logo.

## Task 1: Enforce The Single-File WordPress Contract

**Files:**
- Modify: `tests/mediwell-html.test.cjs`
- Modify: `index.html`
- Delete: `styles/mediwell-premium-balanced.css`

- [ ] **Step 1: Replace the external-CSS assumptions with a failing inline-CSS contract**

In `tests/mediwell-html.test.cjs`, replace:

```js
const cssPath = resolve(__dirname, '..', 'styles', 'mediwell-premium-balanced.css');
const css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : '';
```

with:

```js
const cssPath = resolve(__dirname, '..', 'styles', 'mediwell-premium-balanced.css');
const css = html.match(/<style id="mediwell-styles">([\s\S]*?)<\/style>/i)?.[1] || '';
```

Replace the test named `keeps the reset document unstyled and WordPress-embeddable` with:

```js
test('keeps HTML CSS and safe JavaScript embedded in one WordPress-compatible page', () => {
  assert.match(html, /<style id="mediwell-styles">[\s\S]*<\/style>/i);
  assert.match(html, /<script>[\s\S]*IntersectionObserver[\s\S]*<\/script>/i);
  assert.doesNotMatch(html, /<link[^>]+rel="stylesheet"/i);
  assert.doesNotMatch(html, /@import/i);
  assert.equal(existsSync(cssPath), false);
  assert.doesNotMatch(html, /<nav[\s>]/i);
  assert.doesNotMatch(html, /<footer[\s>]/i);
});
```

Rename `loads an isolated responsive and accessible premium CSS variant` to `keeps the inline premium variant responsive and accessible`, remove its `<link>` assertion, and keep the existing palette, fixed-aside, overflow, focus, breakpoint, and reduced-motion assertions against `css`.

- [ ] **Step 2: Run the static test and confirm the expected failure**

Run:

```powershell
node --test tests/mediwell-html.test.cjs
```

Expected: FAIL because `index.html` still links `styles/mediwell-premium-balanced.css`, has no `<style id="mediwell-styles">`, and the external CSS file still exists.

- [ ] **Step 3: Inline the stylesheet mechanically and remove its blocking font import**

Run this mechanical PowerShell rewrite from the repository root:

```powershell
$html = Get-Content -Raw index.html
$css = Get-Content -Raw styles/mediwell-premium-balanced.css
$css = $css -replace '^@import url\("https://fonts\.googleapis\.com[^\r\n]+"\);\r?\n\r?\n', ''
$style = "<style id=`"mediwell-styles`">`r`n$css`r`n  </style>"
$html = $html -replace '<link rel="stylesheet" href="styles/mediwell-premium-balanced\.css">', $style
Set-Content -LiteralPath index.html -Value $html -Encoding utf8
```

Delete `styles/mediwell-premium-balanced.css` with `apply_patch`:

```text
*** Begin Patch
*** Delete File: styles/mediwell-premium-balanced.css
*** End Patch
```

- [ ] **Step 4: Run the static test and verify the single-file contract passes**

Run:

```powershell
node --test tests/mediwell-html.test.cjs
```

Expected: PASS.

- [ ] **Step 5: Commit the contract migration**

Run:

```powershell
git add index.html tests/mediwell-html.test.cjs styles/mediwell-premium-balanced.css
git commit -m "refactor: embed MediWell styles in one-page document"
```

## Task 2: Refine Typography And Prevent Layout Collisions

**Files:**
- Create: `tests/mediwell-layout.test.cjs`
- Modify: `index.html`

- [ ] **Step 1: Add a failing Playwright layout regression test**

Create `tests/mediwell-layout.test.cjs`:

```js
const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { extname, join, normalize } = require('node:path');
const { chromium } = require('playwright');

const root = join(__dirname, '..');
const mime = {
  '.css': 'text/css',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

let browser;
let server;
let baseUrl;

before(async () => {
  server = createServer(async (request, response) => {
    const pathname = request.url.split('?')[0];
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const file = normalize(join(root, relative));

    if (!file.startsWith(root)) {
      response.writeHead(403);
      response.end();
      return;
    }

    try {
      response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
      response.end(await readFile(file));
    } catch {
      response.writeHead(404);
      response.end();
    }
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
});

async function inspect(width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  const result = await page.evaluate(() => {
    const hero = getComputedStyle(document.querySelector('h1'));
    const launch = getComputedStyle(document.querySelector('#lancio h2'));
    const date = document.querySelector('#lancio h2').getBoundingClientRect();
    const copy = document.querySelector('.mw-launch-copy').getBoundingClientRect();
    const overlap = !(
      date.right <= copy.left ||
      date.left >= copy.right ||
      date.bottom <= copy.top ||
      date.top >= copy.bottom
    );

    return {
      viewportWidth: document.documentElement.clientWidth,
      documentWidth: document.documentElement.scrollWidth,
      heroFontSize: parseFloat(hero.fontSize),
      heroLineHeight: parseFloat(hero.lineHeight) / parseFloat(hero.fontSize),
      heroTracking: parseFloat(hero.letterSpacing) / parseFloat(hero.fontSize),
      launchLineHeight: parseFloat(launch.lineHeight) / parseFloat(launch.fontSize),
      overlap
    };
  });
  await page.close();
  return result;
}

test('uses restrained heading metrics on mobile and desktop', async () => {
  const mobile = await inspect(390, 844);
  const desktop = await inspect(1440, 1200);

  assert.equal(mobile.documentWidth, mobile.viewportWidth);
  assert.equal(desktop.documentWidth, desktop.viewportWidth);
  assert.ok(mobile.heroLineHeight >= 0.96, mobile.heroLineHeight);
  assert.ok(desktop.heroFontSize <= 112, desktop.heroFontSize);
  assert.ok(desktop.heroTracking >= -0.055, desktop.heroTracking);
  assert.ok(desktop.launchLineHeight >= 0.86, desktop.launchLineHeight);
  assert.equal(desktop.overlap, false);
});
```

- [ ] **Step 2: Run the layout test and confirm the expected failure**

Run:

```powershell
node --test tests/mediwell-layout.test.cjs
```

Expected: FAIL because the current hero uses a `0.9` line-height, desktop `h1` reaches `8.5rem`, heading tracking is `-0.065em`, and the launch date can collide with the launch copy.

- [ ] **Step 3: Apply the refined sans heading metrics inside `index.html`**

Inside `<style id="mediwell-styles">`, replace the body and heading typography rules with:

```css
body {
  margin: 0;
  overflow-x: hidden;
  background: var(--mw-bg);
  color: var(--mw-text);
  font-family: "Aptos", "Segoe UI Variable", "Segoe UI", Arial, sans-serif;
  font-size: 16px;
  line-height: 1.65;
}

h1,
h2,
h3 {
  color: var(--mw-blue-dark);
  font-family: "Aptos Display", "Segoe UI Variable Display", "Segoe UI", Arial, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
}

h1 {
  margin-bottom: 24px;
  font-size: clamp(2.85rem, 10vw, 6.1rem);
  line-height: 0.98;
}

h2 {
  margin-bottom: 22px;
  font-size: clamp(2.2rem, 7vw, 4.2rem);
  line-height: 1;
}

h3 {
  margin-bottom: 12px;
  font-size: clamp(1.35rem, 3.5vw, 1.85rem);
  line-height: 1.08;
}
```

Replace the launch date rule with:

```css
#lancio h2 {
  margin: 0;
  font-size: clamp(4.1rem, 11vw, 7.4rem);
  letter-spacing: -0.095em;
  line-height: 0.9;
  white-space: nowrap;
}
```

In the `@media (min-width: 768px)` block, replace the launch grid rule with:

```css
.mw-launch-layout {
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  align-items: center;
  gap: 68px;
}
```

In the `@media (min-width: 1200px)` block, replace the `h1` override with:

```css
h1 {
  font-size: 6.55rem;
}
```

- [ ] **Step 4: Run static and layout tests**

Run:

```powershell
node --test
```

Expected: PASS.

- [ ] **Step 5: Commit the typographic correction**

Run:

```powershell
git add index.html tests/mediwell-layout.test.cjs
git commit -m "fix: refine MediWell headings and launch layout"
```

## Task 3: Add The Official Logo And Modern Photography Formats

**Files:**
- Modify: `tests/mediwell-html.test.cjs`
- Modify: `index.html`
- Create: `assets/mediwell/mediwell-hero-designed-waiting-room.webp`
- Create: `assets/mediwell/mediwell-studio-treatment-room.webp`
- Create: `assets/mediwell/mediwell-location-waiting-room.webp`
- Modify: `assets/mediwell/README.md`

- [ ] **Step 1: Add failing logo and image-performance assertions**

Append to `tests/mediwell-html.test.cjs`:

```js
test('uses the official logo and modern responsive photography markup', () => {
  assert.match(
    html,
    /class="mw-brand-logo"[\s\S]*src="https:\/\/mediwell\.it\/wp-content\/uploads\/2026\/04\/cropped-Master_2500x1000\.png"/i
  );
  assert.doesNotMatch(html, /class="mw-brand-mark"/i);
  assert.match(html, /<picture>[\s\S]*type="image\/webp"/i);
  assert.match(html, /mediwell-hero-designed-waiting-room\.webp/i);
  assert.match(html, /fetchpriority="high"/i);
  assert.match(html, /decoding="async"/i);

  for (const asset of [
    'mediwell-hero-designed-waiting-room.webp',
    'mediwell-studio-treatment-room.webp',
    'mediwell-location-waiting-room.webp'
  ]) {
    assert.ok(existsSync(resolve(assetsDir, asset)), `expected ${asset}`);
  }
});
```

- [ ] **Step 2: Run the static test and confirm the expected failure**

Run:

```powershell
node --test tests/mediwell-html.test.cjs
```

Expected: FAIL because the official logo, `<picture>` tags, WebP files, and image hints do not exist yet.

- [ ] **Step 3: Generate the WebP assets without adding a runtime dependency**

Run:

```powershell
npx --yes sharp-cli -i assets/mediwell/mediwell-hero-designed-waiting-room.jpg -o assets/mediwell --format webp --quality 78
npx --yes sharp-cli -i assets/mediwell/mediwell-studio-treatment-room.jpg -o assets/mediwell --format webp --quality 78
npx --yes sharp-cli -i assets/mediwell/mediwell-location-waiting-room.jpg -o assets/mediwell --format webp --quality 78
Get-ChildItem assets/mediwell/*.webp | Select-Object Name,Length
```

Expected: three `.webp` files with the same base names as the JPG files and smaller transfer sizes.

- [ ] **Step 4: Replace the temporary header mark with the official logo**

In `index.html`, replace:

```html
<span class="mw-brand-mark">M</span>
<span>MEDI<span>WELL</span></span>
```

with:

```html
<img
  class="mw-brand-logo"
  src="https://mediwell.it/wp-content/uploads/2026/04/cropped-Master_2500x1000.png"
  alt="MediWell Polistudio"
  width="250"
  height="100"
  decoding="async"
>
```

Inside the inline CSS, replace `.mw-brand span span` and `.mw-brand-mark` with:

```css
.mw-brand-logo {
  width: 132px;
  height: auto;
  object-fit: contain;
}
```

Add this inside `@media (min-width: 640px)`:

```css
.mw-brand-logo {
  width: 154px;
}
```

- [ ] **Step 5: Wrap the three photographs in WebP-first `<picture>` markup**

Use this structure for the hero:

```html
<picture>
  <source
    srcset="assets/mediwell/mediwell-hero-designed-waiting-room.webp"
    type="image/webp"
  >
  <img
    src="assets/mediwell/mediwell-hero-designed-waiting-room.jpg"
    alt="Sala d'attesa contemporanea con sedute rosa, parete verde e rivestimento in legno"
    width="1800"
    height="1200"
    decoding="async"
    fetchpriority="high"
  >
</picture>
```

Use this structure for the studio photo:

```html
<picture>
  <source srcset="assets/mediwell/mediwell-studio-treatment-room.webp" type="image/webp">
  <img
    src="assets/mediwell/mediwell-studio-treatment-room.jpg"
    alt="Studio sanitario luminoso con lettino elettrico e arredi professionali"
    loading="lazy"
    width="1600"
    height="1067"
    decoding="async"
  >
</picture>
```

Use this structure for the location photo:

```html
<picture>
  <source srcset="assets/mediwell/mediwell-location-waiting-room.webp" type="image/webp">
  <img
    src="assets/mediwell/mediwell-location-waiting-room.jpg"
    alt="Sala d'attesa sanitaria luminosa con sedute e reception"
    loading="lazy"
    width="1600"
    height="1067"
    decoding="async"
  >
</picture>
```

Add `picture` to the image layout selectors:

```css
.mw-photo-shell picture,
.mw-space-photo picture,
.mw-location-photo picture {
  display: block;
  width: 100%;
  height: 100%;
}
```

- [ ] **Step 6: Document the generated formats and preview-logo constraint**

Append to `assets/mediwell/README.md`:

```md
## Optimized formats

The `.webp` files are generated from the documented JPG sources with:

```powershell
npx --yes sharp-cli -i assets/mediwell/mediwell-hero-designed-waiting-room.jpg -o assets/mediwell --format webp --quality 78
npx --yes sharp-cli -i assets/mediwell/mediwell-studio-treatment-room.jpg -o assets/mediwell --format webp --quality 78
npx --yes sharp-cli -i assets/mediwell/mediwell-location-waiting-room.jpg -o assets/mediwell --format webp --quality 78
```

JPG files remain as `<picture>` fallbacks.

## Preview logo

The GitHub Pages preview references the supplied WordPress logo:

`https://mediwell.it/wp-content/uploads/2026/04/cropped-Master_2500x1000.png`

During WordPress integration, upload a cropped and resized derivative and replace
the preview URL with the Media Library URL.
```

- [ ] **Step 7: Run all tests and commit the assets**

Run:

```powershell
node --test
git add index.html tests/mediwell-html.test.cjs assets/mediwell
git commit -m "perf: add MediWell logo and WebP photography"
```

Expected: PASS, then a commit containing the markup, tests, documentation, and three WebP files.

## Task 4: Add Selective Scroll Motion

**Files:**
- Modify: `tests/mediwell-html.test.cjs`
- Modify: `tests/mediwell-layout.test.cjs`
- Modify: `index.html`

- [ ] **Step 1: Add failing static assertions for directional and staggered motion**

Append to `tests/mediwell-html.test.cjs`:

```js
test('adds selective motion while preserving reduced-motion support', () => {
  assert.match(html, /mw-reveal-left/i);
  assert.match(html, /mw-reveal-right/i);
  assert.match(html, /mw-reveal-stagger/i);
  assert.match(html, /mw-launch-date/i);
  assert.match(html, /mw-countdown-reveal/i);
  assert.match(html, /--mw-item-delay/i);
  assert.match(html, /style\.setProperty\('--mw-item-delay'/i);
  assert.match(css, /prefers-reduced-motion:\s*reduce/i);
});
```

- [ ] **Step 2: Add a failing reduced-motion layout test**

Append to `tests/mediwell-layout.test.cjs`:

```js
test('removes non-essential reveal duration for reduced-motion users', async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

  const duration = await page.evaluate(() => {
    const item = document.querySelector('.mw-reveal');
    return parseFloat(getComputedStyle(item).transitionDuration);
  });

  await page.close();
  assert.ok(duration <= 0.01, duration);
});
```

- [ ] **Step 3: Run the tests and confirm the expected failure**

Run:

```powershell
node --test
```

Expected: FAIL because the new directional, stagger, launch, and delay hooks do not exist yet.

- [ ] **Step 4: Add directional classes to the existing markup**

Apply these class changes in `index.html`:

```html
<div class="mw-hero-copy mw-reveal mw-reveal-up">
<div class="mw-hero-visual mw-reveal mw-reveal-right">
<figure class="mw-space-photo mw-reveal mw-reveal-left">
<div class="mw-space-copy mw-reveal mw-reveal-right">
<ol class="mw-tech-path mw-reveal mw-reveal-stagger">
<div class="mw-location-copy mw-reveal mw-reveal-left">
<figure class="mw-location-photo mw-reveal mw-reveal-right">
<div class="mw-launch-layout">
<div class="mw-launch-date mw-reveal mw-reveal-left">
<div class="mw-launch-copy mw-reveal mw-reveal-right">
<div id="countdown" class="mw-countdown-reveal" aria-live="polite">
<div class="mw-interest-copy mw-reveal mw-reveal-left">
<form id="interest-form" class="mw-reveal mw-reveal-right" data-demo="true">
```

Keep the existing `.mw-reveal` classes on individual benefit cards so each card
remains independently observable.

- [ ] **Step 5: Replace the basic reveal CSS with directional and stagger styles**

Replace the existing `.mw-motion-ready .mw-reveal` block at the bottom of the
inline stylesheet with:

```css
.mw-motion-ready .mw-reveal:not(.mw-reveal-stagger) {
  --mw-reveal-x: 0;
  --mw-reveal-y: 24px;
  opacity: 0;
  transform: translate3d(var(--mw-reveal-x), var(--mw-reveal-y), 0);
  transition:
    opacity 720ms ease,
    transform 720ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.mw-motion-ready .mw-reveal-left {
  --mw-reveal-x: -38px;
  --mw-reveal-y: 0;
}

.mw-motion-ready .mw-reveal-right {
  --mw-reveal-x: 38px;
  --mw-reveal-y: 0;
}

.mw-motion-ready .mw-reveal.is-visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

.mw-motion-ready .mw-reveal-stagger > * {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 620ms ease var(--mw-item-delay, 0ms),
    transform 620ms cubic-bezier(0.2, 0.7, 0.2, 1) var(--mw-item-delay, 0ms);
}

.mw-motion-ready .mw-reveal-stagger.is-visible > * {
  opacity: 1;
  transform: translateY(0);
}

.mw-motion-ready .mw-countdown-reveal {
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 520ms ease 220ms,
    transform 520ms ease 220ms;
}

.mw-motion-ready .mw-launch-copy.is-visible .mw-countdown-reveal {
  opacity: 1;
  transform: translateY(0);
}

@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .mw-photo-shell img,
  .mw-space-photo img,
  .mw-location-photo img {
    transition: transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1);
  }
}
```

Retain the existing `@media (prefers-reduced-motion: reduce)` rule.

- [ ] **Step 6: Assign stagger delays before observing reveal groups**

Inside the existing reveal IIFE, immediately after:

```js
var items = document.querySelectorAll('.mw-reveal');
```

add:

```js
document.querySelectorAll('.mw-reveal-stagger').forEach(function (group) {
  Array.prototype.forEach.call(group.children, function (item, index) {
    item.style.setProperty('--mw-item-delay', (index * 110) + 'ms');
  });
});
```

- [ ] **Step 7: Run all tests and commit motion refinement**

Run:

```powershell
node --test
git add index.html tests/mediwell-html.test.cjs tests/mediwell-layout.test.cjs
git commit -m "feat: add selective MediWell scroll motion"
```

Expected: PASS.

## Task 5: Verify The Complete Preview

**Files:**
- Verify: `index.html`
- Verify: `tests/mediwell-html.test.cjs`
- Verify: `tests/mediwell-layout.test.cjs`
- Verify: `assets/mediwell/*`

- [ ] **Step 1: Run the full automated verification**

Run:

```powershell
node --test
git diff --check
```

Expected: all tests PASS and `git diff --check` produces no output.

- [ ] **Step 2: Verify that no external stylesheet or Google Fonts request remains**

Run:

```powershell
rg -n "<link[^>]+stylesheet|fonts\\.googleapis\\.com|@import" index.html
```

Expected: no matches.

- [ ] **Step 3: Confirm modern assets are present and smaller than their JPG fallbacks**

Run:

```powershell
Get-ChildItem -Path assets/mediwell/* -Include *.jpg,*.webp -File |
  Sort-Object BaseName,Extension |
  Select-Object Name,Length
```

Expected: each `.webp` exists and is smaller than its corresponding `.jpg`.

- [ ] **Step 4: Serve and inspect the page visually at mobile and desktop sizes**

Start a hidden static preview:

```powershell
$process = Start-Process -FilePath python -ArgumentList @('-m', 'http.server', '8000', '--bind', '127.0.0.1') -WindowStyle Hidden -PassThru
```

Open `http://127.0.0.1:8000` in the in-app browser or a local browser and inspect:

1. Header logo aspect ratio and legibility.
2. Mobile hero wrapping at `390px`.
3. Desktop hero hierarchy at `1440px`.
4. Launch date and countdown separation.
5. Alternating reveal directions, card stagger, image depth, and countdown entrance.
6. Reduced-motion behavior through browser emulation.

- [ ] **Step 5: Confirm repository status**

Run:

```powershell
git status --short --branch
git log --oneline -6
```

Expected: clean branch with four focused refinement commits after the design and plan commits.
