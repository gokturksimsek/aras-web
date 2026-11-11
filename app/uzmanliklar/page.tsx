import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Services from "@/components/Services";
import Scope from "@/components/Scope";
import CtaBand from "@/components/CtaBand";
import { pages } from "@/lib/site";
import { pageMeta, pageLd } from "@/lib/seo";
import JsonLd from "@/components/ui/JsonLd";
import { img } from "@/lib/images";

export const metadata: Metadata = pageMeta({ title: "Uzmanlıklarımız", description: pages.uzmanliklar.lead, path: "/uzmanliklar" });

export default function UzmanliklarPage() {
  const p = pages.uzmanliklar;
  return (
    <main id="icerik">
      <JsonLd data={pageLd({ path: "/uzmanliklar", name: "Uzmanlıklarımız", description: p.lead })} />
      <PageHero crumb={p.crumb} title={p.title} lead={p.lead} image={img.turnkey} no="02" />
      <Services no="01" />
      <Scope no="02" />
      <CtaBand />
    </main>
  );
}
