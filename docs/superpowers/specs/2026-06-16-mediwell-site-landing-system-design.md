# MediWell Site Landing System Design

## Goal

Bring the internal MediWell pages up to the same premium, editorial visual system as the current landing page in `index.html`, while preserving the existing page text and ensuring the result works well on mobile.

## Scope

Update the public static pages that currently feel visually separate from the landing:

- `chi-siamo.html`
- `come-funziona.html`
- `contatti.html`
- `prenota.html`
- `homepage.html`
- `studio-uno.html`
- `studio-due.html`
- `studio-tre.html`
- `studio-quattro.html`
- `studio-cinque.html`

Remove `studi-medici.html` because it is redundant.

Legal and policy pages stay structurally conservative unless they need link cleanup after removing `studi-medici.html`.

## Design Direction

Use `index.html` as the canonical visual reference. Internal pages should feel like extensions of the landing, not legacy template pages.

The shared aesthetic should include:

- glass header language where appropriate;
- large editorial heroes with disciplined spacing;
- MediWell palette from the landing: blue, dark ink, pale blue, pink, green, orange, purple, white;
- section index/kicker treatments;
- pill buttons, ghost buttons, and text links matching the landing;
- large image blocks with soft shadows and restrained radii;
- stronger final CTAs;
- mobile layouts that avoid cramped text, overlapping controls, and unstable card sizing.

## Content Rules

Existing marketing text must remain intact. Only clearly broken encoding artifacts may be corrected, such as replacement characters in Italian accents or corrupted arrow glyphs. Do not introduce new claims, new pricing, new policies, or new service promises.

## Page Behavior

The site remains static HTML/CSS/JS with no build step. Pages must continue to work when opened directly or hosted by WordPress/Hostinger.

Internal links that point to `/studi-medici/` should be redirected to still-valid destinations, generally the booking page or landing studio section, depending on context.

## Verification

Run the existing Node tests with `npm test`. Use browser/screenshot inspection for desktop and mobile widths after visual work, focusing on:

- hero readability;
- CTA visibility;
- image loading and cropping;
- mobile stacking;
- no text overlap;
- no broken links to `studi-medici.html`.
