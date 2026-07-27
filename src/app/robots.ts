import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /cart and /checkout are per-visitor, client-rendered and have nothing
      // to index; they are also "use client" pages so they cannot export
      // metadata to noindex themselves.
      disallow: ["/admin", "/api", "/cart", "/checkout"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
