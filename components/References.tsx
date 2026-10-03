"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import Tilt from "./ui/Tilt";
import MoreLink from "./ui/MoreLink";
import { references } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

// Logo: resmî logodan üretilmiş tek renkli maske. Fildişi katman, üzerine gelince gold'a döner.
// Boyut, en/boy oranına göre eşit "görsel alan" verecek şekilde hesaplanır.
function LogoMask({
  src,
  name,
  ratio,
  area,
  scale = 1,
  className,
}: {
  src: string;
  name: string;
  ratio: number;
  area: number;
  scale?: number;
  className?: string;
}) {
  const w = Math.sqrt(area * ratio);
  const h = Math.sqrt(area / ratio);
  const mask = {
    WebkitMaskImage: `url("${src}")`,
    maskImage: `url("${src}")`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  } as React.CSSProperties;

  return (
    <span
      role="img"
      aria-label={name}
      className={clsx("relative block shrink-0", className)}
      style={{ ...mask, width: `calc(${w * scale}px * var(--logo-scale, 1))`, height: `calc(${h * scale}px * var(--logo-scale, 1))` }}
    >
      <span className="absolute inset-0 bg-sand/85 transition-opacity duration-700 ease-lux group-hover:opacity-0" />
      <span className="absolute inset-0 bg-gradient-to-r from-gold-lo via-gold-hi to-gold opacity-0 transition-opacity duration-700 ease-lux group-hover:opacity-100" />
    </span>
  );
}

// İş ortağı kartı: imleci izleyen gold ışık + köşe çizgileri.
function PartnerCard({ p, i }: { p: (typeof references.partners)[number]; i: number }) {
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const inner = (
    <>
      {/* İmleci izleyen ışık */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklab, var(--color-gold) 14%, transparent), transparent 65%)",
        }}
        aria-hidden="true"
      />
      {/* Köşe çizgileri */}
      <span className="absolute left-0 top-0 h-px w-10 origin-left bg-gold transition-transform duration-700 ease-lux group-hover:scale-x-[2.2]" aria-hidden="true" />
      <span className="absolute left-0 top-0 h-10 w-px origin-top bg-gold transition-transform duration-700 ease-lux group-hover:scale-y-[2.2]" aria-hidden="true" />
      <span className="absolute bottom-0 right-0 h-px w-10 origin-right bg-gold/50 transition-transform duration-700 ease-lux group-hover:scale-x-[2.2]" aria-hidden="true" />
      <span className="absolute bottom-0 right-0 h-10 w-px origin-bottom bg-gold/50 transition-transform duration-700 ease-lux group-hover:scale-y-[2.2]" aria-hidden="true" />

      <div className="relative flex items-start justify-between">
        <span className="font-serif text-lg italic text-gold">0{i + 1}</span>
        <span className="text-[0.62rem] font-semibold tracking-[0.3em] text-stone uppercase">{p.city}</span>
      </div>

      <div className="relative flex flex-1 items-center justify-center py-10">
        <LogoMask
          src={p.logo}
          name={p.name}
          ratio={p.ratio}
          area={9000}
          className="transition-transform duration-1000 ease-lux group-hover:scale-[1.06]"
        />
      </div>

      <div className="relative flex items-end justify-between gap-4 border-t border-white/10 pt-5">
        <div>
          <p className="text-[0.6rem] font-semibold tracking-[0.3em] text-stone uppercase">İş Ortağı</p>
          <p className="mt-1 font-serif text-2xl font-light text-ivory">{p.name}</p>
        </div>
        {p.url && (
          <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition-all duration-500 ease-lux group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </span>
        )}
      </div>
    </>
  );

  const cls =
    "group relative flex h-full min-h-[18rem] flex-col sm:min-h-[22rem] overflow-hidden border border-white/10 bg-gradient-to-b from-graphite/60 to-anthracite p-7 transition-colors duration-700 hover:border-gold/40 sm:p-9";

  return (
    <motion.div
      initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.3, delay: i * 0.15, ease }}
      className="h-full"
    >
      <Tilt className="h-full" max={6}>
      {p.url ? (
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseMove={onMove}
          className={cls}
          aria-label={`${p.name} web sitesini yeni sekmede aç`}
        >
          {inner}
        </a>
      ) : (
        <div onMouseMove={onMove} className={cls}>
          {inner}
        </div>
      )}
      </Tilt>
    </motion.div>
  );
}

// Marka şeridi: sonsuz kayan, üzerine gelince duran bir sıra.
function BrandRow({ items, reverse }: { items: typeof references.brands; reverse?: boolean }) {
  const set = [...items, ...items];
  return (
    <div aria-hidden="true" className="group/row relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div
        className={clsx(
          "flex w-max motion-safe:animate-[marquee_50s_linear_infinite] group-hover/row:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0">
            {set.map((b, i) => (
              <li
                key={`${b.name}-${i}`}
                className="group flex h-28 w-52 shrink-0 items-center justify-center border-r border-white/[0.07] sm:h-32 sm:w-64"
              >
                <LogoMask src={b.logo} name={b.name} ratio={b.ratio} area={4200} scale={"scale" in b ? b.scale : 1} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

// compact: anasayfada yalnızca marka şeridi + "Tüm Referanslar" → /referanslar
export default function References({ no = "01", compact = false }: { no?: string; compact?: boolean }) {
  const half = Math.ceil(references.brands.length / 2);

  return (
    <section
      id="referanslar"
      className="relative overflow-hidden bg-ink py-[clamp(6rem,12vw,10rem)] [--logo-scale:0.82] sm:[--logo-scale:1]"
    >
      {/* Arka plan: silik gold hale */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--color-gold), transparent)" }}
        aria-hidden="true"
      />

      <div className="container-lux relative">
        <div className="mb-16 grid gap-10 lg:mb-20 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            no={no}
            eyebrow="Referanslarımız"
            title={["Güvenle büyüyen", <span key="t" className="gold-text italic">iş birlikleri.</span>]}
            className="lg:col-span-7"
          />
          <Reveal delay={0.2} className="lg:col-span-5">
            <p className="max-w-md text-[1.02rem] leading-[1.85] text-mist/75 lg:ml-auto">{references.intro}</p>
            {compact && (
              <div className="mt-8 lg:flex lg:justify-end">
                <MoreLink href="/referanslar">Tüm Referanslar</MoreLink>
              </div>
            )}
          </Reveal>
        </div>

        {!compact && (
          <>
        {/* İş ortakları */}
        <Reveal y={16} className="mb-8 flex items-center gap-4">
          <span className="eyebrow !text-[0.62rem]">İş Ortaklarımız</span>
          <span className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" aria-hidden="true" />
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-3">
          {references.partners.map((p, i) => (
            <PartnerCard key={p.name} p={p} i={i} />
          ))}
        </div>

        {/* Markalar */}
        <Reveal y={16} className="mb-8 mt-24 flex items-center gap-4 lg:mt-32">
          <span className="eyebrow !text-[0.62rem]">Çalıştığımız Markalar</span>
          <span className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" aria-hidden="true" />
        </Reveal>
          </>
        )}
      </div>

      <Reveal className="relative space-y-px border-y border-white/[0.07]">
        <BrandRow items={references.brands.slice(0, half)} />
        <div className="h-px bg-white/[0.07]" aria-hidden="true" />
        <BrandRow items={references.brands.slice(half)} reverse />
      </Reveal>

      <p className="sr-only">
        Çalıştığımız markalar: {references.brands.map((b) => b.name).join(", ")}.
      </p>
    </section>
  );
}
