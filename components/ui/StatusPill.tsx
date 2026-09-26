"use client";

import { motion } from "framer-motion";
import { easeSmooth, usePrefersReducedMotion } from "@/lib/motion";

type Status = "available" | "booking" | "unavailable";

const dotColor: Record<Status, string> = {
  available: "var(--status-live)",
  booking: "var(--ink-muted)",
  unavailable: "var(--ink-faint)",
};

type Props = {
  status: Status;
  label: string;
  revealDelay?: number;
};

export function StatusPill({ status, label, revealDelay }: Props) {
  const reduced = usePrefersReducedMotion();
  const animated = revealDelay !== undefined && !reduced;
  const delay = revealDelay ?? 0;

  return (
    <motion.div
      initial={animated ? { opacity: 0 } : false}
      animate={animated ? { opacity: 1 } : undefined}
      transition={
        animated ? { duration: 0.75, delay, ease: easeSmooth } : undefined
      }
      className="inline-flex items-center rounded-full border border-[color:var(--hairline)] bg-[color:var(--bg-elevated)] px-3.5 py-1.5 text-sm text-[color:var(--ink-primary)] shadow-[var(--shadow-card)]"
    >
      <motion.span
        aria-hidden
        className="relative flex h-2 w-2"
        initial={animated ? { scale: 0 } : false}
        animate={animated ? { scale: 1 } : undefined}
        transition={
          animated
            ? { duration: 0.75, delay: delay + 0.1, ease: easeSmooth }
            : undefined
        }
      >
        {status === "available" && (
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ background: dotColor[status] }}
          />
        )}
        <span
          className="relative inline-flex h-2 w-2 rounded-full"
          style={{ background: dotColor[status] }}
        />
      </motion.span>
      {animated ? (
        <motion.span
          className="overflow-hidden whitespace-nowrap font-sans"
          initial={{ maxWidth: 0, opacity: 0 }}
          animate={{ maxWidth: 320, opacity: 1 }}
          transition={{
            duration: 1.15,
            delay: delay + 0.6,
            ease: easeSmooth,
          }}
        >
          <span className="inline-block pl-2">{label}</span>
        </motion.span>
      ) : (
        <span className="ml-2 font-sans">{label}</span>
      )}
    </motion.div>
  );
}
