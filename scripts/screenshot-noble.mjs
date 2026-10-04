#!/usr/bin/env node
// Noble authenticated captures.
// Usage: NOBLE_EMAIL=... NOBLE_PASSWORD=... node scripts/screenshot-noble.mjs
// Writes .webp into public/case-studies/noble-saas/.

import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const base = process.env.NOBLE_BASE ?? "https://www.noblelink.app";
const email = process.env.NOBLE_EMAIL;
const password = process.env.NOBLE_PASSWORD;
if (!email || !password) {
  console.error("set NOBLE_EMAIL and NOBLE_PASSWORD");
  process.exit(2);
}

const outDir = path.join(repoRoot, "public", "case-studies", "noble-saas");
await mkdir(outDir, { recursive: true });

async function waitStable(page) {
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  await page.waitForTimeout(600);
}

async function shot(page, name) {
  const out = path.join(outDir, name);
  await waitStable(page);
  await page.screenshot({ path: out, type: "webp", quality: 88, fullPage: false });
  console.log(`✓ ${name}`);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
});
const page = await ctx.newPage();

// 1. Marketing home (unauthed)
await page.goto(base);
await shot(page, "marketing-home.webp");

// 2. Pricing (unauthed)
await page.goto(`${base}/pricing`);
await shot(page, "pricing.webp");

// 3. Login + authenticate
await page.goto(`${base}/login`);
await page.fill('input[type="email"]', email);
await page.fill('input[type="password"]', password);
await Promise.all([
  page.waitForURL((u) => !u.pathname.includes("/login"), { timeout: 20000 }).catch(() => {}),
  page.click('button[type="submit"], input[type="submit"]'),
]);
await waitStable(page);
console.log(`→ post-login URL: ${page.url()}`);
await shot(page, "dashboard.webp");

// 4. Try common authed routes
const authedRoutes = [
  ["/bookings", "bookings.webp"],
  ["/calendar", "calendar.webp"],
  ["/services", "services.webp"],
  ["/clients", "clients.webp"],
  ["/settings", "settings.webp"],
  ["/dashboard", "dashboard-explicit.webp"],
];
for (const [route, name] of authedRoutes) {
  try {
    const resp = await page.goto(`${base}${route}`, { waitUntil: "domcontentloaded", timeout: 15000 });
    if (!resp || resp.status() >= 400) {
      console.log(`– skip ${route} (status ${resp?.status()})`);
      continue;
    }
    await shot(page, name);
  } catch (err) {
    console.log(`– skip ${route} (${err.message.split("\n")[0]})`);
  }
}

// 5. Mobile dashboard
await ctx.close();
const mctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  reducedMotion: "reduce",
});
const mpage = await mctx.newPage();
await mpage.goto(`${base}/login`);
await mpage.fill('input[type="email"]', email);
await mpage.fill('input[type="password"]', password);
await Promise.all([
  mpage.waitForURL((u) => !u.pathname.includes("/login"), { timeout: 20000 }).catch(() => {}),
  mpage.click('button[type="submit"], input[type="submit"]'),
]);
await waitStable(mpage);
await shot(mpage, "dashboard-mobile.webp");
await mctx.close();

await browser.close();
console.log("done.");
