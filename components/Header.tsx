"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Logo from "./ui/Logo";
import InstagramIcon from "./ui/InstagramIcon";
import { nav, site } from "@/lib/site";

export default function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#anasayfa");
  const lenis = useLenis();

  // Aşağı kaydırınca header gizlenir, yukarı kaydırınca geri gelir.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 600 && y > prev && !open);
  });

  // Menü açıkken sayfa kaymasın.
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open, lenis]);

  // Mobil menü linki: önce menüyü kapat, Lenis'i yeniden başlat, sonra yumuşak kaydır.
  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    document.documentElement.style.overflow = "";
    const el = document.querySelector<HTMLElement>(href);
    if (!el) return;
    if (lenis) {
      lenis.start();
      lenis.scrollTo(el, { duration: 1.6 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
    history.replaceState(null, "", href);
  };

  // Esc ile menüyü kapat.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Görünen bölüme göre aktif menü linki.
  useEffect(() => {
    const els = nav
      .map((n) => document.querySelector(n.href))
      .filter((el): el is Element => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)]"
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Üst bilgi şeridi */}
        <div
          className={clsx(
            "hidden overflow-hidden border-b border-gold/15 transition-all duration-700 ease-lux md:block",
            scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100",
          )}
        >
          <div className="container-lux flex h-10 items-center justify-between text-[0.68rem] font-medium tracking-[0.2em] text-mist/70 uppercase">
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5 text-gold" aria-hidden="true" />
              {site.region} · <span lang="en">Since {site.founded}</span>
            </span>
            <div className="flex items-center gap-7">
              <span className="font-serif text-sm tracking-[0.08em] normal-case italic text-gold/90">
                {site.slogan}
              </span>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 items-center gap-2 transition-colors hover:text-gold"
              >
                <InstagramIcon className="size-3.5" />
                {site.instagram.handle}
              </a>
            </div>
          </div>
        </div>

        {/* Ana bar */}
        <div
          className={clsx(
            "transition-all duration-700 ease-lux",
            scrolled
              ? "border-b border-white/5 bg-ink/80 backdrop-blur-xl"
              : "bg-gradient-to-b from-ink/60 to-transparent",
          )}
        >
          <div
            className={clsx(
              "container-lux flex items-center justify-between transition-all duration-700 ease-lux",
              scrolled ? "h-[4.5rem]" : "h-24",
            )}
          >
            <Logo compact={scrolled} />

            <nav aria-label="Ana menü" className="hidden xl:block">
              <ul className="flex items-center gap-10">
                {nav.map((n) => (
                  <li key={n.href}>
                    <a
                      href={n.href}
                      aria-current={active === n.href ? "true" : undefined}
                      className={clsx(
                        "group relative py-2 text-[0.72rem] font-semibold tracking-[0.22em] uppercase transition-colors duration-500",
                        active === n.href ? "text-gold-hi" : "text-mist/80 hover:text-ivory",
                      )}
                    >
                      {n.label}
                      <span
                        className={clsx(
                          "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-700 ease-lux",
                          active === n.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <a href="#iletisim" className="btn-lux hidden !min-h-11 !px-6 sm:inline-flex">
                Teklif Alın
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobil-menu"
                aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
                className="relative z-[60] grid size-12 place-items-center xl:hidden"
              >
                <span className="relative block h-3.5 w-7">
                  <span
                    className={clsx(
                      "absolute left-0 h-px w-full bg-ivory transition-all duration-500 ease-lux",
                      open ? "top-1/2 rotate-45" : "top-0",
                    )}
                  />
                  <span
                    className={clsx(
                      "absolute right-0 h-px bg-gold transition-all duration-500 ease-lux",
                      open ? "top-1/2 w-full -rotate-45" : "top-full w-4",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobil tam ekran menü */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobil-menu"
            id="mobil-menu"
            className="grain fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-anthracite xl:hidden"
            data-lenis-prevent
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label="Mobil menü" className="container-lux flex flex-1 flex-col justify-center pt-24 short:pt-20 short:pb-4">
              <ul className="space-y-2 short:grid short:grid-cols-2 short:gap-x-8 short:space-y-0">
                {nav.map((n, i) => (
                  <li key={n.href} className="overflow-hidden">
                    <motion.a
                      href={n.href}
                      onClick={(e) => goTo(e, n.href)}
                      className="flex items-baseline gap-5 py-2 font-serif text-[clamp(2.4rem,9vw,3.5rem)] font-light text-ivory transition-colors hover:text-gold-hi short:py-1 short:text-[1.9rem]"
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.8, delay: 0.25 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <span className="font-sans text-xs tracking-[0.2em] text-gold">0{i + 1}</span>
                      {n.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="container-lux flex items-center justify-between border-t border-white/10 py-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] text-xs tracking-[0.2em] text-stone uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.7 } }}
              exit={{ opacity: 0 }}
            >
              <span>{site.region}</span>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-2 text-gold"
              >
                <InstagramIcon className="size-4" />
                Instagram
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
