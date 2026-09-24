type Props = {
  href: string;
  label: string;
  avatarSrc?: string;
  external?: boolean;
};

export function CTAButton({ href, label, avatarSrc, external }: Props) {
  const isMail = href.startsWith("mailto:");
  return (
    <a
      href={href}
      {...(external && !isMail ? { target: "_blank", rel: "noreferrer" } : {})}
      className="group inline-flex items-center gap-3 rounded-full bg-[color:var(--cta)] py-2 pl-2 pr-5 text-[color:var(--cta-ink)] shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5"
    >
      {avatarSrc ? (
        <span
          className="block h-8 w-8 overflow-hidden rounded-full bg-[color:var(--ink-body)]"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatarSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        </span>
      ) : (
        <span
          aria-hidden
          className="block h-8 w-8 rounded-full bg-[color:var(--ink-body)]"
        />
      )}
      <span className="font-sans text-sm">{label}</span>
      <span
        aria-hidden
        className="text-sm transition-transform duration-200 group-hover:translate-x-0.5"
      >
        ↗
      </span>
    </a>
  );
}
