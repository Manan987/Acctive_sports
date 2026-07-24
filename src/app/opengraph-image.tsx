import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #070b14 0%, #213052 55%, #7f210f 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "#ff5a0f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              fontWeight: 900,
            }}
          >
            A
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 2 }}>ACCTIVE</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 68, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
          Custom Sportswear that performs &amp; pops
        </div>
        <div style={{ marginTop: 24, fontSize: 30, color: "#ffce9e" }}>
          Sublimated jerseys · shorts · lowers · tracksuits — made in Meerut
        </div>
      </div>
    ),
    { ...size }
  );
}
