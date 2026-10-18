import type { ToolAnalysis, ToolImpactRow } from "@/content/tools-built";

type Props = {
  why: string;
  systematizes: string;
  impact: ToolImpactRow[] | null;
  impactNote?: string;
  parserSource?: { label: string; href: string };
  analysis?: ToolAnalysis;
};

function PairRow({ label, value, caption, method, baseline }: ToolImpactRow) {
  const measured = value !== null;
  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius-tile)] bg-[color:var(--bg-page)] p-4">
      <dt className="font-sans text-[10px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
        {label}
      </dt>
      <dd
        className={`font-serif text-[26px] leading-none tabular-nums ${
          measured ? "text-[color:var(--ink-primary)]" : "text-[color:var(--ink-muted)]"
        }`}
      >
        {value ?? "—"}
      </dd>
      {caption && (
        <p className="font-sans text-[12px] leading-relaxed text-[color:var(--ink-body)]">
          {caption}
        </p>
      )}
      {(method || baseline) && (
        <div className="mt-1 flex flex-col gap-1.5 border-t border-[color:var(--hairline)] pt-2">
          {method && (
            <p className="font-sans text-[11px] leading-snug text-[color:var(--ink-muted)]">
              <span className="font-medium uppercase tracking-[0.1em] text-[color:var(--ink-primary)]/70">
                Method ·{" "}
              </span>
              {method}
            </p>
          )}
          {baseline && (
            <p className="font-sans text-[11px] leading-snug text-[color:var(--ink-muted)]">
              <span className="font-medium uppercase tracking-[0.1em] text-[color:var(--ink-primary)]/70">
                Baseline ·{" "}
              </span>
              {baseline}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function EffectivenessBlock({
  why,
  systematizes,
  impact,
  impactNote,
  parserSource,
  analysis,
}: Props) {
  return (
    <div className="mt-6 rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6">
      <h4 className="font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
        Effectiveness
      </h4>

      <dl className="mt-4 grid gap-5 md:grid-cols-2">
        <div>
          <dt className="font-sans text-[11px] uppercase tracking-wide text-[color:var(--ink-muted)]">
            Why it exists
          </dt>
          <dd className="mt-2 text-[14px] leading-relaxed text-[color:var(--ink-body)]">{why}</dd>
        </div>
        <div>
          <dt className="font-sans text-[11px] uppercase tracking-wide text-[color:var(--ink-muted)]">
            What it systematizes
          </dt>
          <dd className="mt-2 text-[14px] leading-relaxed text-[color:var(--ink-body)]">
            {systematizes}
          </dd>
        </div>
      </dl>

      <div className="mt-6 border-t border-[color:var(--hairline)] pt-5">
        <h5 className="font-sans text-[11px] uppercase tracking-wide text-[color:var(--ink-muted)]">
          Measured impact
        </h5>
        {impact && impact.length > 0 ? (
          <dl className="mt-3 grid gap-3 md:grid-cols-3">
            {impact.map((row) => (
              <PairRow
                key={row.label}
                label={row.label}
                value={row.value}
                caption={row.caption}
                method={row.method}
                baseline={row.baseline}
              />
            ))}
          </dl>
        ) : (
          <div className="mt-3 rounded-[var(--radius-tile)] bg-[color:var(--bg-page)] p-4">
            <div className="font-serif text-[26px] leading-none text-[color:var(--ink-muted)]">
              —
            </div>
            {impactNote && (
              <p className="mt-2 font-sans text-[13px] leading-relaxed text-[color:var(--ink-muted)]">
                {impactNote}
              </p>
            )}
          </div>
        )}
        {parserSource && (
          <p className="mt-4 font-sans text-[12px] leading-relaxed text-[color:var(--ink-muted)]">
            →{" "}
            <a
              href={parserSource.href}
              target="_blank"
              rel="noopener"
              className="underline decoration-[color:var(--outline)] underline-offset-2 hover:text-[color:var(--ink-primary)]"
            >
              {parserSource.label}
            </a>{" "}
            — the ground-truth source for every number above.
          </p>
        )}
      </div>

      {analysis && (
        <div className="mt-6 border-t border-[color:var(--hairline)] pt-5">
          <h5 className="font-sans text-[11px] uppercase tracking-wide text-[color:var(--ink-muted)]">
            Analysis
          </h5>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <h6 className="font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-primary)]/70">
                What we measure
              </h6>
              <ul className="mt-2 space-y-2 font-sans text-[13px] leading-relaxed text-[color:var(--ink-body)]">
                {analysis.measured.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[0.5em] inline-block h-1 w-1 flex-none rounded-full bg-[color:var(--ink-primary)]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h6 className="font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-primary)]/70">
                What we don&rsquo;t yet measure
              </h6>
              <ul className="mt-2 space-y-2 font-sans text-[13px] leading-relaxed text-[color:var(--ink-body)]">
                {analysis.unmeasured.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-[0.6em] inline-block h-[1px] w-2 flex-none bg-[color:var(--ink-muted)]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-5 rounded-[var(--radius-tile)] bg-[color:var(--bg-page)] p-4">
            <h6 className="font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
              Conclusion
            </h6>
            <p className="mt-2 font-sans text-[13px] leading-relaxed text-[color:var(--ink-body)]">
              {analysis.conclusion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
