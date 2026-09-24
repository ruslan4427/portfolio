export function SectionBadge({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-4 py-1.5 text-sm text-[color:var(--ink-primary)] shadow-[var(--shadow-card)]">
      <Sparkle />
      <span className="font-sans">{label}</span>
    </div>
  );
}

function Sparkle() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="text-[color:var(--ink-primary)]"
    >
      <path
        d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z"
        fill="currentColor"
      />
    </svg>
  );
}
