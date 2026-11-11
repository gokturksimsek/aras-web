import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import References from "@/components/References";
import CtaBand from "@/components/CtaBand";
import { pages } from "@/lib/site";
import { pageMeta, pageLd } from "@/lib/seo";
import JsonLd from "@/components/ui/JsonLd";
import { img } from "@/lib/images";

export const metadata: Metadata = pageMeta({ title: "Referanslar", description: pages.referanslar.lead, path: "/referanslar" });

export default function ReferanslarPage() {
  const p = pages.referanslar;
  return (
    <main id="icerik">
      <JsonLd data={pageLd({ path: "/referanslar", name: "Referanslar", description: p.lead })} />
      <PageHero crumb={p.crumb} title={p.title} lead={p.lead} image={img.cta} no="04" />
      <References no="01" />
      <CtaBand />
    </main>
  );
}
