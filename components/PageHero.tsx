"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useRef } from "react";
import MaskText from "./ui/MaskText";

const ease = [0.22, 1, 0.36, 1] as const;

// Alt sayfa başlık bandı (OBES'teki .pagehero gibi): breadcrumb + başlık + kısa açıklama.
export default function PageHero({
  crumb,
  title,
  lead,
  image,
  no,
}: {
  crumb: string;
  title: readonly [string, string];
  lead: string;
  image?: { src: string; alt: string };
  /** Sağ altta silik büyük numara (sayfa sırası) */
  no?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[64svh] items-end overflow-hidden bg-ink pt-40 pb-16 sm:min-h-[70svh] sm:pb-20">
      {image && (
        <motion.div className="absolute inset-0" style={{ y }}>
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.4, ease }}
          >
            <Image src={image.src} alt="" fill preload sizes="100vw" className="object-cover opacity-45" />
          </motion.div>
        </motion.div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 to-transparent" aria-hidden="true" />
      <div className="grain absolute inset-0" aria-hidden="true" />

      {/* Mimari ızgara çizgileri */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        <div className="container-lux relative h-full">
          {[25, 50, 75].map((l) => (
            <span key={l} className="absolute top-0 h-full w-px bg-white/[0.05]" style={{ left: `${l}%` }} />
          ))}
        </div>
      </div>

      {no && (
        <span
          className="pointer-events-none absolute -right-[2vw] bottom-[-4vw] select-none font-serif text-[30vw] leading-none font-light text-transparent [-webkit-text-stroke:1px_rgb(211_169_113/0.12)] lg:text-[22vw]"
          aria-hidden="true"
        >
          {no}
        </span>
      )}

      <motion.div className="container-lux relative w-full" style={{ opacity: fade }}>
        <motion.nav
          aria-label="Konum"
          className="mb-8 flex items-center gap-3 text-[0.66rem] font-semibold tracking-[0.28em] uppercase"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease }}
        >
          <Link href="/" className="inline-flex min-h-11 items-center text-stone transition-colors hover:text-gold">
            Anasayfa
          </Link>
          <ChevronRight className="size-3.5 text-gold/70" aria-hidden="true" />
          <span className="text-gold" aria-current="page">
            {crumb}
          </span>
        </motion.nav>

        <MaskText
          as="h1"
          inView={false}
          delay={0.25}
          lines={[title[0], <span key="g" className="gold-text italic">{title[1]}</span>]}
          className="max-w-5xl font-serif text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.98] font-light tracking-[-0.015em] text-ivory"
        />

        <motion.div
          className="mt-8 flex max-w-2xl items-start gap-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease }}
        >
          <span className="mt-3 h-px w-12 shrink-0 bg-gold" aria-hidden="true" />
          <p className="text-[1.02rem] leading-[1.8] text-mist/80">{lead}</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
