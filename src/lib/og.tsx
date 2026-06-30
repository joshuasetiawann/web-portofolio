// Shared Open Graph image renderer (next/og). Produces a branded 1200×630 card
// used by app/opengraph-image.tsx and the per-[slug] OG routes. Inline styles only
// (Satori): every element with text uses display:flex.
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const ogSize = { width: 1200, height: 630 } as const;
export const ogContentType = "image/png";

function siteHost(): string {
  try {
    return new URL(siteConfig.url).host;
  } catch {
    return "joshuasetiawan.com";
  }
}

export interface OgCardInput {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export function renderOgImage({ eyebrow, title, subtitle }: OgCardInput): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#05070d",
        color: "#eaedf5",
        fontFamily: "sans-serif",
        backgroundImage:
          "radial-gradient(70% 70% at 82% 8%, rgba(94,139,255,0.28), transparent 60%), radial-gradient(60% 60% at 8% 100%, rgba(56,232,200,0.16), transparent 60%)",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 22,
          letterSpacing: 6,
          textTransform: "uppercase",
          color: "#38e8c8",
        }}
      >
        {(eyebrow ?? siteConfig.name).toUpperCase()}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            fontSize: 66,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "#a4abbd",
              maxWidth: 940,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 24,
        }}
      >
        <div style={{ display: "flex", color: "#a4abbd" }}>{siteConfig.name}</div>
        <div style={{ display: "flex", color: "#687085" }}>{siteHost()}</div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 8,
          background: "linear-gradient(90deg, #5e8bff, #38e8c8)",
        }}
      />
    </div>,
    { ...ogSize },
  );
}
