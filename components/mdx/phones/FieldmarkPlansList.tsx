"use client";

import { useEffect, useRef } from "react";

const IOS_FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif";

const CSS = `
  .fp-root .m {
    opacity: 0;
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes fp-slide-down {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fp-slide-right {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes fp-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes fp-rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fp-scale-in {
    from { opacity: 0; transform: scale(0.4); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes fp-hero {
    from { opacity: 0; transform: scale(0.6); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* Status bar */
  .fp-root.fp-play .fp-status { animation-name: fp-slide-down; animation-delay: 0.00s; }

  /* Header */
  .fp-root.fp-play .fp-back  { animation-name: fp-slide-right; animation-delay: 0.08s; transform-origin: 0% 50%; }
  .fp-root.fp-play .fp-title { animation-name: fp-slide-right; animation-delay: 0.12s; transform-origin: 0% 50%; }
  .fp-root.fp-play .fp-bell  { animation-name: fp-scale-in;    animation-delay: 0.16s; }

  /* Cards (rise + fade) */
  .fp-root.fp-play .fp-row1 { animation-name: fp-rise; animation-delay: 0.20s; }
  .fp-root.fp-play .fp-row2 { animation-name: fp-rise; animation-delay: 0.32s; }
  .fp-root.fp-play .fp-row3 { animation-name: fp-rise; animation-delay: 0.44s; }
  .fp-root.fp-play .fp-row4 { animation-name: fp-rise; animation-delay: 0.56s; }

  /* Dot clusters — scale-in after each card lands */
  .fp-root.fp-play .fp-dots1 { animation-name: fp-scale-in; animation-delay: 0.30s; animation-duration: 0.4s; }
  .fp-root.fp-play .fp-dots2 { animation-name: fp-scale-in; animation-delay: 0.42s; animation-duration: 0.4s; }
  .fp-root.fp-play .fp-dots3 { animation-name: fp-scale-in; animation-delay: 0.54s; animation-duration: 0.4s; }
  .fp-root.fp-play .fp-dots4 { animation-name: fp-scale-in; animation-delay: 0.66s; animation-duration: 0.4s; }

  /* Tab bar */
  .fp-root.fp-play .fp-tabbar { animation-name: fp-rise;     animation-delay: 0.78s; }
  .fp-root.fp-play .fp-tabpill { animation-name: fp-hero;    animation-delay: 0.86s; animation-duration: 0.6s; }

  /* Home indicator */
  .fp-root.fp-play .fp-home { animation-name: fp-fade; animation-delay: 0.92s; }

  @media (prefers-reduced-motion: reduce) {
    .fp-root .m {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

/** PDF tile glyph — layered-document icon, muted blue-gray stroke. */
function PdfGlyph() {
  return (
    <g transform="translate(38, 39)" stroke="#4A5570" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* back page */}
      <path d="M4 2 h12 l4 4 v16 a1.5 1.5 0 0 1 -1.5 1.5 h-14.5 a1.5 1.5 0 0 1 -1.5 -1.5 v-18.5 a1.5 1.5 0 0 1 1.5 -1.5 Z" />
      <path d="M16 2 v4 h4" />
      {/* front page offset */}
      <path d="M0 6 h12 l4 4 v16 a1.5 1.5 0 0 1 -1.5 1.5 h-14.5 a1.5 1.5 0 0 1 -1.5 -1.5 v-18.5 a1.5 1.5 0 0 1 1.5 -1.5 Z" fill="#CFD4E3" />
      <path d="M12 6 v4 h4" />
      {/* "PDF" letters hint */}
      <text x="2" y="22" fontSize="5.5" fontWeight="700" fill="#4A5570" stroke="none" style={{ fontFamily: IOS_FONT }}>PDF</text>
    </g>
  );
}

function ChevronRight({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x} ${y} l6 7 l-6 7`}
      stroke="#A0A0A6"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function BackChevron() {
  return (
    <path
      d="M14 7 L7 14 L14 21"
      stroke="#1C1C1E"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function BellIcon() {
  return (
    <g stroke="#3A3A3C" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 a7 7 0 0 1 7 7 v4 l2 3 h-18 l2 -3 v-4 a7 7 0 0 1 7 -7 z" />
      <path d="M10 21 a2 2 0 0 0 4 0" />
    </g>
  );
}

/** Plans tab icon — outlined book spread. */
function PlansTabIcon() {
  return (
    <g stroke="#1C1C1E" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4 h6 a2 2 0 0 1 2 2 v12 a2 2 0 0 0 -2 -2 h-6 z" />
      <path d="M17 4 h-6 a2 2 0 0 0 -2 2 v12 a2 2 0 0 1 2 -2 h6 z" />
    </g>
  );
}

/** Tasks tab icon — outlined clipboard. */
function TasksTabIcon() {
  return (
    <g stroke="#6E6E73" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="12" height="14" rx="2" />
      <rect x="7" y="2" width="6" height="3" rx="1" fill="#F5F6F8" />
      <path d="M7 9 h6" />
      <path d="M7 12 h6" />
      <path d="M7 15 h4" />
    </g>
  );
}

/** Team tab icon — outlined 2-person silhouette. */
function TeamTabIcon() {
  return (
    <g stroke="#6E6E73" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="2.4" />
      <path d="M2.5 17 c0 -3 2 -5 4.5 -5 s4.5 2 4.5 5" />
      <circle cx="14" cy="8" r="2" />
      <path d="M11.5 17 c0 -2.4 1.6 -4 3.5 -4 s3.5 1.6 3.5 4" />
    </g>
  );
}

/** Status dot + count inline. x is the left of the dot, returns next x cursor. */
function DotCount({ x, y, color, count }: { x: number; y: number; color: string; count: number }) {
  return (
    <g>
      <circle cx={x + 4} cy={y - 4} r="4" fill={color} />
      <text
        x={x + 12}
        y={y}
        fontSize="13"
        fontWeight="600"
        fill="#1C1C1E"
        style={{ fontFamily: IOS_FONT }}
      >
        {count}
      </text>
    </g>
  );
}

type Row = {
  cls: string;
  dotsCls: string;
  y: number;
  titleLines: string[];
  markers: number;
  dots: { color: string; count: number }[];
};

const ROWS: Row[] = [
  {
    cls: "fp-row1",
    dotsCls: "fp-dots1",
    y: 172,
    titleLines: ["SST Willow Creek", "P2_TS_R1.7 2"],
    markers: 24,
    dots: [
      { color: "#34C759", count: 21 },
      { color: "#FF9500", count: 3 },
    ],
  },
  {
    cls: "fp-row2",
    dotsCls: "fp-dots2",
    y: 292,
    titleLines: ["SST Willow Creek", "P2_T_R1.10"],
    markers: 90,
    dots: [
      { color: "#34C759", count: 86 },
      { color: "#007AFF", count: 2 },
      { color: "#FF9500", count: 2 },
    ],
  },
  {
    cls: "fp-row3",
    dotsCls: "fp-dots3",
    y: 412,
    titleLines: ["SST Willow Creek", "P2_TS_R1.7"],
    markers: 10,
    dots: [
      { color: "#34C759", count: 8 },
      { color: "#FF3B30", count: 1 },
      { color: "#FF9500", count: 1 },
    ],
  },
  {
    cls: "fp-row4",
    dotsCls: "fp-dots4",
    y: 532,
    titleLines: ["Flore1"],
    markers: 5,
    dots: [
      { color: "#34C759", count: 1 },
      { color: "#007AFF", count: 3 },
      { color: "#FF3B30", count: 1 },
    ],
  },
];

const CARD_X = 24;
const CARD_W = 382;
const CARD_H = 108;

export function FieldmarkPlansList() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  const play = () => {
    const el = wrapperRef.current;
    if (!el) return;
    el.classList.remove("fp-play");
    // Force reflow — restarts every @keyframes.
    void el.offsetWidth;
    el.classList.add("fp-play");
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

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleEnter}
      className="fp-root relative w-full overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <svg
        viewBox="0 0 430 934"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Fieldmark plans list showing four PDF plans with inline marker-status counts, Plans tab active in the bottom bar."
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          fontFamily: IOS_FONT,
        }}
      >
        {/* --- iOS-tinted page background (lavender-cool), stops the warm paper from showing through --- */}
        <rect x="0" y="0" width="430" height="934" fill="#FAFAFF" />

        {/* --- status bar --- */}
        <g transform="translate(0, 0)">
          <g className="m fp-status">
            {/* time */}
            <text
              x="24"
              y="36"
              fontSize="15"
              fontWeight="600"
              fill="#1C1C1E"
              style={{ fontFamily: IOS_FONT }}
            >
              10:04
            </text>
            {/* Dynamic Island */}
            <rect x="153" y="14" width="124" height="32" rx="16" fill="#000000" />
            {/* wifi dots cluster placeholder (four small triangles muted) */}
            <g transform="translate(338, 28)" fill="#6E6E73">
              <circle cx="0" cy="4" r="1.4" />
              <circle cx="5" cy="4" r="1.4" />
              <circle cx="10" cy="4" r="1.4" />
              <circle cx="15" cy="4" r="1.4" />
            </g>
            {/* wifi */}
            <g transform="translate(360, 22)" fill="#1C1C1E">
              <path d="M8 14 L5.8 11.6 a3.2 3.2 0 0 1 4.4 0 z" />
              <path d="M3.6 9.4 a6 6 0 0 1 8.8 0 l-1.3 1.3 a4.2 4.2 0 0 0 -6.2 0 z" />
              <path d="M1.6 7.4 a9 9 0 0 1 12.8 0 l-1.3 1.3 a7.2 7.2 0 0 0 -10.2 0 z" />
            </g>
            {/* battery */}
            <g transform="translate(384, 22)">
              <rect x="0.6" y="0.6" width="22" height="11" rx="3.2" stroke="#1C1C1E" strokeWidth="1.2" fill="none" />
              <rect x="2.4" y="2.4" width="18.4" height="7.4" rx="1.6" fill="#1C1C1E" />
              <path d="M24 4.4 v3.4" stroke="#1C1C1E" strokeWidth="1.4" strokeLinecap="round" />
            </g>
          </g>
        </g>

        {/* --- header: back chevron --- */}
        <g transform="translate(24, 100)">
          <g className="m fp-back">
            <BackChevron />
          </g>
        </g>

        {/* --- header title "Sst" --- */}
        <g transform="translate(72, 123)">
          <g className="m fp-title">
            <text
              x="0"
              y="0"
              fontSize="17"
              fontWeight="600"
              fill="#1C1C1E"
              style={{ fontFamily: IOS_FONT }}
            >
              Sst
            </text>
          </g>
        </g>

        {/* --- bell icon --- */}
        <g transform="translate(382, 104)">
          <g className="m fp-bell">
            <BellIcon />
          </g>
        </g>

        {/* --- cards --- */}
        {ROWS.map((row) => {
          const titleX = 96;
          const titleY = row.titleLines.length === 1 ? 46 : 36;
          const lineHeight = 20;
          // Marker row Y — below title block
          const markerY = row.titleLines.length === 1 ? 70 : 76;
          // "N markers" text
          const markerText = `${row.markers} markers`;
          // Approx width of "N markers" at 13px semibold-ish — reserve 72px then dots start.
          // Use a measured spacing: text ends ~ at titleX + estimated_px, start dots after +16px gap.
          const markerTextApproxW = markerText.length * 7; // rough per-char at 13px
          let dotCursor = titleX + markerTextApproxW + 16;

          return (
            <g key={row.cls} transform={`translate(${CARD_X}, ${row.y})`}>
              <g className={`m ${row.cls}`}>
                {/* card bg */}
                <rect
                  x="0"
                  y="0"
                  width={CARD_W}
                  height={CARD_H}
                  rx="14"
                  fill="#F1F2F7"
                />
                {/* PDF tile */}
                <rect x="16" y="22" width="64" height="64" rx="12" fill="#CFD4E3" />
                <PdfGlyph />

                {/* title lines */}
                {row.titleLines.map((line, i) => (
                  <text
                    key={i}
                    x={titleX}
                    y={titleY + i * lineHeight}
                    fontSize="16"
                    fontWeight="600"
                    fill="#1C1C1E"
                    style={{ fontFamily: IOS_FONT }}
                  >
                    {line}
                  </text>
                ))}

                {/* "N markers" subtitle */}
                <text
                  x={titleX}
                  y={markerY}
                  fontSize="13"
                  fontWeight="400"
                  fill="#6E6E73"
                  style={{ fontFamily: IOS_FONT }}
                >
                  {markerText}
                </text>

                {/* inline dot cluster — animated separately, scale-in after card lands */}
                <g className={`m ${row.dotsCls}`}>
                  {row.dots.map((d, i) => {
                    const el = (
                      <DotCount
                        key={i}
                        x={dotCursor}
                        y={markerY}
                        color={d.color}
                        count={d.count}
                      />
                    );
                    // Advance cursor: dot (8) + gap (6) + count digits (roughly 8 per digit) + inter-pair gap (12)
                    const digitCount = String(d.count).length;
                    dotCursor += 8 + 6 + digitCount * 8 + 12;
                    return el;
                  })}
                </g>

                {/* right chevron */}
                <ChevronRight x={CARD_W - 24} y={CARD_H / 2 - 7} />
              </g>
            </g>
          );
        })}

        {/* --- tab bar --- */}
        <g transform="translate(0, 854)">
          <g className="m fp-tabbar">
            {/* bg */}
            <rect x="0" y="0" width="430" height="80" fill="#FAFAFF" />
            {/* top hairline */}
            <line x1="0" y1="0.5" x2="430" y2="0.5" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />

            {/* Column widths: 430/3 ≈ 143.33. Centers: 71.7, 215, 358.3 */}

            {/* Plans (active) — tab pill behind the icon (hero element). */}
            <g transform="translate(47, 6)">
              <g className="m fp-tabpill">
                <rect x="0" y="0" width="48" height="32" rx="16" fill="#CFD4E3" />
              </g>
            </g>
            {/* Plans icon on top of pill */}
            <g transform="translate(61, 12)">
              <PlansTabIcon />
            </g>
            {/* Plans label */}
            <text
              x="72"
              y="54"
              fontSize="11"
              fontWeight="500"
              fill="#1C1C1E"
              textAnchor="middle"
              style={{ fontFamily: IOS_FONT }}
            >
              Plans
            </text>

            {/* Tasks (inactive) */}
            <g transform="translate(205, 12)">
              <TasksTabIcon />
            </g>
            <text
              x="215"
              y="54"
              fontSize="11"
              fontWeight="500"
              fill="#6E6E73"
              textAnchor="middle"
              style={{ fontFamily: IOS_FONT }}
            >
              Tasks
            </text>

            {/* Team (inactive) */}
            <g transform="translate(348, 12)">
              <TeamTabIcon />
            </g>
            <text
              x="358"
              y="54"
              fontSize="11"
              fontWeight="500"
              fill="#6E6E73"
              textAnchor="middle"
              style={{ fontFamily: IOS_FONT }}
            >
              Team
            </text>
          </g>
        </g>

        {/* --- home indicator --- */}
        <g transform="translate(148, 920)">
          <g className="m fp-home">
            <rect x="0" y="0" width="134" height="5" rx="2.5" fill="rgba(0,0,0,0.4)" />
          </g>
        </g>
      </svg>
    </div>
  );
}
