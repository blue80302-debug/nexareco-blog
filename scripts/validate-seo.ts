import * as fs from "node:fs";
import * as path from "node:path";

const EXPECTED_DOMAIN = "https://www.nexareco.com";
const LOCALES = ["ko", "en", "ja", "es"];
const BUILD_DIR = path.resolve(import.meta.dirname ?? __dirname, "..", ".next");

let errors = 0;

function fail(msg: string) {
  console.error(`  ✗ ${msg}`);
  errors++;
}

function pass(msg: string) {
  console.log(`  ✓ ${msg}`);
}

// 1. 소스 파일에서 잘못된 도메인 하드코딩 검사
function checkSourceUrls() {
  console.log("\n[1] 소스 파일 도메인 검사");
  const srcDirs = ["app", "lib", "components", "scripts"];
  const badPattern = /["'`]https:\/\/nexareco\.com[/"'`]/g;
  const wwwPattern = /https:\/\/www\.nexareco\.com/;

  for (const dir of srcDirs) {
    const dirPath = path.resolve(import.meta.dirname ?? __dirname, "..", dir);
    if (!fs.existsSync(dirPath)) continue;
    walkFiles(dirPath, (filePath) => {
      if (!/\.(ts|tsx|js|jsx)$/.test(filePath)) return;
      if (filePath.includes("validate-seo")) return;
      const content = fs.readFileSync(filePath, "utf-8");
      const matches = content.match(badPattern);
      if (matches) {
        const rel = path.relative(path.resolve(import.meta.dirname ?? __dirname, ".."), filePath);
        fail(`${rel}: "https://nexareco.com" 발견 (${matches.length}건) → www 필요`);
      }
    });
  }

  if (errors === 0) pass("모든 소스 파일에서 도메인 일관성 확인");
}

// 2. sitemap.xml 검증
function checkSitemap() {
  console.log("\n[2] Sitemap 검증");
  const sitemapPaths = [
    path.join(BUILD_DIR, "server", "app", "sitemap.xml.meta"),
    path.join(BUILD_DIR, "server", "app", "sitemap.xml.body"),
  ];

  // .next가 없으면 빌드 전 상태 — 소스에서만 검증
  const sitemapSrc = path.resolve(import.meta.dirname ?? __dirname, "..", "app", "sitemap.ts");
  if (fs.existsSync(sitemapSrc)) {
    const content = fs.readFileSync(sitemapSrc, "utf-8");
    if (!content.includes(EXPECTED_DOMAIN)) {
      fail("app/sitemap.ts: BASE_URL이 " + EXPECTED_DOMAIN + "이 아님");
    } else {
      pass("app/sitemap.ts: BASE_URL 정상");
    }
  }
}

// 3. robots.txt 검증
function checkRobots() {
  console.log("\n[3] robots.txt 검증");
  const robotsSrc = path.resolve(import.meta.dirname ?? __dirname, "..", "app", "robots.ts");
  if (fs.existsSync(robotsSrc)) {
    const content = fs.readFileSync(robotsSrc, "utf-8");
    if (content.includes("nexareco.com") && !content.includes("www.nexareco.com")) {
      fail("app/robots.ts: www 없는 도메인 사용");
    } else {
      pass("app/robots.ts: 도메인 정상");
    }
  }
}

// 4. SEO 유틸 (lib/seo.ts) 검증
function checkSeoLib() {
  console.log("\n[4] lib/seo.ts 검증");
  const seoSrc = path.resolve(import.meta.dirname ?? __dirname, "..", "lib", "seo.ts");
  if (fs.existsSync(seoSrc)) {
    const content = fs.readFileSync(seoSrc, "utf-8");
    const baseUrlMatch = content.match(/BASE_URL\s*=\s*"([^"]+)"/);
    if (baseUrlMatch) {
      if (baseUrlMatch[1] !== EXPECTED_DOMAIN) {
        fail(`BASE_URL = "${baseUrlMatch[1]}" → "${EXPECTED_DOMAIN}" 이어야 함`);
      } else {
        pass("BASE_URL 정상");
      }
    }

    if (!content.includes("canonical")) {
      fail("canonical 설정 누락");
    } else {
      pass("canonical 설정 존재");
    }

    const hasLanguages = content.includes("languages");
    if (!hasLanguages) {
      fail("hreflang(languages) 설정 누락");
    } else {
      pass("hreflang 설정 존재");
    }
  }
}

// 5. 콘텐츠 파일 검증 — 모든 locale에 slug가 존재하는지
function checkContentConsistency() {
  console.log("\n[5] 다국어 콘텐츠 일관성 검사");
  const contentDir = path.resolve(import.meta.dirname ?? __dirname, "..", "content");
  if (!fs.existsSync(contentDir)) {
    pass("content 디렉토리 없음 (스킵)");
    return;
  }

  const slugsByLocale: Record<string, Set<string>> = {};
  for (const locale of LOCALES) {
    const blogDir = path.join(contentDir, locale, "blog");
    if (!fs.existsSync(blogDir)) {
      slugsByLocale[locale] = new Set();
      continue;
    }
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
    slugsByLocale[locale] = new Set(files.map((f) => f.replace(/\.mdx$/, "")));
  }

  const allSlugs = new Set<string>();
  for (const set of Object.values(slugsByLocale)) {
    for (const slug of set) allSlugs.add(slug);
  }

  let missingCount = 0;
  for (const slug of allSlugs) {
    const missing = LOCALES.filter((l) => !slugsByLocale[l].has(slug));
    if (missing.length > 0 && missing.length < LOCALES.length) {
      missingCount++;
      if (missingCount <= 5) {
        console.warn(`  ⚠ ${slug}: ${missing.join(", ")} 누락`);
      }
    }
  }
  if (missingCount > 5) {
    console.warn(`  ... 외 ${missingCount - 5}건`);
  }
  if (missingCount === 0) {
    pass(`${allSlugs.size}개 slug 모두 ${LOCALES.length}개 언어 존재`);
  } else {
    console.warn(`  ⚠ ${missingCount}개 slug 다국어 누락 (경고)`);
  }
}

// 6. metadataBase 검증
function checkMetadataBase() {
  console.log("\n[6] metadataBase 검증");
  const layoutSrc = path.resolve(import.meta.dirname ?? __dirname, "..", "app", "layout.tsx");
  if (fs.existsSync(layoutSrc)) {
    const content = fs.readFileSync(layoutSrc, "utf-8");
    const match = content.match(/metadataBase:\s*new\s+URL\("([^"]+)"\)/);
    if (match) {
      if (match[1] !== EXPECTED_DOMAIN) {
        fail(`metadataBase = "${match[1]}" → "${EXPECTED_DOMAIN}" 이어야 함`);
      } else {
        pass("metadataBase 정상");
      }
    }
  }
}

function walkFiles(dir: string, callback: (filePath: string) => void) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".next") {
      walkFiles(fullPath, callback);
    } else if (entry.isFile()) {
      callback(fullPath);
    }
  }
}

console.log("=== nexareco SEO 검증 ===");

checkSourceUrls();
checkSitemap();
checkRobots();
checkSeoLib();
checkContentConsistency();
checkMetadataBase();

console.log(`\n=== 결과: ${errors === 0 ? "✓ 통과" : `✗ ${errors}건 실패`} ===\n`);
process.exit(errors > 0 ? 1 : 0);
