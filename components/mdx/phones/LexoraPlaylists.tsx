"use client";

import { useEffect, useRef } from "react";

const CSS = `
  .lp-root .m {
    opacity: 0;
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes lp-slide-down {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lp-rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lp-rise-lg {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lp-fade {
    from { opacity: 0; }
    to   { opacity: 0.42; }
  }

  /* animation-name is GATED behind .lp-play so classList toggle restarts them */
  .lp-root.lp-play .status { animation-name: lp-slide-down; animation-delay: 0.00s; }
  .lp-root.lp-play .bgh    { animation-name: lp-rise;       animation-delay: 0.05s; }
  .lp-root.lp-play .bgs    { animation-name: lp-rise;       animation-delay: 0.10s; }
  .lp-root.lp-play .bgt    { animation-name: lp-rise;       animation-delay: 0.15s; }
  .lp-root.lp-play .bgc    { animation-name: lp-rise;       animation-delay: 0.20s; }
  .lp-root.lp-play .dim    { animation-name: lp-fade;       animation-delay: 0.26s; }
  .lp-root.lp-play .sheet  { animation-name: lp-rise-lg;    animation-delay: 0.30s; animation-duration: 0.6s; }
  .lp-root.lp-play .handle { animation-name: lp-rise;       animation-delay: 0.32s; }
  .lp-root.lp-play .ttl    { animation-name: lp-rise;       animation-delay: 0.40s; }
  .lp-root.lp-play .r1     { animation-name: lp-rise;       animation-delay: 0.52s; }
  .lp-root.lp-play .r2     { animation-name: lp-rise;       animation-delay: 0.62s; }
  .lp-root.lp-play .r3     { animation-name: lp-rise;       animation-delay: 0.72s; }
  .lp-root.lp-play .tabs   { animation-name: lp-rise;       animation-delay: 0.88s; }

  @media (prefers-reduced-motion: reduce) {
    .lp-root .m {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
    .lp-root .dim {
      opacity: 0.42 !important;
    }
  }
`;

export function LexoraPlaylists() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  const play = () => {
    const el = wrapperRef.current;
    if (!el) return;
    el.classList.remove("lp-play");
    // Force reflow so the next add restarts every @keyframes.
    void el.offsetWidth;
    el.classList.add("lp-play");
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
      className="lp-root relative w-full overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <svg
        viewBox="0 0 430 934"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Lexora New Playlist — bottom sheet over dimmed My Playlists background, offering Create manually / Generate with AI / Import"
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
        <g className="m status">
          <text x="58" y="42" fontSize="17" fontWeight="700" fill="#111">8:05</text>
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
          {/* battery — nearly empty, small sliver fill */}
          <g transform="translate(352, 32)">
            <rect x=".7" y=".7" width="21" height="10.6" rx="3" stroke="#111" strokeWidth="1.2" fill="none" />
            <rect x="2.4" y="2.4" width="3.4" height="7.2" rx="1" fill="#111" />
            <path d="M23.3 4.2v3.6" stroke="#111" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </g>

        {/* --- BACKGROUND CONTENT (My Playlists, visible through dim) --- */}

        {/* header: My Playlists h1 + big blue plus */}
        <g className="m bgh">
          <text
            x="28"
            y="105"
            fontSize="26"
            fontWeight="800"
            fill="#111318"
            style={{ letterSpacing: "-0.01em" }}
          >
            My Playlists
          </text>
          {/* big "+" icon on the right */}
          <g transform="translate(378, 90)" stroke="#1677f2" strokeWidth="3" strokeLinecap="round">
            <path d="M12 2v20" />
            <path d="M2 12h20" />
          </g>
        </g>

        {/* search bar */}
        <g className="m bgs">
          <rect x="22" y="140" width="386" height="54" rx="14" fill="#e5e7ee" />
          <g transform="translate(44, 160)" fill="none" stroke="#8a8c95" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="8" cy="8" r="7" />
            <path d="m13.5 13.5 4 4" />
          </g>
          <text x="76" y="175" fontSize="17" fontWeight="500" fill="#8a8c95">
            Search playlists
          </text>
        </g>

        {/* tabs: Vocabulary (selected) · Terminology */}
        <g className="m bgt">
          {/* track */}
          <rect x="22" y="214" width="386" height="54" rx="14" fill="#e5e7ee" />
          {/* selected pill */}
          <rect
            x="26"
            y="218"
            width="191"
            height="46"
            rx="12"
            fill="#f4f5fa"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.08))" }}
          />
          <text
            x="121"
            y="249"
            fontSize="18"
            fontWeight="800"
            fill="#111318"
            textAnchor="middle"
          >
            Vocabulary
          </text>
          <text
            x="314"
            y="249"
            fontSize="18"
            fontWeight="600"
            fill="#4a4c54"
            textAnchor="middle"
          >
            Terminology
          </text>
        </g>

        {/* playlist card (one row) */}
        <g className="m bgc">
          <rect x="22" y="296" width="386" height="104" rx="18" fill="#e5e7ee" />
          {/* music-notes icon tile */}
          <circle cx="70" cy="348" r="28" fill="#d2d6e0" />
          <g transform="translate(55, 332)" fill="none" stroke="#8a8c95" strokeWidth="2.2" strokeLinecap="round">
            <path d="M8 22V10l16-3v12" />
            <circle cx="8" cy="22" r="4" fill="#8a8c95" stroke="none" />
            <circle cx="24" cy="19" r="4" fill="#8a8c95" stroke="none" />
          </g>
          {/* big "1" title */}
          <text
            x="112"
            y="342"
            fontSize="22"
            fontWeight="800"
            fill="#111318"
          >
            1
          </text>
          {/* chip: 1 words */}
          <rect x="112" y="358" width="66" height="24" rx="7" fill="#cfe0fb" />
          <text x="145" y="375" fontSize="13" fontWeight="700" fill="#1677f2" textAnchor="middle">
            1 words
          </text>
          {/* chip: uk-UA */}
          <rect x="184" y="358" width="58" height="24" rx="7" fill="#d2d6e0" />
          <text x="213" y="375" fontSize="13" fontWeight="700" fill="#4a4c54" textAnchor="middle">
            uk-UA
          </text>
          {/* ~1 min */}
          <text x="250" y="375" fontSize="14" fontWeight="500" fill="#4a4c54">
            ~1 min
          </text>
          {/* small green flash badge */}
          <circle cx="332" cy="322" r="11" fill="#dff5e5" />
          <g transform="translate(327, 316)" fill="#22c55e">
            <path d="M6 0 1 7h4l-1 5 5-7H5z" />
          </g>
          {/* large blue play button */}
          <circle
            cx="370"
            cy="348"
            r="24"
            fill="#1677f2"
            style={{ filter: "drop-shadow(0 4px 10px rgba(22,119,242,0.3))" }}
          />
          <path d="M365 337 l12 11 -12 11 z" fill="#ffffff" />
        </g>

        {/* --- DIM OVERLAY (above background content, below sheet) --- */}
        <rect
          className="m dim"
          x="0"
          y="0"
          width="430"
          height="934"
          fill="#111318"
        />

        {/* --- BOTTOM SHEET --- */}
        <g className="m sheet">
          <path
            d="M 0 502 Q 0 474 28 474 L 402 474 Q 430 474 430 502 L 430 934 L 0 934 Z"
            fill="#ffffff"
          />
        </g>

        {/* drag handle pill */}
        <rect
          className="m handle"
          x="203"
          y="490"
          width="24"
          height="5"
          rx="2.5"
          fill="#c4c7d0"
        />

        {/* "New Playlist" title */}
        <text
          className="m ttl"
          x="28"
          y="538"
          fontSize="22"
          fontWeight="800"
          fill="#111318"
          style={{ letterSpacing: "-0.01em" }}
        >
          New Playlist
        </text>

        {/* --- Row 1: Create manually (pencil-plus icon) --- */}
        <g className="m r1">
          {/* icon tile */}
          <rect x="28" y="582" width="56" height="56" rx="14" fill="#e6effd" />
          {/* lines + plus */}
          <g transform="translate(42, 596)" fill="none" stroke="#1677f2" strokeWidth="2.2" strokeLinecap="round">
            <path d="M2 6h18" />
            <path d="M2 14h12" />
            <path d="M2 22h10" />
            <path d="M22 18v10" />
            <path d="M17 23h10" />
          </g>
          {/* title + sub */}
          <text x="104" y="608" fontSize="18" fontWeight="700" fill="#111318">
            Create manually
          </text>
          <text x="104" y="630" fontSize="15" fontWeight="400" fill="#8a8c95">
            Add word pairs one by one
          </text>
          {/* chevron */}
          <g transform="translate(388, 604)" fill="none" stroke="#8a8c95" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 2 7 7 -7 7" />
          </g>
        </g>

        {/* --- Row 2: Generate with AI (sparkles icon) --- */}
        <g className="m r2">
          <rect x="28" y="662" width="56" height="56" rx="14" fill="#e6effd" />
          {/* sparkles: big + small */}
          <g transform="translate(42, 676)" fill="#1677f2">
            <path d="M14 2 l2.4 5.6 L22 10 l-5.6 2.4 L14 18 l-2.4 -5.6 L6 10 l5.6 -2.4 Z" />
            <path d="M5 20 l1 2.4 L8.4 23.4 l-2.4 1 L5 26.8 l-1 -2.4 L1.6 23.4 l2.4 -1 Z" />
          </g>
          <text x="104" y="688" fontSize="18" fontWeight="700" fill="#111318">
            Generate with AI
          </text>
          <text x="104" y="710" fontSize="15" fontWeight="400" fill="#8a8c95">
            Let AI build a list from a topic
          </text>
          <g transform="translate(388, 684)" fill="none" stroke="#8a8c95" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 2 7 7 -7 7" />
          </g>
        </g>

        {/* --- Row 3: Import (file-up icon) --- */}
        <g className="m r3">
          <rect x="28" y="742" width="56" height="56" rx="14" fill="#e6effd" />
          {/* file-up icon */}
          <g transform="translate(46, 756)" fill="none" stroke="#1677f2" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
            <path d="M4 2 h10 l6 6 v18 a2 2 0 0 1 -2 2 H4 a2 2 0 0 1 -2 -2 V4 a2 2 0 0 1 2 -2 z" />
            <path d="M14 2 v6 h6" />
            {/* up arrow */}
            <path d="M11 22 v-7" />
            <path d="m8 18 3 -3 3 3" />
          </g>
          <text x="104" y="768" fontSize="18" fontWeight="700" fill="#111318">
            Import
          </text>
          <text x="104" y="790" fontSize="15" fontWeight="400" fill="#8a8c95">
            From CSV, TSV, Anki, or Google Sheets
          </text>
          <g transform="translate(388, 764)" fill="none" stroke="#8a8c95" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 2 7 7 -7 7" />
          </g>
        </g>

        {/* hairline separator above tab bar */}
        <line x1="0" y1="830" x2="430" y2="830" stroke="#eceef3" strokeWidth="1" />

        {/* --- BOTTOM TAB BAR --- */}
        <g className="m tabs">
          {/* Playlists tab — active (blue tile + icon + label) */}
          <rect x="118" y="844" width="92" height="48" rx="14" fill="#e6effd" />
          <g transform="translate(152, 854)" fill="none" stroke="#1677f2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 18 V6 l20 -3 v12" />
            <ellipse cx="4" cy="18" rx="4" ry="3.4" fill="#1677f2" stroke="none" />
            <ellipse cx="24" cy="15" rx="4" ry="3.4" fill="#1677f2" stroke="none" />
          </g>
          <text x="164" y="912" fontSize="13" fontWeight="700" fill="#1677f2" textAnchor="middle">
            Playlists
          </text>

          {/* Profile tab — inactive */}
          <g transform="translate(287, 854)" fill="none" stroke="#8a8c95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="14" cy="10" r="5" />
            <path d="M4 24 c0 -5 5 -9 10 -9 s10 4 10 9" />
          </g>
          <text x="301" y="912" fontSize="13" fontWeight="500" fill="#8a8c95" textAnchor="middle">
            Profile
          </text>
        </g>
      </svg>
    </div>
  );
}
