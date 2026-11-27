// Podcast companion data per case study.
//
// If a slug is present here, the case page mounts <PodcastCompanion /> and the
// inline <video> blocks in the MDX are removed. Chapters map onto the MDX
// section ids rehype-case-sections produces — slug of the "## heading", e.g.
// "## 2. The stateless-model problem" → "2-the-stateless-model-problem".
//
// `startSec` is the offset inside `audioSrc` where the chapter begins. The
// audio file is a single compact recut (target: 3–4 min) covering the whole
// case; chapters are the scroll-sync markers, not separate files.

export type PodcastChapter = {
  /** Unique id, local to the podcast. Used as React key. */
  id: string;
  /** Short chapter title shown in the widget. */
  title: string;
  /** Seconds into audioSrc where this chapter starts. */
  startSec: number;
  /** MDX section ids this chapter covers for scroll-sync. */
  sectionIds: string[];
};

export type Podcast = {
  /** Total length of the audio, seconds. */
  totalSec: number;
  /** URL of the audio track (mp4 or m4a works as audio source). */
  audioSrc: string;
  /** URL of the companion video (opens in modal). */
  videoSrc: string;
  /** Poster for the video modal. */
  videoPoster: string;
  /** Single character shown if the avatar image is missing. */
  avatarInitial: string;
  /** Host portrait shown in the avatar circle. */
  avatarSrc?: string;
  /** Short line describing the podcast (shown in the not-started state). */
  teaser: string;
  /** Chapters in play order. First chapter starts at 0. */
  chapters: PodcastChapter[];
};

export const podcasts: Record<string, Podcast> = {
  "hrekov-dev": {
    // Current audio is the legacy part-1 cut (8:15). A compact 3–4 min recut
    // will replace this; chapter startSec values will be re-timed then.
    totalSec: 495,
    audioSrc: "/videos/podcast-hrekov-dev-part1.mp4",
    videoSrc: "/videos/podcast-hrekov-dev-part1.mp4",
    videoPoster: "/videos/podcast-hrekov-dev-part1-poster.jpg",
    avatarInitial: "R",
    avatarSrc: "/videos/hero-poster.jpg",
    teaser: "3 min · 5 chapters",
    chapters: [
      {
        id: "intro",
        title: "The system",
        startSec: 0,
        sectionIds: ["1-cold-open", "2-the-stateless-model-problem"],
      },
      {
        id: "layer",
        title: "The persistence layer",
        startSec: 60,
        sectionIds: ["3-the-persistence-layer", "4-the-memorymd-index"],
      },
      {
        id: "discipline",
        title: "ShipLoop discipline",
        startSec: 150,
        sectionIds: [
          "5-the-discipline-that-produces-memory",
          "6-devlog-stable-logic-the-163-number",
        ],
      },
      {
        id: "results",
        title: "What it bought us",
        startSec: 240,
        sectionIds: [
          "7-what-the-machine-produced",
          "8-context-re-hydration-saved-per-session",
        ],
      },
      {
        id: "steal",
        title: "How to steal it",
        startSec: 330,
        sectionIds: ["9-how-to-steal-it", "10-the-recursive-close"],
      },
    ],
  },
};
