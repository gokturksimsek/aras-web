import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import Tilt from "./ui/Tilt";
import { approach } from "@/lib/site";

// Kurumsal → Yaklaşımımız: dört ilke, perspektif eğimli kartlar.
export default function Approach({ no = "02" }: { no?: string }) {
  return (
    <section className="relative overflow-hidden bg-ink py-[clamp(6rem,12vw,10rem)]">
      <div className="container-lux">
        <SectionHeading
          no={no}
          eyebrow="Yaklaşımımız"
          title={["İşimizi taşıyan", <span key="t" className="gold-text italic">dört ilke.</span>]}
          className="mb-16 lg:mb-20"
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {approach.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.1} className="h-full">
              <Tilt className="h-full" max={6}>
                <article className="group relative flex h-full min-h-[19rem] flex-col justify-between overflow-hidden border border-white/10 bg-gradient-to-b from-graphite/60 to-anthracite p-8 transition-colors duration-700 hover:border-gold/40">
                  <span className="absolute left-0 top-0 h-px w-10 origin-left bg-gold transition-transform duration-700 ease-lux group-hover:scale-x-[3]" aria-hidden="true" />
                  <span className="font-serif text-6xl leading-none font-light text-transparent [-webkit-text-stroke:1px_var(--color-gold-lo)]">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-serif text-[2rem] leading-tight font-light text-ivory">{a.title}</h3>
                    <p className="mt-4 text-[0.95rem] leading-relaxed text-mist/75">{a.text}</p>
                  </div>
                </article>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
