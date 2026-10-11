#!/usr/bin/env node
// Screenshot a live blog post for use as hero screen content.
//
// Usage:
//   node scripts/screenshot-blog-post.mjs <slug> [--device=iphone|laptop]
//
// Writes /tmp/screen-<slug>-<device>.png

import { chromium, devices } from "playwright";

const args = process.argv.slice(2);
if (args.length < 1) {
  console.error("usage: screenshot-blog-post.mjs <slug> [--device=iphone|laptop]");
  process.exit(2);
}
const slug = args[0];
const flags = Object.fromEntries(
  args.slice(1).filter((a) => a.startsWith("--")).map((a) => {
    const [k, v] = a.slice(2).split("=");
    return [k, v ?? true];
  }),
);
const device = flags.device ?? "iphone";
const url = `http://localhost:3000/blog/${slug}`;

const browser = await chromium.launch();
const context =
  device === "iphone"
    ? await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        userAgent: devices["iPhone 15 Pro"].userAgent,
        colorScheme: "light",
        reducedMotion: "reduce",
      })
    : await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: "light", reducedMotion: "reduce" });

const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1500);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);

const out = `/tmp/screen-${slug}-${device}.png`;
await page.screenshot({ path: out, type: "png", fullPage: false });
await browser.close();
console.log(`✓ ${out}`);
