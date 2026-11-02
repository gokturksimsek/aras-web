import clsx from "clsx";
import MaskText from "./MaskText";
import Reveal from "./Reveal";

// Bölüm başlığı: numara + ince gold çizgi + üst etiket, altında serif başlık.
export default function SectionHeading({
  no,
  eyebrow,
  title,
  className,
  align = "left",
}: {
  no: string;
  eyebrow: string;
  title: React.ReactNode[];
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={clsx(align === "center" && "text-center", className)}>
      <Reveal
        y={16}
        className={clsx("mb-8 flex items-center gap-5", align === "center" && "justify-center")}
      >
        <span className="font-serif text-sm italic text-gold">{no}</span>
        <span className="h-px w-16 bg-gold/60" aria-hidden="true" />
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <MaskText
        lines={title}
        className="font-serif text-[clamp(2.4rem,5.4vw,4.75rem)] font-light leading-[1.04] tracking-[0.004em] text-ivory"
      />
    </div>
  );
}
