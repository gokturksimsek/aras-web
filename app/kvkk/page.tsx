import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { kvkk } from "@/lib/kvkk";

export const metadata: Metadata = {
  title: kvkk.title,
  description: "ARAS İNŞAAT kişisel verilerin korunması ve işlenmesine ilişkin aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden bg-anthracite py-[clamp(4rem,9vw,7rem)]">
        <div className="container-lux">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-12 bg-gold/60" aria-hidden="true" />
            <span className="eyebrow">Yasal Bilgilendirme</span>
          </div>
          <h1 className="font-serif text-[clamp(2.4rem,5.4vw,4.5rem)] leading-[1.04] font-light text-ivory">
            {kvkk.title}
          </h1>
          <p className="mt-4 text-sm text-stone">Son güncelleme: {kvkk.updated}</p>
        </div>
      </section>

      <article className="bg-ink py-[clamp(4rem,8vw,6rem)]">
        <div className="container-lux">
          <div className="max-w-3xl">
            <p className="text-[1.05rem] leading-[1.9] text-mist/85">{kvkk.intro}</p>
            {kvkk.sections.map((s) => (
              <section key={s.title} className="mt-12 border-t border-white/10 pt-10">
                <h2 className="font-serif text-[1.9rem] font-light text-ivory">{s.title}</h2>
                <div className="mt-5 space-y-4 text-[0.98rem] leading-[1.85] text-mist/75">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </article>
    </PageShell>
  );
}
