"use client";

import Stage from "./Stage";
import BuildScene from "./BuildScene";

// "Anahtar teslim kapsamı" 3D sahnesi (yalnızca tarayıcıda yüklenir).
export default function BuildCanvas({ stage, instant, onLost }: { stage: number; instant: boolean; onLost: () => void }) {
  return (
    <Stage
      className="absolute inset-0"
      shadows
      instant={instant}
      onLost={onLost}
      camera={{ position: [10, 8, 10], fov: 32 }}
      label="Kesiti açık bir odanın plan çiziminden mobilyasına kadar aşama aşama inşa edildiği üç boyutlu sahne"
    >
      <BuildScene stage={stage} instant={instant} />
    </Stage>
  );
}
