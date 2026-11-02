"use client";

import { ArrowUp } from "lucide-react";
import { useLenis } from "lenis/react";

// Footer'daki "Yukarı": her sayfada sayfanın başına yumuşakça döner.
export default function BackToTop() {
  const lenis = useLenis();
  return (
    <button
      type="button"
      onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
      className="group flex min-h-11 items-center gap-2 uppercase transition-colors hover:text-gold"
      aria-label="Sayfanın başına dön"
    >
      Yukarı
      <ArrowUp className="size-4 transition-transform duration-[900ms] group-hover:-translate-y-1" aria-hidden="true" />
    </button>
  );
}
