# MediWell Temporary Photo Sources

These local images are temporary stock placeholders for the visual-design phase.
Replace them with real MediWell photography before the final WordPress launch.

Pexels permits free website and commercial use under its license:
https://www.pexels.com/license/

## Files

- `mediwell-hero-designed-waiting-room.jpg`
  - Source: https://www.pexels.com/photo/modern-waiting-room-interior-with-stylish-chairs-34382296/
  - Photographer: Peter Fleming
- `mediwell-studio-treatment-room.jpg`
  - Source: https://www.pexels.com/photo/blue-and-white-clinic-bed-7789603/
  - Photographer: Ivan Babydov
- `mediwell-location-waiting-room.jpg`
  - Source: https://www.pexels.com/photo/waiting-room-in-a-hospital-8459996/
  - Photographer: Los Muertos Crew

## Optimized formats

The `.webp` files are generated from the documented JPG sources with:

```powershell
npx --yes sharp-cli -i assets/mediwell/mediwell-hero-designed-waiting-room.jpg -o assets/mediwell --format webp --quality 78
npx --yes sharp-cli -i assets/mediwell/mediwell-studio-treatment-room.jpg -o assets/mediwell --format webp --quality 78
npx --yes sharp-cli -i assets/mediwell/mediwell-location-waiting-room.jpg -o assets/mediwell --format webp --quality 78
```

JPG files remain as `<picture>` fallbacks.

## Preview logo

The GitHub Pages preview references the supplied WordPress logo:

`https://mediwell.it/wp-content/uploads/2026/04/cropped-Master_2500x1000.png`

During WordPress integration, upload a cropped and resized derivative and replace
the preview URL with the Media Library URL.
