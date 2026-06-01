# MediWell Premium Balanced CSS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the first reversible, mobile-first premium visual variant to the existing MediWell one-page landing page without changing its approved content or JavaScript behavior.

**Architecture:** Keep `index.html` as the only page and add a single external stylesheet link. Store the complete experiment in `styles/mediwell-premium-balanced.css` so removing or replacing one link cleanly restores or swaps the design. Extend the existing Node contract test to verify the isolation boundary and the required responsive and accessibility rules.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript preserved unchanged, Node.js built-in `node:test`, Node.js built-in `assert`.

---

### Task 1: Add The Reversible CSS Contract

**Files:**
- Modify: `tests/mediwell-html.test.cjs`
- Test: `tests/mediwell-html.test.cjs`

- [ ] **Step 1: Add a failing CSS-variant contract test**

Add `existsSync`, define the stylesheet path and CSS content after the existing
HTML constants, then append the new test:

```js
const { existsSync, readFileSync } = require('node:fs');

const cssPath = resolve(__dirname, '..', 'styles', 'mediwell-premium-balanced.css');
const css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : '';

test('loads an isolated responsive and accessible premium CSS variant', () => {
  assert.match(
    html,
    /<link\s+rel="stylesheet"\s+href="styles\/mediwell-premium-balanced\.css">/i
  );
  assert.ok(css, 'expected the isolated premium CSS variant');
  assert.match(css, /--mw-blue:\s*#0c4b80/i);
  assert.match(css, /--mw-pink:\s*#c1517f/i);
  assert.match(css, /--mw-green:\s*#51c193/i);
  assert.match(css, /aside\s*\{[\s\S]*position:\s*fixed/i);
  assert.match(css, /:focus-visible/i);
  assert.match(css, /@media\s*\(min-width:\s*768px\)/i);
  assert.match(css, /@media\s*\(min-width:\s*1024px\)/i);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
});
```

- [ ] **Step 2: Run the suite to verify the new contract fails**

Run: `node --test`

Expected: FAIL in `loads an isolated responsive and accessible premium CSS variant`
because `index.html` does not load `styles/mediwell-premium-balanced.css`.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/mediwell-html.test.cjs
git commit -m "test: define reversible MediWell CSS variant contract"
```

### Task 2: Add The Premium Balanced Variant

**Files:**
- Modify: `index.html`
- Create: `styles/mediwell-premium-balanced.css`
- Test: `tests/mediwell-html.test.cjs`

- [ ] **Step 1: Link the isolated stylesheet**

Add this line immediately after the viewport `<meta>` element in `index.html`:

```html
  <link rel="stylesheet" href="styles/mediwell-premium-balanced.css">
```

- [ ] **Step 2: Create the complete mobile-first stylesheet**

Create `styles/mediwell-premium-balanced.css` with:

```css
:root {
  --mw-blue: #0c4b80;
  --mw-blue-dark: #083966;
  --mw-blue-pale: #edf6fb;
  --mw-pink: #c1517f;
  --mw-pink-dark: #a33e69;
  --mw-pink-pale: #fbf0f5;
  --mw-bg: #f8f9fa;
  --mw-text: #2d3436;
  --mw-green: #51c193;
  --mw-orange: #e67e22;
  --mw-purple: #715fa3;
  --mw-white: #ffffff;
  --mw-muted: #6b7478;
  --mw-border: rgba(12, 75, 128, 0.12);
  --mw-shadow: 0 20px 55px rgba(8, 57, 102, 0.12);
  --mw-shadow-soft: 0 12px 32px rgba(8, 57, 102, 0.08);
  --mw-radius: 28px;
  --mw-radius-small: 18px;
  --mw-max: 1180px;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  overflow-x: hidden;
  background: var(--mw-bg);
  color: var(--mw-text);
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  font-size: 16px;
  line-height: 1.65;
}

a,
button,
input {
  transition: 180ms ease;
}

a {
  color: var(--mw-blue);
  font-weight: 800;
  text-underline-offset: 0.18em;
}

a:hover {
  color: var(--mw-pink-dark);
}

a:focus-visible,
button:focus-visible,
input:focus-visible {
  outline: 3px solid var(--mw-orange);
  outline-offset: 4px;
}

main > section {
  position: relative;
  isolation: isolate;
  padding: 72px 20px;
}

main > section > * {
  width: min(100%, var(--mw-max));
  margin-right: auto;
  margin-left: auto;
}

h1,
h2,
h3 {
  margin-top: 0;
  color: var(--mw-blue-dark);
  font-weight: 900;
  letter-spacing: -0.04em;
}

h2 {
  max-width: 900px;
  margin-bottom: 24px;
  font-size: clamp(2rem, 6vw, 3.5rem);
  line-height: 1.04;
}

h3 {
  margin-bottom: 10px;
  font-size: clamp(1.35rem, 4vw, 1.75rem);
  line-height: 1.12;
}

p {
  margin-top: 0;
  margin-bottom: 18px;
}

#hero {
  min-height: min(900px, 100svh);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 88% 18%, rgba(193, 81, 127, 0.2), transparent 26rem),
    radial-gradient(circle at 8% 84%, rgba(81, 193, 147, 0.14), transparent 22rem),
    linear-gradient(140deg, #f8fbfd 0%, #edf6fb 56%, #fbf0f5 100%);
}

#hero::before,
#hero::after {
  position: absolute;
  z-index: -1;
  border-radius: 999px;
  content: "";
}

#hero::before {
  top: 10%;
  right: -110px;
  width: 260px;
  height: 260px;
  border: 1px solid rgba(193, 81, 127, 0.28);
  box-shadow: 0 0 0 28px rgba(193, 81, 127, 0.05);
}

#hero::after {
  right: 8%;
  bottom: 8%;
  width: 110px;
  height: 110px;
  background: rgba(81, 193, 147, 0.14);
  box-shadow: 0 0 0 18px rgba(81, 193, 147, 0.06);
}

#hero > h1 {
  margin-bottom: 18px;
  color: var(--mw-pink-dark);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  line-height: 1.45;
  text-transform: uppercase;
}

#hero > h2 {
  max-width: 980px;
  margin-bottom: 26px;
  font-size: clamp(2.65rem, 8vw, 5.1rem);
  line-height: 0.98;
}

#hero > p {
  max-width: 720px;
  color: #465054;
  font-size: clamp(1.02rem, 2vw, 1.2rem);
}

#hero > p:last-child,
#lancio > p:last-child {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

#hero > p:last-child a,
#studi > p:last-child a,
#lancio > p:last-child a,
#interesse > p:nth-of-type(3) a {
  display: inline-flex;
  min-height: 52px;
  align-items: center;
  justify-content: center;
  padding: 14px 22px;
  border: 2px solid transparent;
  border-radius: 999px;
  text-decoration: none;
}

#hero > p:last-child a:first-child,
#lancio > p:last-child a,
form button {
  background: var(--mw-pink);
  box-shadow: 0 14px 26px rgba(193, 81, 127, 0.24);
  color: var(--mw-white);
}

#hero > p:last-child a:last-child,
#studi > p:last-child a,
#interesse > p:nth-of-type(3) a {
  border-color: var(--mw-blue);
  background: rgba(255, 255, 255, 0.76);
  color: var(--mw-blue);
}

#costi {
  background: var(--mw-white);
}

#costi::after {
  position: absolute;
  right: -90px;
  bottom: 30px;
  z-index: -1;
  width: 190px;
  height: 190px;
  border-radius: 50%;
  background: rgba(12, 75, 128, 0.04);
  content: "";
}

#costi > p {
  max-width: 860px;
}

#costi > p:nth-of-type(2) {
  margin-top: 28px;
  padding: 20px 22px;
  border-left: 6px solid var(--mw-pink);
  border-radius: 0 var(--mw-radius-small) var(--mw-radius-small) 0;
  background: var(--mw-blue-pale);
  color: var(--mw-blue-dark);
  font-size: clamp(1.1rem, 3vw, 1.36rem);
  font-weight: 900;
}

#studi {
  background:
    radial-gradient(circle at 95% 8%, rgba(193, 81, 127, 0.13), transparent 18rem),
    var(--mw-pink-pale);
}

#studi > p:not(:last-child) {
  max-width: 900px;
}

#studi > p:last-child {
  margin-top: 30px;
}

#tecnologia {
  background: var(--mw-white);
}

#tecnologia > p {
  max-width: 850px;
}

#tecnologia ol {
  display: grid;
  max-width: var(--mw-max);
  margin: 36px auto 0;
  padding: 0;
  gap: 18px;
  list-style: none;
  counter-reset: mw-step;
}

#tecnologia li {
  position: relative;
  overflow: hidden;
  padding: 70px 22px 24px;
  border: 1px solid var(--mw-border);
  border-radius: var(--mw-radius);
  background: var(--mw-white);
  box-shadow: var(--mw-shadow-soft);
  counter-increment: mw-step;
}

#tecnologia li::before {
  position: absolute;
  top: 14px;
  left: 20px;
  color: rgba(12, 75, 128, 0.14);
  content: "0" counter(mw-step);
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: -0.08em;
  line-height: 1;
}

#tecnologia strong {
  display: block;
  margin-bottom: 8px;
  color: var(--mw-blue);
  font-size: 1.18rem;
}

#vantaggi {
  display: grid;
  max-width: none;
  background: var(--mw-blue-pale);
  gap: 16px;
}

#vantaggi > * {
  width: min(100%, var(--mw-max));
}

#vantaggi article {
  margin: 0 auto;
  padding: 24px;
  border: 1px solid rgba(12, 75, 128, 0.08);
  border-radius: var(--mw-radius);
  background: var(--mw-white);
  box-shadow: var(--mw-shadow-soft);
}

#vantaggi article:nth-of-type(1) {
  border-top: 5px solid var(--mw-pink);
}

#vantaggi article:nth-of-type(2) {
  border-top: 5px solid var(--mw-green);
}

#vantaggi article:nth-of-type(3) {
  border-top: 5px solid var(--mw-purple);
}

#vantaggi article:nth-of-type(4) {
  border-top: 5px solid var(--mw-orange);
}

#posizione {
  background:
    radial-gradient(circle at 12% 18%, rgba(81, 193, 147, 0.12), transparent 18rem),
    var(--mw-white);
}

#posizione > p {
  max-width: 860px;
  padding: 26px;
  border: 1px solid var(--mw-border);
  border-radius: var(--mw-radius);
  background: rgba(255, 255, 255, 0.88);
  box-shadow: var(--mw-shadow-soft);
}

#lancio {
  overflow: hidden;
  background:
    radial-gradient(circle at 85% 20%, rgba(193, 81, 127, 0.55), transparent 20rem),
    linear-gradient(135deg, var(--mw-blue-dark), var(--mw-blue));
  color: var(--mw-white);
}

#lancio h2,
#lancio a {
  color: var(--mw-white);
}

#lancio > p {
  max-width: 860px;
}

#lancio > p a:not(:only-child) {
  color: var(--mw-white);
}

#countdown {
  max-width: 900px;
  margin-top: 32px;
  margin-left: max(0px, calc((100% - var(--mw-max)) / 2));
  padding: 20px 22px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: var(--mw-radius-small);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
}

#countdown p {
  margin: 0;
  font-size: clamp(1.05rem, 3vw, 1.3rem);
  font-weight: 800;
}

#countdown span {
  color: #ffffff;
  font-size: clamp(1.55rem, 5vw, 2.4rem);
  font-weight: 900;
}

#interesse {
  background:
    radial-gradient(circle at 92% 8%, rgba(193, 81, 127, 0.14), transparent 20rem),
    var(--mw-pink-pale);
}

#interesse > p {
  max-width: 780px;
}

form {
  max-width: 780px;
  margin-top: 34px;
  padding: 24px;
  border: 1px solid rgba(193, 81, 127, 0.12);
  border-radius: var(--mw-radius);
  background: var(--mw-white);
  box-shadow: var(--mw-shadow);
}

form p {
  margin-bottom: 18px;
}

label {
  color: var(--mw-blue-dark);
  font-size: 0.96rem;
  font-weight: 800;
}

input[type="text"],
input[type="tel"],
input[type="email"] {
  width: 100%;
  min-height: 50px;
  margin-top: 7px;
  padding: 10px 14px;
  border: 1px solid rgba(12, 75, 128, 0.2);
  border-radius: 12px;
  background: #fbfdff;
  color: var(--mw-text);
  font: inherit;
}

input[type="text"]:focus,
input[type="tel"]:focus,
input[type="email"]:focus {
  border-color: var(--mw-blue);
  background: var(--mw-white);
  box-shadow: 0 0 0 4px rgba(12, 75, 128, 0.1);
}

input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--mw-blue);
}

form p:has(input[type="checkbox"]) {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 10px;
}

form button {
  min-height: 52px;
  padding: 14px 22px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
  font-weight: 900;
}

form > p:nth-last-of-type(2) {
  color: var(--mw-muted);
  font-size: 0.84rem;
}

#form-success {
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(81, 193, 147, 0.16);
  color: #236647;
  font-weight: 800;
}

aside {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 10;
}

aside a {
  display: inline-flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
  padding: 12px 17px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 999px;
  background: var(--mw-green);
  box-shadow: 0 12px 24px rgba(35, 102, 71, 0.24);
  color: #153f2d;
  font-size: 0.88rem;
  text-decoration: none;
}

@media (hover: hover) {
  #tecnologia li:hover,
  #vantaggi article:hover {
    transform: translateY(-5px);
    box-shadow: var(--mw-shadow);
  }

  #hero > p:last-child a:hover,
  #studi > p:last-child a:hover,
  #lancio > p:last-child a:hover,
  #interesse > p:nth-of-type(3) a:hover,
  form button:hover,
  aside a:hover {
    transform: translateY(-2px);
  }
}

@media (min-width: 640px) {
  main > section {
    padding-right: 28px;
    padding-left: 28px;
  }

  form {
    padding: 32px;
  }
}

@media (min-width: 768px) {
  main > section {
    padding-top: 96px;
    padding-bottom: 96px;
  }

  #tecnologia ol {
    grid-template-columns: repeat(3, 1fr);
  }

  #vantaggi {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding-right: max(32px, calc((100% - var(--mw-max)) / 2));
    padding-left: max(32px, calc((100% - var(--mw-max)) / 2));
  }

  #vantaggi h2 {
    grid-column: 1 / -1;
    margin-right: 0;
    margin-left: 0;
  }

  #vantaggi article {
    width: 100%;
  }
}

@media (min-width: 1024px) {
  main > section {
    padding-top: 120px;
    padding-bottom: 120px;
    padding-right: 32px;
    padding-left: 32px;
  }

  #hero {
    padding-top: 132px;
    padding-bottom: 132px;
  }

  #hero::before {
    right: 8%;
    width: 420px;
    height: 420px;
  }

  #interesse {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(380px, 0.82fr);
    column-gap: 64px;
  }

  #interesse > * {
    width: 100%;
    margin-right: 0;
    margin-left: 0;
  }

  #interesse form {
    grid-row: 1 / span 5;
    grid-column: 2;
    margin-top: 0;
  }
}

@media (min-width: 1200px) {
  #vantaggi {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Run the suite to verify the CSS contract passes**

Run: `node --test`

Expected: PASS with the existing content tests and the new CSS-variant test.

- [ ] **Step 4: Check whitespace and confirm the design is isolated**

Run:

```bash
git diff --check
rg -n "<style|mediwell-premium-balanced.css|<script" index.html
```

Expected: no `git diff --check` output; one external stylesheet reference; no
inline `<style>` element; the original `<script>` block remains present.

- [ ] **Step 5: Commit the CSS variant**

```bash
git add index.html styles/mediwell-premium-balanced.css
git commit -m "feat: add reversible MediWell premium CSS variant"
```

### Task 3: Verify Responsive Presentation

**Files:**
- Verify: `index.html`
- Verify: `styles/mediwell-premium-balanced.css`
- Verify: `tests/mediwell-html.test.cjs`

- [ ] **Step 1: Start a local static server**

Run:

```bash
python -m http.server 8000
```

Expected: the one-page landing is available at `http://localhost:8000`.

- [ ] **Step 2: Inspect the mobile presentation**

Open `http://localhost:8000` at a mobile viewport and verify:

- hero kicker, headline, supporting paragraph, and CTA buttons are readable;
- technology and services cards stack vertically;
- countdown remains legible;
- form fields fit the viewport;
- floating WhatsApp does not cover CTA buttons or form controls;
- there is no horizontal overflow.

- [ ] **Step 3: Inspect the desktop presentation**

Open `http://localhost:8000` at a desktop viewport and verify:

- hero has spacious editorial rhythm and visible abstract decorations;
- technology cards appear in three columns;
- service cards appear in four columns at large desktop width;
- final interest section places explanatory copy beside the form;
- countdown CTA band has readable contrast;
- there is no horizontal overflow.

- [ ] **Step 4: Run fresh final verification**

Run:

```bash
node --test
git diff --check
git status --short --branch
```

Expected: all tests pass, whitespace check is clean, and the working tree contains
only intentional tracked state.
