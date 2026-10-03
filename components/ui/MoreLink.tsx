import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

// Anasayfa özetlerinden ilgili sayfaya götüren düğme (ör. "Detaylı Bilgi" → /kurumsal).
export default function MoreLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={clsx("btn-lux", className)}>
      {children}
      <ArrowRight className="size-4" aria-hidden="true" />
    </Link>
  );
}
