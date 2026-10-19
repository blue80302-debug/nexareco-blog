import { useTranslations } from "next-intl";

interface AffiliateButtonProps {
  href: string;
  label?: string;
}

export default function AffiliateButton({ href, label }: AffiliateButtonProps) {
  const t = useTranslations("blog");

  return (
    <a
      href={href}
      rel="nofollow sponsored"
      target="_blank"
      className="inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
    >
      {label ?? t("checkPrice")}
    </a>
  );
}
