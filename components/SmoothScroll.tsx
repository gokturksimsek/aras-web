"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig, useReducedMotion } from "motion/react";

// Lenis yumuşak kaydırma + global "hareketi azalt" ayarı.
// Hareketi azaltmayı seçen ziyaretçide Lenis devreye girmez.
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      {reduce ? (
        children
      ) : (
        <ReactLenis root options={{ lerp: 0.085, anchors: { offset: -80 }, autoRaf: true }}>
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
  );
}
