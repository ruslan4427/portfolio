"use client";

// Prototype: the cursor IS the podcast player.
//
// Physics:
//   • Inside the article the native cursor is replaced by an ink dot that
//     follows the pointer with a little lag.
//   • Over a section mapped to a chapter the dot grows into a ring and says
//     what a click will do: Listen / Pause / Jump to Ch. N.
//   • A plain click on text (no drag-selection, not on a link) does that.
//   • A round "moment" dock sits on the right edge. Clicking it (or pressing V)
//     opens the podcast video in a circle, starting at the moment that belongs
//     to the text the reader stopped at: the audio playhead if audio is
//     playing, else the chapter start of the section in view.
//   • While the circle is open, the cursor drives the video instead of audio.
//     Closing it hands the playhead back to audio.
// Desktop with a fine pointer only; touch falls back to the bottom bar.

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { VideoModal } from "@/components/ui/VideoModal";
import { usePrefersReducedMotion } from "@/lib/motion";
import type { Podcast, PodcastChapter } from "@/content/case-studies/podcasts";

function fmt(sec: number): string {
  if (!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** "§ 5–6" from section ids like "5-the-…", "6-devlog-…". */
function sectionRange(c: PodcastChapter): string {
  const nums = c.sectionIds.map((id) => id.match(/^\d+/)?.[0]).filter(Boolean);
  if (nums.length === 0) return c.title;
  return nums.length === 1 ? `§ ${nums[0]}` : `§ ${nums[0]}–${nums[nums.length - 1]}`;
}

const INTERACTIVE = "a, button, summary, input, textarea, select, video, [role='button'], [data-no-podcast-cursor]";

function Ring({ size, progress, stroke = 2 }: { size: number; progress: number; stroke?: number }) {
  const r = size / 2 - stroke;
  const c = 2 * Math.PI * r;
  return (
    <svg aria-hidden width={size} height={size} className="pointer-events-none absolute inset-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--hairline)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
      />
    </svg>
  );
}

export function PodcastCursor({ podcast }: { podcast: Podcast }) {
  const reduced = usePrefersReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const bubbleRef = useRef<HTMLVideoElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const down = useRef<{ x: number; y: number } | null>(null);

  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [inArticle, setInArticle] = useState(false);
  // Mapped sections with any pixel on screen (for "you scrolled away" logic).
  const [onScreen, setOnScreen] = useState<Set<string>>(() => new Set());
  const [hover, setHover] = useState<{ chapter: PodcastChapter | null; overInteractive: boolean; inside: boolean }>({
    chapter: null,
    overInteractive: false,
    inside: false,
  });
  // The round video ("moment") on the right edge.
  const [bubble, setBubble] = useState<{ open: boolean; startAt: number; resumeAudio: boolean }>({
    open: false,
    startAt: 0,
    resumeAudio: false,
  });
  const [modal, setModal] = useState<{ open: boolean; startAt: number }>({ open: false, startAt: 0 });

  // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only mount gate
  useEffect(() => setMounted(true), []);

  const chapterOfSection = useCallback(
    (id: string | null) => (id ? podcast.chapters.find((c) => c.sectionIds.includes(id)) ?? null : null),
    [podcast],
  );

  /** Whatever the cursor currently controls: the circle video if open, else audio. */
  const media = useCallback(
    (): HTMLMediaElement | null => (bubble.open ? bubbleRef.current : audioRef.current),
    [bubble.open],
  );

  // Hide the native cursor over article text; links keep theirs.
  useEffect(() => {
    document.body.dataset.podcastCursor = "on";
    return () => {
      delete document.body.dataset.podcastCursor;
    };
  }, []);

  // Which section is the reader on?
  useEffect(() => {
    const ids = new Set(podcast.chapters.flatMap((c) => c.sectionIds));
    const sections = Array.from(ids)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSectionId(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    const seenIo = new IntersectionObserver((entries) =>
      setOnScreen((prev) => {
        const next = new Set(prev);
        entries.forEach((e) => (e.isIntersecting ? next.add(e.target.id) : next.delete(e.target.id)));
        return next;
      }),
    );
    sections.forEach((s) => seenIo.observe(s));
    const article = document.querySelector("article");
    const articleIo = article
      ? new IntersectionObserver(([e]) => setInArticle(e.isIntersecting), { rootMargin: "-10% 0px -10% 0px" })
      : null;
    if (article) articleIo?.observe(article);
    return () => {
      io.disconnect();
      seenIo.disconnect();
      articleIo?.disconnect();
    };
  }, [podcast]);

  // Time + play state follow whichever medium is active.
  useEffect(() => {
    const el = bubble.open ? bubbleRef.current : audioRef.current;
    if (!el) return;
    const onTime = () => setCurrentTime(el.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onPause);
    setPlaying(!el.paused);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onPause);
    };
  }, [mounted, bubble.open]);

  // Follower: lerp toward the pointer every frame.
  useEffect(() => {
    if (!mounted) return;
    let raf = 0;
    const tick = () => {
      const k = reduced ? 1 : 0.22;
      pos.current.x += (target.current.x - pos.current.x) * k;
      pos.current.y += (target.current.y - pos.current.y) * k;
      const el = followerRef.current;
      if (el) el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted, reduced]);

  // Pointer tracking + click-to-listen on article text.
  useEffect(() => {
    if (!mounted) return;
    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      const t = e.target as Element | null;
      const section = t?.closest?.("article section[id]") as HTMLElement | null;
      const overInteractive = !!t?.closest?.(INTERACTIVE);
      const chapter = chapterOfSection(section?.id ?? null);
      setHover((h) =>
        h.chapter?.id === chapter?.id && h.overInteractive === overInteractive && h.inside === !!section
          ? h
          : { chapter, overInteractive, inside: !!section },
      );
    };
    const onLeave = () => setHover({ chapter: null, overInteractive: false, inside: false });
    const onDown = (e: PointerEvent) => {
      down.current = { x: e.clientX, y: e.clientY };
    };
    const onUp = (e: PointerEvent) => {
      const start = down.current;
      down.current = null;
      if (!start || e.button !== 0) return;
      if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 5) return; // a drag
      if (window.getSelection && !window.getSelection()?.isCollapsed) return; // selecting text
      const t = e.target as Element | null;
      if (!t || t.closest(INTERACTIVE)) return;
      const section = t.closest("article section[id]") as HTMLElement | null;
      const chapter = chapterOfSection(section?.id ?? null);
      if (!chapter) return;
      const m = media();
      if (!m) return;
      const nowChapter =
        [...podcast.chapters].reverse().find((c) => c.startSec <= m.currentTime) ?? podcast.chapters[0];
      if (!m.paused && nowChapter.id === chapter.id) {
        m.pause();
      } else if (m.paused && nowChapter.id === chapter.id && m.currentTime > 0) {
        m.play().catch(() => {});
      } else {
        m.currentTime = chapter.startSec;
        m.play().catch(() => {});
      }
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
    };
  }, [mounted, chapterOfSection, media, podcast]);

  const openBubble = useCallback(() => {
    const audio = audioRef.current;
    const wasPlaying = !!audio && !audio.paused;
    const fallback = chapterOfSection(activeSectionId)?.startSec ?? 0;
    const startAt = wasPlaying || (audio && audio.currentTime > 0) ? audio!.currentTime : fallback;
    audio?.pause();
    setBubble({ open: true, startAt, resumeAudio: wasPlaying });
  }, [activeSectionId, chapterOfSection]);

  const closeBubble = useCallback(() => {
    const v = bubbleRef.current;
    const audio = audioRef.current;
    const t = v?.currentTime ?? bubble.startAt;
    const keepPlaying = v ? !v.paused : bubble.resumeAudio;
    v?.pause();
    setBubble((b) => ({ ...b, open: false }));
    if (audio) {
      audio.currentTime = t;
      setCurrentTime(t);
      if (keepPlaying) audio.play().catch(() => {});
    }
  }, [bubble.startAt, bubble.resumeAudio]);

  const expandBubble = useCallback(() => {
    const v = bubbleRef.current;
    const t = v?.currentTime ?? 0;
    v?.pause();
    setModal({ open: true, startAt: t });
  }, []);

  const closeModal = useCallback((t?: number) => {
    setModal((m) => ({ ...m, open: false }));
    const v = bubbleRef.current;
    if (v && typeof t === "number") {
      v.currentTime = t;
      v.play().catch(() => {});
    }
  }, []);

  // V opens/closes the circle, Esc closes it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      if (modal.open) return;
      if (e.key === "v" || e.key === "V") {
        if (bubble.open) closeBubble();
        else openBubble();
      } else if (e.key === "Escape" && bubble.open) {
        closeBubble();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [bubble.open, modal.open, openBubble, closeBubble]);

  // Tie the podcast to the text: mark the sections (and rail links) the
  // current chapter is about, so "this video is about this part" is visible.
  const liveChapter =
    [...podcast.chapters].reverse().find((c) => c.startSec <= currentTime) ?? podcast.chapters[0];
  const liveId = playing || bubble.open || currentTime > 0 ? liveChapter.id : null;
  useEffect(() => {
    const idx = podcast.chapters.findIndex((c) => c.id === liveId);
    if (idx < 0) return;
    const ch = podcast.chapters[idx];
    const end = podcast.chapters[idx + 1]?.startSec ?? podcast.totalSec;
    const state = playing ? "playing" : "paused";
    const touched: Element[] = [];
    ch.sectionIds.forEach((id, i) => {
      const section = document.getElementById(id);
      if (section) {
        section.setAttribute("data-podcast-now", state);
        touched.push(section);
        const h2 = i === 0 ? section.querySelector("h2") : null;
        if (h2) {
          h2.setAttribute(
            "data-podcast-label",
            `${playing ? "▶ Now playing" : "❚❚ Paused"} · podcast ch. ${idx + 1}/${podcast.chapters.length} · ${fmt(ch.startSec)}–${fmt(end)} · about ${sectionRange(ch)}`,
          );
          touched.push(h2);
        }
      }
      document.querySelectorAll(`nav[aria-label="Chapters"] a[href="#${CSS.escape(id)}"]`).forEach((a) => {
        a.setAttribute("data-podcast-now", state);
        touched.push(a);
      });
    });
    return () =>
      touched.forEach((el) => {
        el.removeAttribute("data-podcast-now");
        el.removeAttribute("data-podcast-label");
      });
  }, [liveId, playing, podcast]);

  const scrollToChapter = useCallback((c: PodcastChapter) => {
    document.getElementById(c.sectionIds[0])?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (!mounted) return null;

  const total = podcast.totalSec;
  const progress = Math.min(1, Math.max(0, currentTime / total));
  const playbackChapter =
    [...podcast.chapters].reverse().find((c) => c.startSec <= currentTime) ?? podcast.chapters[0];
  const readingChapter = chapterOfSection(activeSectionId) ?? podcast.chapters[0];
  const started = playing || currentTime > 0;
  const chapterNo = (c: PodcastChapter) => podcast.chapters.indexOf(c) + 1;

  // What would a click do right now?
  let action: "listen" | "pause" | "resume" | "jump" | null = null;
  if (hover.chapter) {
    if (hover.chapter.id === playbackChapter.id && started) action = playing ? "pause" : "resume";
    else action = started ? "jump" : "listen";
  }
  const showFollower = hover.inside && !hover.overInteractive;
  const big = showFollower && !!action;
  const followerSize = big ? 56 : 12;
  const showDock = inArticle || playing || bubble.open;
  const dockMoment = started ? currentTime : readingChapter.startSec;
  const dockChapter = started ? playbackChapter : readingChapter;
  // Reader has scrolled away from the part the podcast is talking about.
  const drifted =
    started &&
    !!activeSectionId &&
    readingChapter.id !== playbackChapter.id &&
    !playbackChapter.sectionIds.some((id) => onScreen.has(id));
  const driftCard = drifted && (
    <div className="w-[232px] rounded-[var(--radius-tile)] border border-[color:var(--outline)] bg-[color:var(--bg-elevated)] p-3 shadow-[var(--shadow-float)]">
      <div className="font-sans text-[11px] leading-snug text-[color:var(--ink-body)]">
        You&apos;re reading <b>{sectionRange(readingChapter)}</b>. The podcast is on{" "}
        <b className="text-[color:var(--accent)]">{sectionRange(playbackChapter)}</b>.
      </div>
      <div className="mt-2 flex gap-1.5">
        <button
          type="button"
          onClick={() => scrollToChapter(playbackChapter)}
          className="h-7 flex-1 rounded-[var(--radius-pill)] border border-[color:var(--outline)] font-sans text-[11px] text-[color:var(--ink-primary)] hover:bg-[color:var(--bg-page)]"
        >
          ↑ Back to {sectionRange(playbackChapter)}
        </button>
        <button
          type="button"
          onClick={() => {
            const m = media();
            if (!m) return;
            m.currentTime = readingChapter.startSec;
            m.play().catch(() => {});
          }}
          className="h-7 flex-1 rounded-[var(--radius-pill)] bg-[color:var(--cta)] font-sans text-[11px] text-[color:var(--cta-ink)]"
        >
          ▶ Play {sectionRange(readingChapter)}
        </button>
      </div>
    </div>
  );

  return createPortal(
    <>
      <audio ref={audioRef} src={podcast.audioSrc} preload="metadata" />

      {/* Cursor follower */}
      <div
        ref={followerRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[90]"
        style={{ opacity: showFollower ? 1 : 0, transition: "opacity 160ms" }}
      >
        <div
          className="relative grid place-items-center rounded-full"
          style={{
            width: followerSize,
            height: followerSize,
            background: big ? "var(--bg-elevated)" : "var(--ink-primary)",
            boxShadow: big ? "var(--shadow-float)" : "none",
            transition: reduced ? "none" : "width 220ms cubic-bezier(.2,.8,.2,1), height 220ms cubic-bezier(.2,.8,.2,1), background 160ms",
          }}
        >
          {big && (
            <>
              <Ring size={56} progress={hover.chapter?.id === playbackChapter.id ? progress : 0} />
              <span className="font-sans text-[13px] text-[color:var(--ink-primary)]">
                {action === "pause" ? "❚❚" : action === "jump" ? "↷" : "▶"}
              </span>
            </>
          )}
        </div>
        {big && hover.chapter && (
          <div className="absolute left-[34px] top-[-6px] whitespace-nowrap rounded-[var(--radius-pill)] bg-[color:var(--ink-primary)] px-2.5 py-1 font-sans text-[11px] font-medium text-[color:var(--bg-page)]">
            {action === "pause"
              ? "Pause"
              : action === "resume"
                ? `Resume · ${fmt(currentTime)}`
                : action === "jump"
                  ? `Jump to ${sectionRange(hover.chapter)} · ${fmt(hover.chapter.startSec)}`
                  : `Listen to ${sectionRange(hover.chapter)} · ${fmt(hover.chapter.startSec)}`}
            {bubble.open && <span className="opacity-60"> (video)</span>}
          </div>
        )}
      </div>

      {/* Right-edge moment dock / circle video */}
      {showDock && (
        <div
          data-no-podcast-cursor
          className="fixed right-5 top-1/2 z-[70] flex -translate-y-1/2 flex-col items-end gap-2"
        >
          {bubble.open ? (
            <div className="flex flex-col items-center gap-2">
              <div className="relative h-[232px] w-[232px]">
                <Ring size={232} progress={progress} stroke={3} />
                <button
                  type="button"
                  onClick={() => {
                    const v = bubbleRef.current;
                    if (!v) return;
                    if (v.paused) v.play().catch(() => {});
                    else v.pause();
                  }}
                  aria-label={playing ? "Pause video" : "Play video"}
                  className="absolute inset-[6px] overflow-hidden rounded-full bg-black shadow-[var(--shadow-float)]"
                >
                  <video
                    ref={bubbleRef}
                    src={podcast.videoSrc}
                    poster={podcast.videoPoster}
                    playsInline
                    autoPlay
                    onLoadedMetadata={(e) => {
                      e.currentTarget.currentTime = bubble.startAt;
                      e.currentTarget.play().catch(() => {});
                    }}
                    className="h-full w-full object-cover"
                  />
                  {!playing && (
                    <span className="absolute inset-0 grid place-items-center bg-[rgba(17,17,17,0.35)] font-sans text-[22px] text-white">
                      ▶
                    </span>
                  )}
                </button>
              </div>
              <div className="w-[232px] text-center">
                <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--ink-muted)]">
                  Ch. {chapterNo(playbackChapter)} · {fmt(currentTime)} / {fmt(total)}
                </div>
                <button
                  type="button"
                  onClick={() => scrollToChapter(playbackChapter)}
                  className="max-w-full truncate font-sans text-[13px] font-semibold text-[color:var(--ink-primary)] underline decoration-[color:var(--accent)] decoration-2 underline-offset-4"
                >
                  About {sectionRange(playbackChapter)} · {playbackChapter.title}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={expandBubble}
                  aria-label="Expand video"
                  className="h-8 rounded-[var(--radius-pill)] border border-[color:var(--outline)] bg-[color:var(--bg-elevated)] px-3 font-sans text-[12px] text-[color:var(--ink-primary)] hover:bg-[color:var(--bg-page)]"
                >
                  ⤢ Expand
                </button>
                <button
                  type="button"
                  onClick={closeBubble}
                  aria-label="Close video, keep listening"
                  className="h-8 rounded-[var(--radius-pill)] border border-[color:var(--outline)] bg-[color:var(--bg-elevated)] px-3 font-sans text-[12px] text-[color:var(--ink-primary)] hover:bg-[color:var(--bg-page)]"
                >
                  × Audio only
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={openBubble}
              aria-label={`Watch the podcast from ${fmt(dockMoment)}`}
              className="group flex items-center gap-3"
            >
              <span className="pointer-events-none whitespace-nowrap rounded-[var(--radius-pill)] bg-[color:var(--ink-primary)] px-3 py-1.5 font-sans text-[11px] font-medium text-[color:var(--bg-page)] opacity-0 transition-opacity duration-[var(--dur-fast)] group-hover:opacity-100 group-focus-visible:opacity-100">
                Watch {sectionRange(dockChapter)} · {dockChapter.title} · from {fmt(dockMoment)} <span className="opacity-60">(V)</span>
              </span>
              <span className="relative block h-[64px] w-[64px] transition-transform duration-[var(--dur-fast)] group-hover:scale-105">
                <Ring size={64} progress={progress} />
                <span className="absolute inset-[5px] overflow-hidden rounded-full bg-[color:var(--bg-page)] shadow-[var(--shadow-float)]">
                  {podcast.avatarSrc ? (
                    <Image src={podcast.avatarSrc} alt="" fill sizes="54px" className="object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center font-serif text-xl">{podcast.avatarInitial}</span>
                  )}
                </span>
                {playing && (
                  <span className="absolute -bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_0_2px_var(--bg-elevated)]" />
                )}
              </span>
            </button>
          )}
          {driftCard}
        </div>
      )}

      <VideoModal
        open={modal.open}
        onClose={closeModal}
        src={podcast.videoSrc}
        poster={podcast.videoPoster}
        startAt={modal.startAt}
        title="Podcast — full video"
      />
    </>,
    document.body,
  );
}
