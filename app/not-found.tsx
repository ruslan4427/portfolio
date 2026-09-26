import { CTALink } from "@/components/ui/CTAButton";
import { SectionBadge } from "@/components/ui/SectionBadge";

export default function NotFound() {
  return (
    <main
      id="main"
      className="relative flex min-h-screen flex-col items-center justify-center px-[var(--gutter)]"
    >
      <div className="flex flex-col items-center gap-8 text-center">
        <SectionBadge label="404" />
        <h1 className="max-w-[16ch] font-serif text-[clamp(56px,9vw,120px)] leading-[0.98] text-[color:var(--ink-primary)]">
          This page slipped through.
        </h1>
        <p className="max-w-md text-[color:var(--ink-body)]">
          The URL didn&rsquo;t match anything I&rsquo;ve shipped. Try the
          selected work, or head back home.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <CTALink href="/">Home</CTALink>
          <CTALink href="/work" variant="outline">
            Selected work
          </CTALink>
        </div>
      </div>
    </main>
  );
}
