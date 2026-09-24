import type { ComponentPropsWithoutRef } from "react";

export const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="font-serif text-[clamp(32px,4vw,48px)] leading-[1.1] mt-16 mb-6 text-[color:var(--ink-primary)]"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="font-serif text-[clamp(24px,2.75vw,32px)] leading-[1.15] mt-12 mb-4 text-[color:var(--ink-primary)]"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="my-5 leading-[1.7] text-[color:var(--ink-body)]" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="my-5 pl-6 space-y-2 list-disc marker:text-[color:var(--ink-muted)] text-[color:var(--ink-body)]"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="my-5 pl-6 space-y-2 list-decimal marker:text-[color:var(--ink-muted)] text-[color:var(--ink-body)]"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-[1.7]" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-[color:var(--ink-primary)] underline underline-offset-4 decoration-[color:var(--outline)] hover:decoration-[color:var(--ink-primary)] transition-colors"
      {...props}
    />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-8 rounded-[var(--radius-tile)] border-l-2 border-[color:var(--ink-primary)] bg-[color:var(--bg-elevated)] py-4 pl-6 pr-4 italic text-[color:var(--ink-body)]"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="font-sans text-[0.9em] bg-[color:var(--bg-elevated)] border border-[color:var(--hairline)] rounded px-1.5 py-0.5 text-[color:var(--ink-primary)]"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="my-6 overflow-x-auto rounded-[var(--radius-tile)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-4 font-sans text-sm text-[color:var(--ink-primary)]"
      {...props}
    />
  ),
  hr: () => (
    <hr className="my-16 border-0 h-px bg-[color:var(--hairline)]" />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong
      className="text-[color:var(--ink-primary)] font-semibold"
      {...props}
    />
  ),
  em: (props: ComponentPropsWithoutRef<"em">) => (
    <em className="italic" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-8 overflow-x-auto rounded-[var(--radius-tile)] border border-[color:var(--hairline)]">
      <table
        className="w-full border-collapse text-sm text-[color:var(--ink-body)]"
        {...props}
      />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="border-b border-[color:var(--hairline)] bg-[color:var(--bg-page)] px-4 py-3 text-left font-sans text-[11px] uppercase tracking-wider text-[color:var(--ink-muted)]"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td
      className="border-b border-[color:var(--hairline)] px-4 py-3 leading-[1.6] align-top"
      {...props}
    />
  ),
};
