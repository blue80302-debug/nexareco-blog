"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const links = [
  { key: "about" as const, href: "/about" },
  { key: "contact" as const, href: "/contact" },
  { key: "privacy" as const, href: "/privacy" },
  { key: "terms" as const, href: "/terms" },
];

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between">
        <span className="text-sm font-bold tracking-tight">NEXARECO</span>

        <nav className="flex flex-wrap justify-center gap-4">
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className="text-xs text-gray-500 hover:text-black transition-colors"
            >
              {t(l.key)}
            </Link>
          ))}
        </nav>

        <span className="text-xs text-gray-400">{t("copyright")}</span>
      </div>
    </footer>
  );
}
