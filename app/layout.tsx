import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "NEXARECO — IT 리뷰 · 생활정보 · 재테크",
    template: "%s | NEXARECO",
  },
  description:
    "IT 제품 리뷰, 생활정보, 재테크 입문 콘텐츠를 다루는 실용 블로그입니다.",
  keywords: ["IT 리뷰", "생활정보", "재테크", "ETF 투자", "스마트폰 추천"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <footer className="border-t border-gray-100 mt-20">
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm font-bold tracking-widest text-gray-900">
              NEXARECO
            </span>
            <nav className="flex items-center gap-6 text-xs text-gray-400">
              <Link href="/about" className="hover:text-gray-700 transition-colors">
                소개
              </Link>
              <Link href="/contact" className="hover:text-gray-700 transition-colors">
                문의하기
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-gray-700 transition-colors"
              >
                개인정보처리방침
              </Link>
            </nav>
            <p className="text-xs text-gray-300">
              © 2026 NEXARECO. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
