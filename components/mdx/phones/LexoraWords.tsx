"use client";

import { useEffect, useRef } from "react";

const CSS = `
  .lw-root .m {
    opacity: 0;
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes lw-slide-down {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lw-slide-right {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes lw-scale-in {
    from { opacity: 0; transform: scale(0.4); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes lw-rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lw-scale-x {
    from { opacity: 0; transform: scaleX(0); }
    to   { opacity: 1; transform: scaleX(1); }
  }
  @keyframes lw-hero {
    from { opacity: 0; transform: scale(0.3) rotate(-45deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }

  /* Animation names GATED behind .lw-play — classList toggle restarts every @keyframes. */
  .lw-root.lw-play .hbg  { animation-name: lw-slide-down;  animation-delay: 0.00s; }
  .lw-root.lw-play .hbk  { animation-name: lw-slide-right; animation-delay: 0.06s; }
  .lw-root.lw-play .htl  { animation-name: lw-slide-right; animation-delay: 0.10s; transform-origin: 0% 50%; }
  .lw-root.lw-play .hed  { animation-name: lw-scale-in;    animation-delay: 0.14s; }
  .lw-root.lw-play .hsw  { animation-name: lw-scale-in;    animation-delay: 0.17s; }
  .lw-root.lw-play .hpl  { animation-name: lw-scale-in;    animation-delay: 0.20s; }
  .lw-root.lw-play .srch { animation-name: lw-scale-x;     animation-delay: 0.26s; transform-origin: 0% 50%; }
  .lw-root.lw-play .cd0  { animation-name: lw-rise;        animation-delay: 0.34s; }
  .lw-root.lw-play .cd1  { animation-name: lw-rise;        animation-delay: 0.41s; }
  .lw-root.lw-play .cd2  { animation-name: lw-rise;        animation-delay: 0.48s; }
  .lw-root.lw-play .cd3  { animation-name: lw-rise;        animation-delay: 0.55s; }
  .lw-root.lw-play .cd4  { animation-name: lw-rise;        animation-delay: 0.62s; }
  .lw-root.lw-play .cd5  { animation-name: lw-rise;        animation-delay: 0.69s; }
  .lw-root.lw-play .cd6  { animation-name: lw-rise;        animation-delay: 0.76s; }
  .lw-root.lw-play .cd7  { animation-name: lw-rise;        animation-delay: 0.83s; }
  .lw-root.lw-play .fab  { animation-name: lw-hero;        animation-delay: 1.05s; animation-duration: 0.6s; }

  @media (prefers-reduced-motion: reduce) {
    .lw-root .m {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

type Pair = { en: string; uk: string };

const PAIRS: Pair[] = [
  { en: "Follow up", uk: "уточнити" },
  { en: "Proposal", uk: "пропозиція" },
  { en: "Stakeholder", uk: "зацікавлена сторона" },
  { en: "Agenda", uk: "порядок денний" },
  { en: "Budget", uk: "бюджет" },
  { en: "Invoice", uk: "рахунок" },
  { en: "Deadline", uk: "термін" },
  { en: "Meeting", uk: "зустріч" },
];

const CARD_TOP = 232;      // first card y
const CARD_H = 66;
const CARD_GAP = 10;
const CARD_X = 20;
const CARD_W = 390;

export function LexoraWords() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  const play = () => {
    const el = wrapperRef.current;
    if (!el) return;
    el.classList.remove("lw-play");
    // Force reflow so the next add restarts every @keyframes.
    void el.offsetWidth;
    el.classList.add("lw-play");
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
      className="lw-root relative w-full overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <svg
        viewBox="0 0 430 934"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Lexora Business English 101 word list — eight English/Ukrainian pairs with edit and delete controls, searchable, floating add button"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          background: "#f4f5fa",
          fontFamily: "Manrope, Inter, -apple-system, 'Helvetica Neue', sans-serif",
          color: "#111318",
        }}
      >
        {/* --- status bar --- */}
        <g className="m hbg">
          <text x="58" y="42" fontSize="17" fontWeight="700" fill="#111">09:41</text>
          <g transform="translate(302, 32)" fill="#111">
            <rect x="0" y="7" width="3" height="4" rx=".8" />
            <rect x="4.6" y="5" width="3" height="6" rx=".8" />
            <rect x="9.2" y="2.6" width="3" height="8.4" rx=".8" />
            <rect x="13.8" y="0" width="3" height="11" rx=".8" />
          </g>
          <g transform="translate(326, 33)" fill="#111">
            <path d="M12 17.5 8.6 13.9a4.8 4.8 0 0 1 6.8 0z" />
            <path d="M5.7 11a8.9 8.9 0 0 1 12.6 0l-1.8 1.9a6.3 6.3 0 0 0-9 0z" />
            <path d="M2.8 8.1a13 13 0 0 1 18.4 0l-1.8 1.9a10.4 10.4 0 0 0-14.8 0z" />
            <path d="M0 5.2a17 17 0 0 1 24 0l-1.8 1.9a14.4 14.4 0 0 0-20.4 0z" />
          </g>
          <g transform="translate(352, 32)">
            <rect x=".7" y=".7" width="21" height="10.6" rx="3" stroke="#111" strokeWidth="1.2" fill="none" />
            <rect x="2.4" y="2.4" width="17.6" height="7.2" rx="1.6" fill="#111" />
            <path d="M23.3 4.2v3.6" stroke="#111" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </g>

        {/* --- back chevron (position wrapper + animated inner) --- */}
        <g transform="translate(20, 100)">
          <g className="m hbk">
            <path
              d="m15 5-7 7 7 7"
              fill="none"
              stroke="#111318"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* --- header title --- */}
        <text
          className="m htl"
          x="58"
          y="123"
          fontSize="20"
          fontWeight="800"
          fill="#111318"
          style={{ letterSpacing: "-0.01em" }}
        >
          Business English 101
        </text>

        {/* --- edit pencil icon (position + animated inner) --- */}
        <g transform="translate(290, 105)">
          <g className="m hed">
            <path
              d="M3 17l1-4L15 2l3 3L7 16l-4 1z"
              fill="none"
              stroke="#111318"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M13 4l3 3" stroke="#111318" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>

        {/* --- swap arrows icon --- */}
        <g transform="translate(326, 107)">
          <g className="m hsw">
            <path
              d="M3 6h14l-3-3M17 14H3l3 3"
              fill="none"
              stroke="#111318"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* --- play button --- */}
        <circle
          className="m hpl"
          cx="390"
          cy="118"
          r="24"
          fill="#1677f2"
          style={{ filter: "drop-shadow(0 4px 10px rgba(22,119,242,0.3))" }}
        />
        <g transform="translate(382, 106)">
          <g className="m hpl">
            <path d="M3 2v20l15-10z" fill="#ffffff" />
          </g>
        </g>

        {/* --- search bar --- */}
        <g className="m srch">
          <rect x="20" y="160" width="390" height="52" rx="14" fill="#e4e6ed" />
          <g transform="translate(42, 178)" fill="none" stroke="#8a8c95" strokeWidth="2" strokeLinecap="round">
            <circle cx="8" cy="8" r="6" />
            <path d="m13 13 4 4" />
          </g>
          <text x="76" y="192" fontSize="16" fontWeight="500" fill="#8a8c95">
            Search words
          </text>
        </g>

        {/* --- 8 word cards --- */}
        {PAIRS.map((pair, i) => {
          const y = CARD_TOP + i * (CARD_H + CARD_GAP);
          const cls = `m cd${i}`;
          return (
            <g key={pair.en} className={cls}>
              {/* card bg */}
              <rect
                x={CARD_X}
                y={y}
                width={CARD_W}
                height={CARD_H}
                rx="14"
                fill="#ffffff"
                style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.04))" }}
              />
              {/* green status dot */}
              <circle cx={CARD_X + 18} cy={y + CARD_H / 2} r="4.5" fill="#22C55E" />
              {/* English (bold) */}
              <text
                x={CARD_X + 36}
                y={y + 28}
                fontSize="17"
                fontWeight="800"
                fill="#111318"
                style={{ letterSpacing: "-0.01em" }}
              >
                {pair.en}
              </text>
              {/* Ukrainian sub */}
              <text
                x={CARD_X + 36}
                y={y + 50}
                fontSize="14"
                fontWeight="400"
                fill="#8a8c95"
              >
                {pair.uk}
              </text>

              {/* edit pencil */}
              <g transform={`translate(${CARD_X + 254}, ${y + 22})`}>
                <path
                  d="M2 18l1-4L14 3l3 3L6 17l-4 1z"
                  fill="none"
                  stroke="#111318"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path d="M12 5l3 3" stroke="#111318" strokeWidth="1.8" strokeLinecap="round" />
              </g>

              {/* red trash */}
              <g transform={`translate(${CARD_X + 298}, ${y + 22})`} fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 5h16" />
                <path d="M7 5V3h8v2" />
                <path d="M5 5l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
                <path d="M9 10v7" />
                <path d="M13 10v7" />
              </g>

              {/* drag handle */}
              <g transform={`translate(${CARD_X + 342}, ${y + 28})`} stroke="#A8A8A2" strokeWidth="2" strokeLinecap="round">
                <path d="M0 4h20" />
                <path d="M0 10h20" />
              </g>
            </g>
          );
        })}

        {/* --- FAB (floating action button) --- */}
        <rect
          className="m fab"
          x="340"
          y="820"
          width="60"
          height="60"
          rx="16"
          fill="#1677f2"
          style={{ filter: "drop-shadow(0 6px 14px rgba(22,119,242,0.35))" }}
        />
        <g transform="translate(360, 840)">
          <g className="m fab">
            <path
              d="M10 2v16M2 10h16"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* --- home indicator (static) --- */}
        <rect x="138" y="913" width="154" height="5" rx="3" fill="#111318" />
      </svg>
    </div>
  );
}
