import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ARAS İNŞAAT | 1994'ten Bugüne İhtişamlı Yaşam Alanları",
    template: "%s | ARAS İNŞAAT",
  },
  description: site.description,
  keywords: [
    "ARAS İnşaat",
    "Ankara inşaat",
    "villa projeleri Ankara",
    "anahtar teslim iç mimari",
    "ince işçilik",
    "dekorasyon Ankara",
  ],
  openGraph: {
    title: "ARAS İNŞAAT",
    description: site.description,
    locale: "tr_TR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0f",
  // Çentikli iPhone'larda env(safe-area-inset-*) değerlerinin çalışması için.
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: site.name,
  founder: { "@type": "Person", name: site.founder },
  foundingDate: String(site.founded),
  areaServed: { "@type": "City", name: site.city },
  address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "TR" },
  telephone: "+90 532 630 46 77",
  email: site.email,
  sameAs: [site.instagram.url],
  slogan: site.slogan,
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${cormorant.variable} ${manrope.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
