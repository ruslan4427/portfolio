"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { VideoModal } from "@/components/ui/VideoModal";
import { PodcastCursor } from "@/components/case-study/PodcastCursor";
import type { Podcast, PodcastChapter } from "@/content/case-studies/podcasts";

type Props = { podcast: Podcast };

function fmt(sec: number): string {
  if (!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Avatar({ podcast, size, live }: { podcast: Podcast; size: number; live: boolean }) {
  return (
    <span
      aria-hidden
      className="relative grid flex-shrink-0 place-items-center rounded-full border-[1.5px] border-[color:var(--ink-primary)] bg-[color:var(--bg-page)] font-serif font-semibold text-[color:var(--ink-primary)]"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {podcast.avatarSrc ? (
        <span className="absolute inset-[2px] overflow-hidden rounded-full">
          <Image src={podcast.avatarSrc} alt="" fill sizes={`${size}px`} className="object-cover" />
        </span>
      ) : (
        podcast.avatarInitial
      )}
      {live && (
        <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[color:var(--accent)] shadow-[0_0_0_2px_var(--bg-elevated)]" />
      )}
    </span>
  );
}

/**
 * Variant switch while we test the physics:
 *   fine pointer (desktop) → PodcastCursor (cursor is the player, round video on the right)
 *   touch, or ?companion=bar → the pill / bottom-bar player below
 */
export function PodcastCompanion({ podcast }: Props) {
  const [variant, setVariant] = useState<"cursor" | "bar" | null>(null);
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("companion");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only mount gate
    setVariant(forced === "bar" || forced === "cursor" ? forced : fine ? "cursor" : "bar");
  }, []);
  if (variant === null) return null;
  return variant === "cursor" ? <PodcastCursor podcast={podcast} /> : <PodcastBar podcast={podcast} />;
}

function PodcastBar({ podcast }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [video, setVideo] = useState<{ open: boolean; startAt: number }>({ open: false, startAt: 0 });
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [inArticle, setInArticle] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only mount gate
  useEffect(() => setMounted(true), []);

  // Lets globals.css lift BackToTop / FloatingEmailCTA above the mobile bar.
  useEffect(() => {
    document.body.dataset.podcastCompanion = "active";
    return () => {
      delete document.body.dataset.podcastCompanion;
    };
  }, []);

  // Scroll sync — which MDX section is in view?
  useEffect(() => {
    const ids = new Set(podcast.chapters.flatMap((c) => c.sectionIds));
    const sections = Array.from(ids)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

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

    const article = document.querySelector("article");
    const articleIo = article
      ? new IntersectionObserver(([entry]) => setInArticle(entry.isIntersecting), {
          rootMargin: "-10% 0px -10% 0px",
        })
      : null;
    if (article) articleIo?.observe(article);

    return () => {
      io.disconnect();
      articleIo?.disconnect();
    };
  }, [podcast]);

  // The <audio> only exists once mounted; attach listeners after that.
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
  }, [mounted]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  const seek = useCallback((sec: number, play: boolean) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(podcast.totalSec, sec));
    setCurrentTime(audio.currentTime);
    if (play) audio.play().catch(() => {});
  }, [podcast.totalSec]);

  const openVideo = useCallback(() => {
    const audio = audioRef.current;
    const t = audio?.currentTime ?? 0;
    audio?.pause();
    setVideo({ open: true, startAt: t });
  }, []);

  const closeVideo = useCallback(
    (t?: number) => {
      setVideo((v) => ({ ...v, open: false }));
      if (typeof t === "number") seek(t, false);
    },
    [seek],
  );

  const jumpToChapter = useCallback((c: PodcastChapter) => seek(c.startSec, true), [seek]);

  // Keep the <audio> mounted for the whole page so playback survives
  // scrolling out of the article; only the chrome hides.
  if (!mounted) return null;

  const scrollChapter = podcast.chapters.find(
    (c) => activeSectionId && c.sectionIds.includes(activeSectionId),
  );
  const playbackChapter =
    [...podcast.chapters].reverse().find((c) => c.startSec <= currentTime) ?? podcast.chapters[0];
  const displayChapter = playing ? playbackChapter : scrollChapter ?? podcast.chapters[0];
  const chapterNo = podcast.chapters.indexOf(displayChapter) + 1;
  const totalSec = podcast.totalSec;
  const progress = Math.min(1, Math.max(0, currentTime / totalSec));
  const showChrome = inArticle || playing;

  return createPortal(
    <>
      <audio ref={audioRef} src={podcast.audioSrc} preload="metadata" />

      {showChrome && (
        <>
          {/* xl+: pill sits left of BackToTop */}
          {!open && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open podcast companion"
              className="fixed bottom-6 right-[calc(var(--gutter)+3.5rem)] z-50 hidden items-center gap-3 rounded-[var(--radius-pill)] border border-[color:var(--outline)] bg-[color:var(--bg-elevated)] py-2 pl-2 pr-5 shadow-[var(--shadow-float)] transition-transform duration-[var(--dur-fast)] hover:-translate-y-0.5 focus-visible:shadow-[var(--focus-ring)] focus-visible:outline-none xl:inline-flex"
            >
              <Avatar podcast={podcast} size={44} live={playing} />
              {playing && (
                <span aria-hidden className="flex h-4 items-center gap-[3px] px-0.5">
                  {[6, 12, 16, 10, 6].map((h, i) => (
                    <span key={i} className="block w-0.5 rounded-full bg-[color:var(--accent)]" style={{ height: h }} />
                  ))}
                </span>
              )}
              <span className="min-w-0 text-left">
                <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.1em] text-[color:var(--ink-muted)]">
                  {playing ? `Ch. ${chapterNo} · ${fmt(currentTime)} / ${fmt(totalSec)}` : "Companion podcast"}
                </span>
                <span className="block max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap font-sans text-[13px] font-semibold text-[color:var(--ink-primary)]">
                  {playing ? displayChapter.title : podcast.teaser}
                </span>
              </span>
            </button>
          )}

          {/* < xl: full-width bottom bar */}
          <div className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-3 border-t border-[color:var(--outline)] bg-[color:var(--bg-elevated)] px-3.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] pt-2.5 shadow-[0_-1px_2px_rgba(0,0,0,0.03),0_-12px_32px_-12px_rgba(0,0,0,0.12)] xl:hidden">
            <Avatar podcast={podcast} size={40} live={playing} />
            <div className="min-w-0 flex-1">
              <div className="font-sans text-[10px] uppercase tracking-[0.1em] text-[color:var(--ink-muted)]">
                {playing ? `Ch. ${chapterNo} · ${fmt(currentTime)} / ${fmt(totalSec)}` : "Companion podcast"}
              </div>
              <div className="overflow-hidden text-ellipsis whitespace-nowrap font-sans text-[13px] font-semibold text-[color:var(--ink-primary)]">
                {displayChapter.title}
              </div>
              <div className="mt-1.5 h-[2px] rounded-full bg-[color:var(--hairline)]">
                <div className="h-full rounded-full bg-[color:var(--ink-primary)]" style={{ width: `${(progress * 100).toFixed(1)}%` }} />
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
              aria-expanded={open}
              className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full border border-[color:var(--hairline)] text-[color:var(--ink-muted)]"
            >
              {open ? (
                <span aria-hidden className="font-sans text-[16px] leading-none">×</span>
              ) : (
                <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M5 3.5h7M5 7h7M5 10.5h7" />
                  <circle cx="2" cy="3.5" r="0.6" fill="currentColor" />
                  <circle cx="2" cy="7" r="0.6" fill="currentColor" />
                  <circle cx="2" cy="10.5" r="0.6" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>

          {open && (
            <div
              role="dialog"
              aria-label="Podcast player"
              className="fixed inset-x-3 bottom-[76px] z-[60] flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--outline)] bg-[color:var(--bg-elevated)] shadow-[var(--shadow-float)] sm:left-auto sm:w-[360px] xl:bottom-6 xl:right-[calc(var(--gutter)+3.5rem)] xl:w-[340px]"
            >
              <header className="flex items-center gap-3 border-b border-[color:var(--hairline)] px-4 py-3">
                <Avatar podcast={podcast} size={44} live={playing} />
                <div className="min-w-0 flex-1">
                  <div className="font-sans text-[10px] uppercase tracking-[0.1em] text-[color:var(--ink-muted)]">
                    {playing ? "Now playing" : "Podcast"} · Ch. {chapterNo} of {podcast.chapters.length}
                  </div>
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap font-sans text-[14px] font-semibold text-[color:var(--ink-primary)]">
                    {displayChapter.title}
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
                  const isCurrent = displayChapter.id === c.id;
                  const isPlayed = playing && currentTime >= c.startSec && !isCurrent;
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => jumpToChapter(c)}
                        className={`flex w-full items-center gap-3 border-l-2 px-4 py-2 text-left font-sans text-[13px] ${
                          isCurrent
                            ? "border-[color:var(--accent)] bg-[color:rgba(169,68,39,0.06)] pl-[14px]"
                            : "border-transparent"
                        }`}
                      >
                        <span
                          className={`min-w-[20px] text-[11px] tabular-nums ${
                            isCurrent
                              ? "font-semibold text-[color:var(--accent)]"
                              : isPlayed
                                ? "text-[color:var(--ink-body)]"
                                : "text-[color:var(--ink-faint)]"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`flex-1 overflow-hidden text-ellipsis whitespace-nowrap ${
                            isCurrent
                              ? "font-semibold text-[color:var(--ink-primary)]"
                              : isPlayed
                                ? "text-[color:var(--ink-body)]"
                                : "text-[color:var(--ink-muted)]"
                          }`}
                        >
                          {c.title}
                        </span>
                        <span className="text-[11px] tabular-nums text-[color:var(--ink-faint)]">{fmt(c.startSec)}</span>
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
                  <span>−{fmt(Math.max(0, totalSec - currentTime))}</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => seek(currentTime - 15, false)}
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
                    onClick={() => seek(currentTime + 30, false)}
                    aria-label="Forward 30 seconds"
                    className="font-sans text-[11px] text-[color:var(--ink-muted)] hover:text-[color:var(--ink-primary)]"
                  >
                    30 ⏭
                  </button>
                  <button
                    type="button"
                    onClick={openVideo}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[color:var(--outline)] px-3.5 py-1.5 font-sans text-[12px] font-medium text-[color:var(--ink-primary)] hover:bg-[color:var(--bg-page)]"
                  >
                    ▶ Watch {currentTime > 1 ? `from ${fmt(currentTime)}` : "video"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <VideoModal
        open={video.open}
        onClose={closeVideo}
        src={podcast.videoSrc}
        poster={podcast.videoPoster}
        startAt={video.startAt}
        title="Podcast — full video"
      />
    </>,
    document.body,
  );
}
