import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getPostBySlug,
  getPostSlugs,
  getPostsByCategory,
  type Locale,
} from "@/lib/posts";
import { getTranslations } from "next-intl/server";
import BlogCard from "@/components/BlogCard";
import ComparisonTable from "@/components/ComparisonTable";
import ProductCard from "@/components/ProductCard";
import AffiliateButton from "@/components/AffiliateButton";
import AdSense from "@/components/AdSense";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  try {
    const post = getPostBySlug(locale as Locale, slug);
    return {
      title: `${post.title} | NEXARECO`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.coverImage ? [post.coverImage] : [],
      },
    };
  } catch {
    return { title: "Not Found" };
  }
}

export async function generateStaticParams() {
  const locales: Locale[] = ["ko", "en", "ja", "es"];
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of getPostSlugs(locale)) {
      params.push({ locale, slug });
    }
  }
  return params;
}

const categoryColors: Record<string, string> = {
  "ai-tools": "bg-purple-100 text-purple-700",
  "tech-gadgets": "bg-blue-100 text-blue-700",
  "software-services": "bg-green-100 text-green-700",
};

const categoryKeys: Record<string, string> = {
  "ai-tools": "categoryAiTools",
  "tech-gadgets": "categoryTechGadgets",
  "software-services": "categorySoftware",
};

const mdxComponents = {
  ComparisonTable,
  ProductCard,
  AffiliateButton,
};

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const typedLocale = locale as Locale;
  const t = await getTranslations({ locale, namespace: "blog" });

  let post;
  try {
    post = getPostBySlug(typedLocale, slug);
  } catch {
    notFound();
  }

  const related = getPostsByCategory(typedLocale, post.category)
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="mb-6 text-xs text-gray-400">
        {t("affiliateDisclosure")}
      </p>

      <header className="mb-10">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${categoryColors[post.category] ?? "bg-gray-100 text-gray-700"}`}
        >
          {t(categoryKeys[post.category] ?? "categoryAiTools")}
        </span>
        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
          <time>{post.date}</time>
          <span>·</span>
          <span>{t("readTime", { minutes: post.readTime })}</span>
        </div>
      </header>

      <AdSense slot="placeholder" format="horizontal" />

      <div className="mdx-content">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>

      <AdSense slot="placeholder" format="rectangle" />

      {related.length > 0 && (
        <section className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="mb-6 text-xl font-bold">{t("relatedPosts")}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
