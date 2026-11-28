#!/usr/bin/env node
// Fails the build if a case-study podcast breaks the template in
// specs/31-podcast-companion (length, chapter shape, gist, and section ids
// that must exist in the MDX and cover it in order). Runs in `prebuild`.
//
// Imports the .ts sources directly (Node ≥ 22.18 strips types). On an older
// Node it logs and skips rather than blocking the deploy.

import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const REPO = resolve(new URL("..", import.meta.url).pathname);

let podcasts, validatePodcast, extractChapters;
try {
  ({ podcasts, validatePodcast } = await import(join(REPO, "content/case-studies/podcasts.ts")));
  ({ extractChapters } = await import(join(REPO, "lib/rehype-case-sections.ts")));
} catch (e) {
  console.warn(`[verify-podcasts] skipped: cannot import TS on Node ${process.version} (${e.code ?? e.message})`);
  process.exit(0);
}

let failed = 0;
for (const [slug, podcast] of Object.entries(podcasts)) {
  const mdx = join(REPO, "content/case-studies", `${slug}.mdx`);
  if (!existsSync(mdx)) {
    console.error(`✗ ${slug}: no content/case-studies/${slug}.mdx`);
    failed++;
    continue;
  }
  const ids = extractChapters(readFileSync(mdx, "utf8")).map((c) => c.id);
  const errs = validatePodcast(podcast, ids);
  if (errs.length) {
    failed++;
    console.error(`✗ ${slug}:\n  - ${errs.join("\n  - ")}`);
  } else {
    console.log(`✓ ${slug}: ${podcast.chapters.length} chapters, ${podcast.totalSec}s, covers ${ids.filter((i) => /^\d+-/.test(i)).length} sections`);
  }
}
process.exit(failed ? 1 : 0);
