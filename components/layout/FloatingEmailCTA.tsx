"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { easeSmooth, usePrefersReducedMotion } from "@/lib/motion";

export function FloatingEmailCTA() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  if (pathname === "/contact") return null;

  const hover = reduced
    ? undefined
    : {
        y: -6,
        scale: 1.04,
        transition: { duration: 0.55, ease: easeSmooth },
      };

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 60 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        delay: reduced ? 0 : 1.5,
        ease: easeSmooth,
      }}
    >
      <motion.a
        href="mailto:rusgrekovua@gmail.com"
        aria-label="Reach out via email"
        whileHover={hover}
        whileFocus={hover}
        transition={{ duration: 0.22, ease: easeSmooth }}
        className="inline-flex items-center gap-3 rounded-full bg-[color:var(--cta)] py-1.5 pl-1.5 pr-5 font-sans text-sm text-[color:var(--cta-ink)] shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40"
      >
        <span
          aria-hidden
          className="relative h-9 w-9 overflow-hidden rounded-full bg-[color:var(--ink-primary)]"
        >
          <Image
            src="/videos/hero-poster.jpg"
            alt=""
            fill
            sizes="36px"
            className="object-cover"
          />
        </span>
        <span aria-hidden className="inline-flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          <span>Reach out via email</span>
        </span>
      </motion.a>
    </motion.div>
  );
}
