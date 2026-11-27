"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { VideoModal } from "@/components/ui/VideoModal";
import type { Podcast, PodcastChapter } from "@/content/case-studies/podcasts";

type Props = { podcast: Podcast };

const AVATAR_SILENT_LABEL = "Open podcast companion";
const AVATAR_PLAYING_LABEL = "Pause and open podcast";

function fmt(sec: number): string {
  if (!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PodcastCompanion({ podcast }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [inArticle, setInArticle] = useState(false);

  useEffect(() => setMounted(true), []);

  // Tell the global floating chrome (BackToTop, FloatingEmailCTA) to step
  // aside — CSS in globals.css hides them when this flag is set so the
  // companion widget owns the bottom gutter.
  useEffect(() => {
    document.body.dataset.podcastCompanion = "active";
    return () => {
      delete document.body.dataset.podcastCompanion;
    };
  }, []);

  // Scroll sync — which MDX section is in view?
  useEffect(() => {
    if (typeof window === "undefined") return;
    const allIds = new Set(podcast.chapters.flatMap((c) => c.sectionIds));
    const sections = Array.from(allIds)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the topmost currently-intersecting section.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0]) setActiveSectionId(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));

    const article = document.querySelector("article");
    let articleIo: IntersectionObserver | null = null;
    if (article) {
      articleIo = new IntersectionObserver(
        ([entry]) => setInArticle(entry.isIntersecting),
        { rootMargin: "-10% 0px -10% 0px" },
      );
      articleIo.observe(article);
    }

    return () => {
      io.disconnect();
      articleIo?.disconnect();
    };
  }, [podcast]);

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const scrollChapter = podcast.chapters.find(
    (c) => activeSectionId && c.sectionIds.includes(activeSectionId),
  );
  const playbackChapter = [...podcast.chapters]
    .reverse()
    .find((c) => c.startSec <= currentTime);
  const displayChapter = playing ? playbackChapter : scrollChapter ?? null;

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  const jumpToChapter = useCallback((chapter: PodcastChapter) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = chapter.startSec;
    audio.play().catch(() => {});
  }, []);

  if (!mounted || !inArticle) return null;

  const totalSec = podcast.totalSec;
  const progress = Math.min(1, Math.max(0, currentTime / totalSec));
  const remaining = Math.max(0, totalSec - currentTime);

  return createPortal(
    <>
      <audio ref={audioRef} src={podcast.audioSrc} preload="metadata" />

      {/* Desktop collapsed pill — hidden on mobile */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={playing ? AVATAR_PLAYING_LABEL : AVATAR_SILENT_LABEL}
          className={[
            "fixed bottom-6 right-6 z-50 hidden items-center gap-3 rounded-[var(--radius-pill)]",
            "border border-[color:var(--outline)] bg-[color:var(--bg-elevated)]",
            "shadow-[var(--shadow-float)] md:inline-flex",
            "focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]",
            "transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5",
            playing ? "py-2 pl-2 pr-5" : "py-2 pl-2 pr-5",
          ].join(" ")}
        >
          {playing ? (
            <>
              <span
                aria-hidden
                className="relative grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-[color:var(--ink-primary)] bg-[color:var(--bg-page)] font-serif text-[18px] font-semibold text-[color:var(--ink-primary)]"
              >
                {podcast.avatarInitial}
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_0_2px_var(--bg-elevated)]"
                />
              </span>
              <span aria-hidden className="flex h-4 items-center gap-[3px] px-0.5">
                <span className="block h-1.5 w-0.5 rounded-full bg-[color:var(--accent)]" />
                <span className="block h-3 w-0.5 rounded-full bg-[color:var(--accent)]" />
                <span className="block h-4 w-0.5 rounded-full bg-[color:var(--accent)]" />
                <span className="block h-2.5 w-0.5 rounded-full bg-[color:var(--accent)]" />
                <span className="block h-1.5 w-0.5 rounded-full bg-[color:var(--accent)]" />
              </span>
              <span className="min-w-0 text-left">
                <span className="block font-sans text-[10px] uppercase tracking-[0.1em] text-[color:var(--ink-muted)]">
                  Ch. {podcast.chapters.indexOf(playbackChapter!) + 1 || 1} ·{" "}
                  {fmt(currentTime)} / {fmt(totalSec)}
                </span>
                <span className="block max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap font-sans text-[13px] font-semibold text-[color:var(--ink-primary)]">
                  {displayChapter?.title ?? podcast.chapters[0].title}
                </span>
              </span>
            </>
          ) : (
            <>
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--ink-primary)] font-sans text-[10px] text-[color:var(--cta-ink)]"
              >
                <span className="pl-0.5">▶</span>
              </span>
              <span className="text-left">
                <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--ink-primary)]">
                  Companion podcast
                </span>
                <span className="block font-sans text-[13px] text-[color:var(--ink-muted)]">
                  {podcast.teaser}
                </span>
              </span>
            </>
          )}
        </button>
      )}

      {/* Mobile bottom bar — always visible on mobile, no expanded sheet yet */}
      <div
        className={[
          "fixed inset-x-0 bottom-0 z-50 flex items-center gap-3 border-t border-[color:var(--outline)]",
          "bg-[color:var(--bg-elevated)] px-3.5 pt-2.5 md:hidden",
          "pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))]",
          "shadow-[0_-1px_2px_rgba(0,0,0,0.03),0_-12px_32px_-12px_rgba(0,0,0,0.12)]",
        ].join(" ")}
      >
        <span
          aria-hidden
          className="relative grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border-[1.5px] border-[color:var(--ink-primary)] bg-[color:var(--bg-page)] font-serif text-[15px] font-semibold text-[color:var(--ink-primary)]"
        >
          {podcast.avatarInitial}
          {playing && (
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[color:var(--accent)] shadow-[0_0_0_2px_var(--bg-elevated)]"
            />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-sans text-[10px] uppercase tracking-[0.1em] text-[color:var(--ink-muted)]">
            {playing
              ? `Ch. ${podcast.chapters.indexOf(playbackChapter!) + 1 || 1} · ${fmt(currentTime)} / ${fmt(totalSec)}`
              : "Companion podcast"}
          </div>
          <div className="overflow-hidden text-ellipsis whitespace-nowrap font-sans text-[13px] font-semibold text-[color:var(--ink-primary)]">
            {displayChapter?.title ?? podcast.chapters[0].title}
          </div>
          <div className="mt-1.5 h-[2px] rounded-full bg-[color:var(--hairline)]">
            <div
              className="h-full rounded-full bg-[color:var(--ink-primary)]"
              style={{ width: `${(progress * 100).toFixed(1)}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-[color:var(--cta)] font-sans text-[12px] text-[color:var(--cta-ink)]"
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close chapter list" : "Open chapter list"}
          className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full border border-[color:var(--hairline)] font-sans text-[14px] text-[color:var(--ink-muted)]"
        >
          {open ? "↓" : "↑"}
        </button>
      </div>

      {/* Expanded card — desktop centered side panel, mobile sheet above the bar */}
      {open && (
        <div
          className={[
            "fixed z-50 flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--outline)]",
            "bg-[color:var(--bg-elevated)] shadow-[var(--shadow-float)]",
            "md:bottom-6 md:right-6 md:w-[340px]",
            "inset-x-3 bottom-[76px] md:inset-auto",
          ].join(" ")}
          role="dialog"
          aria-label="Podcast player"
        >
          <header className="flex items-center gap-3 border-b border-[color:var(--hairline)] px-4 py-3">
            <span
              aria-hidden
              className="relative grid h-11 w-11 flex-shrink-0 place-items-center rounded-full border-[1.5px] border-[color:var(--ink-primary)] bg-[color:var(--bg-page)] font-serif text-[18px] font-semibold text-[color:var(--ink-primary)]"
            >
              {podcast.avatarInitial}
              {playing && (
                <span
                  aria-hidden
                  className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_0_2px_var(--bg-elevated)]"
                />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="font-sans text-[10px] uppercase tracking-[0.1em] text-[color:var(--ink-muted)]">
                {playing ? "Now playing" : "Podcast"} · Ch.{" "}
                {displayChapter ? podcast.chapters.indexOf(displayChapter) + 1 : 1} of{" "}
                {podcast.chapters.length}
              </div>
              <div className="overflow-hidden text-ellipsis whitespace-nowrap font-sans text-[14px] font-semibold text-[color:var(--ink-primary)]">
                {displayChapter?.title ?? podcast.chapters[0].title}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Collapse"
              className="grid h-7 w-7 place-items-center rounded-full border border-[color:var(--hairline)] font-sans text-[14px] text-[color:var(--ink-muted)] hover:bg-[color:var(--bg-page)]"
            >
              −
            </button>
          </header>

          <ul className="max-h-[220px] overflow-y-auto py-2">
            {podcast.chapters.map((c, i) => {
              const isCurrent = displayChapter?.id === c.id;
              const isPlayed = playing && currentTime >= c.startSec && !isCurrent;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => jumpToChapter(c)}
                    className={[
                      "flex w-full items-center gap-3 px-4 py-2 text-left font-sans text-[13px]",
                      isCurrent
                        ? "border-l-2 border-[color:var(--accent)] bg-[color:rgba(169,68,39,0.06)] pl-[14px]"
                        : "border-l-2 border-transparent",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "min-w-[20px] font-sans text-[11px] tabular-nums",
                        isCurrent
                          ? "font-semibold text-[color:var(--accent)]"
                          : isPlayed
                            ? "text-[color:var(--ink-body)]"
                            : "text-[color:var(--ink-faint)]",
                      ].join(" ")}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={[
                        "flex-1 overflow-hidden text-ellipsis whitespace-nowrap",
                        isCurrent
                          ? "font-semibold text-[color:var(--ink-primary)]"
                          : isPlayed
                            ? "text-[color:var(--ink-body)]"
                            : "text-[color:var(--ink-muted)]",
                      ].join(" ")}
                    >
                      {c.title}
                    </span>
                    <span className="font-sans text-[11px] tabular-nums text-[color:var(--ink-faint)]">
                      {fmt(c.startSec)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-[color:var(--hairline)] px-4 pb-4 pt-3">
            <div className="relative mb-2 h-1 rounded-full bg-[color:var(--hairline)]">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[color:var(--ink-primary)]"
                style={{ width: `${(progress * 100).toFixed(1)}%` }}
              />
              {podcast.chapters.slice(1).map((c) => (
                <span
                  key={c.id}
                  aria-hidden
                  className="absolute -top-0.5 h-2 w-[2px] bg-[color:var(--ink-muted)] opacity-50"
                  style={{ left: `${((c.startSec / totalSec) * 100).toFixed(1)}%` }}
                />
              ))}
            </div>
            <div className="mb-3 flex justify-between font-sans text-[11px] tabular-nums text-[color:var(--ink-muted)]">
              <span>{fmt(currentTime)}</span>
              <span>−{fmt(remaining)}</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  const audio = audioRef.current;
                  if (audio) audio.currentTime = Math.max(0, audio.currentTime - 15);
                }}
                aria-label="Rewind 15 seconds"
                className="font-sans text-[11px] text-[color:var(--ink-muted)] hover:text-[color:var(--ink-primary)]"
              >
                ⏮ 15
              </button>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? "Pause" : "Play"}
                className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--cta)] font-sans text-[14px] text-[color:var(--cta-ink)]"
              >
                {playing ? "❚❚" : "▶"}
              </button>
              <button
                type="button"
                onClick={() => {
                  const audio = audioRef.current;
                  if (audio)
                    audio.currentTime = Math.min(totalSec, audio.currentTime + 30);
                }}
                aria-label="Forward 30 seconds"
                className="font-sans text-[11px] text-[color:var(--ink-muted)] hover:text-[color:var(--ink-primary)]"
              >
                30 ⏭
              </button>
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="ml-auto inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[color:var(--outline)] px-3.5 py-1.5 font-sans text-[12px] font-medium text-[color:var(--ink-primary)] hover:bg-[color:var(--bg-page)]"
              >
                ▶ Watch video
              </button>
            </div>
          </div>
        </div>
      )}

      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        src={podcast.videoSrc}
        poster={podcast.videoPoster}
        title="Podcast — full video"
      />
    </>,
    document.body,
  );
}
