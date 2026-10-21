import type { CaseLensData } from "@/content/case-lenses";
import type { TokenScorecard } from "@/content/case-studies";

const MIX_LABEL = { opus: "Opus", sonnet: "Sonnet", haiku: "Haiku" } as const;
// Decorative bars only — the labels below carry the values.
const MIX_INK = ["var(--ink-primary)", "var(--ink-muted)", "var(--ink-faint)"];

function formatTokens(tokens: number | null | undefined): string {
  if (tokens == null) return "tokens not measured";
  if (tokens >= 1_000_000) return `~${(tokens / 1_000_000).toFixed(1)}M tokens`;
  return `~${Math.round(tokens / 1000)}k tokens`;
}

const tile =
  "flex min-w-0 flex-col gap-3 rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6";
const label = "font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]";

export function GlanceBento({
  glance,
  stack,
  scorecard,
}: {
  glance: CaseLensData["glance"];
  stack: string[];
  scorecard?: TokenScorecard;
}) {
  const mix = scorecard
    ? (Object.entries(scorecard.modelMix) as [keyof typeof MIX_LABEL, number][])
        .filter(([, v]) => v > 0)
        .sort((a, b) => b[1] - a[1])
    : [];

  return (
    <section aria-label="At a glance" className="flex flex-wrap gap-4">
      <div className={`${tile} flex-[2_1_520px] p-7`}>
        <span className={label}>The problem</span>
        <p className="text-[length:var(--type-body-l)] leading-[1.5] text-[color:var(--ink-primary)]">
          {glance.problem}
        </p>
      </div>
      <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-3 rounded-[var(--radius-card)] bg-[color:var(--bg-inverse)] p-7 text-[color:var(--ink-on-dark)]">
        <span className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-on-dark-muted)]">
          The outcome
        </span>
        <p className="font-serif text-[28px] leading-[1.15]">{glance.outcome}</p>
      </div>
      <div className={`${tile} flex-[1_1_260px]`}>
        <span className={label}>Built with</span>
        <ul className="flex flex-wrap gap-2">
          {stack.map((t) => (
            <li
              key={t}
              className="rounded-[var(--radius-pill)] border border-[color:var(--outline)] px-3 py-1 font-sans text-sm text-[color:var(--ink-primary)]"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className={`${tile} flex-[1_1_260px] gap-2`}>
        <span className={label}>Timeline</span>
        <span className="font-serif text-[28px] leading-[1.1] text-[color:var(--ink-primary)]">
          {glance.time}
        </span>
        <span className="font-sans text-sm text-[color:var(--ink-body)]">{glance.timeNote}</span>
      </div>
      {scorecard && (
        <div className={`${tile} flex-[1_1_320px]`}>
          <div className="flex items-baseline justify-between gap-2">
            <span className={label}>Made with Claude</span>
            <span className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-primary)]">
              {formatTokens(scorecard.tokens)}
            </span>
          </div>
          <div aria-hidden className="flex h-2.5 gap-0.5 overflow-hidden rounded-[var(--radius-inline)]">
            {mix.map(([k, v], i) => (
              <span key={k} style={{ flex: `${v} 1 0`, background: MIX_INK[i] }} />
            ))}
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1.5 font-sans text-sm text-[color:var(--ink-body)]">
            {mix.map(([k, v]) => (
              <li key={k}>
                {MIX_LABEL[k]} {v}%
              </li>
            ))}
          </ul>
          <a
            href="#how-it-was-made"
            className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)] underline decoration-[color:var(--outline)] underline-offset-4 hover:text-[color:var(--ink-primary)]"
          >
            {scorecard.duration} · how it was made
          </a>
        </div>
      )}
    </section>
  );
}
