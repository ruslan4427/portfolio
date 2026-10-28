#!/usr/bin/env node
// Regenerate every Journal image in the `studio` style (Sprint 25).
//
// Usage:
//   node scripts/gen-journal-studio.mjs            # all images
//   node scripts/gen-journal-studio.mjs <slug>     # one post
//   node scripts/gen-journal-studio.mjs --dry      # print prompts only
//
// Needs GEMINI_API_KEY (env or .env.local). Files carry a `-studio` suffix
// so the image optimizer and CDN never serve a cached ink drawing under the
// same URL. `alt` is what the post uses — re-check it against the new photo
// after every regeneration (alt has to describe what is on screen).

import { spawnSync } from "node:child_process";

export const JOURNAL_IMAGES = [
  {
    slug: "launching-the-journal",
    file: "hero-studio.jpg",
    subject:
      "an open blank white notebook lying flat, a plain white pencil resting across the gutter, a long window shadow falling diagonally over one page",
    alt: "An open blank notebook with a pencil across it, half in a long diagonal window shadow.",
  },
  {
    slug: "shipping-the-cross-poster",
    file: "hero-studio.jpg",
    subject:
      "a white ceramic Y-shaped pipe junction standing on the surface, a single rolled sheet of white paper entering the single inlet, the two outlets pointing away",
    alt: "A white Y-shaped pipe junction with one rolled sheet of paper entering its single inlet.",
  },
  {
    slug: "no-company-no-api",
    file: "hero-studio.jpg",
    subject:
      "a small closed white padlock resting on top of a sealed plain white envelope, the padlock's shadow stretched long across the envelope",
    alt: "A small white padlock resting on a sealed envelope, its shadow stretched across the paper.",
  },
  {
    slug: "no-company-no-api",
    file: "paperwork-stack-studio.jpg",
    subject:
      "a tall neat stack of plain white paper sheets and folders seen from a low angle, a single small white key balanced on the very top",
    alt: "A tall stack of blank papers and folders with a single small key balanced on top.",
  },
  {
    slug: "no-company-no-api",
    file: "graveyard-fork-studio.jpg",
    subject:
      "two strips of folded white paper diverging from one point like a fork in a path; the left strip is weighed down by a row of small stamped paper blocks, the right strip is empty and continues into the light",
    alt: "Two paper strips forking from one point — one weighed down by small paper blocks, the other empty.",
  },
  {
    slug: "classify-before-you-code",
    file: "hero-studio.jpg",
    subject:
      "ten white matte blocks lined up in a row from a tiny cube to a large box, evenly spaced, sorted by size, long shadows falling across them",
    alt: "Ten white blocks in a row, sorted from a tiny cube to a large box, in long diagonal shadow.",
  },
  {
    slug: "classify-before-you-code",
    file: "lane-map-studio.jpg",
    subject:
      "top-down view of a white tray with ten parallel grooves, each groove holding one white object of a different size — a small bead, a pebble, a domino, a box",
    alt: "Top-down view of a tray with ten parallel grooves, each holding one object of a different size.",
  },
  {
    slug: "classify-before-you-code",
    file: "fork-signs-studio.jpg",
    subject:
      "two nearly identical white paper arrow tags lying on the surface, pointing in two slightly different directions from the same spot",
    alt: "Two nearly identical paper arrows pointing in slightly different directions from the same spot.",
  },
  {
    slug: "classify-before-you-code",
    file: "two-workshops-studio.jpg",
    subject:
      "two halves of one surface side by side: on the left four small white wooden chairs stand neatly in a row; on the right one small chair stands beside a loose pile of broken chair parts",
    alt: "Left, four small chairs in a neat row; right, one chair beside a pile of broken chair parts.",
  },
  {
    slug: "shipping-claude-shiploop",
    file: "hero-studio.jpg",
    subject:
      "seven identical small white boxes in a perfectly straight row, evenly spaced, each one slightly different in its lid fold, in raking window light",
    alt: "Seven identical small white boxes in a straight row under raking window light.",
  },
  {
    slug: "shipping-claude-shiploop",
    file: "ledger-studio.jpg",
    subject:
      "an open white ledger book with faint ruled lines and no writing, a plain white pen resting beside it, three-quarter view",
    alt: "An open ledger with faint ruled lines and a pen resting beside it.",
  },
  {
    slug: "two-claudes-one-app",
    file: "hero-studio.jpg",
    subject:
      "two small white matte devices on the surface, a closed laptop on the left and a phone lying flat on the right, a single folded white paper note resting between them like a message passed across, long diagonal shadows",
    alt: "A closed white laptop and a white phone side by side, a folded paper note resting between them, in long diagonal shadow.",
  },
];

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const only = args.find((a) => !a.startsWith("--"));
const todo = JOURNAL_IMAGES.filter((i) => !only || i.slug === only);

if (todo.length === 0) {
  console.error(`no images for "${only}"`);
  process.exit(2);
}

let failed = 0;
for (const img of todo) {
  const out = `public/blog/${img.slug}/${img.file}`;
  console.log(`\n→ ${out}`);
  if (dry) {
    console.log(`  subject: ${img.subject}\n  alt: ${img.alt}`);
    continue;
  }
  const r = spawnSync(
    "node",
    ["scripts/gen-blog-hero.mjs", img.slug, img.subject, "--style=studio", `--out=${out}`],
    { stdio: "inherit" },
  );
  if (r.status !== 0) failed++;
}

if (failed) {
  console.error(`\n${failed} of ${todo.length} failed`);
  process.exit(1);
}
