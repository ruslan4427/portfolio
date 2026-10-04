import type { DevlogRef } from "@/content/case-studies";

export function DevlogRefs({ refs }: { refs: DevlogRef[] }) {
  if (refs.length === 0) return null;
  return (
    <section className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-8">
      <h2 className="font-sans text-xs uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
        Process log
      </h2>
      <ul className="mt-6 space-y-4">
        {refs.map((r, i) => (
          <li key={`${r.date}-${i}`} className="border-l-2 border-[color:var(--hairline)] pl-4">
            <div className="flex items-baseline gap-3 font-sans text-xs text-[color:var(--ink-muted)] tabular-nums">
              <time dateTime={r.date}>{r.date}</time>
              <span aria-hidden>·</span>
              <span className="font-serif text-sm text-[color:var(--ink-primary)]">
                {r.entry}
              </span>
            </div>
            <p className="mt-1 text-sm text-[color:var(--ink-body)]">
              {r.href ? (
                <a
                  href={r.href}
                  target={r.href.startsWith("http") ? "_blank" : undefined}
                  rel={r.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="underline underline-offset-4 decoration-[color:var(--outline)] hover:decoration-[color:var(--ink-primary)]"
                >
                  {r.summary}
                </a>
              ) : (
                r.summary
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
