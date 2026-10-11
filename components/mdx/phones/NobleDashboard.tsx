"use client";

import { useEffect, useRef } from "react";

const CSS = `
  .nd-root .m {
    opacity: 0;
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes nd-slide-right {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes nd-scale-in {
    from { opacity: 0; transform: scale(0.4); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes nd-rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes nd-scale-x {
    from { opacity: 0; transform: scaleX(0); }
    to   { opacity: 1; transform: scaleX(1); }
  }
  @keyframes nd-hero {
    from { opacity: 0; transform: scale(0.92); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* Animation names are GATED behind .nd-play so classList toggle restarts them. */
  .nd-root.nd-play .n-logo    { animation-name: nd-slide-right; animation-delay: 0.00s; transform-origin: 0% 50%; }
  .nd-root.nd-play .n-avatar  { animation-name: nd-scale-in;    animation-delay: 0.06s; }
  .nd-root.nd-play .n-lang    { animation-name: nd-scale-in;    animation-delay: 0.10s; }
  .nd-root.nd-play .n-signout { animation-name: nd-rise;        animation-delay: 0.14s; }
  .nd-root.nd-play .n-hair    { animation-name: nd-scale-x;     animation-delay: 0.20s; transform-origin: 0% 50%; }
  .nd-root.nd-play .n-tabA    { animation-name: nd-scale-in;    animation-delay: 0.28s; }
  .nd-root.nd-play .n-tab1    { animation-name: nd-rise;        animation-delay: 0.34s; }
  .nd-root.nd-play .n-tab2    { animation-name: nd-rise;        animation-delay: 0.38s; }
  .nd-root.nd-play .n-tab3    { animation-name: nd-rise;        animation-delay: 0.42s; }
  .nd-root.nd-play .n-hero    { animation-name: nd-hero;        animation-delay: 0.52s; animation-duration: 0.6s; }
  .nd-root.nd-play .n-title   { animation-name: nd-rise;        animation-delay: 0.78s; }
  .nd-root.nd-play .n-pct     { animation-name: nd-rise;        animation-delay: 0.78s; }
  .nd-root.nd-play .n-sub     { animation-name: nd-rise;        animation-delay: 0.84s; }
  .nd-root.nd-play .n-prgT    { animation-name: nd-scale-x;     animation-delay: 0.86s; transform-origin: 0% 50%; animation-duration: 0.5s; }
  .nd-root.nd-play .n-prgF    { animation-name: nd-scale-x;     animation-delay: 0.92s; transform-origin: 0% 50%; animation-duration: 0.5s; }
  .nd-root.nd-play .n-step1   { animation-name: nd-rise;        animation-delay: 1.08s; }
  .nd-root.nd-play .n-step2   { animation-name: nd-rise;        animation-delay: 1.13s; }
  .nd-root.nd-play .n-step3   { animation-name: nd-rise;        animation-delay: 1.20s; }
  .nd-root.nd-play .n-copy    { animation-name: nd-scale-in;    animation-delay: 1.32s; }
  .nd-root.nd-play .n-stat1   { animation-name: nd-rise;        animation-delay: 1.42s; }
  .nd-root.nd-play .n-stat2   { animation-name: nd-rise;        animation-delay: 1.52s; }
  .nd-root.nd-play .n-stat3   { animation-name: nd-rise;        animation-delay: 1.62s; }
  .nd-root.nd-play .n-stat4   { animation-name: nd-rise;        animation-delay: 1.72s; }
  .nd-root.nd-play .n-book    { animation-name: nd-rise;        animation-delay: 1.82s; }
  .nd-root.nd-play .n-feed    { animation-name: nd-scale-in;    animation-delay: 1.95s; }

  @media (prefers-reduced-motion: reduce) {
    .nd-root .m { animation: none !important; opacity: 1 !important; transform: none !important; }
  }
`;

export function NobleDashboard() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  const play = () => {
    const el = wrapperRef.current;
    if (!el) return;
    el.classList.remove("nd-play");
    // Force reflow so the next add restarts every @keyframes.
    void el.offsetWidth;
    el.classList.add("nd-play");
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

  // Palette
  const PAGE = "#0f0a04";
  const CARD = "#1a140a";
  const GOLD = "#c6a44a";
  const DARK_GOLD = "#8a7230";
  const MUTED = "#a89778";
  const STRIKE = "#6b6250";
  const WHITE = "#ffffff";
  const HAIR = "rgba(255,255,255,0.08)";
  const SERIF = `"Playfair Display", Georgia, serif`;
  const SANS = `"Inter", sans-serif`;

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleEnter}
      className="nd-root relative w-full overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <svg
        viewBox="0 0 430 934"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Noble admin dashboard — mobile onboarding card at 67% with two checked steps, booking-link copy prompt, four stat cards, and bottom bookings panel"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          background: PAGE,
          fontFamily: SANS,
          color: WHITE,
        }}
      >
        {/* ---------- TOP BAR ---------- */}
        {/* Noble scissor logo + wordmark */}
        <g transform="translate(28, 58)">
          <g className="m n-logo">
            {/* scissors glyph — two circles + crossed blades */}
            <g stroke={GOLD} strokeWidth="1.8" fill="none">
              <circle cx="6" cy="18" r="4" />
              <circle cx="6" cy="6" r="4" />
              <path d="M10 8 L26 20" strokeLinecap="round" />
              <path d="M10 16 L26 4" strokeLinecap="round" />
            </g>
            <text
              x="36"
              y="18"
              fontFamily={SERIF}
              fontSize="22"
              fontWeight="600"
              fill={GOLD}
              style={{ letterSpacing: "0.01em" }}
            >
              Noble
            </text>
          </g>
        </g>

        {/* divider pipe */}
        <line x1="128" y1="48" x2="128" y2="78" stroke={HAIR} strokeWidth="1" />

        {/* avatar circle — gold with white silhouette */}
        <g transform="translate(144, 43)">
          <g className="m n-avatar">
            <circle cx="20" cy="20" r="20" fill={GOLD} />
            {/* head */}
            <circle cx="20" cy="16" r="6" fill={WHITE} />
            {/* shoulders */}
            <path d="M8 36 C 8 27, 32 27, 32 36 Z" fill={WHITE} />
          </g>
        </g>

        {/* EN/ES pill */}
        <g transform="translate(196, 50)">
          <g className="m n-lang">
            <rect
              x="0"
              y="0"
              width="68"
              height="26"
              rx="13"
              fill="none"
              stroke={HAIR}
              strokeWidth="1"
            />
            <text
              x="12"
              y="17"
              fontSize="12"
              fontWeight="600"
              fill={WHITE}
            >
              EN
            </text>
            <text x="34" y="17" fontSize="12" fill={MUTED}>
              /
            </text>
            <text x="42" y="17" fontSize="12" fontWeight="500" fill={MUTED}>
              ES
            </text>
          </g>
        </g>

        {/* Sign out */}
        <text
          className="m n-signout"
          x="402"
          y="68"
          fontSize="13"
          fill={MUTED}
          textAnchor="end"
        >
          Sign out
        </text>

        {/* ---------- HAIRLINE ---------- */}
        <line
          className="m n-hair"
          x1="0"
          y1="96"
          x2="430"
          y2="96"
          stroke={HAIR}
          strokeWidth="1"
        />

        {/* ---------- TAB ROW ---------- */}
        {/* Overview active pill */}
        <g transform="translate(24, 118)">
          <g className="m n-tabA">
            <rect x="0" y="0" width="110" height="38" rx="19" fill={GOLD} />
            <text
              x="55"
              y="25"
              fontSize="14"
              fontWeight="600"
              fill="#000"
              textAnchor="middle"
            >
              Overview
            </text>
          </g>
        </g>

        {/* Calendar */}
        <text
          className="m n-tab1"
          x="156"
          y="143"
          fontSize="14"
          fontWeight="500"
          fill={WHITE}
        >
          Calendar
        </text>

        {/* Staff */}
        <text
          className="m n-tab2"
          x="246"
          y="143"
          fontSize="14"
          fontWeight="500"
          fill={WHITE}
        >
          Staff
        </text>

        {/* Services */}
        <text
          className="m n-tab3"
          x="306"
          y="143"
          fontSize="14"
          fontWeight="500"
          fill={WHITE}
        >
          Services
        </text>

        {/* ---------- GET STARTED CARD ---------- */}
        <g className="m n-hero">
          <rect
            x="20"
            y="186"
            width="390"
            height="334"
            rx="18"
            fill={CARD}
            stroke={DARK_GOLD}
            strokeWidth="1"
            strokeOpacity="0.55"
          />
        </g>

        {/* Get started title */}
        <text
          className="m n-title"
          x="40"
          y="230"
          fontFamily={SERIF}
          fontSize="26"
          fontWeight="500"
          fill={WHITE}
        >
          Get started
        </text>

        {/* 67% */}
        <text
          className="m n-pct"
          x="390"
          y="236"
          fontFamily={SERIF}
          fontSize="34"
          fontWeight="600"
          fill={GOLD}
          textAnchor="end"
        >
          67%
        </text>

        {/* 2 of 3 steps */}
        <text
          className="m n-sub"
          x="40"
          y="256"
          fontSize="13"
          fill={MUTED}
        >
          2 of 3 steps completed
        </text>

        {/* Progress bar — track + fill */}
        <rect
          className="m n-prgT"
          x="40"
          y="276"
          width="350"
          height="6"
          rx="3"
          fill="rgba(255,255,255,0.08)"
        />
        <rect
          className="m n-prgF"
          x="40"
          y="276"
          width="234"
          height="6"
          rx="3"
          fill={GOLD}
        />

        {/* Step 1 — Add your first service */}
        <g transform="translate(40, 304)">
          <g className="m n-step1">
            <circle cx="12" cy="12" r="11" fill={GOLD} />
            <path
              d="M6.5 12 L10.5 16 L17.5 8.5"
              fill="none"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x="34" y="17" fontSize="14" fill={STRIKE}>
              Add your first service
            </text>
            <line
              x1="34"
              y1="13"
              x2="196"
              y2="13"
              stroke={STRIKE}
              strokeWidth="1"
            />
          </g>
        </g>

        {/* Step 2 — Add a staff member */}
        <g transform="translate(40, 340)">
          <g className="m n-step2">
            <circle cx="12" cy="12" r="11" fill={GOLD} />
            <path
              d="M6.5 12 L10.5 16 L17.5 8.5"
              fill="none"
              stroke="#000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text x="34" y="17" fontSize="14" fill={STRIKE}>
              Add a staff member
            </text>
            <line
              x1="34"
              y1="13"
              x2="188"
              y2="13"
              stroke={STRIKE}
              strokeWidth="1"
            />
          </g>
        </g>

        {/* Step 3 — nested dark card */}
        <g className="m n-step3">
          <rect
            x="36"
            y="378"
            width="358"
            height="122"
            rx="14"
            fill="#120d05"
            stroke={HAIR}
            strokeWidth="1"
          />
          {/* outlined circle with "3" */}
          <circle
            cx="68"
            cy="412"
            r="12"
            fill="none"
            stroke={GOLD}
            strokeWidth="1.5"
          />
          <text
            x="68"
            y="417"
            fontSize="13"
            fontWeight="600"
            fill={GOLD}
            textAnchor="middle"
          >
            3
          </text>
          {/* Title */}
          <text
            x="92"
            y="408"
            fontSize="15"
            fontWeight="600"
            fill={WHITE}
          >
            Share your booking link
          </text>
          {/* Sub */}
          <text x="92" y="428" fontSize="12" fill={MUTED}>
            Copy and send to your clients
          </text>
        </g>

        {/* Copy link button */}
        <g transform="translate(56, 452)">
          <g className="m n-copy">
            <rect
              x="0"
              y="0"
              width="118"
              height="34"
              rx="17"
              fill="none"
              stroke={GOLD}
              strokeWidth="1.2"
            />
            <text
              x="18"
              y="22"
              fontSize="13"
              fontWeight="600"
              fill={GOLD}
            >
              Copy link
            </text>
            <path
              d="M86 17 L96 17 M92 13 L96 17 L92 21"
              fill="none"
              stroke={GOLD}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* ---------- 2x2 STAT GRID ---------- */}
        {/* Stat 1 — Staff members / 5 */}
        <g className="m n-stat1">
          <rect
            x="20"
            y="546"
            width="190"
            height="104"
            rx="16"
            fill={CARD}
            stroke={HAIR}
            strokeWidth="1"
          />
          <text x="40" y="580" fontSize="13" fill={MUTED}>
            Staff members
          </text>
          <text
            x="40"
            y="624"
            fontFamily={SERIF}
            fontSize="34"
            fontWeight="500"
            fill={WHITE}
          >
            5
          </text>
        </g>

        {/* Stat 2 — Services / 4 */}
        <g className="m n-stat2">
          <rect
            x="220"
            y="546"
            width="190"
            height="104"
            rx="16"
            fill={CARD}
            stroke={HAIR}
            strokeWidth="1"
          />
          <text x="240" y="580" fontSize="13" fill={MUTED}>
            Services
          </text>
          <text
            x="240"
            y="624"
            fontFamily={SERIF}
            fontSize="34"
            fontWeight="500"
            fill={WHITE}
          >
            4
          </text>
        </g>

        {/* Stat 3 — Status / Canceled */}
        <g className="m n-stat3">
          <rect
            x="20"
            y="662"
            width="190"
            height="104"
            rx="16"
            fill={CARD}
            stroke={HAIR}
            strokeWidth="1"
          />
          <text x="40" y="696" fontSize="13" fill={MUTED}>
            Status
          </text>
          <text
            x="40"
            y="736"
            fontSize="22"
            fontWeight="700"
            fill={WHITE}
          >
            Canceled
          </text>
        </g>

        {/* Stat 4 — Trial days left / 0 */}
        <g className="m n-stat4">
          <rect
            x="220"
            y="662"
            width="190"
            height="104"
            rx="16"
            fill={CARD}
            stroke={HAIR}
            strokeWidth="1"
          />
          <text x="240" y="696" fontSize="13" fill={MUTED}>
            Trial days left
          </text>
          <text
            x="240"
            y="740"
            fontFamily={SERIF}
            fontSize="34"
            fontWeight="600"
            fill={WHITE}
          >
            0
          </text>
        </g>

        {/* ---------- BOOKINGS CARD (bottom-cut) ---------- */}
        <g className="m n-book">
          <rect
            x="20"
            y="782"
            width="390"
            height="152"
            rx="16"
            fill={CARD}
            stroke={HAIR}
            strokeWidth="1"
          />
          {/* Bookings title */}
          <text
            x="40"
            y="818"
            fontFamily={SERIF}
            fontSize="22"
            fontWeight="500"
            fill={WHITE}
          >
            Bookings
          </text>
          {/* No bookings today */}
          <text x="40" y="846" fontSize="13" fill={MUTED}>
            No bookings today
          </text>
          {/* Upcoming tab pill */}
          <rect
            x="40"
            y="872"
            width="104"
            height="34"
            rx="17"
            fill="none"
            stroke={GOLD}
            strokeWidth="1.2"
          />
          <text
            x="92"
            y="893"
            fontSize="13"
            fontWeight="600"
            fill={GOLD}
            textAnchor="middle"
          >
            Upcoming
          </text>
        </g>

        {/* ---------- FEEDBACK FLOATING BUTTON ---------- */}
        <g transform="translate(286, 866)">
          <g className="m n-feed">
            <rect
              x="0"
              y="0"
              width="128"
              height="46"
              rx="23"
              fill="#211a0e"
              stroke={HAIR}
              strokeWidth="1"
            />
            {/* chat bubble icon */}
            <g transform="translate(16, 14)" stroke={MUTED} strokeWidth="1.5" fill="none">
              <path
                d="M2 4 C 2 2.5, 3 1.5, 4.5 1.5 L 15.5 1.5 C 17 1.5, 18 2.5, 18 4 L 18 11 C 18 12.5, 17 13.5, 15.5 13.5 L 9 13.5 L 5 17 L 5 13.5 L 4.5 13.5 C 3 13.5, 2 12.5, 2 11 Z"
                strokeLinejoin="round"
              />
            </g>
            <text
              x="46"
              y="29"
              fontSize="13"
              fontWeight="500"
              fill={MUTED}
            >
              Feedback
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
}
