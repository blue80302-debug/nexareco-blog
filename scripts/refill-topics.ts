import * as fs from "node:fs";
import * as path from "node:path";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";
const MIN_QUEUE_SIZE = 5;
const REFILL_COUNT = 8;

interface TopicEntry {
  slug: string;
  format: string;
  category: string;
  products: string[];
  status: string;
}

const SEASONAL_SEEDS: Record<string, { ko: string[]; en: string[] }> = {
  winter: {
    ko: ["히터 추천", "가습기 비교", "전기장판 추천", "온풍기 비교", "겨울 패딩 추천"],
    en: ["best space heater", "humidifier comparison", "best heated blanket", "winter jacket vs"],
  },
  spring: {
    ko: ["공기청정기 추천", "미세먼지 마스크 비교", "제습기 추천", "알레르기 공기청정기"],
    en: ["best air purifier", "dehumidifier comparison", "best allergy air purifier"],
  },
  summer: {
    ko: ["에어컨 추천", "선풍기 비교", "제습기 추천", "휴대용 선풍기 추천", "서큘레이터 비교"],
    en: ["best portable AC", "fan comparison", "best dehumidifier", "portable fan vs"],
  },
  fall: {
    ko: ["건조기 추천", "의류관리기 비교", "가습기 추천", "전기히터 비교"],
    en: ["best dryer", "clothes steamer comparison", "best humidifier", "space heater vs"],
  },
};

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "fall";
  return "winter";
}

const CATEGORIES = [
  {
    id: "ai-tools",
    seeds: {
      ko: ["AI 도구 추천", "AI 비교", "AI 서비스", "챗봇 비교", "코딩 AI", "AI 이미지 생성", "AI 번역기 비교", "AI 요약 도구"],
      en: ["best AI tools", "AI comparison", "AI assistant vs", "AI code editor", "AI image generator", "AI writing tool vs", "AI translator comparison"],
    },
  },
  {
    id: "tech-gadgets",
    seeds: {
      ko: ["이어폰 추천", "노트북 비교", "태블릿 추천", "스마트워치 비교", "키보드 추천", "모니터 추천", "로봇청소기 비교", "마우스 추천", "웹캠 비교", "외장SSD 추천", "충전기 추천"],
      en: ["best earbuds", "laptop comparison", "tablet vs", "smartwatch comparison", "best keyboard", "best monitor", "best mouse", "best webcam", "best portable SSD", "best charger"],
    },
  },
  {
    id: "software-services",
    seeds: {
      ko: ["앱 비교", "클라우드 추천", "VPN 비교", "생산성 앱 추천", "디자인 툴 비교", "스트리밍 비교", "영어학습 앱 추천", "가계부 앱 비교", "화상회의 비교", "메모 앱 추천"],
      en: ["best app", "cloud storage comparison", "productivity tool vs", "design tool comparison", "streaming service vs", "language learning app vs", "video conferencing comparison", "note taking app vs", "project management tool vs"],
    },
  },
  {
    id: "home-appliances",
    seeds: {
      ko: ["공기청정기 추천", "세탁기 비교", "건조기 추천", "식기세척기 비교", "의류관리기 추천", "가습기 비교", "커피머신 추천", "전자레인지 비교", "음식물처리기 추천"],
      en: ["best air purifier", "washing machine comparison", "best dryer", "dishwasher vs", "best coffee machine", "best microwave", "air fryer comparison", "best vacuum cleaner"],
    },
  },
  {
    id: "health-beauty",
    seeds: {
      ko: ["안마의자 추천", "전동칫솔 비교", "헤어드라이어 추천", "체중계 비교", "눈 마사지기 추천", "정수기 비교"],
      en: ["best electric toothbrush", "hair dryer comparison", "best massage gun", "smart scale vs", "best water purifier", "best fitness tracker"],
    },
  },
];

async function fetchGoogleSuggest(query: string): Promise<string[]> {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as [string, string[]];
    return data[1] || [];
  } catch {
    return [];
  }
}

async function fetchNaverSuggest(query: string): Promise<string[]> {
  const url = `https://ac.search.naver.com/nx/ac?q=${encodeURIComponent(query)}&con=1&frm=nv&ans=2&r_format=json&r_enc=UTF-8&r_unicode=0&t_koreng=1&q_enc=UTF-8&st=100&q_gr=`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const items = data?.items as Array<Array<[string]>> | undefined;
    if (!items?.[0]) return [];
    return items[0].map((item: [string]) => item[0]);
  } catch {
    return [];
  }
}

const PURCHASE_INTENT_PATTERNS = [
  /추천/,
  /비교/,
  /vs/i,
  /best/i,
  /top/i,
  /review/i,
  /후기/,
  /사도 될까/,
  /worth/i,
  /comparison/i,
  /buying guide/i,
  /구매/,
  /가성비/,
  /어떤.*좋/,
];

function hasPurchaseIntent(keyword: string): boolean {
  return PURCHASE_INTENT_PATTERNS.some((p) => p.test(keyword));
}

function scoreKeyword(keyword: string): number {
  let score = 0;
  if (/vs|비교|comparison/i.test(keyword)) score += 3;
  if (/추천|best|top/i.test(keyword)) score += 2;
  if (/후기|review/i.test(keyword)) score += 2;
  if (/2026|2025|최신/i.test(keyword)) score += 1;
  if (/가성비|budget|cheap/i.test(keyword)) score += 1;
  if (/사도|worth|buying/i.test(keyword)) score += 1;
  return score;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function collectKeywords(): Promise<Array<{ keyword: string; score: number; category: string }>> {
  const results: Array<{ keyword: string; score: number; category: string }> = [];
  const seen = new Set<string>();

  for (const cat of CATEGORIES) {
    const allSeeds = [...cat.seeds.ko, ...cat.seeds.en];

    for (const seed of allSeeds) {
      const [googleResults, naverResults] = await Promise.all([
        fetchGoogleSuggest(seed),
        fetchNaverSuggest(seed),
      ]);

      const combined = [...googleResults, ...naverResults];

      for (const kw of combined) {
        const normalized = kw.toLowerCase().trim();
        if (seen.has(normalized)) continue;
        if (!hasPurchaseIntent(kw)) continue;
        seen.add(normalized);
        results.push({
          keyword: kw,
          score: scoreKeyword(kw),
          category: cat.id,
        });
      }

      await sleep(200);
    }
  }

  const season = getCurrentSeason();
  const seasonSeeds = SEASONAL_SEEDS[season];
  const seasonalAll = [...seasonSeeds.ko, ...seasonSeeds.en];
  for (const seed of seasonalAll) {
    const [googleResults, naverResults] = await Promise.all([
      fetchGoogleSuggest(seed),
      fetchNaverSuggest(seed),
    ]);
    for (const kw of [...googleResults, ...naverResults]) {
      const normalized = kw.toLowerCase().trim();
      if (seen.has(normalized)) continue;
      if (!hasPurchaseIntent(kw)) continue;
      seen.add(normalized);
      results.push({
        keyword: kw,
        score: scoreKeyword(kw) + 2,
        category: "home-appliances",
      });
    }
    await sleep(200);
  }

  return results.sort((a, b) => b.score - a.score);
}

interface ContentBlock {
  type: string;
  text?: string;
}

interface AnthropicResponse {
  content: ContentBlock[];
}

async function keywordsToTopics(
  keywords: Array<{ keyword: string; score: number; category: string }>,
  existingSlugs: Set<string>,
  count: number
): Promise<TopicEntry[]> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("CLAUDE_API_KEY 환경변수 필요");

  const topKeywords = keywords.slice(0, count * 3);

  const prompt = `너는 제품 비교/추천 블로그의 편집자야.

아래 키워드 목록을 분석해서, 블로그 포스트 토픽 ${count}개를 JSON 배열로 만들어줘.

키워드 목록:
${topKeywords.map((k) => `- "${k.keyword}" (카테고리: ${k.category}, 점수: ${k.score})`).join("\n")}

이미 발행된 slug (중복 금지):
${[...existingSlugs].join(", ")}

규칙:
1. 유사한 키워드는 클러스터링해서 1개 토픽으로 묶어
2. slug는 영문 kebab-case
3. format은 "comparison", "top-list", "buying-guide" 중 하나
4. products는 실제 존재하는 제품/서비스 2~4개
5. 이미 발행된 slug와 겹치면 안 됨
6. 2026년 기준 최신 제품으로

JSON만 출력해. 설명 없이.
[{"slug":"...", "format":"...", "category":"...", "products":["...", "..."]}]`;

  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API 오류 (${res.status}): ${err}`);
  }

  const data = (await res.json()) as AnthropicResponse;
  const text = data.content.find((b) => b.type === "text")?.text || "";

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Claude 응답에서 JSON 파싱 실패");

  const topics = JSON.parse(jsonMatch[0]) as Array<{
    slug: string;
    format: string;
    category: string;
    products: string[];
  }>;

  return topics
    .filter((t) => !existingSlugs.has(t.slug))
    .map((t) => ({ ...t, status: "pending" }));
}

async function main(): Promise<void> {
  const projectRoot = path.resolve(import.meta.dirname ?? __dirname, "..");
  const queuePath = path.join(projectRoot, "data", "topics-queue.json");

  const queueRaw = fs.readFileSync(queuePath, "utf-8");
  const queue: TopicEntry[] = JSON.parse(queueRaw);

  const pendingCount = queue.filter((t) => t.status === "pending").length;
  console.log(`현재 큐: 전체 ${queue.length}개, pending ${pendingCount}개`);

  if (pendingCount >= MIN_QUEUE_SIZE) {
    console.log(`pending이 ${MIN_QUEUE_SIZE}개 이상이므로 보충 불필요.`);
    return;
  }

  const needed = REFILL_COUNT - pendingCount;
  console.log(`${needed}개 토픽 보충 시작...`);

  console.log("1단계: 키워드 수집 (구글 + 네이버)...");
  const keywords = await collectKeywords();
  console.log(`  수집된 구매의도 키워드: ${keywords.length}개`);

  if (keywords.length === 0) {
    console.log("수집된 키워드가 없습니다.");
    return;
  }

  const existingSlugs = new Set<string>();
  for (const t of queue) existingSlugs.add(t.slug);

  const contentDir = path.join(projectRoot, "content", "ko", "blog");
  if (fs.existsSync(contentDir)) {
    for (const f of fs.readdirSync(contentDir)) {
      if (f.endsWith(".mdx")) existingSlugs.add(f.replace(".mdx", ""));
    }
  }

  console.log(`2단계: 키워드 → 토픽 변환 (상위 ${needed * 3}개 → ${needed}개)...`);
  const newTopics = await keywordsToTopics(keywords, existingSlugs, needed);
  console.log(`  생성된 토픽: ${newTopics.length}개`);

  for (const t of newTopics) {
    console.log(`  + ${t.slug} (${t.format}, ${t.category})`);
  }

  queue.push(...newTopics);
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2) + "\n", "utf-8");
  console.log(`큐 업데이트 완료. 전체 ${queue.length}개, pending ${newTopics.length + pendingCount}개`);
}

main().catch((err: unknown) => {
  console.error("오류:", err instanceof Error ? err.message : err);
  process.exit(1);
});
