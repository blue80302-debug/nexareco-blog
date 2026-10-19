import type { Metadata } from "next";

type Locale = "ko" | "en" | "ja" | "es";

interface Section {
  heading: string;
  body: string;
}

interface TermsContent {
  title: string;
  meta: string;
  updated: string;
  sections: Section[];
}

const content: Record<Locale, TermsContent> = {
  ko: {
    title: "이용약관",
    meta: "NEXARECO 이용약관",
    updated: "최종 업데이트: 2026년 10월 19일",
    sections: [
      {
        heading: "1. 서비스 개요",
        body: "NEXARECO는 AI 도구, 테크 가젯, 소프트웨어 등의 제품 비교 정보를 제공하는 사이트입니다.",
      },
      {
        heading: "2. 면책 조항",
        body: "본 사이트에 게시된 리뷰 및 비교 정보는 참고용이며, 최종 구매 결정은 이용자 본인의 책임입니다. NEXARECO는 정보의 정확성을 보장하지 않습니다.",
      },
      {
        heading: "3. 제휴 링크 고지",
        body: "일부 링크는 제휴 링크이며, 해당 링크를 통한 구매 시 NEXARECO에 수수료가 발생할 수 있습니다. 이는 콘텐츠의 객관성에 영향을 미치지 않습니다.",
      },
      {
        heading: "4. 지적 재산권",
        body: "본 사이트의 모든 콘텐츠(텍스트, 이미지, 로고 등)는 NEXARECO에 귀속되며, 무단 복제 및 배포를 금지합니다.",
      },
      {
        heading: "5. 서비스 변경",
        body: "NEXARECO는 서비스의 내용을 사전 고지 없이 변경하거나 중단할 수 있습니다.",
      },
      {
        heading: "6. 문의",
        body: "이용약관에 관한 문의는 blue80302@gmail.com으로 연락해 주세요.",
      },
    ],
  },
  en: {
    title: "Terms of Service",
    meta: "NEXARECO Terms of Service",
    updated: "Last updated: October 19, 2026",
    sections: [
      {
        heading: "1. Service Overview",
        body: "NEXARECO is a site that provides product comparison information for AI tools, tech gadgets, software, and more.",
      },
      {
        heading: "2. Disclaimer",
        body: "Reviews and comparison information on this site are for reference only. Final purchase decisions are the user's responsibility. NEXARECO does not guarantee the accuracy of information.",
      },
      {
        heading: "3. Affiliate Link Disclosure",
        body: "Some links are affiliate links, and purchases made through them may generate a commission for NEXARECO. This does not affect the objectivity of our content.",
      },
      {
        heading: "4. Intellectual Property",
        body: "All content on this site (text, images, logos, etc.) belongs to NEXARECO. Unauthorized reproduction and distribution are prohibited.",
      },
      {
        heading: "5. Service Changes",
        body: "NEXARECO may change or discontinue the service without prior notice.",
      },
      {
        heading: "6. Contact",
        body: "For inquiries regarding the terms of service, please contact blue80302@gmail.com.",
      },
    ],
  },
  ja: {
    title: "利用規約",
    meta: "NEXARECO 利用規約",
    updated: "最終更新日：2026年10月19日",
    sections: [
      {
        heading: "1. サービス概要",
        body: "NEXARECOは、AIツール、テックガジェット、ソフトウェアなどの製品比較情報を提供するサイトです。",
      },
      {
        heading: "2. 免責事項",
        body: "本サイトに掲載されたレビューおよび比較情報は参考用であり、最終的な購入判断はユーザー自身の責任となります。NEXARECOは情報の正確性を保証しません。",
      },
      {
        heading: "3. アフィリエイトリンクの告知",
        body: "一部のリンクはアフィリエイトリンクであり、そのリンクを通じた購入によりNEXARECOに手数料が発生する場合があります。これはコンテンツの客観性に影響を与えません。",
      },
      {
        heading: "4. 知的財産権",
        body: "本サイトのすべてのコンテンツ（テキスト、画像、ロゴなど）はNEXARECOに帰属し、無断複製および配布を禁止します。",
      },
      {
        heading: "5. サービスの変更",
        body: "NEXARECOは、サービスの内容を事前の告知なく変更または中断する場合があります。",
      },
      {
        heading: "6. お問い合わせ",
        body: "利用規約に関するお問い合わせはblue80302@gmail.comまでご連絡ください。",
      },
    ],
  },
  es: {
    title: "Términos de Servicio",
    meta: "Términos de Servicio de NEXARECO",
    updated: "Última actualización: 19 de octubre de 2026",
    sections: [
      {
        heading: "1. Descripción del Servicio",
        body: "NEXARECO es un sitio que proporciona información comparativa de productos como herramientas de IA, gadgets tecnológicos y software.",
      },
      {
        heading: "2. Descargo de Responsabilidad",
        body: "Las reseñas y la información comparativa de este sitio son solo de referencia. Las decisiones finales de compra son responsabilidad del usuario. NEXARECO no garantiza la exactitud de la información.",
      },
      {
        heading: "3. Divulgación de Enlaces de Afiliados",
        body: "Algunos enlaces son enlaces de afiliados, y las compras realizadas a través de ellos pueden generar una comisión para NEXARECO. Esto no afecta la objetividad de nuestro contenido.",
      },
      {
        heading: "4. Propiedad Intelectual",
        body: "Todo el contenido de este sitio (texto, imágenes, logotipos, etc.) pertenece a NEXARECO. Se prohíbe la reproducción y distribución no autorizada.",
      },
      {
        heading: "5. Cambios en el Servicio",
        body: "NEXARECO puede cambiar o suspender el servicio sin previo aviso.",
      },
      {
        heading: "6. Contacto",
        body: "Para consultas sobre los términos de servicio, comuníquese a blue80302@gmail.com.",
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

export default async function TermsPage({
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
