# MediWell Contact Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the contact form and placeholder content with an approved no-header contact hub centered on WhatsApp and verified MediWell contact details.

**Architecture:** Keep `contatti.html` as a WordPress-ready single fragment containing page markup, scoped CSS, the existing internal visual-system CSS, and the canonical footer. Use new `mw-contact-*` classes so legacy internal-page selectors cannot distort the approved layout, and cover the output with structural and browser tests.

**Tech Stack:** HTML5, scoped CSS, Node.js test runner, Playwright, Google Chrome

**Implementation status (21 June 2026):** Completed and verified. The location card was subsequently repositioned between the four contact cards and the footer to remove excessive empty space. Persistent responsive layout checks are now defined in `AGENTS.md`.

---

### Task 1: Lock the approved contact-page contract

**Files:**
- Create: `tests/contatti.test.cjs`
- Modify: `contatti.html:1-177`

- [ ] **Step 1: Write the failing structural tests**

Create `tests/contatti.test.cjs` with assertions that `contatti.html` contains the approved heading, real email, PEC, phone, address, WhatsApp icon, `wa.me`, `tel:`, `mailto:` and Google Maps links. Assert that `<header>`, `<form>`, form controls, unverified hours, fake address, fake phone and map placeholders are absent. Assert that the canonical footer remains present.

- [ ] **Step 2: Verify RED**

Run: `node --test tests/contatti.test.cjs`

Expected: failures for the existing form, placeholder data, missing approved heading and missing contact links.

- [ ] **Step 3: Replace the page-specific markup and CSS**

Replace the content before the first `<style>` with semantic `.mw-contact-page` markup containing:

```html
<main class="mw-contact-page">
  <section class="mw-contact-hero" aria-labelledby="mw-contact-title">
    <p class="mw-contact-kicker">Parliamo del tuo studio ideale</p>
    <h1 id="mw-contact-title">Un contatto diretto.<br>Una risposta concreta.</h1>
    <p class="mw-contact-lead">Per disponibilità, tariffe o una visita conoscitiva, scegli il canale che preferisci. Su WhatsApp rispondiamo rapidamente.</p>
    <a class="mw-contact-whatsapp" href="https://wa.me/393930593500" target="_blank" rel="noopener">
      <img src="https://mediwell.it/wp-content/uploads/2026/06/WA_colori.png" alt="" aria-hidden="true">
      <span><small>Scrivici ora su WhatsApp</small>+39 393 059 3500</span>
    </a>
  </section>
  <section class="mw-contact-details" aria-label="Recapiti MediWell">
    <!-- Four cards: email, customer service, address, PEC -->
    <!-- A final location panel links to Google Maps and WhatsApp -->
  </section>
</main>
```

Replace only the legacy page-specific CSS before `/* MediWell canonical animated footer */`. Use a two-column desktop grid, one-column mobile layout, visible focus states, minimum 48px tap targets, and reduced-motion handling. Do not alter the canonical footer CSS, shared internal visual-system CSS or footer markup.

- [ ] **Step 4: Verify GREEN**

Run: `node --test tests/contatti.test.cjs`

Expected: all contact-page contract tests pass.

### Task 2: Persist visual-companion guidance and verify rendered behavior

**Files:**
- Modify: `AGENTS.md`
- Modify: `tests/browser-tooling.test.cjs`
- Modify: `tests/contatti.test.cjs`

- [ ] **Step 1: Add failing instruction and browser assertions**

Extend `tests/browser-tooling.test.cjs` to require guidance stating that visual design work uses the visual companion without asking for confirmation. Add a Playwright test to `tests/contatti.test.cjs` that serves `contatti.html`, verifies absence of horizontal overflow at desktop and mobile widths, and confirms the WhatsApp CTA is visible and points to the correct destination.

- [ ] **Step 2: Verify RED for persistent guidance**

Run: `node --test tests/browser-tooling.test.cjs tests/contatti.test.cjs`

Expected: the guidance assertion fails because `AGENTS.md` does not yet contain the visual-companion rule.

- [ ] **Step 3: Add the persistent instruction**

Append to `AGENTS.md`:

```md
## Progettazione visuale

- Per attività che richiedono confronti visuali, mockup o valutazioni di layout usa direttamente il visual companion.
- Non chiedere conferma preventiva prima di avviare il visual companion.
```

- [ ] **Step 4: Run complete verification**

Run: `node --test tests/browser-tooling.test.cjs tests/contatti.test.cjs`

Expected: all focused tests pass.

Run: `npm test`

Expected: all repository tests pass with zero failures.

Run: `git diff --check`

Expected: no whitespace errors.

Finally inspect `contatti.html` in visible Google Chrome at desktop and mobile widths. Confirm the WhatsApp CTA, four contact cards, location panel and canonical footer render correctly without a header or form.

### Task 3: Commit only the approved scope

**Files:**
- Modify: `contatti.html`
- Modify: `AGENTS.md`
- Create: `tests/contatti.test.cjs`
- Modify: `tests/browser-tooling.test.cjs`

- [ ] **Step 1: Review repository status**

Run: `git status --short`

Expected: `come-funziona.html` remains modified but unstaged because it contains pre-existing user work.

- [ ] **Step 2: Commit the contact redesign without unrelated changes**

```powershell
git add -- contatti.html AGENTS.md tests/contatti.test.cjs tests/browser-tooling.test.cjs
git commit -m "Redesign contact page around WhatsApp"
```

- [ ] **Step 3: Confirm the unrelated file remains untouched**

Run: `git status --short`

Expected: only the pre-existing `come-funziona.html` modification remains.
