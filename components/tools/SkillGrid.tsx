import { CATEGORY_LABEL, type Tool, type ToolCategory, tools } from "@/content/tools";

const CATEGORY_ORDER: ToolCategory[] = ["entry", "lifecycle", "quality", "meta"];

function groupByCategory(ts: Tool[]) {
  const groups = new Map<ToolCategory, Tool[]>();
  for (const t of ts) {
    const arr = groups.get(t.category) ?? [];
    arr.push(t);
    groups.set(t.category, arr);
  }
  return CATEGORY_ORDER
    .map((cat) => ({ cat, items: groups.get(cat) ?? [] }))
    .filter((g) => g.items.length > 0);
}

/** ShipLoop's commands as compact rows, grouped by lifecycle stage. */
export function SkillGrid() {
  const groups = groupByCategory(tools);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h3 className="font-serif text-[length:var(--type-display-s)] leading-[1.1] text-[color:var(--ink-primary)]">
          What&rsquo;s inside · {tools.length} commands
        </h3>
        <p className="text-[length:var(--type-small)] leading-[1.55] text-[color:var(--ink-muted)]">
          Plus the domain-expert subagent that <span className="text-[color:var(--ink-primary)]">/shiploop-expert</span> calls — eight parts in all.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        {groups.map(({ cat, items }) => (
          <section key={cat} aria-labelledby={`skills-${cat}`} className="flex flex-col gap-1">
            <h4 id={`skills-${cat}`} className="font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)]">
              {CATEGORY_LABEL[cat]} · {items.length}
            </h4>
            <ul className="flex flex-col">
              {items.map((t) => (
                <li key={t.slug} className="flex flex-col gap-2 border-t border-[color:var(--hairline)] py-4">
                  <p className="font-sans text-[length:var(--type-title)] font-semibold leading-tight text-[color:var(--ink-primary)]">
                    {t.name}
                  </p>
                  <p className="text-[length:var(--type-small)] leading-[1.6] text-[color:var(--ink-body)]">{t.description}</p>
                  <p className="text-[length:var(--type-small)] leading-[1.6] text-[color:var(--ink-body)]">
                    <span className="text-[color:var(--ink-muted)]">Use when: </span>
                    {t.whenToUse}
                  </p>
                  <code className="w-fit max-w-full overflow-x-auto rounded-[var(--radius-inline)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-2 py-1 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-primary)]">
                    {t.invocation}
                  </code>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
