import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, posts } from "@/lib/posts";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3);

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700">홈</Link>
        <span>›</span>
        <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="hover:text-gray-700">{post.category}</Link>
      </nav>

      <header className="mb-10">
        <span className="inline-block text-xs font-medium text-gray-400 tracking-widest uppercase mb-4">{post.category}</span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <time>{post.date}</time>
          <span>·</span>
          <span>{post.readTime}분 읽기</span>
        </div>
      </header>

      <div className="relative aspect-video rounded-2xl overflow-hidden mb-12">
        <Image src={post.imageUrl} alt={post.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 768px" />
      </div>

      <div className="space-y-6">
        {post.content.map((paragraph, i) => (
          <p key={i} className="text-base leading-8 text-gray-700">{paragraph}</p>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t border-gray-100">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          ← 목록으로 돌아가기
        </Link>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-lg font-bold text-gray-900 mb-6">관련 글</h2>
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
