"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function BackToTop() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!mounted) return null;

  const handleClick = () => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };

  return createPortal(
    <button
      type="button"
      aria-label="Back to top"
      onClick={handleClick}
      className={`fixed bottom-6 right-[var(--gutter)] z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] text-[color:var(--ink-primary)] shadow-[var(--shadow-card)] transition-[opacity,transform] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100 hover:-translate-y-0.5"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <svg
        aria-hidden
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>,
    document.body,
  );
}
