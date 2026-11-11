import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";
import { palette } from "@/lib/palette";

// Paylaşım görseli (WhatsApp, LinkedIn, X, Google Discover). Yalnızca logo ve doğrulanmış firma bilgisi.
export const alt = `${site.name} — ${site.slogan}. 1994'ten bu yana Ankara'da villa, konut ve anahtar teslim iç mimari.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/img/aras-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: `linear-gradient(135deg, ${palette.ink} 0%, ${palette.anthracite} 60%, ${palette.graphite} 100%)`,
          padding: "0 96px",
          color: palette.ivory,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={318} height={349} alt="" />
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 80, borderLeft: `2px solid ${palette.goldLo}`, paddingLeft: 64 }}>
          <div style={{ fontSize: 24, letterSpacing: 8, color: palette.gold, textTransform: "uppercase" }}>
            {`${site.city} · ${site.founded}'ten bu yana`}
          </div>
          <div style={{ fontSize: 76, fontWeight: 300, marginTop: 24, lineHeight: 1.05 }}>{site.name}</div>
          <div style={{ fontSize: 34, color: palette.goldHi, marginTop: 16 }}>{site.slogan}</div>
          <div style={{ fontSize: 26, color: palette.mist, marginTop: 40, maxWidth: 560, lineHeight: 1.4 }}>
            Villa ve konut projeleri · Anahtar teslim iç mimari · İnce işçilik ve dekorasyon
          </div>
        </div>
      </div>
    ),
    size,
  );
}
