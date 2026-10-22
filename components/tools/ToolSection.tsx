import type { ReactNode } from "react";
import type { ToolBuilt, ToolImpactRow } from "@/content/tools-built";
import { InstallBlock } from "./InstallBlock";

const label = "font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]";

function ImpactNumber({ row }: { row: ToolImpactRow }) {
  const measured = row.value !== null;
  return (
    <div className="flex flex-col gap-1.5 border-t-2 border-[color:var(--accent)] pt-3">
      <dt className={label}>{row.label}</dt>
      <dd
        className={`font-serif text-[length:var(--type-display-s)] leading-none tabular-nums ${
          measured ? "text-[color:var(--ink-primary)]" : "text-[color:var(--ink-muted)]"
        }`}
      >
        {row.value ?? "—"}
        {!measured && <span className="sr-only"> (not measured yet)</span>}
      </dd>
      {row.caption && (
        <dd className="text-[length:var(--type-caption)] leading-[1.5] text-[color:var(--ink-body)]">{row.caption}</dd>
      )}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-[length:var(--type-small)] leading-[1.55] text-[color:var(--ink-body)]">
          <span aria-hidden className="mt-[0.7em] h-px w-2.5 flex-none bg-[color:var(--ink-muted)]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Native disclosure in the site's style: summary row with a chevron. */
export function Disclosure({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className="group rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)]">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-[var(--radius-tile)] px-4 font-sans text-sm text-[color:var(--ink-primary)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] [&::-webkit-details-marker]:hidden">
        {summary}
        <span aria-hidden className="text-[color:var(--ink-muted)] transition-transform duration-[var(--dur-fast)] group-open:rotate-180">
          ↓
        </span>
      </summary>
      <div className="flex flex-col gap-6 border-t border-[color:var(--hairline)] px-4 py-5">{children}</div>
    </details>
  );
}

/**
 * One open-source tool: identity + install on the left, what it does and
 * what it measurably changed on the right. Method/baseline detail sits in
 * a disclosure so the numbers read first.
 */
export function ToolSection({
  tool,
  index,
  total,
  children,
}: {
  tool: ToolBuilt;
  index: number;
  total: number;
  children?: ReactNode;
}) {
  const { effectiveness: e } = tool;
  const n = (i: number) => String(i).padStart(2, "0");
  const headingId = `${tool.slug}-heading`;

  return (
    <section
      id={tool.slug}
      aria-labelledby={headingId}
      className="scroll-mt-28 border-t border-[color:var(--hairline)] py-[clamp(56px,8vh,96px)]"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <div className="flex flex-col gap-3">
            <p className={`${label} tabular-nums`}>
              <span className="text-[color:var(--accent)]">{n(index)}</span> / {n(total)} · MIT · open source
            </p>
            <h2 id={headingId} className="font-serif text-[length:var(--type-display-m)] leading-[1.02] text-[color:var(--ink-primary)]">
              {tool.name}
            </h2>
            <p className="text-[length:var(--type-body-l)] leading-[1.5] text-[color:var(--ink-body)]">{tool.tagline}</p>
          </div>
          <a
            href={tool.repoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${tool.name} on GitHub (opens in new tab)`}
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-[var(--radius-pill)] bg-[color:var(--bg-inverse)] px-5 font-sans text-sm text-[color:var(--ink-on-dark)] transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] motion-reduce:transform-none"
          >
            View on GitHub <span aria-hidden>↗</span>
          </a>
          <InstallBlock command={tool.install.command} caption={tool.install.caption} source={tool.slug} />
        </div>

        <div className="flex min-w-0 flex-col gap-10">
          <p className="text-[length:var(--type-body-l)] leading-[1.6] text-[color:var(--ink-primary)]">{tool.description}</p>

          <dl className="grid gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <dt className="font-sans text-sm font-semibold text-[color:var(--ink-primary)]">Why it exists</dt>
              <dd className="text-[length:var(--type-small)] leading-[1.6] text-[color:var(--ink-body)]">{e.why}</dd>
            </div>
            <div className="flex flex-col gap-2">
              <dt className="font-sans text-sm font-semibold text-[color:var(--ink-primary)]">What it systematizes</dt>
              <dd className="text-[length:var(--type-small)] leading-[1.6] text-[color:var(--ink-body)]">{e.systematizes}</dd>
            </div>
          </dl>

          <div className="flex flex-col gap-5">
            <h3 className="font-serif text-[length:var(--type-display-s)] leading-[1.1] text-[color:var(--ink-primary)]">
              What it changed
            </h3>
            {e.impact && e.impact.length > 0 ? (
              <dl className="grid gap-x-6 gap-y-8 sm:grid-cols-3">
                {e.impact.map((row) => (
                  <ImpactNumber key={row.label} row={row} />
                ))}
              </dl>
            ) : (
              <p className="text-[length:var(--type-small)] text-[color:var(--ink-muted)]">— {e.impactNote}</p>
            )}
            {e.analysis && (
              <p className="rounded-[var(--radius-tile)] bg-[color:var(--bg-elevated)] p-5 text-[length:var(--type-small)] leading-[1.6] text-[color:var(--ink-body)] shadow-[var(--shadow-card)]">
                <span className="font-semibold text-[color:var(--ink-primary)]">Bottom line. </span>
                {e.analysis.conclusion}
              </p>
            )}
            {(e.impact?.some((r) => r.method || r.baseline) || e.analysis) && (
              <Disclosure summary="How these are measured">
                {e.impact && (
                  <dl className="flex flex-col gap-5">
                    {e.impact.map((r) => (
                      <div key={r.label} className="flex flex-col gap-1.5">
                        <dt className="font-sans text-sm font-semibold text-[color:var(--ink-primary)]">{r.label}</dt>
                        {r.method && (
                          <dd className="text-[length:var(--type-small)] leading-[1.55] text-[color:var(--ink-body)]">
                            <span className="text-[color:var(--ink-muted)]">Method: </span>
                            {r.method}
                          </dd>
                        )}
                        {r.baseline && (
                          <dd className="text-[length:var(--type-small)] leading-[1.55] text-[color:var(--ink-body)]">
                            <span className="text-[color:var(--ink-muted)]">Baseline: </span>
                            {r.baseline}
                          </dd>
                        )}
                      </div>
                    ))}
                  </dl>
                )}
                {e.analysis && (
                  <div className="grid gap-6 border-t border-[color:var(--hairline)] pt-5 md:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <h4 className="font-sans text-sm font-semibold text-[color:var(--ink-primary)]">What we measure</h4>
                      <Bullets items={e.analysis.measured} />
                    </div>
                    <div className="flex flex-col gap-3">
                      <h4 className="font-sans text-sm font-semibold text-[color:var(--ink-primary)]">Not measured yet</h4>
                      <Bullets items={e.analysis.unmeasured} />
                    </div>
                  </div>
                )}
                {e.parserSource && (
                  <p className="text-[length:var(--type-small)] text-[color:var(--ink-body)]">
                    <a
                      href={e.parserSource.href}
                      target="_blank"
                      rel="noopener"
                      className="underline decoration-[color:var(--outline)] underline-offset-4 hover:decoration-[color:var(--accent)]"
                    >
                      {e.parserSource.label}
                    </a>{" "}
                    — the source for every number above.
                  </p>
                )}
              </Disclosure>
            )}
          </div>

          {children}
        </div>
      </div>
    </section>
  );
}
