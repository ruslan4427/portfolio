"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CTAButton } from "@/components/ui/CTAButton";
import type { AgentNode, ReplayData } from "./types";

const NODE_WIDTH = 140;
const NODE_HEIGHT = 90;
const CORNER_RADIUS = 10;

function nodeCenter(n: AgentNode): { cx: number; cy: number } {
  return { cx: n.x + NODE_WIDTH / 2, cy: n.y + NODE_HEIGHT / 2 };
}

function edgePath(from: AgentNode, to: AgentNode): string {
  const a = nodeCenter(from);
  const b = nodeCenter(to);
  if (Math.abs(a.cy - b.cy) < 4) {
    const y = a.cy;
    return `M ${a.cx + NODE_WIDTH / 2} ${y} L ${b.cx - NODE_WIDTH / 2} ${y}`;
  }
  if (Math.abs(a.cx - b.cx) < 4) {
    const x = a.cx;
    return `M ${x} ${a.cy + NODE_HEIGHT / 2} L ${x} ${b.cy - NODE_HEIGHT / 2}`;
  }
  const startX = a.cx;
  const startY = a.cy + (a.cy < b.cy ? NODE_HEIGHT / 2 : -NODE_HEIGHT / 2);
  const endX = b.cx + (b.cx < a.cx ? NODE_WIDTH / 2 : -NODE_WIDTH / 2);
  const endY = b.cy;
  const midY = (startY + endY) / 2;
  return `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
}

export function AgentReplay({ data }: { data: ReplayData }) {
  const [stepIndex, setStepIndex] = useState(0);
  const stepCount = data.steps.length;
  const step = data.steps[stepIndex];

  const activeNodes = useMemo(() => new Set(step.activeNodes), [step.activeNodes]);
  const nodesById = useMemo(() => {
    const map = new Map<string, AgentNode>();
    for (const n of data.nodes) map.set(n.id, n);
    return map;
  }, [data.nodes]);

  const next = useCallback(() => setStepIndex((i) => Math.min(i + 1, stepCount - 1)), [stepCount]);
  const prev = useCallback(() => setStepIndex((i) => Math.max(i - 1, 0)), []);
  const reset = useCallback(() => setStepIndex(0), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "Home") {
        e.preventDefault();
        reset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, reset]);

  return (
    <section
      className="not-prose my-10 rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 md:p-8"
      aria-labelledby="agent-replay-heading"
    >
      <header className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3
            id="agent-replay-heading"
            className="font-sans text-xs uppercase tracking-[0.14em] text-[color:var(--ink-muted)]"
          >
            Agent replay · {data.title}
          </h3>
          <p className="mt-2 font-sans text-xs text-[color:var(--ink-muted)]">
            Step through one weekly cycle. Arrow keys ← → or the buttons below.
          </p>
        </div>
        <div
          className="font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)] tabular-nums"
          aria-live="polite"
        >
          Step {stepIndex + 1} of {stepCount}
        </div>
      </header>

      <div
        tabIndex={0}
        role="region"
        aria-label="Agent replay diagram (scrolls sideways)"
        className="overflow-x-auto focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
      >
        <svg
          viewBox={`0 0 ${data.viewBox.width} ${data.viewBox.height}`}
          className="h-auto w-full min-w-[640px]"
          role="img"
          aria-label={`Agent flow at step ${stepIndex + 1}: ${step.title}. ${step.payload}`}
        >
          {data.edges.map((edge) => {
            const from = nodesById.get(edge.from);
            const to = nodesById.get(edge.to);
            if (!from || !to) return null;
            const isActive = step.edge === edge.id;
            return (
              <path
                key={edge.id}
                d={edgePath(from, to)}
                fill="none"
                stroke={isActive ? "var(--ink-primary)" : "var(--hairline)"}
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray={isActive ? undefined : "4 4"}
                strokeLinecap="round"
                strokeLinejoin="round"
                markerEnd={isActive ? "url(#agent-replay-arrow)" : undefined}
                style={{
                  transition: "stroke 220ms ease, stroke-width 220ms ease",
                }}
              />
            );
          })}

          <defs>
            <marker
              id="agent-replay-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-primary)" />
            </marker>
          </defs>

          {data.nodes.map((n) => {
            const isActive = activeNodes.has(n.id);
            const stroke = isActive ? "var(--ink-primary)" : "var(--outline)";
            const strokeWidth = isActive ? 2 : 1;
            const fill = isActive
              ? "var(--bg-page)"
              : n.accent
                ? "var(--bg-elevated)"
                : "var(--bg-elevated)";
            const textColor = isActive ? "var(--ink-primary)" : "var(--ink-body)";
            return (
              <g
                key={n.id}
                style={{
                  transition: "opacity 220ms ease",
                  opacity: isActive ? 1 : 0.65,
                }}
              >
                <rect
                  x={n.x}
                  y={n.y}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  rx={CORNER_RADIUS}
                  ry={CORNER_RADIUS}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                />
                {n.accent && (
                  <circle
                    cx={n.x + NODE_WIDTH - 12}
                    cy={n.y + 12}
                    r={3.5}
                    fill="var(--status-ok, #22C55E)"
                  />
                )}
                <text
                  x={n.x + NODE_WIDTH / 2}
                  y={n.y + NODE_HEIGHT / 2 - 4}
                  textAnchor="middle"
                  className="font-serif"
                  fontSize={18}
                  fill={textColor}
                >
                  {n.label}
                </text>
                {n.sub && (
                  <text
                    x={n.x + NODE_WIDTH / 2}
                    y={n.y + NODE_HEIGHT / 2 + 18}
                    textAnchor="middle"
                    className="font-sans"
                    fontSize={11}
                    fill="var(--ink-muted)"
                    style={{
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {n.sub}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-10">
        <div className="flex items-start gap-3">
          <CTAButton
            variant="outline"
            size="sm"
            onClick={prev}
            disabled={stepIndex === 0}
            ariaLabel="Previous step"
          >
            ← Prev
          </CTAButton>
          <CTAButton
            variant="outline"
            size="sm"
            onClick={next}
            disabled={stepIndex === stepCount - 1}
            ariaLabel="Next step"
          >
            Next →
          </CTAButton>
          <CTAButton
            variant="outline"
            size="sm"
            onClick={reset}
            disabled={stepIndex === 0}
            ariaLabel="Reset to first step"
          >
            Reset
          </CTAButton>
        </div>

        <div
          className="rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-page)] p-5"
          aria-live="polite"
        >
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h4 className="font-serif text-[20px] leading-tight text-[color:var(--ink-primary)]">
              {step.title}
            </h4>
            {step.timestamp && (
              <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)] tabular-nums">
                {step.timestamp}
              </span>
            )}
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--ink-body)]">
            {step.payload}
          </p>
        </div>
      </div>
    </section>
  );
}
