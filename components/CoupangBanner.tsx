"use client";

import { getAffiliateUrl } from "@/lib/affiliate";

interface AffiliateBannerProps {
  products: string[];
  locale: string;
}

const amazonConfig: Record<string, { title: string; cta: string; disclosure: string; color: string; hover: string; bg: string; border: string; titleColor: string }> = {
  en: {
    title: "Check prices on Amazon",
    cta: "→",
    disclosure: "As an Amazon Associate, we earn from qualifying purchases.",
    color: "bg-amber-500", hover: "hover:bg-amber-600", bg: "bg-amber-50", border: "border-amber-200", titleColor: "text-amber-900",
  },
  ja: {
    title: "Amazonで価格をチェック",
    cta: "→",
    disclosure: "Amazonアソシエイトとして、適格販売により収入を得ています。",
    color: "bg-amber-500", hover: "hover:bg-amber-600", bg: "bg-amber-50", border: "border-amber-200", titleColor: "text-amber-900",
  },
  es: {
    title: "Ver precios en Amazon",
    cta: "→",
    disclosure: "As an Amazon Associate, we earn from qualifying purchases.",
    color: "bg-amber-500", hover: "hover:bg-amber-600", bg: "bg-amber-50", border: "border-amber-200", titleColor: "text-amber-900",
  },
};

function CoupangDynamicBanner() {
  return (
    <div className="my-10">
      <iframe
        src="https://ads-partners.coupang.com/widgets.html?id=1043287&template=carousel&trackingCode=AF1651276&subId=&width=680&height=140"
        width="680"
        height="140"
        frameBorder="0"
        scrolling="no"
        referrerPolicy="unsafe-url"
        className="mx-auto block max-w-full"
        style={{ maxWidth: "100%" }}
      />
      <p className="mt-3 text-center text-xs text-gray-500">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}

export default function CoupangBanner({ products, locale }: AffiliateBannerProps) {
  if (products.length === 0) return null;

  if (locale === "ko") {
    return <CoupangDynamicBanner />;
  }

  const c = amazonConfig[locale] ?? amazonConfig.en;

  return (
    <div className={`my-10 rounded-xl border ${c.border} ${c.bg} p-6`}>
      <p className={`mb-4 text-sm font-semibold ${c.titleColor}`}>
        {c.title}
      </p>
      <div className="flex flex-wrap gap-3">
        {products.map((product) => (
          <a
            key={product}
            href={getAffiliateUrl(product, locale)}
            rel="nofollow sponsored"
            target="_blank"
            className={`inline-block rounded-lg ${c.color} px-4 py-2 text-sm font-medium text-white transition ${c.hover}`}
          >
            {product} {c.cta}
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-500">
        {c.disclosure}
      </p>
    </div>
  );
}
