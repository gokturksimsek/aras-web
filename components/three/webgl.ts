let cached: boolean | null = null;

/** Tarayıcı WebGL destekliyor mu? (Desteklemiyorsa 3D yerine fotoğraf gösterilir.)
 *  Sonuç önbelleğe alınır; deneme bağlamı hemen serbest bırakılır (Safari bağlam sınırı). */
export function hasWebGL() {
  if (cached !== null) return cached;
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    cached = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cached = false;
  }
  return cached;
}
