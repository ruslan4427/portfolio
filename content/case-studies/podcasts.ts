// Podcast companion data per case study: the template contract.
//
// The format rules live in specs/31-podcast-companion/spec.md ("Podcast
// format requirements"). validatePodcast() below enforces the mechanical
// ones. It runs in dev from the component and at build time via
// scripts/verify-podcasts.mjs.
//
// If a slug is present here, the case page mounts <PodcastCompanion />.
// Chapters map onto MDX section ids produced by rehype-case-sections, which
// slugs the "## heading": "## 2. The stateless-model problem" becomes
// "2-the-stateless-model-problem". Check the real ids with
//   curl -s localhost:3000/work/<slug> | grep -o '<section[^>]*id="[^"]*"'

export type PodcastChapter = {
  /** Unique id, local to the podcast. Used as React key. */
  id: string;
  /** Short chapter title shown in the dock and the drift card. */
  title: string;
  /** One sentence (≤ 90 chars): what this part of the podcast claims. */
  gist: string;
  /** Seconds into audioSrc where this chapter starts. */
  startSec: number;
  /** Consecutive MDX section ids (1–3) this chapter is about, in article order. */
  sectionIds: string[];
};

export type Podcast = {
  /** Total length of the audio in seconds (≤ 240). */
  totalSec: number;
  /** Audio track (mp4 or m4a works). Same timeline as videoSrc. */
  audioSrc: string;
  /** Companion video, same timeline as audioSrc. Keep faces centred: the player crops it to a circle. */
  videoSrc: string;
  /** Poster for the video. */
  videoPoster: string;
  /** Single character shown if the avatar image is missing. */
  avatarInitial: string;
  /** Host portrait shown in the dock. */
  avatarSrc?: string;
  /** Chapters in play order. First chapter starts at 0. */
  chapters: PodcastChapter[];
};

export const PODCAST_LIMITS = {
  maxTotalSec: 240,
  minChapterSec: 15,
  maxChapterSec: 60,
  maxSectionsPerChapter: 3,
  maxGistChars: 90,
} as const;

/**
 * Checks the mechanical template rules. Pass `sectionIds` (in article order)
 * to also check coverage, order and existence against the rendered MDX.
 * Returns human-readable problems; an empty list means the podcast conforms.
 */
export function validatePodcast(p: Podcast, sectionIds?: string[]): string[] {
  const errs: string[] = [];
  const L = PODCAST_LIMITS;
  if (p.totalSec > L.maxTotalSec) errs.push(`totalSec ${p.totalSec} > ${L.maxTotalSec}`);
  if (p.chapters.length === 0) errs.push("no chapters");
  if (p.chapters[0] && p.chapters[0].startSec !== 0) errs.push("first chapter must start at 0");
  const ids = new Set<string>();
  p.chapters.forEach((c, i) => {
    if (ids.has(c.id)) errs.push(`duplicate chapter id "${c.id}"`);
    ids.add(c.id);
    const end = p.chapters[i + 1]?.startSec ?? p.totalSec;
    const len = end - c.startSec;
    if (len <= 0) errs.push(`chapter "${c.id}": startSec must strictly increase`);
    else if (len < L.minChapterSec || len > L.maxChapterSec)
      errs.push(`chapter "${c.id}" runs ${len}s (allowed ${L.minChapterSec}–${L.maxChapterSec}s)`);
    if (!c.gist?.trim()) errs.push(`chapter "${c.id}" has no gist`);
    else if (c.gist.length > L.maxGistChars)
      errs.push(`chapter "${c.id}" gist is ${c.gist.length} chars (> ${L.maxGistChars})`);
    if (c.sectionIds.length < 1 || c.sectionIds.length > L.maxSectionsPerChapter)
      errs.push(`chapter "${c.id}" covers ${c.sectionIds.length} sections (allowed 1–${L.maxSectionsPerChapter})`);
  });
  if (sectionIds) {
    const numbered = sectionIds.filter((id) => /^\d+-/.test(id));
    const mapped = p.chapters.flatMap((c) => c.sectionIds);
    mapped.forEach((id) => {
      if (!sectionIds.includes(id)) errs.push(`section id "${id}" not found in the MDX`);
    });
    const missing = numbered.filter((id) => !mapped.includes(id));
    if (missing.length) errs.push(`sections not covered by any chapter: ${missing.join(", ")}`);
    const order = mapped.map((id) => sectionIds.indexOf(id)).filter((n) => n >= 0);
    if (order.some((n, i) => i > 0 && n !== order[i - 1] + 1))
      errs.push("chapters must cover sections consecutively, in article order");
  }
  return errs;
}

export const podcasts: Record<string, Podcast> = {
  "hrekov-dev": {
    // Timings follow the template (about 3.5 min). The audio is still the
    // legacy 8:15 part-1 cut, so what you hear doesn't match yet. The recut
    // will be recorded to these chapters (spec 31).
    totalSec: 220,
    audioSrc: "/videos/podcast-hrekov-dev-part1.mp4",
    videoSrc: "/videos/podcast-hrekov-dev-part1.mp4",
    videoPoster: "/videos/podcast-hrekov-dev-part1-poster.jpg",
    avatarInitial: "R",
    avatarSrc: "/videos/hero-poster.jpg",
    chapters: [
      {
        id: "intro",
        title: "The system",
        gist: "This case is the site itself, and the model forgets everything between sessions.",
        startSec: 0,
        sectionIds: ["1-cold-open", "2-the-stateless-model-problem"],
      },
      {
        id: "layer",
        title: "The persistence layer",
        gist: "One folder of small memory files, and an index the model reads first.",
        startSec: 40,
        sectionIds: ["3-the-persistence-layer", "4-the-memorymd-index"],
      },
      {
        id: "discipline",
        title: "ShipLoop discipline",
        gist: "A silent classifier routes every prompt, so memory gets written as a side effect.",
        startSec: 85,
        sectionIds: ["5-the-discipline-that-produces-memory", "6-devlog-stablelogic-the-163-number"],
      },
      {
        id: "results",
        title: "What it bought us",
        gist: "What the loop actually shipped, and the context it saves each session.",
        startSec: 130,
        sectionIds: ["7-what-the-machine-produced", "8-context-re-hydration-saved-per-session"],
      },
      {
        id: "steal",
        title: "How to steal it",
        gist: "Copy the shape, not the files, and the loop documents itself.",
        startSec: 175,
        sectionIds: ["9-how-to-steal-it", "10-the-recursive-close"],
      },
    ],
  },
};
