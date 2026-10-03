import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

// Header logosu: altıgen işaret (müşterinin logo dosyasından) + kurumsal yazı.
export default function Logo({
  className,
  compact = false,
  href = "/",
}: {
  className?: string;
  compact?: boolean;
  href?: string;
}) {
  return (
    <Link href={href} className={clsx("group flex items-center gap-3", className)} aria-label="ARAS İNŞAAT — Anasayfa">
      <Image
        src="/img/aras-logo-mark.png"
        alt=""
        width={112}
        height={120}
        preload
        className={clsx(
          "w-auto transition-all duration-700 ease-lux group-hover:scale-105",
          compact ? "h-11" : "h-12 sm:h-14",
        )}
      />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.55rem] font-medium tracking-[0.22em] text-gold-hi">ARAS</span>
        <span className="mt-1 text-[0.56rem] font-semibold tracking-[0.5em] text-stone">İNŞAAT</span>
      </span>
    </Link>
  );
}
