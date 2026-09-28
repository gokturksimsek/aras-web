import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "./ui/Logo";
import Footer from "./Footer";

// Alt sayfalar (KVKK, 404) için sade iskelet: logo + anasayfaya dönüş, içerik, footer.
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header id="sayfa-basi" className="border-b border-white/5 bg-ink pt-[env(safe-area-inset-top)]">
        <div className="container-lux flex h-24 items-center justify-between">
          <Logo href="/" />
          <Link href="/" className="btn-lux !min-h-11 !px-5">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Anasayfaya Dön</span>
            <span className="sm:hidden">Anasayfa</span>
          </Link>
        </div>
      </header>
      <main id="icerik">{children}</main>
      <Footer base="/" />
    </>
  );
}
