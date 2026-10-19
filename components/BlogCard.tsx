import { Link } from "@/i18n/navigation";
import type { PostMeta } from "@/lib/posts";
import { useTranslations } from "next-intl";

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

const categoryGradients: Record<string, string> = {
  "ai-tools": "from-purple-500 via-indigo-500 to-blue-500",
  "tech-gadgets": "from-blue-500 via-cyan-500 to-teal-500",
  "software-services": "from-green-500 via-emerald-500 to-teal-500",
};

const categoryIcons: Record<string, string> = {
  "ai-tools": "🤖",
  "tech-gadgets": "📱",
  "software-services": "💻",
};

export default function BlogCard({ post }: { post: PostMeta }) {
  const t = useTranslations("blog");

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
    >
      <div className={`aspect-[16/9] bg-gradient-to-br ${categoryGradients[post.category] ?? "from-gray-400 to-gray-600"} overflow-hidden flex items-center justify-center relative`}>
        <span className="text-5xl opacity-30 group-hover:scale-110 transition-transform duration-300">
          {categoryIcons[post.category] ?? "📝"}
        </span>
        <div className="absolute inset-0 flex items-end p-4">
          <span className="text-white/80 text-xs font-medium drop-shadow-md">
            {post.title}
          </span>
        </div>
      </div>
      <div className="p-5">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${categoryColors[post.category] ?? "bg-gray-100 text-gray-700"}`}
        >
          {t(categoryKeys[post.category] ?? "categoryAiTools")}
        </span>
        <h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
          <time>{post.date}</time>
          <span>·</span>
          <span>{t("readTime", { minutes: post.readTime })}</span>
        </div>
      </div>
    </Link>
  );
}
