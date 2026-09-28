import { siInstagram } from "simple-icons";

// Resmî Instagram glifi (simple-icons). Marka logosu elle çizilmez.
export default function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d={siInstagram.path} />
    </svg>
  );
}
