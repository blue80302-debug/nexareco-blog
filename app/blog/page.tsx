import PostCard from "@/components/PostCard";
import { posts, categories } from "@/lib/posts";
import Link from "next/link";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const filtered = category ? posts.filter((p) => p.category === category) : posts;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">글 목록</h1>
      <p className="text-gray-400 text-sm mb-10">
        {category ? `${category} 카테고리` : "전체 글"} — {filtered.length}개
      </p>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 mb-10">
        <Link href="/blog" className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm border transition-colors ${!category ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900"}`}>
          전체
        </Link>
        {categories.map((cat) => (
          <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm border transition-colors ${category === cat ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900"}`}>
            {cat}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
