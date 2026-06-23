# MediWell Floorplan Wow Motion Design

## Goal

Elevate the interactive floorplan so it feels like a premium smart interface rather than a static image with clickable dots.

The update focuses on:

- a more noticeable branded hotspot pulse
- a first-view reveal sequence for the floorplan
- a stronger click-to-modal transition

## Approved Direction

Use the highest-impact direction:

- the floorplan should feel like it "turns on" when it enters view
- a soft scan highlight should cross the floorplan
- hotspots should appear in sequence with a controlled pop
- resting hotspot motion should be more visible and more branded
- modal opening should feel more deliberate and polished

This should still feel appropriate for a healthcare/polistudio landing page: premium, modern, and smart, not playful or chaotic.

## Hotspot Motion

Keep the hotspot core blue, matching the MediWell primary blue.

Update the pulse:

- main outer ring: MediWell pink
- secondary ambient ring/glow: MediWell green, softer and less frequent
- white inner target remains visible for contrast
- hover/focus shifts the hotspot toward pink and tightens the visual feedback

The pulse should be noticeably stronger than the current blue-only pulse, but not so large that it hides room details on the floorplan.

## Section Reveal

When the floorplan section becomes visible:

- the image stage receives an "active" state
- the map gets a subtle reveal/brightening effect
- a soft scan line crosses the stage once
- hotspots animate in one by one using staggered delays

Use the existing IntersectionObserver pattern if possible. Avoid adding external libraries.

## Click Feedback

When a hotspot is clicked:

- apply a brief selected/lock-on state to the triggering hotspot
- open the modal with a more premium motion
- keep the fallback HTML cards as the single source for modal copy

Do not implement room zoom or precise area masks in this iteration. That requires more exact room geometry and would be better handled later with SVG overlays or image masks.

## Scope

Modify the existing `index.html` and tests only where needed.

Keep the current section placement, floorplan image, hotspot positions, and modal content.

Do not move Italian copy back into inline JavaScript data. WordPress can encode accents in inline scripts and expose numeric entities in the rendered modal.

No new dependencies.

## Testing

Update tests to cover:

- floorplan reveal class is applied when the section enters viewport
- hotspot CSS includes pink and green branded motion hooks
- clicking a hotspot still opens and closes the modal
- existing layout tests continue to pass
