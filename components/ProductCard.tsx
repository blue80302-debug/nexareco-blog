import AffiliateButton from "./AffiliateButton";
import { getCoupangSearchUrl } from "@/lib/affiliate";

interface ProductCardProps {
  name: string;
  specs?: string;
  imageUrl?: string;
  affiliateUrl?: string;
  locale?: string;
}

export default function ProductCard({
  name,
  specs,
  imageUrl,
  affiliateUrl,
  locale,
}: ProductCardProps) {
  const href = affiliateUrl || (locale === "ko" ? getCoupangSearchUrl(name) : "#");
  const showButton = href !== "#";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
      <div className="mx-auto mb-4 h-32 w-32 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          name
        )}
      </div>
      <h4 className="font-bold text-gray-900">{name}</h4>
      {specs && <p className="mt-1 text-sm text-gray-500">{specs}</p>}
      {showButton && (
        <div className="mt-4">
          <AffiliateButton href={href} />
        </div>
      )}
    </div>
  );
}
