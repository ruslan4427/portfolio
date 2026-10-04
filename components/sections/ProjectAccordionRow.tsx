"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { Project } from "@/content/projects";
import { easeOutExpo, easeSmooth, usePrefersReducedMotion } from "@/lib/motion";
import { Counter } from "@/components/ui/Counter";

const statusLabel: Record<Project["status"], string> = {
  shipped: "Shipped",
  "in-review": "In review",
  "in-progress": "In progress",
  "sprint-4": "Active",
};

function useHoverSupported(): boolean {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    setSupported(mq.matches);
    const listener = (e: MediaQueryListEvent) => setSupported(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);
  return supported;
}

type Props = {
  project: Project;
  order: number;
};

export function ProjectAccordionRow({ project, order }: Props) {
  const [expanded, setExpanded] = useState(false);
  const numberRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const hover = useHoverSupported();
  const magnetic = hover && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 24, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 24, mass: 0.4 });

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!magnetic || !numberRef.current) return;
      const rect = numberRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      x.set(Math.max(-1, Math.min(1, dx)) * 8);
      y.set(Math.max(-1, Math.min(1, dy)) * 4);
    },
    [magnetic, x, y],
  );

  const onPointerLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const words = project.tagline.split(" ");
  const panelId = `row-panel-${project.slug}`;

  return (
    <motion.li
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.85,
        delay: order * 0.14,
        ease: easeSmooth,
      }}
      className="border-b border-[color:var(--hairline)] last:border-b-0"
    >
      <div onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="group flex w-full items-center gap-5 py-7 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg-page)] focus-visible:rounded-md md:gap-10 md:py-10"
        >
          <motion.span
            ref={numberRef}
            aria-hidden
            style={magnetic ? { x: springX, y: springY } : undefined}
            animate={{ scale: expanded ? 1.05 : 1 }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className="inline-block w-[2.4ch] shrink-0 font-serif text-[clamp(48px,10vw,128px)] leading-none text-[color:var(--ink-primary)] tabular-nums"
          >
            {project.index}
          </motion.span>

          <span className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-serif text-[clamp(26px,3.4vw,44px)] leading-[1.05] text-[color:var(--ink-primary)]">
                {project.name}
              </span>
              <span className="hidden font-sans text-[11px] uppercase tracking-[0.16em] text-[color:var(--ink-muted)] md:inline">
                {statusLabel[project.status]} · {project.year}
              </span>
            </span>
            <span
              className="hidden font-sans text-sm text-[color:var(--ink-muted)] md:block"
              aria-hidden={expanded}
            >
              {project.role}
            </span>
          </span>

          <motion.span
            aria-hidden
            animate={{ rotate: expanded ? 45 : 0 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
            className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[color:var(--hairline)] text-[color:var(--ink-primary)] transition-colors duration-200 group-hover:border-[color:var(--ink-primary)] group-focus-visible:border-[color:var(--ink-primary)]"
          >
            <span className="text-xl leading-none">+</span>
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="panel"
              id={panelId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: easeOutExpo }}
              className="overflow-hidden"
            >
              <div className="pb-10 md:pl-[calc(2.4ch+2.5rem)]">
                <p className="max-w-3xl font-serif text-[clamp(22px,2.4vw,32px)] leading-[1.22] text-[color:var(--ink-primary)]">
                  {words.map((word, i) => (
                    <motion.span
                      key={`${word}-${i}`}
                      initial={
                        reduced ? { opacity: 0 } : { opacity: 0, y: 8 }
                      }
                      animate={
                        reduced ? { opacity: 1 } : { opacity: 1, y: 0 }
                      }
                      transition={{
                        duration: 0.4,
                        delay: 0.05 + i * 0.03,
                        ease: easeOutExpo,
                      }}
                      className="inline-block"
                    >
                      {word}
                      {i < words.length - 1 ? " " : ""}
                    </motion.span>
                  ))}
                </p>

                <p className="mt-6 font-sans text-xs uppercase tracking-[0.16em] text-[color:var(--ink-muted)]">
                  <Counter text={project.metric} active={expanded} />
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-[color:var(--hairline)] px-3 py-1 font-sans text-xs text-[color:var(--ink-body)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    href={`/work/${project.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--outline)] bg-[color:var(--bg-elevated)] px-5 py-2 font-sans text-sm text-[color:var(--ink-primary)] shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ink-primary)]/40"
                  >
                    Read case study
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.li>
  );
}
