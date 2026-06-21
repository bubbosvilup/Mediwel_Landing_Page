# MediWell Site Landing System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the internal MediWell static pages feel like a direct continuation of the premium landing page while preserving existing text and mobile usability.

**Architecture:** This is a static HTML/CSS site with page-local styles. Reuse the landing design language by replacing legacy page wrappers with a shared internal-page visual system embedded per page, then adapt each page's markup enough to support stronger heroes, editorial sections, and CTA blocks. Remove the redundant `studi-medici.html` page and clean links pointing to it.

**Tech Stack:** Static HTML, CSS, minimal inline JavaScript already present in the site, Node test runner via `npm test`, Playwright for visual inspection.

**Implementation status (21 June 2026):** Completed. Subsequent responsive corrections removed the portrait overlay from the Come funziona and Prenota heroes, compacted their vertical spacing, and added page-specific Playwright regression tests. The current mandatory QA rules are documented in `AGENTS.md`.

---

## File Structure

- Modify `chi-siamo.html`: rebuild visual layout around the existing about text.
- Modify `come-funziona.html`: rebuild process/timeline layout around the existing step text.
- Modify `contatti.html`: rebuild contact info and form layout with landing-system controls.
- Modify `prenota.html`: rebuild booking studio card grid and help CTA.
- Modify `homepage.html`: align older home page styling and links with the current landing system.
- Modify `studio-uno.html`, `studio-due.html`, `studio-tre.html`, `studio-quattro.html`, `studio-cinque.html`: align studio detail pages and booking CTAs.
- Delete `studi-medici.html`: redundant page.
- Modify tests only if they encode the now-removed `studi-medici.html` assumption.

### Task 1: Baseline And Link Audit

**Files:**
- Read: `tests/mediwell-html.test.cjs`
- Read: `tests/mediwell-layout.test.cjs`
- Read: target HTML pages

- [ ] **Step 1: Run baseline tests**

Run: `npm test`

Expected: The command completes; record any current failures before editing.

- [ ] **Step 2: Find links and references to the redundant page**

Run: `rg -n "studi-medici|/studi-medici/" *.html tests docs`

Expected: A list of links that must either be removed with the page or repointed to a valid destination.

### Task 2: Create The Internal Page System

**Files:**
- Modify: `chi-siamo.html`
- Modify: `come-funziona.html`
- Modify: `contatti.html`
- Modify: `prenota.html`

- [ ] **Step 1: Introduce landing-aligned tokens in each page style block**

Use the landing palette and typography names:

```css
--mw-blue: #0c4b80;
--mw-blue-dark: #062d52;
--mw-blue-ink: #05243e;
--mw-blue-pale: #eaf3f7;
--mw-pink: #c1517f;
--mw-pink-dark: #9b345e;
--mw-pink-pale: #f8e9ef;
--mw-bg: #f8f9fa;
--mw-text: #2d3436;
--mw-green: #51c193;
--mw-orange: #e67e22;
--mw-purple: #715fa3;
--mw-muted: #68757a;
--mw-border: rgba(12, 75, 128, 0.15);
--mw-shadow: 0 30px 70px rgba(5, 36, 62, 0.18);
--mw-shadow-soft: 0 16px 40px rgba(5, 36, 62, 0.11);
--mw-max: 1180px;
```

- [ ] **Step 2: Replace legacy rounded-card-heavy styling**

Use editorial sections, two-column grids, large media panels, 8-24px radii depending on context, and landing-style pill CTAs. Keep the existing page text strings.

- [ ] **Step 3: Add mobile-first responsive rules**

Ensure each page stacks to one column below `760px`, uses stable button wrapping, and avoids viewport-width font scaling.

### Task 3: Remove Redundant Studios Page

**Files:**
- Delete: `studi-medici.html`
- Modify: HTML pages with links to `/studi-medici/`
- Modify: tests if needed

- [ ] **Step 1: Delete `studi-medici.html`**

Use a non-destructive tracked delete: remove only this file.

- [ ] **Step 2: Repoint links**

Replace links to `/studi-medici/` with the best still-valid destination:

```text
/prenota/ for booking/exploring available studios
/#studi for references to the landing's studio section
```

- [ ] **Step 3: Update tests if they require the deleted file**

Keep tests checking all remaining HTML pages and broken internal links.

### Task 4: Align Studio Detail Pages

**Files:**
- Modify: `studio-uno.html`
- Modify: `studio-due.html`
- Modify: `studio-tre.html`
- Modify: `studio-quattro.html`
- Modify: `studio-cinque.html`

- [ ] **Step 1: Preserve each studio's existing text and facts**

Do not rewrite room descriptions, feature names, pricing references, or booking copy.

- [ ] **Step 2: Apply the same landing-system CSS language**

Use large media, specification bands, CTA panels, and mobile stacking consistent with the internal pages.

- [ ] **Step 3: Verify page-to-page consistency**

Studio pages should share component styling and differ only by content, accent color, and imagery.

### Task 5: Verification And Visual QA

**Files:**
- Read/verify: all remaining `.html` pages

- [ ] **Step 1: Run automated tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 2: Run a broken-reference scan**

Run: `rg -n "studi-medici|ï¿½|�| \\?" *.html`

Expected: No stale `studi-medici` links. Encoding artifacts should be either gone or intentionally left only where they are not user-visible.

- [ ] **Step 3: Inspect desktop and mobile**

Open representative pages in a browser:

```text
index.html
chi-siamo.html
come-funziona.html
prenota.html
contatti.html
studio-uno.html
```

Expected: No overlap, no clipped buttons, good mobile stacking, visible CTAs, images render.

Also confirm that vertical spacing is proportional, no text intersects images or decorative pseudo-elements, all copy remains fully visible, and there is no horizontal overflow at 1440×1000 or 390×844.

## Self-Review

Spec coverage: The plan covers internal page visual alignment, text preservation, mobile checks, redundant page removal, link cleanup, and verification.

Placeholder scan: No placeholder tasks remain.

Type consistency: The site is static HTML/CSS; file names and commands are consistent with the repository.
