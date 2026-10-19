import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "NEXARECO";
  const locale = searchParams.get("locale") || "en";

  const subtitleMap: Record<string, string> = {
    ko: "최고의 제품을 비교하고 발견하세요",
    en: "Compare and discover the best products",
    ja: "最高の製品を比較して発見しよう",
    es: "Compara y descubre los mejores productos",
  };

  const subtitle = subtitleMap[locale] || subtitleMap.en;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#3b82f6",
              letterSpacing: "-0.02em",
            }}
          >
            NEXARECO
          </div>
        </div>
        <div
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "#f8fafc",
            textAlign: "center",
            lineHeight: 1.3,
            maxWidth: "900px",
            marginBottom: "24px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: "24px",
            color: "#94a3b8",
            textAlign: "center",
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
