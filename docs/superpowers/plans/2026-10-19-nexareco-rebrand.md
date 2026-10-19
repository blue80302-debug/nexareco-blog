# NEXARECO 리브랜딩 기획서 — 다국어 제품 비교 리뷰 블로그

> 작성일: 2026-10-19
> 상태: 초안

---

## 1. 프로젝트 개요

### 1.1 배경
- 기존 nexareco.com은 "IT 리뷰·생활정보·재테크" 블로그로 운영
- 콘텐츠 분량 부족(평균 911자), 스톡 이미지 사용, 이용약관 미비로 **애드센스 승인 탈락**
- 주제 범위가 넓고 브랜드 정체성이 약함

### 1.2 리브랜딩 방향
- **NEXARECO = Next Recommendation**
- "다음에 살 제품, 여기서 비교하세요" — 다국어 제품 비교 리뷰 전문 사이트
- 핵심 가치: 객관적 스펙 비교, 다국어 접근성, 자동화된 콘텐츠 파이프라인

### 1.3 목표
1. 애드센스 승인 획득 (런칭 후 4~5주 내)
2. 제휴 마케팅 수익화 (쿠팡파트너스, Amazon Associates)
3. 월 $150~700 수익 달성 (6개월 내)

---

## 2. 콘텐츠 전략

### 2.1 카테고리 구조

```
NEXARECO
├── AI Tools (AI 도구)
│   ├── A vs B 비교 (예: ChatGPT vs Gemini)
│   ├── 베스트 TOP N (예: 2026 최고의 AI 코딩 도구 5선)
│   └── 구매/구독 가이드
├── Tech & Gadgets (테크 & 가젯)
│   ├── 스마트워치 비교
│   ├── 이어버드/헤드폰 비교
│   └── 스마트폰 비교
└── Software & Services (소프트웨어 & 서비스)
    ├── OTT 구독 비교
    ├── 클라우드 스토리지 비교
    └── 생산성 앱 비교
```

### 2.2 콘텐츠 포맷

#### A vs B 비교 리뷰 (메인 포맷)
```
제목: [제품 A] vs [제품 B]: 어떤 게 더 나을까? (2026)
구조:
  1. 한줄 요약 (승자 + 이유)
  2. 스펙 비교표 (표 형태)
  3. 디자인 & 빌드 비교
  4. 성능 비교
  5. 가격 대비 가치
  6. 결론: 누구에게 어떤 제품이 맞는가
  7. 제휴 링크 (CTA 버튼)
분량: 2,500~3,500자
```

#### 베스트 TOP N 리스트
```
제목: 2026년 최고의 [카테고리] 추천 TOP 5
구조:
  1. 선정 기준 설명
  2. 각 제품: 장점/단점/가격/평점
  3. 비교 요약표
  4. 최종 추천
분량: 3,000~4,000자
```

#### 구매 가이드
```
제목: [제품군] 고르는 법: 구매 전 꼭 알아야 할 N가지
구조:
  1. 핵심 체크리스트
  2. 스펙별 설명 (초보자 친화)
  3. 예산별 추천
  4. FAQ
분량: 2,000~3,000자
```

### 2.3 콘텐츠 품질 기준 (애드센스 승인용)
- 최소 2,000자 이상 (3,000자 권장)
- 제품 공식 이미지 또는 자체 제작 비교 인포그래픽
- 스펙 데이터는 공식 출처 명시
- AI 생성 후 반드시 팩트체크 & 편집
- 중복/유사 주제 글 금지

---

## 3. 다국어 전략

### 3.1 지원 언어

| 코드 | 언어 | 타겟 시장 | 수익화 채널 |
|------|------|-----------|-------------|
| `ko` | 한국어 | 한국 | 쿠팡파트너스, 애드센스 |
| `en` | 영어 | 미국/글로벌 | Amazon Associates (US), 애드센스 |
| `ja` | 일본어 | 일본 | Amazon Associates (JP), 애드센스 |
| `es` | 스페인어 | 중남미/스페인 | Amazon Associates (ES), 애드센스 |

### 3.2 다국어 구현 방식
- **번역이 아닌 현지화**: 각 언어별로 해당 시장에 맞는 제품/가격/구매처 반영
- 예: 한국어 → 쿠팡 가격, 영어 → Amazon US 가격, 일본어 → Amazon JP 가격
- URL 구조: `/ko/blog/chatgpt-vs-gemini`, `/en/blog/chatgpt-vs-gemini`

### 3.3 SEO
- `hreflang` 태그로 언어별 페이지 연결
- 언어별 독립 사이트맵 (`/ko/sitemap.xml`, `/en/sitemap.xml`)
- 언어별 메타 태그 (title, description, og:tags)

---

## 4. 기술 스택

### 4.1 프론트엔드
```
Framework:  Next.js 15 (App Router)
i18n:       next-intl
Styling:    Tailwind CSS 4
TypeScript: strict mode
```

### 4.2 콘텐츠 관리
```
포맷:    MDX (마크다운 + JSX 컴포넌트)
저장소:  /content/{locale}/blog/{slug}.mdx
메타:    frontmatter (title, excerpt, category, date, products, affiliateLinks)
```

### 4.3 인프라
```
호스팅:     AWS EC2 (기존 인스턴스)
CDN:        AWS CloudFront (기존)
도메인:     nexareco.com (가비아)
빌드:       GitHub Actions → EC2 자동 배포
```

### 4.4 자동화
```
콘텐츠 생성:  Google Gemini API (무료 티어)
스케줄러:     GitHub Actions (cron)
이미지:       자체 비교표 컴포넌트 (SSR로 OG 이미지 생성)
```

---

## 5. 파일 구조

```
nexareco/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              # 언어별 레이아웃
│   │   ├── page.tsx                # 홈페이지
│   │   ├── blog/
│   │   │   ├── page.tsx            # 블로그 목록
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # 블로그 상세
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   └── terms/
│   │       └── page.tsx
│   ├── api/
│   │   └── og/
│   │       └── route.tsx           # OG 이미지 생성
│   ├── layout.tsx                  # 루트 레이아웃
│   ├── globals.css
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── Header.tsx                  # 네비게이션 + 언어 전환
│   ├── Footer.tsx                  # 푸터 (법적 페이지 링크)
│   ├── BlogCard.tsx                # 블로그 카드 (목록용)
│   ├── ComparisonTable.tsx         # A vs B 비교표 컴포넌트
│   ├── ProductCard.tsx             # 제품 카드 (제휴 링크 포함)
│   ├── AffiliateButton.tsx         # CTA 버튼 (구매하기)
│   ├── CategoryFilter.tsx          # 카테고리 필터
│   ├── LanguageSwitcher.tsx        # 언어 전환 드롭다운
│   └── AdSense.tsx                 # 애드센스 광고 컴포넌트
├── content/
│   ├── ko/
│   │   └── blog/
│   │       ├── chatgpt-vs-gemini.mdx
│   │       └── ...
│   ├── en/
│   │   └── blog/
│   │       └── ...
│   ├── ja/
│   │   └── blog/
│   │       └── ...
│   └── es/
│       └── blog/
│           └── ...
├── lib/
│   ├── posts.ts                    # MDX 파서 + 포스트 유틸리티
│   ├── affiliates.ts               # 제휴 링크 매핑 (언어별)
│   └── i18n.ts                     # i18n 설정
├── messages/
│   ├── ko.json                     # UI 번역 (한국어)
│   ├── en.json                     # UI 번역 (영어)
│   ├── ja.json                     # UI 번역 (일본어)
│   └── es.json                     # UI 번역 (스페인어)
├── scripts/
│   ├── generate-post.ts            # Gemini API로 글 생성
│   ├── generate-images.ts          # 비교표 이미지 생성
│   └── deploy.sh                   # EC2 배포 스크립트
├── public/
│   ├── images/
│   │   └── products/               # 제품 이미지
│   └── ads.txt                     # 애드센스 ads.txt
├── .github/
│   └── workflows/
│       ├── deploy.yml              # push 시 EC2 배포
│       └── auto-post.yml           # 주 3회 자동 글 생성
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── middleware.ts                    # locale 리다이렉트
```

---

## 6. 인터페이스 정의

### 6.1 Post 타입
```typescript
type Locale = "ko" | "en" | "ja" | "es";
type Category = "ai-tools" | "tech-gadgets" | "software-services";
type ContentFormat = "comparison" | "top-list" | "buying-guide";

interface Post {
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  category: Category;
  format: ContentFormat;
  date: string;           // YYYY-MM-DD
  readTime: number;       // 분
  products: Product[];
  content: string;        // MDX 본문
  coverImage: string;     // OG 이미지 경로
}

interface Product {
  name: string;
  brand: string;
  imageUrl: string;
  specs: Record<string, string>;
  pros: string[];
  cons: string[];
  rating: number;         // 1~10
  affiliateLinks: AffiliateLink[];
}

interface AffiliateLink {
  locale: Locale;
  platform: "coupang" | "amazon-us" | "amazon-jp" | "amazon-es";
  url: string;
  price?: string;
}
```

### 6.2 UI 번역 구조 (messages/ko.json 예시)
```json
{
  "common": {
    "siteName": "NEXARECO",
    "tagline": "다음에 살 제품, 여기서 비교하세요",
    "readMore": "자세히 보기",
    "buyNow": "최저가 확인",
    "minutes": "분"
  },
  "nav": {
    "home": "홈",
    "blog": "리뷰",
    "aiTools": "AI 도구",
    "techGadgets": "테크 & 가젯",
    "software": "소프트웨어",
    "about": "소개",
    "contact": "문의"
  },
  "comparison": {
    "winner": "승자",
    "specs": "스펙 비교",
    "pros": "장점",
    "cons": "단점",
    "verdict": "결론"
  },
  "footer": {
    "about": "소개",
    "contact": "문의하기",
    "privacy": "개인정보처리방침",
    "terms": "이용약관"
  }
}
```

---

## 7. 자동화 파이프라인

### 7.1 글 생성 워크플로우 (GitHub Actions)

```yaml
# .github/workflows/auto-post.yml
# 매주 월/수/금 09:00 KST 실행
schedule:
  - cron: "0 0 * * 1,3,5"  # UTC 00:00 = KST 09:00

steps:
  1. 주제 큐에서 다음 주제 가져오기
  2. Gemini API로 4개 언어 콘텐츠 생성
  3. MDX 파일 생성 → content/{locale}/blog/{slug}.mdx
  4. 제휴 링크 매핑 (언어별 자동 삽입)
  5. GitHub에 commit & push
  6. EC2 자동 배포 트리거
```

### 7.2 주제 큐 (topics-queue.json)
```json
[
  {
    "slug": "chatgpt-vs-gemini",
    "format": "comparison",
    "category": "ai-tools",
    "products": ["ChatGPT Plus", "Google Gemini Advanced"],
    "status": "pending"
  },
  {
    "slug": "best-smartwatch-2026",
    "format": "top-list",
    "category": "tech-gadgets",
    "products": ["Apple Watch Ultra 3", "Galaxy Watch 7", "Pixel Watch 3"],
    "status": "pending"
  }
]
```

### 7.3 Gemini API 프롬프트 전략
```
역할: 당신은 IT 제품을 직접 사용해본 블로거입니다.

톤 & 스타일:
  - 1인칭 경험담 ("직접 써보니", "한 달 사용 후기")
  - 구어체 + 블로그 톤 (딱딱한 설명문 금지)
  - 감탄사, 솔직한 불만, 개인 의견 자연스럽게 포함
  - "솔직히 이건 좀 별로였어요", "이건 진짜 대박이에요" 같은 표현
  - 구체적 사용 상황 묘사 ("카페에서 3시간 작업했는데...")

콘텐츠 규칙:
  - 2,500자 이상 작성
  - 스펙 나열 금지 → 실사용 관점에서 스펙이 왜 중요한지 설명
  - 확실한 호불호 표현 (모든 제품을 칭찬하지 말 것)
  - 결론에서 명확한 추천 ("A 살 바에 차라리 B 사세요")
  - 추천 대상 구분 ("학생이라면 A, 직장인이라면 B")
  - 비교표는 마크다운 표로 작성
  - 제휴 링크 자리에 {{affiliate:product-name}} 플레이스홀더 삽입
  - {locale}에 맞는 현지화 (가격 통화, 구매처, 문화적 맥락)

금지 사항:
  - "~한 특징이 있습니다" 식의 위키피디아 톤
  - 모든 제품에 대해 긍정적으로만 서술
  - 스펙만 복사-붙여넣기
  - "이 글에서는 ~에 대해 알아보겠습니다" 같은 상투적 도입부
```

---

## 8. 수익화 상세

### 8.1 애드센스
- 위치: 글 상단 (비교표 위), 글 중간, 사이드바
- 자동 광고 OFF (수동 배치, UI 깨짐 방지)
- `ads.txt` 파일 루트에 배치

### 8.2 제휴 마케팅

| 플랫폼 | 대상 언어 | 커미션율 | 쿠키 기간 |
|--------|-----------|----------|-----------|
| 쿠팡파트너스 | ko | 3~3% | 24시간 |
| Amazon Associates US | en | 1~10% | 24시간 |
| Amazon Associates JP | ja | 2~10% | 24시간 |
| Amazon Associates ES | es | 1~10% | 24시간 |
| SaaS 직접 제휴 | 전체 | 20~30% | 30~90일 |

### 8.3 제휴 링크 구현
- 모든 외부 링크에 `rel="nofollow sponsored"` 적용
- 글 상단에 "이 글에는 제휴 링크가 포함되어 있습니다" 고지
- 언어별 자동 링크 매핑 (`affiliates.ts`)

---

## 9. 애드센스 승인 체크리스트

| # | 항목 | 상태 |
|---|------|------|
| 1 | 커스텀 도메인 (nexareco.com) | ✅ 보유 |
| 2 | SSL 인증서 (HTTPS) | ✅ CloudFront |
| 3 | 소개(About) 페이지 | 🔲 구현 필요 |
| 4 | 연락처(Contact) 페이지 | 🔲 구현 필요 |
| 5 | 개인정보처리방침 페이지 | 🔲 구현 필요 |
| 6 | 이용약관 페이지 | 🔲 구현 필요 |
| 7 | 양질의 글 15~20개 (2,000자+) | 🔲 작성 필요 |
| 8 | 오리지널/공식 이미지 사용 | 🔲 준비 필요 |
| 9 | ads.txt 파일 | 🔲 구현 필요 |
| 10 | robots.txt + sitemap.xml | 🔲 구현 필요 |
| 11 | 깔끔한 UI/UX | 🔲 구현 필요 |
| 12 | 제휴 링크 고지문 | 🔲 구현 필요 |

---

## 10. 구현 태스크

### Phase 1: 프로젝트 세팅 (1주차)

#### Task 1-1: Next.js 프로젝트 초기화
- Next.js 15 + TypeScript + Tailwind CSS 4 설치
- `next-intl` 설정 (ko, en, ja, es)
- `middleware.ts` locale 리다이렉트
- 파일: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `middleware.ts`, `lib/i18n.ts`
- 검증: `npm run dev` 로 `/ko`, `/en` 접근 확인

#### Task 1-2: 레이아웃 & 공통 컴포넌트
- Header (네비게이션 + LanguageSwitcher)
- Footer (법적 페이지 링크)
- 루트 레이아웃 + 언어별 레이아웃
- 파일: `app/layout.tsx`, `app/[locale]/layout.tsx`, `components/Header.tsx`, `components/Footer.tsx`, `components/LanguageSwitcher.tsx`
- 검증: 언어 전환 시 URL + UI 텍스트 변경 확인

#### Task 1-3: UI 번역 파일
- 4개 언어 messages 파일 작성
- 파일: `messages/ko.json`, `messages/en.json`, `messages/ja.json`, `messages/es.json`
- 검증: 각 언어별 페이지에서 UI 텍스트 올바르게 표시

### Phase 2: 핵심 페이지 (1~2주차)

#### Task 2-1: 홈페이지
- 히어로 섹션 (사이트 소개 + CTA)
- 최신 글 목록 (카테고리별 필터)
- 파일: `app/[locale]/page.tsx`, `components/BlogCard.tsx`, `components/CategoryFilter.tsx`
- 검증: 4개 언어에서 홈페이지 정상 렌더링

#### Task 2-2: 블로그 목록 & 상세 페이지
- MDX 파서 구현 (`lib/posts.ts`)
- 블로그 목록 페이지 (카테고리 필터, 페이지네이션)
- 블로그 상세 페이지 (MDX 렌더링)
- 비교표 컴포넌트 (`ComparisonTable.tsx`)
- 제품 카드 + 제휴 버튼 (`ProductCard.tsx`, `AffiliateButton.tsx`)
- 파일: `app/[locale]/blog/page.tsx`, `app/[locale]/blog/[slug]/page.tsx`, `lib/posts.ts`, `components/ComparisonTable.tsx`, `components/ProductCard.tsx`, `components/AffiliateButton.tsx`
- 검증: 샘플 MDX 파일로 비교 리뷰 렌더링 확인

#### Task 2-3: 법적 페이지 (About, Contact, Privacy, Terms)
- 4개 페이지 × 4개 언어 = 16개 페이지
- 파일: `app/[locale]/about/page.tsx`, `app/[locale]/contact/page.tsx`, `app/[locale]/privacy/page.tsx`, `app/[locale]/terms/page.tsx`
- 검증: 모든 페이지 접근 가능, 푸터 링크 동작

#### Task 2-4: SEO & 메타데이터
- sitemap.ts (언어별 사이트맵)
- robots.ts
- hreflang 태그
- OG 이미지 생성 (`app/api/og/route.tsx`)
- 파일: `app/sitemap.ts`, `app/robots.ts`, `app/api/og/route.tsx`
- 검증: 구글 리치 리절트 테스트 통과

### Phase 3: 콘텐츠 & 자동화 (2~3주차)

#### Task 3-1: 초기 콘텐츠 작성 (15~20개)
- 카테고리별 균형 배분:
  - AI 도구: 5~7개
  - 테크 & 가젯: 5~7개
  - 소프트웨어: 3~5개
- 각 글 2,500자+ × 4개 언어
- 파일: `content/{locale}/blog/*.mdx`
- 검증: 모든 글이 사이트에서 정상 렌더링, 2,000자 이상

#### Task 3-2: 자동화 스크립트
- Gemini API 글 생성 스크립트 (`scripts/generate-post.ts`)
- 주제 큐 관리 (`data/topics-queue.json`)
- 제휴 링크 자동 삽입 (`lib/affiliates.ts`)
- 파일: `scripts/generate-post.ts`, `scripts/generate-images.ts`, `data/topics-queue.json`, `lib/affiliates.ts`
- 검증: 스크립트 실행 → MDX 파일 생성 → 사이트 반영

#### Task 3-3: GitHub Actions 워크플로우
- 자동 글 생성 (주 3회)
- push 시 EC2 배포
- 파일: `.github/workflows/auto-post.yml`, `.github/workflows/deploy.yml`, `scripts/deploy.sh`
- 검증: 수동 트리거로 전체 파이프라인 동작 확인

### Phase 4: 수익화 & 런칭 (4주차)

#### Task 4-1: 애드센스 통합
- 애드센스 스크립트 삽입
- ads.txt 배치
- 광고 컴포넌트 (수동 배치)
- 파일: `components/AdSense.tsx`, `public/ads.txt`
- 검증: 광고 코드가 HTML에 포함되는지 확인

#### Task 4-2: EC2 배포
- 기존 EC2에 새 사이트 배포
- CloudFront 캐시 설정
- 파일: `scripts/deploy.sh`
- 검증: nexareco.com 접속 시 새 사이트 표시

#### Task 4-3: 최종 점검 & 애드센스 신청
- 애드센스 체크리스트 전체 통과 확인
- 모든 페이지 4개 언어 동작 확인
- PageSpeed Insights 점수 확인
- 애드센스 신청
- 검증: 모든 체크리스트 항목 ✅

---

## 11. 운영 비용

| 항목 | 월 비용 |
|------|---------|
| 도메인 (nexareco.com) | 기존 보유 |
| AWS EC2 | 기존 인스턴스 (추가 비용 없음) |
| AWS CloudFront | 기존 설정 (추가 비용 없음) |
| Gemini API | $0 (무료 티어) |
| GitHub Actions | $0 (무료 티어) |
| **합계** | **$0 추가 비용** |

---

## 12. 예상 수익 타임라인

| 시점 | 글 수 | 예상 월 수익 |
|------|-------|--------------|
| 1개월 | 20개 | $0 (애드센스 심사 중) |
| 2개월 | 32개 | $30~80 |
| 3개월 | 44개 | $80~200 |
| 6개월 | 80개 | $150~700 |
| 12개월 | 150개+ | $500~2,000 |

---

## 13. 리스크 & 대응

| 리스크 | 대응 |
|--------|------|
| 애드센스 재탈락 | 콘텐츠 품질 우선, AI 생성물 반드시 편집 |
| Gemini API 무료 한도 변경 | 대안: Groq(Llama) 무료 티어, Claude Code 활용 |
| 제휴 프로그램 거절 | 트래픽 축적 후 재신청, 직접 제휴 협상 |
| 콘텐츠 중복 페널티 | 언어별 현지화 (단순 번역 X), 고유 관점 추가 |
