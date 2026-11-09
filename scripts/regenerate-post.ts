import * as fs from "node:fs";
import * as path from "node:path";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-5-5";
const MIN_LINES = 130;

interface ContentBlock {
  type: string;
  text?: string;
}

interface AnthropicResponse {
  content: ContentBlock[];
  stop_reason: string;
}

interface ProductImage {
  product: string;
  url: string;
  alt: string;
  source: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callClaude(prompt: string, useWebSearch: boolean, maxRetries = 3): Promise<string> {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) throw new Error("CLAUDE_API_KEY 환경변수가 설정되지 않았습니다.");

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
      const text = data.content
        .filter((b) => b.type === "text" && b.text)
        .map((b) => b.text)
        .join("\n");
      if (!text) throw new Error("Claude API 응답에서 텍스트를 추출할 수 없습니다.");
      return text;
    }

    if (response.status === 529 || response.status === 429) {
      const waitSec = attempt * 15;
      console.log(`  API 과부하 (${response.status}), ${waitSec}초 후 재시도... (${attempt}/${maxRetries})`);
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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return false;
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return false;
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length < 5000) return false;
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, buffer);
    console.log(`  이미지 저장: ${destPath} (${Math.round(buffer.length / 1024)}KB)`);
    return true;
  } catch {
    return false;
  }
}

function getExtFromUrl(url: string): string {
  const match = url.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i);
  return match ? match[1].toLowerCase() : "jpg";
}

interface PostFrontmatter {
  title: string;
  excerpt: string;
  category: string;
  format: string;
  date: string;
  coverImage: string;
  products: string[];
}

function parseFrontmatter(content: string): { fm: PostFrontmatter; body: string } | null {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return null;

  const fmRaw = match[1];
  const body = match[2];

  const get = (key: string): string => {
    const m = fmRaw.match(new RegExp(`^${key}:\\s*"([^"]*)"`, "m"))
      || fmRaw.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return m ? m[1].trim() : "";
  };

  const productsMatch = fmRaw.match(/^products:\s*(\[.*\])/m);
  let products: string[] = [];
  if (productsMatch) {
    try { products = JSON.parse(productsMatch[1]); } catch { /* */ }
  }

  return {
    fm: {
      title: get("title"),
      excerpt: get("excerpt"),
      category: get("category"),
      format: get("format"),
      date: get("date"),
      coverImage: get("coverImage"),
      products,
    },
    body,
  };
}

const STRUCTURE_VARIANTS = [
  "비교표를 먼저 보여준 뒤, 각 항목을 깊이 파고드는 구조로 작성하세요.",
  "사용 시나리오별로 나누어 추천하세요 (예: 학생용, 직장인용, 전문가용).",
  "Q&A 형식을 섞어서 독자의 궁금증에 답하는 구조로 작성하세요.",
  "핵심 차이점 3가지를 먼저 요약하고, 각각을 깊이 설명하는 구조로 작성하세요.",
  "가격대별로 나누어 분석한 뒤, 종합 비교표를 마지막에 배치하세요.",
  "각 제품의 강점을 중심으로 서술하고, 어떤 사람에게 맞는지 프로필로 정리하세요.",
];

const LOCALE_LABELS: Record<string, string> = {
  ko: "Korean", en: "English", ja: "Japanese", es: "Spanish",
};

function buildRegenPrompt(fm: PostFrontmatter, locale: string): string {
  const structure = STRUCTURE_VARIANTS[Math.floor(Math.random() * STRUCTURE_VARIANTS.length)];
  const today = new Date().toISOString().split("T")[0];

  return `당신은 IT 제품 리서치 전문 에디터입니다.

기존에 작성된 비교 리뷰를 대폭 개선해야 합니다.
먼저 웹 검색을 통해 아래 제품들의 최신 가격, 스펙, 사용자 리뷰를 조사하세요.
그 다음, 조사한 실제 데이터를 기반으로 비교 리뷰를 ${LOCALE_LABELS[locale] || "Korean"} 언어로 작성해주세요.

제품: ${fm.products.join(", ")}
포맷: ${fm.format}
카테고리: ${fm.category}

글 구조: ${structure}

규칙:
- 4,000자 이상 (반드시 지켜야 함)
- 독자에게 말을 거는 친근한 에디터 톤 (리서치 기반, 사실 중심)
- 장단점 명확히
- 확실한 결론 (이런 사람은 A, 저런 사람은 B)
- 웹 검색에서 얻은 실제 데이터(가격, 스펙, 벤치마크) 활용
- 출처 자연스럽게 언급
- 이전 버전보다 훨씬 깊이 있는 분석 필요

절대 금지 표현:
- "직접 사용해 본 결과", "한 달간 써보고", "두 달 번갈아 써보고", "실제로 써보니"
- "직접 체험", "손에 쥐어보니", "개봉해 보니", "일주일간 테스트"
- "이 글에서는 ~에 대해 알아보겠습니다", "오늘은 ~를 비교해 보겠습니다"
- 허위 사용 경험 서술 일체

MDX frontmatter 포함:
---
title: "(기존보다 SEO에 최적화된 제목)"
excerpt: "(1~2문장 발췌)"
category: "${fm.category}"
format: "${fm.format}"
date: "${today}"
coverImage: "${fm.coverImage}"
products: ${JSON.stringify(fm.products)}
---

본문만 출력하세요. 설명이나 메타 코멘트는 포함하지 마세요.`;
}

async function findAndDownloadImages(
  products: string[],
  category: string,
  slug: string,
  projectRoot: string
): Promise<{ localPath: string; alt: string; source: string }[]> {
  console.log("  이미지 검색 중...");

  const prompt = `Find official product images for: ${products.join(", ")} (Category: ${category}).
For each product, find 1 high-quality image URL from official websites.
Return ONLY a JSON array: [{"product":"Name","url":"https://...","alt":"desc","source":"site"}]`;

  let raw: string;
  try {
    raw = await callClaude(prompt, true);
  } catch {
    return [];
  }

  let imageInfos: ProductImage[];
  try {
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    imageInfos = JSON.parse(jsonMatch[0]);
  } catch {
    return [];
  }

  const results: { localPath: string; alt: string; source: string }[] = [];
  const imgDir = path.join(projectRoot, "public", "images", "posts", slug);

  for (let i = 0; i < imageInfos.length; i++) {
    const info = imageInfos[i];
    if (!info.url?.startsWith("http")) continue;
    const ext = getExtFromUrl(info.url);
    const filename = `${i + 1}.${ext}`;
    const destPath = path.join(imgDir, filename);
    const localPath = `/images/posts/${slug}/${filename}`;
    if (await downloadImage(info.url, destPath)) {
      results.push({
        localPath,
        alt: info.alt || info.product,
        source: `이미지 출처: ${info.source || "공식 사이트"}`,
      });
    }
  }

  console.log(`  이미지 ${results.length}개 다운로드 완료`);
  return results;
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
  let offset = 0;
  let inserted = 0;

  for (let i = 1; i < headings.length && inserted < images.length; i += 2) {
    const idx = headings[i].index;
    if (idx === undefined) continue;
    const img = images[inserted];
    const imgBlock = `\n![${img.alt}](${img.localPath})\n*${img.source}*\n\n`;
    const pos = idx + offset;
    result = result.slice(0, pos) + imgBlock + result.slice(pos);
    offset += imgBlock.length;
    inserted++;
  }

  return `${frontmatter}\n\n${result}`;
}

function sanitizeOutput(raw: string, fm: PostFrontmatter): string {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```[a-z]*\n?/, "").replace(/\n?```$/, "").trim();
  }

  const fmMatch = text.match(/^([\s\S]*?)(---\s*\n[\s\S]*?\n---)([\s\S]*)$/);
  if (fmMatch) {
    const body = fmMatch[3].trim();
    const fmBlock = fmMatch[2];
    if (fmBlock.includes("title:") && body.length > 100) {
      return `${fmBlock}\n\n${body}`;
    }
  }

  const today = new Date().toISOString().split("T")[0];
  const frontmatter = [
    "---",
    `title: "${fm.title}"`,
    `excerpt: "${fm.excerpt}"`,
    `category: "${fm.category}"`,
    `format: "${fm.format}"`,
    `date: "${today}"`,
    `coverImage: "${fm.coverImage}"`,
    `products: ${JSON.stringify(fm.products)}`,
    "---",
  ].join("\n");

  return `${frontmatter}\n\n${text}`;
}

async function main(): Promise<void> {
  const projectRoot = path.resolve(import.meta.dirname ?? __dirname, "..");
  const koDir = path.join(projectRoot, "content", "ko", "blog");

  const files = fs.readdirSync(koDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => ({
      name: f,
      slug: f.replace(".mdx", ""),
      lines: fs.readFileSync(path.join(koDir, f), "utf-8").split("\n").length,
    }))
    .sort((a, b) => a.lines - b.lines);

  const target = files.find((f) => f.lines < MIN_LINES);
  if (!target) {
    console.log(`모든 글이 ${MIN_LINES}줄 이상입니다. 재생성 불필요.`);
    return;
  }

  console.log(`재생성 대상: ${target.slug} (${target.lines}줄)`);

  const content = fs.readFileSync(path.join(koDir, target.name), "utf-8");
  const parsed = parseFrontmatter(content);
  if (!parsed) {
    console.log("frontmatter 파싱 실패");
    return;
  }

  const { fm } = parsed;

  // 이미지 검색 및 다운로드
  const images = await findAndDownloadImages(fm.products, fm.category, target.slug, projectRoot);

  // 한국어 재생성
  const locales = ["ko", "en", "ja", "es"] as const;
  for (const locale of locales) {
    const localePath = path.join(projectRoot, "content", locale, "blog", target.name);
    if (!fs.existsSync(localePath) && locale !== "ko") continue;

    console.log(`  [${locale}] 재생성 중...`);
    const prompt = buildRegenPrompt(fm, locale);
    const raw = await callClaude(prompt, true);
    let newContent = sanitizeOutput(raw, fm);
    newContent = insertImagesIntoContent(newContent, images);

    fs.writeFileSync(localePath, newContent, "utf-8");
    console.log(`  [${locale}] 저장 완료 (${newContent.split("\n").length}줄)`);
  }

  console.log(`완료: ${target.slug}`);
}

main().catch((err: unknown) => {
  console.error("오류 발생:", err instanceof Error ? err.message : err);
  process.exit(1);
});
