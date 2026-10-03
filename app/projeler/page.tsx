import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Projects from "@/components/Projects";
import CtaBand from "@/components/CtaBand";
import { pages } from "@/lib/site";
import { projects } from "@/lib/images";

export const metadata: Metadata = {
  title: "Projelerimiz",
  description: pages.projeler.lead,
};

export default function ProjelerPage() {
  const p = pages.projeler;
  return (
    <main id="icerik">
      <PageHero crumb={p.crumb} title={p.title} lead={p.lead} image={projects[0]} no="03" />
      <Projects no="01" />
      <CtaBand />
    </main>
  );
}
