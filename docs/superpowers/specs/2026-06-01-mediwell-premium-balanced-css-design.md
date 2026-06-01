# MediWell Premium Balanced CSS Variant

## Objective

Create the first reversible visual-design experiment for the existing MediWell
one-page landing page. The result must feel premium, warm, trustworthy, and
conversion-focused while preserving the approved client copy.

This is an experimental CSS variant. After comparing design alternatives, the
selected design will be incorporated into the final WordPress one-page landing
page.

## Scope

- Keep `index.html` as a single scrolling page.
- Preserve the existing section order, approved copy, form fields, countdown
  behavior, and WhatsApp links.
- Add one stylesheet link in `index.html`.
- Create `styles/mediwell-premium-balanced.css`.
- Do not add unsafe JavaScript.
- Do not introduce photography in this variant.
- Do not repeat the prompt example about half-day booking: the approved offer is
  exclusively for full-day bookings.
- Keep the CSS compatible with later migration into WordPress custom CSS.

## Reversibility

The experiment is isolated in one external stylesheet:

`styles/mediwell-premium-balanced.css`

Removing the stylesheet link restores the neutral HTML presentation. Future
visual variants can be tested by creating another stylesheet and changing only
the linked CSS path. Once the client selects a design, the chosen CSS can be
incorporated into WordPress without changing the one-page architecture.

## Visual Direction

Use the balanced premium direction:

- Main blue is the dominant identity color.
- Pink is used for primary CTA emphasis and selected decorative details.
- Green is reserved for WhatsApp and occasional positive accents.
- Orange and purple may appear only as subtle secondary details.
- Use soft gradients, radial highlights, rounded cards, and restrained shadows.
- Avoid a cold clinical look, excessive playfulness, or generic SaaS styling.
- Use typography and abstract shapes as the visual anchor because photography is
  intentionally deferred.

## Design Tokens

Define CSS variables for:

```css
--mw-blue: #0c4b80;
--mw-pink: #c1517f;
--mw-bg: #f8f9fa;
--mw-text: #2d3436;
--mw-green: #51c193;
--mw-orange: #e67e22;
--mw-purple: #715fa3;
--mw-white: #ffffff;
--mw-muted: #6b7478;
```

Add derived variables only for reusable pale backgrounds, borders, radii, and
shadows.

## Page Structure

### Global Layout

- Apply a mobile-first reset and modern sans-serif stack led by Inter.
- Use a centered content width of approximately `1180px`.
- Give each section generous vertical spacing.
- Add subtle section-level radial gradients and low-opacity decorative shapes
  with pseudo-elements.
- Keep horizontal overflow disabled.

### Hero

- Present the hero as a spacious, high-conversion opening block.
- Use a soft pale-blue and pale-pink background with blurred radial shapes.
- Style the opening line as a small uppercase kicker.
- Make the main message the dominant visual element.
- Present the two existing CTA links as a pink primary pill and a white or
  transparent secondary pill.
- Use the existing content only: do not add floating claim cards because that
  would require new HTML and could introduce wording not approved by the client.
- On larger screens, use asymmetric spacing and a contained text width to avoid
  a generic centered layout.

### Model And Studios

- Turn the cost-model section into a prominent editorial sales block with pale
  blue background and highlighted pricing paragraph.
- Use the studios section as a warm white card-like block with a pale-pink
  decorative accent.
- Style the existing studio CTA as a clear secondary action.

### Technology

- Use the existing ordered list as three premium step cards.
- Display one card per row on mobile and three columns on desktop.
- Use CSS counters or the existing list order to create large step numbers.

### Included Services

- Display the four existing `<article>` elements as rounded cards.
- Use one column on mobile, two columns from tablet width, and four columns on
  larger desktop screens when space allows.
- Give cards restrained hover elevation only on devices that support hover.

### Location And Launch

- Style the location section as a calm, spacious editorial block.
- Style the launch section as a high-contrast blue CTA band.
- Make the countdown visually prominent with compact inline time values.
- Keep the existing dynamic countdown JavaScript unchanged.

### Interest Form

- Use a pale background section with a white rounded form card.
- Keep the existing WhatsApp action above the form visible as a secondary CTA.
- Style labels, controls, focus states, privacy consent, submit button, demo
  notice, and success message.
- Keep all existing form fields and local demonstrative behavior unchanged.

### Floating WhatsApp

- Style the existing `<aside>` as a fixed bottom-right green action.
- Keep the mobile version compact enough not to cover content or CTAs.
- Expand the label naturally on larger screens.

## Responsiveness

Use mobile-first CSS with breakpoints around:

- `640px`
- `768px`
- `1024px`
- `1200px`

On mobile:

- Stack all cards.
- Keep buttons wide and easy to tap.
- Reduce decorative shapes and section spacing.
- Ensure the floating WhatsApp action does not cover page actions.

On desktop:

- Increase typography scale and whitespace.
- Use asymmetric spacing where it supports editorial rhythm.
- Expand services and technology cards into grids.

## Accessibility

- Preserve semantic HTML and heading associations.
- Provide visible `:focus-visible` states for links, form fields, and buttons.
- Maintain readable contrast.
- Keep body text at a readable size and line height.
- Disable non-essential transitions for `prefers-reduced-motion: reduce`.
- Do not communicate meaning through color alone.

## Verification

- Add a CSS contract test that verifies the isolated stylesheet link, key design
  variables, responsive breakpoints, focus-visible styling, reduced-motion
  handling, and fixed WhatsApp positioning.
- Run the complete Node test suite.
- Run `git diff --check`.
- Confirm the original content contract still passes.
- Inspect the page locally in a browser at mobile and desktop sizes when browser
  tooling is available.

## Deferred Work

- Photography and real studio images.
- Additional CSS variants.
- Final incorporation into WordPress custom CSS.
- Production form integration.
