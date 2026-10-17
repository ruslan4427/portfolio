#!/usr/bin/env node
// Re-publish a blog post after a serializer/payload fix.
//   - Dev.to: PUT /articles/{id} with the fresh body + cover image.
//   - LinkedIn: DELETE the old UGC post, then POST a fresh one; both URNs
//     recorded in the ledger (old gets a `supersededBy` crumb).
//
// Usage:
//   node scripts/republish-one.mjs --slug <s> --channel <devto|linkedin>
//                                   [--dry-run] [--live]
//
// Reads the latest matching entry from `.distribution-ledger.jsonl` to
// get the remote id. The script is idempotent only in the dry-run path;
// a --live run on LinkedIn will create a new URN each time.

import { readFile, appendFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import matter from "gray-matter";
import { config as loadEnv } from "dotenv";
import { updateDevtoArticle } from "../lib/distribution/devto.mjs";
import {
  publishToLinkedIn,
  deleteLinkedInPost,
} from "../lib/distribution/linkedin.mjs";

loadEnv({ path: ".env.local" });

const { values } = parseArgs({
  options: {
    slug: { type: "string" },
    channel: { type: "string" },
    "dry-run": { type: "boolean", default: false },
    live: { type: "boolean", default: false },
  },
});

if (!values.slug || !values.channel) {
  console.error(
    "usage: node scripts/republish-one.mjs --slug <s> --channel <devto|linkedin> [--dry-run|--live]",
  );
  process.exit(2);
}

const dryRun = !values.live;
if (!dryRun) console.log("[republish] --live — this will hit the real API.");

const mdxPath = path.join(process.cwd(), "content", "blog", `${values.slug}.mdx`);
const raw = await readFile(mdxPath, "utf8");
const { content, data } = matter(raw);

const post = {
  slug: values.slug,
  frontmatter: data,
  mdxSource: content,
  canonicalUrl: `https://hrekov.dev/blog/${values.slug}`,
};

const ledgerPath = path.join(process.cwd(), ".distribution-ledger.jsonl");
const ledgerRaw = await readFile(ledgerPath, "utf8").catch(() => "");
const entries = ledgerRaw
  .split("\n")
  .filter(Boolean)
  .map((line) => {
    try {
      return JSON.parse(line);
    } catch {
      return null;
    }
  })
  .filter((e) => e && e.slug === values.slug && e.channel === values.channel);

const latest = entries[entries.length - 1];
if (!latest) {
  console.error(`no ledger entry for ${values.slug}/${values.channel}`);
  process.exit(3);
}

console.log(`[republish] previous: ${latest.publishedUrl} (${latest.remoteId})`);

async function record(entry) {
  const line =
    JSON.stringify({ ...entry, ts: new Date().toISOString() }) + "\n";
  if (dryRun) {
    console.log(`[republish:dry-run] would append ledger: ${line.trim()}`);
    return;
  }
  await appendFile(ledgerPath, line, "utf8");
}

if (values.channel === "devto") {
  const result = await updateDevtoArticle(post, latest.remoteId, { dryRun });
  console.log("[republish] devto PUT ok:", result);
  await record({
    slug: values.slug,
    channel: "devto",
    publishedUrl: result.publishedUrl,
    remoteId: result.remoteId,
    note: "republish — serializer fix + cover_image added",
  });
} else if (values.channel === "linkedin") {
  console.log("[republish] deleting old UGC post…");
  await deleteLinkedInPost(latest.remoteId, { dryRun });
  console.log("[republish] posting fresh UGC post…");
  const result = await publishToLinkedIn(post, { dryRun });
  console.log("[republish] linkedin POST ok:", result);
  await record({
    slug: values.slug,
    channel: "linkedin",
    publishedUrl: result.publishedUrl,
    remoteId: result.remoteId,
    note: `republish — superseded ${latest.remoteId}`,
  });
} else {
  console.error(`unknown channel: ${values.channel}`);
  process.exit(2);
}

console.log("\n[republish] done.");
