"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import MaskText from "./ui/MaskText";
import Reveal from "./ui/Reveal";
import { img } from "@/lib/images";

// Paralaks görselli çağrı bandı.
export default function CtaBand() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <section ref={ref} className="relative overflow-hidden section-y-lg">
      <motion.div className="absolute -inset-y-[20%] inset-x-0" style={{ y }}>
        <Image src={img.cta.src} alt="" fill sizes="100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-ink/75" aria-hidden="true" />
      <div className="grain absolute inset-0" aria-hidden="true" />

      <div className="container-lux relative text-center">
        <Reveal y={16} className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-gold/60" aria-hidden="true" />
          <span className="eyebrow">Hayalinizdeki Yaşam Alanı</span>
          <span className="h-px w-12 bg-gold/60" aria-hidden="true" />
        </Reveal>
        <MaskText
          lines={["Anahtarını teslim alacağınız", <span key="g" className="gold-text italic">evi birlikte inşa edelim.</span>]}
          className="mx-auto max-w-5xl font-serif text-[clamp(2.3rem,5.6vw,5rem)] leading-[1.04] font-light text-ivory"
        />
        <Reveal delay={0.35} className="mt-12 flex justify-center">
          <Link href="/iletisim" className="btn-lux btn-solid">
            Projenizi Konuşalım
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
