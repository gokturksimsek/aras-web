"use client";

import { useFrame, type ThreeElements } from "@react-three/fiber";
import { createContext, useContext, useRef } from "react";
import * as THREE from "three";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Sahne genelinde "hareketi azalt": tek tek prop geçmeye gerek kalmaz */
export const InstantContext = createContext(false);

// "İnşa edilir gibi" beliren grup: `on` olunca gecikmeyle yerden yükselir (ölçek),
// `on` kapanınca geri iner. Kaydırma ileri-geri gittikçe sahne kurulup sökülür.
// Pivot alttadır: çocukları y=0'dan yukarı doğru yerleştirin.
export default function Grow({
  on,
  delay = 0,
  speed = 2.4,
  mode = "y",
  lift = 0,
  instant: instantProp,
  children,
  ...group
}: {
  on: boolean;
  delay?: number;
  speed?: number;
  /** y: dikey büyüme · all: her yönde · x/z: yatay açılma */
  mode?: "y" | "all" | "x" | "z";
  /** Belirirken yukarıdan bu kadar inerek yerine oturur */
  lift?: number;
  /** Hareketi azalt: animasyonsuz */
  instant?: boolean;
} & ThreeElements["group"]) {
  const instant = useContext(InstantContext) || !!instantProp;
  const ref = useRef<THREE.Group>(null);
  const v = useRef(instant && on ? 1 : 0);
  const since = useRef<number | null>(null);
  const baseY = useRef<number | null>(null);
  const applied = useRef(-1);

  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    if (baseY.current === null) baseY.current = g.position.y;
    const t = state.clock.elapsedTime;

    if (on && since.current === null) since.current = t;
    if (!on) since.current = null;
    // Hareketi azalt modunda tuval yalnızca istendiğinde çizilir: gecikme beklenmez
    const target = on && (instant || (since.current !== null && t - since.current >= delay)) ? 1 : 0;

    // Yerine oturmuşsa (hedefe ulaşıldı ve uygulandı) hiçbir şey yapma
    if (v.current === target && applied.current === target) return;
    v.current = instant ? target : THREE.MathUtils.damp(v.current, target, speed, Math.min(dt, 0.05));
    if (Math.abs(v.current - target) < 0.0005) v.current = target;
    applied.current = v.current;
    const e = Math.max(easeOut(v.current), 0.0001);

    if (mode === "y") g.scale.set(1, e, 1);
    else if (mode === "x") g.scale.set(e, 1, 1);
    else if (mode === "z") g.scale.set(1, 1, e);
    else g.scale.setScalar(e);
    g.position.y = baseY.current + (1 - e) * lift;
    g.visible = v.current > 0.003;
  });

  return (
    <group ref={ref} {...group}>
      {children}
    </group>
  );
}
