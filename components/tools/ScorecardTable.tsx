import scorecardJson from "@/scorecard.json";

type Scorecard = typeof scorecardJson;
type ScorecardProject = Scorecard["projects"][number];
type Tier = 0 | 1 | 2;

const TIER_LABEL: Record<Tier, string> = {
  0: "0 · naked",
  1: "1 · self-spec",
  2: "2 · ShipLoop",
};

const METRIC_LABEL = [
  { key: "disciplineScore" as const, label: "Discipline", caption: "spec+plan+tasks+DEVLOG" },
  { key: "reworkRatio" as const, label: "Rework", caption: "fix ÷ feat" },
  { key: "timeToShipDays" as const, label: "Time to ship", caption: "median days, spec → ship" },
  { key: "tokens" as const, label: "Tokens", caption: "sum across sessions" },
  { key: "expertHitRate" as const, label: "Expert hit rate", caption: "plan-changed ÷ consulted" },
];

function humanizeTokens(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function formatMetric(key: typeof METRIC_LABEL[number]["key"], value: number | null): string {
  if (value === null || value === undefined) return "—";
  switch (key) {
    case "disciplineScore":
      return `${Math.round(value * 100)}%`;
    case "reworkRatio":
      return value.toFixed(2);
    case "timeToShipDays":
      return `${value}d`;
    case "tokens":
      return humanizeTokens(value);
    case "expertHitRate":
      return `${Math.round(value * 100)}%`;
  }
}

function TierPill({ tier }: { tier: Tier }) {
  const toneClass =
    tier === 2
      ? "bg-[color:var(--ink-primary)] text-[color:var(--bg-page)]"
      : tier === 1
        ? "border border-[color:var(--outline)] bg-[color:var(--bg-page)] text-[color:var(--ink-primary)]"
        : "border border-[color:var(--hairline)] bg-[color:var(--bg-page)] text-[color:var(--ink-muted)]";
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-0.5 font-sans text-[10px] uppercase tracking-[0.1em] ${toneClass}`}
    >
      Tier {TIER_LABEL[tier]}
    </span>
  );
}

function Cell({
  metricKey,
  project,
}: {
  metricKey: typeof METRIC_LABEL[number]["key"];
  project: ScorecardProject;
}) {
  const value = project.metrics[metricKey];
  const formatted = formatMetric(metricKey, value as number | null);
  const isNull = value === null || value === undefined;
  const titleAttr = isNull ? project.notes : undefined;
  const tokenSource =
    metricKey === "tokens" && !isNull ? project.context.tokenSource : null;

  return (
    <td
      className="border-t border-[color:var(--hairline)] px-3 py-4 align-top"
      title={titleAttr}
    >
      <div
        className={`font-serif text-[22px] leading-none tabular-nums ${
          isNull ? "text-[color:var(--ink-muted)]" : "text-[color:var(--ink-primary)]"
        }`}
      >
        {formatted}
      </div>
      {tokenSource && (
        <div className="mt-1 font-sans text-[10px] uppercase tracking-[0.1em] text-[color:var(--ink-muted)]">
          {tokenSource.replace(/-/g, " ")}
        </div>
      )}
    </td>
  );
}

export function ScorecardTable() {
  const projects = scorecardJson.projects as readonly ScorecardProject[];
  const generated = new Date(scorecardJson.generatedAt).toISOString().slice(0, 10);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h3 className="font-serif text-[clamp(28px,3vw,40px)] leading-[1.05] text-[color:var(--ink-primary)]">
            Scorecard.
          </h3>
          <p className="mt-2 max-w-[48ch] text-[15px] leading-relaxed text-[color:var(--ink-body)]">
            Seven projects across three discipline tiers. Numbers are measured
            from git logs, DEVLOGs, and Claude Code session files — never
            self-reported. Null is honest; it means the signal was not
            reconstructable, not that the project failed.
          </p>
        </div>
        <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          Generated {generated}
        </div>
      </div>

      {/* ───── Desktop table (≥ md) ───── */}
      <div className="hidden overflow-x-auto rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] shadow-[var(--shadow-card)] md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-4 py-4 text-left font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]"
              >
                Project
              </th>
              {METRIC_LABEL.map((m) => (
                <th
                  key={m.key}
                  scope="col"
                  className="px-3 py-4 text-left font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]"
                >
                  <div>{m.label}</div>
                  <div className="mt-0.5 text-[10px] normal-case tracking-normal text-[color:var(--ink-muted)]">
                    {m.caption}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.slug}>
                <th
                  scope="row"
                  className="border-t border-[color:var(--hairline)] px-4 py-4 text-left align-top"
                >
                  <div className="font-serif text-[18px] leading-tight text-[color:var(--ink-primary)]">
                    {p.name}
                  </div>
                  <div className="mt-1.5">
                    <TierPill tier={p.tier as Tier} />
                  </div>
                  <div className="mt-2 font-sans text-[11px] text-[color:var(--ink-muted)]">
                    {p.context.complexity} · {p.context.duration}
                  </div>
                </th>
                {METRIC_LABEL.map((m) => (
                  <Cell key={m.key} metricKey={m.key} project={p} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ───── Mobile cards (< md) ───── */}
      <div className="flex flex-col gap-4 md:hidden">
        {projects.map((p) => (
          <article
            key={p.slug}
            className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-5 shadow-[var(--shadow-card)]"
          >
            <header className="mb-4">
              <h4 className="font-serif text-[22px] leading-tight text-[color:var(--ink-primary)]">
                {p.name}
              </h4>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <TierPill tier={p.tier as Tier} />
                <span className="font-sans text-[11px] text-[color:var(--ink-muted)]">
                  {p.context.complexity} · {p.context.duration}
                </span>
              </div>
            </header>
            <dl className="grid grid-cols-2 gap-3">
              {METRIC_LABEL.map((m) => {
                const value = p.metrics[m.key] as number | null;
                const isNull = value === null || value === undefined;
                return (
                  <div
                    key={m.key}
                    className="rounded-[var(--radius-tile)] bg-[color:var(--bg-page)] p-3"
                    title={isNull ? p.notes : undefined}
                  >
                    <dt className="font-sans text-[10px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
                      {m.label}
                    </dt>
                    <dd
                      className={`mt-1 font-serif text-[20px] leading-none tabular-nums ${
                        isNull
                          ? "text-[color:var(--ink-muted)]"
                          : "text-[color:var(--ink-primary)]"
                      }`}
                    >
                      {formatMetric(m.key, value)}
                      {m.key === "tokens" && !isNull && (
                        <span className="mt-1 block font-sans text-[9px] uppercase tracking-[0.1em] text-[color:var(--ink-muted)]">
                          {p.context.tokenSource.replace(/-/g, " ")}
                        </span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
            {p.notes && (
              <p className="mt-4 font-sans text-[12px] leading-relaxed text-[color:var(--ink-muted)]">
                {p.notes}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
