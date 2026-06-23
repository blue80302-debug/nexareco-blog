export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: number;
  imageUrl: string;
  originalUrl: string;
};

// nexareco.com이 현재 다른 앱을 가리키고 있어서 Blogger ID로 직접 접근
const FEED_URL =
  "https://www.blogger.com/feeds/5284787089087001937/posts/default?alt=json&max-results=50";

function extractSlug(entry: Record<string, unknown>): string {
  const raw = (entry.id as { $t: string } | undefined)?.$t ?? "";
  const match = raw.match(/\.post-(\d+)$/);
  return match ? match[1] : raw.slice(-12);
}

function extractImage(entry: Record<string, unknown>): string {
  const thumb = entry["media$thumbnail"] as { url: string } | undefined;
  if (thumb?.url) {
    return thumb.url.replace(/\/s\d+-c\//, "/s800/").replace(/\/s\d+\//, "/s800/");
  }
  const html =
    ((entry.content as { $t: string } | undefined)?.$t ?? "") ||
    ((entry.summary as { $t: string } | undefined)?.$t ?? "");
  const m = html.match(/<img[^>]+src="([^"]+)"/);
  if (m) return m[1];
  return "https://picsum.photos/seed/blogpost/800/500";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateReadTime(html: string): number {
  const words = stripHtml(html).split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// 영어 라벨 → 한국어 카테고리 매핑
const LABEL_MAP: Record<string, string> = {
  STOCKS: "주식",
  AI: "AI 투자",
  ECONOMY: "경제",
  INSIGHT: "인사이트",
  NexarEco: "넥사레코",
  "2026 Future": "2026 전망",
  "AI Intelligence": "AI 인텔리전스",
};

function mapCategory(term: string): string {
  return LABEL_MAP[term] ?? term;
}

type FeedEntry = Record<string, unknown>;
type FeedLink = { rel: string; href: string };

export async function fetchBloggerPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    const entries: FeedEntry[] = (data.feed?.entry as FeedEntry[]) ?? [];

    return entries
      .map((entry) => {
      const cats = (entry.category as { term: string }[] | undefined) ?? [];
      // NexarEco는 브랜드 태그라 제외하고 첫 번째 의미있는 라벨 선택
      const meaningfulCat = cats.find((c) => c.term !== "NexarEco") ?? cats[0];
      const category = meaningfulCat ? mapCategory(meaningfulCat.term) : "일반";

      const links = (entry.link as FeedLink[] | undefined) ?? [];
      const altLink = links.find((l) => l.rel === "alternate");

      const content =
        (entry.content as { $t: string } | undefined)?.$t ?? "";
      const summaryRaw =
        (entry.summary as { $t: string } | undefined)?.$t ?? content;
      const excerpt =
        stripHtml(summaryRaw).substring(0, 160) +
        (stripHtml(summaryRaw).length > 160 ? "..." : "");

      const published =
        (entry.published as { $t: string } | undefined)?.$t ?? "";

      const title =
        (entry.title as { $t: string } | undefined)?.$t ?? "";

      return {
        slug: extractSlug(entry),
        title,
        excerpt,
        content,
        category,
        date: published
          ? new Date(published).toISOString().split("T")[0]
          : "",
        readTime: estimateReadTime(content),
        imageUrl: extractImage(entry),
        originalUrl: altLink?.href ?? "",
      };
    })
    .filter((p) => p.title.trim() !== ""); // 제목 없는 글 제외
  } catch {
    return [];
  }
}

export async function fetchBloggerPost(
  slug: string
): Promise<BlogPost | null> {
  const posts = await fetchBloggerPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function fetchBloggerCategories(): Promise<string[]> {
  const posts = await fetchBloggerPosts();
  const set = new Set(posts.map((p) => p.category));
  return Array.from(set);
}
