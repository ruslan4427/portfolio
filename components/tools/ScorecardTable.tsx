import scorecardJson from "@/scorecard.json";

type Scorecard = typeof scorecardJson;
type ScorecardProject = Scorecard["projects"][number];
type Tier = 0 | 1 | 2;
type Archetype = "saas-app" | "automation" | "llm-skill" | "design-tool";

const TIER_LABEL: Record<Tier, string> = {
  0: "0 · naked",
  1: "1 · self-spec",
  2: "2 · ShipLoop",
};

const ARCHETYPE_LABEL: Record<Archetype, string> = {
  "saas-app": "SaaS",
  automation: "Automation",
  "llm-skill": "LLM Skill",
  "design-tool": "Design",
};

const METRIC_LABEL = [
  { key: "disciplineScore" as const, label: "Discipline", caption: "spec+plan+tasks+DEVLOG" },
  { key: "reworkRatio" as const, label: "Rework", caption: "fix ÷ feat" },
  { key: "timeToShipDays" as const, label: "Time to ship", caption: "median days, spec → ship" },
  { key: "tokens" as const, label: "Tokens", caption: "sum across sessions" },
  { key: "expertHitRate" as const, label: "Expert hit rate", caption: "plan-changed ÷ consulted" },
];

const HYGIENE_LABEL = [
  { key: "workflowsHealthy" as const, label: "Workflows", caption: "last main run per workflow" },
  { key: "secretScanPass" as const, label: "Secrets", caption: "GitHub secret scanning alerts" },
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
      className={`inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-0.5 font-sans text-[length:var(--type-caption)] ${toneClass}`}
    >
      Tier {TIER_LABEL[tier]}
    </span>
  );
}

function ArchetypePill({ archetype }: { archetype: Archetype | null | undefined }) {
  if (!archetype) return null;
  return (
    <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-[color:var(--hairline)] bg-[color:var(--bg-page)] px-2.5 py-0.5 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
      {ARCHETYPE_LABEL[archetype]}
    </span>
  );
}

function HygieneDot({ value }: { value: boolean | null | undefined }) {
  const [mark, word, tone] =
    value === true
      ? ["✓", "pass", "font-semibold text-[color:var(--ink-primary)]"]
      : value === false
        ? ["✕", "fail", "text-[color:var(--ink-muted)]"]
        : ["—", "not measured", "text-[color:var(--ink-muted)]"];
  return (
    <span className={`font-sans text-[length:var(--type-small)] leading-none ${tone}`}>
      <span aria-hidden>{mark}</span>
      <span className="sr-only">{word}</span>
    </span>
  );
}

function HygieneCell({
  value,
  project,
}: {
  value: boolean | null | undefined;
  project: ScorecardProject;
}) {
  const isNull = value === null || value === undefined;
  return (
    <td
      className="border-t border-[color:var(--hairline)] px-3 py-4 align-top"
      title={isNull ? project.notes : undefined}
    >
      <HygieneDot value={value} />
    </td>
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
        <div className="mt-1 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
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
      <p className="mb-4 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
        {projects.length} projects · generated {generated} · ✓ pass · ✕ fail · — not measured
      </p>

      {/* ───── Desktop table (≥ md) ───── */}
      <div
        tabIndex={0}
        role="region"
        aria-label="Scorecard table"
        className="hidden overflow-x-auto rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] md:block">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-4 py-4 text-left font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]"
              >
                Project
              </th>
              {METRIC_LABEL.map((m) => (
                <th
                  key={m.key}
                  scope="col"
                  className="px-3 py-4 text-left font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]"
                >
                  <div className="font-semibold text-[color:var(--ink-primary)]">{m.label}</div>
                  <div className="mt-0.5 text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
                    {m.caption}
                  </div>
                </th>
              ))}
              {HYGIENE_LABEL.map((h) => (
                <th
                  key={h.key}
                  scope="col"
                  className="px-3 py-4 text-left font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]"
                >
                  <div className="font-semibold text-[color:var(--ink-primary)]">{h.label}</div>
                  <div className="mt-0.5 text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
                    {h.caption}
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
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <TierPill tier={p.tier as Tier} />
                    <ArchetypePill archetype={p.context.archetype as Archetype | undefined} />
                  </div>
                  <div className="mt-2 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
                    {p.context.complexity} · {p.context.duration}
                  </div>
                </th>
                {METRIC_LABEL.map((m) => (
                  <Cell key={m.key} metricKey={m.key} project={p} />
                ))}
                {HYGIENE_LABEL.map((h) => (
                  <HygieneCell
                    key={h.key}
                    value={p.metrics.hygiene?.[h.key] as boolean | null | undefined}
                    project={p}
                  />
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
              <h3 className="font-serif text-[22px] leading-tight text-[color:var(--ink-primary)]">
                {p.name}
              </h3>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <TierPill tier={p.tier as Tier} />
                <ArchetypePill archetype={p.context.archetype as Archetype | undefined} />
              </div>
              <div className="mt-2 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
                {p.context.complexity} · {p.context.duration}
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
                    <dt className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
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
                        <span className="mt-1 block font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
                          {p.context.tokenSource.replace(/-/g, " ")}
                        </span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <div className="mt-3 flex flex-wrap items-center gap-4 rounded-[var(--radius-tile)] bg-[color:var(--bg-page)] px-3 py-2.5">
              <span className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
                Health
              </span>
              {HYGIENE_LABEL.map((h) => (
                <span key={h.key} className="inline-flex items-center gap-1.5">
                  <HygieneDot value={p.metrics.hygiene?.[h.key] as boolean | null | undefined} />
                  <span className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-body)]">{h.label}</span>
                </span>
              ))}
            </div>
            {p.notes && (
              <p className="mt-4 font-sans text-[length:var(--type-caption)] leading-relaxed text-[color:var(--ink-muted)]">
                {p.notes}
              </p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
