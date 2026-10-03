import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "Sayfa Bulunamadı" };

export default function NotFound() {
  return (
    <main id="icerik">
      <section className="grain relative flex min-h-[86svh] items-center overflow-hidden bg-anthracite pt-32 pb-24">
        <span
          className="pointer-events-none absolute inset-0 grid select-none place-items-center font-serif text-[40vw] leading-none font-light text-white/[0.03]"
          aria-hidden="true"
        >
          404
        </span>
        <div className="container-lux relative text-center">
          <p className="eyebrow">Sayfa Bulunamadı</p>
          <h1 className="mt-6 font-serif text-[clamp(2.4rem,6vw,5rem)] leading-[1.04] font-light text-ivory">
            Aradığınız sayfa <span className="gold-text italic">burada değil.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-mist/75">
            Bağlantı değişmiş veya kaldırılmış olabilir. Anasayfadan projelerimizi ve uzmanlıklarımızı inceleyebilirsiniz.
          </p>
          <Link href="/" className="btn-lux btn-solid mt-10">
            Anasayfaya Git
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
