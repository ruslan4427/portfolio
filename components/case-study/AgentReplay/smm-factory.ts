import type { ReplayData } from "./types";

export const smmFactoryReplay: ReplayData = {
  slug: "smm-factory",
  title: "Mon 09:00 — one weekly content cycle",
  viewBox: { width: 920, height: 380 },
  nodes: [
    { id: "orchestrator", label: "orchestrator", sub: "11_orch.md", x: 460, y: 60, accent: true },
    { id: "intake", label: "intake", sub: "01_intake", x: 80, y: 260 },
    { id: "analysis", label: "analysis", sub: "02_analysis", x: 250, y: 260 },
    { id: "content", label: "content", sub: "03_pipeline", x: 420, y: 260 },
    { id: "approval", label: "approval", sub: "04_approval", x: 590, y: 260 },
    { id: "publisher", label: "publisher", sub: "05_publisher", x: 760, y: 260 },
  ],
  edges: [
    { id: "cron-intake", from: "orchestrator", to: "intake" },
    { id: "intake-analysis", from: "intake", to: "analysis" },
    { id: "analysis-content", from: "analysis", to: "content" },
    { id: "content-approval", from: "content", to: "approval" },
    { id: "approval-publisher", from: "approval", to: "publisher" },
    { id: "publisher-orchestrator", from: "publisher", to: "orchestrator" },
  ],
  steps: [
    {
      title: "Cron fires",
      activeNodes: ["orchestrator"],
      payload:
        "Mon 09:00 Europe/Kyiv — orchestrator wakes. Reads 11_orchestrator.md to decide which agent runs first this week.",
      timestamp: "09:00:00",
    },
    {
      title: "Orchestrator → intake",
      edge: "cron-intake",
      activeNodes: ["orchestrator", "intake"],
      payload:
        "Dispatch: scrape the brand surface. Intake pulls noblelink.app, extracts brand voice + 4 personas, writes to shared memory.",
      timestamp: "09:00:04",
    },
    {
      title: "Intake → analysis",
      edge: "intake-analysis",
      activeNodes: ["intake", "analysis"],
      payload:
        "Hand-off: brand brief ready. Analysis derives 7 verticals, 3 content pillars, weekly cadence, dark + gold palette. Hashes land in 02_analysis_agent.md.",
      timestamp: "09:01:12",
    },
    {
      title: "Analysis → content",
      edge: "analysis-content",
      activeNodes: ["analysis", "content"],
      payload:
        "Hand-off: pillars locked. Content pipeline drafts 7 posts (hook / caption / cover) matching this week's pillar weights. Rate-limited Haiku calls — ~$0.05 total.",
      timestamp: "09:02:38",
    },
    {
      title: "Content → approval",
      edge: "content-approval",
      activeNodes: ["content", "approval"],
      payload:
        "Hand-off: 7 drafts ready. Approval manager posts to Slack with ✓/✎/✗ three-tap buttons. Rules = Code — if I don't tap, nothing ships.",
      timestamp: "09:03:04",
    },
    {
      title: "Approval → publisher",
      edge: "approval-publisher",
      activeNodes: ["approval", "publisher"],
      payload:
        "Hand-off: 5 approved, 1 edited, 1 killed. Publisher queues them to Instagram at the 7 pillar-matched time slots. Playwright + FFmpeg for reels.",
      timestamp: "09:04:17",
    },
    {
      title: "Publisher → orchestrator",
      edge: "publisher-orchestrator",
      activeNodes: ["publisher", "orchestrator"],
      payload:
        "Loop close: publisher logs every post to the ledger (post_id, caption, pillar, timestamp). Orchestrator sleeps until next Monday 09:00.",
      timestamp: "09:04:22",
    },
  ],
};
