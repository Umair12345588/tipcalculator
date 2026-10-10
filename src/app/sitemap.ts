import type { MetadataRoute } from "next";

const siteUrl = "https://tipcalculator-mocha.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-10-10"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
