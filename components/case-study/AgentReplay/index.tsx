import { AgentReplay } from "./AgentReplay";
import { smmFactoryReplay } from "./smm-factory";
import type { ReplayData } from "./types";

const REPLAYS: Record<string, ReplayData> = {
  "smm-factory": smmFactoryReplay,
};

export function AgentReplayFor({ slug }: { slug: string }) {
  const data = REPLAYS[slug];
  if (!data) return null;
  return <AgentReplay data={data} />;
}
