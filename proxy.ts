import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { buildContentSecurityPolicy } from "./lib/csp";

const handleI18nRouting = createMiddleware(routing);

/**
 * Locale routing (next-intl) plus per-request CSP nonces for Next.js SSR.
 * Do not use this file for browse-page status-code hacks.
 */
export default function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";
  const contentSecurityPolicy = buildContentSecurityPolicy({ nonce, isDev });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);

  const response = handleI18nRouting(
    new NextRequest(request, { headers: requestHeaders })
  );

  response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  return response;
}

export const config = {
  // Match all pathnames except Next internals and static files with a dot.
  matcher: "/((?!_next|_vercel|.*\\..*).*)",
};
