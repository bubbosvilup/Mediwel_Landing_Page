# MediWell Floorplan Wow Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the floorplan interaction with branded pink/green hotspot motion, an on-scroll activation sequence, and a more premium modal entrance.

**Architecture:** Keep the existing single-file landing page. Add CSS classes and keyframes for scan/reveal/hotspot motion, update the floorplan observer to toggle an active class, and keep the current data-driven modal behavior.

**Tech Stack:** Static HTML, inline CSS, vanilla JavaScript, Node test runner, Playwright.

---

## File Structure

- Modify: `index.html`
  - Update floorplan stage, hotspot, modal, and keyframe CSS.
  - Add `mw-floorplan-hotspot-shell` visual layers through pseudo-elements only; no markup expansion needed.
  - Extend JavaScript to activate `.mw-floorplan-is-active` when the section enters viewport and to apply a temporary `.is-selected` class on clicked hotspots.
- Modify: `tests/mediwell-html.test.cjs`
  - Assert branded motion CSS hooks exist.
  - Assert scan/reveal classes and selected hotspot class exist.
- Modify: `tests/mediwell-layout.test.cjs`
  - Assert active class appears after the floorplan is scrolled into view.
  - Assert click still opens modal.

---

### Task 1: Write Failing Motion Tests

**Files:**
- Modify: `tests/mediwell-html.test.cjs`
- Modify: `tests/mediwell-layout.test.cjs`

- [ ] Add an HTML/CSS test asserting the stylesheet includes:
  - `.mw-floorplan-is-active`
  - `.mw-floorplan-stage::before`
  - `.mw-floorplan-stage::after`
  - `@keyframes mw-floorplan-scan`
  - `@keyframes mw-hotspot-arrive`
  - `rgba(193, 81, 127`
  - `rgba(81, 193, 147`
  - `.mw-floorplan-hotspot.is-selected`

- [ ] Add a Playwright test that scrolls `#piantina` into view, waits briefly for observer work, and asserts `.mw-floorplan-is-active` is present.

- [ ] Run `npm test`.

Expected: FAIL because the new motion hooks and activation class do not exist yet.

---

### Task 2: Implement Branded Hotspot and Stage Motion

**Files:**
- Modify: `index.html`

- [ ] Update `.mw-floorplan-stage` to support scan overlays with `::before` and `::after`.

- [ ] Update hotspot CSS:
  - blue core remains
  - pink main pulse
  - green secondary glow
  - staggered arrive animation using `--i`
  - `.is-selected` lock-on state

- [ ] Add inline `--i` custom property to each hotspot button from `0` to `8`.

- [ ] Add keyframes:
  - `mw-floorplan-scan`
  - `mw-floorplan-ignite`
  - `mw-hotspot-arrive`
  - updated `mw-hotspot-pulse`
  - `mw-hotspot-ambient`
  - `mw-hotspot-lock`

---

### Task 3: Implement Activation and Selected State JavaScript

**Files:**
- Modify: `index.html`

- [ ] Add a floorplan IntersectionObserver that applies `.mw-floorplan-is-active` to the floorplan layout or stage once.

- [ ] In the existing hotspot click handler, remove `.is-selected` from other hotspots, add it to the clicked hotspot, and remove it after the lock-on animation window.

- [ ] Keep modal behavior and content data unchanged.

---

### Task 4: Verify and Commit

**Files:**
- Modify: `index.html`
- Modify: `tests/mediwell-html.test.cjs`
- Modify: `tests/mediwell-layout.test.cjs`
- Create/modify: `docs/superpowers/plans/2026-06-12-mediwell-floorplan-wow-motion.md`

- [ ] Run `npm test`.

Expected: PASS, 0 failures.

- [ ] Commit with:

```powershell
git add index.html tests/mediwell-html.test.cjs tests/mediwell-layout.test.cjs docs/superpowers/plans/2026-06-12-mediwell-floorplan-wow-motion.md
git commit -m "Enhance floorplan motion"
```
