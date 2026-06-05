import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * Only the production deployment is indexable. Preview/other environments are
 * fully disallowed so they never compete with the canonical site.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
