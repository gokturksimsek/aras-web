"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { Quote } from "lucide-react";
import { useRef } from "react";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import Counter from "./ui/Counter";
import { about, site, yearsOfExperience } from "@/lib/site";
import { img } from "@/lib/images";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mainY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const sideY = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);

  const facts = [
    { value: <Counter to={yearsOfExperience()} />, suffix: "+", label: "Yıllık Tecrübe" },
    { value: site.founded, label: "Kuruluş Yılı" },
    { value: "A–Z", label: "Anahtar Teslim" },
    { value: "Ankara", label: "Hizmet Bölgesi" },
  ];

  return (
    <section id="kurumsal" ref={ref} className="relative overflow-hidden bg-anthracite py-[clamp(6rem,12vw,10rem)]">
      <div className="container-lux grid gap-16 lg:grid-cols-12 lg:gap-12">
        {/* Görsel kompozisyonu */}
        <div className="relative lg:col-span-6">
          <Reveal className="relative aspect-[4/5] overflow-hidden sm:mr-[18%]">
            <motion.div className="absolute -inset-y-[10%] inset-x-0" style={{ y: mainY }}>
              <Image src={img.aboutMain.src} alt={img.aboutMain.alt} fill sizes="(min-width:1024px) 40vw, 90vw" className="object-cover grayscale-[35%]" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" aria-hidden="true" />
          </Reveal>

          <motion.div
            style={{ y: sideY }}
            className="absolute -bottom-10 right-0 hidden aspect-[3/4] w-[42%] overflow-hidden border-[10px] border-anthracite sm:block"
          >
            <Image src={img.aboutSide.src} alt={img.aboutSide.alt} fill sizes="20vw" className="object-cover" />
          </motion.div>

          {/* Kuruluş rozeti */}
          <Reveal delay={0.3} className="absolute left-5 top-5 sm:-left-6 sm:top-10">
            <div className="grid size-32 place-items-center rounded-full border border-gold/50 bg-ink/80 text-center backdrop-blur-md sm:size-36">
              <div>
                <p lang="en" className="eyebrow !text-[0.55rem]">Since</p>
                <p className="font-serif text-4xl font-light text-gold-hi">{site.founded}</p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Metin */}
        <div className="lg:col-span-6 lg:pl-8">
          <SectionHeading
            no="01"
            eyebrow={about.eyebrow}
            title={[about.title[0], <span key="t" className="gold-text italic">{about.title[1]}</span>]}
          />

          <div className="mt-10 space-y-6 text-[1.02rem] leading-[1.85] text-mist/80">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          {/* Kurucu alıntısı */}
          <Reveal delay={0.15} className="relative mt-12 border-l border-gold/50 pl-8">
            <Quote className="absolute -left-3 -top-1 size-6 bg-anthracite text-gold" aria-hidden="true" />
            <p className="font-serif text-2xl leading-snug font-light text-ivory sm:text-[1.7rem]">
              {about.founderText} <em className="gold-text">{about.founderMotto}</em>
            </p>
            <div className="mt-6 flex items-center gap-4">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              <p>
                <span className="font-serif text-xl text-gold-hi">{site.founder}</span>
                <span className="ml-3 text-[0.65rem] font-semibold tracking-[0.3em] text-stone uppercase">
                  {about.founderNote}
                </span>
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Künye şeridi */}
      <div className="container-lux mt-24 lg:mt-32">
        <div className="grid grid-cols-2 border-t border-white/10 lg:grid-cols-4">
          {facts.map((f, i) => (
            <Reveal
              key={f.label}
              delay={i * 0.08}
              className="border-b border-white/10 py-9 odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 lg:px-8 lg:first:pl-0"
            >
              <p className="font-serif text-[clamp(2.6rem,5vw,4rem)] leading-none font-light text-ivory max-lg:px-4">
                {f.value}
                {f.suffix && <span className="text-gold">{f.suffix}</span>}
              </p>
              <p className="mt-3 text-[0.66rem] font-semibold tracking-[0.28em] text-stone uppercase max-lg:px-4">
                {f.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
