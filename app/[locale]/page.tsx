import { Link } from "@/i18n/navigation";
import { getAllPosts, type Locale, type Category } from "@/lib/posts";
import { getTranslations } from "next-intl/server";
import BlogCard from "@/components/BlogCard";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      siteName: "NEXARECO",
      locale,
      type: "website",
    },
  };
}

const categories: { key: Category; emoji: string; nameKey: string; descKey: string; href: string }[] = [
  { key: "ai-tools", emoji: "\u{1F916}", nameKey: "categoryAiTools", descKey: "aiToolsDesc", href: "/blog?category=ai-tools" },
  { key: "tech-gadgets", emoji: "\u{1F4F1}", nameKey: "categoryTechGadgets", descKey: "techGadgetsDesc", href: "/blog?category=tech-gadgets" },
  { key: "software-services", emoji: "\u{1F4BB}", nameKey: "categorySoftware", descKey: "softwareDesc", href: "/blog?category=software-services" },
];

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tBlog = await getTranslations({ locale, namespace: "blog" });
  const posts = getAllPosts(locale as Locale).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-24 text-center">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            {tCommon("siteName")}
          </h1>
          <p className="mt-6 text-lg text-gray-600 sm:text-xl">
            {tCommon("tagline")}
          </p>
          <Link
            href="/blog"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
          >
            {t("exploreReviews")}
          </Link>
        </div>
      </section>

      {/* Latest Reviews */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {t("latestReviews")}
          </h2>
          <Link
            href="/blog"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
          >
            {t("viewAll")} &rarr;
          </Link>
        </div>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">{tBlog("noPosts")}</p>
        )}
      </section>

      {/* Category Intro */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            {t("categoryIntro")}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                href={cat.href}
                className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-8 text-center transition hover:shadow-lg"
              >
                <span className="text-4xl">{cat.emoji}</span>
                <h3 className="mt-4 text-lg font-bold text-gray-900">
                  {tBlog(cat.nameKey)}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {t(cat.descKey)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
