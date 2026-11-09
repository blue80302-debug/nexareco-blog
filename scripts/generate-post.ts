import * as fs from "node:fs";
import * as path from "node:path";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-5-5";

const ALL_LOCALES = ["ko", "en", "ja", "es"] as const;
type Locale = (typeof ALL_LOCALES)[number];

const isMultiLang = process.env.MULTI_LANG === "true";
const LOCALES = isMultiLang ? ALL_LOCALES : (["ko"] as const);

interface TopicEntry {
  slug: string;
  format: string;
  category: string;
  products: string[];
  status: string;
}

interface ProductImage {
  product: string;
  url: string;
  alt: string;
  source: string;
}

const LOCALE_LABELS: Record<string, string> = {
  ko: "Korean",
  en: "English",
  ja: "Japanese",
  es: "Spanish",
};

const STRUCTURE_VARIANTS = [
  "비교표를 먼저 보여준 뒤, 각 항목을 깊이 파고드는 구조로 작성하세요.",
  "사용 시나리오별로 나누어 추천하세요 (예: 학생용, 직장인용, 전문가용).",
  "Q&A 형식을 섞어서 독자의 궁금증에 답하는 구조로 작성하세요.",
  "핵심 차이점 3가지를 먼저 요약하고, 각각을 깊이 설명하는 구조로 작성하세요.",
  "가격대별로 나누어 분석한 뒤, 종합 비교표를 마지막에 배치하세요.",
  "각 제품의 강점을 중심으로 서술하고, 어떤 사람에게 맞는지 프로필로 정리하세요.",
];

function buildPrompt(
  topic: TopicEntry,
  locale: Locale,
  date: string
): string {
  const productsJson = JSON.stringify(topic.products);
  const structure = STRUCTURE_VARIANTS[Math.floor(Math.random() * STRUCTURE_VARIANTS.length)];

  return `당신은 IT 제품 리서치 전문 에디터입니다.

먼저 웹 검색을 통해 아래 제품들의 최신 가격, 스펙, 사용자 리뷰를 조사하세요.
그 다음, 조사한 실제 데이터를 기반으로 비교 리뷰를 ${LOCALE_LABELS[locale]} 언어로 작성해주세요.

제품: ${topic.products.join(", ")}
포맷: ${topic.format} (comparison/top-list/buying-guide)
카테고리: ${topic.category}

글 구조: ${structure}

규칙:
- 4,000자 이상 (반드시 지켜야 함. 짧은 글은 검색엔진에서 저품질로 분류됨)
- 독자에게 말을 거는 친근한 에디터 톤 (리서치 기반, 사실 중심)
- 장단점 명확히
- 확실한 결론 (이런 사람은 A, 저런 사람은 B)
- 웹 검색에서 얻은 실제 데이터(가격, 스펙, 벤치마크) 활용
- 출처 자연스럽게 언급
- 매번 같은 구조 금지 — 위의 글 구조 지시를 따르되 자유롭게 변형하세요

절대 금지 표현:
- "직접 사용해 본 결과", "한 달간 써보고", "두 달 번갈아 써보고", "실제로 써보니"
- "직접 체험", "손에 쥐어보니", "개봉해 보니", "일주일간 테스트"
- "이 글에서는 ~에 대해 알아보겠습니다", "오늘은 ~를 비교해 보겠습니다"
- 허위 사용 경험 서술 일체 — 리서치 데이터와 사용자 리뷰를 인용하세요

MDX frontmatter 포함:
---
title: "(제목)"
excerpt: "(1~2문장 발췌)"
category: "${topic.category}"
format: "${topic.format}"
date: "${date}"
coverImage: "/images/posts/${topic.slug}.jpg"
products: ${productsJson}
---

본문만 출력하세요. 설명이나 메타 코멘트는 포함하지 마세요.`;
}

function buildImageSearchPrompt(products: string[], category: string): string {
  return `Find official product images for the following products. Search for press kit images, official product page images, or official screenshots.

Products: ${products.join(", ")}
Category: ${category}

For each product, find 1 high-quality image URL that:
- Comes from the official manufacturer/developer website or official press resources
- Is a direct image URL (ends in .jpg, .jpeg, .png, .webp, or is a CDN image URL)
- Shows the product clearly (UI screenshot for software, product photo for hardware)

Return ONLY a JSON array, no other text:
[
  {"product": "Product Name", "url": "https://...", "alt": "Brief description", "source": "official site name"}
]

If you cannot find a direct image URL for a product, omit that product from the array. Only include URLs you are confident are direct image links.`;
}

function sanitizeContent(raw: string, topic: TopicEntry, date: string): string {
  let text = raw.trim();

  if (text.startsWith("```")) {
    text = text.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "").trim();
  }

  const fmMatch = text.match(/^([\s\S]*?)(---\s*\n[\s\S]*?\n---)([\s\S]*)$/);
  if (fmMatch) {
    const body = fmMatch[3].trim();
    const fm = fmMatch[2];
    if (fm.includes("title:") && body.length > 100) {
      return `${fm}\n\n${body}`;
    }
  }

  let body = text
    .replace(/^title:\s*"[^"]*"\s*/m, "")
    .replace(/^excerpt:\s*"[^"]*"\s*/m, "")
    .replace(/^category:\s*"[^"]*"\s*/m, "")
    .replace(/^format:\s*"[^"]*"\s*/m, "")
    .replace(/^date:\s*"[^"]*"\s*/m, "")
    .replace(/^coverImage:\s*"[^"]*"\s*/m, "")
    .replace(/^products:\s*\[.*?\]\s*/m, "")
    .trim();

  const headingMatch = body.match(/^#\s+(.+)$/m);
  const title = headingMatch ? headingMatch[1].trim() : topic.products.join(" vs ");

  const frontmatter = [
    "---",
    `title: "${title}"`,
    `excerpt: ""`,
    `category: "${topic.category}"`,
    `format: "${topic.format}"`,
    `date: "${date}"`,
    `coverImage: "/images/posts/${topic.slug}.jpg"`,
    `products: ${JSON.stringify(topic.products)}`,
    "---",
  ].join("\n");

  return `${frontmatter}\n\n${body}`;
}

function insertImagesIntoContent(content: string, images: { localPath: string; alt: string; source: string }[]): string {
  if (images.length === 0) return content;

  const fmMatch = content.match(/^(---\s*\n[\s\S]*?\n---)\n\n([\s\S]*)$/);
  if (!fmMatch) return content;

  const frontmatter = fmMatch[1];
  const body = fmMatch[2];

  const headings = [...body.matchAll(/^## .+$/gm)];
  if (headings.length < 2) {
    const imgMarkdown = images
      .map((img) => `![${img.alt}](${img.localPath})\n*${img.source}*`)
      .join("\n\n");
    return `${frontmatter}\n\n${imgMarkdown}\n\n${body}`;
  }

  let result = body;
  let inserted = 0;
  const positions: number[] = [];

  for (let i = 1; i < headings.length && inserted < images.length; i += 2) {
    const idx = headings[i].index;
    if (idx !== undefined) {
      positions.push(idx);
      inserted++;
    }
  }

  let offset = 0;
  for (let i = 0; i < positions.length && i < images.length; i++) {
    const img = images[i];
    const imgBlock = `\n![${img.alt}](${img.localPath})\n*${img.source}*\n\n`;
    const pos = positions[i] + offset;
    result = result.slice(0, pos) + imgBlock + result.slice(pos);
    offset += imgBlock.length;
  }

  return `${frontmatter}\n\n${result}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface ContentBlock {
  type: string;
  text?: string;
}

interface AnthropicResponse {
  content: ContentBlock[];
  stop_reason: string;
}

async function callClaude(prompt: string, useWebSearch: boolean, maxRetries = 3): Promise<string> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    throw new Error("CLAUDE_API_KEY 환경변수가 설정되지 않았습니다.");
  }

  const tools = useWebSearch
    ? [{ type: "web_search_20260209", name: "web_search", max_uses: 5 }]
    : [];

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 8192,
        ...(tools.length > 0 ? { tools } : {}),
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (response.ok) {
      const data = (await response.json()) as AnthropicResponse;
      const textBlocks = data.content.filter(
        (block) => block.type === "text" && block.text
      );
      const text = textBlocks.map((block) => block.text).join("\n");
      if (!text) {
        throw new Error("Claude API 응답에서 텍스트를 추출할 수 없습니다.");
      }
      return text;
    }

    if (response.status === 529 || response.status === 429) {
      const waitSec = attempt * 15;
      console.log(`    API 과부하 (${response.status}), ${waitSec}초 후 재시도... (${attempt}/${maxRetries})`);
      await sleep(waitSec * 1000);
      continue;
    }

    const errorBody = await response.text();
    throw new Error(`Claude API 오류 (${response.status}): ${errorBody}`);
  }

  throw new Error(`Claude API 재시도 ${maxRetries}회 초과`);
}

async function downloadImage(url: string, destPath: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.log(`    이미지 다운로드 실패 (${response.status}): ${url}`);
      return false;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      console.log(`    이미지가 아닌 응답 (${contentType}): ${url}`);
      return false;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 5000) {
      console.log(`    이미지가 너무 작음 (${buffer.length}B): ${url}`);
      return false;
    }

    const dir = path.dirname(destPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(destPath, buffer);
    console.log(`    이미지 저장 완료: ${destPath} (${Math.round(buffer.length / 1024)}KB)`);
    return true;
  } catch (err) {
    console.log(`    이미지 다운로드 오류: ${err instanceof Error ? err.message : err}`);
    return false;
  }
}

function getExtFromUrl(url: string): string {
  const match = url.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i);
  return match ? match[1].toLowerCase() : "jpg";
}

async function findAndDownloadImages(
  topic: TopicEntry,
  projectRoot: string
): Promise<{ localPath: string; alt: string; source: string }[]> {
  console.log("  이미지 검색 중...");

  let raw: string;
  try {
    raw = await callClaude(
      buildImageSearchPrompt(topic.products, topic.category),
      true
    );
  } catch (err) {
    console.log(`  이미지 검색 실패: ${err instanceof Error ? err.message : err}`);
    return [];
  }

  let imageInfos: ProductImage[];
  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log("  이미지 JSON 파싱 실패: JSON 배열 없음");
      return [];
    }
    imageInfos = JSON.parse(jsonMatch[0]) as ProductImage[];
  } catch {
    console.log("  이미지 JSON 파싱 실패");
    return [];
  }

  const results: { localPath: string; alt: string; source: string }[] = [];
  const imgDir = path.join(projectRoot, "public", "images", "posts", topic.slug);

  for (let i = 0; i < imageInfos.length; i++) {
    const info = imageInfos[i];
    if (!info.url || !info.url.startsWith("http")) continue;

    const ext = getExtFromUrl(info.url);
    const filename = `${i + 1}.${ext}`;
    const destPath = path.join(imgDir, filename);
    const localPath = `/images/posts/${topic.slug}/${filename}`;

    const ok = await downloadImage(info.url, destPath);
    if (ok) {
      results.push({
        localPath,
        alt: info.alt || info.product,
        source: `이미지 출처: ${info.source || "공식 사이트"}`,
      });
    }
  }

  console.log(`  이미지 ${results.length}/${imageInfos.length}개 다운로드 완료`);
  return results;
}

async function main(): Promise<void> {
  const projectRoot = path.resolve(import.meta.dirname ?? __dirname, "..");
  const queuePath = path.join(projectRoot, "data", "topics-queue.json");

  const queueRaw = fs.readFileSync(queuePath, "utf-8");
  const queue: TopicEntry[] = JSON.parse(queueRaw);

  const pendingIndex = queue.findIndex((t) => t.status === "pending");
  if (pendingIndex === -1) {
    console.log("처리할 pending 주제가 없습니다.");
    return;
  }

  const topic = queue[pendingIndex];
  const date = new Date().toISOString().split("T")[0];

  console.log(`주제 처리 중: ${topic.slug}`);

  // 1. 이미지 검색 및 다운로드 (한 번만, 모든 언어 공유)
  const images = await findAndDownloadImages(topic, projectRoot);

  // 2. 각 언어별 콘텐츠 생성 + 이미지 삽입
  for (const locale of LOCALES) {
    console.log(`  [${locale}] 생성 중...`);

    const prompt = buildPrompt(topic, locale, date);
    const raw = await callClaude(prompt, true);
    let content = sanitizeContent(raw, topic, date);

    content = insertImagesIntoContent(content, images);

    const outputDir = path.join(projectRoot, "content", locale, "blog");
    fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `${topic.slug}.mdx`);
    fs.writeFileSync(outputPath, content, "utf-8");

    console.log(`  [${locale}] 저장 완료: ${outputPath}`);
  }

  queue[pendingIndex].status = "completed";
  fs.writeFileSync(queuePath, JSON.stringify(queue, null, 2) + "\n", "utf-8");

  console.log(`완료: ${topic.slug}`);
}

main().catch((err: unknown) => {
  console.error("오류 발생:", err instanceof Error ? err.message : err);
  process.exit(1);
});
