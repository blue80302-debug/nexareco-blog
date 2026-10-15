import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NEXARECO 블로그";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#ffffff",
            letterSpacing: "0.1em",
            marginBottom: 24,
          }}
        >
          NEXARECO
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            letterSpacing: "0.05em",
          }}
        >
          IT 리뷰 · 생활정보 · 재테크 실용 블로그
        </div>
      </div>
    ),
    { ...size }
  );
}
