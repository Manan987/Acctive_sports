/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

// Content-Security-Policy was missing entirely, so the security headers stopped
// short of the one that actually contains an XSS.
//
// 'unsafe-inline' on script-src is unavoidable here: layout.tsx ships an inline
// theme-flash script and inline application/ld+json, and next/script's GA
// snippet is inline too. 'unsafe-eval' is dev-only (React Refresh needs it).
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://www.google-analytics.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://res.cloudinary.com https://*.public.blob.vercel-storage.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com",
  // The contact page embeds a Google Maps iframe.
  "frame-src https://maps.google.com https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // Modern equivalent of X-Frame-Options; kept alongside it for older browsers.
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Self-contained server output for portable self-hosting (Docker / any VPS).
  output: "standalone",
  images: {
    // Serve modern formats — meaningful on a catalogue this image-heavy.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Cloudinary (product images in production)
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Vercel Blob (alternative image store)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
    // Product images are immutable once uploaded (filenames carry a random
    // suffix), so the optimizer can cache them for a long time.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [
      // The quote system was replaced by the cart. This lived in a page that
      // called redirect(), but the (client) layout is force-dynamic, so Next
      // streamed the response and answered 200 with a client-side redirect
      // instead of a real HTTP redirect — search engines kept /quote indexed
      // and transferred none of its ranking. Handled here it is a true 308.
      { source: "/quote", destination: "/cart", permanent: true },
    ];
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
      { key: "Content-Security-Policy", value: csp },
    ];

    // HSTS instructs the browser to refuse plain HTTP for two years. Sending it
    // from a local dev server can wedge http://localhost in other projects, so
    // only emit it on production builds.
    if (!isDev) {
      securityHeaders.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }

    return [
      { source: "/:path*", headers: securityHeaders },
      // Keep the admin area and APIs out of search engines
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          // API responses are per-request and often authenticated — make sure
          // no shared cache holds on to them.
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;
