import { CATEGORY_LABEL, type Tool, type ToolCategory, tools } from "@/content/tools";
import { Reveal } from "@/components/ui/Reveal";

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

export function SkillGrid() {
  const groups = groupByCategory(tools);
  return (
    <div className="flex flex-col gap-14">
      {groups.map(({ cat, items }) => (
        <section key={cat}>
          <div className="mb-5 flex items-baseline gap-3 border-b border-[color:var(--hairline)] pb-2">
            <h3 className="font-sans text-[11px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
              {CATEGORY_LABEL[cat]}
            </h3>
            <span className="font-sans text-[11px] text-[color:var(--ink-muted)] tabular-nums">
              {items.length}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {items.map((t, i) => (
              <Reveal key={t.slug} delay={0.05 + i * 0.03}>
                <SkillCard tool={t} />
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SkillCard({ tool }: { tool: Tool }) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)] md:p-8">
      <header>
        <h4 className="font-serif text-[clamp(22px,2.4vw,30px)] leading-[1.1] text-[color:var(--ink-primary)]">
          {tool.name}
        </h4>
      </header>
      <p className="text-[15px] leading-relaxed text-[color:var(--ink-body)]">
        {tool.description}
      </p>
      <div>
        <div className="mb-1 font-sans text-[10px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          Invocation
        </div>
        <code className="block overflow-x-auto rounded-[var(--radius-tile)] bg-[color:var(--bg-page)] px-3 py-2 font-mono text-[13px] text-[color:var(--ink-primary)]">
          {tool.invocation}
        </code>
      </div>
      <div className="mt-auto">
        <div className="mb-1 font-sans text-[10px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          When to use
        </div>
        <p className="text-[14px] leading-relaxed text-[color:var(--ink-body)]">
          {tool.whenToUse}
        </p>
      </div>
    </article>
  );
}
