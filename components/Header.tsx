"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Logo from "./ui/Logo";
import InstagramIcon from "./ui/InstagramIcon";
import { nav, site } from "@/lib/site";

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

export default function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  // Aşağı kaydırınca header gizlenir, yukarı kaydırınca geri gelir.
  // Biraz kaydırılınca zemin opaklaşır: arkasından geçen yazı header'a binmez.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 8);
    setHidden(y > 600 && y > prev && !open);
  });

  // Sayfa değişince menüyü kapat, header'ı göster
  useEffect(() => {
    setOpen(false);
    setHidden(false);
  }, [pathname]);

  // Menü açıkken sayfa kaymasın.
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open, lenis]);

  // Esc ile menüyü kapat.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
            scrolled ? "max-h-0 opacity-0" : "max-h-12 bg-ink/40 opacity-100",
          )}
        >
          <div className="container-lux flex h-10 items-center justify-end text-[0.68rem] font-medium tracking-[0.2em] text-mist/70 uppercase">
            <div className="flex items-center gap-7">
              <span className="hidden font-serif text-sm tracking-[0.08em] normal-case italic text-gold/90 xl:inline">
                {site.slogan}
              </span>
              {site.phone && (
                <a href={site.phoneHref} className="flex h-10 items-center gap-2 transition-colors hover:text-gold">
                  <Phone className="size-3.5 text-gold" aria-hidden="true" />
                  {site.phone}
                </a>
              )}
              {site.email && (
                <a
                  href={`mailto:${site.email}`}
                  className="hidden h-10 items-center gap-2 normal-case tracking-[0.08em] transition-colors hover:text-gold lg:flex"
                >
                  <Mail className="size-3.5 text-gold" aria-hidden="true" />
                  {site.email}
                </a>
              )}
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
              ? "border-b border-gold/10 bg-ink/95 shadow-[0_10px_40px_-10px_rgb(0_0_0/0.6)] backdrop-blur-xl"
              : "bg-gradient-to-b from-ink/70 to-transparent",
          )}
        >
          <div
            className={clsx(
              "container-lux flex items-center justify-between transition-all duration-700 ease-lux",
              scrolled ? "h-[4.5rem]" : "h-24",
            )}
          >
            <Logo compact={scrolled} />

            {/* Menü sağa yaslı: sağ kenarı üst şeritteki Instagram satırıyla aynı hizada */}
            <nav aria-label="Ana menü" className="ml-auto hidden xl:block">
              <ul className="flex items-center gap-8 2xl:gap-11">
                {nav.map((n) => {
                  const on = isActive(pathname, n.href);
                  return (
                    <li key={n.href}>
                      <Link
                        href={n.href}
                        aria-current={on ? "page" : undefined}
                        className={clsx(
                          "group relative py-2 text-[0.72rem] font-semibold tracking-[0.22em] uppercase transition-colors duration-500",
                          on ? "text-gold-hi" : "text-mist/80 hover:text-ivory",
                        )}
                      >
                        {n.label}
                        <span
                          className={clsx(
                            "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-700 ease-lux",
                            on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                          )}
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

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
                {nav.map((n, i) => {
                  const on = isActive(pathname, n.href);
                  return (
                    <li key={n.href} className="overflow-hidden">
                      <motion.div
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "110%" }}
                        transition={{ duration: 0.8, delay: 0.25 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <Link
                          href={n.href}
                          onClick={() => setOpen(false)}
                          aria-current={on ? "page" : undefined}
                          className={clsx(
                            "flex items-baseline gap-5 py-2 font-serif text-[clamp(2.4rem,9vw,3.5rem)] font-light transition-colors hover:text-gold-hi short:py-1 short:text-[1.9rem]",
                            on ? "text-gold-hi" : "text-ivory",
                          )}
                        >
                          <span className="font-sans text-xs tracking-[0.2em] text-gold">0{i + 1}</span>
                          {n.label}
                        </Link>
                      </motion.div>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <motion.div
              className="container-lux flex items-center justify-between border-t border-white/10 py-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] text-xs tracking-[0.2em] text-stone uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.7 } }}
              exit={{ opacity: 0 }}
            >
              {site.phone ? (
                <a href={site.phoneHref} className="flex min-h-11 items-center gap-2 text-ivory">
                  <Phone className="size-4 text-gold" aria-hidden="true" />
                  {site.phone}
                </a>
              ) : (
                <span>{site.region}</span>
              )}
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
