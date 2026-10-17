import type { Phase } from "@/content/case-studies";
import scorecardJson from "@/scorecard.json";

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

  return (
    <section
      className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-8 md:p-10"
      aria-labelledby="build-timeline-heading"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2
          id="build-timeline-heading"
          className="font-sans text-xs uppercase tracking-[0.14em] text-[color:var(--ink-muted)]"
        >
          Build timeline
        </h2>
        <p className="font-sans text-[11px] uppercase tracking-wide text-[color:var(--ink-muted)]">
          {summary}
        </p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="h-auto w-full min-w-[600px]"
          role="img"
          aria-label={`Build timeline: ${summary}. ${phases.length} phases: ${phases.map((p) => `${p.name} ${formatMonthDay(p.from)}–${formatMonthDay(p.to)}`).join("; ")}.`}
        >
          {/* Phase bands */}
          {phases.map((phase, i) => {
            const from = parseIsoDate(phase.from);
            const to = parseIsoDate(phase.to);
            const x = daysBetween(startDate, from) * dayWidth;
            const w = (daysBetween(from, to) + 1) * dayWidth;
            const fill = PHASE_RAMP[i % PHASE_RAMP.length];

            return (
              <g key={`phase-${i}`}>
                <rect
                  x={x}
                  y={PHASE_ROW_Y}
                  width={Math.max(w - 2, 1)}
                  height={PHASE_ROW_HEIGHT}
                  fill={fill}
                  rx={2}
                />
                <text
                  x={x + 8}
                  y={PHASE_ROW_Y - 8}
                  className="font-sans"
                  fontSize={11}
                  fill="var(--ink-muted)"
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {phase.name}
                </text>
              </g>
            );
          })}

          {/* Density row baseline */}
          <line
            x1={0}
            x2={VIEW_WIDTH}
            y1={DENSITY_ROW_Y + DENSITY_ROW_HEIGHT}
            y2={DENSITY_ROW_Y + DENSITY_ROW_HEIGHT}
            stroke="var(--hairline)"
            strokeWidth={1}
          />

          {/* Daily density bars */}
          {days.map((d, i) => {
            const tokens = d.entry.tokens ?? 0;
            const commits = d.entry.commits ?? 0;
            if (tokens === 0 && commits === 0) return null;

            const tokenHeight = maxTokens > 0 ? (tokens / maxTokens) * DENSITY_ROW_HEIGHT : 0;
            const commitDot = commits > 0;
            const x = i * dayWidth;
            const barWidth = Math.max(dayWidth - 1, 1.5);

            return (
              <g key={`day-${i}`}>
                {tokens > 0 && (
                  <rect
                    x={x + 0.5}
                    y={DENSITY_ROW_Y + DENSITY_ROW_HEIGHT - tokenHeight}
                    width={barWidth}
                    height={tokenHeight}
                    fill="var(--ink-primary)"
                    opacity={0.7}
                  >
                    <title>
                      {d.iso} · {humanizeTokens(tokens)} tokens
                      {commits > 0 ? ` · ${commits} commits` : ""}
                    </title>
                  </rect>
                )}
                {commitDot && (
                  <circle
                    cx={x + dayWidth / 2}
                    cy={DENSITY_ROW_Y + DENSITY_ROW_HEIGHT + 10}
                    r={Math.min(3 + commits * 0.4, 6)}
                    fill="var(--ink-primary)"
                  >
                    <title>
                      {d.iso} · {commits} commits
                    </title>
                  </circle>
                )}
              </g>
            );
          })}

          {/* X-axis ticks */}
          {ticks.map((t, i) => (
            <text
              key={`tick-${i}`}
              x={t.x}
              y={AXIS_Y + 10}
              className="font-sans"
              fontSize={11}
              fill="var(--ink-muted)"
              textAnchor="middle"
            >
              {formatMonthDay(t.iso)}
            </text>
          ))}
        </svg>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 font-sans text-xs text-[color:var(--ink-muted)] md:grid-cols-4">
        <div>
          <dt className="uppercase tracking-wide">Phases</dt>
          <dd className="mt-1 font-serif text-[18px] text-[color:var(--ink-primary)] tabular-nums">
            {phases.length}
          </dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide">Days</dt>
          <dd className="mt-1 font-serif text-[18px] text-[color:var(--ink-primary)] tabular-nums">
            {totalDays}
          </dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide">Peak day</dt>
          <dd className="mt-1 font-serif text-[18px] text-[color:var(--ink-primary)] tabular-nums">
            {maxTokens > 0 ? humanizeTokens(maxTokens) : "—"}
          </dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide">Peak commits</dt>
          <dd className="mt-1 font-serif text-[18px] text-[color:var(--ink-primary)] tabular-nums">
            {maxCommits > 0 ? maxCommits : "—"}
          </dd>
        </div>
      </dl>
    </section>
  );
}
