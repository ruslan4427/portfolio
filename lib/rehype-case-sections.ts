import type { Element, ElementContent, Root, RootContent } from "hast";

// Wraps each top-level `## heading` and everything up to the next one in
// `<section data-case-section id="<slug>">`. The case page uses the sections
// for the chapter rail, anchors, and the "2-min read" depth.

function textOf(node: RootContent | ElementContent): string {
  if (node.type === "text") return node.value;
  if ("children" in node && Array.isArray(node.children)) {
    return (node.children as ElementContent[]).map(textOf).join("");
  }
  return "";
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function rehypeCaseSections() {
  return (tree: Root) => {
    const out: RootContent[] = [];
    let current: Element | null = null;
    const seen = new Map<string, number>();

    for (const node of tree.children) {
      if (node.type === "element" && node.tagName === "h2") {
        const base = slugifyHeading(textOf(node)) || "section";
        const n = seen.get(base) ?? 0;
        seen.set(base, n + 1);
        current = {
          type: "element",
          tagName: "section",
          properties: {
            dataCaseSection: "true",
            id: n === 0 ? base : `${base}-${n + 1}`,
          },
          children: [node],
        };
        out.push(current);
      } else if (current) {
        current.children.push(node as ElementContent);
      } else {
        out.push(node);
      }
    }
    tree.children = out;
  };
}

export type CaseChapter = { id: string; title: string };

/**
 * Same ids as the rehype pass, computed from the raw MDX so the server can
 * hand the chapter list to the rail without touching the DOM.
 */
export function extractChapters(source: string): CaseChapter[] {
  const seen = new Map<string, number>();
  const chapters: CaseChapter[] = [];
  let inFence = false;
  for (const line of source.split("\n")) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const title = m[1].replace(/\\(.)/g, "$1").replace(/[*`]/g, "").trim();
    const base = slugifyHeading(title) || "section";
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    chapters.push({ id: n === 0 ? base : `${base}-${n + 1}`, title });
  }
  return chapters;
}
