"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { sendContact } from "@/app/(marketing)/contact/actions";
import { initialContactState } from "@/app/(marketing)/contact/types";

// Asymmetric easing: accelerate on open, decelerate on close.
// Open — easeInExpo: holds near-zero velocity, then whips into place.
const openEase: [number, number, number, number] = [1, 0.3, 1, 0.1];
// Close — easeOutExpo mirror: fast exit, settles gently back to pill.
const closeEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const OPEN_DUR = 0.45;
const CLOSE_DUR = 0.3;

const panelVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.26,
      // Content comes in near the end of the ease-in ramp, after shape has
      // mostly reached full size (~75% of OPEN_DUR).
      delay: OPEN_DUR * 0.72,
      when: "beforeChildren" as const,
      staggerChildren: 0.05,
      delayChildren: OPEN_DUR * 0.78,
    },
  },
  exit: {
    // Fade content out fast so the shape can start its ease-out morph.
    opacity: 0,
    transition: { duration: 0.14, ease: closeEase },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: openEase },
  },
};

export function FloatingEmailCTA() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [state, formAction, pending] = useActionState(
    sendContact,
    initialContactState,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setSuccess(false);
      const t = setTimeout(() => firstFieldRef.current?.focus(), 420);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (state.status === "success") setSuccess(true);
  }, [state]);

  useEffect(() => {
    if (!success || !open) return;
    const t = setTimeout(() => setOpen(false), 2200);
    return () => clearTimeout(t);
  }, [success, open]);

  if (pathname === "/contact") return null;

  const errorMessage =
    state.status === "error" && !pending ? state.message : null;
  const prefill =
    state.status === "error"
      ? state.values
      : { email: "", message: "", name: "Direct Message", intent: "other" };

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-30 -translate-x-1/2">
      <motion.div
        ref={containerRef}
        layout
        animate={{ borderRadius: open ? 28 : 9999 }}
        transition={{
          layout: {
            duration: open ? OPEN_DUR : CLOSE_DUR,
            ease: open ? openEase : closeEase,
          },
          borderRadius: {
            duration: open ? OPEN_DUR : CLOSE_DUR,
            ease: open ? openEase : closeEase,
          },
        }}
        initial={false}
        style={{ borderRadius: 9999 }}
        whileTap={!open ? { scale: 0.96 } : undefined}
        className="pointer-events-auto overflow-hidden bg-[color:var(--cta)] text-[color:var(--cta-ink)] shadow-[var(--shadow-card)] will-change-transform"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {!open ? (
            <motion.button
              key="trigger"
              type="button"
              onClick={() => setOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: closeEase }}
              aria-label="Open message composer"
              className="group flex items-center gap-3 py-1.5 pl-1.5 pr-5 font-sans text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <span
                aria-hidden
                className="relative h-9 w-9 overflow-hidden rounded-full bg-[color:var(--ink-primary)]"
              >
                <Image
                  src="/videos/hero-poster.jpg"
                  alt=""
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </span>
              <span aria-hidden className="inline-flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a7 7 0 0 1-7 7H8l-5 3 1.5-5A7 7 0 0 1 11 4h3a7 7 0 0 1 7 7z" />
                </svg>
                <span>Send me a message</span>
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="panel"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-[min(420px,calc(100vw-32px))] p-4"
            >
              <AnimatePresence mode="wait" initial={false}>
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: closeEase }}
                    className="flex flex-col items-center gap-3 py-6"
                  >
                    <motion.span
                      aria-hidden
                      initial={{ scale: 0.4 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 22,
                        mass: 0.9,
                        delay: 0.08,
                      }}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300"
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M20 6 9 17l-5-5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{
                            duration: 0.45,
                            ease: closeEase,
                            delay: 0.2,
                          }}
                        />
                      </svg>
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.35,
                        ease: closeEase,
                      }}
                      className="font-sans text-sm"
                    >
                      Delivered. I&rsquo;ll get back soon.
                    </motion.span>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    action={formAction}
                    variants={panelVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="flex flex-col gap-3"
                  >
                    <motion.div
                      variants={rowVariants}
                      className="flex items-center gap-3"
                    >
                      <span
                        aria-hidden
                        className="relative h-9 w-9 overflow-hidden rounded-full bg-[color:var(--ink-primary)]"
                      >
                        <Image
                          src="/videos/hero-poster.jpg"
                          alt=""
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </span>
                      <div className="flex flex-col font-sans leading-tight">
                        <span className="text-sm">Ruslan Hrekov</span>
                        <span className="text-[11px] text-white/55">
                          Usually replies within a day
                        </span>
                      </div>
                      <motion.button
                        type="button"
                        onClick={() => setOpen(false)}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 22,
                          mass: 0.9,
                        }}
                        aria-label="Close"
                        className="ml-auto rounded-full p-1.5 text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </motion.button>
                    </motion.div>

                    <input type="hidden" name="name" value={prefill.name} />
                    <input type="hidden" name="intent" value={prefill.intent} />
                    <input
                      type="text"
                      name="_gotcha"
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                    />

                    <motion.input
                      variants={rowVariants}
                      ref={firstFieldRef}
                      type="email"
                      name="email"
                      required
                      placeholder="your@email.com"
                      defaultValue={prefill.email}
                      autoComplete="email"
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-sm text-white placeholder:text-white/40 transition-colors focus:border-white/30 focus:bg-white/10 focus:outline-none"
                    />
                    <motion.textarea
                      variants={rowVariants}
                      name="message"
                      required
                      rows={3}
                      minLength={20}
                      maxLength={5000}
                      placeholder="What are you working on? (20+ chars)"
                      defaultValue={prefill.message}
                      className="resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-sm text-white placeholder:text-white/40 transition-colors focus:border-white/30 focus:bg-white/10 focus:outline-none"
                    />
                    <AnimatePresence>
                      {errorMessage && (
                        <motion.p
                          initial={{ opacity: 0, height: 0, y: -4 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -4 }}
                          transition={{ duration: 0.22, ease: closeEase }}
                          className="overflow-hidden font-sans text-xs text-red-300"
                        >
                          {errorMessage}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <motion.div
                      variants={rowVariants}
                      className="flex items-center justify-between"
                    >
                      <span className="font-sans text-[11px] text-white/40">
                        Private — delivered to my inbox.
                      </span>
                      <motion.button
                        type="submit"
                        disabled={pending}
                        whileHover={pending ? undefined : { scale: 1.04 }}
                        whileTap={pending ? undefined : { scale: 0.96 }}
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 22,
                          mass: 0.9,
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 font-sans text-sm text-black transition-opacity hover:opacity-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {pending ? (
                            <motion.span
                              key="sending"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.18, ease: closeEase }}
                              className="inline-flex items-center gap-1.5"
                            >
                              <motion.span
                                aria-hidden
                                animate={{ rotate: 360 }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1,
                                  ease: "linear",
                                }}
                                className="inline-block h-3 w-3 rounded-full border-2 border-black/20 border-t-black"
                              />
                              Sending
                            </motion.span>
                          ) : (
                            <motion.span
                              key="send"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.18, ease: closeEase }}
                              className="inline-flex items-center gap-1.5"
                            >
                              Send
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14" />
                                <path d="m12 5 7 7-7 7" />
                              </svg>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
