"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useRef, useState } from "react";
import { nav, pages } from "@/lib/site";

// Sayfa geçişi: site içi bir linke tıklanınca alttan antrasit perde yükselir
// (logo + gidilen sayfanın adı), yeni sayfa gelince perde yukarı açılır.
// Tüm iç linkler otomatik yakalanır; ayrı bir link bileşeni gerekmez.

const ease = [0.76, 0, 0.24, 1] as const;

const labelFor = (path: string) => {
  const n = nav.find((x) => x.href === path);
  if (n) return n.label;
  const key = path.replace(/^\//, "") as keyof typeof pages;
  return pages[key]?.crumb ?? "ARAS İNŞAAT";
};

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const curtain = useAnimationControls();
  const [label, setLabel] = useState("");
  const busy = useRef(false);
  const covered = useRef(false);

  // İç link tıklamalarını yakala
  useEffect(() => {
    if (reduce) return;
    // Yakalama aşamasında dinlenir: Next Link'ten önce çalışır; varsayılanı engelleyince
    // Link yönlendirme yapmaz (link.js → e.defaultPrevented), yönlendirmeyi perde kapanınca biz yaparız.
    const onClick = async (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      // Aynı sayfa (yalnızca #çapa veya aynı yol): normal davranış
      if (url.pathname === location.pathname) return;
      e.preventDefault();
      if (busy.current) return;
      busy.current = true;
      setLabel(labelFor(url.pathname));
      await curtain.start({ clipPath: "inset(0% 0 0 0)", transition: { duration: 0.75, ease } });
      covered.current = true;
      router.push(url.pathname + url.search + url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [reduce, router, curtain]);

  // Yeni sayfa geldi: perde kapalıyken başa dön, sonra perdeyi aç
  useEffect(() => {
    if (!covered.current) return;
    covered.current = false;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    const t = setTimeout(async () => {
      await curtain.start({ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.85, ease } });
      curtain.set({ clipPath: "inset(100% 0 0 0)" });
      busy.current = false;
    }, 250);
    return () => clearTimeout(t);
  }, [pathname, curtain, lenis]);

  return (
    <motion.div
      aria-hidden="true"
      className="grain pointer-events-none fixed inset-0 z-[90] grid place-items-center bg-anthracite"
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={curtain}
    >
      {/* Üst kenarda gold çizgi */}
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="flex flex-col items-center">
        <Image src="/img/aras-logo-mark.png" alt="" width={112} height={120} className="h-16 w-auto opacity-90" />
        <p className="mt-6 font-serif text-3xl font-light tracking-[0.04em] text-ivory sm:text-4xl">{label}</p>
        <span className="mt-5 h-px w-16 bg-gold/70" />
      </div>
    </motion.div>
  );
}
