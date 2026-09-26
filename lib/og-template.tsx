export const OG_SIZE = { width: 1200, height: 630 };

type OgLayoutProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  footerLeft?: string;
  footerRight?: string;
};

export function OgLayout({
  eyebrow,
  title,
  subtitle,
  footerLeft = "Available for Q4 2026",
  footerRight = "hrekov.dev",
}: OgLayoutProps) {
  return (
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
        <span style={{ fontFamily: "sans-serif" }}>{eyebrow}</span>
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
          <span>{title}</span>
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: 28,
              color: "#2A2A28",
              maxWidth: 900,
              lineHeight: 1.4,
              fontFamily: "sans-serif",
            }}
          >
            {subtitle}
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
          {footerLeft}
        </span>
        <span>{footerRight}</span>
      </div>
    </div>
  );
}
