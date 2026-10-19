import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPostSlugs, type Locale } from "@/lib/posts";

const BASE_URL = "https://nexareco.com";

const staticPages = [
  { path: "", changeFrequency: "daily" as const, priority: 1.0 },
  { path: "/blog", changeFrequency: "daily" as const, priority: 0.9 },
  { path: "/about", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
];

function buildAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${BASE_URL}/${locale}${path}`;
  }
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: buildAlternates(page.path) },
      });
    }
  }

  const allSlugs = new Set<string>();
  for (const locale of routing.locales) {
    for (const slug of getPostSlugs(locale as Locale)) {
      allSlugs.add(slug);
    }
  }

  for (const slug of allSlugs) {
    const blogPath = `/blog/${slug}`;
    for (const locale of routing.locales) {
      entries.push({
        url: `${BASE_URL}/${locale}${blogPath}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: { languages: buildAlternates(blogPath) },
      });
    }
  }

  return entries;
}
