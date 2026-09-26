export default function CaseStudyLoading() {
  return (
    <main
      id="main"
      aria-busy="true"
      aria-label="Loading case study"
      className="relative min-h-screen"
    >
      <div className="px-[var(--gutter)] pt-40 pb-16">
        <div className="mx-auto flex max-w-[65ch] flex-col items-center gap-8">
          <div className="h-6 w-32 animate-pulse rounded-full bg-[color:var(--hairline)]" />
          <div className="h-[clamp(56px,9vw,120px)] w-full max-w-[18ch] animate-pulse rounded-[var(--radius-tile)] bg-[color:var(--hairline)]" />
          <div className="h-5 w-4/5 animate-pulse rounded-full bg-[color:var(--hairline)]" />
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-16 animate-pulse rounded-full bg-[color:var(--hairline)]"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="px-[var(--gutter)] pb-32">
        <div className="mx-auto flex max-w-[65ch] flex-col gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded-full bg-[color:var(--hairline)]"
              style={{ width: `${70 + ((i * 7) % 30)}%` }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
