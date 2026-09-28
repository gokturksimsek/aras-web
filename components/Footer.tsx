import Image from "next/image";
import { ArrowUp } from "lucide-react";
import InstagramIcon from "./ui/InstagramIcon";
import { nav, services, site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-gold/15 bg-anthracite">
      <div className="hairline absolute inset-x-0 top-0 h-px opacity-60" aria-hidden="true" />

      <div className="container-lux grid gap-14 py-20 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Image src="/img/aras-logo.png" alt="ARAS İNŞAAT — Özenle ve Güvenle, Since 1994" width={146} height={160} className="h-40 w-auto" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-stone">{site.description}</p>
        </div>

        <nav aria-label="Alt menü" className="lg:col-span-2">
          <p className="eyebrow mb-6">Menü</p>
          <ul className="text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="inline-flex min-h-11 items-center text-mist/75 transition-colors hover:text-gold-hi lg:min-h-9">{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <p className="eyebrow mb-6">Uzmanlıklar</p>
          <ul className="text-sm">
            {services.map((s) => (
              <li key={s.id}>
                <a href="#uzmanliklar" className="inline-flex min-h-11 items-center text-mist/75 transition-colors hover:text-gold-hi lg:min-h-9">{s.title}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="eyebrow mb-6">Takip Edin</p>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-sm text-mist/75 transition-colors hover:text-gold-hi"
          >
            <span className="grid size-11 place-items-center rounded-full border border-gold/40 text-gold transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
              <InstagramIcon className="size-4" />
            </span>
            {site.instagram.handle}
          </a>
          <p className="mt-6 text-sm text-stone">{site.region}</p>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-lux flex flex-col items-center justify-between gap-4 py-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] text-xs tracking-[0.12em] text-stone sm:flex-row">
          <p>© {year} {site.name}. Tüm hakları saklıdır.</p>
          <p className="font-serif text-sm italic text-gold/80">{site.slogan} · <span lang="en">Since {site.founded}</span></p>
          <a href="#anasayfa" className="group flex min-h-11 items-center gap-2 uppercase transition-colors hover:text-gold" aria-label="Sayfanın başına dön">
            Yukarı
            <ArrowUp className="size-4 transition-transform duration-500 group-hover:-translate-y-1" aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Dev silik marka yazısı */}
      <p className="pointer-events-none -mb-[3vw] select-none text-center font-serif text-[22vw] leading-none font-light tracking-[0.1em] text-white/[0.025]" aria-hidden="true">
        ARAS
      </p>
    </footer>
  );
}
