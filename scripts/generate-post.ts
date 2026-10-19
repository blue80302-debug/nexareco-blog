import * as fs from "node:fs";
import * as path from "node:path";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const LOCALES = ["ko", "en", "ja", "es"] as const;
type Locale = (typeof LOCALES)[number];

interface TopicEntry {
  slug: string;
  format: string;
  category: string;
  products: string[];
  status: string;
}

const LOCALE_LABELS: Record<Locale, string> = {
  ko: "Korean",
  en: "English",
  ja: "Japanese",
  es: "Spanish",
};

function buildPrompt(
  topic: TopicEntry,
  locale: Locale,
  date: string
): string {
  const productsJson = JSON.stringify(topic.products);

  return `당신은 IT 제품을 직접 사용해본 블로거입니다.

아래 제품들을 비교하는 블로그 리뷰를 ${LOCALE_LABELS[locale]} 언어로 작성해주세요.

제품: ${topic.products.join(", ")}
포맷: ${topic.format} (comparison/top-list/buying-guide)
카테고리: ${topic.category}

규칙:
- 2,500자 이상
- 1인칭 블로그 구어체 (직접 써본 느낌)
- 비교표(마크다운 표) 필수
- 장단점 명확히
- 확실한 결론 (이런 사람은 A, 저런 사람은 B)
- "이 글에서는 ~에 대해 알아보겠습니다" 같은 상투적 표현 금지
- 실제 데이터 기반 (가격, 스펙 등)
- 출처 자연스럽게 언급

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

async function generateContent(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY 환경변수가 설정되지 않았습니다. .env 파일 또는 환경변수를 확인하세요."
    );
  }

  const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 8192 },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API 오류 (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as {
    candidates: Array<{
      content: { parts: Array<{ text: string }> };
    }>;
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini API 응답에서 텍스트를 추출할 수 없습니다.");
  }

  return text;
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

  for (const locale of LOCALES) {
    console.log(`  [${locale}] 생성 중...`);

    const prompt = buildPrompt(topic, locale, date);
    const content = await generateContent(prompt);

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
