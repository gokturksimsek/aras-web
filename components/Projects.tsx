"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useLenis } from "lenis/react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import Tilt from "./ui/Tilt";
import MoreLink from "./ui/MoreLink";
import { projects, type ProjectCategory } from "@/lib/images";

const filters: ("Tümü" | ProjectCategory)[] = ["Tümü", "Villa", "Konut", "İç Mimari", "Dekorasyon"];
const ratioClass = { tall: "aspect-[3/4]", wide: "aspect-[4/3]", square: "aspect-square" };

// limit: anasayfada ilk N proje, filtre yok + "Tüm Projeler" → /projeler
export default function Projects({ no = "01", limit }: { no?: string; limit?: number }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tümü");
  const [open, setOpen] = useState<number | null>(null);
  const lenis = useLenis();

  const list = useMemo(
    () => {
      const all = filter === "Tümü" ? projects : projects.filter((p) => p.category === filter);
      return limit ? all.slice(0, limit) : all;
    },
    [filter, limit],
  );

  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + list.length) % list.length)),
    [list.length],
  );

  // Lightbox: klavye ile gezinme + arka plan kilidi.
  useEffect(() => {
    if (open === null) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [open, step, lenis]);

  const current = open !== null ? list[open] : null;

  return (
    <section id="projeler" className="relative bg-anthracite section-y">
      <div className="container-lux">
        <div className="mb-14 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            no={no}
            eyebrow="Projelerimiz"
            title={["Yaşam alanlarına", <span key="t" className="gold-text italic">imzamız.</span>]}
          />

          {limit ? (
            <Reveal delay={0.15}>
              <MoreLink href="/projeler">Tüm Projeler</MoreLink>
            </Reveal>
          ) : (
          <Reveal delay={0.15}>
            <div role="tablist" aria-label="Proje kategorisi" className="flex flex-wrap gap-x-7 gap-y-2">
              {filters.map((f) => (
                <button
                  key={f}
                  role="tab"
                  type="button"
                  aria-selected={filter === f}
                  onClick={() => setFilter(f)}
                  className={clsx(
                    "relative min-h-11 text-[0.7rem] font-semibold tracking-[0.24em] uppercase transition-colors duration-[900ms]",
                    filter === f ? "text-gold-hi" : "text-stone hover:text-ivory",
                  )}
                >
                  {f}
                  {filter === f && (
                    <motion.span
                      layoutId="filter-line"
                      className="absolute inset-x-0 bottom-2 h-px bg-gold"
                      transition={{ duration: 0.9, ease: [0.65, 0.05, 0.36, 1] }}
                    />
                  )}
                </button>
              ))}
            </div>
          </Reveal>
          )}
        </div>

        {/* Masonry: CSS sütunları */}
        {/* Filtre değişince liste key ile yeniden kurulur ve kartlar sırayla belirir. */}
        <ul key={filter} className="columns-1 gap-6 sm:columns-2 lg:columns-3 lg:gap-8 [&>li]:mb-6 lg:[&>li]:mb-8">
              {list.map((p, i) => (
                <motion.li
                  key={p.src}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: Math.min(i, 6) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="break-inside-avoid"
                >
                  <Tilt>
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    className={clsx("group relative block w-full overflow-hidden text-left shadow-lux-sm transition-shadow duration-[1200ms] ease-lux hover:shadow-lux-glow", ratioClass[p.ratio])}
                    aria-label={`${p.title} görselini büyüt`}
                  >
                    <Image
                      src={p.src}
                      alt={p.alt}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-[1600ms] ease-lux group-hover:scale-[1.07]"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-70 transition-opacity duration-1000 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                    {/* İnce iç çerçeve */}
                    <span
                      className="absolute inset-4 border border-gold/0 transition-all duration-1000 ease-lux group-hover:inset-3 group-hover:border-gold/50"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-8">
                      <div className="translate-y-2 transition-transform duration-1000 ease-lux group-hover:translate-y-0">
                        <p className="eyebrow !text-[0.6rem]">{p.category}</p>
                        <p className="mt-2 font-serif text-2xl font-light text-ivory">{p.title}</p>
                      </div>
                      <span className="grid size-11 scale-75 place-items-center border border-gold/60 text-gold opacity-0 transition-all duration-1000 ease-lux group-hover:scale-100 group-hover:opacity-100">
                        <Plus className="size-4" aria-hidden="true" />
                      </span>
                    </div>
                  </button>
                  </Tilt>
                </motion.li>
              ))}
        </ul>
      </div>

      {/* Lightbox — açılışta belirir, kapanınca hemen kalkar
          (AnimatePresence çıkışı bu yapıda takılı kalıyordu). */}
        {current && (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-[80] flex flex-col bg-ink/95 backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onClick={() => setOpen(null)}
          >
            <div className="container-lux flex h-20 shrink-0 items-center justify-between">
              <p className="font-serif text-lg text-stone">
                <span className="text-ivory">{String((open ?? 0) + 1).padStart(2, "0")}</span> / {String(list.length).padStart(2, "0")}
              </p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="grid size-12 place-items-center border border-white/20 text-ivory transition-colors hover:border-gold hover:text-gold"
                aria-label="Kapat"
                autoFocus
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
              {/* Görsel değişince key ile yeniden girer (iç içe AnimatePresence dış çıkışı kilitliyor). */}
              <motion.div
                key={current.src}
                className="absolute inset-x-4 inset-y-0 sm:inset-x-24"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src={current.src} alt={current.alt} fill sizes="100vw" quality={85} className="object-contain" />
              </motion.div>
              {list.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center border border-white/20 bg-ink/60 text-ivory transition-colors hover:border-gold hover:text-gold sm:left-6"
                    aria-label="Önceki görsel"
                  >
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center border border-white/20 bg-ink/60 text-ivory transition-colors hover:border-gold hover:text-gold sm:right-6"
                    aria-label="Sonraki görsel"
                  >
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            <div className="container-lux shrink-0 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center">
              <p className="eyebrow !text-[0.6rem]">{current.category}</p>
              <p className="mt-2 font-serif text-2xl font-light text-ivory">{current.title}</p>
            </div>
          </motion.div>
        )}
    </section>
  );
}
