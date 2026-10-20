import { getCoupangSearchUrl } from "@/lib/affiliate";

interface CoupangBannerProps {
  products: string[];
  locale: string;
}

export default function CoupangBanner({ products, locale }: CoupangBannerProps) {
  if (locale !== "ko" || products.length === 0) return null;

  return (
    <div className="my-10 rounded-xl border border-blue-200 bg-blue-50 p-6">
      <p className="mb-4 text-sm font-semibold text-blue-900">
        쿠팡에서 최저가 확인하기
      </p>
      <div className="flex flex-wrap gap-3">
        {products.map((product) => (
          <a
            key={product}
            href={getCoupangSearchUrl(product)}
            rel="nofollow sponsored"
            target="_blank"
            className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            {product} →
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-500">
        이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
      </p>
    </div>
  );
}
