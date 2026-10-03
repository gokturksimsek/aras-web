import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { kvkk } from "@/lib/kvkk";
import { pages } from "@/lib/site";

export const metadata: Metadata = {
  title: kvkk.title,
  description: "ARAS İNŞAAT kişisel verilerin korunması ve işlenmesine ilişkin aydınlatma metni.",
};

export default function KvkkPage() {
  const p = pages.kvkk;
  return (
    <main id="icerik">
      <PageHero crumb={p.crumb} title={p.title} lead={`${p.lead} Son güncelleme: ${kvkk.updated}.`} />
      <article className="bg-ink py-[clamp(4rem,8vw,6rem)]">
        <div className="container-lux">
          <div className="max-w-3xl">
            <p className="text-[1.05rem] leading-[1.9] text-mist/85">{kvkk.intro}</p>
            {kvkk.sections.map((s) => (
              <section key={s.title} className="mt-12 border-t border-white/10 pt-10">
                <h2 className="font-serif text-[1.9rem] font-light text-ivory">{s.title}</h2>
                <div className="mt-5 space-y-4 text-[0.98rem] leading-[1.85] text-mist/75">
                  {s.body.map((t, i) => (
                    <p key={i}>{t}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
