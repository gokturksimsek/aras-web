"use client";

import type { MotionValue } from "motion/react";
import { useRef } from "react";
import Stage from "./Stage";
import VillaScene, { type Spin } from "./VillaScene";

// Hero 3D maketi (yalnızca tarayıcıda yüklenir). Boş alanda yatay sürükleme
// villayı 360° döndürür; dikey kaydırma (telefonda) sayfayı kaydırmaya devam eder.
export default function HeroCanvas({
  ready,
  instant,
  scroll,
  onLost,
}: {
  ready: boolean;
  instant: boolean;
  scroll: MotionValue<number>;
  onLost: () => void;
}) {
  const spin = useRef<Spin>({ target: -0.35, dragging: false }).current;
  const last = useRef(0);

  return (
    <div
      className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
      onPointerDown={(e) => {
        spin.dragging = true;
        last.current = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!spin.dragging) return;
        spin.target += (e.clientX - last.current) * 0.009;
        last.current = e.clientX;
      }}
      onPointerUp={() => (spin.dragging = false)}
      onPointerCancel={() => (spin.dragging = false)}
    >
      <Stage
        className="absolute inset-0"
        shadows
        instant={instant}
        onLost={onLost}
        camera={{ position: [14, 6, 14], fov: 30 }}
        label="Dönen sergi tablası üzerinde, akşam ışığında modern villa maketinin üç boyutlu görünümü"
      >
        <VillaScene ready={ready} instant={instant} scroll={scroll} spin={spin} />
      </Stage>
    </div>
  );
}
