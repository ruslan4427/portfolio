"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { easeSmooth, usePrefersReducedMotion } from "@/lib/motion";

type Props = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  viewportMargin?: string;
};

export function Reveal({
  children,
  delay = 0,
  y = 32,
  duration = 0.85,
  viewportMargin = "-80px",
  ...rest
}: Props) {
  const reduced = usePrefersReducedMotion();
  const from = reduced ? { opacity: 0 } : { opacity: 0, y };
  const to = reduced ? { opacity: 1 } : { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={from}
      whileInView={to}
      viewport={{ once: true, margin: viewportMargin }}
      transition={{ duration, delay, ease: easeSmooth }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
