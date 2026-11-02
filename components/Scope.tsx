"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { hasWebGL } from "./three/webgl";
import { contactHref, disciplineItemCount, disciplines, scope } from "@/lib/site";
import { img } from "@/lib/images";

const BuildCanvas = dynamic(() => import("./three/BuildCanvas"), { ssr: false });

// Anahtar teslim kapsamı: solda (mobilde üstte) sabit 3D sahne, sağda kaydırdıkça
// ilerleyen uygulama alanları. Görünen alan, sahnede o aşamanın inşa edilmesini tetikler.
export default function Scope({ no = "02" }: { no?: string }) {
  const reduce = useReducedMotion() ?? false;
  const [stage, setStage] = useState(0);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const steps = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => setWebgl(hasWebGL()), []);

  // Ekranın ortasından geçen adım = etkin aşama
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setStage(Number((e.target as HTMLElement).dataset.stage));
        });
      },
      { rootMargin: "-50% 0px -49% 0px" },
    );
    steps.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const current = disciplines[stage];

  return (
    <section id="kapsam" className="relative bg-anthracite pt-[clamp(7.5rem,15vw,13.5rem)]">
      <div className="container-lux">
        <div className="mb-14 grid gap-10 lg:mb-20 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            no={no}
            eyebrow={scope.eyebrow}
            title={[scope.title[0], <span key="t" className="gold-text italic">{scope.title[1]}</span>]}
            className="lg:col-span-7"
          />
          <Reveal delay={0.2} className="lg:col-span-5">
            <p className="max-w-md text-[1.02rem] leading-[1.85] text-mist/75 lg:ml-auto">{scope.lead}</p>
            <div className="mt-8 flex gap-10 lg:justify-end">
              <div>
                <p className="font-serif text-5xl leading-none font-light text-ivory">{disciplineItemCount}</p>
                <p className="mt-2 text-[0.62rem] font-semibold tracking-[0.28em] text-stone uppercase">İş Kalemi</p>
              </div>
              <div className="border-l border-white/10 pl-10">
                <p className="font-serif text-5xl leading-none font-light text-ivory">
                  Tek <span className="gold-text italic">elden</span>
                </p>
                <p className="mt-2 text-[0.62rem] font-semibold tracking-[0.28em] text-stone uppercase">Çizimden Anahtara</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative lg:container-lux lg:grid lg:grid-cols-12 lg:gap-12">
        {/* 3D sahne: mobilde üstte, masaüstünde solda sabit */}
        <div className="sticky top-0 z-10 h-[46svh] bg-anthracite lg:col-span-7 lg:h-svh lg:self-start lg:bg-transparent">
          <div className="absolute inset-0 overflow-hidden border-y border-gold/15 lg:top-24 lg:bottom-8 lg:border">
            {webgl ? (
              <BuildCanvas stage={stage} instant={reduce} onLost={() => setWebgl(false)} />
            ) : (
              <Image src={img.turnkey.src} alt={img.turnkey.alt} fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover opacity-70" />
            )}

            {/* HUD: aşama numarası, adı ve ilerleme */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 sm:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[0.6rem] font-semibold tracking-[0.3em] text-stone uppercase">Aşama</p>
                  <p className="font-serif text-4xl leading-none font-light text-ivory sm:text-6xl">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={current.no}
                        className="inline-block"
                        initial={{ y: 18, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -18, opacity: 0 }}
                        transition={{ duration: 0.8, ease: [0.65, 0.05, 0.36, 1] }}
                      >
                        {current.no}
                      </motion.span>
                    </AnimatePresence>
                    <span className="text-xl text-stone sm:text-2xl"> / {String(disciplines.length).padStart(2, "0")}</span>
                  </p>
                </div>
                <p className="max-w-[12rem] text-right font-serif text-lg leading-tight italic text-gold-hi sm:text-2xl">
                  {current.short}
                </p>
              </div>
              <div className="flex gap-1.5">
                {disciplines.map((d, i) => (
                  <span key={d.no} className="relative h-px flex-1 overflow-hidden bg-white/15">
                    <span
                      className={clsx(
                        "absolute inset-0 origin-left bg-gold transition-transform duration-1000 ease-lux",
                        i <= stage ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Aşamalar */}
        <ol className="relative container-lux lg:col-span-5 lg:px-0">
          {disciplines.map((d, i) => (
            <li
              key={d.no}
              ref={(el) => {
                steps.current[i] = el;
              }}
              data-stage={i}
              className="flex min-h-[78svh] items-center border-b border-white/[0.07] py-16 last:border-b-0 lg:min-h-[92svh]"
            >
              <div className={clsx("transition-opacity duration-1000", stage === i ? "opacity-100" : "opacity-35")}>
                <div className="mb-5 flex items-center gap-4">
                  <span className="font-serif text-lg italic text-gold">{d.no}</span>
                  <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
                  <span className="text-[0.62rem] font-semibold tracking-[0.28em] text-stone uppercase">
                    {d.items.length} iş kalemi
                  </span>
                </div>
                <h3 className="font-serif text-[clamp(2rem,3.4vw,3rem)] leading-[1.05] font-light text-ivory">{d.title}</h3>
                <p className="mt-5 max-w-lg text-[0.98rem] leading-[1.8] text-mist/75">{d.lead}</p>
                <ul className="mt-7 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {d.items.map((it) => (
                    <li key={it} className="flex gap-3 text-[0.9rem] leading-snug text-mist/85">
                      <span className="mt-[0.45em] size-1.5 shrink-0 rotate-45 border border-gold" aria-hidden="true" />
                      {it}
                    </li>
                  ))}
                </ul>
                <a
                  href={contactHref(d.title)}
                  className="mt-8 inline-flex min-h-11 items-center gap-2 text-[0.68rem] font-semibold tracking-[0.26em] text-gold uppercase transition-colors hover:text-gold-hi"
                >
                  Bu alan hakkında bilgi alın <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
