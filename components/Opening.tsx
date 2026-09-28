"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Header from "./Header";
import Hero from "./Hero";
import { site } from "@/lib/site";

// Açılış perdesi → perde kalkınca hero animasyonları başlar.
export default function Opening() {
  const reduce = useReducedMotion();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), reduce ? 0 : 2100);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            className="fixed inset-0 z-[100] grid place-items-center bg-ink"
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            aria-hidden="true"
          >
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image src="/img/aras-logo-mark.png" alt="" width={112} height={120} preload className="h-24 w-auto sm:h-28" />
              </motion.div>
              <motion.p
                className="mt-6 font-serif text-2xl tracking-[0.45em] text-gold-hi"
                initial={{ opacity: 0, letterSpacing: "0.8em" }}
                animate={{ opacity: 1, letterSpacing: "0.45em" }}
                transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                ARAS
              </motion.p>
              <div className="mt-6 h-px w-40 overflow-hidden bg-white/10">
                <motion.div
                  className="h-full origin-left bg-gold"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.7, ease: [0.65, 0, 0.35, 1] }}
                />
              </div>
              <motion.p
                className="mt-5 font-serif text-sm italic text-stone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                {site.slogan}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header />
      <Hero ready={!loading} />
    </>
  );
}
