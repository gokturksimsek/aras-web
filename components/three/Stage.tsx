"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Hafif mod: telefon / dokunmatik / zayıf GPU. Sahneler bunu okuyup yansıma,
// gölge haritası ve ışıma (bloom) gibi pahalı katmanları kapatır.
const LiteContext = createContext(false);
export const useLite = () => useContext(LiteContext);

const startsLite = () =>
  window.innerWidth < 768 ||
  window.matchMedia("(pointer: coarse)").matches ||
  (navigator.hardwareConcurrency ?? 8) <= 4;

// Ortak 3D tuval: ekran dışındayken çizimi durdurur, düşük performansta önce
// çözünürlüğü, sonra efektleri düşürür. 3D bağlamı kaybolursa onLost çağrılır
// (üst bileşen fotoğrafa döner). Bu modül yalnızca tarayıcıda yüklenir (next/dynamic).
export default function Stage({
  children,
  camera,
  className,
  shadows = false,
  instant = false,
  onLost,
  label,
}: {
  children: React.ReactNode;
  camera?: { position: [number, number, number]; fov: number };
  className?: string;
  shadows?: boolean;
  /** Hareketi azalt: yalnızca değişiklikte çiz */
  instant?: boolean;
  onLost?: () => void;
  label: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [lite, setLite] = useState(startsLite);
  // Kenar yumuşatma tuval oluşurken bir kez belirlenir (sonradan değişmez)
  const [initialLite] = useState(lite);
  const [dpr, setDpr] = useState(() => Math.min(lite ? 1.25 : 1.5, window.devicePixelRatio || 1));

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={className} role="img" aria-label={label}>
      <Canvas
        frameloop={!visible ? "never" : instant ? "demand" : "always"}
        dpr={[1, dpr]}
        shadows={shadows && !lite ? "soft" : false}
        camera={camera ?? { position: [12, 6, 14], fov: 32 }}
        // Efekt katmanı (EffectComposer) kendi kenar yumuşatmasını yapar; hafif modda efekt yok
        gl={{ antialias: initialLite, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ position: "absolute", inset: 0 }}
        // Metin katmanı tuvalin üstünde; fare konumunu sayfa genelinden oku (paralaks için)
        eventSource={document.body}
        eventPrefix="client"
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            onLost?.();
          });
        }}
      >
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => (dpr > 1 ? setDpr(1) : setLite(true))}
          onFallback={() => {
            setDpr(1);
            setLite(true);
          }}
        />
        <LiteContext.Provider value={lite}>{children}</LiteContext.Provider>
      </Canvas>
    </div>
  );
}
