import { useState, useRef, useEffect, useCallback } from "react";
import { Camera, Aperture, Wind, Smartphone, Flame, X, ExternalLink, MapPin, Pencil, Trash2, Upload, GripVertical, Plus, Download } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS as DndCSS } from "@dnd-kit/utilities";

// ─── Font Injection ───────────────────────────────────────────────────────────
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --accent:       #00d4c8;
      --accent-dim:   #00d4c822;
      --accent-glow:  #00d4c844;
      --accent-mid:   #00d4c888;
      --bg:           #060910;
      --surface:      #0c1220;
      --surface-2:    #0f1628;
      --border:       #00d4c818;
      --border-hover: #00d4c855;
      --text:         #dde6f0;
      --muted:        #4a5568;
      --text-dim:     #2d3748;
      --gap:          6px;
      --radius:       12px;
      --radius-sm:    8px;
      --font-head:    'Oxanium', sans-serif;
      --font-body:    'Outfit', sans-serif;
      --font-mono:    'JetBrains Mono', monospace;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-body);
      overflow-x: hidden;
    }

    /* Background radial glows + scanline overlay */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background:
        radial-gradient(ellipse 80% 50% at 10% 0%, #00d4c80d 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 90% 100%, #00d4c809 0%, transparent 55%),
        radial-gradient(ellipse 40% 30% at 50% 50%, #1a0a3020 0%, transparent 70%);
      pointer-events: none; z-index: 0;
    }
    body::after {
      content: '';
      position: fixed; inset: 0;
      background-image: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px);
      pointer-events: none; z-index: 0;
    }

    /* ── Top shimmer bar ── */
    .top-bar {
      position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 200;
      background: linear-gradient(90deg, transparent 0%, var(--accent) 30%, #a78bfa 60%, var(--accent) 80%, transparent 100%);
      box-shadow: 0 0 12px var(--accent-glow);
      animation: shimmer 4s ease-in-out infinite;
    }
    @keyframes shimmer { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

    .portfolio-root {
      position: relative; z-index: 1;
      min-height: 100vh;
      padding: 0 0 80px;
    }

    /* ── Header ── */
    .portfolio-header {
      padding: 56px 32px 28px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }
    .portfolio-header-left {}
    .portfolio-eyebrow {
      font-family: var(--font-head);
      font-size: 10px;
      letter-spacing: 0.25em;
      color: var(--accent);
      text-transform: uppercase;
      margin-bottom: 8px;
      opacity: 0.7;
    }
    .portfolio-title {
      font-family: var(--font-head);
      font-size: clamp(28px, 5vw, 52px);
      font-weight: 800;
      line-height: 1;
      color: var(--text);
      letter-spacing: -0.02em;
    }
    .portfolio-title span {
      color: var(--accent);
      text-shadow: 0 0 24px var(--accent-glow);
      opacity: 1;
      font-style: normal;
    }
    .portfolio-subtitle {
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 300;
      letter-spacing: 0.08em;
      color: var(--muted);
      margin-top: 10px;
    }
    .portfolio-count {
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.15em;
      color: var(--muted);
      text-align: right;
      line-height: 1.8;
    }

    /* ── Section label ── */
    .section-label {
      font-family: var(--font-head);
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-label::before {
      content: '';
      display: inline-block;
      width: 16px; height: 1px;
      background: var(--accent);
      opacity: 0.6;
    }

    /* ── Medium Legend ── */
    .medium-legend {
      display: flex;
      gap: 20px;
      padding: 12px 32px;
      border-bottom: 1px solid var(--border);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .medium-legend::-webkit-scrollbar { display: none; }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-head);
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
      font-family: var(--font-head);
      font-size: 9px;
      letter-spacing: 0.25em;
      color: var(--muted);
      text-transform: uppercase;
      margin-right: 4px;
    }
    .filter-btn {
      font-family: var(--font-mono);
      font-size: 9px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 5px 14px;
      background: transparent;
      border: 1px solid var(--border);
      color: var(--muted);
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 20px;
    }
    .filter-btn:hover { color: var(--text); border-color: var(--accent-mid); }
    .filter-btn.active {
      color: var(--accent);
      border-color: var(--accent);
      box-shadow: 0 0 12px var(--accent-glow);
      background: var(--accent-dim);
    }

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
      .portfolio-header { padding: 40px 16px 20px; }
      .filter-bar { padding: 16px; }
      .medium-legend { padding: 12px 16px; }
    }

    /* ── Grid span wrappers (used in both React app and published HTML) ── */
    .gc-2x1 { grid-column: span 2; }
    .gc-1x2 { grid-row: span 2; }
    .gc-2x2 { grid-column: span 2; grid-row: span 2; }
    .gc-3x1 { grid-column: span 3; }
    @media (max-width: 900px) {
      .gc-3x1 { grid-column: span 2; }
    }
    @media (max-width: 560px) {
      .gc-2x1, .gc-2x2, .gc-3x1 { grid-column: span 1; }
      .gc-1x2 { grid-row: span 1; }
    }

    /* ── Photo Card ── */
    .photo-card {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      background: var(--surface);
      border-radius: var(--radius);
      transition: opacity 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease;
      aspect-ratio: 1;
      width: 100%;
    }
    .photo-card:hover { box-shadow: 0 0 32px var(--accent-dim); }
    /* Aspect ratios only — grid span lives on the wrapper */
    .photo-card[data-size="2x1"] { aspect-ratio: 2; }
    .photo-card[data-size="1x2"] { aspect-ratio: 0.5; }
    .photo-card[data-size="2x2"] { aspect-ratio: 1; }
    .photo-card[data-size="3x1"] { aspect-ratio: 3; }
    @media (max-width: 900px) {
      .photo-card[data-size="3x1"] { aspect-ratio: 2; }
    }
    @media (max-width: 560px) {
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
      background: linear-gradient(to top, rgba(6,9,16,0.95) 0%, rgba(6,9,16,0.6) 50%, transparent 100%);
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .photo-card:hover .card-overlay { transform: translateY(0); }

    .card-location {
      font-family: var(--font-mono);
      font-size: 9px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 4px;
      opacity: 0.8;
    }
    .card-title-hover {
      font-family: var(--font-head);
      font-size: 15px;
      font-weight: 700;
      color: var(--text);
      line-height: 1.2;
    }
    .card-shots {
      font-family: var(--font-mono);
      font-size: 9px;
      letter-spacing: 0.15em;
      color: rgba(221,230,240,0.45);
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
      font-family: var(--font-head);
      font-size: 8px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 3px 8px;
      border: 1px solid;
      backdrop-filter: blur(4px);
      background: rgba(6,9,16,0.7);
      border-radius: 20px;
    }
    .card-date-badge {
      font-family: var(--font-mono);
      font-size: 8px;
      letter-spacing: 0.15em;
      color: rgba(221,230,240,0.45);
    }

    /* Card border (1px, medium-driven) */
    .card-border {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 6;
      border: 1px solid;
      border-radius: var(--radius);
      opacity: 0;
      transition: opacity 0.35s ease;
    }
    .photo-card:hover .card-border { opacity: 1; }

    /* ── Modal ── */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 100;
      background: rgba(6,9,16,0.88);
      backdrop-filter: blur(10px);
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
      border: 1px solid var(--border-hover);
      border-radius: var(--radius);
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--accent-dim) transparent;
      animation: modal-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      box-shadow: 0 0 48px var(--accent-dim);
    }
    .modal-panel::-webkit-scrollbar { width: 4px; }
    .modal-panel::-webkit-scrollbar-track { background: transparent; }
    .modal-panel::-webkit-scrollbar-thumb { background: var(--accent-mid); border-radius: 4px; }

    @keyframes modal-in {
      from { opacity: 0; transform: scale(0.95) translateY(8px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    .modal-hero {
      width: 100%;
      aspect-ratio: 16/9;
      object-fit: cover;
      display: block;
      border-radius: var(--radius) var(--radius) 0 0;
    }

    .modal-close {
      position: absolute;
      top: 14px;
      right: 14px;
      z-index: 10;
      background: rgba(6,9,16,0.8);
      border: 1px solid var(--border-hover);
      color: var(--text);
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(4px);
      border-radius: 50%;
      transition: all 0.2s;
    }
    .modal-close:hover { background: var(--accent-dim); border-color: var(--accent); box-shadow: 0 0 10px var(--accent-glow); }

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
      font-family: var(--font-head);
      font-size: clamp(22px, 4vw, 32px);
      font-weight: 700;
      line-height: 1.1;
      color: var(--text);
      letter-spacing: -0.01em;
    }

    .modal-location {
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.2em;
      color: var(--accent);
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 6px;
      opacity: 0.8;
    }

    /* EXIF strip */
    .exif-strip {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 24px;
    }
    .exif-chip {
      font-family: var(--font-mono);
      font-size: 9px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 5px 12px;
      border: 1px solid;
      color: var(--text);
      opacity: 0.8;
      border-radius: var(--radius-sm);
    }

    /* Story */
    .modal-story-label {
      font-family: var(--font-head);
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .modal-story-label::before {
      content: '';
      display: inline-block;
      width: 16px; height: 1px;
      background: var(--accent);
      opacity: 0.6;
    }
    .modal-story {
      font-family: var(--font-body);
      font-style: italic;
      font-weight: 300;
      font-size: 15px;
      line-height: 1.75;
      color: rgba(221,230,240,0.8);
      border-left: 2px solid var(--accent-mid);
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
      font-family: var(--font-mono);
      font-size: 9px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 4px 10px;
      border: 1px solid var(--border);
      color: var(--muted);
      border-radius: 20px;
      transition: border-color 0.2s, color 0.2s;
    }
    .tag-chip:hover { border-color: var(--accent-mid); color: var(--accent); }

    /* Modal footer */
    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 20px;
      border-top: 1px solid var(--border);
      flex-wrap: wrap;
      gap: 12px;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 7px;
      font-family: var(--font-head);
      font-size: 9px;
      font-weight: 600;
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
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
    }

    .gallery-btn {
      font-family: var(--font-head);
      font-size: 9px;
      font-weight: 600;
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
      border-radius: 20px;
      transition: all 0.2s;
    }
    .gallery-btn:hover { background: var(--accent-dim); box-shadow: 0 0 12px var(--accent-glow); }

    /* ── Portfolio Footer ── */
    .portfolio-footer {
      text-align: center;
      margin-top: 48px;
      padding: 24px 32px;
      border-top: 1px solid var(--border);
    }
    .portfolio-footer-brand {
      font-family: var(--font-head);
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-dim);
    }
    .portfolio-footer-brand a {
      color: var(--accent);
      text-decoration: none;
      transition: text-shadow 0.2s;
    }
    .portfolio-footer-brand a:hover { text-shadow: 0 0 10px var(--accent); }
    .portfolio-footer-sub {
      font-family: var(--font-mono);
      font-size: 9px;
      color: var(--text-dim);
      margin-top: 4px;
      letter-spacing: 0.06em;
    }

    /* ── Misc ── */
    .divider {
      width: 1px;
      height: 16px;
      background: var(--border);
      display: inline-block;
      vertical-align: middle;
    }

    /* ── Edit Mode ── */
    .edit-toggle-btn {
      font-family: var(--font-head);
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 7px 16px;
      border: 1px solid var(--border-hover);
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .edit-toggle-btn:hover, .edit-toggle-btn.active {
      border-color: var(--accent);
      color: var(--accent);
      background: var(--accent-dim);
    }
    .edit-toolbar {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 60;
      background: var(--surface);
      border-top: 1px solid var(--border-hover);
      padding: 12px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 -8px 32px rgba(0,212,200,0.07);
    }
    .edit-toolbar-left { display: flex; align-items: center; gap: 8px; }
    .edit-toolbar-right { display: flex; align-items: center; gap: 8px; }
    .toolbar-btn {
      font-family: var(--font-head);
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      padding: 8px 16px;
      border: 1px solid var(--border-hover);
      background: transparent;
      color: var(--text);
      cursor: pointer;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .toolbar-btn:hover { border-color: var(--accent-mid); color: var(--accent); background: var(--accent-dim); }
    .toolbar-btn.accent {
      border-color: var(--accent);
      color: var(--accent);
      background: var(--accent-dim);
    }
    .toolbar-btn.accent:hover { box-shadow: 0 0 16px var(--accent-glow); }
    .toolbar-label {
      font-family: var(--font-head);
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Card edit controls overlay */
    .card-edit-controls {
      position: absolute;
      inset: 0;
      z-index: 8;
      display: flex;
      flex-direction: column;
      pointer-events: none;
    }
    .card-edit-controls.active { pointer-events: all; }
    .card-edit-actions {
      position: absolute;
      top: 8px;
      right: 8px;
      display: flex;
      gap: 5px;
    }
    .card-action-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid var(--border-hover);
      background: rgba(6,9,16,0.88);
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(4px);
      transition: all 0.15s;
    }
    .card-action-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-dim); }
    .card-action-btn.danger:hover { border-color: #ef4444; color: #ef4444; background: rgba(239,68,68,0.15); }
    .card-drag-handle {
      position: absolute;
      top: 8px;
      left: 8px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 1px solid var(--border-hover);
      background: rgba(6,9,16,0.88);
      color: var(--muted);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: grab;
      backdrop-filter: blur(4px);
    }
    .card-drag-handle:active { cursor: grabbing; }
    .photo-card.edit-active { cursor: default; }
    .photo-card.edit-active:hover .card-cover { transform: none; }
    .photo-card.edit-active:hover { box-shadow: 0 0 0 2px var(--accent-mid); }

    /* Add card placeholder */
    .add-card-btn {
      background: var(--surface);
      border-radius: var(--radius);
      border: 2px dashed var(--border-hover);
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s;
      color: var(--muted);
      width: 100%;
    }
    .add-card-btn:hover {
      border-color: var(--accent);
      color: var(--accent);
      background: var(--accent-dim);
      box-shadow: 0 0 20px var(--accent-glow);
    }
    .add-card-label {
      font-family: var(--font-head);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    /* Card Edit Modal */
    .card-edit-panel {
      width: 100%;
      max-width: 620px;
      max-height: 90vh;
      background: var(--surface);
      border: 1px solid var(--border-hover);
      border-radius: var(--radius);
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--accent-dim) transparent;
      animation: modal-in 0.3s cubic-bezier(0.34,1.56,0.64,1);
      position: relative;
      box-shadow: 0 0 48px var(--accent-dim);
    }
    .card-edit-body { padding: 24px 28px 28px; }
    .card-edit-title {
      font-family: var(--font-head);
      font-size: 15px;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .image-upload-area {
      width: 100%;
      aspect-ratio: 16/9;
      border-radius: var(--radius-sm);
      border: 2px dashed var(--border-hover);
      overflow: hidden;
      position: relative;
      cursor: pointer;
      margin-bottom: 16px;
      transition: border-color 0.2s;
      background: var(--surface-2);
    }
    .image-upload-area:hover { border-color: var(--accent-mid); }
    .image-upload-area img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .image-upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 100%;
      color: var(--muted);
    }
    .image-upload-hover {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 8px;
      background: rgba(6,9,16,0.7);
      opacity: 0;
      transition: opacity 0.2s;
    }
    .image-upload-area:hover .image-upload-hover { opacity: 1; }
    .image-upload-hover span {
      font-family: var(--font-head);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent);
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
    .form-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
    .form-label {
      font-family: var(--font-head);
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
      opacity: 0.8;
    }
    .form-input, .form-select, .form-textarea {
      font-family: var(--font-mono);
      font-size: 12px;
      background: var(--surface-2);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 8px 12px;
      border-radius: var(--radius-sm);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      width: 100%;
    }
    .form-input:focus, .form-select:focus, .form-textarea:focus {
      border-color: var(--accent-mid);
      box-shadow: 0 0 8px var(--accent-dim);
    }
    .form-select option { background: var(--surface); color: var(--text); }
    .form-textarea { resize: vertical; min-height: 80px; line-height: 1.6; font-family: var(--font-body); }
    .form-footer {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding-top: 20px;
      border-top: 1px solid var(--border);
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

// ─── Utilities ───────────────────────────────────────────────────────────────
function getSizeClass(size) {
  return size !== "1x1" ? `gc-${size}` : "";
}

function newCard() {
  return {
    id: `roll-${Date.now()}`,
    size: "1x1",
    title: "New Collection",
    location: "Location, Country",
    date: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase(),
    medium: "Digital",
    camera: "",
    film_stock: null,
    shot_count: 0,
    cover: "",
    status: "developing",
    tags: [],
    story: "",
    gallery_url: "#",
  };
}

async function compressImage(file, maxSide = 1200, quality = 0.75) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function generatePublishedHTML(photos) {
  const MCFG = Object.fromEntries(
    Object.entries(MEDIUM_CONFIG).map(([k, v]) => [k, { border: v.border, glow: v.glow, label: v.label }])
  );

  const mapPin = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
  const extLink = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
  const closeX = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  const cardHTML = (photo) => {
    const cfg = MCFG[photo.medium] || MCFG.Digital;
    const sc = getSizeClass(photo.size);
    return `<div class="photo-card${sc ? " " + sc : ""}" data-size="${photo.size}" data-medium="${photo.medium}" data-id="${photo.id}" tabindex="0">
  <img class="card-cover" src="${photo.cover}" alt="${photo.title}" loading="lazy">
  <div class="card-grain"></div><div class="card-vignette"></div>
  <div class="card-meta-top">
    <span class="card-medium-badge" style="border-color:${cfg.border}66;color:${cfg.border}">${cfg.label}</span>
    <span class="card-date-badge">${photo.date}</span>
  </div>
  <div class="card-overlay">
    <div class="card-location">${mapPin}${photo.location}</div>
    <div class="card-title-hover">${photo.title}</div>
    <div class="card-shots">${photo.shot_count} frames</div>
  </div>
  <div class="card-border" style="border-color:${cfg.border}"></div>
  <div class="card-brackets">
    <div class="bracket tl" style="border-color:${cfg.border}"></div><div class="bracket tr" style="border-color:${cfg.border}"></div>
    <div class="bracket bl" style="border-color:${cfg.border}"></div><div class="bracket br" style="border-color:${cfg.border}"></div>
  </div>
</div>`;
  };

  const modalHTML = (photo) => {
    const cfg = MCFG[photo.medium] || MCFG.Digital;
    const stCfg = STATUS_CONFIG[photo.status] || STATUS_CONFIG.published;
    return `<div class="modal-backdrop" id="modal-${photo.id}" style="display:none">
  <div class="modal-panel">
    <button class="modal-close">${closeX}</button>
    <div style="position:relative"><img class="modal-hero" src="${photo.cover}" alt="${photo.title}"><div class="modal-hero-overlay"></div></div>
    <div class="modal-body">
      <div class="modal-header"><div>
        <div class="modal-title">${photo.title}</div>
        <div class="modal-location">${mapPin}${photo.location} &nbsp;·&nbsp; ${photo.date}</div>
      </div></div>
      <div class="exif-strip">
        <span class="exif-chip" style="border-color:${cfg.border}4d">${photo.camera}</span>
        ${photo.film_stock ? `<span class="exif-chip" style="border-color:${cfg.border}4d">${photo.film_stock}</span>` : ""}
        <span class="exif-chip" style="border-color:${cfg.border}4d">${photo.shot_count} frames</span>
        <span class="exif-chip" style="border-color:${cfg.border}4d;color:${cfg.border}">${cfg.label}</span>
      </div>
      <div class="modal-story-label">The Shoot</div>
      <div class="modal-story" style="border-color:${cfg.border}">${photo.story}</div>
      <div class="tag-cloud">${photo.tags.map((t) => `<span class="tag-chip">#${t}</span>`).join("")}</div>
      <div class="modal-footer">
        <div class="status-indicator">
          <div class="status-dot${stCfg.pulse ? " pulse" : ""}" style="background:${stCfg.color}"></div>${stCfg.label}
        </div>
        <a class="gallery-btn" href="${photo.gallery_url}" target="_blank" rel="noopener noreferrer" style="border-color:${cfg.border};color:${cfg.border}">View Gallery ${extLink}</a>
      </div>
    </div>
  </div>
</div>`;
  };

  const totalFrames = photos.reduce((a, p) => a + p.shot_count, 0);
  const legendHTML = Object.entries(MCFG).map(([, cfg]) =>
    `<div class="legend-item"><div class="legend-dot" style="background:${cfg.border}"></div>${cfg.label}</div>`
  ).join("");
  const filterHTML = ["All", ...Object.keys(MCFG)].map((m, i) =>
    `<button class="filter-btn${i === 0 ? " active" : ""}" data-medium="${m}">${m === "All" ? "ALL" : MCFG[m].label}</button>`
  ).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Darkroom Inventory</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;500;600;700;800&family=Outfit:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--accent:#00d4c8;--accent-dim:#00d4c822;--accent-glow:#00d4c844;--accent-mid:#00d4c888;--bg:#060910;--surface:#0c1220;--surface-2:#0f1628;--border:#00d4c818;--border-hover:#00d4c855;--text:#dde6f0;--muted:#4a5568;--text-dim:#2d3748;--gap:6px;--radius:12px;--radius-sm:8px;--font-head:'Oxanium',sans-serif;--font-body:'Outfit',sans-serif;--font-mono:'JetBrains Mono',monospace}
body{background:var(--bg);color:var(--text);font-family:var(--font-body);overflow-x:hidden}
body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 50% at 10% 0%,#00d4c80d 0%,transparent 60%),radial-gradient(ellipse 60% 40% at 90% 100%,#00d4c809 0%,transparent 55%);pointer-events:none;z-index:0}
body::after{content:'';position:fixed;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.04) 2px,rgba(0,0,0,.04) 4px);pointer-events:none;z-index:0}
.top-bar{position:fixed;top:0;left:0;right:0;height:2px;z-index:200;background:linear-gradient(90deg,transparent 0%,var(--accent) 30%,#a78bfa 60%,var(--accent) 80%,transparent 100%);box-shadow:0 0 12px var(--accent-glow);animation:shimmer 4s ease-in-out infinite}
@keyframes shimmer{0%,100%{opacity:.6}50%{opacity:1}}
.portfolio-root{position:relative;z-index:1;min-height:100vh;padding:0 0 80px}
.portfolio-header{padding:56px 32px 28px;border-bottom:1px solid var(--border);display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:16px}
.portfolio-eyebrow{font-family:var(--font-head);font-size:10px;letter-spacing:.25em;color:var(--accent);text-transform:uppercase;margin-bottom:8px;opacity:.7}
.portfolio-title{font-family:var(--font-head);font-size:clamp(28px,5vw,52px);font-weight:800;line-height:1;color:var(--text);letter-spacing:-.02em}
.portfolio-title span{color:var(--accent);text-shadow:0 0 24px var(--accent-glow)}
.portfolio-subtitle{font-family:var(--font-body);font-size:13px;font-weight:300;letter-spacing:.08em;color:var(--muted);margin-top:10px}
.portfolio-count{font-family:var(--font-mono);font-size:10px;letter-spacing:.15em;color:var(--muted);text-align:right;line-height:1.8}
.medium-legend{display:flex;gap:20px;padding:12px 32px;border-bottom:1px solid var(--border);overflow-x:auto;scrollbar-width:none}
.legend-item{display:flex;align-items:center;gap:6px;font-family:var(--font-head);font-size:9px;letter-spacing:.2em;color:var(--muted);text-transform:uppercase;white-space:nowrap}
.legend-dot{width:6px;height:6px;border-radius:50%}
.filter-bar{display:flex;gap:8px;padding:20px 32px;flex-wrap:wrap;align-items:center}
.filter-label{font-family:var(--font-head);font-size:9px;letter-spacing:.25em;color:var(--muted);text-transform:uppercase;margin-right:4px}
.filter-btn{font-family:var(--font-mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;padding:5px 14px;background:transparent;border:1px solid var(--border);color:var(--muted);cursor:pointer;transition:all .2s;border-radius:20px}
.filter-btn:hover{color:var(--text);border-color:var(--accent-mid)}
.filter-btn.active{color:var(--accent);border-color:var(--accent);box-shadow:0 0 12px var(--accent-glow);background:var(--accent-dim)}
.bento-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--gap);padding:0 32px}
.gc-2x1{grid-column:span 2}.gc-1x2{grid-row:span 2}.gc-2x2{grid-column:span 2;grid-row:span 2}.gc-3x1{grid-column:span 3}
.photo-card{position:relative;overflow:hidden;cursor:pointer;background:var(--surface);border-radius:var(--radius);transition:opacity .4s,box-shadow .4s;aspect-ratio:1;width:100%}
.photo-card:hover{box-shadow:0 0 32px var(--accent-dim)}
.photo-card[data-size="2x1"]{aspect-ratio:2}.photo-card[data-size="1x2"]{aspect-ratio:.5}.photo-card[data-size="3x1"]{aspect-ratio:3}
.photo-card.dimmed{opacity:.12;pointer-events:none}
.card-cover{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.25,.46,.45,.94)}
.photo-card:hover .card-cover{transform:scale(1.08)}
.card-grain{position:absolute;inset:0;pointer-events:none;z-index:2;opacity:.035;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");background-size:128px 128px;animation:grain-shift .8s steps(2) infinite}
@keyframes grain-shift{0%{background-position:0 0}25%{background-position:-15px 20px}50%{background-position:10px -12px}75%{background-position:-5px 15px}100%{background-position:0 0}}
.card-vignette{position:absolute;inset:0;pointer-events:none;z-index:3;background:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.55) 100%);transition:background .4s}
.photo-card:hover .card-vignette{background:radial-gradient(ellipse at center,rgba(0,0,0,.3) 0%,rgba(0,0,0,.15) 60%,rgba(0,0,0,.1) 100%)}
.card-overlay{position:absolute;bottom:0;left:0;right:0;z-index:4;padding:40px 16px 16px;background:linear-gradient(to top,rgba(6,9,16,.95) 0%,rgba(6,9,16,.6) 50%,transparent 100%);transform:translateY(100%);transition:transform .4s cubic-bezier(.25,.46,.45,.94)}
.photo-card:hover .card-overlay{transform:translateY(0)}
.card-location{font-family:var(--font-mono);font-size:9px;letter-spacing:.2em;text-transform:uppercase;color:var(--accent);display:flex;align-items:center;gap:4px;margin-bottom:4px;opacity:.8}
.card-title-hover{font-family:var(--font-head);font-size:15px;font-weight:700;color:var(--text);line-height:1.2}
.card-shots{font-family:var(--font-mono);font-size:9px;letter-spacing:.15em;color:rgba(221,230,240,.45);margin-top:4px}
.card-brackets{position:absolute;inset:8px;pointer-events:none;z-index:5;opacity:0;transition:opacity .3s}
.photo-card:hover .card-brackets{opacity:1}
.bracket{position:absolute;width:14px;height:14px}
.bracket.tl{top:0;left:0;border-top:1px solid;border-left:1px solid}.bracket.tr{top:0;right:0;border-top:1px solid;border-right:1px solid}
.bracket.bl{bottom:0;left:0;border-bottom:1px solid;border-left:1px solid}.bracket.br{bottom:0;right:0;border-bottom:1px solid;border-right:1px solid}
.card-meta-top{position:absolute;top:12px;left:12px;right:12px;z-index:4;display:flex;align-items:flex-start;justify-content:space-between}
.card-medium-badge{font-family:var(--font-head);font-size:8px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;padding:3px 8px;border:1px solid;backdrop-filter:blur(4px);background:rgba(6,9,16,.7);border-radius:20px}
.card-date-badge{font-family:var(--font-mono);font-size:8px;letter-spacing:.15em;color:rgba(221,230,240,.45)}
.card-border{position:absolute;inset:0;pointer-events:none;z-index:6;border:1px solid;border-radius:var(--radius);opacity:0;transition:opacity .35s}
.photo-card:hover .card-border{opacity:1}
.modal-backdrop{position:fixed;inset:0;z-index:100;background:rgba(6,9,16,.88);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;animation:backdrop-in .3s ease}
@keyframes backdrop-in{from{opacity:0}to{opacity:1}}
.modal-panel{width:100%;max-width:780px;max-height:90vh;background:var(--surface);border:1px solid var(--border-hover);border-radius:var(--radius);overflow-y:auto;scrollbar-width:thin;scrollbar-color:var(--accent-dim) transparent;animation:modal-in .35s cubic-bezier(.34,1.56,.64,1);position:relative;box-shadow:0 0 48px var(--accent-dim)}
@keyframes modal-in{from{opacity:0;transform:scale(.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
.modal-hero{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;border-radius:var(--radius) var(--radius) 0 0}
.modal-close{position:absolute;top:14px;right:14px;z-index:10;background:rgba(6,9,16,.8);border:1px solid var(--border-hover);color:var(--text);width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(4px);border-radius:50%;transition:all .2s}
.modal-close:hover{background:var(--accent-dim);border-color:var(--accent)}
.modal-hero-overlay{position:absolute;top:0;left:0;right:0;height:280px;pointer-events:none}
.modal-hero-overlay::after{content:'';position:absolute;bottom:0;left:0;right:0;height:100px;background:linear-gradient(to bottom,transparent,var(--surface))}
.modal-body{padding:24px 28px 28px}
.modal-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:20px}
.modal-title{font-family:var(--font-head);font-size:clamp(22px,4vw,32px);font-weight:700;line-height:1.1;color:var(--text)}
.modal-location{font-family:var(--font-mono);font-size:10px;letter-spacing:.2em;color:var(--accent);text-transform:uppercase;display:flex;align-items:center;gap:5px;margin-top:6px;opacity:.8}
.exif-strip{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
.exif-chip{font-family:var(--font-mono);font-size:9px;letter-spacing:.12em;text-transform:uppercase;padding:5px 12px;border:1px solid;color:var(--text);opacity:.8;border-radius:var(--radius-sm)}
.modal-story-label{font-family:var(--font-head);font-size:9px;font-weight:600;letter-spacing:.25em;text-transform:uppercase;color:var(--accent);margin-bottom:10px;display:flex;align-items:center;gap:8px}
.modal-story-label::before{content:'';display:inline-block;width:16px;height:1px;background:var(--accent);opacity:.6}
.modal-story{font-family:var(--font-body);font-style:italic;font-weight:300;font-size:15px;line-height:1.75;color:rgba(221,230,240,.8);border-left:2px solid var(--accent-mid);padding-left:16px;margin-bottom:24px}
.tag-cloud{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:28px}
.tag-chip{font-family:var(--font-mono);font-size:9px;letter-spacing:.15em;text-transform:uppercase;padding:4px 10px;border:1px solid var(--border);color:var(--muted);border-radius:20px}
.modal-footer{display:flex;align-items:center;justify-content:space-between;padding-top:20px;border-top:1px solid var(--border);flex-wrap:wrap;gap:12px}
.status-indicator{display:flex;align-items:center;gap:7px;font-family:var(--font-head);font-size:9px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
.status-dot{width:7px;height:7px;border-radius:50%}
.status-dot.pulse{animation:pulse 1.5s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
.gallery-btn{font-family:var(--font-head);font-size:9px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;padding:9px 20px;border:1px solid;background:transparent;cursor:pointer;display:flex;align-items:center;gap:8px;text-decoration:none;border-radius:20px;transition:all .2s}
.gallery-btn:hover{background:var(--accent-dim);box-shadow:0 0 12px var(--accent-glow)}
.portfolio-footer{text-align:center;margin-top:48px;padding:24px 32px;border-top:1px solid var(--border)}
.portfolio-footer-brand{font-family:var(--font-head);font-size:9px;font-weight:600;letter-spacing:.15em;text-transform:uppercase;color:var(--text-dim)}
.portfolio-footer-brand a{color:var(--accent);text-decoration:none}
.portfolio-footer-sub{font-family:var(--font-mono);font-size:9px;color:var(--text-dim);margin-top:4px;letter-spacing:.06em}
@media(max-width:900px){.bento-grid{grid-template-columns:repeat(2,1fr)}.gc-3x1{grid-column:span 2}.photo-card[data-size="3x1"]{aspect-ratio:2}}
@media(max-width:560px){.bento-grid{grid-template-columns:1fr;padding:0 12px}.portfolio-header{padding:40px 16px 20px}.filter-bar{padding:16px}.medium-legend{padding:12px 16px}.gc-2x1,.gc-2x2,.gc-3x1{grid-column:span 1}.gc-1x2{grid-row:span 1}.photo-card{aspect-ratio:4/3 !important}}
</style></head>
<body>
<div class="top-bar"></div>
<div class="portfolio-root">
  <header class="portfolio-header">
    <div class="portfolio-header-left">
      <div class="portfolio-eyebrow">Archive / 2024</div>
      <h1 class="portfolio-title">Dark<span>room</span><br>Inventory</h1>
      <div class="portfolio-subtitle">A collection of moments</div>
    </div>
    <div class="portfolio-count">
      <div>${photos.length} collections</div>
      <div>${totalFrames.toLocaleString()} total frames</div>
      <div style="color:var(--border);margin:4px 0">────────</div>
      <div>2024 — ongoing</div>
    </div>
  </header>
  <div class="medium-legend">${legendHTML}</div>
  <div class="filter-bar"><span class="filter-label">Filter /</span>${filterHTML}</div>
  <main class="bento-grid">${photos.map(cardHTML).join("\n")}</main>
  <footer class="portfolio-footer">
    <div class="portfolio-footer-brand">Built by <a href="https://github.com/TheBooleanJulian" target="_blank" rel="noopener noreferrer">TheBooleanJulian</a></div>
    <div class="portfolio-footer-sub">✦ luxsync ♪ every frame, archived ✦</div>
  </footer>
</div>
${photos.map(modalHTML).join("\n")}
<script>
document.querySelectorAll('.photo-card').forEach(c=>{c.addEventListener('click',()=>{const m=document.getElementById('modal-'+c.dataset.id);if(m){m.style.display='flex';document.body.style.overflow='hidden'}})});
function closeM(m){m.style.display='none';document.body.style.overflow=''}
document.querySelectorAll('.modal-backdrop').forEach(m=>{m.addEventListener('click',e=>{if(e.target===m)closeM(m)});m.querySelector('.modal-close')?.addEventListener('click',()=>closeM(m))});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-backdrop').forEach(m=>{if(m.style.display!=='none')closeM(m)})});
document.querySelectorAll('.filter-btn').forEach(b=>{b.addEventListener('click',()=>{const med=b.dataset.medium;document.querySelectorAll('.filter-btn').forEach(x=>{x.classList.remove('active');x.style.cssText=''});b.classList.add('active');document.querySelectorAll('.photo-card').forEach(c=>{c.classList.toggle('dimmed',med!=='All'&&c.dataset.medium!==med)})})});
<\/script>
</body></html>`;
}

// ─── State Hook ───────────────────────────────────────────────────────────────
function useGalleryState() {
  const [photos, setPhotosRaw] = useState(() => {
    try {
      const saved = localStorage.getItem("luxsync-gallery");
      if (saved) return JSON.parse(saved);
    } catch {}
    return PHOTOS;
  });

  const setPhotos = useCallback((next) => {
    setPhotosRaw((prev) => {
      const updated = typeof next === "function" ? next(prev) : next;
      try { localStorage.setItem("luxsync-gallery", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  return { photos, setPhotos };
}

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
function PhotoCard({ photo, dimmed, onOpen, editMode = false, onEdit, onDelete, dragHandleProps = {} }) {
  const ref = useRef(null);
  const tilt = useTilt(ref);
  const cfg = MEDIUM_CONFIG[photo.medium] || MEDIUM_CONFIG.Digital;

  const handleClick = () => {
    if (editMode) { onEdit?.(photo); return; }
    if (!dimmed) onOpen(photo);
  };

  return (
    <div
      ref={ref}
      className={`photo-card${dimmed ? " dimmed" : ""}${editMode ? " edit-active" : ""}`}
      data-size={photo.size}
      onClick={handleClick}
      {...(editMode ? {} : tilt)}
    >
      {photo.cover
        ? <img className="card-cover" src={photo.cover} alt={photo.title} loading="lazy" />
        : <div className="card-cover" style={{ background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Upload size={28} style={{ color: "var(--muted)" }} />
          </div>
      }
      <div className="card-grain" />
      <div className="card-vignette" />

      <div className="card-meta-top">
        <span className="card-medium-badge" style={{ borderColor: cfg.border + "66", color: cfg.border }}>
          {cfg.label}
        </span>
        <span className="card-date-badge">{photo.date}</span>
      </div>

      {!editMode && (
        <div className="card-overlay">
          <div className="card-location"><MapPin size={8} />{photo.location}</div>
          <div className="card-title-hover">{photo.title}</div>
          <div className="card-shots">{photo.shot_count} frames</div>
        </div>
      )}

      <div className="card-border" style={{ borderColor: cfg.border }} />
      <div className="card-brackets">
        <div className="bracket tl" style={{ borderColor: cfg.border }} />
        <div className="bracket tr" style={{ borderColor: cfg.border }} />
        <div className="bracket bl" style={{ borderColor: cfg.border }} />
        <div className="bracket br" style={{ borderColor: cfg.border }} />
      </div>

      {editMode && (
        <div className="card-edit-controls active">
          <div className="card-drag-handle" {...dragHandleProps} onClick={(e) => e.stopPropagation()}>
            <GripVertical size={13} />
          </div>
          <div className="card-edit-actions">
            <button className="card-action-btn" onClick={(e) => { e.stopPropagation(); onEdit?.(photo); }} title="Edit">
              <Pencil size={12} />
            </button>
            <button className="card-action-btn danger" onClick={(e) => { e.stopPropagation(); onDelete?.(photo.id); }} title="Delete">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SortableCard ─────────────────────────────────────────────────────────────
function SortableCard({ photo, dimmed, onOpen, editMode, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: photo.id });

  const style = {
    transform: DndCSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const sizeClass = getSizeClass(photo.size);

  return (
    <div ref={setNodeRef} style={style} className={sizeClass || undefined}>
      <PhotoCard
        photo={photo}
        dimmed={dimmed}
        onOpen={onOpen}
        editMode={editMode}
        onEdit={onEdit}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

// ─── CardEditModal ────────────────────────────────────────────────────────────
function CardEditModal({ photo, onSave, onClose }) {
  const [form, setForm] = useState({ ...photo, tags: photo.tags.join(", "), film_stock: photo.film_stock || "" });
  const fileRef = useRef(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    setForm((f) => ({ ...f, cover: compressed }));
  };

  const handleSave = () => {
    onSave({
      ...form,
      shot_count: parseInt(form.shot_count) || 0,
      film_stock: form.film_stock.trim() || null,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card-edit-panel">
        <button className="modal-close" onClick={onClose}><X size={14} /></button>
        <div className="card-edit-body">
          <div className="card-edit-title"><Pencil size={14} style={{ color: "var(--accent)" }} />Edit Collection</div>

          {/* Image upload */}
          <div className="image-upload-area" onClick={() => fileRef.current?.click()}>
            {form.cover
              ? <img src={form.cover} alt="cover" />
              : <div className="image-upload-placeholder"><Upload size={24} /><span style={{ fontFamily: "var(--font-head)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase" }}>Upload Photo</span></div>
            }
            <div className="image-upload-hover"><Upload size={18} color="var(--accent)" /><span>Change Photo</span></div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />

          <div className="form-row">
            <div className="form-group"><label className="form-label">Title</label><input className="form-input" value={form.title} onChange={set("title")} /></div>
            <div className="form-group"><label className="form-label">Location</label><input className="form-input" value={form.location} onChange={set("location")} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Date</label><input className="form-input" value={form.date} onChange={set("date")} placeholder="OCT 2024" /></div>
            <div className="form-group">
              <label className="form-label">Medium</label>
              <select className="form-select" value={form.medium} onChange={set("medium")}>
                {Object.keys(MEDIUM_CONFIG).map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Camera</label><input className="form-input" value={form.camera} onChange={set("camera")} /></div>
            <div className="form-group"><label className="form-label">Film Stock</label><input className="form-input" value={form.film_stock} onChange={set("film_stock")} placeholder="optional" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Frames</label><input className="form-input" type="number" value={form.shot_count} onChange={set("shot_count")} /></div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={set("status")}>
                {Object.keys(STATUS_CONFIG).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Grid Size</label>
              <select className="form-select" value={form.size} onChange={set("size")}>
                {["1x1","2x1","1x2","2x2","3x1"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Gallery URL</label><input className="form-input" value={form.gallery_url} onChange={set("gallery_url")} /></div>
          </div>
          <div className="form-group"><label className="form-label">Tags (comma separated)</label><input className="form-input" value={form.tags} onChange={set("tags")} placeholder="street, rain, night" /></div>
          <div className="form-group"><label className="form-label">The Shoot</label><textarea className="form-textarea" rows={4} value={form.story} onChange={set("story")} /></div>

          <div className="form-footer">
            <button className="toolbar-btn" onClick={onClose}>Cancel</button>
            <button className="toolbar-btn accent" onClick={handleSave}>Save</button>
          </div>
        </div>
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
          <div className="modal-story-label">The Shoot</div>
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
  const { photos, setPhotos } = useGalleryState();
  const [activeFilter, setActiveFilter] = useState("All");
  const [openPhoto, setOpenPhoto]       = useState(null);
  const [editMode, setEditMode]         = useState(false);
  const [editingCard, setEditingCard]   = useState(null); // card being edited
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const totalFrames = photos.reduce((a, p) => a + p.shot_count, 0);

  // ── DnD handlers
  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) {
      setPhotos((prev) => {
        const from = prev.findIndex((p) => p.id === active.id);
        const to   = prev.findIndex((p) => p.id === over.id);
        return arrayMove(prev, from, to);
      });
    }
  };

  // ── Card actions
  const handleSaveCard = (updated) => {
    setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingCard(null);
  };
  const handleDeleteCard = (id) => setPhotos((prev) => prev.filter((p) => p.id !== id));
  const handleAddCard    = () => { const card = newCard(); setPhotos((prev) => [...prev, card]); setEditingCard(card); };

  // ── Publish
  const handlePublish = () => {
    const html = generatePublishedHTML(photos);
    const blob = new Blob([html], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "darkroom-inventory.html"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <FontStyle />
      <div className="top-bar" />
      <div className="portfolio-root" style={editMode ? { paddingBottom: 72 } : {}}>

        {/* Header */}
        <header className="portfolio-header">
          <div className="portfolio-header-left">
            <div className="portfolio-eyebrow">Archive / 2024</div>
            <h1 className="portfolio-title">Dark<span>room</span><br />Inventory</h1>
            <div className="portfolio-subtitle">A collection of moments</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
            <div className="portfolio-count">
              <div>{photos.length} collections</div>
              <div>{totalFrames.toLocaleString()} total frames</div>
              <div style={{ color: "var(--border)", margin: "4px 0" }}>────────</div>
              <div>2024 — ongoing</div>
            </div>
            <button className={`edit-toggle-btn${editMode ? " active" : ""}`} onClick={() => setEditMode((e) => !e)}>
              <Pencil size={11} />
              {editMode ? "Done" : "Edit Gallery"}
            </button>
          </div>
        </header>

        {/* Legend */}
        <MediumLegend />

        {/* Filter (hidden in edit mode) */}
        {!editMode && <FilterBar active={activeFilter} onChange={setActiveFilter} />}

        {/* Grid */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
            <main className="bento-grid">
              {photos.map((photo) => (
                <SortableCard
                  key={photo.id}
                  photo={photo}
                  dimmed={!editMode && activeFilter !== "All" && photo.medium !== activeFilter}
                  onOpen={setOpenPhoto}
                  editMode={editMode}
                  onEdit={setEditingCard}
                  onDelete={handleDeleteCard}
                />
              ))}
              {editMode && (
                <div>
                  <button className="add-card-btn" onClick={handleAddCard}>
                    <Plus size={22} />
                    <span className="add-card-label">Add Collection</span>
                  </button>
                </div>
              )}
            </main>
          </SortableContext>
        </DndContext>

        {/* Footer */}
        <footer className="portfolio-footer">
          <div className="portfolio-footer-brand">
            Built by <a href="https://github.com/TheBooleanJulian" target="_blank" rel="noopener noreferrer">TheBooleanJulian</a>
          </div>
          <div className="portfolio-footer-sub">✦ luxsync ♪ every frame, archived ✦</div>
        </footer>
      </div>

      {/* View modal */}
      {!editMode && openPhoto && (
        <PhotoModal photo={openPhoto} onClose={() => setOpenPhoto(null)} />
      )}

      {/* Card editor */}
      {editingCard && (
        <CardEditModal
          photo={editingCard}
          onSave={handleSaveCard}
          onClose={() => setEditingCard(null)}
        />
      )}

      {/* Edit toolbar */}
      {editMode && (
        <div className="edit-toolbar">
          <div className="edit-toolbar-left">
            <span className="toolbar-label"><Pencil size={11} />Edit Mode</span>
            <span style={{ color: "var(--text-dim)", fontSize: 9, fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
              drag to reorder · click card to edit
            </span>
          </div>
          <div className="edit-toolbar-right">
            <button className="toolbar-btn accent" onClick={handlePublish}>
              <Download size={12} />Publish HTML
            </button>
            <button className="toolbar-btn" onClick={() => setEditMode(false)}>
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
