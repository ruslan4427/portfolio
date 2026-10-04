#!/usr/bin/env node
// Capture deterministic screenshots of hrekov.dev pages into
// public/case-studies/<slug>/. Usage: node scripts/screenshot-web.mjs [base]
// where base defaults to https://hrekov.dev (pass http://localhost:3000 for dev).

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const base = process.argv[2] ?? "https://hrekov.dev";

const targets = [
  { slug: "hrekov-dev", page: "/", name: "home.webp", width: 1440, height: 900 },
  { slug: "hrekov-dev", page: "/work", name: "work-index.webp", width: 1440, height: 900 },
  { slug: "hrekov-dev", page: "/work/hrekov-dev", name: "case-page.webp", width: 1440, height: 900 },
  { slug: "hrekov-dev", page: "/blog", name: "journal.webp", width: 1440, height: 900 },
  { slug: "hrekov-dev", page: "/about", name: "about.webp", width: 1440, height: 900 },
  { slug: "hrekov-dev", page: "/", name: "home-mobile.webp", width: 390, height: 844 },
];

async function capture(browser, t) {
  const outDir = path.join(repoRoot, "public", "case-studies", t.slug);
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, t.name);

  const context = await browser.newContext({
    viewport: { width: t.width, height: t.height },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
    colorScheme: "light",
  });
  const page = await context.newPage();
  const url = new URL(t.page, base).toString();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: `
      /* Hide floating overlays that don't belong in portfolio captures */
      .fixed.bottom-6, [data-screenshot-hide] { display: none !important; }
    `,
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: outPath, type: "webp", quality: 88, fullPage: false });
  await context.close();
  console.log(`✓ ${url} → public/case-studies/${t.slug}/${t.name}`);
}

async function main() {
  console.log(`capturing from ${base}`);
  const browser = await chromium.launch();
  try {
    for (const t of targets) await capture(browser, t);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
