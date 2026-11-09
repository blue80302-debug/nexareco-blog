import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: Parameters<typeof intlMiddleware>[0]) {
  const response = intlMiddleware(request);

  if (response.status === 307 && response.headers.get("location")) {
    return NextResponse.redirect(response.headers.get("location")!, 301);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|icon|.*\\..*).*)"],
};
