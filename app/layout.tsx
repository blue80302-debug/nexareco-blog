import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Header";
import SearchModal from "@/components/SearchModal";
import { posts } from "@/lib/posts";
import Link from "next/link";

const siteDescription =
  "스마트폰 추천, 전기세 절약법, ETF 적립식 투자까지. IT 리뷰·생활정보·재테크를 쉽고 실용적으로 정리하는 NEXARECO 블로그입니다.";

export const metadata: Metadata = {
  metadataBase: new URL("https://nexareco.com"),
  title: {
    default: "NEXARECO 블로그 — IT 리뷰 · 생활정보 · 재테크 실용 가이드",
    template: "%s | NEXARECO 블로그",
  },
  description: siteDescription,
  keywords: ["IT 리뷰", "생활정보", "재테크", "ETF 투자", "스마트폰 추천", "블로그"],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "NEXARECO 블로그",
    title: "NEXARECO 블로그 — IT 리뷰 · 생활정보 · 재테크 실용 가이드",
    description: siteDescription,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "NEXARECO 블로그" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXARECO 블로그 — IT 리뷰 · 생활정보 · 재테크 실용 가이드",
    description: siteDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://nexareco.com",
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
