import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "소개",
  description: "NEXARECO 블로그 소개 페이지입니다.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">소개</h1>
      <div className="space-y-5 text-base leading-8 text-gray-600">
        <p>
          안녕하세요, <strong className="text-gray-900">NEXARECO</strong>입니다.
        </p>
        <p>
          이 블로그는 IT 제품 리뷰, 생활 속 유용한 정보, 그리고 재테크 입문 콘텐츠를
          다룹니다. 광고성 콘텐츠 없이 실제 사용 경험과 데이터를 바탕으로 솔직하게
          작성합니다.
        </p>
        <p>
          복잡한 정보를 읽기 쉽게 정리해 드리는 것이 목표입니다. 스마트폰 선택부터
          ETF 투자 첫 걸음, 생활비 절약까지 — 실생활에 바로 써먹을 수 있는 글을
          만들겠습니다.
        </p>
        <p>
          궁금한 점이나 다뤄줬으면 하는 주제가 있다면{" "}
          <a href="/contact" className="text-gray-900 underline underline-offset-4 hover:no-underline">
            문의하기
          </a>
          를 통해 알려주세요.
        </p>
      </div>
    </div>
  );
}
