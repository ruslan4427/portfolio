import { appendFile, readFile } from "node:fs/promises";
import path from "node:path";

const LEDGER_PATH = path.join(process.cwd(), ".distribution-ledger.jsonl");

// Map<`${slug}::${channel}`, boolean> — latest state per key.
// Append-only ledger is replayed in order; later entries win.
let cache = null;

async function load() {
  if (cache) return cache;
  cache = new Map();
  try {
    const raw = await readFile(LEDGER_PATH, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const entry = JSON.parse(trimmed);
        if (entry.slug && entry.channel) {
          cache.set(`${entry.slug}::${entry.channel}`, entry.action !== "unpublish");
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
  const map = await load();
  return map.get(`${slug}::${channel}`) === true;
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
  const map = await load();
  map.set(`${slug}::${channel}`, true);
}

export const LEDGER_RELPATH = ".distribution-ledger.jsonl";
