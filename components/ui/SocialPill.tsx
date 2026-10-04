"use client";

import { motion } from "framer-motion";
import { easeSmooth } from "@/lib/motion";

type Props = {
  href: string;
  label: string;
  short: string;
};

export function SocialPill({ href, label, short }: Props) {
  const hover = {
    y: -4,
    scale: 1.05,
    transition: { duration: 0.45, ease: easeSmooth },
  } as const;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      whileHover={hover}
      whileFocus={hover}
      transition={{ duration: 0.2, ease: easeSmooth }}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] font-sans text-xs font-medium text-[color:var(--ink-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40"
    >
      {short}
    </motion.a>
  );
}
