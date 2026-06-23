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

      <div className="bg-gray-50 rounded-2xl p-8 mb-8">
        <p className="text-sm text-gray-600 mb-2">이메일로 직접 문의하기</p>
        <a
          href="mailto:blue80302@gmail.com"
          className="text-lg font-medium text-gray-900 hover:underline"
        >
          blue80302@gmail.com
        </a>
      </div>

      <form
        action="https://formspree.io/f/your-form-id"
        method="POST"
        className="space-y-6"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="your@email.com"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            제목
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            placeholder="문의 제목을 입력해주세요"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            내용
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            placeholder="문의 내용을 입력해주세요"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gray-400 transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition-colors"
        >
          보내기
        </button>
      </form>

      <p className="text-xs text-gray-300 mt-6 text-center">
        * 문의 폼을 사용하려면 Formspree(formspree.io) 가입 후 폼 ID를 교체해주세요.
      </p>
    </div>
  );
}
