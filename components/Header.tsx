"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

const categories = [
  { key: "aiTools" as const, category: "ai-tools" },
  { key: "techGadgets" as const, category: "tech-gadgets" },
  { key: "software" as const, category: "software-services" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          NEXARECO
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {categories.map((c) => (
            <Link
              key={c.category}
              href={`/blog?category=${c.category}`}
              className="text-sm text-gray-700 hover:text-black transition-colors"
            >
              {t(c.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-1"
            aria-label="Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white">
          <ul className="flex flex-col px-4 py-2">
            {categories.map((c) => (
              <li key={c.category}>
                <Link
                  href={`/blog?category=${c.category}`}
                  className="block py-2 text-sm text-gray-700 hover:text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  {t(c.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
