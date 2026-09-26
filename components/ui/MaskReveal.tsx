"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { easeSmooth, usePrefersReducedMotion } from "@/lib/motion";

type Mode = "mount" | "in-view";

type Props = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  mode?: Mode;
  className?: string;
  as?: "span" | "div";
};

export function MaskReveal({
  children,
  delay = 0,
  duration = 1.15,
  mode = "in-view",
  className = "",
  as = "span",
}: Props) {
  const reduced = usePrefersReducedMotion();

  const inner = reduced
    ? { opacity: 0 }
    : { y: "110%", opacity: 0 };
  const rest = reduced
    ? { opacity: 1 }
    : { y: "0%", opacity: 1 };

  const viewport = { once: true, margin: "-80px" };
  const inViewProps =
    mode === "in-view"
      ? { whileInView: rest, viewport }
      : { animate: rest };

  const Wrapper = as === "div" ? motion.div : motion.span;
  const Inner = as === "div" ? motion.div : motion.span;

  return (
    <Wrapper
      className={`inline-block overflow-hidden align-baseline ${className}`.trim()}
      style={{ paddingBottom: "0.12em" }}
    >
      <Inner
        className="inline-block will-change-transform"
        initial={inner}
        {...inViewProps}
        transition={{
          duration,
          delay,
          ease: easeSmooth,
        }}
      >
        {children}
      </Inner>
    </Wrapper>
  );
}
