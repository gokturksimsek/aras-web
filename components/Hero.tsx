"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Move3d } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MaskText from "./ui/MaskText";
import { hasWebGL } from "./three/webgl";
import { hero } from "@/lib/site";
import { img } from "@/lib/images";

// 3D maket yalnızca tarayıcıda yüklenir; o sırada ve WebGL yoksa fotoğraf görünür.
const HeroCanvas = dynamic(() => import("./three/HeroCanvas"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [webgl, setWebgl] = useState<boolean | null>(null);

  useEffect(() => setWebgl(hasWebGL()), []);

  // Kaydırma: kamera yörüngesi (3D) + içerik soluklaşması
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // İçerik hafifçe yukarı kayarak söner (aşağı kayıp alt çubuğa binmez)
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const fallbackY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section
      id="anasayfa"
      ref={ref}
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink short:h-auto short:min-h-[100svh]"
      aria-label="Giriş"
    >
      {/* Yedek görsel: 3D yüklenirken ve WebGL olmayan cihazlarda */}
      {webgl !== true && (
        <motion.div className="absolute inset-0" style={{ y: fallbackY }}>
          <Image src={img.hero[0].src} alt={img.hero[0].alt} fill preload quality={85} sizes="100vw" className="object-cover" />
        </motion.div>
      )}

      {/* 3D villa maketi */}
      {webgl && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6, ease }}
        >
          <HeroCanvas ready={ready} instant={reduce} scroll={scrollYProgress} onLost={() => setWebgl(false)} />
        </motion.div>
      )}

      {/* Okunurluk katmanları: soldan koyu geçiş + alt-üst vinyet */}
      <div
        className={
          webgl
            ? "pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-transparent max-md:bg-gradient-to-t max-md:from-ink max-md:from-28% max-md:via-ink/45 max-md:via-46% max-md:to-transparent max-md:to-62%"
            : "pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/10"
        }
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40 max-md:to-transparent" aria-hidden="true" />
      <div className="grain pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Mimari ızgara çizgileri */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        <div className="container-lux relative h-full">
          {[25, 50, 75].map((l) => (
            <span key={l} className="absolute top-0 h-full w-px bg-white/[0.04]" style={{ left: `${l}%` }} />
          ))}
        </div>
      </div>

      <motion.div
        className="pointer-events-none container-lux relative flex h-full flex-col justify-end pb-[max(7rem,14vh)] md:justify-center md:pb-0 short:pb-32"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="pointer-events-auto max-w-4xl pt-28">
          <MaskText
            as="h1"
            inView={false}
            play={ready}
            delay={0.2}
            lines={hero.titleLines}
            lineClassName={(i) => (i === 1 ? "gold-text italic pl-[0.6em] sm:pl-[1.2em]" : undefined)}
            className="font-serif text-[clamp(2.7rem,6.2vw,6.1rem)] font-light leading-[1.02] tracking-[-0.012em] text-ivory [text-shadow:0_2px_40px_rgb(13_13_15/0.6)] short:text-[3rem]"
          />

          <motion.div
            className="mt-10 flex flex-col gap-8"
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.8, ease }}
          >
            <p className="max-w-md text-[0.98rem] leading-relaxed text-mist/85">{hero.text}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/projeler" className="btn-lux btn-solid">
                Projelerimiz
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href="/iletisim" className="btn-lux bg-ink/30 backdrop-blur-sm">
                Bize Ulaşın
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Alt bar: 3D ipucu + kaydırma işareti (içerikle birlikte söner) */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{ opacity: contentOpacity }}
      >
        <motion.div
          className="container-lux flex items-end justify-end gap-12 pb-8 text-[0.62rem] font-semibold tracking-[0.3em] text-mist/60 uppercase"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.4 }}
        >
          {webgl && !reduce && (
            <span className="hidden items-center gap-2 lg:flex">
              <Move3d className="size-4 text-gold" aria-hidden="true" />
              Sürükleyerek 360° çevirin
            </span>
          )}
          <a
            href="#manifesto"
            className="pointer-events-auto hidden items-center gap-4 transition-colors hover:text-gold md:flex"
          >
            Keşfedin
            <span className="relative h-14 w-px overflow-hidden bg-white/15">
              <span className="absolute inset-0 animate-scroll-cue bg-gold" />
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
