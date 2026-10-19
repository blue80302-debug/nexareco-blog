import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export type Locale = "ko" | "en" | "ja" | "es";
export type Category = "ai-tools" | "tech-gadgets" | "software-services";
export type ContentFormat = "comparison" | "top-list" | "buying-guide";

export interface PostMeta {
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  category: Category;
  format: ContentFormat;
  date: string;
  readTime: number;
  coverImage: string;
  products?: string[];
}

export interface Post extends PostMeta {
  content: string;
}

const contentDir = path.join(process.cwd(), "content");

export function getPostSlugs(locale: Locale): string[] {
  const dir = path.join(contentDir, locale, "blog");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPostBySlug(locale: Locale, slug: string): Post {
  const filePath = path.join(contentDir, locale, "blog", `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    locale,
    title: data.title as string,
    excerpt: data.excerpt as string,
    category: data.category as Category,
    format: data.format as ContentFormat,
    date: data.date as string,
    readTime: Math.ceil(stats.minutes),
    coverImage: data.coverImage as string,
    products: data.products as string[] | undefined,
    content,
  };
}

export function getAllPosts(locale: Locale): PostMeta[] {
  const slugs = getPostSlugs(locale);
  return slugs
    .map((slug) => {
      const post = getPostBySlug(locale, slug);
      const { content, ...meta } = post;
      void content;
      return meta;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getPostsByCategory(
  locale: Locale,
  category: Category
): PostMeta[] {
  return getAllPosts(locale).filter((p) => p.category === category);
}
