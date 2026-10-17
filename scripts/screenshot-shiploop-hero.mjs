#!/usr/bin/env node
// Hero image for /work/claude-shiploop — scorecard crop with Tier 2 rows visible.
// Writes 1100×700 webp to public/case-studies/claude-shiploop/cover.webp.

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const base = process.env.PORTFOLIO_BASE ?? "http://localhost:3000";
const outDir = path.join(repoRoot, "public", "case-studies", "claude-shiploop");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1600, height: 5000 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
});
const page = await ctx.newPage();

await page.goto(`${base}/tools`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready).catch(() => {});

// Scroll in viewport-height increments so framer-motion whileInView triggers.
await page.evaluate(async () => {
  const step = window.innerHeight;
  const total = document.body.scrollHeight;
  for (let y = 0; y < total; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 150));
  }
  window.scrollTo(0, 0);
  await new Promise((r) => setTimeout(r, 300));
});

// Find the scorecard card (the elevated bg block containing the <table>).
const card = page.locator("div:has(> table)").first();
await card.waitFor({ state: "visible" });
await card.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);

const box = await card.boundingBox();
if (!box) throw new Error("scorecard box missing");

// Capture the whole card first.
const rawPath = path.join(outDir, "_scorecard-raw.png");
await page.screenshot({
  path: rawPath,
  clip: { x: box.x, y: box.y, width: box.width, height: box.height },
  type: "png",
});
console.log(`✓ raw card ${Math.round(box.width)}×${Math.round(box.height)}`);

// Compute per-row y to anchor the crop around the hrekov-dev row (Tier 2).
const rowRects = await page.evaluate(() => {
  const rows = Array.from(document.querySelectorAll("tbody tr"));
  return rows.map((row) => {
    const r = row.getBoundingClientRect();
    const headerCell = row.querySelector("th");
    const nameEl = headerCell?.querySelector('div.font-serif');
    return {
      name: nameEl?.textContent?.trim() ?? "",
      top: r.top + window.scrollY,
      bottom: r.bottom + window.scrollY,
      height: r.height,
    };
  });
});
console.log("rows:", rowRects);

const hrekov = rowRects.find((r) => r.name.includes("hrekov"));
const shiploop = rowRects.find((r) => r.name.toLowerCase().includes("shiploop"));
if (!hrekov || !shiploop) {
  throw new Error("could not find hrekov-dev or claude-shiploop row");
}

// Capture a clip anchored to table header + last 3 rows (fieldmark Tier 1, hrekov Tier 2, shiploop Tier 2).
// Use native 2x (deviceScaleFactor) and let final webp downscale from a higher-res source for crispness.
const thead = await page.evaluate(() => {
  const h = document.querySelector("thead");
  if (!h) return null;
  const r = h.getBoundingClientRect();
  return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
});
if (!thead) throw new Error("no thead");

// Figure out crop window — want header + the Tier 2 cluster. Fieldmark row index 4 (tier 1) gives
// natural tonal contrast against the two Tier 2 rows beneath it.
const fieldmark = rowRects.find((r) => r.name.toLowerCase().includes("fieldmark"));
const clusterTop = fieldmark ? fieldmark.top : hrekov.top;
const clusterBottom = shiploop.bottom;

// Target ratio ~1100×700 = 11:7 ≈ 1.571
const TARGET_W = 1100;
const TARGET_H = 700;
const ratio = TARGET_W / TARGET_H;

// Capture at full card width, then crop a 11:7 window centered on the cluster.
const cardLeft = box.x;
const cardRight = box.x + box.width;

// Height for the clip in page pixels (we'll scale to 1100 width at the end).
// Need header + cluster to be visible — compute the visible height.
const headerHeight = thead.bottom - thead.top;
const clusterHeight = clusterBottom - clusterTop;

// Build the full crop. Include the "Scorecard." title block above too (for recognition value).
// Grab a 50px padding above thead.
const scorecardHeading = await page.evaluate(() => {
  const h = Array.from(document.querySelectorAll("h3.font-serif")).find((el) =>
    el.textContent?.trim().startsWith("Scorecard"),
  );
  if (!h) return null;
  const r = h.getBoundingClientRect();
  return { top: r.top + window.scrollY };
});

const topY = scorecardHeading ? scorecardHeading.top - 24 : thead.top - 32;
const bottomY = clusterBottom + 24;
const clipHeight = bottomY - topY;
const clipWidth = box.width;

// The raw capture is wider than 11:7 — fine, we'll letterbox-crop in post with sharp.
const clipPath = path.join(outDir, "_scorecard-clip.png");
await page.screenshot({
  path: clipPath,
  clip: { x: cardLeft, y: topY, width: clipWidth, height: clipHeight },
  type: "png",
});
console.log(`✓ clip ${Math.round(clipWidth)}×${Math.round(clipHeight)}`);

// Convert clip to 1100×700 webp using sharp (resize to fit width, then crop top).
// The source is at 2× DPR so dimensions are doubled.
const src = sharp(clipPath);
const meta = await src.metadata();
console.log(`source png ${meta.width}×${meta.height}`);

// Scale so width = 2200 (2× of 1100 target), then crop to 2200×1400 anchored at bottom.
const scaledWidth = 2200;
const scaleRatio = scaledWidth / (meta.width ?? scaledWidth);
const scaledHeight = Math.round((meta.height ?? 1) * scaleRatio);
const targetScaledH = 1400;

const resized = sharp(clipPath).resize({ width: scaledWidth });
const buffer = await resized.toBuffer();
const resizedMeta = await sharp(buffer).metadata();

// Anchor on bottom so Tier 2 rows + context tags stay in view; if we overflow top, that's fine
// (we lose the Scorecard heading, which recruiters don't need to see — the two Tier-2 ink pills do the work).
const cropTop = Math.max(0, (resizedMeta.height ?? targetScaledH) - targetScaledH);
await sharp(buffer)
  .extract({ left: 0, top: cropTop, width: scaledWidth, height: Math.min(targetScaledH, resizedMeta.height ?? targetScaledH) })
  .resize({ width: TARGET_W, height: TARGET_H, fit: "cover", position: "bottom" })
  .webp({ quality: 90 })
  .toFile(path.join(outDir, "cover.webp"));
console.log(`✓ cover.webp ${TARGET_W}×${TARGET_H}`);

await browser.close();
console.log("done.");
