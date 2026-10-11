"use client";

import { useEffect, useRef } from "react";

const CSS = `
  .ll-root .m {
    opacity: 0;
    animation-duration: 0.5s;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    transform-box: fill-box;
    transform-origin: center;
  }

  @keyframes ll-slide-down {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ll-slide-right {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes ll-rise {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ll-scale-x {
    from { opacity: 0; transform: scaleX(0); }
    to   { opacity: 1; transform: scaleX(1); }
  }
  @keyframes ll-hero {
    from { opacity: 0; transform: scale(0.3) rotate(-45deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }

  /* Animation names gated behind .ll-play so classList toggle restarts them. */
  .ll-root.ll-play .status { animation-name: ll-slide-down;  animation-delay: 0.00s; }
  .ll-root.ll-play .hero   { animation-name: ll-hero;        animation-delay: 0.18s; animation-duration: 0.6s; }
  .ll-root.ll-play .title  { animation-name: ll-rise;        animation-delay: 0.42s; }
  .ll-root.ll-play .sub    { animation-name: ll-rise;        animation-delay: 0.52s; }
  .ll-root.ll-play .elab   { animation-name: ll-slide-right; animation-delay: 0.60s; transform-origin: 0% 50%; }
  .ll-root.ll-play .einp   { animation-name: ll-rise;        animation-delay: 0.66s; }
  .ll-root.ll-play .plab   { animation-name: ll-slide-right; animation-delay: 0.72s; transform-origin: 0% 50%; }
  .ll-root.ll-play .pinp   { animation-name: ll-rise;        animation-delay: 0.78s; }
  .ll-root.ll-play .fgt    { animation-name: ll-rise;        animation-delay: 0.84s; }
  .ll-root.ll-play .cta    { animation-name: ll-rise;        animation-delay: 0.94s; }
  .ll-root.ll-play .divd   { animation-name: ll-scale-x;     animation-delay: 1.06s; transform-origin: 50% 50%; }
  .ll-root.ll-play .ggl    { animation-name: ll-rise;        animation-delay: 1.16s; }
  .ll-root.ll-play .apl    { animation-name: ll-rise;        animation-delay: 1.20s; }
  .ll-root.ll-play .sign   { animation-name: ll-rise;        animation-delay: 1.32s; }

  @media (prefers-reduced-motion: reduce) {
    .ll-root .m {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
    }
  }
`;

export function LexoraLogin() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  const play = () => {
    const el = wrapperRef.current;
    if (!el) return;
    el.classList.remove("ll-play");
    // Force reflow so the next add restarts every @keyframes.
    void el.offsetWidth;
    el.classList.add("ll-play");
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
      className="ll-root relative w-full overflow-hidden"
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <svg
        viewBox="0 0 430 934"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Lexora Welcome back sign-in screen — email and password fields, forgot-password link, Sign In button, Google and Apple OAuth options, sign-up link"
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
          <text x="58" y="42" fontSize="17" fontWeight="700" fill="#111">09:41</text>

          {/* Dynamic Island */}
          <rect x="155" y="24" width="120" height="37" rx="18.5" fill="#000000" />

          {/* Signal bars */}
          <g transform="translate(302, 32)" fill="#111">
            <rect x="0" y="7" width="3" height="4" rx=".8" />
            <rect x="4.6" y="5" width="3" height="6" rx=".8" />
            <rect x="9.2" y="2.6" width="3" height="8.4" rx=".8" />
            <rect x="13.8" y="0" width="3" height="11" rx=".8" />
          </g>
          {/* Wifi */}
          <g transform="translate(326, 33)" fill="#111">
            <path d="M12 17.5 8.6 13.9a4.8 4.8 0 0 1 6.8 0z" />
            <path d="M5.7 11a8.9 8.9 0 0 1 12.6 0l-1.8 1.9a6.3 6.3 0 0 0-9 0z" />
            <path d="M2.8 8.1a13 13 0 0 1 18.4 0l-1.8 1.9a10.4 10.4 0 0 0-14.8 0z" />
            <path d="M0 5.2a17 17 0 0 1 24 0l-1.8 1.9a14.4 14.4 0 0 0-20.4 0z" />
          </g>
          {/* Battery (full) */}
          <g transform="translate(352, 32)">
            <rect x=".7" y=".7" width="21" height="10.6" rx="3" stroke="#111" strokeWidth="1.2" fill="none" />
            <rect x="2.4" y="2.4" width="17.6" height="7.2" rx="1.6" fill="#111" />
            <path d="M23.3 4.2v3.6" stroke="#111" strokeWidth="1.4" strokeLinecap="round" />
          </g>
        </g>

        {/* --- hero: light-blue circle with headphones --- */}
        <g transform="translate(215, 170)">
          <g className="m hero">
            <circle cx="0" cy="0" r="48" fill="#e6effd" />
            {/* Headphones icon, centered on (0,0), scaled to fit circle */}
            <g transform="translate(-18, -16) scale(1.2)" fill="none" stroke="#1677f2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              {/* Headband arc */}
              <path d="M3 15 A12 12 0 0 1 27 15" />
              {/* Left earcup */}
              <path d="M3 14 L3 22 A2.4 2.4 0 0 0 5.4 24.4 L7.6 24.4 A1.6 1.6 0 0 0 9.2 22.8 L9.2 15.6 A1.6 1.6 0 0 0 7.6 14 Z" fill="#1677f2" stroke="#1677f2" />
              {/* Right earcup */}
              <path d="M27 14 L27 22 A2.4 2.4 0 0 1 24.6 24.4 L22.4 24.4 A1.6 1.6 0 0 1 20.8 22.8 L20.8 15.6 A1.6 1.6 0 0 1 22.4 14 Z" fill="#1677f2" stroke="#1677f2" />
            </g>
          </g>
        </g>

        {/* --- Title "Welcome back!" --- */}
        <text
          className="m title"
          x="215"
          y="273"
          fontSize="30"
          fontWeight="800"
          fill="#111318"
          textAnchor="middle"
          style={{ letterSpacing: "-0.02em" }}
        >
          Welcome back!
        </text>

        {/* --- Subtitle --- */}
        <text
          className="m sub"
          x="215"
          y="305"
          fontSize="15"
          fontWeight="400"
          fill="#8a8c95"
          textAnchor="middle"
        >
          Please sign in to continue
        </text>

        {/* --- Email label --- */}
        <text
          className="m elab"
          x="40"
          y="378"
          fontSize="14"
          fontWeight="700"
          fill="#111318"
        >
          Email
        </text>

        {/* --- Email input --- */}
        <g className="m einp">
          <rect
            x="40"
            y="392"
            width="350"
            height="52"
            rx="12"
            fill="#ffffff"
            stroke="rgba(17,17,17,0.14)"
            strokeWidth="1"
          />
          {/* Mail icon */}
          <g transform="translate(58, 410)" fill="none" stroke="#8a8c95" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="0" y="0" width="20" height="15" rx="2.5" />
            <path d="M0 2.5 L10 9 L20 2.5" />
          </g>
          <text
            x="92"
            y="424"
            fontSize="14"
            fontWeight="400"
            fill="#a0a2ab"
          >
            Enter your email
          </text>
        </g>

        {/* --- Password label --- */}
        <text
          className="m plab"
          x="40"
          y="478"
          fontSize="14"
          fontWeight="700"
          fill="#111318"
        >
          Password
        </text>

        {/* --- Password input --- */}
        <g className="m pinp">
          <rect
            x="40"
            y="492"
            width="350"
            height="52"
            rx="12"
            fill="#ffffff"
            stroke="rgba(17,17,17,0.14)"
            strokeWidth="1"
          />
          {/* Lock icon */}
          <g transform="translate(60, 508)" fill="none" stroke="#8a8c95" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="8" width="16" height="12" rx="2" />
            <path d="M6 8 V5 A4 4 0 0 1 14 5 V8" />
          </g>
          <text
            x="92"
            y="524"
            fontSize="14"
            fontWeight="400"
            fill="#a0a2ab"
          >
            Enter your password
          </text>
          {/* Crossed eye icon on right */}
          <g transform="translate(348, 510)" fill="none" stroke="#8a8c95" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 10 C 5 5, 15 5, 20 10 C 15 15, 5 15, 2 10 Z" />
            <circle cx="11" cy="10" r="2.6" />
            <path d="M1 1 L22 20" stroke="#8a8c95" strokeWidth="1.8" />
          </g>
        </g>

        {/* --- Forgot password link --- */}
        <text
          className="m fgt"
          x="390"
          y="574"
          fontSize="13"
          fontWeight="700"
          fill="#1677f2"
          textAnchor="end"
        >
          Forgot password?
        </text>

        {/* --- Sign In button --- */}
        <g className="m cta">
          <rect
            x="40"
            y="606"
            width="350"
            height="58"
            rx="14"
            fill="#1677f2"
            style={{ filter: "drop-shadow(0 4px 10px rgba(22,119,242,0.25))" }}
          />
          <text
            x="215"
            y="642"
            fontSize="17"
            fontWeight="700"
            fill="#ffffff"
            textAnchor="middle"
          >
            Sign In
          </text>
        </g>

        {/* --- "Or continue with" divider --- */}
        <g className="m divd">
          <line x1="40" y1="706" x2="170" y2="706" stroke="rgba(17,17,17,0.14)" strokeWidth="1" />
          <line x1="260" y1="706" x2="390" y2="706" stroke="rgba(17,17,17,0.14)" strokeWidth="1" />
          <text
            x="215"
            y="710"
            fontSize="12"
            fontWeight="400"
            fill="#8a8c95"
            textAnchor="middle"
          >
            Or continue with
          </text>
        </g>

        {/* --- Google button --- */}
        <g className="m ggl">
          <rect
            x="40"
            y="738"
            width="167"
            height="52"
            rx="12"
            fill="#ffffff"
            stroke="rgba(17,17,17,0.14)"
            strokeWidth="1"
          />
          {/* G letter */}
          <text
            x="88"
            y="772"
            fontSize="18"
            fontWeight="500"
            fill="#8a8c95"
            textAnchor="middle"
            style={{ fontFamily: "Manrope, Inter, sans-serif" }}
          >
            G
          </text>
          <text
            x="138"
            y="772"
            fontSize="14"
            fontWeight="700"
            fill="#111318"
            textAnchor="middle"
          >
            Google
          </text>
        </g>

        {/* --- Apple button --- */}
        <g className="m apl">
          <rect
            x="223"
            y="738"
            width="167"
            height="52"
            rx="12"
            fill="#111318"
          />
          {/* Apple logo */}
          <g transform="translate(275, 754)" fill="#ffffff">
            <path d="M12.5 5.2c0-1.6 1.3-2.4 1.4-2.5-0.8-1.1-2-1.3-2.4-1.3-1-0.1-2 0.6-2.5 0.6-0.5 0-1.3-0.6-2.2-0.6-1.1 0-2.2 0.7-2.8 1.7-1.2 2.1-0.3 5.1 0.9 6.8 0.6 0.8 1.2 1.7 2.1 1.7 0.8 0 1.1-0.5 2.1-0.5 1 0 1.3 0.5 2.2 0.5 0.9 0 1.5-0.8 2.1-1.6 0.7-0.9 0.9-1.8 0.9-1.9-0.1 0-1.8-0.7-1.8-2.7zM10.9 0.6c0.4-0.5 0.7-1.3 0.6-2-0.7 0-1.5 0.4-1.9 1-0.4 0.5-0.7 1.3-0.6 2 0.8 0.1 1.5-0.4 1.9-1z" />
          </g>
          <text
            x="325"
            y="772"
            fontSize="14"
            fontWeight="700"
            fill="#ffffff"
            textAnchor="middle"
          >
            Apple
          </text>
        </g>

        {/* --- Bottom "Don't have an account? Sign up" --- */}
        <g className="m sign">
          <text
            x="152"
            y="854"
            fontSize="13"
            fontWeight="400"
            fill="#111318"
            textAnchor="end"
          >
            Don&apos;t have an account?
          </text>
          <text
            x="158"
            y="854"
            fontSize="13"
            fontWeight="700"
            fill="#1677f2"
          >
            Sign up
          </text>
        </g>

        {/* --- Home indicator (static) --- */}
        <rect x="138" y="913" width="154" height="5" rx="3" fill="#111318" />
      </svg>
    </div>
  );
}
