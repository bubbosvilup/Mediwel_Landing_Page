# MediWell Interactive Floorplan Design

## Goal

Add an interactive floorplan section to the MediWell landing page. The section must help visitors understand the real layout of the polistudio and discover each room or functional area through clickable hotspots.

The feature uses the clean 1672x941 floorplan image without printed blue dots or labels. Hotspots are drawn in HTML/CSS so their style, position, behavior, and future content can be updated without regenerating the image.

## Placement

Place the section immediately after the hero and before the current `01 Il modello` section. This makes the floorplan the first concrete proof point after the headline, while the pricing/model narrative remains directly below it.

The section can be moved later if the page flow feels too heavy above the fold.

## Areas

The floorplan contains 9 clickable areas:

- Studio 1
- Studio 2
- Sala aspetto
- Studio 3
- Studio 4
- Studio 5
- Entrata disabili
- Ingresso
- Spogliatoi

Each area is represented by one hotspot positioned with percentage coordinates relative to the image.

## User Experience

The section includes:

- a concise heading, such as "Esplora gli spazi MediWell"
- a short instruction inviting users to click the points on the floorplan
- the responsive floorplan image
- 9 visible blue hotspots drawn above the image
- no visible text labels on the floorplan by default
- accessible names for every hotspot, so keyboard and screen reader users can understand each target

Hotspots should feel polished and clearly clickable. They may use a subtle pulse or ring animation, but the animation must not dominate the page or distract from the floorplan.

On desktop, the floorplan should display large enough to inspect the rooms. On mobile, the image remains responsive and the hotspot hit targets stay large enough for touch interaction.

## Modal

Use one reusable modal component driven by data for the selected area.

The modal supports:

- title
- short description
- 2-3 feature/value bullets
- optional future image metadata
- optional call to action linking to `#interesse`

For the first implementation, the modal is text-only. The data structure must still reserve a simple way to add images later, for example an optional `image` object with `src`, `alt`, and optional caption fields. The modal layout should handle both states:

- without image: clean text-focused panel
- with image in the future: image area plus the same title, description, bullets, and CTA

Modal behavior:

- opens when a hotspot is clicked
- closes via close button
- closes on backdrop click
- closes with the `Escape` key
- returns focus to the triggering hotspot after closing
- does not navigate away from the page

## Content Direction

The copy should describe real rooms and functional areas without inventing unconfirmed details. Studios 1-5 can share a consistent structure while varying emphasis slightly. Shared claims can reference existing landing page content:

- ready-to-use rooms
- washable walls and practical surfaces
- lavabo where visible/applicable
- privacy
- smart booking and independent use
- included cleaning and ordered spaces

Functional areas should explain orientation and convenience:

- Sala aspetto: patient welcome and waiting flow
- Ingresso: arrival point and orientation into the polistudio
- Entrata disabili: accessible entry route
- Spogliatoi: support area for preparation and organization

## Technical Design

Implement in the existing single-file landing page unless the project structure changes before implementation.

Recommended structure:

- add a new section after `#hero`
- store the clean floorplan image under `assets/mediwell/`
- use a `figure` or dedicated wrapper with `position: relative`
- render hotspot buttons as absolutely positioned children using CSS custom properties or data attributes
- keep area content in one JavaScript array/object so future edits are localized
- use one modal container populated from the selected area data

Use semantic buttons for hotspots rather than an HTML image map. This gives better styling, keyboard behavior, focus handling, and future flexibility.

## Accessibility

Hotspots must be real `<button>` elements with clear `aria-label` text.

The modal must use:

- `role="dialog"`
- `aria-modal="true"`
- a labelled title
- keyboard close with `Escape`
- reasonable focus management

Animations should respect `prefers-reduced-motion`.

## Testing

Extend existing tests only where useful and avoid brittle pixel checks for exact hotspot coordinates.

Verification should cover:

- the new section exists after the hero
- all 9 hotspots render with accessible labels
- modal opens with the expected content when a hotspot is activated
- modal can close
- existing HTML/layout tests still pass

Manual visual verification should check desktop and mobile viewports for:

- floorplan framing
- hotspot alignment
- modal readability
- no overlap with adjacent sections
