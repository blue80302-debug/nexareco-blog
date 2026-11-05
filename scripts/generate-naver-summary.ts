import * as fs from "node:fs";
import * as path from "node:path";

const BLOG_DIR = path.resolve(import.meta.dirname ?? __dirname, "..", "content", "ko", "blog");
const OUTPUT_DIR = path.resolve(import.meta.dirname ?? __dirname, "..", "data", "naver-posts");
const SITE_URL = "https://nexareco.com";
const COUPANG_AF_CODE = "AF1651276";

function getCoupangLink(productName: string): string {
  const query = encodeURIComponent(productName);
  return `https://link.coupang.com/a/${COUPANG_AF_CODE}?lptag=AF${COUPANG_AF_CODE}&pageKey=0&traceid=V0-153&itemId=0&vendorItemId=0&q=${query}`;
}

interface Frontmatter {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  products: string[];
}

function parseFrontmatter(content: string): { frontmatter: Frontmatter; body: string } {
  const normalized = content.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("frontmatter 파싱 실패");

  const raw = match[1];
  const body = match[2];

  const get = (key: string): string => {
    const m = raw.match(new RegExp(`^${key}:\\s*"?(.+?)"?$`, "m"));
    return m ? m[1] : "";
  };

  const productsMatch = raw.match(/products:\s*\[(.*)\]/);
  const products = productsMatch
    ? productsMatch[1].split(",").map((p) => p.trim().replace(/"/g, ""))
    : [];

  return {
    frontmatter: {
      title: get("title"),
      excerpt: get("excerpt"),
      category: get("category"),
      date: get("date"),
      products,
    },
    body,
  };
}

function extractFirstTable(body: string): string | null {
  const lines = body.split("\n");
  const tableLines: string[] = [];
  let inTable = false;

  for (const line of lines) {
    if (line.trim().startsWith("|")) {
      inTable = true;
      tableLines.push(line);
    } else if (inTable) {
      break;
    }
  }

  if (tableLines.length < 3) return null;

  const rows = tableLines
    .filter((l) => !l.match(/^\|[\s-:|]+\|$/))
    .map((l) =>
      l.split("|").filter((c) => c.trim()).map((c) => c.trim())
    );

  if (rows.length < 2) return null;

  const headers = rows[0];
  const result: string[] = [];

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    const parts = cells.map((cell, j) => (headers[j] ? `${headers[j]}: ${cell}` : cell)).join(" / ");
    result.push(`- ${parts}`);
  }

  return result.join("\n");
}

function extractKeyPoints(body: string): string[] {
  const points: string[] = [];
  const headings = body.match(/^##\s+(.+)$/gm);
  if (headings) {
    for (const h of headings.slice(0, 5)) {
      const clean = h.replace(/^##\s+/, "").trim();
      if (!["들어가며", "마무리", "결론", "마치며", "FAQ"].includes(clean)) {
        points.push(clean);
      }
    }
  }
  return points.slice(0, 4);
}

function extractConclusion(body: string): string | null {
  const conclusionMatch = body.match(/(?:##\s*(?:결론|마무리|마치며|최종 추천|어떤 사람|누구에게|추천 정리)[\s\S]*?\n\n)([\s\S]*?)(?:\n##|\n*$)/);
  if (conclusionMatch) {
    const text = conclusionMatch[1].trim();
    if (text.length > 20) return text;
  }
  return null;
}

function extractSectionSummaries(body: string): string[] {
  const sections: string[] = [];
  const parts = body.split(/^##\s+/m).slice(1);

  for (const part of parts) {
    const lines = part.split("\n");
    const heading = lines[0].trim();

    if (["들어가며", "마무리", "결론", "마치며", "FAQ", "한눈에 보는", "스펙 비교"].some(skip => heading.includes(skip))) continue;

    const paragraphs = lines.slice(1).join("\n").split("\n\n")
      .map(p => p.trim())
      .filter(p => p.length > 30 && !p.startsWith("|") && !p.startsWith("-"));

    if (paragraphs.length > 0) {
      const summary = paragraphs.slice(0, 2).join("\n\n");
      sections.push(`▶ ${heading}\n${summary}`);
    }
  }

  return sections.slice(0, 5);
}

const CATEGORY_TAGS: Record<string, string[]> = {
  "ai-tools": ["AI추천", "AI비교", "AI도구"],
  "tech-gadgets": ["가젯추천", "IT기기비교", "테크리뷰"],
  "software-services": ["앱추천", "소프트웨어비교", "서비스리뷰"],
  "home-appliances": ["가전추천", "가전비교", "생활가전"],
  "health-beauty": ["건강가전", "뷰티가전", "헬스케어"],
  "gaming": ["게이밍추천", "게임기기", "게이밍비교"],
  "automotive": ["자동차용품", "차량가젯", "블랙박스추천"],
  "camera": ["카메라추천", "카메라비교", "미러리스"],
  "baby-kids": ["육아용품", "유모차추천", "카시트비교"],
  "pet": ["반려동물용품", "펫가전", "자동급식기"],
  "fitness": ["운동기구추천", "홈트레이닝", "피트니스"],
};

function generateNaverPost(slug: string, frontmatter: Frontmatter, body: string): string {
  const { title, excerpt, category, products } = frontmatter;
  const table = extractFirstTable(body);
  const keyPoints = extractKeyPoints(body);
  const conclusion = extractConclusion(body);
  const sectionSummaries = extractSectionSummaries(body);
  const link = `${SITE_URL}/ko/blog/${slug}`;
  const tags = CATEGORY_TAGS[category] || ["IT추천", "제품비교"];
  const productTags = products.map((p) => p.replace(/\s+/g, ""));

  let post = `${title}\n\n`;
  post += `${excerpt}\n\n`;

  if (keyPoints.length > 0) {
    post += `[이 글에서 다루는 내용]\n`;
    for (const point of keyPoints) {
      post += `• ${point}\n`;
    }
    post += `\n`;
  }

  if (table) {
    post += `[핵심 비교표]\n${table}\n\n`;
  }

  if (sectionSummaries.length > 0) {
    for (const section of sectionSummaries) {
      post += `${section}\n\n`;
    }
  }

  if (conclusion) {
    post += `[결론]\n${conclusion}\n\n`;
  }

  post += `더 자세한 비교가 궁금하다면?\n${link}\n\n`;
  post += `---\n`;
  post += `네이버 태그: ${[...tags, ...productTags].join(", ")}\n`;

  return post;
}

function main(): void {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const targetSlug = process.argv[2];
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  let generated = 0;

  for (const file of files) {
    const slug = file.replace(".mdx", "");
    if (targetSlug && slug !== targetSlug) continue;

    const outputPath = path.join(OUTPUT_DIR, `${slug}.txt`);
    if (!targetSlug && fs.existsSync(outputPath)) continue;

    const content = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);
    const naverPost = generateNaverPost(slug, frontmatter, body);

    fs.writeFileSync(outputPath, naverPost, "utf-8");
    console.log(`✅ ${slug}`);
    generated++;
  }

  if (generated === 0) {
    console.log("새로 생성할 요약이 없습니다. (이미 모두 생성됨)");
  } else {
    console.log(`\n${generated}편 생성 완료 → ${OUTPUT_DIR}`);
  }
}

main();
