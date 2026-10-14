"use client";

import { useEffect, useRef } from "react";

const IOS_FONT =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif";

// Pin positions extracted from floor-plan-pins.png via image analysis (24 pins, 21 green + 3 red).
// Sorted by Y so the stagger reads top-to-bottom like a wave.
type PinSpec = { x: number; y: number; color: "green" | "red" };
const PINS: PinSpec[] = [
  { x: 211.2, y: 337.1, color: "green" },
  { x: 269.1, y: 405.5, color: "green" },
  { x: 316.6, y: 408.4, color: "green" },
  { x: 97.5,  y: 408.7, color: "green" },
  { x: 205.8, y: 416.9, color: "green" },
  { x: 237.1, y: 425.0, color: "green" },
  { x: 144.2, y: 484.8, color: "green" },
  { x: 261.8, y: 490.7, color: "green" },
  { x: 343.1, y: 502.3, color: "green" },
  { x: 322.3, y: 503.3, color: "green" },
  { x: 68.3,  y: 531.7, color: "green" },
  { x: 134.1, y: 549.3, color: "green" },
  { x: 100.9, y: 553.1, color: "green" },
  { x: 153.0, y: 564.4, color: "green" },
  { x: 245.9, y: 581.5, color: "green" },
  { x: 146.2, y: 586.6, color: "green" },
  { x: 81.8,  y: 605.9, color: "green" },
  { x: 50.2,  y: 615.5, color: "green" },
  { x: 100.0, y: 650.6, color: "green" },
  { x: 255.5, y: 666.0, color: "red"   },
  { x: 136.0, y: 658.4, color: "green" },
  { x: 98.9,  y: 680.8, color: "green" },
  { x: 136.9, y: 737.7, color: "red"   },
  { x: 199.7, y: 756.8, color: "red"   },
];

// COLORS — pin visuals copied from the Fieldmark app.
const PIN_HALO = "#FFC107";   // yellow halo ring behind each pin
const PIN_GREEN = "#3B9C3F";   // "done" fill
const PIN_RED = "#D23F31";     // "needs review / blocked" fill

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
  @keyframes ff-pin-drop {
    0%   { opacity: 0; transform: scale(0.1); }
    60%  { opacity: 1; transform: scale(1.15); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes ff-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes ff-plan-in {
    from { opacity: 0; }
    to   { opacity: 1; }
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

  /* Floor plan PDF fades in (pin positions get erased by white discs) */
  .ff-root.ff-play .ff-plan {
    animation-name: ff-plan-in;
    animation-delay: 0.56s;
    animation-duration: 0.6s;
  }

  /* Pin drops — each one gets a staggered delay via inline style */
  .ff-root.ff-play .ff-pin {
    animation-name: ff-pin-drop;
    animation-duration: 0.45s;
    animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Page pill slides up */
  .ff-root.ff-play .ff-pager { animation-name: ff-slide-up; animation-delay: 2.00s; animation-duration: 0.55s; }

  /* Home indicator */
  .ff-root.ff-play .ff-home { animation-name: ff-fade; animation-delay: 2.20s; }

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

function SparklesIcon() {
  return (
    <g stroke="#1C1C1E" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 l1.6 4.4 L18 9 l-4.4 1.6 L12 15 l-1.6 -4.4 L6 9 l4.4 -1.6 Z" />
      <path d="M19 14 l0.8 2.2 L22 17 l-2.2 0.8 L19 20 l-0.8 -2.2 L16 17 l2.2 -0.8 Z" />
    </g>
  );
}

function FilterIcon() {
  return (
    <g stroke="#1C1C1E" strokeWidth="1.8" fill="none" strokeLinecap="round">
      <line x1="3" y1="7"  x2="21" y2="7"  />
      <line x1="6" y1="12" x2="18" y2="12" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </g>
  );
}

function PdfToggleIcon() {
  return (
    <g stroke="#1C1C1E" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <text
        x="12"
        y="15.4"
        fontSize="9"
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
        fontSize="17"
        fontWeight="600"
        fill="#1C1C1E"
        style={{ fontFamily: IOS_FONT }}
      >
        {count}
      </text>
    </g>
  );
}

type Counter = { cls: string; color: string; count: number };
const COUNTERS: Counter[] = [
  { cls: "ff-cnt1", color: "#34C759", count: 21 },
  { cls: "ff-cnt2", color: "#007AFF", count: 0 },
  { cls: "ff-cnt3", color: "#FF3B30", count: 0 },
  { cls: "ff-cnt4", color: "#FF9500", count: 3 },
];

export function FieldmarkFloorPlan() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  const play = () => {
    const el = wrapperRef.current;
    if (!el) return;
    el.classList.remove("ff-play");
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

  // Counter row
  const CNT_Y = 162;
  let cursor = 24;

  // Pin stagger: 25ms per pin, starting at 1.10s so PDF is settled
  const PIN_START = 1.10;
  const PIN_STEP = 0.025;
  const ERASE_R = 26; // radius of the white disc that hides the baked pin + F badge
  const HALO_R = 17;  // outer yellow ring
  const PIN_R = 13;   // inner colored circle

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

        {/* --- floor plan PDF (fades in; pins get erased by white discs below) --- */}
        <g className="m ff-plan">
          <image
            href="/case-studies/fieldmark/floor-plan-pins.png"
            x="0"
            y="0"
            width="430"
            height="934"
            preserveAspectRatio="xMidYMid meet"
          />
          {/* paper-white erase discs cover baked pins — the SVG pins land in these holes */}
          {PINS.map((p, i) => (
            <circle
              key={`erase-${i}`}
              cx={p.x}
              cy={p.y}
              r={ERASE_R}
              fill="#FFFFFF"
            />
          ))}
        </g>

        {/* --- animated SVG pins (drop in with top-to-bottom stagger) --- */}
        {PINS.map((p, i) => (
          <g
            key={`pin-${i}`}
            transform={`translate(${p.x}, ${p.y})`}
          >
            <g
              className="m ff-pin"
              style={{ animationDelay: `${(PIN_START + i * PIN_STEP).toFixed(3)}s` }}
            >
              <circle cx="0" cy="0" r={HALO_R} fill={PIN_HALO} />
              <circle
                cx="0"
                cy="0"
                r={PIN_R}
                fill={p.color === "green" ? PIN_GREEN : PIN_RED}
              />
              <text
                x="0"
                y="4"
                fontSize="16"
                fontWeight="700"
                fill="#FFFFFF"
                textAnchor="middle"
                style={{ fontFamily: IOS_FONT }}
              >
                C
              </text>
              {/* F badge (top-right offset) — "Face plate" layer tag from the app */}
              <circle cx="11" cy="-11" r="7" fill={PIN_HALO} />
              <text
                x="11"
                y="-8"
                fontSize="10"
                fontWeight="700"
                fill="#1C1C1E"
                textAnchor="middle"
                style={{ fontFamily: IOS_FONT }}
              >
                F
              </text>
            </g>
          </g>
        ))}

        {/* --- opaque bands cover baked chrome so our animated chrome owns the top & bottom --- */}
        <rect x="0" y="0" width="430" height="180" fill="#FAFAFF" />
        <rect x="0" y="820" width="430" height="114" fill="#FAFAFF" />

        {/* --- status bar --- */}
        <g transform="translate(0, 0)">
          <g className="m ff-status">
            <text
              x="24"
              y="36"
              fontSize="20"
              fontWeight="600"
              fill="#1C1C1E"
              style={{ fontFamily: IOS_FONT }}
            >
              21:21
            </text>
            <rect x="153" y="14" width="124" height="32" rx="16" fill="#000000" />
            <g transform="translate(338, 28)" fill="#1C1C1E">
              <circle cx="0"  cy="4" r="1.4" />
              <circle cx="5"  cy="4" r="1.4" />
              <circle cx="10" cy="4" r="1.4" />
              <circle cx="15" cy="4" r="1.4" />
            </g>
            <g transform="translate(360, 22)" fill="#1C1C1E">
              <path d="M8 14 L5.8 11.6 a3.2 3.2 0 0 1 4.4 0 z" />
              <path d="M3.6 9.4 a6 6 0 0 1 8.8 0 l-1.3 1.3 a4.2 4.2 0 0 0 -6.2 0 z" />
              <path d="M1.6 7.4 a9 9 0 0 1 12.8 0 l-1.3 1.3 a7.2 7.2 0 0 0 -10.2 0 z" />
            </g>
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
              fontSize="22"
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

        {/* --- counter row plate (muted lavender-gray band behind the dots) --- */}
        <rect x="0" y="134" width="430" height="50" fill="#E2E2E9" />

        {/* --- counter row --- */}
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
            <path
              d="M22 14 L16 20 L22 26"
              stroke="#FFFFFF"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="83"
              y="25"
              fontSize="18"
              fontWeight="500"
              fill="#FFFFFF"
              textAnchor="middle"
              style={{ fontFamily: IOS_FONT }}
            >
              Page 3 / 13
            </text>
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
