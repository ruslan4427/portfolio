"use client";

import { motion } from "framer-motion";
import { StatusPill } from "@/components/ui/StatusPill";
import { DateTime } from "@/components/ui/DateTime";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { easeSmooth, usePrefersReducedMotion } from "@/lib/motion";

const socials = [
  { label: "GitHub", href: "https://github.com/ruslan4427", short: "GH" },
  { label: "X", href: "https://x.com/ruslan4427", short: "X" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", short: "IN" },
  { label: "Email", href: "mailto:rusgrekovua@gmail.com", short: "@" },
] as const;

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const D = reduced
    ? {
        chrome: 0,
        mono: 0,
        line1: 0,
        line2: 0,
        socials: 0,
        tagline: 0,
        cta: 0,
      }
    : {
        chrome: 0.1,
        mono: 0.28,
        line1: 0.48,
        line2: 0.72,
        socials: 1.05,
        tagline: 1.2,
        cta: 1.4,
      };

  const fade = (delay: number) => ({
    initial: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: reduced ? { opacity: 1 } : { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay, ease: easeSmooth },
  });

  return (
    <section
      id="top"
      className="relative px-[var(--gutter)] pb-[var(--section-py)] pt-24 md:pt-28"
    >
      <div className="mx-auto flex max-w-[var(--content-max)] items-start justify-between">
        <motion.div {...fade(D.chrome)}>
          <DateTime />
        </motion.div>
        <StatusPill
          status="available"
          label="Available for new Project"
          revealDelay={D.chrome}
        />
      </div>

      <div className="mx-auto mt-20 max-w-[var(--content-max)] md:mt-28">
        <motion.div
          aria-hidden
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 1.05, delay: D.mono, ease: easeSmooth }}
          className="inline-block"
        >
          <motion.div
            whileHover={
              reduced
                ? undefined
                : {
                    scale: 1.06,
                    rotate: -5,
                    transition: { duration: 0.65, ease: easeSmooth },
                  }
            }
            transition={{ duration: 0.22, ease: easeSmooth }}
            className="flex h-20 w-20 items-center justify-center rounded-[16px] bg-[color:var(--ink-primary)] font-sans text-2xl font-semibold text-[color:var(--bg-page)] shadow-[var(--shadow-card)]"
          >
            RG
          </motion.div>
        </motion.div>

        <h1 className="mt-8 max-w-[880px] font-serif text-[clamp(48px,7.2vw,112px)] leading-[1.02] text-[color:var(--ink-primary)]">
          <MaskReveal mode="mount" delay={D.line1}>
            Software, shipped
          </MaskReveal>
          <br />
          <MaskReveal mode="mount" delay={D.line2}>
            honestly.
          </MaskReveal>
        </h1>
      </div>

      <div className="mx-auto mt-16 grid max-w-[var(--content-max)] grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-16">
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: reduced ? 0 : 0.09,
                delayChildren: D.socials,
              },
            },
          }}
          className="flex flex-wrap items-center gap-3"
        >
          {socials.map((s) => (
            <motion.li
              key={s.label}
              variants={{
                hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
                visible: reduced
                  ? { opacity: 1 }
                  : {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7, ease: easeSmooth },
                    },
              }}
            >
              <a
                href={s.href}
                {...(s.href.startsWith("mailto:")
                  ? {}
                  : { target: "_blank", rel: "noreferrer" })}
                aria-label={s.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] font-sans text-sm font-medium text-[color:var(--ink-primary)] shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                {s.short}
              </a>
            </motion.li>
          ))}
        </motion.ul>

        <div className="flex flex-col gap-5">
          <motion.p
            {...fade(D.tagline)}
            className="max-w-md text-base leading-relaxed text-[color:var(--ink-body)]"
          >
            I&rsquo;m Ruslan Hrekov, a solo builder based in Kyiv → Ohio. I
            collaborate with Claude to ship production software that&rsquo;s
            honest about how it was made — commit hashes, DEVLOGs, frozen logic.
          </motion.p>
          <motion.a
            {...fade(D.cta)}
            href="#work"
            className="inline-flex items-center gap-2 font-sans text-sm text-[color:var(--ink-primary)]"
          >
            Discover
            <span aria-hidden>↓</span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
