import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Aperture, Wind, Smartphone, Flame, X, ExternalLink, MapPin, Film, ChevronRight } from "lucide-react";

// ─── Font Injection ───────────────────────────────────────────────────────────
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #080808;
      --surface: #0f0f0f;
      --surface-2: #161616;
      --text: #e8e4dc;
      --muted: #5a5550;
      --gap: 6px;
    }

    body { background: var(--bg); color: var(--text); font-family: 'JetBrains Mono', monospace; }

    .portfolio-root {
      min-height: 100vh;
      background: var(--bg);
      padding: 0 0 80px;
    }

    /* ── Header ── */
    .portfolio-header {
      padding: 48px 32px 24px;
      border-bottom: 1px solid #1a1a1a;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .portfolio-header-left {}
    .portfolio-eyebrow {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.25em;
      color: var(--muted);
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .portfolio-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(28px, 5vw, 52px);
      font-weight: 900;
      line-height: 1;
      color: var(--text);
      letter-spacing: -0.01em;
    }
    .portfolio-title span {
      font-style: italic;
      opacity: 0.4;
    }
    .portfolio-subtitle {
      font-size: 10px;
      letter-spacing: 0.2em;
      color: var(--muted);
      margin-top: 10px;
      text-transform: uppercase;
    }
    .portfolio-count {
      font-size: 10px;
      letter-spacing: 0.15em;
      color: var(--muted);
      text-align: right;
      line-height: 1.8;
    }

    /* ── Medium Legend ── */
    .medium-legend {
      display: flex;
      gap: 20px;
      padding: 12px 32px;
      border-bottom: 1px solid #111;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .medium-legend::-webkit-scrollbar { display: none; }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 9px;
      letter-spacing: 0.2em;
      color: var(--muted);
      text-transform: uppercase;
      white-space: nowrap;
      cursor: default;
    }
    .legend-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    /* ── Filter Bar ── */
    .filter-bar {
      display: flex;
      gap: 8px;
      padding: 20px 32px;
      flex-wrap: wrap;
      align-items: center;
    }
    .filter-label {
      font-size: 9px;
      letter-spacing: 0.25em;
      color: var(--muted);
      text-transform: uppercase;
      margin-right: 4px;
    }
    .filter-btn {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 5px 12px;
      background: transparent;
      border: 1px solid #222;
      color: var(--muted);
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 0;
    }
    .filter-btn:hover { color: var(--text); border-color: #444; }
    .filter-btn.active { color: var(--text); }

    /* ── Bento Grid ── */
    .bento-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--gap);
      padding: 0 32px;
    }
    @media (max-width: 900px) {
      .bento-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 560px) {
      .bento-grid { grid-template-columns: 1fr; padding: 0 12px; }
      .portfolio-header { padding: 32px 16px 20px; }
      .filter-bar { padding: 16px; }
      .medium-legend { padding: 12px 16px; }
    }

    /* ── Photo Card ── */
    .photo-card {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      background: var(--surface);
      border-radius: 1px;
      transition: opacity 0.4s ease, transform 0.4s ease;
      aspect-ratio: 1;
    }
    .photo-card[data-size="2x1"] { grid-column: span 2; aspect-ratio: 2; }
    .photo-card[data-size="1x2"] { grid-row: span 2; aspect-ratio: 0.5; }
    .photo-card[data-size="2x2"] { grid-column: span 2; grid-row: span 2; aspect-ratio: 1; }
    .photo-card[data-size="3x1"] { grid-column: span 3; aspect-ratio: 3; }
    @media (max-width: 900px) {
      .photo-card[data-size="3x1"] { grid-column: span 2; aspect-ratio: 2; }
      .photo-card[data-size="2x2"] { grid-column: span 2; }
    }
    @media (max-width: 560px) {
      .photo-card[data-size="2x1"],
      .photo-card[data-size="2x2"],
      .photo-card[data-size="3x1"] { grid-column: span 1; }
      .photo-card[data-size="1x2"] { grid-row: span 1; }
      .photo-card { aspect-ratio: 4/3 !important; }
    }

    .photo-card.dimmed { opacity: 0.12; pointer-events: none; }

    .card-cover {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .photo-card:hover .card-cover { transform: scale(1.08); }

    /* Grain overlay */
    .card-grain {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 2;
      opacity: 0.035;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
      background-size: 128px 128px;
      animation: grain-shift 0.8s steps(2) infinite;
    }
    @keyframes grain-shift {
      0%   { background-position: 0 0; }
      25%  { background-position: -15px 20px; }
      50%  { background-position: 10px -12px; }
      75%  { background-position: -5px 15px; }
      100% { background-position: 0 0; }
    }

    /* Vignette */
    .card-vignette {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 3;
      background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%);
      transition: background 0.4s ease;
    }
    .photo-card:hover .card-vignette {
      background: radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.1) 100%);
    }

    /* Bottom hover overlay */
    .card-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 4;
      padding: 40px 16px 16px;
      background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.6) 50%, transparent 100%);
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .photo-card:hover .card-overlay { transform: translateY(0); }

    .card-location {
      font-size: 9px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(232,228,220,0.6);
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 4px;
    }
    .card-title-hover {
      font-family: 'Playfair Display', serif;
      font-size: 15px;
      font-weight: 700;
      color: var(--text);
      line-height: 1.2;
    }
    .card-shots {
      font-size: 9px;
      letter-spacing: 0.15em;
      color: rgba(232,228,220,0.45);
      margin-top: 4px;
    }

    /* Corner brackets */
    .card-brackets {
      position: absolute;
      inset: 8px;
      pointer-events: none;
      z-index: 5;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .photo-card:hover .card-brackets { opacity: 1; }
    .bracket { position: absolute; width: 14px; height: 14px; }
    .bracket.tl { top: 0; left: 0; border-top: 1px solid; border-left: 1px solid; }
    .bracket.tr { top: 0; right: 0; border-top: 1px solid; border-right: 1px solid; }
    .bracket.bl { bottom: 0; left: 0; border-bottom: 1px solid; border-left: 1px solid; }
    .bracket.br { bottom: 0; right: 0; border-bottom: 1px solid; border-right: 1px solid; }

    /* Top card meta */
    .card-meta-top {
      position: absolute;
      top: 12px;
      left: 12px;
      right: 12px;
      z-index: 4;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }
    .card-medium-badge {
      font-size: 8px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 3px 7px;
      border: 1px solid;
      backdrop-filter: blur(4px);
      background: rgba(8,8,8,0.6);
    }
    .card-date-badge {
      font-size: 8px;
      letter-spacing: 0.15em;
      color: rgba(232,228,220,0.45);
    }

    /* Card border (1px, medium-driven) */
    .card-border {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 6;
      border: 1px solid;
      opacity: 0;
      transition: opacity 0.35s ease;
    }
    .photo-card:hover .card-border { opacity: 1; }

    /* ── Modal ── */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 100;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: backdrop-in 0.3s ease;
    }
    @keyframes backdrop-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-panel {
      width: 100%;
      max-width: 780px;
      max-height: 90vh;
      background: var(--surface);
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #222 transparent;
      animation: modal-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
    }
    .modal-panel::-webkit-scrollbar { width: 4px; }
    .modal-panel::-webkit-scrollbar-track { background: transparent; }
    .modal-panel::-webkit-scrollbar-thumb { background: #222; }

    @keyframes modal-in {
      from { opacity: 0; transform: scale(0.95) translateY(8px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    .modal-hero {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      display: block;
    }

    .modal-close {
      position: absolute;
      top: 14px;
      right: 14px;
      z-index: 10;
      background: rgba(0,0,0,0.7);
      border: 1px solid #222;
      color: var(--text);
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(4px);
      transition: background 0.2s;
    }
    .modal-close:hover { background: rgba(0,0,0,0.9); }

    .modal-hero-overlay {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 280px;
      pointer-events: none;
    }
    .modal-hero-overlay::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 100px;
      background: linear-gradient(to bottom, transparent, var(--surface));
    }

    .modal-body {
      padding: 24px 28px 28px;
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 20px;
    }

    .modal-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(22px, 4vw, 32px);
      font-weight: 700;
      line-height: 1.1;
      color: var(--text);
    }

    .modal-location {
      font-size: 10px;
      letter-spacing: 0.2em;
      color: var(--muted);
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 6px;
    }

    /* EXIF strip */
    .exif-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
    }
    .exif-chip {
      font-size: 9px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 5px 10px;
      border: 1px solid;
      color: var(--text);
      opacity: 0.8;
    }

    /* Story */
    .modal-story-label {
      font-size: 9px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 8px;
    }
    .modal-story {
      font-family: 'Playfair Display', serif;
      font-style: italic;
      font-size: 15px;
      line-height: 1.75;
      color: rgba(232,228,220,0.8);
      border-left: 2px solid;
      padding-left: 16px;
      margin-bottom: 24px;
    }

    /* Tags */
    .tag-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 28px;
    }
    .tag-chip {
      font-size: 9px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 4px 9px;
      border: 1px solid #252525;
      color: var(--muted);
    }

    /* Modal footer */
    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 20px;
      border-top: 1px solid #1a1a1a;
      flex-wrap: wrap;
      gap: 12px;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 9px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }
    .status-dot.pulse {
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }

    .gallery-btn {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 9px 20px;
      border: 1px solid;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .gallery-btn:hover { background: rgba(255,255,255,0.05); }

    /* ── Misc ── */
    .divider {
      width: 1px;
      height: 16px;
      background: #1a1a1a;
      display: inline-block;
      vertical-align: middle;
    }
  `}</style>
);

// ─── Config ──────────────────────────────────────────────────────────────────
const MEDIUM_CONFIG = {
  Film:     { border: "#f59e0b", glow: "rgba(245,158,11,0.3)",  label: "FILM",     Icon: Camera },
  Digital:  { border: "#06b6d4", glow: "rgba(6,182,212,0.3)",   label: "DIGITAL",  Icon: Aperture },
  Drone:    { border: "#a855f7", glow: "rgba(168,85,247,0.3)",  label: "DRONE",    Icon: Wind },
  Mobile:   { border: "#10b981", glow: "rgba(16,185,129,0.3)",  label: "MOBILE",   Icon: Smartphone },
  Darkroom: { border: "#ef4444", glow: "rgba(239,68,68,0.3)",   label: "DARKROOM", Icon: Flame },
};

const STATUS_CONFIG = {
  published:  { color: "#22c55e", label: "PUBLISHED",  pulse: false },
  developing: { color: "#f59e0b", label: "DEVELOPING", pulse: true  },
  archived:   { color: "#6b7280", label: "ARCHIVED",   pulse: false },
  private:    { color: "#ef4444", label: "PRIVATE",    pulse: false },
};

// ─── Sample Data ──────────────────────────────────────────────────────────────
const PHOTOS = [
  {
    id: "roll-001", size: "2x2",
    title: "Tokyo After Rain",
    location: "Shinjuku, Tokyo, JP", date: "OCT 2024",
    medium: "Film", camera: "Nikon FM2 / 50mm f1.4", film_stock: "Kodak Portra 400",
    shot_count: 36,
    cover: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
    status: "published",
    tags: ["street", "rain", "night", "japan"],
    story: "Shot across three nights after a typhoon passed through. The wet streets turned every neon sign into a mirror. Pushed to 800 in development — the grain felt right.",
    gallery_url: "https://unsplash.com"
  },
  {
    id: "roll-002", size: "2x1",
    title: "Icelandic Highlands",
    location: "Landmannalaugar, IS", date: "JUL 2024",
    medium: "Drone", camera: "DJI Mini 4 Pro", film_stock: null,
    shot_count: 214,
    cover: "https://images.unsplash.com/photo-1531168556467-80aace0d0144?w=800",
    status: "published",
    tags: ["landscape", "aerial", "iceland", "golden hour"],
    story: "5am wake-ups for a week. The light at that latitude never really sets in July — it just turns everything amber for 6 hours straight.",
    gallery_url: "#"
  },
  {
    id: "roll-003", size: "1x1",
    title: "Studio Portraits Vol.3",
    location: "Home Studio, SG", date: "SEP 2024",
    medium: "Digital", camera: "Sony A7IV / 85mm f1.8", film_stock: null,
    shot_count: 580,
    cover: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800",
    status: "developing",
    tags: ["portrait", "studio", "moody"],
    story: "Third volume of the ongoing portrait series. Still editing. Experimenting with single-source hard light and darker backgrounds.",
    gallery_url: "#"
  },
  {
    id: "roll-004", size: "1x1",
    title: "Darkroom: First Prints",
    location: "Darkroom Lab, SG", date: "NOV 2024",
    medium: "Darkroom", camera: "Enlarger / Ilford MG", film_stock: "Ilford HP5 Plus",
    shot_count: 12,
    cover: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800",
    status: "archived",
    tags: ["darkroom", "bw", "analog", "process"],
    story: "First time printing in a darkroom. Twelve prints in four hours. Two were usable. Both are on my wall.",
    gallery_url: "#"
  },
  {
    id: "roll-005", size: "3x1",
    title: "Sengkang Streets",
    location: "Sengkang, SG", date: "DEC 2024",
    medium: "Mobile", camera: "iPhone 15 Pro / 24mm", film_stock: null,
    shot_count: 93,
    cover: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=1200",
    status: "published",
    tags: ["street", "singapore", "everyday", "light"],
    story: "The neighbourhood I live in. Shot over 6 months during morning walks. The best camera is the one you always have.",
    gallery_url: "#"
  },
];

// ─── useTilt Hook ─────────────────────────────────────────────────────────────
function useTilt(ref) {
  const handleMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotX = -y * 8;
    const rotY = x * 8;
    ref.current.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  }, [ref]);

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    ref.current.style.transition = "transform 0.6s ease";
    setTimeout(() => {
      if (ref.current) ref.current.style.transition = "";
    }, 600);
  }, [ref]);

  return { onMouseMove: handleMove, onMouseLeave: handleLeave };
}

// ─── PhotoCard ────────────────────────────────────────────────────────────────
function PhotoCard({ photo, dimmed, onOpen }) {
  const ref = useRef(null);
  const tilt = useTilt(ref);
  const cfg = MEDIUM_CONFIG[photo.medium];

  return (
    <div
      ref={ref}
      className={`photo-card${dimmed ? " dimmed" : ""}`}
      data-size={photo.size}
      onClick={() => !dimmed && onOpen(photo)}
      {...tilt}
    >
      <img className="card-cover" src={photo.cover} alt={photo.title} loading="lazy" />
      <div className="card-grain" />
      <div className="card-vignette" />

      {/* Top metadata */}
      <div className="card-meta-top">
        <span className="card-medium-badge" style={{ borderColor: cfg.border + "66", color: cfg.border }}>
          {cfg.label}
        </span>
        <span className="card-date-badge">{photo.date}</span>
      </div>

      {/* Hover overlay */}
      <div className="card-overlay">
        <div className="card-location">
          <MapPin size={8} />
          {photo.location}
        </div>
        <div className="card-title-hover">{photo.title}</div>
        <div className="card-shots">{photo.shot_count} frames</div>
      </div>

      {/* Border on hover */}
      <div className="card-border" style={{ borderColor: cfg.border }} />

      {/* Corner brackets */}
      <div className="card-brackets">
        <div className="bracket tl" style={{ borderColor: cfg.border }} />
        <div className="bracket tr" style={{ borderColor: cfg.border }} />
        <div className="bracket bl" style={{ borderColor: cfg.border }} />
        <div className="bracket br" style={{ borderColor: cfg.border }} />
      </div>
    </div>
  );
}

// ─── PhotoModal ───────────────────────────────────────────────────────────────
function PhotoModal({ photo, onClose }) {
  const cfg = MEDIUM_CONFIG[photo.medium];
  const stCfg = STATUS_CONFIG[photo.status];

  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-panel">
        {/* Close */}
        <button className="modal-close" onClick={onClose}>
          <X size={14} />
        </button>

        {/* Hero */}
        <div style={{ position: "relative" }}>
          <img className="modal-hero" src={photo.cover} alt={photo.title} />
          <div className="modal-hero-overlay" />
        </div>

        <div className="modal-body">
          {/* Header */}
          <div className="modal-header">
            <div>
              <div className="modal-title">{photo.title}</div>
              <div className="modal-location">
                <MapPin size={9} />
                {photo.location} &nbsp;·&nbsp; {photo.date}
              </div>
            </div>
          </div>

          {/* EXIF strip */}
          <div className="exif-strip">
            <span className="exif-chip" style={{ borderColor: cfg.border + "4d" }}>
              {photo.camera}
            </span>
            {photo.film_stock && (
              <span className="exif-chip" style={{ borderColor: cfg.border + "4d" }}>
                {photo.film_stock}
              </span>
            )}
            <span className="exif-chip" style={{ borderColor: cfg.border + "4d" }}>
              {photo.shot_count} frames
            </span>
            <span className="exif-chip" style={{ borderColor: cfg.border + "4d", color: cfg.border }}>
              {cfg.label}
            </span>
          </div>

          {/* Story */}
          <div className="modal-story-label">// The Shoot</div>
          <div className="modal-story" style={{ borderColor: cfg.border }}>
            {photo.story}
          </div>

          {/* Tags */}
          <div className="tag-cloud">
            {photo.tags.map(t => (
              <span key={t} className="tag-chip">#{t}</span>
            ))}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <div className="status-indicator">
              <div
                className={`status-dot${stCfg.pulse ? " pulse" : ""}`}
                style={{ background: stCfg.color }}
              />
              {stCfg.label}
            </div>
            <a
              className="gallery-btn"
              href={photo.gallery_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderColor: cfg.border, color: cfg.border }}
            >
              View Gallery <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FilterBar ────────────────────────────────────────────────────────────────
function FilterBar({ active, onChange }) {
  const all = ["All", ...Object.keys(MEDIUM_CONFIG)];
  return (
    <div className="filter-bar">
      <span className="filter-label">Filter /</span>
      {all.map(m => {
        const cfg = MEDIUM_CONFIG[m];
        const isActive = active === m;
        return (
          <button
            key={m}
            className={`filter-btn${isActive ? " active" : ""}`}
            onClick={() => onChange(m)}
            style={isActive && cfg ? {
              borderColor: cfg.border,
              color: cfg.border,
              boxShadow: `0 0 12px ${cfg.glow}`,
            } : isActive ? {
              borderColor: "#444",
              color: "#e8e4dc",
            } : {}}
          >
            {m === "All" ? "ALL" : MEDIUM_CONFIG[m].label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Medium Legend ────────────────────────────────────────────────────────────
function MediumLegend() {
  return (
    <div className="medium-legend">
      {Object.entries(MEDIUM_CONFIG).map(([key, cfg]) => (
        <div key={key} className="legend-item">
          <div className="legend-dot" style={{ background: cfg.border }} />
          {cfg.label}
        </div>
      ))}
    </div>
  );
}

// ─── Portfolio Gallery (default export) ──────────────────────────────────────
export default function PortfolioGallery() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [openPhoto, setOpenPhoto] = useState(null);

  const totalFrames = PHOTOS.reduce((a, p) => a + p.shot_count, 0);

  return (
    <>
      <FontStyle />
      <div className="portfolio-root">
        {/* Header */}
        <header className="portfolio-header">
          <div className="portfolio-header-left">
            <div className="portfolio-eyebrow">Archive / 2024</div>
            <h1 className="portfolio-title">
              Dark<span>room</span><br />
              Inventory
            </h1>
            <div className="portfolio-subtitle">A collection of moments</div>
          </div>
          <div className="portfolio-count">
            <div>{PHOTOS.length} collections</div>
            <div>{totalFrames.toLocaleString()} total frames</div>
            <div style={{ color: "#222", margin: "4px 0" }}>────────</div>
            <div>2024 — ongoing</div>
          </div>
        </header>

        {/* Legend */}
        <MediumLegend />

        {/* Filter */}
        <FilterBar active={activeFilter} onChange={setActiveFilter} />

        {/* Grid */}
        <main className="bento-grid">
          {PHOTOS.map(photo => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              dimmed={activeFilter !== "All" && photo.medium !== activeFilter}
              onOpen={setOpenPhoto}
            />
          ))}
        </main>
      </div>

      {/* Modal */}
      {openPhoto && (
        <PhotoModal photo={openPhoto} onClose={() => setOpenPhoto(null)} />
      )}
    </>
  );
}
