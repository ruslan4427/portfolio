"use client";

import { useEffect, useRef } from "react";

const CSS = `
  .nm-root .m {
    opacity: 0;
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes nm-slide-down  { from { opacity:0; transform: translateY(-10px); } to { opacity:1; transform: translateY(0); } }
  @keyframes nm-slide-right { from { opacity:0; transform: translateX(-10px); } to { opacity:1; transform: translateX(0); } }
  @keyframes nm-scale-in    { from { opacity:0; transform: scale(0.4); }       to { opacity:1; transform: scale(1); } }
  @keyframes nm-rise        { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform: translateY(0); } }
  @keyframes nm-scale-x     { from { opacity:0; transform: scaleX(0); }        to { opacity:1; transform: scaleX(1); } }

  /* Animation names GATED behind .nm-play so classList toggle restarts them. */
  .nm-root.nm-play .logo   { animation-name: nm-slide-right; animation-delay: 0.00s; transform-origin: 0% 50%; }
  .nm-root.nm-play .pill   { animation-name: nm-scale-in;    animation-delay: 0.08s; }
  .nm-root.nm-play .burger { animation-name: nm-scale-in;    animation-delay: 0.14s; }
  .nm-root.nm-play .hair   { animation-name: nm-scale-x;     animation-delay: 0.18s; transform-origin: 0% 50%; }
  .nm-root.nm-play .your   { animation-name: nm-rise;        animation-delay: 0.26s; }
  .nm-root.nm-play .barb   { animation-name: nm-rise;        animation-delay: 0.34s; }
  .nm-root.nm-play .emdash { animation-name: nm-scale-x;     animation-delay: 0.46s; transform-origin: 50% 50%; }
  .nm-root.nm-play .online { animation-name: nm-rise;        animation-delay: 0.54s; }
  .nm-root.nm-play .body   { animation-name: nm-rise;        animation-delay: 0.72s; }
  .nm-root.nm-play .ctaA   { animation-name: nm-rise;        animation-delay: 0.90s; }
  .nm-root.nm-play .ctaB   { animation-name: nm-rise;        animation-delay: 0.98s; }
  .nm-root.nm-play .steps  { animation-name: nm-rise;        animation-delay: 1.14s; }

  @media (prefers-reduced-motion: reduce) {
    .nm-root .m {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

export function NobleMarketing() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  const play = () => {
    const el = wrapperRef.current;
    if (!el) return;
    el.classList.remove("nm-play");
    // Force reflow so the next add restarts every @keyframes.
    void el.offsetWidth;
    el.classList.add("nm-play");
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
      className="nm-root relative w-full overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <svg
        viewBox="0 0 430 934"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Noble marketing landing — dark Noble theme with gold accents. Scissor-logo, EN/ES toggle, hamburger, hero headline 'Your barbershop — online in 5 minutes', body paragraph, gold Create your salon CTA, outlined See pricing CTA, Online in 3 steps hint."
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          background: "#0f0a04",
          fontFamily: "Inter, -apple-system, 'Helvetica Neue', sans-serif",
          color: "#ffffff",
        }}
      >
        {/* --- page background --- */}
        <rect x="0" y="0" width="430" height="934" fill="#0f0a04" />

        {/* --- TOP BAR --- */}

        {/* Logo: scissors + "Noble" wordmark (gold cursive-serif) */}
        <g transform="translate(44, 50)">
          <g className="m logo">
            {/* scissor icon — two blades crossed, two finger-holes */}
            <g
              fill="none"
              stroke="#c6a44a"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="4" cy="18" r="3.2" />
              <circle cx="4" cy="4" r="3.2" />
              <path d="M7 6 L26 16" />
              <path d="M7 16 L26 6" />
            </g>
            {/* "Noble" wordmark */}
            <text
              x="38"
              y="17"
              fontSize="22"
              fill="#c6a44a"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontStyle: "italic",
                fontWeight: 500,
                letterSpacing: "0.01em",
              }}
            >
              Noble
            </text>
          </g>
        </g>

        {/* EN/ES pill toggle */}
        <g transform="translate(254, 36)">
          <g className="m pill">
            {/* outer pill */}
            <rect x="0" y="0" width="128" height="46" rx="23" fill="#1a140a" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {/* EN active chip (gold-outlined dark) */}
            <rect x="4" y="4" width="60" height="38" rx="19" fill="#1a140a" stroke="#c6a44a" strokeWidth="1.2" />
            {/* EN label */}
            <text
              x="34"
              y="30"
              fontSize="14"
              fontWeight="600"
              fill="#c6a44a"
              textAnchor="middle"
              style={{ letterSpacing: "0.04em" }}
            >
              EN
            </text>
            {/* ES label (muted) */}
            <text
              x="96"
              y="30"
              fontSize="14"
              fontWeight="500"
              fill="#a89778"
              textAnchor="middle"
              style={{ letterSpacing: "0.04em" }}
            >
              ES
            </text>
          </g>
        </g>

        {/* Hamburger */}
        <g transform="translate(386, 42)">
          <g className="m burger">
            <g stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
              <line x1="0" y1="4" x2="24" y2="4" />
              <line x1="0" y1="14" x2="24" y2="14" />
              <line x1="0" y1="24" x2="24" y2="24" />
            </g>
          </g>
        </g>

        {/* --- Hairline divider below top bar --- */}
        <line
          className="m hair"
          x1="0"
          y1="104"
          x2="430"
          y2="104"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />

        {/* --- HERO HEADLINE (centered) --- */}

        {/* "Your" */}
        <text
          className="m your"
          x="215"
          y="245"
          fontSize="72"
          fill="#ffffff"
          textAnchor="middle"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Your
        </text>

        {/* "barbershop" */}
        <text
          className="m barb"
          x="215"
          y="325"
          fontSize="72"
          fill="#ffffff"
          textAnchor="middle"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          barbershop
        </text>

        {/* Gold em-dash divider */}
        <line
          className="m emdash"
          x1="185"
          y1="400"
          x2="245"
          y2="400"
          stroke="#8a7230"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* "online in 5" */}
        <text
          className="m online"
          x="215"
          y="475"
          fontSize="52"
          fill="#c6a44a"
          textAnchor="middle"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: "italic",
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          online in 5
        </text>

        {/* "minutes" */}
        <text
          className="m online"
          x="215"
          y="540"
          fontSize="52"
          fill="#c6a44a"
          textAnchor="middle"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontStyle: "italic",
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          minutes
        </text>

        {/* --- BODY paragraph (gray, 2 lines) --- */}
        <text
          className="m body"
          x="215"
          y="625"
          fontSize="18"
          fill="#a89778"
          textAnchor="middle"
          style={{ fontFamily: "Inter, -apple-system, sans-serif", fontWeight: 400 }}
        >
          Booking page, staff schedule, client
        </text>
        <text
          className="m body"
          x="215"
          y="652"
          fontSize="18"
          fill="#a89778"
          textAnchor="middle"
          style={{ fontFamily: "Inter, -apple-system, sans-serif", fontWeight: 400 }}
        >
          management — all under your own link.
        </text>

        {/* --- CTA stack --- */}

        {/* Gold solid: "Create your salon →" */}
        <g className="m ctaA">
          <rect
            x="36"
            y="708"
            width="358"
            height="64"
            rx="8"
            fill="#c6a44a"
          />
          <text
            x="215"
            y="748"
            fontSize="18"
            fontWeight="700"
            fill="#0f0a04"
            textAnchor="middle"
            style={{ fontFamily: "Inter, -apple-system, sans-serif" }}
          >
            Create your salon →
          </text>
        </g>

        {/* Outlined: "See pricing" */}
        <g className="m ctaB">
          <rect
            x="36"
            y="788"
            width="358"
            height="64"
            rx="8"
            fill="none"
            stroke="#8a7230"
            strokeWidth="1.4"
          />
          <text
            x="215"
            y="828"
            fontSize="18"
            fontWeight="500"
            fill="#ffffff"
            textAnchor="middle"
            style={{ fontFamily: "Inter, -apple-system, sans-serif" }}
          >
            See pricing
          </text>
        </g>

        {/* --- Bottom hint: "Online in 3 steps" --- */}
        <text
          className="m steps"
          x="215"
          y="905"
          fontSize="22"
          fontWeight="600"
          fill="#ffffff"
          textAnchor="middle"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            letterSpacing: "0.01em",
          }}
        >
          Online in 3 steps
        </text>
      </svg>
    </div>
  );
}
