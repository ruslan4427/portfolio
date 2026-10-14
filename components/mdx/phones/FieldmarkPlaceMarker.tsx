"use client";

import { useEffect, useRef } from "react";

const CSS = `
  .fm-root .m {
    opacity: 0;
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes fm-rise {
    from { opacity: 0; transform: translateY(60px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fm-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fm-fade-up {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fm-scale-in {
    from { opacity: 0; transform: scale(0.6); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes fm-scale-hero {
    from { opacity: 0; transform: scale(0.4); }
    60%  { opacity: 1; transform: scale(1.06); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* Animation names GATED behind .fm-play */
  .fm-root.fm-play .fm-sheet        { animation-name: fm-rise;      animation-delay: 0.00s; animation-duration: 0.6s; }
  .fm-root.fm-play .fm-handle       { animation-name: fm-fade;      animation-delay: 0.14s; }
  .fm-root.fm-play .fm-title        { animation-name: fm-fade-up;   animation-delay: 0.20s; }
  .fm-root.fm-play .fm-type-head    { animation-name: fm-fade-up;   animation-delay: 0.30s; }
  .fm-root.fm-play .fm-pill-faceplate { animation-name: fm-scale-in;  animation-delay: 0.36s; }
  .fm-root.fm-play .fm-pill-datacable { animation-name: fm-scale-in;  animation-delay: 0.40s; }
  .fm-root.fm-play .fm-pill-other     { animation-name: fm-scale-in;  animation-delay: 0.44s; }
  .fm-root.fm-play .fm-pill-speaker   { animation-name: fm-scale-in;  animation-delay: 0.48s; }
  .fm-root.fm-play .fm-pill-cableexit { animation-name: fm-scale-in;  animation-delay: 0.52s; }
  .fm-root.fm-play .fm-pill-keystone  { animation-name: fm-scale-in;  animation-delay: 0.56s; }
  .fm-root.fm-play .fm-pill-camera    { animation-name: fm-scale-hero; animation-delay: 0.64s; animation-duration: 0.55s; }
  .fm-root.fm-play .fm-pill-custom    { animation-name: fm-fade;      animation-delay: 0.70s; }
  .fm-root.fm-play .fm-status-head  { animation-name: fm-fade-up;   animation-delay: 0.80s; }
  .fm-root.fm-play .fm-pill-progress  { animation-name: fm-scale-hero; animation-delay: 0.86s; animation-duration: 0.55s; }
  .fm-root.fm-play .fm-pill-done      { animation-name: fm-fade;      animation-delay: 0.90s; }
  .fm-root.fm-play .fm-pill-blocked   { animation-name: fm-fade;      animation-delay: 0.94s; }
  .fm-root.fm-play .fm-pill-needs     { animation-name: fm-fade;      animation-delay: 0.98s; }
  .fm-root.fm-play .fm-comment      { animation-name: fm-fade-up;   animation-delay: 1.08s; }
  .fm-root.fm-play .fm-cancel       { animation-name: fm-fade-up;   animation-delay: 1.22s; }
  .fm-root.fm-play .fm-place        { animation-name: fm-scale-hero; animation-delay: 1.30s; animation-duration: 0.6s; }
  .fm-root.fm-play .fm-home         { animation-name: fm-fade;      animation-delay: 1.38s; }

  @media (prefers-reduced-motion: reduce) {
    .fm-root .m {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

// Pill helper geometry
const PILL_H = 36;
const PILL_R = PILL_H / 2;

type UnselPillProps = {
  x: number;
  y: number;
  w: number;
  label: string;
  className: string;
};

function UnselectedPill({ x, y, w, label, className }: UnselPillProps) {
  // Oval pill, white fill, hairline border, label + ✕ icon on right.
  const crossX = x + w - 20;
  const crossY = y + PILL_H / 2;
  return (
    <g className={`m ${className}`}>
      <rect
        x={x}
        y={y}
        width={w}
        height={PILL_H}
        rx={PILL_R}
        ry={PILL_R}
        fill="#FFFFFF"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth={1}
      />
      <text
        x={x + 14}
        y={y + PILL_H / 2 + 5}
        fontSize={20}
        fontWeight={400}
        fill="#1C1C1E"
      >
        {label}
      </text>
      {/* ✕ remove-chip glyph */}
      <g
        stroke="#6E6E73"
        strokeWidth={1.6}
        strokeLinecap="round"
      >
        <line x1={crossX - 4} y1={crossY - 4} x2={crossX + 4} y2={crossY + 4} />
        <line x1={crossX - 4} y1={crossY + 4} x2={crossX + 4} y2={crossY - 4} />
      </g>
    </g>
  );
}

type SelPillProps = {
  x: number;
  y: number;
  w: number;
  label: string;
  className: string;
  withRemove?: boolean;
};

function SelectedPill({ x, y, w, label, className, withRemove = false }: SelPillProps) {
  // Selected: light blue fill, ✓ at left, label, optional ✕ at right.
  const checkX = x + 14;
  const checkY = y + PILL_H / 2;
  return (
    <g className={`m ${className}`}>
      <rect
        x={x}
        y={y}
        width={w}
        height={PILL_H}
        rx={PILL_R}
        ry={PILL_R}
        fill="#CFDFFF"
      />
      {/* checkmark polyline */}
      <polyline
        points={`${checkX - 4},${checkY} ${checkX - 1},${checkY + 3} ${checkX + 5},${checkY - 3}`}
        fill="none"
        stroke="#007AFF"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x={x + 28}
        y={y + PILL_H / 2 + 5}
        fontSize={20}
        fontWeight={400}
        fill="#1C1C1E"
      >
        {label}
      </text>
      {withRemove ? (
        (() => {
          const crossX = x + w - 20;
          const crossY = y + PILL_H / 2;
          return (
            <g
              stroke="#6E6E73"
              strokeWidth={1.6}
              strokeLinecap="round"
            >
              <line x1={crossX - 4} y1={crossY - 4} x2={crossX + 4} y2={crossY + 4} />
              <line x1={crossX - 4} y1={crossY + 4} x2={crossX + 4} y2={crossY - 4} />
            </g>
          );
        })()
      ) : null}
    </g>
  );
}

export function FieldmarkPlaceMarker() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  const play = () => {
    const el = wrapperRef.current;
    if (!el) return;
    el.classList.remove("fm-play");
    // Force reflow so the next add restarts every @keyframes.
    void el.offsetWidth;
    el.classList.add("fm-play");
  };

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          play();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleEnter = () => {
    if (triggered.current) play();
  };

  // ---------- Layout geometry ----------
  // Type pills — three rows, left-aligned, 10px gaps
  const G = 10;
  const LEFT = 24;

  // Row 1: Face Plate (140), Data Cable (140)  → 140 + 10 + 140 = 290
  const w_face = 140;
  const w_data = 140;
  const row1y = 360;

  // Row 2: Other (90), Speaker (112), Cable Exit (142) → 90+10+112+10+142 = 364
  const w_other = 90;
  const w_speaker = 112;
  const w_cableexit = 142;
  const row2y = row1y + PILL_H + G;

  // Row 3: Keystone (120), ✓ Camera ✕ (122)
  const w_keystone = 120;
  const w_camera = 122;
  const row3y = row2y + PILL_H + G;

  // Row 4: + Custom (112) dashed
  const w_custom = 112;
  const row4y = row3y + PILL_H + G;

  // Status subhead
  const statusHeadY = 548;
  // Status pills — two rows
  // Row A: ✓ In Progress (150), Done (86), Blocked (110) → 150+10+86+10+110 = 366
  const w_progress = 150;
  const w_done = 86;
  const w_blocked = 110;
  const statusRowAy = 580;

  // Row B: Needs Review (165)
  const w_needs = 165;
  const statusRowBy = statusRowAy + PILL_H + G; // 614

  // Comment field
  const commentHeadY = 666;
  const commentY = 686;
  const commentW = 430 - LEFT * 2; // 382
  const commentH = 100;

  // Buttons
  const btnY = 820;
  const btnH = 52;
  const btnR = btnH / 2;
  const btnW = 180;

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleEnter}
      className="fm-root relative w-full overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <svg
        viewBox="0 0 430 934"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Fieldmark Place Marker modal with Type, Status, and Comment sections — Camera and In Progress selected, Place button in iOS blue."
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif",
        }}
      >
        {/* Page background — lavender-tinted iOS light */}
        <rect x="0" y="0" width="430" height="934" fill="#FAFAFF" />

        {/* ------- Backdrop: top nav + status strip (visible above the dim) ------- */}
        {/* iOS status bar: time + icons (very subtle) */}
        <text
          x="42"
          y="40"
          fontSize={21}
          fontWeight={600}
          fill="#1C1C1E"
          opacity={0.75}
        >
          10:18
        </text>
        {/* Dynamic island / notch stand-in */}
        <rect x="155" y="20" width="120" height="34" rx="17" fill="#000000" opacity={0.9} />
        {/* Wi-Fi + battery stand-ins */}
        <rect x="358" y="30" width="22" height="12" rx="2.5" fill="none" stroke="#1C1C1E" strokeWidth={1.1} opacity={0.75} />
        <rect x="360" y="32" width="18" height="8" rx="1.5" fill="#1C1C1E" opacity={0.75} />

        {/* Nav row — chevron, truncated title, action icons */}
        <g opacity={0.9}>
          <path
            d="M24 86 l-8 8 l8 8"
            fill="none"
            stroke="#1C1C1E"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text x="46" y="99" fontSize={22} fontWeight={600} fill="#1C1C1E">
            SST Willow Cree…
          </text>
          {/* sparkle icon */}
          <g transform="translate(272, 86)" fill="#1C1C1E">
            <path d="M8 0 l1.8 5.2 l5.2 1.8 l-5.2 1.8 l-1.8 5.2 l-1.8 -5.2 l-5.2 -1.8 l5.2 -1.8 z" opacity={0.85} />
          </g>
          {/* filter icon (3 bars) */}
          <g transform="translate(316, 88)" stroke="#1C1C1E" strokeWidth={1.8} strokeLinecap="round">
            <line x1="0" y1="2" x2="16" y2="2" />
            <line x1="2" y1="7" x2="14" y2="7" />
            <line x1="5" y1="12" x2="11" y2="12" />
          </g>
          {/* PDF icon */}
          <g transform="translate(356, 80)">
            <rect x="0" y="0" width="24" height="26" rx="3" fill="none" stroke="#1C1C1E" strokeWidth={1.6} />
            <text x="12" y="18" fontSize={10} fontWeight={700} fill="#1C1C1E" textAnchor="middle">PDF</text>
          </g>
        </g>

        {/* Status strip — "0 / 24 • 21 • 0 • 0 • 3" with coloured dots */}
        <g transform="translate(16, 128)" opacity={0.9}>
          <text x="0" y="0" fontSize={17} fontWeight={400} fill="#1C1C1E">0 / 24</text>
          <circle cx="56" cy="-4" r="4" fill="#34C759" />
          <text x="64" y="0" fontSize={17} fontWeight={500} fill="#1C1C1E">21</text>
          <circle cx="92" cy="-4" r="4" fill="#FF3B30" />
          <text x="100" y="0" fontSize={17} fontWeight={500} fill="#1C1C1E">0</text>
          <circle cx="118" cy="-4" r="4" fill="#007AFF" />
          <text x="126" y="0" fontSize={17} fontWeight={500} fill="#1C1C1E">0</text>
          <circle cx="144" cy="-4" r="4" fill="#FF9500" />
          <text x="152" y="0" fontSize={17} fontWeight={500} fill="#1C1C1E">3</text>
        </g>

        {/* Faint backdrop room rectangles — "floor plan" hint behind dim */}
        <g stroke="rgba(0,0,0,0.08)" strokeWidth="1" fill="none">
          <rect x="30" y="160" width="140" height="60" />
          <rect x="180" y="160" width="100" height="60" />
          <rect x="290" y="160" width="110" height="60" />
          <rect x="30" y="230" width="200" height="20" />
        </g>

        {/* ------- Dim overlay from top down to modal top ------- */}
        <rect x="0" y="0" width="430" height="260" fill="rgba(28,28,30,0.5)" />

        {/* ------- Modal sheet (hero riser) ------- */}
        <g className="m fm-sheet">
          {/* Sheet background (rounded top only — bottom corners square to screen edge) */}
          <path
            d="M 0 260 Q 0 240 20 240 L 410 240 Q 430 240 430 260 L 430 934 L 0 934 Z"
            fill="#FFFFFF"
          />

          {/* Drag handle */}
          <g transform="translate(193, 252)">
            <g className="m fm-handle">
              <rect x="0" y="0" width="44" height="5" rx="2.5" fill="rgba(0,0,0,0.3)" />
            </g>
          </g>

          {/* Title */}
          <g transform="translate(24, 300)">
            <g className="m fm-title">
              <text x="0" y="0" fontSize={29} fontWeight={600} fill="#1C1C1E">
                Place Marker
              </text>
            </g>
          </g>

          {/* "Type" subhead */}
          <g transform="translate(24, 340)">
            <g className="m fm-type-head">
              <text x="0" y="0" fontSize={20} fontWeight={600} fill="#1C1C1E">
                Type
              </text>
            </g>
          </g>

          {/* ---- Type pills ---- */}
          {/* Row 1 */}
          <UnselectedPill x={LEFT} y={row1y} w={w_face} label="Face Plate" className="fm-pill-faceplate" />
          <UnselectedPill x={LEFT + w_face + G} y={row1y} w={w_data} label="Data Cable" className="fm-pill-datacable" />

          {/* Row 2 */}
          <UnselectedPill x={LEFT} y={row2y} w={w_other} label="Other" className="fm-pill-other" />
          <UnselectedPill x={LEFT + w_other + G} y={row2y} w={w_speaker} label="Speaker" className="fm-pill-speaker" />
          <UnselectedPill x={LEFT + w_other + G + w_speaker + G} y={row2y} w={w_cableexit} label="Cable Exit" className="fm-pill-cableexit" />

          {/* Row 3 */}
          <UnselectedPill x={LEFT} y={row3y} w={w_keystone} label="Keystone" className="fm-pill-keystone" />
          <SelectedPill x={LEFT + w_keystone + G} y={row3y} w={w_camera} label="Camera" className="fm-pill-camera" withRemove />

          {/* Row 4 — + Custom (dashed) */}
          <g className="m fm-pill-custom">
            <rect
              x={LEFT}
              y={row4y}
              width={w_custom}
              height={PILL_H}
              rx={PILL_R}
              ry={PILL_R}
              fill="none"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth={1}
              strokeDasharray="4,3"
            />
            {/* + glyph */}
            <g
              transform={`translate(${LEFT + 16}, ${row4y + PILL_H / 2})`}
              stroke="#6E6E73"
              strokeWidth={1.6}
              strokeLinecap="round"
            >
              <line x1="-5" y1="0" x2="5" y2="0" />
              <line x1="0" y1="-5" x2="0" y2="5" />
            </g>
            <text
              x={LEFT + 32}
              y={row4y + PILL_H / 2 + 5}
              fontSize={20}
              fontWeight={400}
              fill="#6E6E73"
            >
              Custom
            </text>
          </g>

          {/* "Status" subhead */}
          <g transform={`translate(24, ${statusHeadY})`}>
            <g className="m fm-status-head">
              <text x="0" y="0" fontSize={20} fontWeight={600} fill="#1C1C1E">
                Status
              </text>
            </g>
          </g>

          {/* Status pills — Row A */}
          <SelectedPill x={LEFT} y={statusRowAy} w={w_progress} label="In Progress" className="fm-pill-progress" />
          <UnselectedPill x={LEFT + w_progress + G} y={statusRowAy} w={w_done} label="Done" className="fm-pill-done" />
          <UnselectedPill x={LEFT + w_progress + G + w_done + G} y={statusRowAy} w={w_blocked} label="Blocked" className="fm-pill-blocked" />

          {/* Status pills — Row B */}
          <UnselectedPill x={LEFT} y={statusRowBy} w={w_needs} label="Needs Review" className="fm-pill-needs" />

          {/* Comment field (subhead omitted — placeholder "Comment (optional)" lives inside) */}
          <g className="m fm-comment">
            <rect
              x={LEFT}
              y={commentY}
              width={commentW}
              height={commentH}
              rx={12}
              ry={12}
              fill="#FFFFFF"
              stroke="rgba(0,0,0,0.18)"
              strokeWidth={1}
            />
            <text
              x={LEFT + 16}
              y={commentY + 24}
              fontSize={20}
              fontWeight={400}
              fill="#6E6E73"
            >
              Comment (optional)
            </text>
          </g>

          {/* Hidden "Comment" subhead placeholder — intentionally no visible subhead per PNG */}
          <g aria-hidden="true" style={{ display: "none" }}>
            <text>{commentHeadY}</text>
          </g>

          {/* Cancel button */}
          <g className="m fm-cancel">
            <rect
              x={LEFT}
              y={btnY}
              width={btnW}
              height={btnH}
              rx={btnR}
              ry={btnR}
              fill="#FFFFFF"
              stroke="rgba(0,0,0,0.12)"
              strokeWidth={1}
            />
            <text
              x={LEFT + btnW / 2}
              y={btnY + btnH / 2 + 6}
              fontSize={22}
              fontWeight={600}
              fill="#1C1C1E"
              textAnchor="middle"
            >
              Cancel
            </text>
          </g>

          {/* Place button (primary, iOS navy blue) */}
          <g className="m fm-place">
            <rect
              x={226}
              y={btnY}
              width={btnW}
              height={btnH}
              rx={btnR}
              ry={btnR}
              fill="#475E89"
            />
            <text
              x={226 + btnW / 2}
              y={btnY + btnH / 2 + 6}
              fontSize={22}
              fontWeight={600}
              fill="#FFFFFF"
              textAnchor="middle"
            >
              Place
            </text>
          </g>

          {/* Home indicator */}
          <g transform="translate(148, 908)">
            <g className="m fm-home">
              <rect x="0" y="0" width="134" height="5" rx="2.5" fill="rgba(0,0,0,0.3)" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
