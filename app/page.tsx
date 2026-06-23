import Image from "next/image";
import Link from "next/link";
import PostCard from "@/components/PostCard";
import { posts, categories } from "@/lib/posts";

export default function Home() {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-6">
      <section className="py-12 md:py-16">
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
              <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-2xl mb-3">
                {featured.title}
              </h1>
              <p className="text-sm text-white/70 hidden md:block max-w-xl">
                {featured.excerpt}
              </p>
            </div>
          </div>
        </Link>
      </section>

      <section className="mb-10">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <Link href="/blog" className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors">
            전체
          </Link>
          {categories.map((cat) => (
            <Link key={cat} href={`/blog?category=${encodeURIComponent(cat)}`} className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm border border-gray-200 text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
