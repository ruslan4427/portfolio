import { ImageResponse } from "next/og";
import { getCaseStudy } from "@/content/case-studies";
import { projects } from "@/content/projects";

export const alt = "Case study — Ruslan Grekov";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  const title = study?.frontmatter.title ?? "Case study";
  const tagline = study?.frontmatter.tagline ?? "";
  const role = study?.frontmatter.role ?? "";
  const year = study?.frontmatter.year ?? "";
  const status = study?.frontmatter.status ?? "";
  const project = projects.find((p) => p.slug === slug);
  const index = project?.index ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F5F4EF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "serif",
          color: "#111111",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 18,
            fontFamily: "sans-serif",
            color: "#6B6B66",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#FFFFFF",
              border: "1px solid rgba(17,17,17,0.08)",
              borderRadius: 999,
              padding: "6px 14px",
              color: "#111111",
            }}
          >
            <span style={{ fontFamily: "monospace" }}>{index || "RG"}</span>
            <span>·</span>
            <span>{status}</span>
            {year && (
              <>
                <span>·</span>
                <span>{year}</span>
              </>
            )}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 116,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              fontStyle: "italic",
              color: "#111111",
            }}
          >
            {title}
          </div>
          {tagline && (
            <div
              style={{
                fontSize: 28,
                color: "#2A2A28",
                maxWidth: 1000,
                lineHeight: 1.4,
                fontFamily: "sans-serif",
                fontStyle: "normal",
              }}
            >
              {tagline}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 18,
            color: "#6B6B66",
            fontFamily: "sans-serif",
          }}
        >
          <span>Ruslan Grekov · {role}</span>
          <span style={{ color: "#111111" }}>ruslan.dev/work/{slug}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
