import AffiliateButton from "./AffiliateButton";

interface ProductCardProps {
  name: string;
  specs?: string;
  imageUrl?: string;
}

export default function ProductCard({
  name,
  specs,
  imageUrl,
}: ProductCardProps) {
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
      <div className="mt-4">
        <AffiliateButton href="#" />
      </div>
    </div>
  );
}
