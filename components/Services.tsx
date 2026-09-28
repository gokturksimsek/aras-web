"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight, House, KeyRound, PaintRoller, Ruler } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import { selectTopic, services } from "@/lib/site";
import { img } from "@/lib/images";

const icons = { KeyRound, Ruler, House, PaintRoller };

export default function Services() {
  const [active, setActive] = useState(0);

  return (
    <section id="uzmanliklar" className="relative bg-ink py-[clamp(6rem,12vw,10rem)]">
      <div className="container-lux">
        <div className="mb-16 grid gap-10 lg:mb-20 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            no="02"
            eyebrow="Uzmanlıklarımız"
            title={["Her detayda", <span key="t" className="gold-text italic">ustalık.</span>]}
            className="lg:col-span-7"
          />
          <Reveal delay={0.2} className="lg:col-span-5">
            <p className="max-w-md text-[1.02rem] leading-[1.85] text-mist/75 lg:ml-auto">
              Konut ve villa projelerinden anahtar teslim iç mimariye kadar; kaba inşaat sonrasındaki
              tüm ince işçilik ve dekoratif uygulamaları kendi ekibimizle tek elden yürütüyoruz.
            </p>
          </Reveal>
        </div>

        {/* Geniş masaüstü (≥1280): genişleyen paneller */}
        <Reveal className="hidden h-[min(78vh,760px)] gap-3 xl:flex">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            const on = active === i;
            return (
              <article
                key={s.id}
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={clsx(
                  "group relative cursor-default overflow-hidden transition-[flex-grow] duration-[1100ms] ease-lux outline-none focus-visible:ring-1 focus-visible:ring-gold",
                  on ? "grow-[3.2]" : "grow",
                )}
                style={{ flexBasis: 0 }}
              >
                <Image
                  src={img[s.image].src}
                  alt={img[s.image].alt}
                  fill
                  sizes="(min-width:1024px) 55vw, 100vw"
                  className={clsx(
                    "object-cover transition-all duration-[1400ms] ease-lux",
                    on ? "scale-100 grayscale-0" : "scale-110 grayscale-[70%]",
                  )}
                />
                <div
                  className={clsx(
                    "absolute inset-0 transition-colors duration-1000 ease-lux",
                    on ? "bg-gradient-to-t from-ink via-ink/35 to-ink/10" : "bg-ink/65",
                  )}
                  aria-hidden="true"
                />
                {/* Gold çerçeve çizgisi */}
                <span
                  className={clsx(
                    "absolute inset-x-0 top-0 h-px origin-left bg-gold transition-transform duration-1000 ease-lux",
                    on ? "scale-x-100" : "scale-x-0",
                  )}
                  aria-hidden="true"
                />

                <div className="absolute inset-0 flex flex-col justify-between p-7 2xl:p-10">
                  <div className="flex items-start justify-between">
                    <span className="font-serif text-5xl font-light text-ivory/90">{s.no}</span>
                    <span
                      className={clsx(
                        "grid size-12 place-items-center rounded-full border transition-colors duration-700",
                        on ? "border-gold bg-gold text-ink" : "border-white/25 text-gold",
                      )}
                    >
                      <Icon className="size-5" strokeWidth={1.4} aria-hidden="true" />
                    </span>
                  </div>

                  <div>
                    <h3
                      className={clsx(
                        "font-serif font-light text-ivory transition-all duration-1000 ease-lux",
                        on ? "text-[2.6rem] leading-[1.05]" : "text-[1.45rem] leading-tight 2xl:text-[1.7rem]",
                      )}
                    >
                      {s.title}
                    </h3>
                    <div
                      className={clsx(
                        "grid transition-all duration-1000 ease-lux",
                        on ? "mt-5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-md text-[0.95rem] leading-relaxed text-mist/85">{s.text}</p>
                        <a
                          href="#iletisim"
                          onClick={() => selectTopic(s.topic)}
                          className="mt-4 inline-flex min-h-11 items-center gap-2 text-[0.68rem] font-semibold tracking-[0.26em] text-gold uppercase transition-colors hover:text-gold-hi"
                        >
                          Bilgi Alın <ArrowUpRight className="size-4" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </Reveal>

        {/* Mobil / tablet / küçük dizüstü: kartlar */}
        <div className="grid gap-5 md:grid-cols-2 xl:hidden">
          {services.map((s, i) => {
            const Icon = icons[s.icon];
            return (
              <Reveal key={s.id} delay={(i % 2) * 0.1}>
                <article className="group relative flex h-full flex-col overflow-hidden border border-white/10 bg-anthracite">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={img[s.image].src}
                      alt={img[s.image].alt}
                      fill
                      sizes="(min-width:768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1400ms] ease-lux group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-anthracite via-transparent to-transparent" aria-hidden="true" />
                    <span className="absolute left-6 top-5 font-serif text-4xl font-light text-ivory">{s.no}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-7 pt-2">
                    <Icon className="mb-4 size-6 text-gold" strokeWidth={1.4} aria-hidden="true" />
                    <h3 className="font-serif text-[1.9rem] leading-tight font-light text-ivory">{s.title}</h3>
                    <p className="mt-4 text-[0.95rem] leading-relaxed text-mist/75">{s.text}</p>
                    <a
                      href="#iletisim"
                      onClick={() => selectTopic(s.topic)}
                      className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 text-[0.68rem] font-semibold tracking-[0.26em] text-gold uppercase transition-colors hover:text-gold-hi"
                    >
                      Bilgi Alın <ArrowUpRight className="size-4" aria-hidden="true" />
                    </a>
                    <motion.span
                      className="mt-4 block h-px origin-left bg-gold/60"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      aria-hidden="true"
                    />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
