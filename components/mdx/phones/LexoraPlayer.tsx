"use client";

import { useEffect, useRef } from "react";

const CSS = `
  .lx-player .m {
    opacity: 0;
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes lx-slide-down {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lx-slide-right {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes lx-scale-in {
    from { opacity: 0; transform: scale(0.4); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes lx-rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lx-scale-x {
    from { opacity: 0; transform: scaleX(0); }
    to   { opacity: 1; transform: scaleX(1); }
  }
  @keyframes lx-hero {
    from { opacity: 0; transform: scale(0.3) rotate(-45deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }

  .lx-player.lx-play .hbg  { animation-name: lx-slide-down;  animation-delay: 0.00s; }
  .lx-player.lx-play .hbk  { animation-name: lx-slide-right; animation-delay: 0.06s; }
  .lx-player.lx-play .htl  { animation-name: lx-slide-right; animation-delay: 0.10s; transform-origin: 0% 50%; }
  .lx-player.lx-play .hic  { animation-name: lx-scale-in;    animation-delay: 0.16s; }
  .lx-player.lx-play .trl  { animation-name: lx-rise;        animation-delay: 0.22s; }
  .lx-player.lx-play .cnt  { animation-name: lx-rise;        animation-delay: 0.26s; }
  .lx-player.lx-play .prg  { animation-name: lx-scale-x;     animation-delay: 0.32s; transform-origin: 0% 50%; }
  .lx-player.lx-play .prgf { animation-name: lx-scale-x;     animation-delay: 0.52s; transform-origin: 0% 50%; animation-duration: 0.4s; }
  .lx-player.lx-play .cd0  { animation-name: lx-scale-in;    animation-delay: 0.60s; animation-duration: 0.55s; }
  .lx-player.lx-play .spk  { animation-name: lx-scale-in;    animation-delay: 0.78s; }
  .lx-player.lx-play .ftx  { animation-name: lx-rise;        animation-delay: 0.88s; }
  .lx-player.lx-play .sub  { animation-name: lx-rise;        animation-delay: 1.00s; }
  .lx-player.lx-play .prv  { animation-name: lx-scale-in;    animation-delay: 1.14s; }
  .lx-player.lx-play .nxt  { animation-name: lx-scale-in;    animation-delay: 1.18s; }
  .lx-player.lx-play .ply  { animation-name: lx-hero;        animation-delay: 1.24s; animation-duration: 0.6s; }

  @media (prefers-reduced-motion: reduce) {
    .lx-player .m {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

export function LexoraPlayer() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  const play = () => {
    const el = wrapperRef.current;
    if (!el) return;
    el.classList.remove("lx-play");
    // Force reflow so the next add restarts every @keyframes.
    void el.offsetWidth;
    el.classList.add("lx-play");
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
      className="lx-player relative w-full overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <svg
        viewBox="0 0 430 934"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Lexora Now Playing — Follow up track card with 1 of 8 progress and large play/pause control, lock-screen-playable podcast-style player"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          background: "#f4f5fa",
          fontFamily: "Manrope, Inter, -apple-system, 'Helvetica Neue', sans-serif",
          color: "#111318",
        }}
      >
        {/* --- static section bg (gray card behind header + progress) --- */}
        <rect x="0" y="140" width="430" height="100" fill="#eef0f5" />

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

        {/* --- header: back chevron (position wrapper + animated inner) --- */}
        <g transform="translate(24, 88)">
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
          x="68"
          y="110"
          fontSize="20"
          fontWeight="800"
          fill="#111318"
          style={{ letterSpacing: "-0.01em" }}
        >
          Now Playing
        </text>

        {/* --- settings mixer --- */}
        <g transform="translate(388, 95)">
          <g className="m hic">
            <g fill="none" stroke="#111318" strokeWidth="2.2" strokeLinecap="round">
              <path d="M4 7h8" />
              <path d="M16 7h4" />
              <circle cx="14" cy="7" r="2" fill="#111318" />
              <path d="M4 15h4" />
              <path d="M12 15h8" />
              <circle cx="10" cy="15" r="2" fill="#111318" />
            </g>
          </g>
        </g>

        {/* --- Track label + 1/8 counter --- */}
        <text className="m trl" x="28" y="180" fontSize="14" fontWeight="500" fill="#8a8c95">
          Track 1
        </text>
        <text
          className="m cnt"
          x="402"
          y="180"
          fontSize="14"
          fontWeight="500"
          fill="#8a8c95"
          textAnchor="end"
        >
          1 / 8
        </text>

        {/* --- progress bar track + fill --- */}
        <rect className="m prg" x="16" y="206" width="398" height="5" rx="2.5" fill="#dadde6" />
        <rect className="m prgf" x="16" y="206" width="56" height="5" rx="2.5" fill="#1677f2" />

        {/* --- card body --- */}
        <g className="m cd0">
          <rect
            x="37"
            y="465"
            width="356"
            height="210"
            rx="20"
            fill="#ffffff"
            style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.05))" }}
          />
        </g>

        {/* --- speaker circle --- */}
        <circle className="m spk" cx="215" cy="515" r="26" fill="#e6effd" />

        {/* --- speaker icon --- */}
        <g transform="translate(201, 502)">
          <g className="m spk">
            <path d="M3 9v6h4l5 5V4L7 9H3z" fill="#1677f2" />
            <path
              d="M15.5 8.5a4 4 0 0 1 0 7"
              fill="none"
              stroke="#1677f2"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M18 6a7 7 0 0 1 0 12"
              fill="none"
              stroke="#1677f2"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* --- "Follow up" + "уточнити" --- */}
        <text
          className="m ftx"
          x="215"
          y="602"
          fontSize="26"
          fontWeight="800"
          fill="#111318"
          textAnchor="middle"
          style={{ letterSpacing: "-0.01em" }}
        >
          Follow up
        </text>
        <text
          className="m sub"
          x="215"
          y="640"
          fontSize="16"
          fontWeight="400"
          fill="#8a8c95"
          textAnchor="middle"
        >
          уточнити
        </text>

        {/* --- prev button --- */}
        <circle className="m prv" cx="130" cy="810" r="26" fill="#eef0f5" />
        <g transform="translate(118, 798)">
          <g className="m prv">
            <path d="M20 4v16L10 12z" fill="#111318" />
            <rect x="7" y="4" width="2.4" height="16" rx="1" fill="#111318" />
          </g>
        </g>

        {/* --- next button --- */}
        <circle className="m nxt" cx="300" cy="810" r="26" fill="#eef0f5" />
        <g transform="translate(286, 798)">
          <g className="m nxt">
            <path d="M4 4v16l10-8z" fill="#111318" />
            <rect x="18" y="4" width="2.4" height="16" rx="1" fill="#111318" />
          </g>
        </g>

        {/* --- play button (hero: scale + rotate) --- */}
        <circle
          className="m ply"
          cx="215"
          cy="810"
          r="40"
          fill="#1677f2"
          style={{ filter: "drop-shadow(0 6px 14px rgba(22,119,242,0.35))" }}
        />
        <g className="m ply">
          <rect x="204" y="792" width="5" height="36" rx="2" fill="#ffffff" />
          <rect x="217" y="792" width="5" height="36" rx="2" fill="#ffffff" />
        </g>

        {/* --- home indicator (static) --- */}
        <rect x="138" y="913" width="154" height="5" rx="3" fill="#111318" />
      </svg>
    </div>
  );
}
