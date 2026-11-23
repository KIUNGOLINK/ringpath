import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/auth/"] },
    sitemap: "https://www.sparringpath.fr/sitemap.xml",
    host: "https://www.sparringpath.fr",
  };
}
