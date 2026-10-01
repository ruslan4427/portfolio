import { appendFile, readFile } from "node:fs/promises";
import path from "node:path";

const LEDGER_PATH = path.join(process.cwd(), ".distribution-ledger.jsonl");

let cache = null;

async function load() {
  if (cache) return cache;
  cache = new Set();
  try {
    const raw = await readFile(LEDGER_PATH, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const entry = JSON.parse(trimmed);
        if (entry.slug && entry.channel) {
          cache.add(`${entry.slug}::${entry.channel}`);
        }
      } catch {
        // skip malformed lines; ledger is append-only so history is preserved
      }
    }
  } catch (err) {
    if (err && err.code === "ENOENT") return cache;
    throw err;
  }
  return cache;
}

export async function hasBeenPublished(slug, channel) {
  const set = await load();
  return set.has(`${slug}::${channel}`);
}

export async function recordPublish({ slug, channel, publishedUrl, remoteId }) {
  const entry = {
    slug,
    channel,
    publishedUrl,
    remoteId,
    ts: new Date().toISOString(),
  };
  await appendFile(LEDGER_PATH, JSON.stringify(entry) + "\n", "utf8");
  const set = await load();
  set.add(`${slug}::${channel}`);
}

export const LEDGER_RELPATH = ".distribution-ledger.jsonl";
