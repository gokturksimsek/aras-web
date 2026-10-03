import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import References from "@/components/References";
import CtaBand from "@/components/CtaBand";
import { pages } from "@/lib/site";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: "Referanslar",
  description: pages.referanslar.lead,
};

export default function ReferanslarPage() {
  const p = pages.referanslar;
  return (
    <main id="icerik">
      <PageHero crumb={p.crumb} title={p.title} lead={p.lead} image={img.cta} no="04" />
      <References no="01" />
      <CtaBand />
    </main>
  );
}
