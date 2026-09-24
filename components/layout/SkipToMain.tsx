export function SkipToMain() {
  return (
    <a
      href="#main"
      className="sr-only absolute left-4 top-4 z-[100] font-mono text-xs uppercase tracking-[0.2em] focus:not-sr-only focus:inline-block focus:bg-[color:var(--accent)] focus:px-4 focus:py-3 focus:text-[color:var(--bg-canvas)]"
    >
      Skip to main content
    </a>
  );
}
