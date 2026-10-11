"use client";

import { useEffect, useRef } from "react";

const CSS = `
  .np-root .m {
    opacity: 0;
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes np-slide-down  { from { opacity:0; transform: translateY(-10px); } to { opacity:1; transform: translateY(0); } }
  @keyframes np-slide-right { from { opacity:0; transform: translateX(-10px); } to { opacity:1; transform: translateX(0); } }
  @keyframes np-scale-in    { from { opacity:0; transform: scale(0.4); }       to { opacity:1; transform: scale(1); } }
  @keyframes np-rise        { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform: translateY(0); } }
  @keyframes np-scale-x     { from { opacity:0; transform: scaleX(0); }        to { opacity:1; transform: scaleX(1); } }
  @keyframes np-hero        { from { opacity:0; transform: scale(0.3) rotate(-6deg); } to { opacity:1; transform: scale(1) rotate(0deg); } }

  .np-root.np-play .logo   { animation-name: np-slide-right; animation-delay: 0.00s; transform-origin: 0% 50%; }
  .np-root.np-play .lang   { animation-name: np-scale-in;    animation-delay: 0.08s; }
  .np-root.np-play .login  { animation-name: np-rise;        animation-delay: 0.12s; }
  .np-root.np-play .ctaTop { animation-name: np-scale-in;    animation-delay: 0.16s; }
  .np-root.np-play .hair   { animation-name: np-scale-x;     animation-delay: 0.22s; transform-origin: 0% 50%; }
  .np-root.np-play .title  { animation-name: np-rise;        animation-delay: 0.30s; }
  .np-root.np-play .body   { animation-name: np-rise;        animation-delay: 0.46s; }
  .np-root.np-play .toggle { animation-name: np-scale-in;    animation-delay: 0.58s; }
  .np-root.np-play .card   { animation-name: np-hero;        animation-delay: 0.70s; animation-duration: 0.6s; }
  .np-root.np-play .eyb1   { animation-name: np-rise;        animation-delay: 1.00s; }
  .np-root.np-play .plan   { animation-name: np-rise;        animation-delay: 1.06s; }
  .np-root.np-play .sub    { animation-name: np-rise;        animation-delay: 1.12s; }
  .np-root.np-play .price  { animation-name: np-rise;        animation-delay: 1.22s; }
  .np-root.np-play .cta    { animation-name: np-rise;        animation-delay: 1.32s; }
  .np-root.np-play .eyb2   { animation-name: np-rise;        animation-delay: 1.42s; }
  .np-root.np-play .check  { animation-name: np-rise;        animation-delay: 1.50s; }

  @media (prefers-reduced-motion: reduce) {
    .np-root .m { animation: none !important; opacity: 1 !important; transform: none !important; }
  }
`;

export function NoblePricing() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  const play = () => {
    const el = wrapperRef.current;
    if (!el) return;
    el.classList.remove("np-play");
    // Force reflow so the next add restarts every @keyframes.
    void el.offsetWidth;
    el.classList.add("np-play");
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

  const serif = `"Playfair Display", Georgia, serif`;
  const sans = `"Inter", sans-serif`;

  return (
    <div
      ref={wrapperRef}
      onMouseEnter={handleEnter}
      className="np-root relative w-full overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <svg
        viewBox="0 0 430 934"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Noble pricing — mobile page with Simple, transparent pricing headline, Monthly/Yearly toggle, and Starter plan card at $15 per month"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          background: "#0f0a04",
          fontFamily: sans,
          color: "#ffffff",
        }}
      >
        {/* --- Top bar: logo (scissor + "Noble") --- */}
        <g transform="translate(24, 48)">
          <g className="m logo">
            {/* Scissor icon */}
            <g
              transform="translate(0, -8)"
              fill="none"
              stroke="#c6a44a"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="4" cy="4" r="3" />
              <circle cx="4" cy="14" r="3" />
              <path d="M7 6l16 10" />
              <path d="M7 12l16 -10" />
            </g>
            {/* "Noble" wordmark */}
            <text
              x="0"
              y="30"
              fontFamily={serif}
              fontSize="26"
              fontStyle="italic"
              fontWeight="500"
              fill="#c6a44a"
              style={{ letterSpacing: "0.01em" }}
            >
              Noble
            </text>
          </g>
        </g>

        {/* --- EN/ES language pill --- */}
        <g transform="translate(118, 32)">
          <g className="m lang">
            <rect
              x="0"
              y="0"
              width="76"
              height="36"
              rx="18"
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1"
            />
            {/* EN selected (gold circle) */}
            <circle cx="22" cy="18" r="14" fill="#c6a44a" />
            <text
              x="22"
              y="23"
              fontSize="12"
              fontWeight="700"
              fill="#0f0a04"
              textAnchor="middle"
            >
              EN
            </text>
            {/* ES unselected */}
            <text
              x="56"
              y="23"
              fontSize="12"
              fontWeight="500"
              fill="rgba(255,255,255,0.55)"
              textAnchor="middle"
            >
              ES
            </text>
          </g>
        </g>

        {/* --- Log in link --- */}
        <g className="m login">
          <text
            x="208"
            y="48"
            fontSize="13"
            fontWeight="500"
            fill="#ffffff"
          >
            Log
          </text>
          <text
            x="208"
            y="66"
            fontSize="13"
            fontWeight="500"
            fill="#ffffff"
          >
            in
          </text>
        </g>

        {/* --- Start free trial CTA (top-right, gold) --- */}
        <g className="m ctaTop">
          <rect
            x="254"
            y="26"
            width="162"
            height="76"
            rx="10"
            fill="#c6a44a"
          />
          <text
            x="268"
            y="58"
            fontSize="14"
            fontWeight="700"
            fill="#0f0a04"
          >
            Start free trial
          </text>
          <text
            x="268"
            y="82"
            fontSize="14"
            fontWeight="700"
            fill="#0f0a04"
          >
            →
          </text>
        </g>

        {/* --- Hairline divider --- */}
        <rect
          className="m hair"
          x="0"
          y="130"
          width="430"
          height="1"
          fill="rgba(255,255,255,0.08)"
        />

        {/* --- Centered display headline --- */}
        <g className="m title">
          <text
            x="215"
            y="238"
            fontFamily={serif}
            fontSize="48"
            fontWeight="700"
            fill="#ffffff"
            textAnchor="middle"
            style={{ letterSpacing: "-0.01em" }}
          >
            Simple,
          </text>
          <text
            x="215"
            y="292"
            fontFamily={serif}
            fontSize="48"
            fontWeight="700"
            fill="#ffffff"
            textAnchor="middle"
            style={{ letterSpacing: "-0.01em" }}
          >
            transparent
          </text>
          <text
            x="215"
            y="346"
            fontFamily={serif}
            fontSize="48"
            fontWeight="700"
            fill="#ffffff"
            textAnchor="middle"
            style={{ letterSpacing: "-0.01em" }}
          >
            pricing
          </text>
        </g>

        {/* --- Body paragraph --- */}
        <g className="m body">
          <text
            x="215"
            y="394"
            fontSize="18"
            fontWeight="400"
            fill="#a89778"
            textAnchor="middle"
          >
            Start with a 14-day free trial. No credit
          </text>
          <text
            x="215"
            y="420"
            fontSize="18"
            fontWeight="400"
            fill="#a89778"
            textAnchor="middle"
          >
            card required.
          </text>
        </g>

        {/* --- Monthly / Yearly toggle pill --- */}
        <g className="m toggle">
          <rect
            x="100"
            y="470"
            width="230"
            height="46"
            rx="23"
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="1"
          />
          {/* Monthly label (selected, white) */}
          <text
            x="128"
            y="499"
            fontSize="14"
            fontWeight="600"
            fill="#ffffff"
          >
            Monthly
          </text>
          {/* Toggle track at midpoint */}
          <rect
            x="196"
            y="483"
            width="40"
            height="20"
            rx="10"
            fill="rgba(255,255,255,0.14)"
          />
          {/* Toggle thumb (white, on right side of track) */}
          <circle cx="226" cy="493" r="8" fill="#ffffff" />
          {/* Yearly label with -17% in gold */}
          <text
            x="246"
            y="499"
            fontSize="14"
            fontWeight="500"
            fill="rgba(255,255,255,0.55)"
          >
            Yearly
          </text>
          <text
            x="294"
            y="499"
            fontSize="14"
            fontWeight="700"
            fill="#c6a44a"
          >
            −17%
          </text>
        </g>

        {/* --- Starter card frame --- */}
        <g className="m card">
          <rect
            x="24"
            y="568"
            width="382"
            height="366"
            rx="18"
            fill="#0f0a04"
            stroke="#c6a44a"
            strokeWidth="1"
            style={{ filter: "drop-shadow(0 20px 48px rgba(198,164,74,0.18))" }}
          />
        </g>

        {/* --- "EVERYTHING INCLUDED" eyebrow --- */}
        <text
          className="m eyb1"
          x="48"
          y="614"
          fontSize="13"
          fontWeight="700"
          fill="#c6a44a"
          style={{ letterSpacing: "0.08em" }}
        >
          EVERYTHING INCLUDED
        </text>

        {/* --- "Starter" plan name --- */}
        <text
          className="m plan"
          x="48"
          y="666"
          fontFamily={serif}
          fontSize="32"
          fontWeight="700"
          fill="#ffffff"
          style={{ letterSpacing: "-0.01em" }}
        >
          Starter
        </text>

        {/* --- "Perfect for small salons" subtitle --- */}
        <text
          className="m sub"
          x="48"
          y="696"
          fontSize="15"
          fontWeight="400"
          fill="#a89778"
        >
          Perfect for small salons
        </text>

        {/* --- $15 / mo price --- */}
        <g className="m price">
          <text
            x="48"
            y="770"
            fontFamily={serif}
            fontSize="60"
            fontWeight="700"
            fill="#ffffff"
            style={{ letterSpacing: "-0.02em" }}
          >
            $15
          </text>
          <text
            x="156"
            y="770"
            fontSize="18"
            fontWeight="400"
            fill="#a89778"
          >
            /mo
          </text>
        </g>

        {/* --- Start free trial CTA (inside card, gold) --- */}
        <g className="m cta">
          <rect
            x="48"
            y="800"
            width="334"
            height="56"
            rx="10"
            fill="#c6a44a"
          />
          <text
            x="215"
            y="836"
            fontSize="16"
            fontWeight="700"
            fill="#0f0a04"
            textAnchor="middle"
          >
            Start free trial →
          </text>
        </g>

        {/* --- "5 STAFF · UNLIMITED BOOKINGS" eyebrow --- */}
        <text
          className="m eyb2"
          x="48"
          y="890"
          fontSize="12"
          fontWeight="500"
          fill="#a89778"
          style={{ letterSpacing: "0.08em" }}
        >
          5 STAFF · UNLIMITED BOOKINGS
        </text>

        {/* --- Checkmark line --- */}
        <g className="m check">
          <path
            d="M48 920 l6 6 l12 -14"
            fill="none"
            stroke="#c6a44a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x="76"
            y="925"
            fontSize="15"
            fontWeight="400"
            fill="#ffffff"
          >
            Online booking page
          </text>
        </g>
      </svg>
    </div>
  );
}
