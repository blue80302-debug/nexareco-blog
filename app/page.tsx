import Image from "next/image";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import NewsletterSignup from "@/components/NewsletterSignup";
import { posts, categories } from "@/lib/posts";

export default function Home() {
  const featured = posts[0];
  const rest = posts.slice(1, 7);

  return (
    <div className="max-w-6xl mx-auto px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "NEXARECO 블로그",
            url: "https://nexareco.com",
            description:
              "IT 리뷰·생활정보·재테크를 쉽고 실용적으로 정리하는 블로그",
            publisher: {
              "@type": "Organization",
              name: "NEXARECO",
              url: "https://nexareco.com",
            },
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
              {
                "@type": "ListItem",
                position: 1,
                name: "홈",
                item: "https://nexareco.com",
              },
            ],
          }),
        }}
      />

      <section className="py-12 md:py-16">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          IT 리뷰·생활정보·재테크 실용 블로그
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base mb-10 max-w-2xl">
          NEXARECO는 스마트폰·가전 리뷰, 생활비 절약 팁, ETF·ISA 같은 재테크 입문 정보를 쉽고 실용적으로 정리하는 블로그입니다.
          주 3회 새 글이 발행되며, 검증된 정보만 다룹니다.
        </p>

        <Link href={`/blog/${featured.slug}`} className="group block">
          <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden">
            <Image
              src={featured.imageUrl}
              alt={featured.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12">
              <span className="inline-block text-xs font-medium text-white/70 tracking-widest uppercase mb-3">
                {featured.category}
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-2xl mb-3">
                {featured.title}
              </h2>
              <p className="text-sm text-white/70 hidden md:block max-w-xl">
                {featured.excerpt}
              </p>
              <time className="text-xs text-white/50 mt-2 block">{featured.date}</time>
            </div>
          </div>
        </Link>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <Link href="/blog" className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm border border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors">
            전체
          </Link>
          {categories.map((cat) => (
            <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`} className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-900 hover:text-gray-900 dark:hover:border-white dark:hover:text-white transition-colors">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-block px-8 py-3 border border-gray-900 dark:border-white text-gray-900 dark:text-white text-sm font-medium rounded-xl hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-colors"
          >
            글 더보기 →
          </Link>
        </div>
      </section>

      <section className="pb-16">
        <NewsletterSignup />
      </section>
    </div>
  );
}
