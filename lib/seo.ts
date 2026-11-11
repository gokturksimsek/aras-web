// SEO / GEO yardımcıları: kök URL, sayfa metadata'sı ve JSON-LD şemaları.
// Tüm veriler lib/site.ts'ten gelir; burada uydurma bilgi (puan, yorum, sahte adres) üretilmez.
import type { Metadata } from "next";
import { site, services, disciplines, nav, yearsOfExperience } from "./site";

/**
 * Sitenin kök adresi. Alan adı kesinleşince NEXT_PUBLIC_SITE_URL ile verilir;
 * Vercel'de tanımlı değilse projenin üretim adresi kullanılır, yerelde localhost.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

export const abs = (path = "/") => `${siteUrl}${path === "/" ? "" : path}`;

export const defaultTitle = `${site.name} | Ankara Villa, Konut ve Anahtar Teslim İç Mimari`;

/** Telefonu uluslararası biçime çevirir: "0532 630 46 77" → "+90 532 630 46 77" */
export const phoneIntl = `+90 ${site.phone.replace(/^0/, "")}`;

/** Paylaşım görseli (app/opengraph-image.tsx). Alt sayfalar kendi openGraph'ını tanımlayınca
 *  dosya tabanlı görsel miras kalmadığı için açıkça eklenir. */
export const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name} — ${site.slogan}. 1994'ten bu yana Ankara'da villa, konut ve anahtar teslim iç mimari.`,
};

const baseOpenGraph = {
  images: [ogImage],
  siteName: site.name,
  locale: "tr_TR",
  type: "website" as const,
};

/** Alt sayfa metadata'sı: başlık, açıklama, canonical, Open Graph ve Twitter kartı. */
export function pageMeta({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  const full = title ? `${title} | ${site.name}` : defaultTitle;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { ...baseOpenGraph, title: full, description, url: path },
    twitter: { card: "summary_large_image", title: full, description, images: [ogImage.url] },
  };
}

// ── JSON-LD ──────────────────────────────────────────────────────────────

const orgId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

/** Ankara'nın Wikidata varlığı (Q3640): AI motorlarının yeri doğru eşlemesi için. */
const ankara = { "@type": "City", name: site.city, sameAs: "https://www.wikidata.org/wiki/Q3640" };

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HomeAndConstructionBusiness",
        "@id": orgId,
        name: site.name,
        alternateName: ["ARAS İnşaat", "Aras İnşaat Ankara"],
        url: abs("/"),
        logo: { "@type": "ImageObject", url: abs("/img/aras-logo.png"), width: 795, height: 873 },
        image: abs("/opengraph-image"),
        description: site.description,
        slogan: site.slogan,
        founder: { "@type": "Person", name: site.founder },
        foundingDate: String(site.founded),
        foundingLocation: ankara,
        areaServed: ankara,
        // Açık adres henüz yok: yalnızca şehir ve ülke (sahte sokak/koordinat yazılmaz).
        address: {
          "@type": "PostalAddress",
          ...(site.address ? { streetAddress: site.address } : {}),
          addressLocality: site.city,
          addressCountry: "TR",
        },
        telephone: phoneIntl,
        email: site.email,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: phoneIntl,
          email: site.email,
          contactType: "customer service",
          areaServed: "TR",
          availableLanguage: ["Turkish"],
        },
        sameAs: [site.instagram.url],
        knowsAbout: [
          ...services.map((s) => s.title),
          ...disciplines.map((d) => d.title),
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Uzmanlıklarımız",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              description: s.text,
              areaServed: ankara,
              provider: { "@id": orgId },
              url: abs("/uzmanliklar"),
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: abs("/"),
        name: site.name,
        description: site.description,
        inLanguage: "tr-TR",
        publisher: { "@id": orgId },
      },
    ],
  };
}

/** Alt sayfa için BreadcrumbList + WebPage. */
export function pageLd({ path, name, description }: { path: string; name: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${abs(path)}#webpage`,
        url: abs(path),
        name: `${name} | ${site.name}`,
        description,
        inLanguage: "tr-TR",
        isPartOf: { "@id": websiteId },
        about: { "@id": orgId },
        breadcrumb: { "@id": `${abs(path)}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${abs(path)}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Anasayfa", item: abs("/") },
          { "@type": "ListItem", position: 2, name, item: abs(path) },
        ],
      },
    ],
  };
}

/** /llms.txt: AI tarayıcıları için sitenin düz Markdown özeti (yalnızca lib/site.ts verisi). */
export function llmsTxt() {
  const pageLines = nav
    .filter((n) => n.href !== "/")
    .map((n) => `- [${n.label}](${abs(n.href)})`)
    .join("\n");
  const serviceLines = services.map((s) => `- **${s.title}:** ${s.text}`).join("\n");
  const scopeLines = disciplines
    .map((d) => `### ${d.no}. ${d.title}\n${d.lead}\n${d.items.map((i) => `- ${i}`).join("\n")}`)
    .join("\n\n");

  return `# ${site.name}

> ${site.description}

## Künye
- Firma: ${site.name}
- Slogan: ${site.slogan}
- Kurucu: ${site.founder}
- Kuruluş: ${site.founded} (${yearsOfExperience()} yıllık tecrübe)
- Hizmet bölgesi: ${site.region}
- Telefon: ${phoneIntl}
- E-posta: ${site.email}
- Instagram: ${site.instagram.url}

## Sayfalar
- [Anasayfa](${abs("/")})
${pageLines}

## Uzmanlıklar
${serviceLines}

## Anahtar teslim iş kapsamı
Kaba inşaat sonrasındaki tüm ince işçilik ve dekoratif uygulamalar firmanın kendi profesyonel ekibi tarafından yapılır.

${scopeLines}
`;
}
