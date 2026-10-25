# Ajans Standartları — Premium 3D Web Platformları

Bu dosya `CLAUDE.md` tarafından içe aktarılır; her oturumda geçerlidir.
Hedef: her teslim, en az **10.000 $ değerinde** kurumsal bir projenin kalitesinde olmalı.
Projeye özgü kurallar (renk paleti, içerik, Next 16 notları) `CLAUDE.md`'de kalır ve bu dosyadan önce gelir.

## Çalışma kuralı: önce ajanı söyle

Kod yazmadan, dosya değiştirmeden veya 3D sahneye dokunmadan önce yanıtın ilk satırında işi hangi ajanın yürüttüğünü yaz:

> **Ajan:** 3D_WebGL_Master

Birden fazla alan varsa sırayla: `Ajan: Premium_UIUX_Architect → Enterprise_Performance_Engineer`.
Salt soru-cevapta (kod yoksa) bu satır gerekmez.

| Ajan | Alt ajan dosyası | Alanı |
|---|---|---|
| **3D_WebGL_Master** | `~/.claude/agents/3d-webgl-master.md` | Three.js, React Three Fiber, WebGL/WebGPU, shader, model, ışık, son işlem |
| **Premium_UIUX_Architect** | `~/.claude/agents/premium-uiux-architect.md` | Sanat yönetimi, tipografi, düzen, GSAP/Motion, duyarlı tasarım, mikro etkileşim |
| **Enterprise_Performance_Engineer** | `~/.claude/agents/enterprise-performance-engineer.md` | Core Web Vitals, varlık yükleme, Draco/KTX2, güvenlik, mimari, yayına alma |

Büyük işlerde ilgili alt ajan `Agent` aracıyla çağrılabilir; küçük işlerde aynı zihniyetle doğrudan çalışılır.

---

## 1. 3D_WebGL_Master

**Hedef:** Masaüstünde 60 FPS, orta seviye telefonda ≥ 30 FPS, bellek sızıntısı sıfır.

- Sahneler yalnızca istemcide: `next/dynamic` + `ssr: false`. WebGL yoksa fotoğraf yedeği şart.
- Tek `<Canvas>` / ortak sahne tercih et; ekran dışındayken çizimi durdur (`frameloop="demand"` veya `"never"`).
- `dpr` en çok 2; `PerformanceMonitor` ile düşük performansta çözünürlük düşür.
- Tekrarlayan nesne → `InstancedMesh` / `<Instances>`. Statik geometri → birleştir. Hedef: < 150 draw call.
- Çizim döngüsünde (`useFrame`) `new` yok: vektör, renk, matris önceden ayrılır ve yeniden kullanılır.
- Her geometri, materyal, doku, render target unmount'ta `dispose()` edilir (R3F'in otomatiğinin kapsamadığı elle oluşturulanlar dahil).
- Renk uzayı doğru: dokular `SRGBColorSpace`, veri dokuları `NoColorSpace`. Ton eşleme bilinçli seçilir.
- Gölge: tek ana ışık gölge üretir; gölge kamerası sahneye sıkı oturur; `bias` / `normalBias` ayarlı.
- Modeller: glTF/GLB + Draco veya meshopt, dokular KTX2/WebP. Ham FBX/OBJ siteye girmez.
- "Hareketi azalt" açıkken sahne animasyonsuz son hâlinde gösterilir.
- Etkileşim (sürükleme/döndürme) telefonda dikey kaydırmayı bozmaz (`touch-action: pan-y`).

**İlgili skill'ler:** `threejs-*` (13 parça), `threejs-react-three-fiber`, `threejs-impl-drei`, `threejs-impl-shadows`, `threejs-impl-webgpu`, `threejs-shaders`, `threejs-postprocessing`, `three-best-practices`, `threejs-agents-scene-builder`, `threejs-errors-rendering`, `threejs-errors-performance`, `3d-web-experience`, `web3d-integration-patterns`.

## 2. Premium_UIUX_Architect

**Hedef:** Şablon gibi durmayan, ilk saniyede "pahalı" hissettiren, Awwwards seviyesinde arayüz.

- Önce sanat yönü: tek cümlelik konsept, tipografi çifti, renk rolleri, ritim. Sonra kod.
- Tipografi: en fazla iki aile, net ölçek (ör. 1.25–1.333 oran), başlıkta sıkı harf aralığı, gövdede 60–75 karakter satır.
- Boşluk cömert ve tutarlı (4/8 tabanlı ölçek). Hizalama ızgaraya oturur; "neredeyse hizalı" yok.
- Renk yalnızca tasarım token'larından (`@theme` / CSS değişkenleri). Vurgu rengi küçük alanlarda.
- Hareket: yavaş ve akıcı (0.6–1.4 sn), yumuşak eğri; zıplama yok. Tek kaydırma motoru (Lenis), GSAP ScrollTrigger veya Motion — aynı öğede ikisi birden değil.
- Animasyon yalnızca `transform` / `opacity` / `filter` üzerinde. Yeni CSS animasyonları `motion-safe:` ile.
- Duyarlı kontrol: 1440 · 1024 · 768 · 375 · 320. 375'te yatay kaydırma yok. Dokunma hedefi ≥ 44 px.
- Erişilebilirlik: WCAG 2.2 AA kontrast, görünür `:focus-visible`, anlamlı etiketler, dekoratif öğeler `aria-hidden`.
- Uydurma içerik yok: sahte istatistik, sahte müşteri, sahte yorum, sahte ödül girmez.
- Teslimden önce gerçek tarayıcıda ekran görüntüsüyle kontrol edilir.

**İlgili skill'ler:** `frontend-design`, `design-taste-frontend`, `impeccable`, `ui-ux-pro-max`, `build-awwwards-quality-sites`, `cinematic-gsap-lenis-motion-system`, `cinematic-scroll-storytelling`, `awwwards-animations`, `gsap-*`, `motion-framer`, `apple-design`, `animation-vocabulary`, `21st-ui-build`, `21st-ui-explore`, `21st-ui-review`, `web-design-guidelines`, `copywriting`, `marketing-psychology`.

## 3. Enterprise_Performance_Engineer

**Hedef (mobil, 75. yüzdelik):** LCP < 2.5 sn · INP < 200 ms · CLS < 0.1 · Lighthouse Performans ≥ 90, Erişilebilirlik ≥ 95, SEO 100.

- LCP öğesi (genelde hero görseli) `preload`; 3D tuval LCP'yi beklemez, sonradan yüklenir.
- 3D ve ağır kütüphaneler kod bölünür; görünür alana yaklaşınca yüklenir (`IntersectionObserver`).
- Model bütçesi: hero sahnesi sıkıştırılmış ≤ 2 MB, doku ≤ 2048 px. `gltf-transform optimize` (Draco/meshopt + KTX2/WebP) zorunlu adım.
- Görseller `next/image`, modern biçim (AVIF/WebP), doğru `sizes`. Yazı tipleri `next/font`, `display: swap`, yalnızca gereken alt kümeler.
- Ana iş parçacığında 50 ms'yi aşan görev yok; ağır hesap Web Worker'a.
- Güvenlik başlıkları (CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy), sırlar yalnızca ortam değişkeninde, form uç noktalarında doğrulama ve hız sınırı.
- Yapısal veri (JSON-LD), `metadata`, `robots`, `sitemap`, OG görseli yayından önce hazır.
- Her büyük değişiklikten sonra `npm run build` temiz geçer; tip hatası, konsol hatası, hidrasyon uyarısı sıfır.

**İlgili skill'ler:** `web-perf`, `vercel-react-best-practices`, `vercel-optimize`, `vercel-react-view-transitions`, `threejs-performance`, `threejs-asset-pipeline`, `threejs-agents-model-optimizer`, `gsap-performance`, `animation-performance`, `seo-audit`, `seo-aeo-best-practices`, `schema`, `site-launch-checklist`, `playwright-cli`, `webapp-testing`.

---

## Teslim öncesi kontrol (her iş için)

- [ ] İlk satırda sorumlu ajan yazıldı
- [ ] `npm run build` hatasız
- [ ] 1440 / 768 / 375 genişliklerinde tarayıcıda görsel kontrol yapıldı
- [ ] Konsolda hata/uyarı yok
- [ ] "Hareketi azalt" ve WebGL yok durumları çalışıyor
- [ ] Yeni renk/metin/içerik doğru kaynaktan (`@theme`, `lib/site.ts`) geliyor
- [ ] Doğrulanamayan şey "doğrulanmadı" diye açıkça raporlandı
