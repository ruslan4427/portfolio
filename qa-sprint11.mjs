import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const results = [];

function record(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} · ${name}${detail ? " — " + detail : ""}`);
}

(async () => {
  const browser = await chromium.launch();

  // ── QA 1: default (non-EU) — no consent banner, geo cookie present + 0
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);
    const bannerCount = await page.locator('[aria-label="Cookie preferences"]').count();
    record("non-EU: consent banner hidden", bannerCount === 0, `count=${bannerCount}`);
    const cookies = await ctx.cookies();
    const geo = cookies.find((c) => c.name === "geo-eu");
    record("non-EU: geo cookie present + =0", geo?.value === "0", `value=${geo?.value ?? "missing"}`);
    await ctx.close();
  }

  // ── QA 2: EU-simulated. Dev has no x-vercel-ip-country header so proxy
  //     always writes geo-eu=0. Playwright's fulfill can't safely rewrite
  //     multiple Set-Cookie headers, so we shim document.cookie on the
  //     client side to make the ConsentProvider read geo-eu=1 regardless.
  {
    const ctx = await browser.newContext();
    await ctx.addInitScript(() => {
      let proto = document;
      let descriptor = null;
      while (proto && !descriptor) {
        proto = Object.getPrototypeOf(proto);
        descriptor = proto && Object.getOwnPropertyDescriptor(proto, "cookie");
      }
      if (!descriptor) return;
      Object.defineProperty(document, "cookie", {
        configurable: true,
        get() {
          const raw = descriptor.get.call(document);
          const parts = raw ? raw.split("; ").filter((p) => !p.startsWith("geo-eu=")) : [];
          parts.push("geo-eu=1");
          return parts.join("; ");
        },
        set(value) {
          descriptor.set.call(document, value);
        },
      });
    });
    const page = await ctx.newPage();
    page.on("console", (m) => {
      if (m.type() === "error") console.log("  [browser error]", m.text());
    });
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    const debugCookie = await page.evaluate(() => document.cookie);
    console.log("  [debug] document.cookie in browser:", debugCookie);
    const banner = page.locator('[aria-label="Cookie preferences"]');
    const bannerVisible = await banner.isVisible().catch(() => false);
    record("EU: consent banner visible", bannerVisible);
    if (bannerVisible) {
      await banner.screenshot({ path: "/tmp/qa-consent-banner.png" });
      await page.getByRole("button", { name: "Accept" }).click();
      await page.waitForTimeout(300);
      const afterAcceptCount = await banner.count();
      record("EU: banner dismisses on Accept", afterAcceptCount === 0);
      const cookies = await ctx.cookies();
      const consent = cookies.find((c) => c.name === "consent");
      record(
        "EU: consent=accepted written",
        consent?.value === "accepted",
        `value=${consent?.value ?? "missing"}`,
      );
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(400);
      const resetBtn = page.getByRole("button", { name: "Reset analytics preference" });
      const resetVisible = await resetBtn.isVisible().catch(() => false);
      record("EU: footer reset link appears after accept", resetVisible);
      if (resetVisible) {
        await resetBtn.click();
        await page.waitForTimeout(300);
        const cookiesAfter = await ctx.cookies();
        const consentAfter = cookiesAfter.find((c) => c.name === "consent");
        record(
          "EU: reset clears consent cookie",
          !consentAfter,
          `value=${consentAfter?.value ?? "cleared"}`,
        );
      }
    }
    await ctx.close();
  }

  // ── QA 3: ViewToggle on /work/noble-saas
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE + "/work/noble-saas", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    const toggle = page.locator('[role="group"][aria-label="Case study view"]');
    const toggleVisible = await toggle.isVisible();
    record("ViewToggle mounted on noble-saas", toggleVisible);
    if (toggleVisible) {
      const article = page.locator("article[data-view]");
      const initialView = await article.getAttribute("data-view");
      record("Article defaults to executive view", initialView === "executive", `view=${initialView}`);
      const slug = await article.getAttribute("data-slug");
      record("Article carries data-slug", slug === "noble-saas", `slug=${slug}`);
      const recruiterBlock = page.locator("text=At a glance").first();
      const recruiterVisible = await recruiterBlock.isVisible();
      record("recruiterSummary block visible in executive", recruiterVisible);
      await page.screenshot({ path: "/tmp/qa-noble-executive.png", fullPage: false });
      // Click Technical — scoped inside the toggle group so nav can't intercept
      await toggle.getByRole("button", { name: "Technical" }).click();
      await page.waitForTimeout(200);
      const flippedView = await article.getAttribute("data-view");
      record("Toggle flips to technical", flippedView === "technical", `view=${flippedView}`);
      await page.screenshot({ path: "/tmp/qa-noble-technical.png", fullPage: false });
      const stored = await page.evaluate(() => localStorage.getItem("caseStudyView"));
      record("localStorage persists caseStudyView", stored === "technical", `stored=${stored}`);
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForTimeout(400);
      const afterReload = await page.locator("article[data-view]").getAttribute("data-view");
      record("View persists across reload", afterReload === "technical", `view=${afterReload}`);
    }
    await ctx.close();
  }

  // ── QA 4: Blog list + post render + read-tracker sentinel
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto(BASE + "/blog", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    const journalBadge = await page.locator("text=Journal").count();
    record("Journal appears in nav + page", journalBadge >= 1, `count=${journalBadge}`);
    const featured = page.getByRole("heading", { name: "Launching the journal" });
    const featuredVisible = await featured.isVisible();
    record("Seed post featured on /blog", featuredVisible);

    await page.goto(BASE + "/blog/launching-the-journal", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    const h1 = (await page.locator("h1").first().innerText()) ?? "";
    record("Post H1 renders", /Launching the journal/i.test(h1), `h1="${h1.trim()}"`);
    const sentinelCount = await page.locator("[data-blog-read-sentinel]").count();
    record("BlogReadTracker sentinel in DOM", sentinelCount === 1, `count=${sentinelCount}`);
    await page.screenshot({ path: "/tmp/qa-blog-post.png", fullPage: false });
    await ctx.close();
  }

  // ── QA 5: ExternalLinkTracker throws no errors on click
  {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);
    const github = page.locator('a[href*="github.com/ruslan4427"]').first();
    if (await github.count()) {
      const [popup] = await Promise.all([
        page.waitForEvent("popup").catch(() => null),
        github.evaluate((el) => el.click()),
      ]);
      if (popup) await popup.close();
    }
    record("ExternalLinkTracker click path throws no errors", errors.length === 0, errors.join("; "));
    await ctx.close();
  }

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    console.log("FAILURES:");
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`);
    process.exit(1);
  }
})();
