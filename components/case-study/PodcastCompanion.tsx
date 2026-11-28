"use client";

// Podcast companion. The format template is in specs/31-podcast-companion.
//
//   • Chapter cue: a button above the heading of the first section each
//     chapter covers ("▶ Podcast · ch. 3 of 5 · 2:30 · 45 s" plus the gist).
//   • Now-playing rule: the sections the chapter covers, and their
//     chapter-rail links, get a brick rule (CSS in globals.css, keyed on
//     data-podcast-now).
//   • Moment dock: avatar with a progress ring at the right edge. It opens
//     the round video at the same second (the V key does too). On phones it
//     appears only once playback has started.
//   • Drift card: shown when none of the playing chapter's sections is on
//     screen. It offers "back to that part" or "play the part I'm reading".
// Opt-in throughout: nothing plays until the reader asks.

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { VideoModal } from "@/components/ui/VideoModal";
import { track } from "@/lib/analytics";
import { usePrefersReducedMotion } from "@/lib/motion";
import { validatePodcast, type Podcast, type PodcastChapter } from "@/content/case-studies/podcasts";

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

/** Progress ring that scales with its box (viewBox 0–100). */
function Ring({ progress, stroke = 3 }: { progress: number; stroke?: number }) {
  const r = 50 - stroke;
  const c = 2 * Math.PI * r;
  return (
    <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full -rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--hairline)" strokeWidth={stroke} />
      <circle
        cx="50"
        cy="50"
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

export function PodcastCompanion({ podcast }: { podcast: Podcast }) {
  const reduced = usePrefersReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const bubbleRef = useRef<HTMLVideoElement>(null);

  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [inArticle, setInArticle] = useState(false);
  const [onScreen, setOnScreen] = useState<Set<string>>(() => new Set());
  const [cueHosts, setCueHosts] = useState<Record<string, HTMLElement>>({});
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

  /** What playback controls drive: the round video if open, else audio. */
  const media = useCallback(
    (): HTMLMediaElement | null => (bubble.open ? bubbleRef.current : audioRef.current),
    [bubble.open],
  );

  // Dev-time template check against the rendered sections.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const ids = Array.from(document.querySelectorAll("article section[id]")).map((s) => s.id);
    const errs = validatePodcast(podcast, ids);
    if (errs.length) console.warn("[podcast] template violations:\n- " + errs.join("\n- "));
  }, [podcast]);

  // Cue hosts: one <div> inserted before each chapter's first heading.
  useEffect(() => {
    const hosts: Record<string, HTMLElement> = {};
    podcast.chapters.forEach((c) => {
      const section = document.getElementById(c.sectionIds[0]);
      const h2 = section?.querySelector(":scope > h2");
      if (!section || !h2) return;
      const host = document.createElement("div");
      host.dataset.podcastCue = c.id;
      section.insertBefore(host, h2);
      hosts[c.id] = host;
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- DOM hosts exist only after mount
    setCueHosts(hosts);
    return () => Object.values(hosts).forEach((h) => h.remove());
  }, [podcast]);

  // Reading position, plus which mapped sections are on screen.
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
    const seenIo = new IntersectionObserver((entries) =>
      setOnScreen((prev) => {
        const next = new Set(prev);
        entries.forEach((e) => (e.isIntersecting ? next.add(e.target.id) : next.delete(e.target.id)));
        return next;
      }),
    );
    sections.forEach((s) => {
      io.observe(s);
      seenIo.observe(s);
    });
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

  // Time and play state follow whichever medium is active.
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

  const liveChapter =
    [...podcast.chapters].reverse().find((c) => c.startSec <= currentTime) ?? podcast.chapters[0];
  const started = playing || bubble.open || currentTime > 0;

  // Now-playing marks on sections and rail links (styled in globals.css).
  useEffect(() => {
    if (!started) return;
    const state = playing ? "playing" : "paused";
    const touched: Element[] = [];
    liveChapter.sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        section.setAttribute("data-podcast-now", state);
        touched.push(section);
      }
      document.querySelectorAll(`nav[aria-label="Chapters"] a[href="#${CSS.escape(id)}"]`).forEach((a) => {
        a.setAttribute("data-podcast-now", state);
        touched.push(a);
      });
    });
    return () => touched.forEach((el) => el.removeAttribute("data-podcast-now"));
  }, [liveChapter, started, playing]);

  /** Cue click: play, pause or jump on whichever medium is active. */
  const playChapter = useCallback(
    (c: PodcastChapter) => {
      const m = media();
      if (!m) return;
      const nowChapter =
        [...podcast.chapters].reverse().find((x) => x.startSec <= m.currentTime) ?? podcast.chapters[0];
      if (nowChapter.id === c.id && m.currentTime > 0) {
        if (m.paused) m.play().catch(() => {});
        else m.pause();
        return;
      }
      m.currentTime = c.startSec;
      m.play().catch(() => {});
      track("podcast_play", { chapter: c.id, medium: bubble.open ? "video" : "audio" });
    },
    [media, podcast, bubble.open],
  );

  const scrollToChapter = useCallback(
    (c: PodcastChapter) => {
      document
        .getElementById(c.sectionIds[0])
        ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    },
    [reduced],
  );

  const openBubble = useCallback(() => {
    const audio = audioRef.current;
    const wasPlaying = !!audio && !audio.paused;
    const fallback = chapterOfSection(activeSectionId)?.startSec ?? 0;
    const startAt = audio && audio.currentTime > 0 ? audio.currentTime : fallback;
    audio?.pause();
    setBubble({ open: true, startAt, resumeAudio: wasPlaying });
    track("podcast_video_open", { at: Math.round(startAt) });
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

  // V toggles the round video; Esc closes it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
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

  if (!mounted) return null;

  const total = podcast.totalSec;
  const progress = Math.min(1, Math.max(0, currentTime / total));
  const readingChapter = chapterOfSection(activeSectionId) ?? podcast.chapters[0];
  const dockChapter = started ? liveChapter : readingChapter;
  const dockMoment = started ? currentTime : readingChapter.startSec;
  const chapterEnd = (c: PodcastChapter) =>
    podcast.chapters[podcast.chapters.indexOf(c) + 1]?.startSec ?? total;
  const drifted =
    started &&
    !!activeSectionId &&
    readingChapter.id !== liveChapter.id &&
    !liveChapter.sectionIds.some((id) => onScreen.has(id));
  // Desktop: dock whenever in the article. Phone: only once started (the cues are the entry).
  const dockVisibility = started ? "flex" : inArticle ? "hidden sm:flex" : "hidden";

  const cues = podcast.chapters.map((c, i) => {
    const host = cueHosts[c.id];
    if (!host) return null;
    const isLive = started && liveChapter.id === c.id;
    const len = chapterEnd(c) - c.startSec;
    const chProgress = isLive ? Math.min(1, Math.max(0, (currentTime - c.startSec) / len)) : 0;
    return createPortal(
      <button
        type="button"
        onClick={() => playChapter(c)}
        aria-label={
          isLive && playing
            ? `Pause podcast chapter ${i + 1}`
            : `Play podcast chapter ${i + 1}, ${c.title}, from ${fmt(c.startSec)}`
        }
        className="group mb-4 flex w-full max-w-[560px] items-start gap-3 rounded-[var(--radius-tile)] py-1 text-left focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none"
      >
        <span
          aria-hidden
          className={`mt-0.5 grid h-8 w-8 flex-shrink-0 place-items-center rounded-full border font-sans text-[11px] transition-colors duration-[var(--dur-fast)] ${
            isLive && playing
              ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--accent-ink)]"
              : "border-[color:var(--outline)] bg-[color:var(--bg-elevated)] text-[color:var(--ink-primary)] group-hover:border-[color:var(--ink-primary)]"
          }`}
        >
          {isLive && playing ? "❚❚" : "▶"}
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`block font-sans text-[11px] font-semibold uppercase tracking-[0.08em] ${
              isLive ? "text-[color:var(--accent)]" : "text-[color:var(--ink-muted)]"
            }`}
          >
            {isLive
              ? `${playing ? "Now playing" : "Paused"} · ${fmt(currentTime)} / ${fmt(chapterEnd(c))}`
              : `Podcast · ch. ${i + 1} of ${podcast.chapters.length} · ${fmt(c.startSec)} · ${len} s`}
            <span className="font-normal normal-case tracking-normal text-[color:var(--ink-muted)]">
              {" "}
              · about {sectionRange(c)}
            </span>
          </span>
          <span className="mt-0.5 block font-sans text-[14px] leading-snug text-[color:var(--ink-body)]">{c.gist}</span>
          {isLive && (
            <span aria-hidden className="mt-2 block h-[2px] w-full max-w-[320px] rounded-full bg-[color:var(--hairline)]">
              <span
                className="block h-full rounded-full bg-[color:var(--accent)]"
                style={{ width: `${(chProgress * 100).toFixed(1)}%` }}
              />
            </span>
          )}
        </span>
      </button>,
      host,
      c.id,
    );
  });

  // On phones the open video already links back via "About § …", so the card would only crowd it.
  const driftCard = drifted && (
    <div className={`${bubble.open ? "hidden sm:block" : ""} w-[min(232px,calc(100vw-24px))] rounded-[var(--radius-tile)] border border-[color:var(--outline)] bg-[color:var(--bg-elevated)] p-3 shadow-[var(--shadow-float)]`}>
      <div className="font-sans text-[12px] leading-snug text-[color:var(--ink-body)]">
        You&apos;re reading <b>{sectionRange(readingChapter)}</b>. The podcast is on{" "}
        <b className="text-[color:var(--accent)]">{sectionRange(liveChapter)}</b>.
      </div>
      <div className="mt-2 flex gap-1.5">
        <button
          type="button"
          onClick={() => {
            scrollToChapter(liveChapter);
            track("podcast_drift_action", { action: "back" });
          }}
          className="h-8 flex-1 rounded-[var(--radius-pill)] border border-[color:var(--outline)] font-sans text-[11px] text-[color:var(--ink-primary)] hover:bg-[color:var(--bg-page)]"
        >
          ↑ Back to {sectionRange(liveChapter)}
        </button>
        <button
          type="button"
          onClick={() => {
            playChapter(readingChapter);
            track("podcast_drift_action", { action: "play_here" });
          }}
          className="h-8 flex-1 rounded-[var(--radius-pill)] bg-[color:var(--cta)] font-sans text-[11px] text-[color:var(--cta-ink)]"
        >
          ▶ Play {sectionRange(readingChapter)}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {cues}
      {createPortal(
        <>
          <audio ref={audioRef} src={podcast.audioSrc} preload="metadata" />

          <div
            className={`${dockVisibility} fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] right-3 z-[70] flex-col items-end gap-2 sm:bottom-auto sm:right-5 sm:top-1/2 sm:-translate-y-1/2`}
          >
            {bubble.open ? (
              <div className="flex flex-col items-center gap-2">
                <div className="relative h-[168px] w-[168px] sm:h-[232px] sm:w-[232px]">
                  <Ring progress={progress} stroke={1.6} />
                  <button
                    type="button"
                    onClick={() => {
                      const v = bubbleRef.current;
                      if (!v) return;
                      if (v.paused) v.play().catch(() => {});
                      else v.pause();
                    }}
                    aria-label={playing ? "Pause video" : "Play video"}
                    className="absolute inset-[5px] overflow-hidden rounded-full bg-black shadow-[var(--shadow-float)]"
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
                <div className="w-[168px] text-center sm:w-[232px]">
                  <div className="font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--ink-muted)]">
                    {fmt(currentTime)} / {fmt(total)}
                  </div>
                  <button
                    type="button"
                    onClick={() => scrollToChapter(liveChapter)}
                    className="max-w-full truncate font-sans text-[12px] font-semibold text-[color:var(--ink-primary)] underline decoration-[color:var(--accent)] decoration-2 underline-offset-4 sm:text-[13px]"
                  >
                    About {sectionRange(liveChapter)} · {liveChapter.title}
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
                aria-label={`Watch ${sectionRange(dockChapter)}, ${dockChapter.title}, from ${fmt(dockMoment)}`}
                className="group flex items-center gap-3 focus-visible:outline-none"
              >
                <span className="pointer-events-none hidden whitespace-nowrap rounded-[var(--radius-pill)] bg-[color:var(--ink-primary)] px-3 py-1.5 font-sans text-[11px] font-medium text-[color:var(--bg-page)] opacity-0 transition-opacity duration-[var(--dur-fast)] group-hover:opacity-100 group-focus-visible:opacity-100 sm:inline">
                  Watch {sectionRange(dockChapter)} · from {fmt(dockMoment)} <span className="opacity-60">(V)</span>
                </span>
                <span className="relative block h-14 w-14 rounded-full transition-transform duration-[var(--dur-fast)] group-hover:scale-105 group-focus-visible:shadow-[var(--focus-ring)] sm:h-16 sm:w-16">
                  <Ring progress={progress} />
                  <span className="absolute inset-[4px] overflow-hidden rounded-full bg-[color:var(--bg-page)] shadow-[var(--shadow-float)]">
                    {podcast.avatarSrc ? (
                      <Image src={podcast.avatarSrc} alt="" fill sizes="64px" className="object-cover" />
                    ) : (
                      <span className="grid h-full place-items-center font-serif text-xl">{podcast.avatarInitial}</span>
                    )}
                  </span>
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[var(--radius-pill)] bg-[color:var(--ink-primary)] px-1.5 py-px font-sans text-[9px] font-semibold uppercase tracking-[0.08em] text-[color:var(--bg-page)]"
                  >
                    {playing ? "● Live" : "▶ Video"}
                  </span>
                </span>
              </button>
            )}
            {driftCard}
          </div>

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
      )}
    </>
  );
}
