import type { Artifact, ArtifactType } from "@/content/blog";

const typeLabel: Record<ArtifactType, string> = {
  commit: "commit",
  pr: "PR",
  screenshot: "screenshot",
  prompt: "prompt",
  cost: "cost",
  timeline: "timeline",
  link: "link",
};

function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

function ArtifactBody({ artifact }: { artifact: Artifact }) {
  if (artifact.href) {
    return (
      <a
        href={artifact.href}
        target={isExternal(artifact.href) ? "_blank" : undefined}
        rel={isExternal(artifact.href) ? "noopener noreferrer" : undefined}
        className="text-[color:var(--ink-primary)] underline underline-offset-4 decoration-[color:var(--outline)] transition-colors hover:decoration-[color:var(--ink-primary)]"
      >
        {artifact.label}
      </a>
    );
  }
  return <span className="text-[color:var(--ink-primary)]">{artifact.label}</span>;
}

export function ArtifactList({ artifacts }: { artifacts: Artifact[] }) {
  if (artifacts.length === 0) return null;
  return (
    <aside className="rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-8">
      <h2 className="font-sans text-xs uppercase tracking-[0.14em] text-[color:var(--ink-muted)]">
        Receipts
      </h2>
      <ul className="mt-4 space-y-3">
        {artifacts.map((a, i) => (
          <li key={`${a.type}-${i}`} className="font-sans text-sm">
            <div className="flex items-baseline gap-2">
              <span className="w-20 shrink-0 font-mono text-[11px] uppercase tracking-wide text-[color:var(--ink-muted)]">
                {typeLabel[a.type]}
              </span>
              <ArtifactBody artifact={a} />
            </div>
            {a.detail && (
              <p className="mt-1 pl-[calc(5rem+0.5rem)] text-[color:var(--ink-muted)]">
                {a.detail}
              </p>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
