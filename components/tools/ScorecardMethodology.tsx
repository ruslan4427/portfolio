type MethodologyItem = {
  metric: string;
  formula: string;
  source: string;
};

const METHODS: MethodologyItem[] = [
  {
    metric: "Discipline",
    formula: "(hasSpec + hasPlan + hasTasks + hasDevlog) / 4",
    source:
      "Binary per criterion. Checked by reading specs/*/{spec,plan,tasks}.md and the top-level DEVLOG.md. Pre-convention projects that score 4/4 ran speckit-era artifacts before ShipLoop existed — tier captures that gap.",
  },
  {
    metric: "Rework ratio",
    formula: "fix_commits ÷ feat_commits",
    source:
      "Pulled from git log with conventional-commit grep: fix / chore(fix) over feat / chore(add). Null when conventional === 0 (no signal, not zero rework). Infinity when fix > 0 but feat === 0.",
  },
  {
    metric: "Time to ship",
    formula: "median(ship_commit_date − spec_frontmatter_date)",
    source:
      "Per feature. Reads `**Date.** YYYY-MM-DD` from each specs/<N>/spec.md, diffs against git log of the matching specs/<N> path. Aggregates to project-level median. Null if no spec dates parseable.",
  },
  {
    metric: "Tokens",
    formula: "input + output + cache_read + cache_creation",
    source:
      "Summed across every assistant message in ~/.claude/projects/<project>/*.jsonl. Face value, not cost. Model attribution by exact ID map first, substring fallback. Tier 0 projects without dedicated session dirs mostly return null — see tokenSource tag.",
  },
  {
    metric: "Expert hit rate",
    formula: "plan_changed_yes ÷ (yes + no)",
    source:
      "Grep DEVLOG for `expert consulted` entries with `plan changed: yes|no` sibling lines. Only Tier 2 projects can score; current readings are null because the convention is young — this will be the next metric to light up.",
  },
];

const TIER_RULES = [
  { tier: "0 · naked", meaning: "No spec, no plan, no DEVLOG. Prompts straight to code." },
  { tier: "1 · self-spec", meaning: "Project-local methodology (test plans, design systems) without institutional ShipLoop." },
  { tier: "2 · ShipLoop", meaning: "Full lifecycle: router → spec → plan → tasks → build → QA → ship → retro." },
];

export function ScorecardMethodology() {
  return (
    <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
      <section className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)] md:p-8">
        <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          Methodology
        </h3>
        <h4 className="mt-3 font-serif text-[clamp(22px,2.4vw,30px)] leading-tight text-[color:var(--ink-primary)]">
          How each number is measured.
        </h4>
        <dl className="mt-6 flex flex-col gap-5">
          {METHODS.map((m) => (
            <div key={m.metric} className="border-t border-[color:var(--hairline)] pt-4 first:border-t-0 first:pt-0">
              <dt className="font-serif text-[18px] leading-tight text-[color:var(--ink-primary)]">
                {m.metric}
              </dt>
              <code className="mt-1 inline-block rounded-[var(--radius-tile)] bg-[color:var(--bg-page)] px-2 py-1 font-mono text-[12px] text-[color:var(--ink-body)]">
                {m.formula}
              </code>
              <dd className="mt-2 text-[14px] leading-relaxed text-[color:var(--ink-body)]">
                {m.source}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="flex flex-col gap-6">
        <section className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)] md:p-8">
          <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
            Tier assignment
          </h3>
          <h4 className="mt-3 font-serif text-[22px] leading-tight text-[color:var(--ink-primary)]">
            Human judgment, not a derived score.
          </h4>
          <dl className="mt-5 flex flex-col gap-4">
            {TIER_RULES.map((t) => (
              <div key={t.tier}>
                <dt className="font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-primary)]">
                  Tier {t.tier}
                </dt>
                <dd className="mt-1 text-[14px] leading-relaxed text-[color:var(--ink-body)]">
                  {t.meaning}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)] md:p-8">
          <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
            Null is honest
          </h3>
          <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--ink-body)]">
            Every cell is either a measurement or a dash. No estimates, no
            vibes, no self-reported numbers to fill the gap. If a signal was
            not reconstructable, the dash is the finding — usually because
            the project predates the convention that would have produced it.
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--ink-body)]">
            The raw receipt lives at{" "}
            <a
              href="/scorecard.json"
              className="underline decoration-[color:var(--outline)] underline-offset-2 hover:text-[color:var(--ink-primary)]"
            >
              /scorecard.json
            </a>
            . The parser that generates it is at{" "}
            <a
              href="https://github.com/ruslan4427/claude-shiploop/tree/main/scripts"
              target="_blank"
              rel="noopener"
              className="underline decoration-[color:var(--outline)] underline-offset-2 hover:text-[color:var(--ink-primary)]"
            >
              claude-shiploop/scripts
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
