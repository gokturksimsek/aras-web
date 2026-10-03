import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import About from "@/components/About";
import Approach from "@/components/Approach";
import Marquee from "@/components/Marquee";
import CtaBand from "@/components/CtaBand";
import { pages } from "@/lib/site";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: "Kurumsal",
  description: pages.kurumsal.lead,
};

export default function KurumsalPage() {
  const p = pages.kurumsal;
  return (
    <main id="icerik">
      <PageHero crumb={p.crumb} title={p.title} lead={p.lead} image={img.aboutMain} no="01" />
      <About no="01" />
      <Approach no="02" />
      <Marquee />
      <CtaBand />
    </main>
  );
}
