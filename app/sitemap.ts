import type { MetadataRoute } from "next";
import { allDocSlugs } from "@/lib/docs";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const docs = allDocSlugs().map((slug) => {
    const path = slug.length ? `/docs/${slug.join("/")}` : "/docs";
    const depth = slug.length;

    return {
      url: `${site.url}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: depth === 0 ? 0.9 : depth === 1 ? 0.8 : 0.6,
    };
  });

  return [
    {
      url: site.url,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...docs,
  ];
}
