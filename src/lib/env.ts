// Fail fast on misconfiguration — but only at RUNTIME, never during the build
// (Next.js imports route modules at build time; throwing there breaks the build).
const isProd = process.env.NODE_ENV === "production";
const isBuild = process.env.NEXT_PHASE === "phase-production-build";

const INSECURE_DEFAULTS = new Set([
  "dev-secret-change-me-in-production-0192837465",
  "change-me-to-a-long-random-string-please",
  "dev-secret-change-me",
]);

function resolveAuthSecret(): string {
  const v = process.env.AUTH_SECRET;
  if (!v) {
    if (isProd && !isBuild) {
      throw new Error(
        "[env] AUTH_SECRET is required in production. Set it in your hosting environment variables."
      );
    }
    return "dev-secret-change-me";
  }
  if (isProd && !isBuild && INSECURE_DEFAULTS.has(v)) {
    console.warn(
      "[env] AUTH_SECRET is still an example value — set a unique random secret in production."
    );
  }
  return v;
}

export const env = {
  get authSecret() {
    return resolveAuthSecret();
  },
  get databaseUrl() {
    return process.env.DATABASE_URL || "";
  },
  isProd,
};
