import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Contact from "@/components/Contact";
import { pages } from "@/lib/site";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: "İletişim",
  description: pages.iletisim.lead,
};

export default function IletisimPage() {
  const p = pages.iletisim;
  return (
    <main id="icerik">
      <PageHero crumb={p.crumb} title={p.title} lead={p.lead} image={img.hero[1]} no="05" />
      <Contact no="01" />
    </main>
  );
}
