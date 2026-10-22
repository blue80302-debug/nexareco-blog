import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:slug*.html",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/post/:id*",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/:year(\\d{4})/:month(\\d{2})/:slug*.html",
        has: [{ type: "query", key: "m" }],
        destination: "/blog",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
