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

const postIcons: Record<string, string> = {
  "chatgpt-vs-gemini": "🧠",
  "claude-vs-chatgpt": "⚡",
  "best-ai-writing-tools-2026": "✍️",
  "midjourney-vs-dall-e": "🎨",
  "notion-ai-vs-obsidian": "📓",
  "github-copilot-vs-cursor": "👨‍💻",
  "airpods-pro-3-vs-galaxy-buds-4": "🎧",
  "apple-watch-ultra-3-vs-galaxy-watch-7": "⌚",
  "best-budget-smartphones-2026": "📱",
  "iphone-17-pro-vs-galaxy-s26-ultra": "📲",
  "best-wireless-earbuds-buying-guide": "🎵",
  "netflix-vs-disney-plus": "🎬",
  "google-drive-vs-dropbox-vs-icloud": "☁️",
  "best-vpn-services-2026": "🔒",
  "spotify-vs-apple-music-vs-youtube-music": "🎶",
  "best-password-managers-2026": "🔑",
};

function slugToHash(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const gradientPairs = [
  ["#7c3aed", "#2563eb"],
  ["#6366f1", "#06b6d4"],
  ["#8b5cf6", "#ec4899"],
  ["#3b82f6", "#10b981"],
  ["#0ea5e9", "#6366f1"],
  ["#14b8a6", "#3b82f6"],
  ["#f59e0b", "#ef4444"],
  ["#10b981", "#0ea5e9"],
  ["#ec4899", "#8b5cf6"],
  ["#ef4444", "#f59e0b"],
  ["#06b6d4", "#8b5cf6"],
  ["#a855f7", "#06b6d4"],
];

const gradientAngles = [135, 150, 120, 160, 140, 170, 125, 145, 155, 130];

export default function BlogCard({ post }: { post: PostMeta }) {
  const t = useTranslations("blog");
  const hash = slugToHash(post.slug);
  const pair = gradientPairs[hash % gradientPairs.length];
  const angle = gradientAngles[hash % gradientAngles.length];
  const icon = postIcons[post.slug] ?? "📝";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
    >
      <div
        className="aspect-[16/9] overflow-hidden flex items-center justify-center relative"
        style={{ background: `linear-gradient(${angle}deg, ${pair[0]}, ${pair[1]})` }}
      >
        <span className="text-6xl opacity-25 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>
        <div className="absolute inset-0 flex items-end p-4">
          <span className="text-white/90 text-xs font-medium drop-shadow-lg line-clamp-1">
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
