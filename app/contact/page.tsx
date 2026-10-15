import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "문의하기",
  description: "NEXARECO에 문의사항을 보내주세요.",
};

export default function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">문의하기</h1>
      <p className="text-gray-400 text-sm mb-12">
        글 관련 문의, 협업 제안, 주제 요청 모두 환영합니다.
      </p>

      <div className="bg-gray-50 rounded-2xl p-8">
        <p className="text-sm text-gray-600 mb-2">이메일로 문의하기</p>
        <a
          href="mailto:blue80302@gmail.com"
          className="text-lg font-medium text-gray-900 hover:underline"
        >
          blue80302@gmail.com
        </a>
        <p className="text-xs text-gray-400 mt-4">
          보통 1~2일 내에 답변드립니다.
        </p>
      </div>
    </div>
  );
}
