import type { ToolImpactRow } from "@/content/tools-built";

type Props = {
  why: string;
  systematizes: string;
  impact: ToolImpactRow[] | null;
  impactNote?: string;
};

function PairRow({ label, value, caption }: ToolImpactRow) {
  const measured = value !== null;
  return (
    <div className="flex flex-col gap-1 rounded-[var(--radius-tile)] bg-[color:var(--bg-page)] p-4">
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
        <p className="font-sans text-[12px] leading-relaxed text-[color:var(--ink-muted)]">
          {caption}
        </p>
      )}
    </div>
  );
}

export function EffectivenessBlock({ why, systematizes, impact, impactNote }: Props) {
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
              <PairRow key={row.label} label={row.label} value={row.value} caption={row.caption} />
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
      </div>
    </div>
  );
}
