import { Reveal } from "@/components/ui/Reveal";
import { TOOLS_BUILT } from "@/content/tools-built";
import { ToolCard } from "./ToolCard";

export function ToolsBuilt() {
  return (
    <div className="flex flex-col gap-10">
      {TOOLS_BUILT.map((tool, i) => (
        <Reveal key={tool.slug} delay={0.05 + i * 0.06}>
          <ToolCard tool={tool} />
        </Reveal>
      ))}
    </div>
  );
}
