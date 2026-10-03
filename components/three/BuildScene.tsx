"use client";

import { ContactShadows, Edges, Environment, Lightformer, Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import Grow from "./Grow";
import { useLite } from "./Stage";
import { palette as c } from "@/lib/palette";

// "Anahtar teslim kapsamı" sahnesi: kesiti açık bir oda, kaydırdıkça
// aşama aşama inşa edilir. stage: 0 mimari · 1 tesisat · 2 elektrik ·
// 3 duvar & yüzey · 4 zemin · 5 doğrama · 6 mobilya.
// Oda: zemin 8 × 6 m, arka duvar z = -3, sol duvar x = -4, yükseklik 3.2 m.

const W = 8;
const D = 6;
const H = 3.2;
const T = 0.22; // duvar kalınlığı
const BX = -W / 2; // sol duvar x
const BZ = -D / 2; // arka duvar z
const DOOR = [1.4, 2.5] as const; // arka duvarda kapı boşluğu (x)
const WIN = { z: [0.4, 2.2] as const, y: [0.9, 2.45] as const }; // sol duvarda pencere

type S = { stage: number; instant: boolean };

// ─── Sabit geometri noktaları (modül düzeyinde: her çizimde yeniden oluşmasın) ──
type P3 = [number, number, number];
const LY = 0.012; // plan çizgilerinin yüksekliği
const tick = (x: number, z: number, horizontal: boolean): P3[] =>
  horizontal ? [[x, LY, z - 0.12], [x, LY, z + 0.12]] : [[x - 0.12, LY, z], [x + 0.12, LY, z]];
const PLAN = {
  outer1: [[BX, LY, DOOR[0] - 2], [BX, LY, BZ], [DOOR[0], LY, BZ]] as P3[],
  inner1: [[BX + T, LY, D / 2], [BX + T, LY, BZ + T], [DOOR[0], LY, BZ + T]] as P3[],
  outer2: [[DOOR[1], LY, BZ], [W / 2, LY, BZ]] as P3[],
  inner2: [[DOOR[1], LY, BZ + T], [W / 2, LY, BZ + T]] as P3[],
  outer3: [[BX, LY, WIN.z[1]], [BX, LY, D / 2]] as P3[],
  win: [0.05, 0.11, 0.17].map((o) => [[BX + o, LY, WIN.z[0]], [BX + o, LY, WIN.z[1]]] as P3[]),
  arc: Array.from({ length: 25 }, (_, i) => {
    const a = (i / 24) * (Math.PI / 2);
    const r = DOOR[1] - DOOR[0];
    return [DOOR[0] + Math.cos(a) * r, LY, BZ + T / 2 + Math.sin(a) * r] as P3;
  }),
  leaf: [[DOOR[0], LY, BZ + T / 2], [DOOR[0], LY, BZ + T / 2 + (DOOR[1] - DOOR[0])]] as P3[],
  dimX: [[BX, LY, D / 2 + 0.6], [W / 2, LY, D / 2 + 0.6]] as P3[],
  dimXa: tick(BX, D / 2 + 0.6, true),
  dimXb: tick(W / 2, D / 2 + 0.6, true),
  dimZ: [[W / 2 + 0.6, LY, BZ], [W / 2 + 0.6, LY, D / 2]] as P3[],
  dimZa: tick(W / 2 + 0.6, BZ, false),
  dimZb: tick(W / 2 + 0.6, D / 2, false),
};
const COIL: P3[] = (() => {
  const pts: P3[] = [];
  const x0 = BX + 0.6;
  const x1 = W / 2 - 0.6;
  let z = BZ + 0.6;
  let dir = 1;
  while (z <= D / 2 - 0.5) {
    pts.push([dir > 0 ? x0 : x1, 0.07, z], [dir > 0 ? x1 : x0, 0.07, z]);
    z += 0.42;
    dir *= -1;
  }
  return pts;
})();
const PIPES = {
  supplyA: [[-2.6, 0.07, BZ + 0.1], [-2.6, 0.07, BZ], [-2.6, 2.4, BZ]] as P3[],
  supplyB: [[-2.25, 0.07, BZ + 0.1], [-2.25, 0.07, BZ], [-2.25, 2.0, BZ]] as P3[],
  side: [[BX, 0.35, BZ + 0.4], [BX, 0.35, 0.2], [BX, 1.3, 0.2]] as P3[],
  condA: [[-0.6, 0.3, BZ], [-0.6, 2.9, BZ], [3.6, 2.9, BZ]] as P3[],
  condB: [[BX, 0.3, -1.2], [BX, 2.9, -1.2], [BX, 2.9, 2.6]] as P3[],
  condC: [[0.6, 0.3, BZ], [0.6, 1.4, BZ]] as P3[],
};

// ─── Ortak parçalar ────────────────────────────────────────────────────────
function Bx({
  size,
  pos,
  color,
  rough = 0.7,
  metal = 0,
  emissive,
  ei = 0,
  edges,
  rot,
  transparent,
  opacity,
}: {
  size: [number, number, number];
  pos: [number, number, number];
  color: string;
  rough?: number;
  metal?: number;
  emissive?: string;
  ei?: number;
  edges?: boolean;
  rot?: [number, number, number];
  transparent?: boolean;
  opacity?: number;
}) {
  return (
    <mesh position={pos} rotation={rot} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={rough}
        metalness={metal}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={ei}
        transparent={transparent}
        opacity={opacity ?? 1}
      />
      {edges && <Edges threshold={20} color={c.gold} transparent opacity={0.45} />}
    </mesh>
  );
}

// Bir yol boyunca boru (tesisat / kablo)
function Pipe({ points, radius, color, metal = 0.8, rough = 0.3 }: { points: [number, number, number][]; radius: number; color: string; metal?: number; rough?: number }) {
  const geo = useMemo(() => {
    const path = new THREE.CurvePath<THREE.Vector3>();
    for (let i = 0; i < points.length - 1; i++) {
      path.add(new THREE.LineCurve3(new THREE.Vector3(...points[i]), new THREE.Vector3(...points[i + 1])));
    }
    return new THREE.TubeGeometry(path, points.length * 24, radius, 10, false);
  }, [points, radius]);
  // Geometri değişince / kaldırılınca GPU belleğini serbest bırak
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial color={color} metalness={metal} roughness={rough} />
    </mesh>
  );
}

// ─── 0 · Mimari tasarım: döşeme + gold plan çizgileri ──────────────────────
function Architecture({ stage, instant }: S) {
  const gold = c.gold;
  return (
    <>
      {/* Ham beton döşeme: her aşamada görünür */}
      <Grow on={stage >= 0} mode="x" position={[0, -0.3, 0]} instant={instant}>
        <Bx size={[W + 0.6, 0.3, D + 0.6]} pos={[0, 0.15, 0]} color={c.slate} rough={0.95} edges />
      </Grow>

      <Grow on={stage >= 0} delay={0.35} mode="x" instant={instant}>
        {/* Duvar iç-dış hatları (kapı ve pencere boşlukları açık) */}
        <Line points={PLAN.outer1} color={gold} lineWidth={1.6} />
        <Line points={PLAN.inner1} color={gold} lineWidth={1} transparent opacity={0.7} />
        <Line points={PLAN.outer2} color={gold} lineWidth={1.6} />
        <Line points={PLAN.inner2} color={gold} lineWidth={1} transparent opacity={0.7} />
        <Line points={PLAN.outer3} color={gold} lineWidth={1.6} />
        {/* Pencere: üç ince çizgi */}
        {PLAN.win.map((pts, i) => (
          <Line key={i} points={pts} color={c.goldHi} lineWidth={0.8} />
        ))}
        {/* Kapı açılım yayı */}
        <Line points={PLAN.arc} color={c.goldHi} lineWidth={0.8} dashed dashSize={0.08} gapSize={0.06} />
        <Line points={PLAN.leaf} color={c.goldHi} lineWidth={0.8} />
        {/* Ölçü hatları */}
        <Line points={PLAN.dimX} color={gold} lineWidth={0.8} />
        <Line points={PLAN.dimXa} color={gold} lineWidth={1.2} />
        <Line points={PLAN.dimXb} color={gold} lineWidth={1.2} />
        <Line points={PLAN.dimZ} color={gold} lineWidth={0.8} />
        <Line points={PLAN.dimZa} color={gold} lineWidth={1.2} />
        <Line points={PLAN.dimZb} color={gold} lineWidth={1.2} />
      </Grow>
    </>
  );
}

// ─── 1 · Mekanik tesisat: yerden ısıtma + duvar içi borular ────────────────
function Plumbing({ stage, instant }: S) {
  return (
    <>
      <Grow on={stage >= 1} mode="x" instant={instant}>
        <Pipe points={COIL} radius={0.03} color={c.goldLo} />
      </Grow>
      {/* Duvar içi besleme hatları (duvar örülünce içinde kalır) */}
      <Grow on={stage >= 1} delay={0.3} instant={instant}>
        <Pipe points={PIPES.supplyA} radius={0.045} color={c.goldLo} />
        <Pipe points={PIPES.supplyB} radius={0.045} color={c.graphite} metal={0.5} />
        <Pipe points={PIPES.side} radius={0.04} color={c.goldLo} />
        <Bx size={[0.5, 0.35, 0.1]} pos={[-2.42, 0.45, BZ]} color={c.bronze} metal={0.7} rough={0.35} />
      </Grow>
    </>
  );
}

// ─── 2 · Elektrik & zayıf akım ─────────────────────────────────────────────
function Electrical({ stage, instant }: S) {
  const face = BZ + T / 2 + 0.015; // arka duvar iç yüzü
  const lface = BX + T / 2 + 0.015; // sol duvar iç yüzü
  return (
    <>
      {/* Duvar içi kanallar */}
      <Grow on={stage >= 2} instant={instant}>
        <Pipe points={PIPES.condA} radius={0.025} color={c.stone} metal={0.2} rough={0.6} />
        <Pipe points={PIPES.condB} radius={0.025} color={c.stone} metal={0.2} rough={0.6} />
        <Pipe points={PIPES.condC} radius={0.025} color={c.stone} metal={0.2} rough={0.6} />
      </Grow>
      {/* Prizler, anahtarlar, akıllı ev paneli (duvar yüzeyinde kalır) */}
      <Grow on={stage >= 2} delay={0.25} mode="all" instant={instant}>
        <Bx size={[0.12, 0.12, 0.03]} pos={[-0.6, 0.35, face]} color={c.ivory} rough={0.4} />
        <Bx size={[0.12, 0.12, 0.03]} pos={[3.6, 0.35, face]} color={c.ivory} rough={0.4} />
        <Bx size={[0.03, 0.12, 0.12]} pos={[lface, 0.35, -1.2]} color={c.ivory} rough={0.4} />
        <Bx size={[0.03, 0.12, 0.2]} pos={[lface, 1.15, 2.6]} color={c.ivory} rough={0.4} />
        {/* Akıllı ev paneli */}
        <Bx size={[0.32, 0.2, 0.03]} pos={[0.6, 1.4, face]} color={c.ink} rough={0.1} metal={0.5} emissive={c.gold} ei={0.9} />
      </Grow>
      {/* Duvara monte ışık rayı ve spotlar */}
      <Grow on={stage >= 2} delay={0.45} mode="x" instant={instant}>
        <Bx size={[5.2, 0.05, 0.05]} pos={[1.2, 2.95, BZ + 0.45]} color={c.ink} metal={0.6} rough={0.3} />
        {[-0.8, 0.4, 1.6, 2.8].map((x) => (
          <group key={x} position={[x, 2.88, BZ + 0.45]}>
            <mesh rotation={[Math.PI, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.05, 0.14, 16]} />
              <meshStandardMaterial color={c.ink} metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[0, -0.075, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.045, 16]} />
              <meshStandardMaterial color={c.goldHi} emissive={c.interior} emissiveIntensity={3} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </Grow>
    </>
  );
}

// ─── 3 · Duvar & yüzey ─────────────────────────────────────────────────────
function Walls({ stage, instant }: S) {
  const wall = (size: [number, number, number], pos: [number, number, number], d: number) => (
    <Grow on={stage >= 3} delay={d} instant={instant}>
      <Bx size={size} pos={pos} color={c.facade} rough={0.85} edges />
    </Grow>
  );
  const slats = Array.from({ length: 22 }, (_, i) => -3.55 + i * 0.145);
  return (
    <>
      {/* Arka duvar: kapı boşluğunun iki yanı + üstü */}
      {wall([DOOR[0] - BX, H, T], [(BX + DOOR[0]) / 2, H / 2, BZ], 0)}
      {wall([W / 2 - DOOR[1], H, T], [(DOOR[1] + W / 2) / 2, H / 2, BZ], 0.08)}
      {wall([DOOR[1] - DOOR[0], H - 2.3, T], [(DOOR[0] + DOOR[1]) / 2, 2.3 + (H - 2.3) / 2, BZ], 0.16)}
      {/* Sol duvar: pencere boşluğunun önü, arkası, altı, üstü */}
      {wall([T, H, WIN.z[0] - BZ], [BX, H / 2, (BZ + WIN.z[0]) / 2], 0.1)}
      {wall([T, H, D / 2 - WIN.z[1]], [BX, H / 2, (WIN.z[1] + D / 2) / 2], 0.18)}
      {wall([T, WIN.y[0], WIN.z[1] - WIN.z[0]], [BX, WIN.y[0] / 2, (WIN.z[0] + WIN.z[1]) / 2], 0.22)}
      {wall([T, H - WIN.y[1], WIN.z[1] - WIN.z[0]], [BX, WIN.y[1] + (H - WIN.y[1]) / 2, (WIN.z[0] + WIN.z[1]) / 2], 0.26)}

      {/* Ceviz çıtalı dekoratif panel */}
      <Grow on={stage >= 3} delay={0.5} instant={instant}>
        {slats.map((x, i) => (
          <Bx key={x} size={[0.09, 2.7, 0.05]} pos={[x, 1.45, BZ + T / 2 + 0.03]} color={i % 2 ? c.walnut : "#4c3628"} rough={0.6} />
        ))}
      </Grow>
      {/* Traverten kaplama şerit (sol duvar) */}
      <Grow on={stage >= 3} delay={0.6} instant={instant}>
        <Bx size={[0.04, H, 2.6]} pos={[BX + T / 2 + 0.02, H / 2, -1.6]} color={c.travertine} rough={0.95} />
      </Grow>
    </>
  );
}

// ─── 4 · Zemin: şap + meşe parke ───────────────────────────────────────────
function Floor({ stage, instant }: S) {
  const planks = useMemo(() => {
    const list: { x: number; z: number; tone: string; d: number }[] = [];
    // Uzun, dar meşe tahtalar (parke)
    const cols = 5;
    const rows = 18;
    const pw = (W - T) / cols;
    const pd = (D - T) / rows;
    const base = new THREE.Color(c.oak);
    const dark = new THREE.Color(c.walnut);
    let n = 0;
    for (let r = 0; r < rows; r++) {
      for (let k = 0; k < cols; k++) {
        const x = BX + T / 2 + pw / 2 + k * pw;
        const z = BZ + T / 2 + pd / 2 + r * pd;
        const tone = base.clone().lerp(dark, ((k * 7 + r * 13) % 10) / 28).getStyle();
        list.push({ x, z, tone, d: 0.25 + r * 0.06 + k * 0.03 + (n++ % 3) * 0.01 });
      }
    }
    return { list, pw, pd };
  }, []);

  return (
    <>
      {/* Şap */}
      <Grow on={stage >= 4} mode="x" instant={instant}>
        <Bx size={[W - T, 0.1, D - T]} pos={[T / 2, 0.06, T / 2]} color="#6d6a64" rough={1} />
      </Grow>
      {/* Parkeler: tek tek yerine oturur */}
      {planks.list.map((p, i) => (
        <Grow key={i} on={stage >= 4} delay={p.d} mode="all" lift={0.5} position={[p.x, 0.11, p.z]} instant={instant}>
          <Bx size={[planks.pw - 0.015, 0.05, planks.pd - 0.015]} pos={[0, 0.025, 0]} color={p.tone} rough={0.55} />
        </Grow>
      ))}
    </>
  );
}

// ─── 5 · Kapı, cam & doğrama ───────────────────────────────────────────────
function Joinery({ stage, instant }: S) {
  const fz = (WIN.z[0] + WIN.z[1]) / 2;
  const fh = WIN.y[1] - WIN.y[0];
  const fw = WIN.z[1] - WIN.z[0];
  const frame = c.graphite;
  return (
    <>
      {/* Pencere doğraması + cam */}
      <Grow on={stage >= 5} mode="all" position={[BX, WIN.y[0], fz]} instant={instant}>
        <Bx size={[T + 0.04, 0.07, fw]} pos={[0, 0.035, 0]} color={frame} metal={0.6} rough={0.3} />
        <Bx size={[T + 0.04, 0.07, fw]} pos={[0, fh - 0.035, 0]} color={frame} metal={0.6} rough={0.3} />
        <Bx size={[T + 0.04, fh, 0.07]} pos={[0, fh / 2, -fw / 2 + 0.035]} color={frame} metal={0.6} rough={0.3} />
        <Bx size={[T + 0.04, fh, 0.07]} pos={[0, fh / 2, fw / 2 - 0.035]} color={frame} metal={0.6} rough={0.3} />
        <Bx size={[T + 0.04, fh, 0.05]} pos={[0, fh / 2, 0]} color={frame} metal={0.6} rough={0.3} />
        <Bx size={[0.02, fh - 0.1, fw - 0.1]} pos={[0, fh / 2, 0]} color={c.glass} metal={0.9} rough={0.05} transparent opacity={0.35} />
        {/* Gold denizlik */}
        <Bx size={[T + 0.2, 0.03, fw + 0.1]} pos={[0.05, -0.015, 0]} color={c.gold} metal={0.9} rough={0.25} />
      </Grow>
      {/* Kapı kasası + aralık duran ceviz kapı */}
      <Grow on={stage >= 5} delay={0.3} instant={instant}>
        <Bx size={[0.08, 2.3, T + 0.04]} pos={[DOOR[0] + 0.04, 1.15, BZ]} color={frame} metal={0.6} rough={0.3} />
        <Bx size={[0.08, 2.3, T + 0.04]} pos={[DOOR[1] - 0.04, 1.15, BZ]} color={frame} metal={0.6} rough={0.3} />
        <Bx size={[DOOR[1] - DOOR[0], 0.08, T + 0.04]} pos={[(DOOR[0] + DOOR[1]) / 2, 2.26, BZ]} color={frame} metal={0.6} rough={0.3} />
        <group position={[DOOR[0] + 0.08, 0, BZ + T / 2]} rotation={[0, -0.55, 0]}>
          <Bx size={[DOOR[1] - DOOR[0] - 0.16, 2.2, 0.05]} pos={[(DOOR[1] - DOOR[0] - 0.16) / 2, 1.12, 0]} color={c.walnut} rough={0.5} />
          <Bx size={[0.03, 0.5, 0.03]} pos={[DOOR[1] - DOOR[0] - 0.3, 1.05, 0.05]} color={c.gold} metal={0.9} rough={0.2} />
        </group>
      </Grow>
    </>
  );
}

// ─── 6 · Mobilya & özel imalat ─────────────────────────────────────────────
function Furniture({ stage, instant }: S) {
  const on = stage >= 6;
  const fabric = "#3a3a3f";
  return (
    <>
      {/* Halı */}
      <Grow on={on} mode="x" position={[0.4, 0.165, 0.9]} instant={instant}>
        <Bx size={[3.4, 0.02, 2.4]} pos={[0, 0.01, 0]} color={c.sand} rough={1} />
      </Grow>
      {/* Koltuk */}
      <Grow on={on} delay={0.15} mode="all" lift={0.6} position={[0.4, 0.17, 2.25]} instant={instant}>
        <Bx size={[2.8, 0.42, 0.95]} pos={[0, 0.21, 0]} color={fabric} rough={0.95} />
        <Bx size={[2.8, 0.5, 0.22]} pos={[0, 0.62, 0.37]} color={fabric} rough={0.95} />
        <Bx size={[0.2, 0.6, 0.95]} pos={[-1.4, 0.3, 0]} color={fabric} rough={0.95} />
        <Bx size={[0.2, 0.6, 0.95]} pos={[1.4, 0.3, 0]} color={fabric} rough={0.95} />
        <Bx size={[1.25, 0.12, 0.7]} pos={[-0.64, 0.48, -0.05]} color={c.mist} rough={0.9} />
        <Bx size={[1.25, 0.12, 0.7]} pos={[0.64, 0.48, -0.05]} color={c.mist} rough={0.9} />
      </Grow>
      {/* Sehpa */}
      <Grow on={on} delay={0.3} mode="all" lift={0.5} position={[0.4, 0.17, 0.9]} instant={instant}>
        <Bx size={[1.2, 0.06, 0.7]} pos={[0, 0.38, 0]} color={c.walnut} rough={0.45} />
        <Bx size={[1.0, 0.35, 0.5]} pos={[0, 0.175, 0]} color={c.travertine} rough={0.9} />
      </Grow>
      {/* TV ünitesi + ekran (çıtalı panelin önünde) */}
      <Grow on={on} delay={0.45} mode="all" lift={0.4} position={[-1.9, 0.17, BZ + T / 2 + 0.3]} instant={instant}>
        <Bx size={[3, 0.42, 0.45]} pos={[0, 0.21, 0]} color={c.walnut} rough={0.5} />
        <Bx size={[3, 0.02, 0.46]} pos={[0, 0.43, 0]} color={c.gold} metal={0.9} rough={0.25} />
        <Bx size={[1.9, 1.07, 0.04]} pos={[0, 1.55, -0.18]} color={c.ink} rough={0.15} metal={0.6} />
      </Grow>
      {/* Lake gardırop (sol duvar boyunca) */}
      <Grow on={on} delay={0.6} instant={instant} position={[BX + T / 2 + 0.33, 0.17, -1.55]}>
        <Bx size={[0.62, 2.7, 2.5]} pos={[0, 1.35, 0]} color={c.ivory} rough={0.25} edges />
        {[-0.62, 0, 0.62].map((z) => (
          <Bx key={z} size={[0.02, 1.0, 0.02]} pos={[0.32, 1.35, z + 0.25]} color={c.gold} metal={0.9} rough={0.2} />
        ))}
      </Grow>
      {/* Mutfak adası: ceviz gövde + traverten tezgâh */}
      <Grow on={on} delay={0.75} mode="all" lift={0.6} position={[2.75, 0.17, 0.4]} instant={instant}>
        <Bx size={[0.95, 0.88, 2.1]} pos={[0, 0.44, 0]} color={c.walnut} rough={0.5} />
        <Bx size={[1.1, 0.06, 2.25]} pos={[0, 0.91, 0]} color={c.travertine} rough={0.7} edges />
      </Grow>
      {/* Sarkıt aydınlatmalar */}
      <Grow on={on} delay={0.95} lift={0.8} position={[2.75, 2.35, 0.4]} instant={instant}>
        {[-0.6, 0, 0.6].map((z) => (
          <group key={z} position={[0, 0, z]}>
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.005, 0.005, 0.9, 6]} />
              <meshStandardMaterial color={c.ink} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.11, 24, 16]} />
              <meshStandardMaterial color={c.goldHi} emissive={c.interior} emissiveIntensity={2.4} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </Grow>
    </>
  );
}

// Mobilya gelince yanan sıcak ışık
function WarmLight({ on, instant }: { on: boolean; instant: boolean }) {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const target = on ? 9 : 0;
    ref.current.intensity = instant ? target : THREE.MathUtils.damp(ref.current.intensity, target, 2, Math.min(dt, 0.05));
  });
  return <pointLight ref={ref} position={[2.75, 2.1, 0.4]} distance={8} color={c.interior} intensity={0} />;
}

// Her aşamanın kamera planı: [açı, yükseklik, uzaklık, hedef y]
const shots: [number, number, number, number][] = [
  [0.62, 12.5, 9.5, 0], // plan: yukarıdan
  [0.95, 5.5, 11, 0.3], // tesisat: alçak açı
  [0.45, 6.5, 11.5, 1.6], // elektrik: duvarlara
  [0.78, 6.5, 13, 1.4], // duvar
  [1.05, 8.5, 11.5, 0.3], // zemin
  [0.28, 5.5, 12, 1.5], // doğrama: pencere ve kapı
  [0.82, 7.2, 14, 1.1], // mobilya: genel görünüm
];

function CameraRig({ stage, instant }: S) {
  const { camera, size } = useThree();
  const cur = useRef<[number, number, number, number] | null>(null);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const shot = shots[Math.max(0, Math.min(stage, shots.length - 1))];
    if (!cur.current) cur.current = [...shot];
    const k = instant ? 1 : 1 - Math.exp(-1.8 * Math.min(dt, 0.05));
    for (let i = 0; i < 4; i++) cur.current[i] += (shot[i] - cur.current[i]) * k;
    const [a0, h, r0, ty] = cur.current;
    // Panel en/boy oranına göre uzaklık: dar panelde oda kadraja sığsın
    const aspect = size.width / size.height;
    const r = r0 * (aspect < 0.9 ? 1.75 : aspect < 1.3 ? 1.4 : 1.12);
    // Fare konumu sayfa genelinden okunur (metin sütunu dahil); ±1'e sınırla
    const px = instant ? 0 : THREE.MathUtils.clamp(state.pointer.x, -1, 1);
    const py = instant ? 0 : THREE.MathUtils.clamp(state.pointer.y, -1, 1);
    const a = a0 + px * 0.08;
    camera.position.set(Math.sin(a) * r + 0.4, h - py * 0.4, Math.cos(a) * r + 0.4);
    camera.lookAt(look.set(0.2, ty, 0));
  });
  return null;
}

export default function BuildScene({ stage, instant }: S) {
  const lite = useLite();
  return (
    <>
      <color attach="background" args={[c.anthracite]} />
      <fog attach="fog" args={[c.anthracite, 18, 40]} />

      <ambientLight intensity={0.3} />
      <hemisphereLight args={["#e6ebf0", c.ink, 0.5]} />
      <directionalLight position={[7, 12, 9]} intensity={2.2} color="#fff6ea" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0004}>
        <orthographicCamera attach="shadow-camera" args={[-9, 9, 9, -9, 1, 40]} />
      </directionalLight>
      <directionalLight position={[-6, 4, 8]} intensity={0.8} color={c.gold} />
      <WarmLight on={stage >= 6} instant={instant} />

      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[0, 6, 6]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} color={c.goldHi} position={[-6, 3, -4]} rotation-y={Math.PI / 3} scale={[6, 2, 1]} />
      </Environment>

      <group position={[0.4, 0, 0.4]}>
        <Architecture stage={stage} instant={instant} />
        <Plumbing stage={stage} instant={instant} />
        <Electrical stage={stage} instant={instant} />
        <Walls stage={stage} instant={instant} />
        <Floor stage={stage} instant={instant} />
        <Joinery stage={stage} instant={instant} />
        <Furniture stage={stage} instant={instant} />
      </group>

      <ContactShadows position={[0, -0.31, 0]} opacity={0.5} scale={20} blur={2.4} far={6} resolution={lite ? 256 : 512} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.32, 0]} receiveShadow>
        <circleGeometry args={[30, 48]} />
        <meshStandardMaterial color={c.anthracite} roughness={1} />
      </mesh>

      <CameraRig stage={stage} instant={instant} />

      {!lite && (
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur intensity={0.6} luminanceThreshold={0.7} luminanceSmoothing={0.2} radius={0.6} />
        <Vignette offset={0.3} darkness={0.6} />
      </EffectComposer>
      )}
    </>
  );
}
