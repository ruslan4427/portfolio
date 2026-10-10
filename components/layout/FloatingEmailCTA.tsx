"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { sendContact } from "@/app/(marketing)/contact/actions";
import { initialContactState } from "@/app/(marketing)/contact/types";

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
      setTimeout(() => firstFieldRef.current?.focus(), 220);
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
        transition={{ type: "spring", stiffness: 420, damping: 36, mass: 0.9 }}
        className="pointer-events-auto overflow-hidden rounded-[28px] bg-[color:var(--cta)] text-[color:var(--cta-ink)] shadow-[var(--shadow-card)]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {!open ? (
            <motion.button
              key="trigger"
              layout
              type="button"
              onClick={() => setOpen(true)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              aria-label="Open message composer"
              className="group flex items-center gap-3 py-1.5 pl-1.5 pr-5 font-sans text-sm hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition-transform duration-200"
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
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              className="w-[min(420px,calc(100vw-32px))] p-4"
            >
              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-2 py-6"
                >
                  <span
                    aria-hidden
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <span className="font-sans text-sm">
                    Delivered. I&rsquo;ll get back soon.
                  </span>
                </motion.div>
              ) : (
                <form action={formAction} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
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
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
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
                    </button>
                  </div>

                  <input type="hidden" name="name" value={prefill.name} />
                  <input type="hidden" name="intent" value={prefill.intent} />
                  <input
                    type="text"
                    name="_gotcha"
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                  />

                  <input
                    ref={firstFieldRef}
                    type="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    defaultValue={prefill.email}
                    autoComplete="email"
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/10 focus:outline-none"
                  />
                  <textarea
                    name="message"
                    required
                    rows={3}
                    minLength={20}
                    maxLength={5000}
                    placeholder="What are you working on? (20+ chars)"
                    defaultValue={prefill.message}
                    className="resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-sans text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/10 focus:outline-none"
                  />
                  {errorMessage && (
                    <p className="font-sans text-xs text-red-300">
                      {errorMessage}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[11px] text-white/40">
                      Private — delivered to my inbox.
                    </span>
                    <button
                      type="submit"
                      disabled={pending}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 font-sans text-sm text-black transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      {pending ? "Sending…" : "Send"}
                      {!pending && (
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
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
