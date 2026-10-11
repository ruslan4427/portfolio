"use client";

import { useEffect, useRef } from "react";

const CSS = `
  .lf-profile .m {
    opacity: 0;
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes lf-slide-down {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lf-scale-in {
    from { opacity: 0; transform: scale(0.4); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes lf-rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lf-hero {
    from { opacity: 0; transform: scale(0.3) rotate(-45deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }

  .lf-profile.lf-play .hbg  { animation-name: lf-slide-down; animation-delay: 0.00s; }
  .lf-profile.lf-play .ttl  { animation-name: lf-slide-down; animation-delay: 0.08s; }
  .lf-profile.lf-play .avb  { animation-name: lf-hero;       animation-delay: 0.20s; animation-duration: 0.6s; }
  .lf-profile.lf-play .avi  { animation-name: lf-hero;       animation-delay: 0.20s; animation-duration: 0.6s; }
  .lf-profile.lf-play .edb  { animation-name: lf-scale-in;   animation-delay: 0.60s; }
  .lf-profile.lf-play .edi  { animation-name: lf-scale-in;   animation-delay: 0.60s; }
  .lf-profile.lf-play .usr  { animation-name: lf-rise;       animation-delay: 0.70s; }
  .lf-profile.lf-play .hnd  { animation-name: lf-rise;       animation-delay: 0.78s; }
  .lf-profile.lf-play .st1  { animation-name: lf-rise;       animation-delay: 0.88s; }
  .lf-profile.lf-play .st1i { animation-name: lf-rise;       animation-delay: 0.88s; }
  .lf-profile.lf-play .st2  { animation-name: lf-rise;       animation-delay: 0.92s; }
  .lf-profile.lf-play .st2i { animation-name: lf-rise;       animation-delay: 0.92s; }
  .lf-profile.lf-play .pbr  { animation-name: lf-rise;       animation-delay: 1.02s; }
  .lf-profile.lf-play .pbri { animation-name: lf-rise;       animation-delay: 1.02s; }
  .lf-profile.lf-play .grp  { animation-name: lf-rise;       animation-delay: 1.14s; }
  .lf-profile.lf-play .grpi { animation-name: lf-rise;       animation-delay: 1.14s; }
  .lf-profile.lf-play .sgn  { animation-name: lf-rise;       animation-delay: 1.26s; }
  .lf-profile.lf-play .sgni { animation-name: lf-rise;       animation-delay: 1.26s; }
  .lf-profile.lf-play .tab  { animation-name: lf-rise;       animation-delay: 1.38s; }
  .lf-profile.lf-play .tabi { animation-name: lf-rise;       animation-delay: 1.38s; }

  @media (prefers-reduced-motion: reduce) {
    .lf-profile .m {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

export function LexoraProfile() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  const play = () => {
    const el = wrapperRef.current;
    if (!el) return;
    el.classList.remove("lf-play");
    // Force reflow so the next add restarts every @keyframes.
    void el.offsetWidth;
    el.classList.add("lf-play");
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
      className="lf-profile relative w-full overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <svg
        viewBox="0 0 430 934"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Lexora Settings — user tast1 profile with avatar, stats (3 Playlists, 22 Words), Playback Defaults, support links, Sign Out, and Profile tab active"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          background: "#ffffff",
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

        {/* --- Settings title --- */}
        <text
          className="m ttl"
          x="215"
          y="100"
          fontSize="20"
          fontWeight="800"
          fill="#111318"
          textAnchor="middle"
          style={{ letterSpacing: "-0.01em" }}
        >
          Settings
        </text>

        {/* --- avatar square (big rounded tile) --- */}
        <rect
          className="m avb"
          x="165"
          y="140"
          width="100"
          height="100"
          rx="22"
          fill="#e6effd"
        />

        {/* --- avatar person icon (position wrapper + animated inner) --- */}
        <g transform="translate(197, 168)">
          <g className="m avi">
            {/* head */}
            <circle cx="18" cy="13" r="8.5" fill="#1677f2" />
            {/* shoulders */}
            <path
              d="M2 44c0-8.8 7.2-16 16-16s16 7.2 16 16v1H2z"
              fill="#1677f2"
            />
          </g>
        </g>

        {/* --- edit badge circle --- */}
        <circle className="m edb" cx="272" cy="247" r="16" fill="#1677f2" />

        {/* --- edit badge pencil icon --- */}
        <g transform="translate(263, 238)">
          <g className="m edi">
            <path
              d="M12.5 2a1.6 1.6 0 0 1 2.2 2.2L6.5 12.5l-2.6.6.6-2.6z"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* --- username --- */}
        <text
          className="m usr"
          x="215"
          y="294"
          fontSize="24"
          fontWeight="800"
          fill="#111318"
          textAnchor="middle"
          style={{ letterSpacing: "-0.01em" }}
        >
          tast1
        </text>

        {/* --- handle --- */}
        <text
          className="m hnd"
          x="215"
          y="322"
          fontSize="15"
          fontWeight="400"
          fill="#8a8c95"
          textAnchor="middle"
        >
          @tast1
        </text>

        {/* --- stat card 1: Playlists --- */}
        <rect
          className="m st1"
          x="24"
          y="358"
          width="186"
          height="110"
          rx="16"
          fill="#f4f5fa"
        />
        {/* stat card 1 icon: music-notes list (position wrapper + animated inner) */}
        <g transform="translate(100, 376)">
          <g className="m st1i">
            {/* stacked list bars */}
            <rect x="0" y="0" width="18" height="2.4" rx="1.2" fill="#1677f2" />
            <rect x="0" y="6" width="14" height="2.4" rx="1.2" fill="#1677f2" />
            <rect x="0" y="12" width="10" height="2.4" rx="1.2" fill="#1677f2" />
            {/* play triangle */}
            <path d="M22 1v12l9-6z" fill="#1677f2" />
          </g>
        </g>
        <text
          className="m st1"
          x="117"
          y="428"
          fontSize="28"
          fontWeight="800"
          fill="#111318"
          textAnchor="middle"
          style={{ letterSpacing: "-0.01em" }}
        >
          3
        </text>
        <text
          className="m st1"
          x="117"
          y="453"
          fontSize="15"
          fontWeight="500"
          fill="#8a8c95"
          textAnchor="middle"
        >
          Playlists
        </text>

        {/* --- stat card 2: Words --- */}
        <rect
          className="m st2"
          x="220"
          y="358"
          width="186"
          height="110"
          rx="16"
          fill="#f4f5fa"
        />
        {/* stat card 2 icon: translate (文A) */}
        <g transform="translate(293, 376)">
          <g className="m st2i">
            <text
              x="0"
              y="14"
              fontSize="17"
              fontWeight="700"
              fill="#1677f2"
              fontFamily="Manrope, Inter, sans-serif"
            >
              文
            </text>
            <text
              x="19"
              y="18"
              fontSize="13"
              fontWeight="700"
              fill="#1677f2"
              fontFamily="Manrope, Inter, sans-serif"
            >
              A
            </text>
          </g>
        </g>
        <text
          className="m st2"
          x="313"
          y="428"
          fontSize="28"
          fontWeight="800"
          fill="#111318"
          textAnchor="middle"
          style={{ letterSpacing: "-0.01em" }}
        >
          22
        </text>
        <text
          className="m st2"
          x="313"
          y="453"
          fontSize="15"
          fontWeight="500"
          fill="#8a8c95"
          textAnchor="middle"
        >
          Words
        </text>

        {/* --- Playback Defaults row --- */}
        <rect
          className="m pbr"
          x="24"
          y="490"
          width="382"
          height="60"
          rx="16"
          fill="#f4f5fa"
        />
        {/* sliders icon */}
        <g transform="translate(44, 509)">
          <g className="m pbri">
            <g fill="none" stroke="#111318" strokeWidth="1.9" strokeLinecap="round">
              <path d="M2 5h7" />
              <path d="M13 5h7" />
              <circle cx="11" cy="5" r="2" fill="#111318" />
              <path d="M2 12h12" />
              <path d="M18 12h2" />
              <circle cx="16" cy="12" r="2" fill="#111318" />
              <path d="M2 19h5" />
              <path d="M11 19h9" />
              <circle cx="9" cy="19" r="2" fill="#111318" />
            </g>
          </g>
        </g>
        <text
          className="m pbr"
          x="84"
          y="526"
          fontSize="16"
          fontWeight="600"
          fill="#111318"
        >
          Playback Defaults
        </text>
        {/* chevron right */}
        <g transform="translate(378, 512)">
          <g className="m pbri">
            <path
              d="m2 2 7 7-7 7"
              fill="none"
              stroke="#8a8c95"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* --- grouped list card (Contact / Privacy / Terms) --- */}
        <rect
          className="m grp"
          x="24"
          y="570"
          width="382"
          height="192"
          rx="16"
          fill="#f4f5fa"
        />
        {/* hairline 1 */}
        <line
          className="m grp"
          x1="56"
          y1="634"
          x2="400"
          y2="634"
          stroke="#dadde6"
          strokeWidth="1"
        />
        {/* hairline 2 */}
        <line
          className="m grp"
          x1="56"
          y1="698"
          x2="400"
          y2="698"
          stroke="#dadde6"
          strokeWidth="1"
        />

        {/* row 1: Contact Support — mail icon */}
        <g transform="translate(44, 591)">
          <g className="m grpi">
            <rect
              x="0"
              y="2"
              width="22"
              height="16"
              rx="2.5"
              fill="none"
              stroke="#111318"
              strokeWidth="1.8"
            />
            <path
              d="M0 4 11 12 22 4"
              fill="none"
              stroke="#111318"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
        <text
          className="m grp"
          x="84"
          y="608"
          fontSize="16"
          fontWeight="600"
          fill="#111318"
        >
          Contact Support
        </text>
        <g transform="translate(378, 594)">
          <g className="m grpi">
            <path
              d="m2 2 7 7-7 7"
              fill="none"
              stroke="#8a8c95"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* row 2: Privacy Policy — shield icon */}
        <g transform="translate(45, 655)">
          <g className="m grpi">
            <path
              d="M11 1 1 4v7c0 5 4 8.5 10 10 6-1.5 10-5 10-10V4z"
              fill="none"
              stroke="#111318"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="11" cy="9" r="0.9" fill="#111318" />
            <path d="M11 11.5v3" stroke="#111318" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </g>
        <text
          className="m grp"
          x="84"
          y="672"
          fontSize="16"
          fontWeight="600"
          fill="#111318"
        >
          Privacy Policy
        </text>
        <g transform="translate(378, 658)">
          <g className="m grpi">
            <path
              d="m2 2 7 7-7 7"
              fill="none"
              stroke="#8a8c95"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* row 3: Terms of Service — document icon */}
        <g transform="translate(46, 719)">
          <g className="m grpi">
            <path
              d="M2 1h11l5 5v15H2z"
              fill="none"
              stroke="#111318"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M13 1v5h5" fill="none" stroke="#111318" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M5 11h10M5 15h10M5 18h6" stroke="#111318" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </g>
        <text
          className="m grp"
          x="84"
          y="737"
          fontSize="16"
          fontWeight="600"
          fill="#111318"
        >
          Terms of Service
        </text>
        <g transform="translate(378, 723)">
          <g className="m grpi">
            <path
              d="m2 2 7 7-7 7"
              fill="none"
              stroke="#8a8c95"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* --- Sign Out card --- */}
        <rect
          className="m sgn"
          x="24"
          y="782"
          width="382"
          height="60"
          rx="16"
          fill="#f4f5fa"
        />
        {/* logout icon */}
        <g transform="translate(44, 801)">
          <g className="m sgni">
            <path
              d="M9 2H2v20h7"
              fill="none"
              stroke="#111318"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 7l5 5-5 5"
              fill="none"
              stroke="#111318"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 12H8"
              fill="none"
              stroke="#111318"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
        <text
          className="m sgn"
          x="84"
          y="818"
          fontSize="16"
          fontWeight="600"
          fill="#111318"
        >
          Sign Out
        </text>
        <g transform="translate(378, 804)">
          <g className="m sgni">
            <path
              d="m2 2 7 7-7 7"
              fill="none"
              stroke="#8a8c95"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* --- tab bar hairline --- */}
        <line
          className="m tab"
          x1="0"
          y1="858"
          x2="430"
          y2="858"
          stroke="#eef0f5"
          strokeWidth="1"
        />

        {/* Playlists tab (inactive) — icon */}
        <g transform="translate(136, 870)">
          <g className="m tabi">
            {/* stacked playlist tile icon */}
            <rect x="0" y="4" width="22" height="16" rx="3" fill="none" stroke="#8a8c95" strokeWidth="1.8" />
            <path d="M3 4V2h22v16h-2" fill="none" stroke="#8a8c95" strokeWidth="1.8" strokeLinejoin="round" />
            {/* music note inside */}
            <path d="M8 10v6" stroke="#8a8c95" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="7" cy="16" r="1.6" fill="#8a8c95" />
            <path d="M8 10h5" stroke="#8a8c95" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        </g>
        <text
          className="m tab"
          x="156"
          y="906"
          fontSize="12"
          fontWeight="500"
          fill="#8a8c95"
          textAnchor="middle"
        >
          Playlists
        </text>

        {/* Profile tab (ACTIVE) — blue pill + icon + label */}
        <rect
          className="m tab"
          x="247"
          y="866"
          width="58"
          height="32"
          rx="16"
          fill="#e6effd"
        />
        <g transform="translate(265, 872)">
          <g className="m tabi">
            {/* person icon */}
            <circle cx="11" cy="7" r="4.5" fill="#1677f2" />
            <path d="M2 20c0-5 4-9 9-9s9 4 9 9z" fill="#1677f2" />
          </g>
        </g>
        <text
          className="m tab"
          x="276"
          y="906"
          fontSize="12"
          fontWeight="600"
          fill="#1677f2"
          textAnchor="middle"
        >
          Profile
        </text>

        {/* --- home indicator (static) --- */}
        <rect x="138" y="920" width="154" height="5" rx="3" fill="#111318" />
      </svg>
    </div>
  );
}
