#!/usr/bin/env node
// Capture Noble public pages at mobile viewport.
// Usage: node scripts/screenshot-noble-mobile.mjs
// Writes .webp into public/case-studies/noble-saas/.

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const base = process.env.NOBLE_BASE ?? "https://www.noblelink.app";
const outDir = path.join(repoRoot, "public", "case-studies", "noble-saas");
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
});
const page = await ctx.newPage();

async function waitStable(p) {
  await p.waitForLoadState("networkidle").catch(() => {});
  await p.evaluate(() => document.fonts.ready).catch(() => {});
  await p.waitForTimeout(500);
}

async function shot(p, name) {
  await waitStable(p);
  await p.screenshot({
    path: path.join(outDir, name),
    type: "webp",
    quality: 88,
    fullPage: false,
  });
  console.log(`✓ ${name}`);
}

await page.goto(base);
await shot(page, "marketing-home-mobile.webp");

await page.goto(`${base}/pricing`);
await shot(page, "pricing-mobile.webp");

await browser.close();
console.log("done.");
