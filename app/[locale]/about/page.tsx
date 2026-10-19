import type { Metadata } from "next";

type Locale = "ko" | "en" | "ja" | "es";

const content: Record<Locale, { title: string; meta: string; paragraphs: string[] }> = {
  ko: {
    title: "소개",
    meta: "NEXARECO 소개 - 제품 비교 리뷰 전문 사이트",
    paragraphs: [
      "NEXARECO는 제품 비교 리뷰 전문 사이트입니다.",
      "AI 도구, 테크 가젯, 소프트웨어를 객관적으로 비교합니다.",
      "실제 사용자 리뷰와 공식 데이터를 기반으로 작성합니다.",
      "광고성 게시물 없이 솔직한 정보를 제공합니다.",
    ],
  },
  en: {
    title: "About",
    meta: "About NEXARECO - Product Comparison Review Site",
    paragraphs: [
      "NEXARECO is a site specializing in product comparison reviews.",
      "We objectively compare AI tools, tech gadgets, and software.",
      "Our content is based on real user reviews and official data.",
      "We provide honest information without sponsored posts.",
    ],
  },
  ja: {
    title: "紹介",
    meta: "NEXARECO紹介 - 製品比較レビュー専門サイト",
    paragraphs: [
      "NEXARECOは製品比較レビュー専門サイトです。",
      "AIツール、テックガジェット、ソフトウェアを客観的に比較します。",
      "実際のユーザーレビューと公式データに基づいて作成しています。",
      "広告記事なしで正直な情報を提供します。",
    ],
  },
  es: {
    title: "Acerca de",
    meta: "Acerca de NEXARECO - Sitio de Comparación de Productos",
    paragraphs: [
      "NEXARECO es un sitio especializado en reseñas comparativas de productos.",
      "Comparamos objetivamente herramientas de IA, gadgets tecnológicos y software.",
      "Nuestro contenido se basa en reseñas reales de usuarios y datos oficiales.",
      "Proporcionamos información honesta sin publicaciones patrocinadas.",
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = (locale as Locale) in content ? (locale as Locale) : "ko";
  return {
    title: content[loc].title,
    description: content[loc].meta,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = (locale as Locale) in content ? (locale as Locale) : "ko";
  const { title, paragraphs } = content[loc];

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      <div className="space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-base leading-8 text-gray-600">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
