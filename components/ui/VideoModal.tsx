"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { easeSmooth, usePrefersReducedMotion } from "@/lib/motion";

type Props = {
  open: boolean;
  onClose: () => void;
  src: string;
  poster?: string;
  title?: string;
};

export function VideoModal({ open, onClose, src, poster, title }: Props) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: easeSmooth }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(17,17,17,0.72)] p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title ?? "Video"}
        >
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.32, ease: easeSmooth }}
            className="relative w-full max-w-[min(960px,92vw)] overflow-hidden rounded-[var(--radius-card)] bg-black shadow-[var(--shadow-card)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close video"
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.16)] font-sans text-lg text-white transition hover:bg-[rgba(255,255,255,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <span aria-hidden>×</span>
            </button>
            <video
              key={src}
              className="block h-auto w-full"
              src={src}
              poster={poster}
              autoPlay
              controls
              playsInline
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
