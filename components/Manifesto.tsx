"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { manifesto } from "@/lib/site";

// Kaydırdıkça kelime kelime aydınlanan manifesto metni.
function Word({ children, range, progress }: { children: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = manifesto.split(" ");

  return (
    <section id="manifesto" className="relative overflow-hidden bg-ink py-[clamp(6rem,14vw,12rem)]">
      <div className="container-lux">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex items-center gap-4">
            <span className="h-px w-12 bg-gold/60" aria-hidden="true" />
            <span className="eyebrow">Özenle ve Güvenle</span>
          </div>
          <p
            ref={ref}
            className="font-serif text-[clamp(1.75rem,3.9vw,3.4rem)] font-light leading-[1.22] text-ivory"
            aria-label={manifesto}
          >
            <span aria-hidden="true">
              {words.map((w, i) => (
                <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                  {w}
                </Word>
              ))}
            </span>
          </p>
        </div>
      </div>
      {/* Arka planda silik yıl */}
      <span
        className="pointer-events-none absolute -right-[4vw] bottom-0 select-none font-serif text-[26vw] leading-[0.75] font-light text-white/[0.025]"
        aria-hidden="true"
      >
        1994
      </span>
    </section>
  );
}
