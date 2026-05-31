# MediWell Content Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the previous MediWell landing page design with a clean, unstyled, WordPress-ready HTML content structure that follows the approved messaging and keeps only a demonstrative form.

**Architecture:** Keep the landing page as a single standalone `mediwell.html` document because this phase is a content reset, not a WordPress integration or a design-system implementation. Add a Node built-in test that treats the HTML as a contract: it checks the required sections, forbidden copy, full-day pricing, form fields, countdown target, WhatsApp placement, and the absence of active CSS, navigation, and footer elements.

**Tech Stack:** HTML5, vanilla JavaScript, Node.js built-in `node:test`, Node.js built-in `assert`.

---

### Task 1: Add The Landing Page Contract Test

**Files:**
- Create: `tests/mediwell-html.test.cjs`

- [ ] **Step 1: Write the failing contract test**

```js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const html = readFileSync(resolve(__dirname, '..', 'mediwell.html'), 'utf8');

test('keeps the reset document unstyled and WordPress-embeddable', () => {
  assert.doesNotMatch(html, /<style[\s>]/i);
  assert.doesNotMatch(html, /<nav[\s>]/i);
  assert.doesNotMatch(html, /<footer[\s>]/i);
  assert.match(html, /COLORI PRINCIPALI DEL DESIGN PRECEDENTE/);
});

test('uses the approved copy without forbidden wording or individual studio cards', () => {
  assert.doesNotMatch(html, /\bambulatori?\b/i);
  assert.doesNotMatch(html, /\bASL\b/i);
  assert.doesNotMatch(html, /\bcertificat[oaie]?\b/i);
  assert.doesNotMatch(html, /mezzi pubblici/i);
  assert.doesNotMatch(html, /Studio (Medico )?(Uno|Due|Tre|Quattro|Cinque|[1-5])/i);
  assert.match(html, /Il tuo nuovo studio sanitario a giornata a Faenza/);
  assert.match(html, /Ottimizza i costi, azzera gli sprechi/);
  assert.match(html, /Condivisione intelligente che elimina i costi fissi/);
  assert.match(html, /da € 76,00 a € 98,00 al giorno, IVA inclusa/i);
  assert.match(html, /prenotazioni avvengono esclusivamente a giornata intera/i);
});

test('presents the studios once as a general ready-to-use overview', () => {
  assert.match(html, /Solo 5 studi domotici/);
  assert.match(html, /da 12 a 15 mq/);
  assert.match(html, /scrivanie regolabili motorizzate/i);
  assert.match(html, /due sedie per pazienti o clienti/i);
  assert.match(html, /appendiabiti/i);
  assert.match(html, /armadietti con chiave/i);
  assert.match(html, /lettini medici elettrici/i);
  assert.match(html, /lettini fisioterapici elettrici/i);
  assert.match(html, /poltrone multifunzionali elettriche/i);
});

test('explains the technology-led private access flow', () => {
  assert.match(html, /La tecnologia sostituisce la segreteria/i);
  assert.match(html, /disponibilità in tempo reale/i);
  assert.match(html, /codice personale/i);
  assert.match(html, /tastiera elettronica/i);
  assert.match(html, /numero dello studio/i);
  assert.match(html, /citofono privato dello studio/i);
});

test('keeps the parking message and the September 2 2026 launch countdown', () => {
  assert.match(html, /Posizione strategica, senza stress da parcheggio/i);
  assert.match(html, /100 metri/i);
  assert.match(html, /parcheggio ampio e gratuito/i);
  assert.match(html, /2 settembre 2026/i);
  assert.match(html, /2026-09-02T07:00:00\+02:00/);
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
  assert.match(form, /Manifesta interesse e blocca la priorità/i);
  assert.match(html, /data-demo="true"/);
});
```

- [ ] **Step 2: Run the test to verify it fails on the previous page**

Run: `node --test tests/mediwell-html.test.cjs`

Expected: FAIL because the old page contains active CSS, forbidden wording, detailed room cards, the old countdown JavaScript target, and optional form fields.

- [ ] **Step 3: Commit the failing test**

```bash
git add tests/mediwell-html.test.cjs
git commit -m "test: define MediWell content reset contract"
```

### Task 2: Replace The Previous Landing Page

**Files:**
- Modify: `mediwell.html`

- [ ] **Step 1: Replace the previous document with a semantic unstyled HTML document**

The replacement document must contain:

```html
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MediWell | Studi sanitari a giornata a Faenza</title>
  <meta name="description" content="Studi sanitari domotici pronti all'uso a Faenza, prenotabili esclusivamente a giornata intera.">
</head>
<body>
  <!-- COLORI PRINCIPALI DEL DESIGN PRECEDENTE
    Blu principale: #0c4b80
    Blu scuro: #083966
    Rosa: #c1517f
    Verde: #51c193
    Sfondo chiaro: #f8f9fa
    Testo: #2d3436
  -->
  <main>
    <!-- Semantic content sections: hero, costi, studi, tecnologia,
         vantaggi, posizione, lancio, interesse. -->
  </main>
  <!-- Standalone WhatsApp contact action outside the form. -->
  <script>
    // Countdown targeting 2026-09-02T07:00:00+02:00.
    // Demonstrative form: required-field validation and local success message only.
  </script>
</body>
</html>
```

Populate the semantic sections with the approved Italian copy from `docs/superpowers/specs/2026-05-31-mediwell-content-reset-design.md`. Keep a single general studios overview and do not add any active `<style>` element.

- [ ] **Step 2: Run the contract test to verify it passes**

Run: `node --test tests/mediwell-html.test.cjs`

Expected: PASS with 6 passing tests.

- [ ] **Step 3: Inspect the reset for forbidden wording**

Run:

```bash
rg -n -i "ambulator|asl|certificat|mezzi pubblici|studio (medico )?(uno|due|tre|quattro|cinque|[1-5])|fasce orarie|tariffe di lancio" mediwell.html
```

Expected: no matches.

- [ ] **Step 4: Commit the reset**

```bash
git add mediwell.html
git commit -m "feat: reset MediWell landing page content"
```

### Task 3: Verify The Final Reset

**Files:**
- Verify: `mediwell.html`
- Verify: `tests/mediwell-html.test.cjs`

- [ ] **Step 1: Run the full automated test command**

Run: `node --test tests/mediwell-html.test.cjs`

Expected: PASS with 6 passing tests and 0 failures.

- [ ] **Step 2: Confirm the file remains a standalone WordPress-ready section**

Run:

```bash
rg -n "<style|<nav|<footer|<form|data-demo|2026-09-02T07:00:00\\+02:00|wa\\.me" mediwell.html
```

Expected: matches for the form, demo marker, corrected countdown date, and WhatsApp links; no matches for `<style`, `<nav`, or `<footer`.

- [ ] **Step 3: Review the final diff**

Run: `git diff HEAD~2..HEAD --stat && git status --short --branch`

Expected: the contract test is added, `mediwell.html` is replaced, and the worktree is clean.
