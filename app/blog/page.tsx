import PostCard from "@/components/PostCard";
import { posts, categories } from "@/lib/posts";
import Link from "next/link";
import type { Metadata } from "next";

const POSTS_PER_PAGE = 12;

export const metadata: Metadata = {
  title: "글 목록",
  description: "IT 리뷰, 생활정보, 재테크 관련 모든 블로그 글을 확인하세요.",
  alternates: { canonical: "https://nexareco.com/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const { category, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1", 10) || 1);
  const filtered = category ? posts.filter((p) => p.category === category) : posts;
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paged = filtered.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/blog${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">글 목록</h1>
      <p className="text-gray-400 text-sm mb-10">
        {category ? `${category} 카테고리` : "전체 글"} — {filtered.length}개
      </p>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-10">
        <Link href="/blog" className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm border transition-colors ${!category ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900" : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white"}`}>
          전체
        </Link>
        {categories.map((cat) => (
          <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm border transition-colors ${category === cat ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900" : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-900 dark:hover:border-white hover:text-gray-900 dark:hover:text-white"}`}>
            {cat}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paged.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-12">
          {currentPage > 1 && (
            <Link href={buildHref(currentPage - 1)} className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
              ← 이전
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={buildHref(p)} className={`w-10 h-10 flex items-center justify-center text-sm rounded-lg transition-colors ${p === currentPage ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium" : "border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
              {p}
            </Link>
          ))}
          {currentPage < totalPages && (
            <Link href={buildHref(currentPage + 1)} className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
              다음 →
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
