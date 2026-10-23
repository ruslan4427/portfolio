"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { CTALink } from "@/components/ui/CTAButton";
import { HeroDots } from "@/components/canvas/HeroDots";
import { StatusPill } from "@/components/ui/StatusPill";
import { DateTime } from "@/components/ui/DateTime";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { VideoModal } from "@/components/ui/VideoModal";
import { easeSmooth, usePrefersReducedMotion } from "@/lib/motion";

const socials = [
  { label: "GitHub", href: "https://github.com/ruslan4427", short: "GH" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ruslan-hrekov-b21996315/", short: "IN" },
  { label: "Dev.to", href: "https://dev.to/hrekov", short: "DEV" },
  { label: "Email", href: "mailto:rusgrekovua@gmail.com", short: "@" },
] as const;

export type HeroCount = { value: number; label: string; href: string };

export function Hero({ counts }: { counts: HeroCount[] }) {
  const reduced = usePrefersReducedMotion();
  const [videoOpen, setVideoOpen] = useState(false);
  const hoverVideoRef = useRef<HTMLVideoElement>(null);

  const playHover = () => {
    if (reduced) return;
    const v = hoverVideoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play();
  };
  const stopHover = () => {
    const v = hoverVideoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };
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
      <HeroDots className="absolute right-0 top-0 -z-10 h-[360px] w-[72%] md:h-[600px] md:w-[min(70vw,960px)]" />
      <div className="mx-auto flex max-w-[var(--content-max)] items-start justify-between">
        <motion.div {...fade(D.chrome)}>
          <DateTime />
        </motion.div>
        <StatusPill
          status="available"
          label="Available for new projects"
          revealDelay={D.chrome}
        />
      </div>

      <div className="mx-auto mt-20 max-w-[var(--content-max)] md:mt-28">
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 1.05, delay: D.mono, ease: easeSmooth }}
          className="inline-block"
        >
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            onMouseEnter={playHover}
            onMouseLeave={stopHover}
            onFocus={playHover}
            onBlur={stopHover}
            aria-label="Play intro video"
            className="group relative h-28 w-28 overflow-hidden rounded-full shadow-[var(--shadow-card)] outline-offset-4 transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--ink-primary)] md:h-32 md:w-32"
          >
            <video
              ref={hoverVideoRef}
              className="h-full w-full object-cover"
              muted
              loop
              playsInline
              preload="auto"
              poster="/videos/hero-poster.jpg"
            >
              <source src="/videos/hero-hover.mp4" type="video/mp4" />
            </video>
          </button>
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
            className="max-w-md text-[length:var(--type-body-l)] leading-[1.55] text-[color:var(--ink-body)]"
          >
            I&rsquo;m Ruslan Hrekov, a solo builder based in the US. I
            collaborate with Claude to ship production software that&rsquo;s
            honest about how it was made — commit hashes, DEVLOGs, locked
            files. The usual.
          </motion.p>
          <motion.div {...fade(D.cta)} className="flex flex-wrap gap-3">
            <CTALink href="/work" size="md">
              See the work <span aria-hidden>→</span>
            </CTALink>
            <CTALink href="/contact" variant="outline" size="md">
              Start a project
            </CTALink>
            <CTALink href="/resume.pdf" download="Ruslan-Hrekov-Resume.pdf" variant="outline" size="md">
              Download résumé <span aria-hidden>↓</span>
            </CTALink>
          </motion.div>
          <motion.ul
            {...fade(D.cta)}
            aria-label="On this site"
            className="mt-2 flex flex-wrap gap-x-8 gap-y-3 border-t border-[color:var(--hairline)] pt-5"
          >
            {counts.map((c) => (
              <li key={c.label}>
                <Link
                  href={c.href}
                  className="group flex flex-col rounded-[var(--radius-inline)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
                >
                  <span className="font-serif text-[length:var(--type-display-s)] leading-none text-[color:var(--ink-primary)] tabular-nums">
                    {c.value}
                  </span>
                  <span className="mt-1 font-sans text-[length:var(--type-caption)] text-[color:var(--ink-muted)] underline decoration-transparent underline-offset-4 group-hover:decoration-[color:var(--accent)]">
                    {c.label}
                  </span>
                </Link>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>

      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        src="/videos/hero-intro.mp4"
        poster="/videos/hero-intro-poster.jpg"
        title="Intro — Ruslan Hrekov"
      />
    </section>
  );
}
