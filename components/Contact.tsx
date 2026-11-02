"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, LoaderCircle, Mail, MapPin, Phone, Send } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";
import InstagramIcon from "./ui/InstagramIcon";
import { contactTopics, site } from "@/lib/site";

type Status = "idle" | "sending" | "ok" | "mailto" | "error";

// Sunucuda gönderim yöntemi yoksa: FormSubmit ile tarayıcıdan doğrudan gönder.
// İlk gönderimde site.email adresine tek seferlik "Activate Form" onay e-postası gelir.
async function sendViaFormSubmit(d: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${site.email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        "Ad Soyad": d.name,
        Telefon: d.phone || "—",
        "E-posta": d.email || "—",
        Konu: d.topic || "—",
        Mesaj: d.message,
        _subject: `Web sitesi: ${d.topic || "Bilgi talebi"} — ${d.name}`,
        ...(d.email ? { _replyto: d.email } : {}),
        _template: "table",
        _captcha: "false",
      }),
    });
    const json = (await res.json().catch(() => null)) as { success?: string | boolean } | null;
    return res.ok && String(json?.success) === "true";
  } catch {
    return false;
  }
}

// Son çare: ziyaretçinin e-posta uygulamasını mesaj hazır açar.
function openMailDraft(d: Record<string, string>) {
  const lines = [
    `Ad Soyad: ${d.name}`,
    d.phone ? `Telefon: ${d.phone}` : "",
    d.email ? `E-posta: ${d.email}` : "",
    d.topic ? `Konu: ${d.topic}` : "",
  ].filter(Boolean);
  const body = [...lines, "", d.message].join("\n");
  const subject = `Web sitesi: ${d.topic || "Bilgi talebi"} — ${d.name}`;
  window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function Contact({ no = "01" }: { no?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [topic, setTopic] = useState("");

  useEffect(() => {
    // /iletisim?konu=... ile gelindiyse Konu'yu seç (listede varsa)
    const k = new URLSearchParams(window.location.search).get("konu");
    if (k && contactTopics.includes(k)) setTopic(k);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    // İstemci tarafı doğrulama (sunucu da ayrıca doğrular).
    const next: Record<string, string> = {};
    if (!data.name?.trim()) next.name = "Lütfen adınızı yazın.";
    if (!data.phone?.trim() && !data.email?.trim()) next.phone = "Telefon veya e-posta alanlarından en az birini doldurun.";
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = "Geçerli bir e-posta adresi yazın.";
    if (!data.message?.trim()) next.message = "Lütfen kısaca projenizden bahsedin.";
    if (!data.kvkk) next.kvkk = "Devam etmek için onay kutusunu işaretleyin.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/iletisim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const done = () => {
        setStatus("ok");
        form.reset();
        setTopic("");
      };
      if (res.ok) return done();
      if (res.status === 422) return setStatus("error");
      // 503 (sunucuda yöntem yok) veya 502 (gönderim hatası) → yedekler
      if (site.email && (await sendViaFormSubmit(data))) return done();
      if (site.email) {
        openMailDraft(data);
        return setStatus("mailto");
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const info = [
    { icon: MapPin, label: "Merkez · Hizmet Bölgesi", value: `${site.city} · ${site.region}` },
    site.phone && { icon: Phone, label: "Telefon", value: site.phone, href: site.phoneHref },
    site.email && { icon: Mail, label: "E-posta", value: site.email, href: `mailto:${site.email}` },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string; href?: string }[];

  return (
    <section id="iletisim" className="relative overflow-hidden bg-ink section-y">
      <div className="container-lux grid gap-20 lg:grid-cols-12 lg:gap-16">
        {/* Sol: bilgiler */}
        <div className="lg:col-span-5">
          <SectionHeading
            no={no}
            eyebrow="İletişim"
            title={["Projenizi", <span key="t" className="gold-text italic">dinleyelim.</span>]}
          />
          <Reveal delay={0.15}>
            <p className="mt-8 max-w-md text-[1.02rem] leading-[1.85] text-mist/75">
              Ankara merkezli ekibimizle, Ankara genelindeki villa, konut ve iç mimari projeleriniz için
              buradayız. Formu doldurun, sizinle en kısa sürede iletişime geçelim.
            </p>
          </Reveal>

          <ul className="mt-14 space-y-px">
            {info.map((it, i) => (
              <Reveal key={it.label} delay={0.1 * i}>
                <li className="flex items-center gap-5 border-t border-white/10 py-7">
                  <span className="grid size-12 shrink-0 place-items-center border border-gold/40 text-gold">
                    <it.icon className="size-5" strokeWidth={1.4} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[0.62rem] font-semibold tracking-[0.28em] text-stone uppercase">{it.label}</p>
                    {it.href ? (
                      <a href={it.href} className="mt-1 block font-serif text-xl text-ivory hover:text-gold-hi">{it.value}</a>
                    ) : (
                      <p className="mt-1 font-serif text-xl text-ivory">{it.value}</p>
                    )}
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>

          {/* Instagram kartı */}
          <Reveal delay={0.2}>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-8 flex items-center justify-between overflow-hidden border border-gold/30 p-7 shadow-lux-sm transition-[border-color,box-shadow] duration-[1200ms] ease-lux hover:border-gold hover:shadow-lux-glow"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-br from-gold-lo/25 via-transparent to-transparent transition-transform duration-1000 ease-lux group-hover:scale-y-100" aria-hidden="true" />
              <span className="relative flex items-center gap-5">
                <span className="grid size-12 place-items-center bg-gradient-to-br from-gold-lo via-gold to-gold-hi text-ink">
                  <InstagramIcon className="size-5" />
                </span>
                <span>
                  <span className="block text-[0.62rem] font-semibold tracking-[0.28em] text-stone uppercase">Instagram'da Takip Edin</span>
                  <span className="mt-1 block font-serif text-xl text-ivory">{site.instagram.handle}</span>
                </span>
              </span>
              <ArrowUpRight className="relative size-5 text-gold transition-transform duration-[900ms] ease-lux group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
            </a>
          </Reveal>
        </div>

        {/* Sağ: form */}
        <Reveal delay={0.1} className="lg:col-span-7 lg:pl-12">
          <div className="relative border border-white/10 bg-anthracite p-8 shadow-lux-lg sm:p-14">
            <span className="absolute -top-px left-10 h-px w-24 bg-gold" aria-hidden="true" />
            <h3 className="font-serif text-3xl font-light text-ivory">Bilgi ve İletişim Formu</h3>
            <p className="mt-2 text-sm text-stone">* işaretli alanlar zorunludur.</p>

            <form onSubmit={onSubmit} noValidate className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              <Field label="Ad Soyad *" name="name" error={errors.name} autoComplete="name" />
              <Field label="Telefon" name="phone" type="tel" error={errors.phone} autoComplete="tel" />
              <Field label="E-posta" name="email" type="email" error={errors.email} autoComplete="email" />
              <label className="block">
                <span className="text-[0.62rem] font-semibold tracking-[0.28em] text-stone uppercase">Konu</span>
                <select name="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className="field cursor-pointer appearance-none bg-[length:12px] bg-[right_center] bg-no-repeat [&>option]:bg-anthracite" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' fill='none' stroke='%23d3a971' stroke-width='1.2'/></svg>\")" }}>
                  <option value="" disabled>Seçiniz</option>
                  {contactTopics.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <Field label="Mesajınız *" name="message" textarea error={errors.message} className="sm:col-span-2" />

              {/* Bot tuzağı: gerçek kullanıcı görmez */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              <div className="sm:col-span-2">
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-mist/70">
                  <input type="checkbox" name="kvkk" className="peer sr-only" />
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center border border-gold/60 text-transparent transition-colors peer-checked:bg-gold peer-checked:text-ink peer-focus-visible:ring-1 peer-focus-visible:ring-gold">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span>
                    <a href="/kvkk" target="_blank" className="text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold">
                      KVKK Aydınlatma Metni
                    </a>
                    &apos;ni okudum; kişisel verilerimin talebime dönüş yapılması amacıyla işlenmesini kabul ediyorum.
                  </span>
                </label>
                {errors.kvkk && <p className="mt-2 text-xs text-gold-hi" role="alert">{errors.kvkk}</p>}
              </div>

              <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center">
                <button type="submit" disabled={status === "sending"} className="btn-lux btn-solid w-full sm:w-auto disabled:opacity-60">
                  {status === "sending" ? (
                    <>Gönderiliyor <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /></>
                  ) : (
                    <>Gönder <Send className="size-4" aria-hidden="true" /></>
                  )}
                </button>
                <AnimatePresence mode="wait">
                  {status !== "idle" && status !== "sending" && (
                    <motion.p
                      key={status}
                      role="status"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className={clsx("text-sm leading-relaxed", status === "ok" ? "text-gold-hi" : "text-mist/80")}
                    >
                      {status === "ok" && "Teşekkürler! Mesajınız bize ulaştı, en kısa sürede dönüş yapacağız."}
                      {status === "mailto" && (
                        <>
                          E-posta uygulamanız mesajınız hazır şekilde açıldı; göndermeniz yeterli. Açılmadıysa bize{" "}
                          <a href={site.phoneHref} className="whitespace-nowrap text-gold underline underline-offset-4">{site.phone}</a>{" "}
                          numarasından ulaşabilirsiniz.
                        </>
                      )}
                      {status === "error" && (
                        <>
                          Mesajınız iletilemedi. Lütfen tekrar deneyin ya da{" "}
                          <a href={site.phoneHref} className="whitespace-nowrap text-gold underline underline-offset-4">{site.phone}</a>{" "}
                          numarasından bize ulaşın.
                        </>
                      )}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea,
  error,
  className,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  error?: string;
  className?: string;
  autoComplete?: string;
}) {
  const id = `f-${name}`;
  return (
    <div className={className}>
      <label htmlFor={id} className="text-[0.62rem] font-semibold tracking-[0.28em] text-stone uppercase">
        {label}
      </label>
      {textarea ? (
        <textarea id={id} name={name} rows={4} className="field resize-none" aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} />
      ) : (
        <input id={id} name={name} type={type} autoComplete={autoComplete} className="field" aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} />
      )}
      {error && (
        <p id={`${id}-e`} className="mt-2 text-xs text-gold-hi" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
