import type { Metadata } from "next";
import { buildAlternates } from "@/lib/seo";

type Locale = "ko" | "en" | "ja" | "es";

interface Section {
  heading: string;
  body: string;
}

interface PrivacyContent {
  title: string;
  meta: string;
  updated: string;
  sections: Section[];
}

const content: Record<Locale, PrivacyContent> = {
  ko: {
    title: "개인정보처리방침",
    meta: "NEXARECO 개인정보처리방침",
    updated: "최종 업데이트: 2026년 10월 19일",
    sections: [
      {
        heading: "1. 개인정보의 처리 목적",
        body: "NEXARECO는 문의 응대 및 서비스 개선을 위해 최소한의 개인정보를 처리합니다.",
      },
      {
        heading: "2. 수집하는 개인정보 항목",
        body: "수집 항목: 이메일 주소, 문의 내용. 이용자가 직접 제공한 정보만 수집합니다.",
      },
      {
        heading: "3. 보유 및 이용 기간",
        body: "수집된 개인정보는 수집 목적 달성 후 6개월 이내에 파기합니다.",
      },
      {
        heading: "4. 제3자 제공",
        body: "NEXARECO는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 단, 법령에 의한 경우는 예외로 합니다.",
      },
      {
        heading: "5. 쿠키 및 광고",
        body: "본 사이트는 Google AdSense를 사용하며, Google은 쿠키를 통해 맞춤 광고를 제공할 수 있습니다. 자세한 사항은 Google 개인정보처리방침(https://policies.google.com/privacy)을 참조하세요.",
      },
      {
        heading: "6. 개인정보 보호책임자",
        body: "개인정보 관련 문의는 blue80302@gmail.com으로 연락해 주세요.",
      },
      {
        heading: "7. 개정 사항",
        body: "본 방침은 법령 또는 서비스 변경에 따라 수정될 수 있으며, 변경 시 사이트를 통해 공지합니다.",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    meta: "NEXARECO Privacy Policy",
    updated: "Last updated: October 19, 2026",
    sections: [
      {
        heading: "1. Purpose of Processing Personal Information",
        body: "NEXARECO processes minimal personal information for responding to inquiries and improving our services.",
      },
      {
        heading: "2. Personal Information Collected",
        body: "Items collected: email address, inquiry content. We only collect information directly provided by users.",
      },
      {
        heading: "3. Retention Period",
        body: "Collected personal information is destroyed within 6 months after the purpose of collection has been fulfilled.",
      },
      {
        heading: "4. Third-Party Disclosure",
        body: "NEXARECO does not, in principle, share users' personal information with third parties, except as required by law.",
      },
      {
        heading: "5. Cookies and Advertising",
        body: "This site uses Google AdSense, and Google may serve personalized ads through cookies. For details, please refer to Google's Privacy Policy (https://policies.google.com/privacy).",
      },
      {
        heading: "6. Privacy Officer",
        body: "For privacy-related inquiries, please contact blue80302@gmail.com.",
      },
      {
        heading: "7. Amendments",
        body: "This policy may be updated due to changes in law or services. Any changes will be announced on the site.",
      },
    ],
  },
  ja: {
    title: "プライバシーポリシー",
    meta: "NEXARECO プライバシーポリシー",
    updated: "最終更新日：2026年10月19日",
    sections: [
      {
        heading: "1. 個人情報の処理目的",
        body: "NEXARECOは、お問い合わせへの対応およびサービスの改善のために、最小限の個人情報を処理します。",
      },
      {
        heading: "2. 収集する個人情報の項目",
        body: "収集項目：メールアドレス、お問い合わせ内容。ユーザーが直接提供した情報のみ収集します。",
      },
      {
        heading: "3. 保有および利用期間",
        body: "収集された個人情報は、収集目的の達成後6ヶ月以内に廃棄します。",
      },
      {
        heading: "4. 第三者への提供",
        body: "NEXARECOは、原則としてユーザーの個人情報を第三者に提供しません。ただし、法令による場合は例外とします。",
      },
      {
        heading: "5. クッキーおよび広告",
        body: "本サイトはGoogle AdSenseを使用しており、Googleはクッキーを通じてパーソナライズされた広告を配信する場合があります。詳細はGoogleのプライバシーポリシー（https://policies.google.com/privacy）をご参照ください。",
      },
      {
        heading: "6. 個人情報保護責任者",
        body: "個人情報に関するお問い合わせはblue80302@gmail.comまでご連絡ください。",
      },
      {
        heading: "7. 改定事項",
        body: "本ポリシーは、法令またはサービスの変更に伴い修正される場合があります。変更時はサイトを通じてお知らせします。",
      },
    ],
  },
  es: {
    title: "Política de Privacidad",
    meta: "Política de Privacidad de NEXARECO",
    updated: "Última actualización: 19 de octubre de 2026",
    sections: [
      {
        heading: "1. Propósito del Procesamiento de Información Personal",
        body: "NEXARECO procesa la información personal mínima necesaria para responder consultas y mejorar nuestros servicios.",
      },
      {
        heading: "2. Información Personal Recopilada",
        body: "Elementos recopilados: dirección de correo electrónico, contenido de la consulta. Solo recopilamos información proporcionada directamente por los usuarios.",
      },
      {
        heading: "3. Período de Retención",
        body: "La información personal recopilada se destruye dentro de los 6 meses posteriores al cumplimiento del propósito de recopilación.",
      },
      {
        heading: "4. Divulgación a Terceros",
        body: "NEXARECO no comparte, en principio, la información personal de los usuarios con terceros, excepto cuando lo exija la ley.",
      },
      {
        heading: "5. Cookies y Publicidad",
        body: "Este sitio utiliza Google AdSense, y Google puede mostrar anuncios personalizados a través de cookies. Para más detalles, consulte la Política de Privacidad de Google (https://policies.google.com/privacy).",
      },
      {
        heading: "6. Responsable de Protección de Datos",
        body: "Para consultas relacionadas con la privacidad, comuníquese a blue80302@gmail.com.",
      },
      {
        heading: "7. Modificaciones",
        body: "Esta política puede actualizarse debido a cambios en la legislación o los servicios. Cualquier cambio se anunciará en el sitio.",
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
    alternates: buildAlternates(locale, "/privacy"),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = (locale as Locale) in content ? (locale as Locale) : "ko";
  const { title, updated, sections } = content[loc];

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-sm text-gray-400 mb-8">{updated}</p>
      <div className="space-y-6">
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="text-lg font-semibold mb-2">{s.heading}</h2>
            <p className="text-base leading-8 text-gray-600">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
