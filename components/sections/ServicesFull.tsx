import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { services } from "@/content/services";

export function ServicesFull() {
  return (
    <section
      id="services-list"
      className="relative px-[var(--gutter)] pb-8"
    >
      <div className="mx-auto max-w-[var(--content-max)]">
        <Stagger className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((s) => (
            <StaggerItem key={s.id} as="article" className="flex h-full flex-col rounded-[var(--radius-card)] border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] p-6 shadow-[var(--shadow-card)] md:p-8">
              <div className="flex flex-col gap-1">
                <span className="font-sans text-xs uppercase tracking-wider text-[color:var(--ink-muted)]">
                  {s.format}
                </span>
                <h2 className="font-serif text-2xl text-[color:var(--ink-primary)]">
                  {s.name}
                </h2>
              </div>

              <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--ink-body)]">
                {s.outcome}
              </p>

              <ul className="mt-5 flex flex-col gap-2 text-sm text-[color:var(--ink-body)]">
                {s.scope.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span
                      aria-hidden
                      className="mt-[9px] block h-[3px] w-[3px] shrink-0 rounded-full bg-[color:var(--ink-muted)]"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <div className="flex items-baseline justify-between border-t border-[color:var(--hairline)] pt-4">
                  <span className="font-sans text-xs uppercase tracking-wider text-[color:var(--ink-muted)]">
                    Investment
                  </span>
                  <span className="font-sans text-sm text-[color:var(--ink-primary)]">
                    {s.investment}
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
