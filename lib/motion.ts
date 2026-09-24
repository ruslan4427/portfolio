"use client";

import { useEffect, useState } from "react";

export const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const staggerPresets = {
  word: 0.06,
  line: 0.12,
} as const;

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  return reduced;
}
