import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "picsum.photos" },
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "blogger.googleusercontent.com" },
      { hostname: "1.bp.blogspot.com" },
      { hostname: "2.bp.blogspot.com" },
      { hostname: "3.bp.blogspot.com" },
      { hostname: "4.bp.blogspot.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "nexareco.com" },
      { hostname: "www.nexareco.com" },
    ],
  },
};

export default nextConfig;
