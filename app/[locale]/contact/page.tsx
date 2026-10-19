import type { Metadata } from "next";

type Locale = "ko" | "en" | "ja" | "es";

const content: Record<
  Locale,
  { title: string; meta: string; intro: string; email: string; response: string }
> = {
  ko: {
    title: "문의하기",
    meta: "NEXARECO 문의하기",
    intro:
      "글 관련 문의, 협업 제안, 주제 요청 등 무엇이든 환영합니다.",
    email: "이메일",
    response: "응답 시간: 1~2일 내",
  },
  en: {
    title: "Contact",
    meta: "Contact NEXARECO",
    intro:
      "We welcome article inquiries, collaboration proposals, and topic requests.",
    email: "Email",
    response: "Response time: within 1-2 days",
  },
  ja: {
    title: "お問い合わせ",
    meta: "NEXARECO お問い合わせ",
    intro:
      "記事に関するお問い合わせ、コラボレーションの提案、トピックのリクエストなど、何でも歓迎します。",
    email: "メール",
    response: "返信時間：1〜2日以内",
  },
  es: {
    title: "Contacto",
    meta: "Contacto NEXARECO",
    intro:
      "Damos la bienvenida a consultas sobre artículos, propuestas de colaboración y solicitudes de temas.",
    email: "Correo electrónico",
    response: "Tiempo de respuesta: 1-2 días",
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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = (locale as Locale) in content ? (locale as Locale) : "ko";
  const { title, intro, email, response } = content[loc];

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      <div className="space-y-4">
        <p className="text-base leading-8 text-gray-600">{intro}</p>
        <p className="text-base leading-8 text-gray-600">
          {email}:{" "}
          <a
            href="mailto:blue80302@gmail.com"
            className="text-blue-600 underline"
          >
            blue80302@gmail.com
          </a>
        </p>
        <p className="text-base leading-8 text-gray-600">{response}</p>
      </div>
    </div>
  );
}
