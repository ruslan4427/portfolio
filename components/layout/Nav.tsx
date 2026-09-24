"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { easeOutExpo } from "@/lib/motion";

const sections = [
  { id: "top", label: "Top" },
  { id: "work", label: "Work" },
  { id: "stack", label: "Practice" },
  { id: "contact", label: "Contact" },
] as const;

const NAV_LINKS = sections.filter((s) => s.id !== "top");

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<(typeof sections)[number]["id"]>("top");
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as (typeof sections)[number]["id"]);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const firstLink = menuRef.current?.querySelector<HTMLElement>("a");
    firstLink?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = menuRef.current?.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <>
      <nav
        aria-label="Primary"
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-300 ${
          scrolled
            ? "border-b border-[color:var(--hairline)] bg-[color:var(--bg-page)]/85 backdrop-blur-sm"
            : "border-b border-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-[var(--gutter)] py-5">
          <a
            href="#top"
            onClick={closeMenu}
            className="font-sans text-sm font-semibold text-[color:var(--ink-primary)]"
          >
            Ruslan Grekov
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={`inline-flex items-center rounded-full px-4 py-1.5 font-sans text-sm transition-colors ${
                      isActive
                        ? "bg-[color:var(--bg-elevated)] text-[color:var(--ink-primary)] shadow-[var(--shadow-card)]"
                        : "text-[color:var(--ink-muted)] hover:text-[color:var(--ink-primary)]"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <button
            ref={toggleRef}
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
            className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`block h-px w-6 bg-[color:var(--ink-primary)] transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-6 bg-[color:var(--ink-primary)] transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[color:var(--bg-page)] md:hidden"
          >
            <ul className="flex flex-col items-center gap-8 font-serif text-[clamp(44px,10vw,72px)]">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.08 + i * 0.05, ease: easeOutExpo }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={closeMenu}
                    className={`italic transition-colors ${
                      active === link.id
                        ? "text-[color:var(--ink-primary)]"
                        : "text-[color:var(--ink-muted)]"
                    }`}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
