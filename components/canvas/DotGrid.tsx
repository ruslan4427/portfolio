"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

const STEP = 28;
const BASE_R = 1.5;
const MAX_R = 3.5;
const BASE_A = 0.1;
const MAX_A = 0.55;
const INFLUENCE = 130;
const DECAY_MS = 600;

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const cursorRef = useRef({ x: -9999, y: -9999, tLast: 0 });
  const reduced = usePrefersReducedMotion();
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hoverCapable = window.matchMedia("(hover: hover)").matches;
    setInteractive(hoverCapable && !reduced);
  }, [reduced]);

  useEffect(() => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
      cursorRef.current.tLast = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const draw = () => {
      const { x: cx, y: cy, tLast } = cursorRef.current;
      const now = performance.now();
      const decay = Math.max(0, 1 - (now - tLast) / DECAY_MS);
      ctx.clearRect(0, 0, width, height);

      const influenceSq = INFLUENCE * INFLUENCE;
      for (let y = STEP / 2; y < height; y += STEP) {
        for (let x = STEP / 2; x < width; x += STEP) {
          const dx = x - cx;
          const dy = y - cy;
          const distSq = dx * dx + dy * dy;
          let t = 0;
          if (distSq < influenceSq) {
            const dist = Math.sqrt(distSq);
            t = decay * (1 - dist / INFLUENCE);
            t = t * t;
          }
          const r = BASE_R + (MAX_R - BASE_R) * t;
          const a = BASE_A + (MAX_A - BASE_A) * t;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(17, 17, 17, ${a})`;
          ctx.fill();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    if (document.visibilityState === "visible") {
      rafRef.current = requestAnimationFrame(draw);
    }

    const onVis = () => {
      if (document.visibilityState === "visible") {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(rafRef.current);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [interactive]);

  if (!interactive) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(17,17,17,0.10) 1.5px, transparent 1.5px)",
          backgroundSize: `${STEP}px ${STEP}px`,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
