"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

/**
 * All tunables live here. Adjust density, contrast, or motion timing
 * without touching the draw loop.
 */
const CONFIG = {
  // Grid geometry
  GRID_STEP: 30, // px between dot centers — 28–32 is the sweet spot
  DOT_RADIUS_BASE: 1.6, // idle dot radius
  DOT_RADIUS_ACTIVE: 4, // dot radius at cursor center

  // Colour + contrast (strictly monochrome ink over warm paper)
  INK_R: 17,
  INK_G: 17,
  INK_B: 17,
  BASE_ALPHA: 0.05, // idle alpha (≈ #E6E5E1 over #F5F4EF)
  ACTIVE_ALPHA_MAX: 0.35, // alpha at cursor center

  // Cursor interaction
  CURSOR_RADIUS: 170, // influence radius, px — the "hovered space"
  CURSOR_DECAY_MS: 900, // per-dot fade-out time after cursor leaves
  CURSOR_SMOOTH_MS: 180, // time constant for cursor easing (higher = more lag)
  DOT_SHIFT_MAX: 4, // px — max push distance away from cursor at the edge

  // Chaos — each dot in the hovered space pulses with its own phase so
  // activation reads as organic rather than a clean radial disc.
  CHAOS_MIX: 0.65, // 0 = perfectly radial glow, 1 = fully noisy
  CHAOS_TIME_HZ: 0.55, // cycles per second for the per-dot wobble
  CHAOS_PHASE_X: 12.9898, // per-dot phase seed multiplier (x)
  CHAOS_PHASE_Y: 78.233, // per-dot phase seed multiplier (y)

  // Perf
  RESIZE_DEBOUNCE_MS: 150,
  MAX_DPR: 2,
} as const;

export function DotGrid() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const cursorRef = useRef({
    x: -9999,
    y: -9999,
    smoothX: -9999,
    smoothY: -9999,
    present: false,
  });
  const intensitiesRef = useRef<Float32Array | null>(null);
  const dimsRef = useRef({ cols: 0, rows: 0, width: 0, height: 0 });
  const prevFrameRef = useRef(0);
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

    const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.MAX_DPR);

    const applySize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cols = Math.ceil(width / CONFIG.GRID_STEP);
      const rows = Math.ceil(height / CONFIG.GRID_STEP);
      dimsRef.current = { cols, rows, width, height };
      intensitiesRef.current = new Float32Array(cols * rows);
    };
    applySize();

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applySize, CONFIG.RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener("resize", onResize);

    const onMove = (e: PointerEvent) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
      // Seed the smoothed position on the first move so the initial ease
      // doesn't sweep across the whole viewport from the off-screen sentinel.
      if (!cursorRef.current.present) {
        cursorRef.current.smoothX = e.clientX;
        cursorRef.current.smoothY = e.clientY;
      }
      cursorRef.current.present = true;
    };
    const onLeave = () => {
      cursorRef.current.present = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const TAU = Math.PI * 2;
    const R_DELTA = CONFIG.DOT_RADIUS_ACTIVE - CONFIG.DOT_RADIUS_BASE;
    const A_DELTA = CONFIG.ACTIVE_ALPHA_MAX - CONFIG.BASE_ALPHA;
    const INF_SQ = CONFIG.CURSOR_RADIUS * CONFIG.CURSOR_RADIUS;
    const chaosTimeK = (TAU * CONFIG.CHAOS_TIME_HZ) / 1000; // rad per ms
    const chaosBase = 1 - CONFIG.CHAOS_MIX;
    const inkPrefix = `rgba(${CONFIG.INK_R}, ${CONFIG.INK_G}, ${CONFIG.INK_B}, `;

    const draw = (now: number) => {
      const intensities = intensitiesRef.current;
      const { cols, rows, width, height } = dimsRef.current;
      if (!intensities) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      const prev = prevFrameRef.current || now;
      const dt = Math.min(now - prev, 64);
      prevFrameRef.current = now;
      const decayStep = dt / CONFIG.CURSOR_DECAY_MS;

      const cursor = cursorRef.current;
      const cursorActive = cursor.present;
      // Frame-rate independent ease toward the raw cursor position — dots
      // then follow this smoothed point so shifts feel gliding, not snappy.
      const easeAlpha = 1 - Math.exp(-dt / CONFIG.CURSOR_SMOOTH_MS);
      cursor.smoothX += (cursor.x - cursor.smoothX) * easeAlpha;
      cursor.smoothY += (cursor.y - cursor.smoothY) * easeAlpha;
      const cx = cursor.smoothX;
      const cy = cursor.smoothY;

      ctx.clearRect(0, 0, width, height);

      for (let row = 0; row < rows; row++) {
        const y = CONFIG.GRID_STEP / 2 + row * CONFIG.GRID_STEP;
        for (let col = 0; col < cols; col++) {
          const x = CONFIG.GRID_STEP / 2 + col * CONFIG.GRID_STEP;
          const i = row * cols + col;

          // 1) Per-dot cursor intensity — decay every frame, bump on proximity.
          //    Bump is falloff² multiplied by a per-dot temporal wobble so
          //    dots in the hovered space activate chaotically rather than
          //    in a clean radial disc.
          let intensity = intensities[i] - decayStep;
          if (intensity < 0) intensity = 0;
          let drawX = x;
          let drawY = y;
          if (cursorActive) {
            const dx = x - cx;
            const dy = y - cy;
            const distSq = dx * dx + dy * dy;
            if (distSq < INF_SQ) {
              const dist = Math.sqrt(distSq) || 1;
              const falloff = 1 - dist / CONFIG.CURSOR_RADIUS;
              const dotPhase =
                col * CONFIG.CHAOS_PHASE_X + row * CONFIG.CHAOS_PHASE_Y;
              const wobble = 0.5 + 0.5 * Math.sin(now * chaosTimeK + dotPhase);
              const chaosFactor = chaosBase + CONFIG.CHAOS_MIX * wobble;
              const bump = falloff * falloff * chaosFactor;
              if (bump > intensity) intensity = bump;
              // Small push away from the cursor, strongest at the edge of
              // the influence — smoothly returns to grid as cursor moves off.
              const shift = CONFIG.DOT_SHIFT_MAX * falloff;
              drawX = x + (dx / dist) * shift;
              drawY = y + (dy / dist) * shift;
            }
          }
          intensities[i] = intensity;

          const r = CONFIG.DOT_RADIUS_BASE + R_DELTA * intensity;
          const a = CONFIG.BASE_ALPHA + A_DELTA * intensity;
          ctx.beginPath();
          ctx.arc(drawX, drawY, r, 0, TAU);
          ctx.fillStyle = `${inkPrefix}${a})`;
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
        prevFrameRef.current = 0;
        rafRef.current = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(rafRef.current);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [interactive]);

  if (!interactive) {
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(${CONFIG.INK_R},${CONFIG.INK_G},${CONFIG.INK_B},${CONFIG.BASE_ALPHA}) ${CONFIG.DOT_RADIUS_BASE}px, transparent ${CONFIG.DOT_RADIUS_BASE}px)`,
          backgroundSize: `${CONFIG.GRID_STEP}px ${CONFIG.GRID_STEP}px`,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
