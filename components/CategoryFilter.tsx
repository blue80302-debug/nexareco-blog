"use client";

import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const categories = [
  { key: "all", translationKey: "allCategories" },
  { key: "ai-tools", translationKey: "categoryAiTools" },
  { key: "tech-gadgets", translationKey: "categoryTechGadgets" },
  { key: "software-services", translationKey: "categorySoftware" },
] as const;

export default function CategoryFilter() {
  const t = useTranslations("blog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("category") ?? "all";

  function handleClick(key: string) {
    if (key === "all") {
      router.push(pathname);
    } else {
      router.push(`${pathname}?category=${key}`);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => handleClick(cat.key)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            current === cat.key
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {t(cat.translationKey)}
        </button>
      ))}
    </div>
  );
}
