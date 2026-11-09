import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  if (
    host === "nexareco.com" &&
    process.env.NODE_ENV === "production"
  ) {
    const url = request.nextUrl.clone();
    url.host = "www.nexareco.com";
    return NextResponse.redirect(url, 301);
  }

  const response = intlMiddleware(request);

  if (response.status === 307 && response.headers.get("location")) {
    return NextResponse.redirect(response.headers.get("location")!, 301);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|icon|.*\\..*).*)"],
};
