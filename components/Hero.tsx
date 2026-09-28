"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import MaskText from "./ui/MaskText";
import { hero } from "@/lib/site";
import { img } from "@/lib/images";

const SLIDE_MS = 7000;
const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const slides = img.hero;

  // Görsel katmanı yavaşça aşağı kayar, içerik soluklaşır (paralaks).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [reduce, slides.length]);

  return (
    <section
      id="anasayfa"
      ref={ref}
      className="relative h-[100svh] min-h-[640px] overflow-hidden bg-ink short:h-auto short:min-h-[100svh]"
      aria-label="Giriş"
    >
      {/* Slayt görselleri: çapraz geçiş + yavaş zoom (Ken Burns) */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.18 }}
              animate={{ scale: 1.02 }}
              transition={{ duration: SLIDE_MS / 1000 + 2, ease: "linear" }}
            >
              <Image
                src={slides[index].src}
                alt={slides[index].alt}
                fill
                preload={index === 0}
                quality={85}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Karartma katmanları: metin okunurluğu + sinematik vinyet */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/10" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" aria-hidden="true" />
      <div className="grain absolute inset-0" aria-hidden="true" />

      {/* Dikey ince çizgiler: mimari grid hissi */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
        <div className="container-lux relative h-full">
          {[25, 50, 75].map((l) => (
            <span key={l} className="absolute top-0 h-full w-px bg-white/[0.04]" style={{ left: `${l}%` }} />
          ))}
        </div>
      </div>

      <motion.div
        className="container-lux relative flex h-full flex-col justify-end pb-[max(7rem,14vh)] md:justify-center md:pb-0 short:pb-32"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-5xl pt-28">
          <motion.div
            className="mb-8 flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={ready ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease }}
          >
            <span className="h-px w-14 bg-gold" aria-hidden="true" />
            <span className="eyebrow">
              {hero.eyebrow} · <span lang="en">{hero.eyebrowEn}</span>
            </span>
          </motion.div>

          {ready && (
            <MaskText
              as="h1"
              inView={false}
              delay={0.2}
              lines={hero.titleLines}
              lineClassName={(i) =>
                i === 1 ? "gold-text italic pl-[0.6em] sm:pl-[1.2em]" : undefined
              }
              className="font-serif text-[clamp(3rem,8.4vw,8.25rem)] font-light leading-[0.96] tracking-[-0.02em] text-ivory short:text-[3rem]"
            />
          )}

          <motion.div
            className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.8, ease }}
          >
            <p className="max-w-md text-[0.98rem] leading-relaxed text-mist/85">{hero.text}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#projeler" className="btn-lux btn-solid">
                Projelerimiz
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
              <a href="#iletisim" className="btn-lux">
                Bize Ulaşın
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Alt bar: slayt sayacı + ilerleme + kaydırma işareti */}
      <motion.div
        className="absolute inset-x-0 bottom-0"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="container-lux flex items-end justify-between pb-8">
          <div className="flex items-center gap-5">
            <span className="font-serif text-lg text-ivory">0{index + 1}</span>
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`${i + 1}. görsel`}
                  aria-current={i === index ? "true" : undefined}
                  className="group relative grid h-11 w-10 place-items-center sm:w-14"
                >
                  <span className="relative block h-px w-full overflow-hidden bg-white/20">
                    <span
                      key={i === index ? `a${index}` : `i${i}`}
                      className={clsx(
                        "absolute inset-0 origin-left bg-gold",
                        i === index && !reduce ? "animate-[hero-progress_linear_forwards]" : "scale-x-0",
                        i === index && reduce && "scale-x-100",
                      )}
                      style={i === index && !reduce ? { animationDuration: `${SLIDE_MS}ms` } : undefined}
                    />
                  </span>
                </button>
              ))}
            </div>
            <span className="font-serif text-lg text-stone">0{slides.length}</span>
          </div>

          <a
            href="#manifesto"
            className="hidden items-center gap-4 text-[0.62rem] font-semibold tracking-[0.3em] text-mist/70 uppercase transition-colors hover:text-gold md:flex"
          >
            Keşfedin
            <span className="relative h-14 w-px overflow-hidden bg-white/15">
              <span className="absolute inset-0 animate-scroll-cue bg-gold" />
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
