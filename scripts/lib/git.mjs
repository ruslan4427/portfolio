import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

let configured = false;

async function ensureBotIdentity() {
  if (configured) return;
  await run("git", ["config", "user.name", "hrekov-bot"]);
  await run("git", ["config", "user.email", "actions@hrekov.dev"]);
  configured = true;
}

function isGitError(err) {
  return err && (err.code || err.stderr !== undefined);
}

export async function stageFile(relativePath) {
  await ensureBotIdentity();
  await run("git", ["add", "--", relativePath]);
}

export async function stageFiles(paths) {
  if (paths.length === 0) return;
  await ensureBotIdentity();
  await run("git", ["add", "--", ...paths]);
}

export async function hasStagedChanges() {
  try {
    await run("git", ["diff", "--cached", "--quiet"]);
    return false;
  } catch (err) {
    if (isGitError(err) && err.code === 1) return true;
    throw err;
  }
}

export async function commit(message) {
  await ensureBotIdentity();
  await run("git", ["commit", "-m", message]);
}

export async function pushWithRetry({ retries = 3, backoffMs = 2000 } = {}) {
  await ensureBotIdentity();
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      await run("git", ["push"]);
      return;
    } catch (err) {
      lastErr = err;
      if (i < retries - 1) {
        await new Promise((r) => setTimeout(r, backoffMs * (i + 1)));
        try {
          await run("git", ["pull", "--rebase"]);
        } catch {
          // continue — push retry will surface the underlying issue
        }
      }
    }
  }
  throw new Error(
    `git push failed after ${retries} attempts: ${lastErr?.stderr ?? lastErr?.message ?? "unknown"}`,
  );
}
