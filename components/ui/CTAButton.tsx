import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "accent";
type Size = "sm" | "md";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type LinkProps = CommonProps & {
  href: string;
  external?: boolean;
  /** Suggested file name — makes the link download the file instead of opening it. */
  download?: string;
};

type ButtonProps = CommonProps & {
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  ariaLabel?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans text-sm shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

const variants: Record<Variant, string> = {
  primary: "bg-[color:var(--cta)] text-[color:var(--cta-ink)]",
  outline:
    "border border-[color:var(--outline)] bg-[color:var(--bg-elevated)] text-[color:var(--ink-primary)]",
  // Brick emphasis — one per view at most (STABLE_LOGIC "Two hues, two jobs").
  accent: "bg-[color:var(--accent)] text-[color:var(--accent-ink)]",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2",
  md: "px-6 py-3",
};

function classes(variant: Variant, size: Size, extra: string) {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`.trim();
}

export function CTALink({
  children,
  href,
  external,
  download,
  variant = "primary",
  size = "sm",
  className = "",
}: LinkProps) {
  const isMail = href.startsWith("mailto:");
  return (
    <a
      href={href}
      {...(external && !isMail ? { target: "_blank", rel: "noreferrer" } : {})}
      {...(download ? { download } : {})}
      className={classes(variant, size, className)}
    >
      {children}
    </a>
  );
}

export function CTAButton({
  children,
  variant = "primary",
  size = "sm",
  className = "",
  type = "button",
  disabled,
  onClick,
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes(variant, size, className)}
    >
      {children}
    </button>
  );
}
