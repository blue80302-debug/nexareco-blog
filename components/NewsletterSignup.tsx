"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 md:p-12">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        새 글 알림 받기
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        주 3회 발행되는 실용 콘텐츠를 이메일로 받아보세요. 스팸 없이, 언제든 구독 해지 가능합니다.
      </p>
      {status === "success" ? (
        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
          구독 완료! 새 글이 발행되면 이메일로 알려드릴게요.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소"
            className="flex-1 px-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
          />
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
          >
            구독
          </button>
        </form>
      )}
      {status === "error" && (
        <p className="text-sm text-red-500 mt-2">오류가 발생했습니다. 다시 시도해주세요.</p>
      )}
    </section>
  );
}
