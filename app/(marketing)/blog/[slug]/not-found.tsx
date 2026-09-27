import { CTALink } from "@/components/ui/CTAButton";
import { SectionBadge } from "@/components/ui/SectionBadge";

export default function BlogPostNotFound() {
  return (
    <main
      id="main"
      className="relative flex min-h-screen flex-col items-center justify-center px-[var(--gutter)]"
    >
      <div className="flex flex-col items-center gap-8 text-center">
        <SectionBadge label="Journal" />
        <h1 className="max-w-[18ch] font-serif text-[clamp(48px,7vw,96px)] leading-[0.98] text-[color:var(--ink-primary)]">
          No entry here yet.
        </h1>
        <p className="max-w-md text-[color:var(--ink-body)]">
          That slug isn&rsquo;t one I&rsquo;ve published. The archive lives on
          the journal index.
        </p>
        <CTALink href="/blog" className="mt-4">
          Back to journal
        </CTALink>
      </div>
    </main>
  );
}
