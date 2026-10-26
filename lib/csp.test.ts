import { buildContentSecurityPolicy } from "./csp";

describe("buildContentSecurityPolicy", () => {
  const nonce = "test-nonce-value";

  it("includes the nonce in script-src and style-src", () => {
    const csp = buildContentSecurityPolicy({ nonce, isDev: false });
    expect(csp).toContain(`'nonce-${nonce}'`);
    expect(csp).toMatch(/script-src[^;]*'nonce-test-nonce-value'/);
    expect(csp).toMatch(/style-src[^;]*'nonce-test-nonce-value'/);
  });

  it("omits unsafe-eval and unsafe-inline in production", () => {
    const csp = buildContentSecurityPolicy({ nonce, isDev: false });
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).not.toContain("unsafe-inline");
  });

  it("includes upgrade-insecure-requests in production", () => {
    const csp = buildContentSecurityPolicy({ nonce, isDev: false });
    expect(csp).toContain("upgrade-insecure-requests");
  });

  it("allows un-nonced inline styles and unsafe-eval in development", () => {
    const csp = buildContentSecurityPolicy({ nonce, isDev: true });
    expect(csp).toContain("'unsafe-eval'");
    expect(csp).toMatch(/style-src[^;]*'unsafe-inline'/);
    expect(csp).not.toMatch(/style-src[^;]*'nonce-/);
    expect(csp).toMatch(/script-src[^;]*'nonce-test-nonce-value'/);
  });

  it("omits upgrade-insecure-requests in development", () => {
    const csp = buildContentSecurityPolicy({ nonce, isDev: true });
    expect(csp).not.toContain("upgrade-insecure-requests");
  });

  it("keeps a same-origin baseline", () => {
    const csp = buildContentSecurityPolicy({ nonce, isDev: false });
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("'strict-dynamic'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
  });
});
