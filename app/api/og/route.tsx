import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";

export const runtime = "edge";

const categoryGradients: Record<string, [string, string]> = {
  "ai-tools": ["#7c3aed", "#2563eb"],
  "tech-gadgets": ["#3b82f6", "#06b6d4"],
  "software-services": ["#10b981", "#059669"],
  "home-appliances": ["#f59e0b", "#ea580c"],
  "health-beauty": ["#ec4899", "#be185d"],
  "gaming": ["#6366f1", "#dc2626"],
  "automotive": ["#475569", "#0ea5e9"],
  "camera": ["#8b5cf6", "#ec4899"],
  "baby-kids": ["#f472b6", "#fbbf24"],
  "pet": ["#34d399", "#3b82f6"],
  "fitness": ["#ef4444", "#f97316"],
};

const categoryLabels: Record<string, string> = {
  "ai-tools": "AI Tools",
  "tech-gadgets": "Tech & Gadgets",
  "software-services": "Software",
  "home-appliances": "Home Appliances",
  "health-beauty": "Health & Beauty",
  "gaming": "Gaming",
  "automotive": "Automotive",
  "camera": "Camera",
  "baby-kids": "Baby & Kids",
  "pet": "Pet",
  "fitness": "Fitness",
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "NEXARECO";
  const category = searchParams.get("category") || "";

  const [color1, color2] = categoryGradients[category] || ["#0f172a", "#1e293b"];
  const label = categoryLabels[category] || "";

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
          background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "-0.02em",
            }}
          >
            NEXARECO
          </div>
          {label && (
            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                background: "rgba(255,255,255,0.15)",
                padding: "6px 16px",
                borderRadius: "20px",
              }}
            >
              {label}
            </div>
          )}
        </div>
        <div
          style={{
            fontSize: "48px",
            fontWeight: 700,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.3,
            maxWidth: "900px",
            display: "flex",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {title}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            fontSize: "16px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          www.nexareco.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
