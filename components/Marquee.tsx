import { marquee } from "@/lib/site";

// Sonsuz kayan uzmanlık şeridi (dekoratif).
export default function Marquee() {
  const items = [...marquee, ...marquee];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.07] bg-ink py-7" aria-hidden="true">
      <div className="flex w-max motion-safe:animate-marquee">
        {items.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span
              className={
                i % 2
                  ? "font-serif text-[clamp(2rem,4.2vw,3.6rem)] font-light italic text-transparent [-webkit-text-stroke:1px_var(--color-gold-lo)]"
                  : "font-serif text-[clamp(2rem,4.2vw,3.6rem)] font-light text-ivory/85"
              }
            >
              {t}
            </span>
            <span className="mx-10 inline-block size-2 rotate-45 border border-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}
