import type { ToolBuilt } from "@/content/tools-built";
import { EffectivenessBlock } from "./EffectivenessBlock";

export function ToolCard({ tool }: { tool: ToolBuilt }) {
  return (
    <article className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-8 shadow-[var(--shadow-card)] md:p-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-[clamp(28px,3.6vw,44px)] leading-[1.05] text-[color:var(--ink-primary)]">
            {tool.name}
          </h3>
          <p className="mt-3 max-w-[52ch] text-[17px] leading-relaxed text-[color:var(--ink-body)]">
            {tool.tagline}
          </p>
        </div>
        <a
          href={tool.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[color:var(--outline)] bg-[color:var(--bg-page)] px-4 py-2 font-sans text-[12px] uppercase tracking-[0.14em] text-[color:var(--ink-primary)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40"
          aria-label={`Open ${tool.name} on GitHub (opens in new tab)`}
        >
          GitHub ↗
        </a>
      </header>

      <p className="mt-6 max-w-[64ch] text-[15px] leading-relaxed text-[color:var(--ink-body)]">
        {tool.description}
      </p>

      <div className="mt-6">
        <div className="mb-1 font-sans text-[10px] uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
          Install
        </div>
        <code className="block overflow-x-auto rounded-[var(--radius-tile)] bg-[color:var(--bg-page)] px-3 py-2 font-mono text-[13px] text-[color:var(--ink-primary)]">
          {tool.install.command}
        </code>
        {tool.install.caption && (
          <p className="mt-2 font-sans text-[12px] leading-relaxed text-[color:var(--ink-muted)]">
            {tool.install.caption}
          </p>
        )}
      </div>

      <EffectivenessBlock
        why={tool.effectiveness.why}
        systematizes={tool.effectiveness.systematizes}
        impact={tool.effectiveness.impact}
        impactNote={tool.effectiveness.impactNote}
        parserSource={tool.effectiveness.parserSource}
      />
    </article>
  );
}
