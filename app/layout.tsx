import type { Metadata, Viewport } from "next";
import { Inter_Tight, Roboto_Slab } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallButton from "@/components/CallButton";
import PageTransition from "@/components/PageTransition";
import { site } from "@/lib/site";
import "./globals.css";

// Yazı tipleri farasinsaat.com ile aynı aile: Helvetica (başlık + metin) ve Roboto Slab (ikincil).
// Helvetica web'e gömülemez (lisans); Apple cihazlarda sistemdeki Helvetica Neue kullanılır,
// diğerlerinde ona en yakın Inter Tight yüklenir (globals.css → --font-sans / --font-serif).
const interTight = Inter_Tight({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
  variable: "--font-roboto-slab",
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
    <html lang="tr" className={`${interTight.variable} ${robotoSlab.variable}`}>
      <body>
        <a
          href="#icerik"
          className="fixed left-4 top-4 z-[200] -translate-y-24 bg-gold px-5 py-3 text-xs font-semibold tracking-[0.2em] text-ink uppercase transition-transform focus:translate-y-0"
        >
          İçeriğe geç
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <Header />
          <PageTransition />
          {children}
          <Footer />
          <CallButton />
        </SmoothScroll>
      </body>
    </html>
  );
}
