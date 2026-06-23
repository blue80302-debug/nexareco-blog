import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="overflow-hidden rounded-xl bg-white hover:shadow-md transition-shadow duration-300">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="pt-4 pb-2">
          <span className="inline-block text-xs font-medium text-gray-400 tracking-widest uppercase mb-2">
            {post.category}
          </span>
          <h2 className="text-base font-semibold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors">
            {post.title}
          </h2>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-3">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <time>{post.date}</time>
            <span>·</span>
            <span>{post.readTime}분 읽기</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
