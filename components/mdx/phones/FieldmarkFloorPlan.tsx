"use client";

import { useEffect, useRef } from "react";

const IOS_FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif";

const CSS = `
  .ff-root .m {
    opacity: 0;
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes ff-slide-down {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ff-slide-right {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes ff-slide-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ff-scale-in {
    from { opacity: 0; transform: scale(0.4); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes ff-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes ff-plan-in {
    from { opacity: 0; transform: scale(0.985); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* Status bar */
  .ff-root.ff-play .ff-status { animation-name: ff-slide-down; animation-delay: 0.00s; }

  /* Nav row */
  .ff-root.ff-play .ff-back    { animation-name: ff-slide-right; animation-delay: 0.08s; transform-origin: 0% 50%; }
  .ff-root.ff-play .ff-title   { animation-name: ff-slide-right; animation-delay: 0.12s; transform-origin: 0% 50%; }
  .ff-root.ff-play .ff-icon-a  { animation-name: ff-scale-in;    animation-delay: 0.18s; }
  .ff-root.ff-play .ff-icon-b  { animation-name: ff-scale-in;    animation-delay: 0.22s; }
  .ff-root.ff-play .ff-icon-c  { animation-name: ff-scale-in;    animation-delay: 0.26s; }

  /* Counter dots stagger */
  .ff-root.ff-play .ff-cnt1 { animation-name: ff-scale-in; animation-delay: 0.32s; animation-duration: 0.4s; }
  .ff-root.ff-play .ff-cnt2 { animation-name: ff-scale-in; animation-delay: 0.40s; animation-duration: 0.4s; }
  .ff-root.ff-play .ff-cnt3 { animation-name: ff-scale-in; animation-delay: 0.48s; animation-duration: 0.4s; }
  .ff-root.ff-play .ff-cnt4 { animation-name: ff-scale-in; animation-delay: 0.56s; animation-duration: 0.4s; }

  /* Floor plan image (center-pivot subtle scale + fade) */
  .ff-root.ff-play .ff-plan {
    animation-name: ff-plan-in;
    animation-delay: 0.64s;
    animation-duration: 0.8s;
    transform-origin: 215px 500px;
  }

  /* Page pill slides up */
  .ff-root.ff-play .ff-pager { animation-name: ff-slide-up; animation-delay: 1.30s; animation-duration: 0.55s; }

  /* Home indicator */
  .ff-root.ff-play .ff-home { animation-name: ff-fade; animation-delay: 1.50s; }

  @media (prefers-reduced-motion: reduce) {
    .ff-root .m {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

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

/** Sparkles / AI glyph. */
function SparklesIcon() {
  return (
    <g stroke="#1C1C1E" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 l1.6 4.4 L18 9 l-4.4 1.6 L12 15 l-1.6 -4.4 L6 9 l4.4 -1.6 Z" />
      <path d="M19 14 l0.8 2.2 L22 17 l-2.2 0.8 L19 20 l-0.8 -2.2 L16 17 l2.2 -0.8 Z" />
    </g>
  );
}

/** Filter glyph — three descending horizontal lines. */
function FilterIcon() {
  return (
    <g stroke="#1C1C1E" strokeWidth="1.8" fill="none" strokeLinecap="round">
      <line x1="3" y1="7"  x2="21" y2="7"  />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </g>
  );
}

/** PDF toggle glyph — small outlined rectangle with "PDF" hint. */
function PdfToggleIcon() {
  return (
    <g stroke="#1C1C1E" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <text
        x="12"
        y="15.4"
        fontSize="7"
        fontWeight="700"
        fill="#1C1C1E"
        stroke="none"
        textAnchor="middle"
        style={{ fontFamily: IOS_FONT }}
      >
        PDF
      </text>
    </g>
  );
}

/** Dot + count pair for the status counter row. */
function DotCount({
  x,
  y,
  color,
  count,
}: {
  x: number;
  y: number;
  color: string;
  count: number;
}) {
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

type Counter = {
  cls: string;
  color: string;
  count: number;
};

const COUNTERS: Counter[] = [
  { cls: "ff-cnt1", color: "#34C759", count: 21 },
  { cls: "ff-cnt2", color: "#007AFF", count: 0 },
  { cls: "ff-cnt3", color: "#FF9500", count: 0 },
  { cls: "ff-cnt4", color: "#FF3B30", count: 3 },
];

export function FieldmarkFloorPlan() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  const play = () => {
    const el = wrapperRef.current;
    if (!el) return;
    el.classList.remove("ff-play");
    // Force reflow — restarts every @keyframes.
    void el.offsetWidth;
    el.classList.add("ff-play");
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

  // Counter row baseline
  const CNT_Y = 162;
  let cursor = 24;

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleEnter}
      className="ff-root relative w-full overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <svg
        viewBox="0 0 430 934"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Fieldmark floor plan — SST Willow Creek Camera First Floor Plan with 24 camera pins (21 green done, 3 red blocked) overlaid on the architectural PDF; page 3 of 13."
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          fontFamily: IOS_FONT,
        }}
      >
        {/* --- lavender page bg --- */}
        <rect x="0" y="0" width="430" height="934" fill="#FAFAFF" />

        {/* --- floor plan PDF (fades in behind chrome) --- */}
        <g className="m ff-plan">
          <image
            href="/case-studies/fieldmark/floor-plan-pins.png"
            x="0"
            y="0"
            width="430"
            height="934"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>

        {/* --- opaque bands cover baked chrome so our animated chrome owns the top & bottom --- */}
        <rect x="0" y="0" width="430" height="180" fill="#FAFAFF" />
        <rect x="0" y="820" width="430" height="114" fill="#FAFAFF" />

        {/* --- status bar --- */}
        <g transform="translate(0, 0)">
          <g className="m ff-status">
            <text
              x="24"
              y="36"
              fontSize="15"
              fontWeight="600"
              fill="#1C1C1E"
              style={{ fontFamily: IOS_FONT }}
            >
              21:21
            </text>
            <rect x="153" y="14" width="124" height="32" rx="16" fill="#000000" />
            {/* signal dots */}
            <g transform="translate(338, 28)" fill="#1C1C1E">
              <circle cx="0"  cy="4" r="1.4" />
              <circle cx="5"  cy="4" r="1.4" />
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

        {/* --- back chevron --- */}
        <g transform="translate(24, 86)">
          <g className="m ff-back">
            <BackChevron />
          </g>
        </g>

        {/* --- nav title "SST Willow Cree..." --- */}
        <g transform="translate(70, 108)">
          <g className="m ff-title">
            <text
              x="0"
              y="0"
              fontSize="17"
              fontWeight="600"
              fill="#1C1C1E"
              style={{ fontFamily: IOS_FONT }}
            >
              SST Willow Cree...
            </text>
          </g>
        </g>

        {/* --- right icons: sparkles · filter · pdf-toggle --- */}
        <g transform="translate(316, 88)">
          <g className="m ff-icon-a">
            <SparklesIcon />
          </g>
        </g>
        <g transform="translate(352, 88)">
          <g className="m ff-icon-b">
            <FilterIcon />
          </g>
        </g>
        <g transform="translate(388, 88)">
          <g className="m ff-icon-c">
            <PdfToggleIcon />
          </g>
        </g>

        {/* --- counter row (dots + counts, inline) --- */}
        {COUNTERS.map((c) => {
          const el = (
            <g key={c.cls} className={`m ${c.cls}`}>
              <DotCount x={cursor} y={CNT_Y} color={c.color} count={c.count} />
            </g>
          );
          const digits = String(c.count).length;
          cursor += 8 + 6 + digits * 8 + 16;
          return el;
        })}

        {/* --- page pill (bottom) --- */}
        <g transform="translate(132, 846)">
          <g className="m ff-pager">
            <rect x="0" y="0" width="166" height="40" rx="20" fill="#8E8E93" />
            {/* left chevron */}
            <path
              d="M22 14 L16 20 L22 26"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* label */}
            <text
              x="83"
              y="25"
              fontSize="14"
              fontWeight="500"
              fill="#FFFFFF"
              textAnchor="middle"
              style={{ fontFamily: IOS_FONT }}
            >
              Page 3 / 13
            </text>
            {/* right chevron */}
            <path
              d="M144 14 L150 20 L144 26"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* --- home indicator --- */}
        <g transform="translate(148, 920)">
          <g className="m ff-home">
            <rect x="0" y="0" width="134" height="5" rx="2.5" fill="rgba(0,0,0,0.4)" />
          </g>
        </g>
      </svg>
    </div>
  );
}
