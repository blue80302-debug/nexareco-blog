import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nexareco.com"),
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
