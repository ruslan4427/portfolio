"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * A bounded halftone dot field for the home hero (Sprint 28, after the
 * Nizar Ali reference): faint dots with a scattering of darker ones,
 * fading out at the edges via a CSS mask. Static by default; on
 * hover-capable devices without reduced motion, dots near the cursor
 * brighten with a smooth falloff and settle back when it leaves.
 */
const CONFIG = {
  STEP: 20, // px between dot centres
  RADIUS: 1.15, // idle dot radius
  RADIUS_ACTIVE: 2.2, // radius at the cursor
  ALPHA_MIN: 0.05, // faintest dot
  ALPHA_SPREAD: 0.55, // added to the darkest dots
  SPREAD_POWER: 4, // higher = fewer dark dots
  ACTIVE_ALPHA: 0.45, // extra alpha at the cursor
  CURSOR_RADIUS: 140, // px
  DECAY_MS: 700, // per-dot settle time after the cursor leaves
  MAX_DPR: 2,
} as const;

/** Stable per-dot noise in [0, 1) — the same pattern on every visit. */
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export function HeroDots({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const interactive = window.matchMedia("(hover: hover)").matches && !reduced;
    const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.MAX_DPR);
    let cols = 0;
    let rows = 0;
    let base = new Float32Array(0);
    let heat = new Float32Array(0);
    const cursor = { x: -9999, y: -9999, inside: false };
    let raf = 0;
    let last = 0;

    const draw = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16;
      last = now;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      const r2 = CONFIG.CURSOR_RADIUS * CONFIG.CURSOR_RADIUS;
      const decay = dt / CONFIG.DECAY_MS;
      let busy = false;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          const x = i * CONFIG.STEP + CONFIG.STEP / 2;
          const y = j * CONFIG.STEP + CONFIG.STEP / 2;
          let target = 0;
          if (cursor.inside) {
            const d2 = (x - cursor.x) ** 2 + (y - cursor.y) ** 2;
            if (d2 < r2) {
              const f = 1 - Math.sqrt(d2) / CONFIG.CURSOR_RADIUS;
              target = f * f;
            }
          }
          heat[k] = target > heat[k] ? target : Math.max(target, heat[k] - decay);
          if (heat[k] > 0.001) busy = true;
          const h = heat[k];
          const alpha = Math.min(1, base[k] + CONFIG.ACTIVE_ALPHA * h);
          const radius = CONFIG.RADIUS + (CONFIG.RADIUS_ACTIVE - CONFIG.RADIUS) * h;
          ctx.fillStyle = `rgba(17, 17, 17, ${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = busy || cursor.inside ? requestAnimationFrame(draw) : 0;
      if (!raf) last = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CONFIG.STEP);
      rows = Math.ceil(height / CONFIG.STEP);
      base = new Float32Array(cols * rows);
      heat = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          base[j * cols + i] = CONFIG.ALPHA_MIN + CONFIG.ALPHA_SPREAD * hash(i, j) ** CONFIG.SPREAD_POWER;
        }
      }
      kick();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursor.x = e.clientX - rect.left;
      cursor.y = e.clientY - rect.top;
      cursor.inside =
        cursor.x > -CONFIG.CURSOR_RADIUS &&
        cursor.y > -CONFIG.CURSOR_RADIUS &&
        cursor.x < rect.width + CONFIG.CURSOR_RADIUS &&
        cursor.y < rect.height + CONFIG.CURSOR_RADIUS;
      if (cursor.inside) kick();
    };
    const onLeave = () => {
      cursor.inside = false;
      kick();
    };
    if (interactive) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none [mask-image:radial-gradient(ellipse_closest-side_at_50%_50%,#000_35%,transparent_100%)] ${className}`}
    />
  );
}
