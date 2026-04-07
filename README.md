# luxsync-v2

A dark-themed photography portfolio gallery built with React and Vite. Features a responsive bento grid layout, per-medium color coding, hover animations, and a detail modal with EXIF-style metadata.

## Stack

- **React 18** — UI
- **Vite 5** — dev server and build
- **lucide-react** — icons
- **@dnd-kit** — drag-and-drop and reordering
- **CSS-in-JS** (injected `<style>` tag) — no external stylesheet required

## Getting Started

```bash
npm install
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

## Features

- **Editable Gallery** — Toggle edit mode to add, edit, delete, and reorder collections
- **Drag & Drop** — Reorganize photo cards with mouse drag (via @dnd-kit with pointer sensors)
- **Rich Media Support** — Five photography mediums (Film, Digital, Drone, Mobile, Darkroom) with custom accent colors
- **Modal Detail View** — Full-screen photo viewer with EXIF-style metadata and story text
- **Status Tracking** — Mark collections as published, developing, archived, or private (with pulse animation for developing status)
- **Image Compression** — Automatic JPEG compression on upload (1200px max, 0.75 quality)
- **Persistent State** — Gallery data automatically saved to browser localStorage
- **Publishable HTML** — Export gallery as standalone HTML file with embedded styles
- **Responsive Design** — Adapts from 3-column desktop to 2-column tablet to mobile single-column

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
Root component with full gallery management. State includes:
- `editMode` — Toggle for edit/view mode
- `photos` — Array of all photo objects (persisted to localStorage via `useGalleryState`)
- `activeFilter` — Currently selected medium filter (default: "All")
- `openPhoto` — Currently open modal photo (or null)
- `editingPhoto` — Photo being edited in CardEditModal (or null)

Renders the header, legend, filter bar, bento grid of `SortableCard` components (in edit mode) or `PhotoCard` components (in view mode), photo modal, and edit toolbar. The edit toolbar appears when `editMode` is true and provides buttons to add new cards, download published HTML, and toggle edit mode.

### `PhotoCard`
Renders a single photo tile in the grid. Accepts:
| Prop | Type | Description |
|------|------|-------------|
| `photo` | `object` | Photo data object (see schema below) |
| `dimmed` | `boolean` | Reduces opacity when the active filter doesn't match this card's medium |
| `onOpen` | `function` | Called with the photo object when the card is clicked |
| `editMode` | `boolean` | When true, shows edit/delete buttons and drag handle instead of hover overlay |
| `onEdit` | `function` | Called when edit button is clicked with the photo object |
| `onDelete` | `function` | Called when delete button is clicked with the photo ID |
| `dragHandleProps` | `object` | Spread onto the drag handle element (from @dnd-kit integration) |

Features a 3D tilt effect on mouse move (via the `useTilt` hook), a grain overlay, vignette, hover slide-up overlay, and corner brackets — all color-coded by medium.

### `SortableCard`
Wraps `PhotoCard` with @dnd-kit's `useSortable` hook to enable drag-and-drop reordering. Handles transform animations and opacity during dragging. Used when `editMode` is active.

### `CardEditModal`
Full-featured modal for editing photo card details. Provides form fields for:
- Image upload with preview and compression
- Title, location, date, camera, film stock
- Frame count, medium selection, status selection
- Grid size (1x1, 2x1, 1x2, 2x2, 3x1)
- Gallery URL, tags (comma-separated), and story text

Accepts `photo`, `onSave(updatedPhoto)`, and `onClose` props.

### `PhotoModal`
Full-screen detail view for a selected photo. Features:
- Large hero image with overlay gradient
- Title, location, and date
- EXIF-style chip display (camera, film stock, frame count, medium)
- Story text (italicized, left-bordered)
- Tag cloud
- Status indicator with pulse animation for developing status
- External gallery link button
- Closes on `Escape`, backdrop click, or close button

### `FilterBar`
Renders filter buttons for "All" and each medium. Active buttons glow with the medium's accent color and dimmed state is applied to non-matching cards.

### `MediumLegend`
Horizontal scrollable legend strip showing a colored dot and label for each medium.

### `FontStyle`
Injects Google Fonts (`Oxanium`, `Outfit`, `JetBrains Mono`) and all CSS into the document as a `<style>` tag.

## Edit Mode & Export

When the **EDIT** button (header) is toggled:

1. **Drag & Reorder** — Click and drag the grip icon on any card to re-order the grid
2. **Edit Card** — Click the pencil icon to open `CardEditModal` and modify details
3. **Delete Card** — Click the trash icon to remove a card (non-reversible)
4. **Add Card** — Click the dashed + box at the bottom to create a new blank card
5. **Download** — Click the download icon to generate and save a standalone HTML file with all gallery data embedded

The grid uses @dnd-kit's `DndContext` with `PointerSensor` for smooth drag-and-drop, and cards are rendered as `SortableCard` components when editMode is active.

## Hooks

### `useTilt(ref)`
Attaches `onMouseMove` / `onMouseLeave` handlers to an element ref to produce a subtle `perspective` + `rotateX/Y` tilt effect. Uses clientX/Y to calculate rotation angles. Returns the two event handlers to spread onto the target element.

### `useGalleryState()`
Manages gallery state with localStorage persistence. Returns `{ photos, setPhotos }`. Loads saved state on mount, falls back to sample data if localStorage is empty or invalid.

## Utilities

### `compressImage(file, maxSide = 1200, quality = 0.75)`
Asynchronously compresses an image file to reduce size. Returns a promise resolving to a JPEG data URL.

### `generatePublishedHTML(photos)`
Generates a standalone, production-ready HTML file with embedded CSS and vanilla JS. Includes all photos, modals, filtering, and gallery state. Used for exporting the gallery as a static website.

## Data

### `MEDIUM_CONFIG`
Maps medium keys to their accent color (`border`), glow color (`glow`), display label, and Lucide icon component.

| Key | Color | Label | Icon |
|-----|-------|-------|------|
| `Film` | amber `#f59e0b` | FILM | Camera |
| `Digital` | cyan `#06b6d4` | DIGITAL | Aperture |
| `Drone` | purple `#a855f7` | DRONE | Wind |
| `Mobile` | green `#10b981` | MOBILE | Smartphone |
| `Darkroom` | red `#ef4444` | DARKROOM | Flame |

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
| `id` | `string` | Unique identifier (e.g. `"roll-001"`) |
| `size` | `"1x1" \| "2x1" \| "1x2" \| "2x2" \| "3x1"` | Grid span (column × row) |
| `title` | `string` | Display title |
| `location` | `string` | Human-readable location string |
| `date` | `string` | Display date (e.g. `"OCT 2024"`) |
| `medium` | `string` | One of the `MEDIUM_CONFIG` keys |
| `camera` | `string` | Camera and lens info (e.g. `"Nikon FM2 / 50mm f1.4"`) |
| `film_stock` | `string \| null` | Film name for analog formats, or `null` for digital |
| `shot_count` | `number` | Total frames or exposures in collection |
| `cover` | `string` | Image URL for cover photo |
| `status` | `string` | One of: `"published"`, `"developing"`, `"archived"`, `"private"` |
| `tags` | `array` | Array of tag strings (e.g. `["street", "rain", "japan"]`) |
| `story` | `string` | Narrative description of the shoot |
| `gallery_url` | `string` | External link to full gallery or portfolio |

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
