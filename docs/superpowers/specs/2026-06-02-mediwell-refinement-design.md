# MediWell One-Page Refinement Design

**Date:** 2026-06-02

## Objective

Refine the current MediWell landing page after visual review without changing its
commercial structure or the client's copy. The result must feel more elegant and
ordered, remain conversion-focused, load more efficiently, and add a controlled
amount of motion during scrolling.

## Delivery Constraint

The WordPress deliverable is a single one-page document. HTML, CSS, and safe
JavaScript must live inside `index.html` so the final design can be incorporated
as one custom HTML block or one page-level template.

Image files remain separate optimized assets referenced by the document. They
must not be embedded as base64 data because doing so would inflate the HTML and
prevent normal browser image caching. The GitHub Pages preview uses relative
asset paths; the WordPress integration can replace those paths with uploaded
Media Library URLs.

## Findings

The screenshots and source inspection identify four root causes:

1. Global heading rules use `letter-spacing: -0.065em`, compressed line heights,
   and an `h1` size reaching `8.5rem`. This creates visually crowded line breaks,
   especially in the mobile hero.
2. The launch date is more aggressive: `letter-spacing: -0.14em`, line height
   `0.78`, and a maximum size of `12rem`. In the two-column desktop layout, the
   date intrudes into the countdown column.
3. The stylesheet imports Manrope through a render-blocking Google Fonts
   `@import`. This adds a third-party network request on the critical rendering
   path.
4. The hero and studio photography are JPG files. The hero is about 318 KiB and
   is eligible for a modern-format reduction. The header also uses a temporary
   text mark instead of the supplied MediWell logo.

## Visual Direction

### Typography

Use a refined sans-serif direction. Headings remain larger than body text and
retain a confident commercial character, but they must no longer resemble an
impact display font.

- Use a local or system-first sans-serif font stack with no render-blocking
  third-party import.
- Reduce negative tracking and use calmer line heights.
- Scale the hero heading down on mobile and desktop.
- Scale the launch date independently from general headings.
- Keep kicker labels compact and uppercase to preserve the editorial hierarchy.

### Header And Logo

Replace the temporary circular `M` mark and textual wordmark with an optimized
local version of the client-supplied MediWell PNG:

`https://mediwell.it/wp-content/uploads/2026/04/cropped-Master_2500x1000.png`

The source image is large and the origin currently rejects automated direct
downloads with HTTP `403`, although browsers can render it. The GitHub Pages
preview may reference the supplied WordPress URL directly so progress is not
blocked. The final WordPress integration should replace it with an uploaded
derivative that preserves transparency, crops unnecessary whitespace, and uses
dimensions appropriate for the header. In both cases the visible logo must
preserve its aspect ratio and remain legible on mobile.

### Launch Section

Keep the launch date as an editorial anchor, but allocate independent space for
the date and the launch copy. On desktop, the two columns must not overlap. On
mobile, the date must remain readable without crowding or horizontal overflow.

### Motion

Use an intermediate motion level: visibly more polished than a basic fade-in,
but calmer than a parallax-heavy presentation.

- Reveal text groups vertically with a restrained distance.
- Reveal paired photos and content blocks from alternating horizontal
  directions.
- Stagger the technology and benefit cards.
- Give the launch date and countdown a dedicated entrance sequence.
- Add a subtle image movement or scale response only where it improves depth.
- Keep long text and primary calls to action stable while the visitor reads.
- Disable non-essential animation when `prefers-reduced-motion: reduce` applies.

Animation remains progressive enhancement. The document must remain fully
readable if JavaScript is unavailable.

## Performance Direction

- Remove the Google Fonts CSS `@import`.
- Inline the production CSS in `index.html`.
- Keep JavaScript inline and dependency-free.
- Convert photographic JPG files to WebP and use `<picture>` with JPG fallback
  where appropriate.
- Add explicit image dimensions and decoding hints.
- Keep non-hero images lazy-loaded.
- Keep the hero image eagerly available and consider `fetchpriority="high"`.
- Use the supplied WordPress logo URL for the preview and replace it with an
  optimized uploaded derivative during WordPress integration.

GitHub Pages cache headers are platform-controlled and cannot be fixed from page
markup. Asset weight and critical-path reductions are in scope; server cache
policy is not.

## Reversibility

The existing published version remains available in Git history at commit
`77c880c`. The refinement should be implemented as focused commits:

1. One-page contract and regression tests.
2. Inline CSS consolidation and typographic correction.
3. Optimized assets and logo hookup.
4. Scroll-motion refinement.

This preserves an obvious rollback path while producing the single-file
WordPress-compatible deliverable.

## Verification

The implementation must verify:

- `index.html` contains inline `<style>` and inline safe `<script>`.
- `index.html` does not link an external CSS file or import Google Fonts.
- The hero title and launch date fit without horizontal overflow at mobile and
  desktop widths.
- The launch date does not overlap the countdown area on desktop.
- Logo and photographs load successfully.
- Images have explicit dimensions; non-hero photos remain lazy-loaded.
- Motion classes work with JavaScript and content remains visible without it.
- Reduced-motion users receive a stable page.
- Existing copy-focused Node tests remain green after being updated for the
  single-file contract.
