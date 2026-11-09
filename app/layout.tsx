import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nexareco.com"),
  title: {
    default: "NEXARECO",
    template: "%s | NEXARECO",
  },
  description: "NEXARECO - Compare and discover the best products",
  alternates: {
    languages: {
      ko: "/ko",
      en: "/en",
      ja: "/ja",
      es: "/es",
    },
  },
  openGraph: {
    type: "website",
    siteName: "NEXARECO",
  },
  verification: {
    other: {
      "naver-site-verification": "ed17f4ce5fec93d3ccd6d3426daa6dd4474cac82",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
