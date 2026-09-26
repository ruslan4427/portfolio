import { ImageResponse } from "next/og";
import { playfairFonts } from "@/lib/og-fonts";

export const alt = "Ruslan Hrekov — software, shipped honestly";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fonts = await playfairFonts();
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
          fontFamily: "Playfair Display",
          color: "#111111",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 20,
            color: "#6B6B66",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "#111111",
              color: "#FAFAF7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 600,
              fontFamily: "sans-serif",
            }}
          >
            RG
          </div>
          <span style={{ fontFamily: "sans-serif" }}>Ruslan Hrekov · Portfolio 2026</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 132,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              color: "#111111",
            }}
          >
            <span>Software, shipped</span>
            <span>honestly.</span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#2A2A28",
              maxWidth: 900,
              lineHeight: 1.4,
              fontFamily: "sans-serif",
            }}
          >
            Five AI-collaboration case studies with commit hashes and honest
            numbers.
          </div>
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
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "#22C55E",
                display: "flex",
              }}
            />
            Available for Q4 2026
          </span>
          <span>Kyiv → Ohio</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
