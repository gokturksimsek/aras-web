"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Phone } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/site";

// Mobilde sabit "Hemen Ara" butonu: hero geçilince çıkar; iletişim bölümü ve footer'da gizlenir.
export default function CallButton() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const contact = document.getElementById("iletisim");
    const reachedContact = contact ? y + window.innerHeight > contact.offsetTop + 80 : false;
    setShow(y > window.innerHeight * 0.8 && !reachedContact);
  });

  if (!site.phone) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          key="call"
          href={site.phoneHref}
          aria-label={`Hemen arayın: ${site.phone}`}
          className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex min-h-12 items-center gap-2.5 bg-gradient-to-r from-gold-lo via-gold to-gold-hi px-5 text-[0.7rem] font-semibold tracking-[0.2em] text-ink uppercase shadow-lg shadow-ink/60 md:hidden"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Phone className="size-4" aria-hidden="true" />
          Hemen Ara
        </motion.a>
      )}
    </AnimatePresence>
  );
}
