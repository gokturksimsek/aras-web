import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

// Arama motorları ve AI tarayıcıları (GPTBot, ClaudeBot, PerplexityBot, Google-Extended…) için açık;
// yalnızca form uç noktası taranmaz.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: abs("/sitemap.xml"),
  };
}
