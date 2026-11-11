import type { MetadataRoute } from "next";
import { nav } from "@/lib/site";
import { abs } from "@/lib/seo";

// Site haritası: menüdeki tüm sayfalar + KVKK. Yeni sayfa eklenince nav'a eklemek yeterli.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    ...nav.map((n) => ({
      url: abs(n.href),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: n.href === "/" ? 1 : 0.8,
    })),
    { url: abs("/kvkk"), lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
  ];
}
