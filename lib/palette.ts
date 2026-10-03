// 3D sahneler (WebGL) CSS değişkenlerini okuyamaz; tema renkleri burada aynalanır.
// app/globals.css → @theme ile aynı tutulmalı. Malzeme tonları (taş, ahşap, su) yalnızca 3D'de kullanılır.

export const palette = {
  ink: "#0d0d0f",
  anthracite: "#151619",
  graphite: "#1f2024",
  slate: "#2c2d32",
  stone: "#9a978f",
  mist: "#d8d4cc",
  sand: "#ebe6dc",
  ivory: "#f6f3ed",
  gold: "#d3a971",
  goldHi: "#ecd2a4",
  goldLo: "#a98451",
  bronze: "#8a6a42",

  // Yalnızca 3D malzemeler
  facade: "#e7e2d8", // beyaz sıva cephe
  travertine: "#b9ab95", // traverten / doğal taş
  walnut: "#5a4030", // ceviz ahşap
  oak: "#a07c58", // meşe parke
  water: "#0c1b22", // havuz suyu
  interior: "#f0b46e", // camın ardındaki sıcak iç ışık
  glass: "#1d2a30", // koyu cam
} as const;
