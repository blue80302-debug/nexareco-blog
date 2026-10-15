import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import SearchModal from "@/components/SearchModal";
import { posts } from "@/lib/posts";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL("https://nexareco.com"),
  title: {
    default: "NEXARECO — IT 리뷰 · 생활정보 · 재테크",
    template: "%s | NEXARECO",
  },
  description:
    "IT 제품 리뷰, 생활정보, 재테크 입문 콘텐츠를 다루는 실용 블로그입니다.",
  keywords: ["IT 리뷰", "생활정보", "재테크", "ETF 투자", "스마트폰 추천"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "NEXARECO",
    title: "NEXARECO — IT 리뷰 · 생활정보 · 재테크",
    description: "IT 제품 리뷰, 생활정보, 재테크 입문 콘텐츠를 다루는 실용 블로그입니다.",
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXARECO — IT 리뷰 · 생활정보 · 재테크",
    description: "IT 제품 리뷰, 생활정보, 재테크 입문 콘텐츠를 다루는 실용 블로그입니다.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    types: { "application/rss+xml": "/feed.xml" },
  },
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
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Suspense>
          <Header />
          <SearchModal posts={posts} />
        </Suspense>
        <main className="flex-1 pt-16">{children}</main>
        <footer className="border-t border-gray-100 dark:border-gray-800 mt-20">
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm font-bold tracking-widest text-gray-900 dark:text-white">
              NEXARECO
            </span>
            <nav className="flex items-center gap-6 text-xs text-gray-400">
              <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                소개
              </Link>
              <Link href="/contact" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                문의하기
              </Link>
              <Link
                href="/privacy-policy"
                className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                개인정보처리방침
              </Link>
              <Link href="/feed.xml" className="hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                RSS
              </Link>
            </nav>
            <p className="text-xs text-gray-300 dark:text-gray-600">
              © 2026 NEXARECO. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
