import type { TokenScorecard, TokenScorecardModelMix } from "@/content/case-studies";

const TIER_LABEL: Record<0 | 1 | 2, string> = {
  0: "0 · naked",
  1: "1 · self-spec",
  2: "2 · ShipLoop",
};

const MODEL_LABEL: Record<keyof TokenScorecardModelMix, string> = {
  opus: "Opus",
  sonnet: "Sonnet",
  haiku: "Haiku",
};

function humanizeTokens(n: number): { value: string; unit: string } {
  if (n >= 1_000_000_000) return { value: (n / 1_000_000_000).toFixed(2), unit: "B tokens" };
  if (n >= 1_000_000) return { value: (n / 1_000_000).toFixed(1), unit: "M tokens" };
  if (n >= 1_000) return { value: (n / 1_000).toFixed(1), unit: "k tokens" };
  return { value: String(n), unit: "tokens" };
}

function MixBar({ mix }: { mix: TokenScorecardModelMix }) {
  const entries = (Object.keys(MODEL_LABEL) as Array<keyof TokenScorecardModelMix>)
    .map((k) => ({ key: k, pct: mix[k] ?? 0 }))
    .filter((e) => e.pct > 0);
  if (entries.length === 0) return null;
  return (
    <div className="mt-5">
      <div
        className="flex h-1.5 w-full overflow-hidden rounded-[var(--radius-pill)] bg-[color:var(--hairline)]"
        role="img"
        aria-label={`Model mix: ${entries.map((e) => `${e.pct}% ${MODEL_LABEL[e.key]}`).join(", ")}`}
      >
        {entries.map((e, i) => (
          <span
            key={e.key}
            style={{ width: `${e.pct}%` }}
            className={`block h-full ${
              i === 0
                ? "bg-[color:var(--ink-primary)]"
                : i === 1
                  ? "bg-[color:var(--ink-body)]"
                  : "bg-[color:var(--ink-muted)]"
            }`}
          />
        ))}
      </div>
      <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-sans text-[11px] uppercase tracking-wide text-[color:var(--ink-muted)]">
        {entries.map((e) => (
          <div key={e.key} className="flex items-baseline gap-1.5">
            <dt>{MODEL_LABEL[e.key]}</dt>
            <dd className="tabular-nums text-[color:var(--ink-body)]">{e.pct}%</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function TokenScorecardAside({ scorecard }: { scorecard?: TokenScorecard }) {
  if (!scorecard) return null;
  const measured = scorecard.tokens !== null;
  const humanized = measured ? humanizeTokens(scorecard.tokens as number) : null;

  return (
    <aside className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-8">
      <h2 className="font-sans text-xs uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
        Token scorecard
      </h2>

      {humanized ? (
        <div className="mt-5 flex items-baseline gap-2">
          <span className="font-serif text-5xl leading-none text-[color:var(--ink-primary)] tabular-nums">
            {humanized.value}
          </span>
          <span className="font-sans text-sm text-[color:var(--ink-muted)]">
            {humanized.unit}
          </span>
        </div>
      ) : (
        <div className="mt-5">
          <div className="font-serif text-3xl leading-tight text-[color:var(--ink-muted)]">
            unmeasurable
          </div>
          <p className="mt-2 max-w-[32ch] font-sans text-xs text-[color:var(--ink-muted)]">
            Pre-ShipLoop sessions ran in shared home-dir logs; token attribution
            isn’t reconstructable (spec §10.1 bail-out).
          </p>
        </div>
      )}

      <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-sans text-xs text-[color:var(--ink-muted)]">
        <div className="flex items-baseline gap-1.5">
          <dt className="uppercase tracking-wide">Complexity</dt>
          <dd className="text-[color:var(--ink-body)]">{scorecard.complexity}</dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="uppercase tracking-wide">Duration</dt>
          <dd className="text-[color:var(--ink-body)]">{scorecard.duration}</dd>
        </div>
        <div className="flex items-baseline gap-1.5">
          <dt className="uppercase tracking-wide">Tier</dt>
          <dd className="text-[color:var(--ink-body)]">{TIER_LABEL[scorecard.tier]}</dd>
        </div>
      </dl>

      <MixBar mix={scorecard.modelMix} />
    </aside>
  );
}
