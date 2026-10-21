"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Phase } from "@/content/case-studies";
import scorecardJson from "@/scorecard.json";
import { Lightbox } from "@/components/ui/Lightbox";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type DailyEntry = { date: string; tokens: number; commits: number };

type ScorecardProject = (typeof scorecardJson)["projects"][number];

function getDaily(slug: string): DailyEntry[] | null {
  const project = (scorecardJson.projects as readonly ScorecardProject[]).find(
    (p) => p.slug === slug,
  );
  if (!project || !Array.isArray(project.daily)) return null;
  return project.daily as DailyEntry[];
}

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function formatMonthDay(iso: string): string {
  const d = parseIsoDate(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function humanizeTokens(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

const PHASE_RAMP = [
  "var(--ink-primary)",
  "var(--ink-body)",
  "var(--ink-muted)",
  "var(--ink-faint)",
];

export function BuildTimeline({ slug, phases }: { slug: string; phases: Phase[] }) {
  const [open, setOpen] = useState(false);
  if (!phases || phases.length === 0) return null;

  const daily = getDaily(slug) ?? [];
  const dailyMap = new Map(daily.map((d) => [d.date, d]));

  const starts = phases.map((p) => parseIsoDate(p.from));
  const ends = phases.map((p) => parseIsoDate(p.to));
  const startDate = new Date(Math.min(...starts.map((d) => d.getTime())));
  const endDate = new Date(Math.max(...ends.map((d) => d.getTime())));
  const totalDays = daysBetween(startDate, endDate) + 1;

  const maxTokens = daily.reduce((m, d) => Math.max(m, d.tokens ?? 0), 0);
  const maxCommits = daily.reduce((m, d) => Math.max(m, d.commits ?? 0), 0);

  const VIEW_WIDTH = 1000;
  const PHASE_ROW_Y = 44;
  const PHASE_ROW_HEIGHT = 36;
  const DENSITY_ROW_Y = 108;
  const DENSITY_ROW_HEIGHT = 72;
  const AXIS_Y = DENSITY_ROW_Y + DENSITY_ROW_HEIGHT + 24;
  const VIEW_HEIGHT = AXIS_Y + 16;

  const dayWidth = VIEW_WIDTH / totalDays;

  const dayStart = startDate.getTime();
  const days = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(dayStart + i * 86_400_000);
    const iso = d.toISOString().slice(0, 10);
    return { iso, entry: dailyMap.get(iso) ?? { date: iso, tokens: 0, commits: 0 } };
  });

  const ticks: { iso: string; x: number }[] = [];
  const tickCount = Math.min(5, totalDays);
  for (let i = 0; i < tickCount; i++) {
    const idx = Math.round((i / Math.max(1, tickCount - 1)) * (totalDays - 1));
    ticks.push({ iso: days[idx].iso, x: idx * dayWidth + dayWidth / 2 });
  }

  const totalTokens = daily.reduce((s, d) => s + (d.tokens ?? 0), 0);
  const totalCommits = daily.reduce((s, d) => s + (d.commits ?? 0), 0);
  const summary =
    `${totalDays} days from ${formatMonthDay(phases[0].from)} to ${formatMonthDay(
      phases[phases.length - 1].to,
    )}` +
    (totalTokens > 0 ? `, ${humanizeTokens(totalTokens)} tokens` : "") +
    (totalCommits > 0 ? `, ${totalCommits} commits` : "");

  const BASELINE_Y = DENSITY_ROW_Y + DENSITY_ROW_HEIGHT;

  const chartSvg = () => (
    <motion.svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-auto w-full min-w-[600px]"
      role="img"
      aria-label={`Build timeline: ${summary}. ${phases.length} phases: ${phases.map((p) => `${p.name} ${formatMonthDay(p.from)}–${formatMonthDay(p.to)}`).join("; ")}.`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: false, margin: "0px 0px -40px 0px" }}
    >
      {/* Phase bands + labels */}
      {phases.map((phase, i) => {
        const from = parseIsoDate(phase.from);
        const to = parseIsoDate(phase.to);
        const x = daysBetween(startDate, from) * dayWidth;
        const w = (daysBetween(from, to) + 1) * dayWidth;
        const fill = PHASE_RAMP[i % PHASE_RAMP.length];
        const delay = 0.1 + i * 0.08;

        return (
          <g key={`phase-${i}`}>
            <motion.rect
              x={x}
              y={PHASE_ROW_Y}
              width={Math.max(w - 2, 1)}
              height={PHASE_ROW_HEIGHT}
              fill={fill}
              rx={2}
              variants={{
                hidden: { opacity: 0, scaleX: 0 },
                shown: { opacity: 1, scaleX: 1 },
              }}
              transition={{ duration: 0.6, delay, ease: EASE }}
              style={{
                transformOrigin: `${x}px ${PHASE_ROW_Y + PHASE_ROW_HEIGHT / 2}px`,
                transformBox: "fill-box" as const,
              }}
            />
            <motion.text
              x={x + 8}
              y={PHASE_ROW_Y - 8}
              className="font-sans"
              fontSize={11}
              fill="var(--ink-muted)"
              style={{
                letterSpacing: "0.1em",
              }}
              variants={{
                hidden: { opacity: 0, y: -4 },
                shown: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.45, delay: delay + 0.15, ease: EASE }}
            >
              {phase.name}
            </motion.text>
          </g>
        );
      })}

      {/* Density row baseline */}
      <motion.line
        x1={0}
        x2={VIEW_WIDTH}
        y1={BASELINE_Y}
        y2={BASELINE_Y}
        stroke="var(--hairline)"
        strokeWidth={1}
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          shown: { pathLength: 1, opacity: 1 },
        }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
      />

      {/* Daily density bars + commit dots */}
      {days.map((d, i) => {
        const tokens = d.entry.tokens ?? 0;
        const commits = d.entry.commits ?? 0;
        if (tokens === 0 && commits === 0) return null;

        const tokenHeight = maxTokens > 0 ? (tokens / maxTokens) * DENSITY_ROW_HEIGHT : 0;
        const x = i * dayWidth;
        const barWidth = Math.max(dayWidth - 1, 1.5);
        const dayDelay = 0.5 + (i / Math.max(1, days.length - 1)) * 0.6;

        return (
          <g key={`day-${i}`}>
            {tokens > 0 && (
              <motion.rect
                x={x + 0.5}
                width={barWidth}
                fill="var(--ink-primary)"
                opacity={0.7}
                initial={{ y: BASELINE_Y, height: 0 }}
                whileInView={{ y: BASELINE_Y - tokenHeight, height: tokenHeight }}
                viewport={{ once: false, margin: "0px 0px -40px 0px" }}
                transition={{ duration: 0.6, delay: dayDelay, ease: EASE }}
              >
                <title>
                  {d.iso} · {humanizeTokens(tokens)} tokens
                  {commits > 0 ? ` · ${commits} commits` : ""}
                </title>
              </motion.rect>
            )}
            {commits > 0 && (
              <motion.circle
                cx={x + dayWidth / 2}
                cy={BASELINE_Y + 10}
                r={Math.min(3 + commits * 0.4, 6)}
                fill="var(--ink-primary)"
                variants={{
                  hidden: { opacity: 0, scale: 0 },
                  shown: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.4, delay: dayDelay + 0.1, ease: EASE }}
                style={{
                  transformOrigin: `${x + dayWidth / 2}px ${BASELINE_Y + 10}px`,
                  transformBox: "fill-box" as const,
                }}
              >
                <title>
                  {d.iso} · {commits} commits
                </title>
              </motion.circle>
            )}
          </g>
        );
      })}

      {/* X-axis ticks */}
      {ticks.map((t, i) => (
        <motion.text
          key={`tick-${i}`}
          x={t.x}
          y={AXIS_Y + 10}
          className="font-sans"
          fontSize={11}
          fill="var(--ink-muted)"
          textAnchor="middle"
          variants={{
            hidden: { opacity: 0 },
            shown: { opacity: 1 },
          }}
          transition={{ duration: 0.4, delay: 1.1 + i * 0.06, ease: EASE }}
        >
          {formatMonthDay(t.iso)}
        </motion.text>
      ))}
    </motion.svg>
  );

  return (
    <motion.section
      className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-8 md:p-10"
      aria-labelledby="build-timeline-heading"
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id="build-timeline-heading"
          className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]"
        >
          Build timeline
        </h2>
        <p className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
          {summary}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Expand build timeline"
        className="mt-6 block w-full cursor-zoom-in overflow-x-auto rounded-[var(--radius-tile)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--ink-primary)]"
      >
        {chartSvg()}
      </button>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)] md:grid-cols-4">
        <div>
          <dt>Phases</dt>
          <dd className="mt-1 font-serif text-[18px] text-[color:var(--ink-primary)] tabular-nums">
            {phases.length}
          </dd>
        </div>
        <div>
          <dt>Days</dt>
          <dd className="mt-1 font-serif text-[18px] text-[color:var(--ink-primary)] tabular-nums">
            {totalDays}
          </dd>
        </div>
        <div>
          <dt>Peak day</dt>
          <dd className="mt-1 font-serif text-[18px] text-[color:var(--ink-primary)] tabular-nums">
            {maxTokens > 0 ? humanizeTokens(maxTokens) : "—"}
          </dd>
        </div>
        <div>
          <dt>Peak commits</dt>
          <dd className="mt-1 font-serif text-[18px] text-[color:var(--ink-primary)] tabular-nums">
            {maxCommits > 0 ? maxCommits : "—"}
          </dd>
        </div>
      </dl>

      <Lightbox
        open={open}
        onClose={() => setOpen(false)}
        label="Build timeline"
        caption={summary}
      >
        <div className="w-full">{chartSvg()}</div>
      </Lightbox>
    </motion.section>
  );
}
