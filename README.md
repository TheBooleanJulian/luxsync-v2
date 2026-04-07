# luxsync-v2

A dark-themed photography portfolio gallery built with React and Vite. Features a responsive bento grid layout, per-medium color coding, hover animations, and a detail modal with EXIF-style metadata.

## Stack

- **React 18** — UI
- **Vite 5** — dev server and build
- **lucide-react** — icons
- **CSS-in-JS** (injected `<style>` tag) — no external stylesheet required

## Getting Started

```bash
npm install
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

## Project Structure

```
luxsync-v2/
├── src/
│   └── main.jsx          # React entry point
├── PhotoGallery.jsx       # All components and styles (single-file)
├── index.html
├── vite.config.js
└── package.json
```

All components live in [PhotoGallery.jsx](PhotoGallery.jsx). The entry point at [src/main.jsx](src/main.jsx) mounts `<PortfolioGallery />` into `#root`.

## Components

### `PortfolioGallery` (default export)
Root component. Manages `activeFilter` and `openPhoto` state, renders the header, legend, filter bar, bento grid, and modal.

### `PhotoCard`
Renders a single photo tile in the grid. Accepts:
| Prop | Type | Description |
|------|------|-------------|
| `photo` | `object` | Photo data object (see schema below) |
| `dimmed` | `boolean` | Reduces opacity when the active filter doesn't match this card's medium |
| `onOpen` | `function` | Called with the photo object when the card is clicked |

Features a 3D tilt effect on mouse move (via the `useTilt` hook), a grain overlay, vignette, hover slide-up overlay, and corner brackets — all color-coded by medium.

### `PhotoModal`
Full-screen detail view for a selected photo. Closes on `Escape`, backdrop click, or the × button. Displays the hero image, title, location, EXIF strip (camera, film stock, frame count, medium), story, tags, publication status, and a link to the external gallery.

### `FilterBar`
Renders filter buttons for "All" and each medium. Active medium buttons glow with the medium's accent color.

### `MediumLegend`
Horizontal scrollable legend strip showing a colored dot and label for each medium.

### `FontStyle`
Injects Google Fonts (`JetBrains Mono`, `Playfair Display`) and all CSS into the document as a `<style>` tag.

## Hooks

### `useTilt(ref)`
Attaches `onMouseMove` / `onMouseLeave` handlers to an element ref to produce a subtle `perspective` + `rotateX/Y` tilt effect. Returns the two event handlers to spread onto the target element.

## Data

### `MEDIUM_CONFIG`
Maps medium keys to their accent color (`border`), glow color (`glow`), display label, and Lucide icon component.

| Key | Color | Label |
|-----|-------|-------|
| `Film` | amber `#f59e0b` | FILM |
| `Digital` | cyan `#06b6d4` | DIGITAL |
| `Drone` | purple `#a855f7` | DRONE |
| `Mobile` | green `#10b981` | MOBILE |
| `Darkroom` | red `#ef4444` | DARKROOM |

### `STATUS_CONFIG`
Maps status keys to display color, label, and whether the status dot pulses.

| Key | Color | Pulse |
|-----|-------|-------|
| `published` | green | no |
| `developing` | amber | yes |
| `archived` | gray | no |
| `private` | red | no |

### `PHOTOS` (sample data)
Array of photo objects. Each object has:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `size` | `"1x1" \| "2x1" \| "1x2" \| "2x2" \| "3x1"` | Grid span (column × row) |
| `title` | `string` | Display title |
| `location` | `string` | Human-readable location string |
| `date` | `string` | Display date (e.g. `"OCT 2024"`) |
| `medium` | `string` | One of the `MEDIUM_CONFIG` keys |
| `camera` | `string` | Camera + lens description |
| `film_stock` | `string \| null` | Film stock name, or `null` for digital |
| `shot_count` | `number` | Number of frames shot |
| `cover` | `string` | Image URL |
| `status` | `string` | One of the `STATUS_CONFIG` keys |
| `tags` | `string[]` | Array of tag strings |
| `story` | `string` | Short narrative about the shoot |
| `gallery_url` | `string` | URL to external full gallery |

## Grid Sizing

Cards use CSS grid with `data-size` to control span:

| `size` value | Columns | Rows | Aspect ratio |
|---|---|---|---|
| `1x1` | 1 | 1 | 1:1 |
| `2x1` | 2 | 1 | 2:1 |
| `1x2` | 1 | 2 | 1:2 |
| `2x2` | 2 | 2 | 1:1 |
| `3x1` | 3 | 1 | 3:1 |

On mobile (≤560px) all cards collapse to a single column with a forced `4:3` aspect ratio.

## Customization

**Add a photo** — append an entry to the `PHOTOS` array in [PhotoGallery.jsx](PhotoGallery.jsx).

**Add a medium** — add an entry to `MEDIUM_CONFIG` with `border`, `glow`, `label`, and `Icon`. No other changes needed; `FilterBar` and `MediumLegend` derive their lists from the config object.

**Change the color scheme** — edit the CSS custom properties in `FontStyle`:
```css
:root {
  --bg: #080808;
  --surface: #0f0f0f;
  --surface-2: #161616;
  --text: #e8e4dc;
  --muted: #5a5550;
  --gap: 6px;
}
```
