"""
자동 블로그 포스트 생성기
- Gemini REST API로 한국어 블로그 글 생성 (패키지 설치 불필요)
- data/auto-posts.json에 추가
- GitHub Actions에서 실행: 주 3회 (월/수/금)
"""

import json
import os
import re
import sys
import urllib.request
import urllib.error
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
AUTO_POSTS_FILE = REPO_ROOT / "data" / "auto-posts.json"
USED_TOPICS_FILE = REPO_ROOT / "data" / ".used-topics.json"

CATEGORIES = ["IT 리뷰", "생활정보", "재테크"]

TOPIC_POOL = {
    "IT 리뷰": [
        "스마트폰 배터리 오래 쓰는 실전 팁",
        "무선 이어폰 선택 가이드 2026",
        "노트북 vs 태블릿 어떤게 맞을까",
        "스마트워치 구매 전 꼭 알아야 할 것들",
        "가성비 스마트폰 추천 2026",
        "홈 WiFi 속도 높이는 방법",
        "SSD vs HDD 차이와 선택 기준",
        "4K 모니터 추천 및 구매 가이드",
        "클라우드 스토리지 비교 구글드라이브 원드라이브 iCloud",
        "중고 스마트폰 살 때 주의할 점",
        "갤럭시 탭 vs 아이패드 실사용 비교",
        "AI 번역기 비교 파파고 DeepL ChatGPT",
        "유튜브 프리미엄 가격 대비 가치 분석",
        "넷플릭스 vs 웨이브 vs 티빙 비교",
        "스마트 홈 입문 가이드",
    ],
    "생활정보": [
        "여름 전기요금 아끼는 에어컨 사용법",
        "혼밥족을 위한 식재료 알뜰 쇼핑법",
        "자취방 인터넷 가장 싸게 개통하는 법",
        "중고 거래 사기 예방 완전 정리",
        "무료로 쓸 수 있는 정부 복지 서비스",
        "건강보험료 줄이는 방법",
        "택배 분실 보상 받는 정확한 절차",
        "알뜰폰으로 통신비 절약하기",
        "셀프 인테리어 저렴하게 하는 법",
        "냉장고 정리로 식비 20% 줄이기",
        "주민등록등본 온라인 무료 발급 방법",
        "여름 여행 숙소 저렴하게 예약하는 법",
        "KTX 기차표 할인 받는 방법 총정리",
        "음식 남은 재료 활용해 식비 줄이기",
        "무료 건강검진 대상자 확인하는 법",
    ],
    "재테크": [
        "2026년 적금 금리 비교 총정리",
        "파킹통장으로 이자 최대로 받는 법",
        "청년 정부 지원금 한번에 정리",
        "연말정산 환급액 늘리는 절세 전략",
        "ETF 처음 시작하는 법 증권사 선택부터",
        "월세 vs 전세 지금은 어떤 게 나을까",
        "재테크 초보가 피해야 할 실수 5가지",
        "CMA 통장 제대로 활용하는 방법",
        "소액 투자 시작하기 1만원으로 시작",
        "국민연금 수령액 높이는 전략",
        "청년 주택드림 청약통장 완전 분석",
        "신용카드 포인트 현금화하는 방법",
        "주택청약 1순위 조건 만드는 법",
        "달러 예금으로 환율 수익 내는 방법",
        "개인형 IRP 세금 환급 받는 법",
    ],
}


def load_used_topics() -> set:
    if USED_TOPICS_FILE.exists():
        return set(json.loads(USED_TOPICS_FILE.read_text(encoding="utf-8")))
    return set()


def save_used_topic(topic: str):
    used = load_used_topics()
    used.add(topic)
    USED_TOPICS_FILE.write_text(
        json.dumps(list(used), ensure_ascii=False, indent=2), encoding="utf-8"
    )


def pick_topic(used: set) -> tuple:
    import random
    for category in random.sample(CATEGORIES, len(CATEGORIES)):
        available = [t for t in TOPIC_POOL[category] if t not in used]
        if available:
            return category, random.choice(available)
    category = random.choice(CATEGORIES)
    return category, random.choice(TOPIC_POOL[category])


def call_gemini(api_key: str, prompt: str) -> str:
    models = [
        "gemini-2.0-flash-lite",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
    ]
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 2048}
    }).encode("utf-8")

    last_error = None
    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        req = urllib.request.Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                result = json.loads(resp.read().decode("utf-8"))
                print(f"모델 '{model}' 사용 성공")
                return result["candidates"][0]["content"]["parts"][0]["text"]
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")
            print(f"모델 '{model}' 실패 ({e.code}): {body[:300]}", file=sys.stderr)
            last_error = e

    raise RuntimeError(f"모든 모델 실패. 마지막 에러: {last_error}")


def generate_post(category: str, topic: str) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY 환경변수가 없습니다.", file=sys.stderr)
        sys.exit(1)

    prompt = f"""당신은 한국 블로그 작가입니다. 아래 주제로 블로그 글을 작성해주세요.

카테고리: {category}
주제: {topic}

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요.

{{
  "title": "SEO에 최적화된 제목 (50자 이내)",
  "slug": "영문-소문자-하이픈-slug (예: wifi-speed-tips)",
  "excerpt": "독자를 끌어당기는 요약문 (100자 이내)",
  "readTime": 5,
  "imageKeyword": "picsum.photos seed 용 영문 키워드 1단어",
  "paragraphs": [
    "첫 번째 단락 (150~200자)",
    "두 번째 단락 (150~200자)",
    "세 번째 단락 (150~200자)",
    "네 번째 단락 (150~200자)",
    "다섯 번째 단락 (150~200자)",
    "결론 단락 (100~150자)"
  ]
}}

작성 기준:
- 실용적이고 구체적인 정보 위주
- 광고성 문구 없이 독자에게 도움이 되는 내용
- 자연스러운 한국어 문체
- 단락마다 새로운 정보 포함"""

    text = call_gemini(api_key, prompt)
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```\s*$", "", text)
    return json.loads(text)


def load_auto_posts() -> list:
    if AUTO_POSTS_FILE.exists():
        content = AUTO_POSTS_FILE.read_text(encoding="utf-8").strip()
        if content:
            return json.loads(content)
    return []


def save_auto_posts(posts: list):
    AUTO_POSTS_FILE.write_text(
        json.dumps(posts, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def main():
    used = load_used_topics()
    category, topic = pick_topic(used)
    print(f"주제 선택: [{category}] {topic}")

    print("Gemini API로 글 생성 중...")
    data = generate_post(category, topic)

    existing_posts = load_auto_posts()
    existing_slugs = {p["slug"] for p in existing_posts}

    slug = data.get("slug", f"post-{date.today().isoformat()}")
    if slug in existing_slugs:
        slug = f"{slug}-{date.today().isoformat()}"

    new_post = {
        "slug": slug,
        "title": data["title"],
        "excerpt": data["excerpt"],
        "content": data["paragraphs"],
        "category": category,
        "date": date.today().isoformat(),
        "readTime": int(data.get("readTime", 5)),
        "imageUrl": f"https://picsum.photos/seed/{data.get('imageKeyword', slug)}/800/500",
    }

    existing_posts.insert(0, new_post)
    save_auto_posts(existing_posts)
    save_used_topic(topic)

    print(f"완료! 새 글 추가됨: {new_post['title']}")
    print(f"slug: {new_post['slug']}")
    print(f"총 자동 생성 글: {len(existing_posts)}개")


if __name__ == "__main__":
    main()
