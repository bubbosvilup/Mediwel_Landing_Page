# MediWell Interactive Floorplan Implementation Plan

> **Superseded note (2026-06-23):** Do not follow the original `floorplanAreas` JavaScript data-object approach for modal copy. WordPress/Hostinger can encode accents inside inline scripts and make strings like `pi&#249;` visible in the modal. The current architecture keeps modal copy in the fallback `#floorplan-card-*` HTML cards and has JavaScript read from those cards as the single source of truth.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a polished interactive floorplan section below the hero, with 9 CSS hotspots opening a reusable modal.

**Architecture:** Keep the WordPress-compatible single-file page structure. Store the clean floorplan image in `assets/mediwell/`, add inline CSS/HTML/JS in `index.html`, and keep modal content in one JavaScript data object so future photos can be added by editing area data.

**Tech Stack:** Static HTML, inline CSS, vanilla JavaScript, Node test runner, Playwright layout tests.

---

## File Structure

- Create: `assets/mediwell/senza-puntini-blu.png`
  - Local copy of the clean floorplan image used by the new section.
- Modify: `index.html`
  - Add floorplan styles to the existing `<style id="mediwell-styles">`.
  - Insert the new section immediately after `</section>` for `#hero`.
  - Add one reusable modal shell near the end of `<main>`.
  - Extend the existing script block with floorplan data, hotspot click handling, modal rendering, and close/focus behavior.
- Modify: `tests/mediwell-html.test.cjs`
  - Add structure tests for placement, image, hotspot count, accessible labels, and future image-ready data shape.
- Modify: `tests/mediwell-layout.test.cjs`
  - Add Playwright interaction test for hotspot click, modal content, close behavior, and mobile document width.

---

### Task 1: Add Failing Structure Tests

**Files:**
- Modify: `tests/mediwell-html.test.cjs`

- [ ] **Step 1: Add tests for section placement, hotspots, and image-ready modal data**

Append this test after `presents the client studios overview once`:

```js
test('adds the interactive floorplan immediately after the hero', () => {
  const heroIndex = html.indexOf('<section id="hero"');
  const floorplanIndex = html.indexOf('<section id="piantina"');
  const costsIndex = html.indexOf('<section id="costi"');

  assert.ok(heroIndex >= 0, 'expected hero section');
  assert.ok(floorplanIndex > heroIndex, 'expected floorplan after hero');
  assert.ok(costsIndex > floorplanIndex, 'expected model section after floorplan');
  assert.match(html, /<h2 id="piantina-title">Esplora gli spazi MediWell<\/h2>/);
  assert.match(html, /src="assets\/mediwell\/senza-puntini-blu\.png"/);
  assert.match(html, /width="1672"/);
  assert.match(html, /height="941"/);
});

test('renders all floorplan hotspots as accessible buttons', () => {
  const hotspotMatches = html.match(/class="mw-floorplan-hotspot"/g) || [];
  assert.equal(hotspotMatches.length, 9);

  for (const label of [
    'Studio 1',
    'Studio 2',
    'Sala aspetto',
    'Studio 3',
    'Studio 4',
    'Studio 5',
    'Entrata disabili',
    'Ingresso',
    'Spogliatoi'
  ]) {
    assert.match(html, new RegExp(`aria-label="Apri dettagli: ${label}"`));
  }

  assert.match(html, /data-floorplan-area="studio-1"/);
  assert.match(html, /data-floorplan-area="entrata-disabili"/);
  assert.match(html, /data-floorplan-area="spogliatoi"/);
});

test('keeps floorplan modal content data ready for future images', () => {
  assert.match(html, /var floorplanAreas = \{/);
  assert.match(html, /image:\s*null/);
  assert.match(html, /image\.src/);
  assert.match(html, /image\.alt/);
  assert.match(html, /mw-floorplan-modal-media/);
  assert.match(html, /href="#interesse"/);
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `npm test`

Expected: FAIL because `#piantina`, hotspot buttons, and floorplan modal data do not exist yet.

---

### Task 2: Add the Floorplan Asset

**Files:**
- Create: `assets/mediwell/senza-puntini-blu.png`

- [ ] **Step 1: Copy the clean image into project assets**

Run:

```powershell
Copy-Item -LiteralPath 'C:\Users\be_fr\Desktop\senza puntini blu.png' -Destination 'C:\Users\be_fr\Desktop\mediwell_LP\assets\mediwell\senza-puntini-blu.png'
```

- [ ] **Step 2: Confirm asset exists**

Run:

```powershell
Test-Path -LiteralPath 'C:\Users\be_fr\Desktop\mediwell_LP\assets\mediwell\senza-puntini-blu.png'
```

Expected: `True`

---

### Task 3: Implement Section, Hotspots, Modal Markup, and Styles

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add CSS inside `<style id="mediwell-styles">`**

Add styles for:

```css
.mw-floorplan-section { ... }
.mw-floorplan-layout { ... }
.mw-floorplan-stage { position: relative; ... }
.mw-floorplan-stage img { width: 100%; height: auto; display: block; }
.mw-floorplan-hotspot { position: absolute; left: var(--x); top: var(--y); ... }
.mw-floorplan-hotspot::before { ... }
.mw-floorplan-hotspot:focus-visible { ... }
.mw-floorplan-modal { position: fixed; inset: 0; ... }
.mw-floorplan-modal[hidden] { display: none; }
.mw-floorplan-dialog { ... }
.mw-floorplan-modal-media { ... }
.mw-floorplan-modal-close { ... }
```

Include reduced-motion handling:

```css
@media (prefers-reduced-motion: reduce) {
  .mw-floorplan-hotspot,
  .mw-floorplan-hotspot::before {
    animation: none;
  }
}
```

- [ ] **Step 2: Insert section immediately after hero**

Add:

```html
<section id="piantina" class="mw-floorplan-section" aria-labelledby="piantina-title">
  <div class="mw-section-shell">
    <div class="mw-floorplan-layout mw-reveal">
      <div class="mw-floorplan-copy">
        <p class="mw-section-index"><span>00</span> Esplora gli spazi</p>
        <h2 id="piantina-title">Esplora gli spazi MediWell</h2>
        <p>Clicca sui punti della piantina per scoprire studi, aree di accesso e spazi di supporto del polistudio.</p>
      </div>
      <figure class="mw-floorplan-stage" aria-label="Piantina interattiva degli spazi MediWell">
        <img src="assets/mediwell/senza-puntini-blu.png" alt="Piantina dall'alto degli spazi MediWell" width="1672" height="941" loading="lazy" decoding="async">
        <button class="mw-floorplan-hotspot" type="button" style="--x: 13.7%; --y: 58.4%;" data-floorplan-area="studio-1" aria-label="Apri dettagli: Studio 1"></button>
        <button class="mw-floorplan-hotspot" type="button" style="--x: 13.8%; --y: 20.4%;" data-floorplan-area="studio-2" aria-label="Apri dettagli: Studio 2"></button>
        <button class="mw-floorplan-hotspot" type="button" style="--x: 34.5%; --y: 20.4%;" data-floorplan-area="sala-aspetto" aria-label="Apri dettagli: Sala aspetto"></button>
        <button class="mw-floorplan-hotspot" type="button" style="--x: 57.2%; --y: 15.2%;" data-floorplan-area="studio-3" aria-label="Apri dettagli: Studio 3"></button>
        <button class="mw-floorplan-hotspot" type="button" style="--x: 83.2%; --y: 25.5%;" data-floorplan-area="studio-4" aria-label="Apri dettagli: Studio 4"></button>
        <button class="mw-floorplan-hotspot" type="button" style="--x: 78.1%; --y: 61.1%;" data-floorplan-area="studio-5" aria-label="Apri dettagli: Studio 5"></button>
        <button class="mw-floorplan-hotspot" type="button" style="--x: 88.9%; --y: 70.5%;" data-floorplan-area="entrata-disabili" aria-label="Apri dettagli: Entrata disabili"></button>
        <button class="mw-floorplan-hotspot" type="button" style="--x: 9.0%; --y: 84.7%;" data-floorplan-area="ingresso" aria-label="Apri dettagli: Ingresso"></button>
        <button class="mw-floorplan-hotspot" type="button" style="--x: 44.1%; --y: 85.3%;" data-floorplan-area="spogliatoi" aria-label="Apri dettagli: Spogliatoi"></button>
      </figure>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Add modal shell before `</main>`**

Add:

```html
<div class="mw-floorplan-modal" id="floorplan-modal" role="dialog" aria-modal="true" aria-labelledby="floorplan-modal-title" hidden>
  <div class="mw-floorplan-backdrop" data-floorplan-close></div>
  <article class="mw-floorplan-dialog">
    <button class="mw-floorplan-modal-close" type="button" aria-label="Chiudi dettagli" data-floorplan-close>×</button>
    <div class="mw-floorplan-modal-media" id="floorplan-modal-media" hidden></div>
    <div class="mw-floorplan-modal-body">
      <p class="mw-floorplan-modal-kicker" id="floorplan-modal-kicker">Spazio MediWell</p>
      <h3 id="floorplan-modal-title"></h3>
      <p id="floorplan-modal-description"></p>
      <ul id="floorplan-modal-features"></ul>
      <a class="mw-text-link" href="#interesse" data-floorplan-close>Richiedi informazioni <span>→</span></a>
    </div>
  </article>
</div>
```

---

### Task 4: Implement Modal JavaScript

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add floorplan data and behavior to the existing script**

Inside the final `<script>` block, add a new IIFE:

```js
(function () {
  var floorplanAreas = {
    'studio-1': {
      title: 'Studio 1',
      description: 'Uno spazio riservato e pronto all\\'uso, pensato per visite, consulenze e attivita professionali a giornata.',
      features: ['Ambiente ordinato e igienizzato', 'Lavabo e superfici pratiche', 'Privacy per professionista e paziente'],
      image: null
    }
  };
})();
```

Define all 9 areas with the same object shape. Query `[data-floorplan-area]`, populate `#floorplan-modal-title`, `#floorplan-modal-description`, `#floorplan-modal-features`, and conditionally render `image.src` and `image.alt` inside `#floorplan-modal-media`.

- [ ] **Step 2: Add close and focus behavior**

Track the button that opened the modal. On close, hide the modal and call `.focus()` on the original hotspot when available. Close on `[data-floorplan-close]`, backdrop click, CTA click, and `Escape`.

- [ ] **Step 3: Run tests**

Run: `npm test`

Expected: HTML structure tests still fail only if interaction coverage has not been added yet; no JavaScript syntax errors should appear.

---

### Task 5: Add Interaction and Layout Tests

**Files:**
- Modify: `tests/mediwell-layout.test.cjs`

- [ ] **Step 1: Add Playwright test for interaction**

Append:

```js
test('opens and closes the floorplan modal from a hotspot', async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  await page.locator('[data-floorplan-area="studio-1"]').click();
  await assert.equal(await page.locator('#floorplan-modal').isVisible(), true);
  await assert.equal(await page.locator('#floorplan-modal-title').innerText(), 'Studio 1');
  await assert.match(await page.locator('#floorplan-modal-description').innerText(), /pronto all'uso/i);

  await page.keyboard.press('Escape');
  await assert.equal(await page.locator('#floorplan-modal').isHidden(), true);

  await page.close();
});
```

- [ ] **Step 2: Add mobile width check for floorplan**

Append:

```js
test('keeps the floorplan responsive on mobile', async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(baseUrl, { waitUntil: 'networkidle' });

  const metrics = await page.evaluate(() => {
    const section = document.querySelector('#piantina').getBoundingClientRect();
    const image = document.querySelector('.mw-floorplan-stage img').getBoundingClientRect();
    const hotspots = Array.from(document.querySelectorAll('.mw-floorplan-hotspot')).map((hotspot) => {
      const box = hotspot.getBoundingClientRect();
      return { width: box.width, height: box.height };
    });

    return {
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      sectionWidth: section.width,
      imageWidth: image.width,
      minHotspotWidth: Math.min(...hotspots.map((box) => box.width)),
      minHotspotHeight: Math.min(...hotspots.map((box) => box.height))
    };
  });

  await page.close();

  assert.equal(metrics.documentWidth, metrics.viewportWidth);
  assert.ok(metrics.imageWidth <= metrics.sectionWidth);
  assert.ok(metrics.minHotspotWidth >= 38);
  assert.ok(metrics.minHotspotHeight >= 38);
});
```

- [ ] **Step 3: Run the full test suite**

Run: `npm test`

Expected: PASS.

---

### Task 6: Manual Visual Verification and Final Commit

**Files:**
- Verify: `index.html`
- Verify: `assets/mediwell/senza-puntini-blu.png`
- Verify: `tests/mediwell-html.test.cjs`
- Verify: `tests/mediwell-layout.test.cjs`

- [ ] **Step 1: Open the local page**

Use the in-app browser or Playwright at a local static server URL.

- [ ] **Step 2: Check desktop and mobile**

Verify:

- section appears directly below the hero
- floorplan does not overflow horizontally
- all 9 hotspots align with intended rooms/areas
- modal is readable and closes correctly
- CTA points to `#interesse`

- [ ] **Step 3: Commit implementation**

Run:

```powershell
git add index.html assets/mediwell/senza-puntini-blu.png tests/mediwell-html.test.cjs tests/mediwell-layout.test.cjs
git commit -m "Add interactive MediWell floorplan"
```
