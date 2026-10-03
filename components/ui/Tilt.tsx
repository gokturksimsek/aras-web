"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import clsx from "clsx";

// Fareyle hafifçe eğilen 3D kart (perspektif). İçteki `data-depth` öğeleri
// CSS translateZ ile öne çıkar. Dokunmatik ekranda ve "hareketi azalt"ta kapalı.
export default function Tilt({
  children,
  className,
  max = 7,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  useEffect(() => setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches), []);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 160, damping: 18, mass: 0.4 });
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  // Yüzeyde gezinen parlama
  const glare = useMotionTemplate`radial-gradient(circle at ${useTransform(sx, (v) => v * 100)}% ${useTransform(sy, (v) => v * 100)}%, rgb(236 210 164 / 0.16), transparent 55%)`;

  const on = fine && !reduce;

  return (
    <div className={clsx("[perspective:1100px]", className)}>
      <motion.div
        className="group/tilt relative h-full [transform-style:preserve-3d]"
        style={on ? { rotateX, rotateY } : undefined}
        onPointerMove={(e) => {
          if (!on) return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
      >
        {children}
        {on && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
            style={{ background: glare }}
          />
        )}
      </motion.div>
    </div>
  );
}
