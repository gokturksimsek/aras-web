import { llmsTxt } from "@/lib/seo";

// /llms.txt — AI tarayıcıları (ChatGPT, Claude, Perplexity, Gemini) için sitenin Markdown özeti.
// İçerik lib/site.ts'ten üretilir; build sırasında statik olarak oluşturulur.
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
