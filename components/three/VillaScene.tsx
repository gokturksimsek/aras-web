"use client";

import { ContactShadows, Edges, Environment, Grid, Lightformer, MeshReflectorMaterial, RoundedBox, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { MotionValue } from "motion/react";
import Grow, { InstantContext } from "./Grow";
import { useLite } from "./Stage";
import { palette as c } from "@/lib/palette";

// Hero: akşam ışığında modern villa maketi. Açılışta parça parça kurulur,
// fareyle hafifçe yön değiştirir, kaydırdıkça kamera etrafında süzülür.

type Box = {
  size: [number, number, number];
  pos: [number, number, number]; // alt-orta noktası (pivot altta)
  color: string;
  rough?: number;
  metal?: number;
  emissive?: string;
  emissiveIntensity?: number;
  edges?: boolean;
  delay: number;
  mode?: "y" | "all" | "x" | "z";
};

function Block({ b, on, instant }: { b: Box; on: boolean; instant: boolean }) {
  const [w, h, d] = b.size;
  return (
    <Grow on={on} delay={b.delay} mode={b.mode ?? "y"} position={b.pos} instant={instant}>
      {/* Hafif yuvarlatılmış kenar: ışığı yakalar, maket kalitesinde görünür */}
      <RoundedBox args={[w, h, d]} radius={Math.min(0.035, Math.min(w, h, d) / 2.2)} smoothness={4} position={[0, h / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial
          color={b.color}
          roughness={b.rough ?? 0.7}
          metalness={b.metal ?? 0}
          emissive={b.emissive ?? "#000000"}
          emissiveIntensity={b.emissiveIntensity ?? 0}
        />
        {b.edges && <Edges threshold={40} color={c.gold} transparent opacity={0.5} />}
      </RoundedBox>
    </Grow>
  );
}

const PLINTH_Y = 0.32;
const GF_H = 2.7; // zemin kat yüksekliği
const SLAB = 0.22;
const UF_H = 2.4; // üst kat yüksekliği
const UF_Y = PLINTH_Y + GF_H + SLAB;

const blocks: Box[] = [
  // Zemin platformu ve teras
  { size: [13, PLINTH_Y, 8], pos: [0, 0, 0], color: c.slate, rough: 0.85, delay: 0.0, mode: "x" },
  // Zemin kat: sıcak ışıklı iç hacim (cam cephenin arkası)
  { size: [6.2, GF_H, 3.6], pos: [-0.9, PLINTH_Y, -0.7], color: "#2a2016", emissive: c.interior, emissiveIntensity: 1.15, rough: 0.6, delay: 0.45 },
  // Zemin kat traverten duvar
  { size: [0.55, GF_H, 4.2], pos: [-4.25, PLINTH_Y, -0.6], color: c.travertine, rough: 0.95, edges: true, delay: 0.55 },
  // Arka duvar
  { size: [7, GF_H, 0.3], pos: [-0.75, PLINTH_Y, -2.6], color: c.facade, rough: 0.8, delay: 0.6 },
  // Kolonlar (konsolun altı)
  { size: [0.16, GF_H, 0.16], pos: [3.9, PLINTH_Y, 1.35], color: c.graphite, metal: 0.4, rough: 0.4, delay: 0.7 },
  { size: [0.16, GF_H, 0.16], pos: [3.9, PLINTH_Y, -2.2], color: c.graphite, metal: 0.4, rough: 0.4, delay: 0.72 },
  // Ara döşeme
  { size: [8.4, SLAB, 4.9], pos: [0.2, PLINTH_Y + GF_H, -0.4], color: c.graphite, rough: 0.5, edges: true, delay: 0.85, mode: "x" },
  // Üst kat: beyaz sıva, öne ve yana taşan konsol hacim
  { size: [8.2, UF_H, 4.4], pos: [0.9, UF_Y, -0.45], color: c.facade, rough: 0.75, edges: true, delay: 1.05 },
  // Çatı döşemesi (saçak)
  { size: [9.2, 0.2, 5.2], pos: [0.9, UF_Y + UF_H, -0.45], color: c.ivory, rough: 0.6, edges: true, delay: 1.35, mode: "x" },
];

// Cam cephe kayıtları (zemin kat önü)
const mullions = Array.from({ length: 6 }, (_, i) => -3.08 + i * 1.232); // cam grubuna göre yerel x

// Üst kat yan cephedeki bronz lameller
const louvers = Array.from({ length: 13 }, (_, i) => -2.45 + i * 0.36);


// ─── Su: dalgalanan ışık desenli (kostik) havuz suyu ───────────────────────
const waterVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const waterFrag = /* glsl */ `
  uniform float uTime;
  uniform vec2 uScale;
  uniform vec3 uDeep;
  uniform vec3 uLight;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * uScale;
    float t = uTime * 0.6;
    // Üst üste binen dalgalar → kostik ağ deseni
    float w = 0.0;
    vec2 q = p;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      q += vec2(sin(q.y * 1.7 + t + fi * 1.3), cos(q.x * 1.5 - t * 0.8 + fi)) * 0.35;
      w += sin(q.x * 2.1 + t) * cos(q.y * 2.3 - t * 0.7);
    }
    float caustic = pow(abs(sin(w * 1.6)), 14.0);
    // Kenarlara doğru LED parlaması
    vec2 e = min(vUv, 1.0 - vUv);
    float edge = 1.0 - smoothstep(0.0, 0.16, min(e.x, e.y));
    vec3 col = mix(uDeep, uLight, 0.35 + 0.25 * sin(p.x * 0.6 + t * 0.3));
    col += uLight * caustic * 0.32 + uLight * edge * 0.5;
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Water({ size, round = false }: { size: [number, number]; round?: boolean }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: waterVert,
        fragmentShader: waterFrag,
        uniforms: {
          uTime: { value: 0 },
          uScale: { value: new THREE.Vector2(size[0] * 3.2, size[1] * 3.2) },
          uDeep: { value: new THREE.Color(c.poolDeep) },
          uLight: { value: new THREE.Color(c.poolLight) },
        },
        toneMapped: false,
      }),
    [size],
  );
  useEffect(() => () => mat.dispose(), [mat]);
  useFrame((_, dt) => {
    mat.uniforms.uTime.value += Math.min(dt, 0.05);
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={mat}>
      {round ? <circleGeometry args={[size[0] / 2, 64]} /> : <planeGeometry args={size} />}
    </mesh>
  );
}

const POOL = { x: -2.8, z: 2.55, w: 5.0, d: 2.0 }; // su yüzeyi ölçüsü
const COPING = 0.22; // traverten kenar genişliği

function Pool({ ready, instant }: { ready: boolean; instant: boolean }) {
  const y = PLINTH_Y;
  const W = POOL.w + COPING * 2;
  const D = POOL.d + COPING * 2;
  return (
    <Grow on={ready} delay={0.3} mode="x" position={[POOL.x, y, POOL.z]} instant={instant}>
      {/* Traverten kenar taşları */}
      {[
        { s: [W, 0.07, COPING], p: [0, 0.035, -D / 2 + COPING / 2] },
        { s: [W, 0.07, COPING], p: [0, 0.035, D / 2 - COPING / 2] },
        { s: [COPING, 0.07, POOL.d], p: [-W / 2 + COPING / 2, 0.035, 0] },
        { s: [COPING, 0.07, POOL.d], p: [W / 2 - COPING / 2, 0.035, 0] },
      ].map((k, i) => (
        <RoundedBox key={i} args={k.s as [number, number, number]} radius={0.02} smoothness={3} position={k.p as [number, number, number]} castShadow receiveShadow>
          <meshStandardMaterial color={c.travertine} roughness={0.75} />
        </RoundedBox>
      ))}
      {/* Su yüzeyi (kenarın biraz altında) */}
      <group position={[0, 0.012, 0]}>
        <Water size={[POOL.w, POOL.d]} />
      </group>
      {/* Sualtı LED hattı: iç kenar boyunca gün ışığı */}
      {[
        { s: [POOL.w, 0.02, 0.02], p: [0, 0.02, -POOL.d / 2 + 0.02] },
        { s: [POOL.w, 0.02, 0.02], p: [0, 0.02, POOL.d / 2 - 0.02] },
      ].map((k, i) => (
        <mesh key={i} position={k.p as [number, number, number]}>
          <boxGeometry args={k.s as [number, number, number]} />
          <meshStandardMaterial color={c.daylight} emissive={c.poolLight} emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
      ))}
      {/* Havuzun çevresini aydınlatan turkuaz ışık */}
      <pointLight position={[0, 0.6, 0]} intensity={5} distance={6} color={c.poolLight} />
    </Grow>
  );
}

// Küçük yuvarlak jakuzi (podyum önü)
function Spa({ ready, instant }: { ready: boolean; instant: boolean }) {
  return (
    <Grow on={ready} delay={2.2} mode="all" position={[-5.3, 0, 5.4]} instant={instant}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 1.1, 0.4, 64]} />
        <meshStandardMaterial color={c.travertine} roughness={0.7} />
      </mesh>
      <group position={[0, 0.405, 0]}>
        <Water size={[1.7, 1.7]} round />
      </group>
      <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.84, 0.87, 64]} />
        <meshStandardMaterial color={c.daylight} emissive={c.poolLight} emissiveIntensity={2.2} toneMapped={false} />
      </mesh>
    </Grow>
  );
}

// Gün ışığı LED'leri: platform çevresi (havada asılı etkisi), saçak altı lineer LED + spotlar,
// traverten duvarı yalayan ışık, basamak taşı aydınlatmaları
function LedStrip({ size, pos, intensity = 2.6 }: { size: [number, number, number]; pos: [number, number, number]; intensity?: number }) {
  return (
    <mesh position={pos}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={c.daylight} emissive={c.daylight} emissiveIntensity={intensity} toneMapped={false} />
    </mesh>
  );
}

function Leds({ ready, instant }: { ready: boolean; instant: boolean }) {
  const ly = PLINTH_Y - 0.06; // platform üst dudağının hemen altı
  const soffitY = PLINTH_Y + GF_H - 0.012; // ara döşemenin alt yüzü
  return (
    <>
      {/* Platform çevresi şerit LED */}
      <Grow on={ready} delay={1.7} mode="x" instant={instant}>
        <LedStrip size={[13, 0.025, 0.02]} pos={[0, ly, 4.01]} />
        <LedStrip size={[13, 0.025, 0.02]} pos={[0, ly, -4.01]} />
        <LedStrip size={[0.02, 0.025, 8]} pos={[6.51, ly, 0]} />
        <LedStrip size={[0.02, 0.025, 8]} pos={[-6.51, ly, 0]} />
      </Grow>
      {/* Ara döşeme altı: lineer LED + gömme spotlar */}
      <Grow on={ready} delay={1.85} mode="x" instant={instant}>
        <LedStrip size={[8.2, 0.02, 0.03]} pos={[0.2, soffitY, 1.98]} intensity={3} />
        {[-3.2, -1.6, 0, 1.6, 3.2].map((x) => (
          <mesh key={x} position={[x, soffitY, 1.55]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.06, 20]} />
            <meshStandardMaterial color={c.daylight} emissive={c.daylight} emissiveIntensity={4} toneMapped={false} />
          </mesh>
        ))}
      </Grow>
      {/* Spotların cepheye düşen ışığı */}
      {ready && (
        <>
          <pointLight position={[-1.6, soffitY - 0.3, 1.7]} intensity={3.2} distance={4.5} color={c.daylight} />
          <pointLight position={[1.6, soffitY - 0.3, 1.7]} intensity={3.2} distance={4.5} color={c.daylight} />
          {/* Traverten duvarı yalayan ışık */}
          <pointLight position={[-3.7, PLINTH_Y + 0.15, -0.2]} intensity={4} distance={3.5} color={c.daylight} />
        </>
      )}
    </>
  );
}

function Villa({ ready, instant }: { ready: boolean; instant: boolean }) {
  return (
    <group>
      {blocks.map((b, i) => (
        <Block key={i} b={b} on={ready} instant={instant} />
      ))}

      {/* Zemin kat cam cephe + kayıtlar */}
      <Grow on={ready} delay={0.65} position={[-0.9, PLINTH_Y, 1.12]} instant={instant}>
        <mesh position={[0, GF_H / 2, 0]}>
          <boxGeometry args={[6.2, GF_H, 0.04]} />
          <meshPhysicalMaterial color={c.glass} transparent opacity={0.3} roughness={0.03} metalness={0.6} clearcoat={1} clearcoatRoughness={0.05} />
        </mesh>
        {mullions.map((x) => (
          <mesh key={x} position={[x, GF_H / 2, 0.03]}>
            <boxGeometry args={[0.05, GF_H, 0.06]} />
            <meshStandardMaterial color={c.graphite} metalness={0.6} roughness={0.35} />
          </mesh>
        ))}
      </Grow>

      {/* Üst kat uzun bant pencere: içeriden sıcak ışık */}
      <Grow on={ready} delay={1.25} mode="x" position={[0.6, UF_Y + 0.75, 1.79]} instant={instant}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[6.4, 1.0, 0.06]} />
          <meshStandardMaterial color="#2a2016" emissive={c.interior} emissiveIntensity={0.85} roughness={0.2} />
          <Edges color={c.gold} transparent opacity={0.8} />
        </mesh>
        {/* Bant pencere doğrama kayıtları */}
        {[-2.4, -1.2, 0, 1.2, 2.4].map((x) => (
          <mesh key={x} position={[x, 0.5, 0.04]}>
            <boxGeometry args={[0.05, 1.0, 0.04]} />
            <meshStandardMaterial color={c.graphite} metalness={0.6} roughness={0.35} />
          </mesh>
        ))}
      </Grow>

      {/* Bronz lameller (üst kat sağ cephe) */}
      <Grow on={ready} delay={1.45} position={[5.05, UF_Y + 0.1, 0]} instant={instant}>
        {louvers.map((z) => (
          <mesh key={z} position={[0, 1.1, z]}>
            <boxGeometry args={[0.07, 2.2, 0.22]} />
            <meshStandardMaterial color={c.bronze} metalness={0.7} roughness={0.35} />
          </mesh>
        ))}
      </Grow>

      {/* Saçak altı gold ışık hattı */}
      <Grow on={ready} delay={1.6} mode="x" position={[0.9, UF_Y + UF_H - 0.03, 2.16]} instant={instant}>
        <mesh>
          <boxGeometry args={[9.2, 0.035, 0.035]} />
          <meshStandardMaterial color={c.goldHi} emissive={c.gold} emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
      </Grow>

      {/* Işıklı havuz (traverten kenar + dalgalı su + sualtı LED) */}
      <Pool ready={ready} instant={instant} />

      {/* Gün ışığı LED'leri */}
      <Leds ready={ready} instant={instant} />
    </group>
  );
}


// ─── Dönen sergi tablası: villa + dekor 360° döner ─────────────────────────
/** Sürükleme durumu (HeroCanvas'tan gelir; ref olduğu için yeniden çizim tetiklemez) */
export type Spin = { target: number; dragging: boolean };

function Turntable({ spin, instant, children }: { spin: Spin; instant: boolean; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    // Bırakıldığında yavaşça kendi kendine tur atar (tam bir tur ≈ 50 sn)
    if (!spin.dragging && !instant) spin.target += d * 0.125;
    g.rotation.y = instant ? spin.target : THREE.MathUtils.damp(g.rotation.y, spin.target, 5, d);
  });
  return <group ref={ref}>{children}</group>;
}

// Koyu mermer podyum + gold halkalar
function Podium({ ready, instant }: { ready: boolean; instant: boolean }) {
  return (
    <Grow on={ready} mode="all" instant={instant}>
      <mesh position={[0, -0.22, 0]} receiveShadow>
        <cylinderGeometry args={[8.8, 9.15, 0.44, 128]} />
        <meshStandardMaterial color={c.graphite} roughness={0.22} metalness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[8.5, 8.6, 160]} />
        <meshStandardMaterial color={c.goldHi} emissive={c.gold} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.44, 0]}>
        <torusGeometry args={[9.15, 0.025, 8, 160]} />
        <meshStandardMaterial color={c.goldHi} emissive={c.gold} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
    </Grow>
  );
}

// Akdeniz servisi
function Cypress({ pos, h = 3.6, d = 0 }: { pos: [number, number, number]; h?: number; d?: number }) {
  return (
    <Grow on delay={d} position={pos}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.4, 8]} />
        <meshStandardMaterial color={c.walnut} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.4 + h / 2, 0]} castShadow>
        <coneGeometry args={[0.46, h, 14]} />
        <meshStandardMaterial color="#2f4636" roughness={0.8} />
      </mesh>
    </Grow>
  );
}

// Saksıda küre şimşir
function Boxwood({ pos, d = 0 }: { pos: [number, number, number]; d?: number }) {
  return (
    <Grow on delay={d} mode="all" position={pos}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.7, 0.6, 0.7]} />
        <meshStandardMaterial color={c.travertine} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.98, 0]} castShadow>
        <sphereGeometry args={[0.44, 24, 16]} />
        <meshStandardMaterial color="#35503d" roughness={0.85} />
      </mesh>
    </Grow>
  );
}

// Şezlong
function Lounger({ pos, d = 0 }: { pos: [number, number, number]; d?: number }) {
  return (
    <Grow on delay={d} mode="all" position={pos}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[1.8, 0.12, 0.62]} />
        <meshStandardMaterial color={c.ivory} roughness={0.7} />
      </mesh>
      <mesh position={[-0.78, 0.42, 0]} rotation={[0, 0, -0.75]} castShadow>
        <boxGeometry args={[0.62, 0.1, 0.62]} />
        <meshStandardMaterial color={c.ivory} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[1.6, 0.14, 0.5]} />
        <meshStandardMaterial color={c.walnut} roughness={0.6} />
      </mesh>
    </Grow>
  );
}

// Bahçe aydınlatma babası
function Bollard({ pos, d = 0 }: { pos: [number, number, number]; d?: number }) {
  return (
    <Grow on delay={d} position={pos}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.56, 12]} />
        <meshStandardMaterial color={c.graphite} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.072, 0.072, 0.08, 12]} />
        <meshStandardMaterial color={c.goldHi} emissive={c.interior} emissiveIntensity={3} toneMapped={false} />
      </mesh>
    </Grow>
  );
}

// Peyzaj, havuz başı ve çatı pergolası
function Decor({ ready }: { ready: boolean }) {
  const roofY = UF_Y + UF_H + 0.2;
  const slats = Array.from({ length: 11 }, (_, i) => -1.9 + i * 0.34);
  if (!ready) return null;
  return (
    <group>
      {/* Selviler: arka köşelerde ritim */}
      <Cypress pos={[6.0, PLINTH_Y, -3.3]} h={4.2} d={1.9} />
      <Cypress pos={[5.1, PLINTH_Y, -3.5]} h={3.4} d={2.0} />
      <Cypress pos={[-7.1, -0.0, -2.6]} h={3.9} d={2.1} />
      <Cypress pos={[-7.6, -0.0, -0.9]} h={3.1} d={2.2} />
      <Cypress pos={[-6.4, -0.0, -4.1]} h={4.4} d={2.15} />

      {/* Küçük yuvarlak jakuzi */}
      <Spa ready={ready} instant={false} />

      {/* Girişte küre şimşirler */}
      <Boxwood pos={[2.85, PLINTH_Y, 2.35]} d={2.2} />
      <Boxwood pos={[5.0, PLINTH_Y, 2.35]} d={2.3} />

      {/* Havuz başı şezlonglar */}
      <Lounger pos={[1.25, PLINTH_Y, 2.05]} d={2.35} />
      <Lounger pos={[1.25, PLINTH_Y, 3.0]} d={2.42} />

      {/* Giriş yolu: traverten basamak taşları */}
      {[2.3, 3.0, 3.7, 4.4, 5.1, 5.8].map((z, i) => (
        <Grow key={z} on delay={2.0 + i * 0.05} mode="all" position={[3.95, z < 4 ? PLINTH_Y : 0, z]}>
          <mesh position={[0, 0.02, 0]} receiveShadow>
            <boxGeometry args={[1.0, 0.04, 0.46]} />
            <meshStandardMaterial color={c.travertine} roughness={0.85} />
          </mesh>
          {/* Basamak altı gün ışığı LED */}
          <LedStrip size={[0.9, 0.012, 0.012]} pos={[0, 0.006, 0.235]} intensity={2} />
        </Grow>
      ))}

      {/* Bahçe aydınlatmaları */}
      {[
        [5.4, PLINTH_Y, 3.6],
        [2.4, PLINTH_Y, 3.6],
        [-6.2, 0, 1.6],
        [-5.0, 0, 4.9],
        [4.9, 0, 5.4],
      ].map((p, i) => (
        <Bollard key={i} pos={p as [number, number, number]} d={2.5 + i * 0.06} />
      ))}

      {/* Çatı pergolası: bronz çıtalar */}
      <Grow on delay={2.1} position={[3.4, roofY, -0.3]}>
        {[
          [-1.4, -2.0],
          [1.4, -2.0],
          [-1.4, 1.5],
          [1.4, 1.5],
        ].map(([x, z]) => (
          <mesh key={`${x}${z}`} position={[x, 0.75, z]} castShadow>
            <boxGeometry args={[0.1, 1.5, 0.1]} />
            <meshStandardMaterial color={c.bronze} metalness={0.7} roughness={0.35} />
          </mesh>
        ))}
        {slats.map((z) => (
          <mesh key={z} position={[0, 1.52, z + 0.1]} castShadow>
            <boxGeometry args={[3.0, 0.07, 0.12]} />
            <meshStandardMaterial color={c.bronze} metalness={0.7} roughness={0.35} />
          </mesh>
        ))}
      </Grow>

      {/* Traverten duvar dibinde sıcak yer aydınlatmaları */}
      {[-1.6, -0.2, 1.2].map((z) => (
        <mesh key={z} position={[-3.95, PLINTH_Y + 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.07, 16]} />
          <meshStandardMaterial color={c.goldHi} emissive={c.interior} emissiveIntensity={4} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

// Kamera: sabit açı, fareyle hafif paralaks, kaydırmayla yükselir. setState yok; her şey ref.
function CameraRig({ scroll, instant }: { scroll?: MotionValue<number>; instant: boolean }) {
  const { camera, size } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 2.0, 0), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const angle = useRef(0.78);

  useFrame((state, dt) => {
    const s = scroll?.get() ?? 0;
    const aspect = size.width / size.height;
    const wide = aspect > 1.15;
    // Fare konumu sayfa genelinden okunur; tuval dışında ±1'i aşmasın
    const px = instant ? 0 : THREE.MathUtils.clamp(state.pointer.x, -1, 1);
    const py = instant ? 0 : THREE.MathUtils.clamp(state.pointer.y, -1, 1);

    // Dönüşü tabla yapar; kamera yalnızca hafif paralaks
    const a = 0.78 + px * 0.08;
    angle.current = THREE.MathUtils.damp(angle.current, a, 2.5, Math.min(dt, 0.05));
    const r = (wide ? (aspect < 1.5 ? 37 : 32) : 44) + s * 4;
    const y = 7 + s * 4.5 - py * 0.8;

    camera.position.set(Math.sin(angle.current) * r, y, Math.cos(angle.current) * r);
    // Geniş ekranda villa sağa kayar, metin solda nefes alır
    camera.lookAt(look.copy(target));

    // Bakış açısını bozmadan kadrajı kaydır: geniş ekranda maket sağa (metin solda),
    // dar ekranda yukarı (metin altta) kayar.
    const cam = camera as THREE.PerspectiveCamera;
    const ox = wide ? -size.width * 0.2 : 0;
    const oy = wide ? 0 : size.height * 0.24;
    const v = cam.view;
    if (!v || v.offsetX !== ox || v.offsetY !== oy || v.fullWidth !== size.width || v.fullHeight !== size.height) {
      cam.setViewOffset(size.width, size.height, ox, oy, size.width, size.height);
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

export default function VillaScene({
  ready,
  instant,
  scroll,
  spin,
}: {
  ready: boolean;
  instant: boolean;
  scroll?: MotionValue<number>;
  spin: Spin;
}) {
  const lite = useLite();
  // Maket kurulduktan sonra gölgeler sabittir: her karede yeniden çizme
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setSettled(true), 4500);
    return () => clearTimeout(t);
  }, [ready]);
  return (
    <>
      <color attach="background" args={[c.ink]} />
      <fog attach="fog" args={[c.ink, 24, 52]} />

      <ambientLight intensity={0.22} />
      <hemisphereLight args={["#dfe5ec", c.ink, 0.45]} />
      <directionalLight position={[-9, 12, 8]} intensity={2.4} color="#fff6ea" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0003} shadow-normalBias={0.02}>
        <orthographicCamera attach="shadow-camera" args={[-12, 12, 12, -12, 1, 40]} />
      </directionalLight>
      <directionalLight position={[8, 5, -10]} intensity={1.8} color={c.gold} />
      <pointLight position={[-0.9, 1.8, -0.4]} intensity={6} distance={9} color={c.interior} />

      {/* Yansımalar için yerel ışık ortamı (internetten HDR indirmez) */}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={1.4} color={c.goldHi} position={[0, 5, -9]} scale={[14, 3, 1]} />
        <Lightformer form="rect" intensity={0.6} color="#ffffff" position={[-8, 3, 4]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="ring" intensity={0.8} color={c.gold} position={[6, 6, 6]} scale={3} />
      </Environment>

      {/* 360° dönen tabla: podyum + villa + dekor + temas gölgesi birlikte döner */}
      <InstantContext.Provider value={instant}>
      <Turntable spin={spin} instant={instant}>
        <Podium ready={ready} instant={instant} />
        <group position={[0, -0.01, 0]}>
          <Villa ready={ready} instant={instant} />
          <Decor ready={ready} />
        </group>
        {/* Gölge tablayla birlikte döndüğü için kurulumdan sonra sabitlenebilir */}
        <ContactShadows
          position={[0, 0.002, 0]}
          opacity={0.6}
          scale={18}
          blur={2.4}
          far={8}
          resolution={lite ? 512 : 1024}
          frames={settled && !instant ? 1 : Infinity}
          color="#000000"
        />
      </Turntable>
      </InstantContext.Provider>

      {/* Zemin: parlak siyah taş, gold ışıkları hafifçe yansıtır */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]} receiveShadow>
        <circleGeometry args={[40, 64]} />
        {instant || lite ? (
          <meshStandardMaterial color={c.ink} roughness={0.95} />
        ) : (
          <MeshReflectorMaterial
            blur={[400, 120]}
            resolution={1024}
            mixBlur={1}
            mixStrength={1.1}
            roughness={1}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color={c.ink}
            metalness={0.6}
            mirror={0.4}
          />
        )}
      </mesh>
      {/* Gold mimari ızgara: proje paftası hissi, uzakta kaybolur */}
      <Grid
        position={[0, -0.44, 0]}
        args={[60, 60]}
        cellSize={1}
        cellThickness={0.5}
        cellColor={c.graphite}
        sectionSize={5}
        sectionThickness={0.9}
        sectionColor={c.bronze}
        fadeDistance={42}
        fadeStrength={1.6}
        infiniteGrid
      />

      {/* Altın toz */}
      {!instant && !lite && <Sparkles count={60} scale={[22, 9, 14]} position={[0, 4, 0]} size={2.2} speed={0.25} opacity={0.55} color={c.goldHi} />}

      <CameraRig scroll={scroll} instant={instant} />

      {/* Işıma: gold hatlar ve sıcak pencereler hafifçe parlar */}
      {!lite && (
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur intensity={0.75} luminanceThreshold={0.62} luminanceSmoothing={0.2} radius={0.7} />
        <Vignette offset={0.25} darkness={0.75} />
      </EffectComposer>
      )}
    </>
  );
}
