import Link from "next/link";

export function BackToWork() {
  return (
    <Link
      href="/work"
      className="fixed left-[var(--gutter)] top-8 z-30 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-3.5 py-1.5 font-sans text-xs text-[color:var(--ink-primary)] shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none"
    >
      <span aria-hidden>←</span>
      <span>Work</span>
    </Link>
  );
}
