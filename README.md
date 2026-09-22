<div align="center">

# LuxSync v2

**A dark-themed React photo gallery with an editable bento grid, drag-and-drop reordering, and one-click static export.**

![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-AGPLv3%20%2B%20Commercial-00D4C8.svg)

</div>

---

## What it does

LuxSync v2 is a single-page photography portfolio gallery. It renders a bento-style grid of photo cards grouped by medium (Film, Digital, Drone, Mobile, Darkroom), and — when edit mode is switched on — lets the photographer add, edit, delete, and drag-reorder cards directly in the browser, then export the whole gallery as a standalone, publishable HTML file with no build step required for the recipient.

This is an earlier, client-only iteration of the LuxSync gallery concept — everything (including "persistence") runs in the browser via `localStorage`, with no backend. [`luxsync-v3`](../luxsync-v3) replaces this with a server-backed version that pulls from a real Google Drive/Dropbox folder instead of manually-entered sample data.

## Features

- **Editable gallery** — toggle edit mode to add, edit, delete, and reorder photo cards
- **Drag & drop reordering** — powered by `@dnd-kit` with pointer sensors
- **Five photography mediums** — Film, Digital, Drone, Mobile, Darkroom, each with its own accent color
- **Modal detail view** — full-screen photo viewer with EXIF-style metadata (camera, film stock, frame count) and story text
- **Status tracking** — mark collections published, developing, archived, or private, with a pulse animation for "developing"
- **Client-side image compression** — uploads are auto-compressed to a 1200px-max JPEG at 0.75 quality before storage
- **Persistent local state** — gallery data is saved to `localStorage` so edits survive a page reload
- **Publishable export** — download the gallery as a self-contained static HTML file with all styles and data embedded
- **Responsive bento grid** — 3-column desktop down to a single column on mobile, with configurable card spans (1x1 up to 3x1)

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite 5 |
| Drag & drop | @dnd-kit (core, sortable, utilities) |
| Icons | lucide-react |
| Styling | CSS-in-JS (injected `<style>` tag), Google Fonts (Oxanium, Outfit, JetBrains Mono) |
| Persistence | Browser `localStorage` (no backend) |

## Screenshots

_Screenshots coming soon._

## Quick Start

```bash
npm install
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

All components live in a single file, [`PhotoGallery.jsx`](PhotoGallery.jsx); the entry point at [`src/main.jsx`](src/main.jsx) mounts `<PortfolioGallery />` into `#root`.

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

## Status / Roadmap

- [x] Editable bento grid with add/edit/delete
- [x] Drag-and-drop reordering (@dnd-kit)
- [x] Photo detail modal with EXIF-style metadata
- [x] Client-side image compression on upload
- [x] localStorage persistence
- [x] Standalone HTML export
- [ ] Server-backed data source (superseded by [luxsync-v3](../luxsync-v3))
- [ ] Automated tests for gallery state and export output

## Changelog

- **2026-08-18** — Renamed page title to "LuxSync"
- **2026-04-08** — Comprehensive README rewrite documenting edit mode, drag-and-drop, and export features
- **2026-03-12** — Initial commit: React + Vite bento-grid photo gallery with edit mode, drag-and-drop, and static HTML export

## License

This project is dual licensed.

- Community Edition — [GNU Affero General Public License v3 (AGPLv3)](LICENSE). Free to use, modify, and self-host. If you distribute a modified version or run it as a network service, you must make the corresponding source available.
- Commercial License — for organisations that want to embed, modify, or distribute this software without AGPLv3's obligations. See [COMMERCIAL-LICENSE.md](COMMERCIAL-LICENSE.md).

---

<div align="center">
<sub>Built by <a href="https://github.com/TheBooleanJulian">@TheBooleanJulian</a></sub>
</div>
