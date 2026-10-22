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
  // Always settle y: the hook reads false on the first render, so the
  // motion variant can start before reduced flips to true. Without y here
  // the text stays parked at 110% behind the mask.
  const rest = { y: "0%", opacity: 1 };

  // The trigger lives on the wrapper: the inner span starts parked below
  // the mask, fully clipped, so an observer on it would never fire.
  const viewport = { once: true, margin: "-80px" };
  const trigger =
    mode === "in-view"
      ? { initial: "hidden", whileInView: "shown", viewport }
      : { initial: "hidden", animate: "shown" };

  const Wrapper = as === "div" ? motion.div : motion.span;
  const Inner = as === "div" ? motion.div : motion.span;

  return (
    <Wrapper
      className={`inline-block overflow-hidden align-baseline ${className}`.trim()}
      style={{ paddingBottom: "0.12em" }}
      {...trigger}
    >
      <Inner
        className="inline-block will-change-transform"
        variants={{ hidden: inner, shown: rest }}
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
