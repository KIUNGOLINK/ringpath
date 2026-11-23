import type { MetadataRoute } from "next";

const BASE = "https://www.sparringpath.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/app/spar/find`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/minuteur`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];
}
