import { getAllPosts, type Locale } from "@/lib/posts";
import { getTranslations } from "next-intl/server";
import BlogListClient from "@/components/BlogListClient";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: `${t("title")} | NEXARECO`,
  };
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;
  const t = await getTranslations({ locale, namespace: "blog" });
  const posts = getAllPosts(locale as Locale);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>
      <BlogListClient allPosts={posts} category={category} />
    </section>
  );
}
