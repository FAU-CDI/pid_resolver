/**
 * Build a Content-Security-Policy value for this app.
 *
 * Same-origin only: no third-party browser scripts, fonts, or analytics.
 * Backend fetches are server-side and do not need connect-src exceptions.
 * Production never includes 'unsafe-eval'; development may, for React/Next debug.
 */

export type BuildCspOptions = {
  nonce: string;
  isDev: boolean;
};

/**
 * @returns A single-line CSP header value with the given nonce.
 */
export function buildContentSecurityPolicy({
  nonce,
  isDev,
}: BuildCspOptions): string {
  const scriptSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    "'strict-dynamic'",
    ...(isDev ? ["'unsafe-eval'"] : []),
  ].join(" ");

  const styleSrc = [
    "'self'",
    `'nonce-${nonce}'`,
    ...(isDev ? ["'unsafe-inline'"] : []),
  ].join(" ");

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    `style-src ${styleSrc}`,
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ];

  return directives.join("; ").trim();
}
