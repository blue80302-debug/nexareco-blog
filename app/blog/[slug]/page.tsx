import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, posts } from "@/lib/posts";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import ShareButtons from "@/components/ShareButtons";
import MarkdownContent from "@/components/MarkdownContent";
import AdSlot from "@/components/AdSlot";
import NewsletterSignup from "@/components/NewsletterSignup";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.imageUrl, width: 800, height: 500, alt: post.title }],
      url: `https://nexareco.com/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
    alternates: {
      canonical: `https://nexareco.com/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3);

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            image: post.imageUrl,
            datePublished: post.date,
            dateModified: post.date,
            author: {
              "@type": "Organization",
              name: "NEXARECO",
              url: "https://nexareco.com/about",
            },
            publisher: {
              "@type": "Organization",
              name: "NEXARECO",
              url: "https://nexareco.com",
            },
            mainEntityOfPage: `https://nexareco.com/blog/${post.slug}`,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "홈", item: "https://nexareco.com" },
              { "@type": "ListItem", position: 2, name: post.category, item: `https://nexareco.com/blog?category=${encodeURIComponent(post.category)}` },
              { "@type": "ListItem", position: 3, name: post.title },
            ],
          }),
        }}
      />
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700">홈</Link>
        <span>›</span>
        <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="hover:text-gray-700">{post.category}</Link>
      </nav>

      <header className="mb-10">
        <span className="inline-block text-xs font-medium text-gray-400 tracking-widest uppercase mb-4">{post.category}</span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-6">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">NEXARECO</Link>
          <span>·</span>
          <time dateTime={post.date}>{post.date}</time>
          <span>·</span>
          <span>{post.readTime}분 읽기</span>
        </div>
      </header>

      <div className="relative aspect-video rounded-2xl overflow-hidden mb-12">
        <Image src={post.imageUrl} alt={post.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 768px" />
      </div>

      {post.contentMarkdown ? (
        <MarkdownContent content={post.contentMarkdown} />
      ) : (
        <div className="space-y-6">
          {post.content.map((paragraph, i) => (
            <p key={i} className="text-base leading-8 text-gray-700 dark:text-gray-300">{paragraph}</p>
          ))}
        </div>
      )}

      <AdSlot />

      <div className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
          ← 목록으로 돌아가기
        </Link>
        <ShareButtons title={post.title} url={`https://nexareco.com/blog/${post.slug}`} />
      </div>

      <div className="mt-12">
        <NewsletterSignup />
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">관련 글</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="group block p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">
                <span className="text-xs text-gray-400 tracking-widest uppercase">{r.category}</span>
                <p className="text-sm font-medium text-gray-800 mt-1 line-clamp-2 group-hover:text-gray-500 transition-colors">{r.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
