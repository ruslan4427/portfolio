#!/usr/bin/env node
// Take down a cross-posted article on a single channel.
//   - Dev.to: PUT /articles/{id} with { published: false } (becomes a
//     draft; the ID stays reusable).
//   - LinkedIn: DELETE /v2/ugcPosts/{urn} (UGC can't be hidden — only
//     deleted).
//
// Usage:
//   node scripts/unpublish-one.mjs --slug <s> --channel <devto|linkedin>
//                                   [--dry-run] [--live]
//
// Reads the latest matching entry from `.distribution-ledger.jsonl` to
// get the remote id and appends an `action: "unpublish"` crumb.

import { readFile, appendFile } from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";
import { config as loadEnv } from "dotenv";
import { unpublishDevtoArticle } from "../lib/distribution/devto.mjs";
import { deleteLinkedInPost } from "../lib/distribution/linkedin.mjs";

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
    "usage: node scripts/unpublish-one.mjs --slug <s> --channel <devto|linkedin> [--dry-run|--live]",
  );
  process.exit(2);
}

const dryRun = !values.live;
if (!dryRun) console.log("[unpublish] --live — this will hit the real API.");

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

console.log(`[unpublish] target: ${latest.publishedUrl} (${latest.remoteId})`);

async function record(entry) {
  const line = JSON.stringify({ ...entry, ts: new Date().toISOString() }) + "\n";
  if (dryRun) {
    console.log(`[unpublish:dry-run] would append ledger: ${line.trim()}`);
    return;
  }
  await appendFile(ledgerPath, line, "utf8");
}

if (values.channel === "devto") {
  const result = await unpublishDevtoArticle(latest.remoteId, { dryRun });
  console.log("[unpublish] devto unpublish ok:", result);
  await record({
    slug: values.slug,
    channel: "devto",
    action: "unpublish",
    remoteId: latest.remoteId,
    note: "fast-track rollback — article unpublished (draft)",
  });
} else if (values.channel === "linkedin") {
  const result = await deleteLinkedInPost(latest.remoteId, { dryRun });
  console.log("[unpublish] linkedin DELETE ok:", result);
  await record({
    slug: values.slug,
    channel: "linkedin",
    action: "unpublish",
    remoteId: latest.remoteId,
    note: "fast-track rollback — UGC post deleted",
  });
} else {
  console.error(`unknown channel: ${values.channel}`);
  process.exit(2);
}

console.log("\n[unpublish] done.");
