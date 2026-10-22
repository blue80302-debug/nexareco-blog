import type { Metadata } from "next";

type Locale = "ko" | "en" | "ja" | "es";

const content: Record<
  Locale,
  { title: string; meta: string; sections: { heading: string; text: string }[] }
> = {
  ko: {
    title: "소개",
    meta: "NEXARECO 소개 - AI, 테크, 소프트웨어 제품 비교 리뷰 전문 미디어",
    sections: [
      {
        heading: "NEXARECO는",
        text: "2026년에 시작된 IT 제품 비교 리뷰 전문 미디어입니다. AI 도구, 테크 가젯, 소프트웨어 서비스를 직접 사용하고 데이터 기반으로 비교 분석합니다. 한국어, 영어, 일본어, 스페인어 4개 언어로 전 세계 독자에게 정보를 전달합니다.",
      },
      {
        heading: "우리가 하는 일",
        text: "제품 비교 리뷰, 구매 가이드, 베스트 리스트를 제작합니다. ChatGPT vs Gemini 같은 AI 도구 비교부터 노이즈캔슬링 헤드폰, 로봇청소기, 스마트폰까지 — 구매 결정에 필요한 객관적 정보를 제공합니다. 공식 스펙, 벤치마크 데이터, 실사용 경험을 종합해 작성합니다.",
      },
      {
        heading: "편집 원칙",
        text: "광고주의 요청으로 리뷰를 작성하지 않습니다. 모든 비교 기준은 공개되어 있으며, 제휴 링크가 포함된 경우 이를 명시합니다. 독자가 현명한 구매 결정을 내릴 수 있도록 장단점을 솔직하게 전달하는 것이 우리의 목표입니다.",
      },
      {
        heading: "문의",
        text: "제품 리뷰 요청, 정정 요청, 협업 제안은 blue80302@gmail.com으로 보내주세요. 보통 1~2일 내에 답변드립니다.",
      },
    ],
  },
  en: {
    title: "About",
    meta: "About NEXARECO - AI, Tech & Software Product Comparison Reviews",
    sections: [
      {
        heading: "What is NEXARECO",
        text: "NEXARECO is an independent tech media launched in 2026, specializing in product comparison reviews. We test and analyze AI tools, tech gadgets, and software services with data-driven approaches. Our content is available in four languages: Korean, English, Japanese, and Spanish.",
      },
      {
        heading: "What We Do",
        text: "We create product comparisons, buying guides, and best-of lists. From AI tools like ChatGPT vs Gemini to noise-cancelling headphones, robot vacuums, and smartphones — we provide objective information to help you make better purchase decisions. Every review combines official specs, benchmark data, and real-world experience.",
      },
      {
        heading: "Editorial Policy",
        text: "We never write reviews at the request of advertisers. All comparison criteria are transparent, and affiliate links are clearly disclosed. Our goal is to deliver honest pros and cons so readers can make informed choices.",
      },
      {
        heading: "Contact",
        text: "For review requests, corrections, or partnership inquiries, reach us at blue80302@gmail.com. We typically respond within 1-2 business days.",
      },
    ],
  },
  ja: {
    title: "紹介",
    meta: "NEXARECO紹介 - AI・テック・ソフトウェア製品比較レビュー専門メディア",
    sections: [
      {
        heading: "NEXARECOとは",
        text: "NEXARECOは2026年に設立された、IT製品比較レビュー専門メディアです。AIツール、テックガジェット、ソフトウェアサービスを実際に使用し、データに基づいて比較分析します。韓国語、英語、日本語、スペイン語の4言語で世界中の読者に情報をお届けします。",
      },
      {
        heading: "私たちの活動",
        text: "製品比較レビュー、購入ガイド、ベストリストを制作しています。ChatGPT vs GeminiなどのAIツール比較から、ノイズキャンセリングヘッドホン、ロボット掃除機、スマートフォンまで — 購入の意思決定に必要な客観的な情報を提供します。",
      },
      {
        heading: "編集方針",
        text: "広告主の依頼でレビューを作成することはありません。すべての比較基準は公開されており、アフィリエイトリンクが含まれる場合は明示します。読者が賢い購入決定ができるよう、長所と短所を正直にお伝えすることが私たちの目標です。",
      },
      {
        heading: "お問い合わせ",
        text: "製品レビューのリクエスト、訂正のご依頼、提携のご提案はblue80302@gmail.comまでお送りください。通常1〜2営業日以内にご返信いたします。",
      },
    ],
  },
  es: {
    title: "Acerca de",
    meta: "Acerca de NEXARECO - Reseñas Comparativas de Productos de IA y Tecnología",
    sections: [
      {
        heading: "Qué es NEXARECO",
        text: "NEXARECO es un medio tecnológico independiente lanzado en 2026, especializado en reseñas comparativas de productos. Probamos y analizamos herramientas de IA, gadgets tecnológicos y servicios de software con enfoques basados en datos. Nuestro contenido está disponible en cuatro idiomas: coreano, inglés, japonés y español.",
      },
      {
        heading: "Qué hacemos",
        text: "Creamos comparaciones de productos, guías de compra y listas de mejores productos. Desde herramientas de IA como ChatGPT vs Gemini hasta auriculares con cancelación de ruido, aspiradoras robot y smartphones — proporcionamos información objetiva para mejores decisiones de compra.",
      },
      {
        heading: "Política editorial",
        text: "Nunca escribimos reseñas a petición de anunciantes. Todos los criterios de comparación son transparentes y los enlaces de afiliados se revelan claramente. Nuestro objetivo es ofrecer pros y contras honestos para que los lectores tomen decisiones informadas.",
      },
      {
        heading: "Contacto",
        text: "Para solicitudes de reseñas, correcciones o consultas de colaboración, escríbanos a blue80302@gmail.com. Normalmente respondemos en 1-2 días hábiles.",
      },
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
  const { title, sections } = content[loc];

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-12">{title}</h1>
      <div className="space-y-10">
        {sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-xl font-semibold mb-3">{section.heading}</h2>
            <p className="text-base leading-8 text-gray-600">{section.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
