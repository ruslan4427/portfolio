import { appendFile } from "node:fs/promises";
import path from "node:path";

const DEVLOG_PATH = path.join(process.cwd(), "DEVLOG.md");

function today() {
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Append a Problem/Decision/Result/Lesson entry to DEVLOG.md.
 * heading may include a slug prefix; we always prefix with the UTC date.
 */
export async function appendDevlogEntry({ heading, problem, decision, result, lesson }) {
  const entry =
    `\n## ${today()} — ${heading}\n\n` +
    `**Problem:** ${problem}\n\n` +
    `**Decision:** ${decision}\n\n` +
    `**Result:** ${result}\n\n` +
    `**Lesson:** ${lesson}\n\n` +
    `---\n`;
  await appendFile(DEVLOG_PATH, entry, "utf8");
}
