"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { easeSmooth, usePrefersReducedMotion } from "@/lib/motion";

type Props = {
  open: boolean;
  onClose: () => void;
  label?: string;
  caption?: string;
  children: React.ReactNode;
};

export function Lightbox({ open, onClose, label, caption, children }: Props) {
  const reduced = usePrefersReducedMotion();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 50);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: easeSmooth }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(17,17,17,0.78)] p-4 backdrop-blur-sm sm:p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={label ?? "Expanded view"}
        >
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: easeSmooth }}
            className="relative flex max-h-[94vh] w-full max-w-[min(1400px,96vw)] flex-col overflow-hidden rounded-[var(--radius-card)] bg-[color:var(--bg-elevated)] shadow-[var(--shadow-card)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[color:var(--hairline)] px-4 py-3 sm:px-5">
              <div className="truncate font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                {label ?? "Expanded view"}
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-page)] text-[color:var(--ink-primary)] transition hover:-translate-y-0.5 hover:bg-[color:var(--bg-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--ink-primary)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div
              data-lenis-prevent
              className="flex min-h-0 flex-1 overflow-auto overscroll-contain bg-[color:var(--bg-page)] p-4 sm:p-6"
              style={{ alignItems: "safe center", justifyContent: "safe center" }}
            >
              {children}
            </div>
            {caption && (
              <div className="border-t border-[color:var(--hairline)] px-4 py-3 text-center font-sans text-xs text-[color:var(--ink-muted)] sm:px-5">
                {caption}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function ExpandButton({
  onClick,
  label = "Expand",
  className = "",
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]/90 text-[color:var(--ink-primary)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-[color:var(--bg-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--ink-primary)] ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
      </svg>
    </button>
  );
}
