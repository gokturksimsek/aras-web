# ARAS İNŞAAT — Kurumsal Web Sitesi

Bu dosya projede çalışan herkesin ve Claude'un ortak başvuru kaynağıdır.
Bir değişiklik yapmadan önce oku; kural değişirse bu dosyayı da güncelle.

## Proje özeti

- **Müşteri:** ARAS İNŞAAT — Ankara. Slogan (logodan): *Özenle ve Güvenle*.
- **Amaç:** Lüks konut, villa ve iç mimari işlerini anlatan; antrasit + gold temalı, ihtişamlı, kurumsal, **çok sayfalı** tanıtım sitesi (OBES düzeni: her bölüm kendi sayfasında).
- **Referans:** https://farasinsaat.com/ — üst bilgi şeridi, hero üzerinde şeffaf header, manifesto metni, hakkımızda + yıl sayacı, hizmet kartları, proje listesi, iletişim formu. Bu düzen örnek alındı, kalite olarak aşılması hedeflendi.
- **Dil:** Site metinleri Türkçe. Kod içi yorumlar Türkçe.

## Teknoloji

| Paket | Sürüm | Kullanım |
|---|---|---|
| Next.js (App Router, Turbopack) | 16.3 | Çatı. **Eğitim verisindeki Next.js'ten farklı:** kod yazmadan önce `node_modules/next/dist/docs/` içindeki ilgili rehberi oku. |
| React | 19.3 | |
| TypeScript | 7 | `next build` yerel `tsc` CLI'ı ile tip kontrolü yapar. |
| Tailwind CSS | 4.3 | `@tailwindcss/postcss`. Yapılandırma dosyası yok; tema `app/globals.css` → `@theme` içinde. |
| Motion (eski adıyla Framer Motion) | 13 | `import { motion } from "motion/react"` |
| Lenis | 1.3 | Yumuşak kaydırma (`lenis/react`) |
| lucide-react | 1.49 | Arayüz ikonları. Marka ikonu içermez. |
| clsx | 2.1 | Koşullu `className` birleştirme (`import clsx from "clsx"`). |
| nodemailer | 10 | İletişim formu SMTP gönderimi (`app/api/iletisim/route.ts`) |
| three | 0.186 | 3D motoru. |
| @react-three/fiber · drei · postprocessing | 9.8 · 10.7 · 3.1 | React içinde 3D sahneler (`components/three/`), yardımcılar, ışıma (Bloom). |
| simple-icons | 16 | **Marka ikonları** (Instagram). Marka logosu elle çizilmez. |
| next/font | – | **farasinsaat.com ile aynı aile:** Helvetica (başlık + metin) + **Roboto Slab** (ikincil, gold vurgular). Helvetica web'e gömülemez: Apple'da sistem "Helvetica Neue", diğerlerinde **Inter Tight** yüklenir. `latin-ext` zorunlu. |

Node.js 24 LTS gerekir (makineye `winget` ile kullanıcı kapsamında kuruldu).

### Next 16 notları (sık yapılan hatalar)

- `next/image`: `priority` yerine **`preload`**. `quality` yalnızca `next.config.ts` → `images.qualities` içindeki değerler olabilir.
- Uzak görseller `images.remotePatterns` ile izinli (şu an yalnızca `images.unsplash.com`).
- `middleware` yerine `proxy`. `next lint` yok.

## Klasör yapısı

```
app/
  layout.tsx            Fontlar, metadata, JSON-LD, SmoothScroll sarmalayıcı
  layout.tsx            Ortak: Header, PageTransition (sayfa geçiş perdesi), Footer, CallButton
  page.tsx              Anasayfa: 3D hero + bölüm özetleri ("Detaylı Bilgi" → ilgili sayfa)
  kurumsal/ uzmanliklar/ projeler/ referanslar/ iletisim/   Alt sayfalar (PageHero + bölüm)
  globals.css           Tailwind + @theme renk/font değişkenleri + ortak yardımcı sınıflar
  icon.png, apple-icon.png  Favicon ve iOS ana ekran simgesi (logodan üretildi)
  kvkk/page.tsx         KVKK Aydınlatma Metni sayfası (metin: lib/kvkk.ts)
  not-found.tsx         Markaya uygun 404 sayfası
  api/iletisim/route.ts İletişim formu uç noktası
components/
  SmoothScroll.tsx      Lenis + Motion'un "hareketi azalt" ayarı
  Opening.tsx           Açılış perdesi (yalnızca anasayfa, oturumda bir kez) + Hero
  PageTransition.tsx    Site içi linkte perde kapanır (logo + sayfa adı), yeni sayfada açılır
  PageHero.tsx          Alt sayfa başlık bandı: breadcrumb + başlık + kısa açıklama
  Approach.tsx          Kurumsal → Yaklaşımımız (4 ilke)
  Header.tsx            Üst şerit + yapışkan header + mobil menü; etkin link pathname'den. Kaydırınca opak (yazı binmez)
  Hero.tsx              3D villa maketi (WebGL yoksa fotoğraf) + slogan
  Manifesto.tsx         Kaydırdıkça kelime kelime aydınlanan metin
  About.tsx             Kurumsal: kurucu, 1994, yıl sayacı
  Services.tsx          Uzmanlıklarımız: genişleyen paneller (≥1280) / kartlar
  Marquee.tsx           Kayan uzmanlık şeridi
  Scope.tsx             Anahtar teslim kapsamı: sabit 3D sahne + kaydırdıkça ilerleyen 43 iş kalemi
  Projects.tsx          Projeler: filtreli masonry galeri + lightbox
  References.tsx        Referanslar: iş ortağı kartları + kayan marka şeritleri
  CtaBand.tsx           Paralaks görselli çağrı bandı
  CallButton.tsx        Mobilde sabit "Hemen Ara" butonu
  Contact.tsx           İletişim bilgileri + form
  Footer.tsx            Tüm sayfalarda ortak; "Yukarı" = ui/BackToTop
  ui/                   Reveal, SectionHeading, Counter, InstagramIcon, Logo, Tilt (3D kart eğimi)
  three/                3D: Stage (ortak tuval), Grow (inşa animasyonu), VillaScene + HeroCanvas, BuildScene + BuildCanvas, webgl.ts
lib/
  site.ts               **Firma bilgileri ve tüm içerik verisi (tek doğru kaynak)**
  images.ts             Görsel URL'leri (Unsplash yer tutucular)
  kvkk.ts               KVKK aydınlatma metni (genel şablon — hukuki kontrol önerilir)
  palette.ts            3D sahneler için tema renklerinin JS kopyası (globals.css ile aynı tutulur)
public/img/             aras-logo.png (tam logo), aras-logo-mark.png (yalnızca altıgen), şeffaf zeminli
public/img/referanslar/ Referans logoları (tek renkli maske, bkz. aşağı)
ARAS logo.png           Müşteriden gelen orijinal logo — silme
```

## Firma bilgileri (tek doğru kaynak: `lib/site.ts`)

- **Firma:** ARAS İNŞAAT · **Kurucu:** Erbakan ARAS · **Kuruluş:** 1994
- **Hizmet bölgesi:** Ankara geneli
- **Uzmanlık:** Konut ve villa projeleri; A'dan Z'ye anahtar teslim iç mimari ve dekorasyon. Kaba inşaat sonrası tüm ince işçilik ve dekoratif uygulamalar kendi profesyonel ekibimizce yapılır.
- **Instagram:** https://www.instagram.com/aras.insaatt/
- **Telefon:** 0532 630 46 77 → `tel:+905326304677`
- **E-posta:** erbakanaras@gmail.com
- **Açık adres:** *henüz yok*

Bu alanlar `lib/site.ts`'ten okunur: üst şerit, mobil menü, iletişim bölümü, footer, mobil "Hemen Ara" butonu, form hata mesajı ve `app/layout.tsx` JSON-LD (JSON-LD'deki `telephone` uluslararası biçimde ayrıca yazılı). Boş bırakılan alan sitede gösterilmez.

Yıllık tecrübe sayısı `new Date().getFullYear() - 1994` ile hesaplanır; elle yazılmaz.

## Tasarım kuralları

- **Renkler yalnızca `@theme` değişkenlerinden** (`app/globals.css`). Yeni hex yazma; gerekirse önce değişken ekle.
  - Zemin: `ink` (#0d0d0f), `anthracite`, `graphite`, `slate`
  - Açık: `ivory`, `sand`, `mist`
  - Metin: `stone` (ikincil)
  - Vurgu: `gold` (#d3a971 — logodaki ton), `gold-hi`, `gold-lo`, `bronze`
- Gold **vurgu** rengidir: ince çizgi, ikon, küçük etiket, buton kenarı, hover. Büyük alanları gold ile doldurma.
- Tipografi: `font-serif` adı korunuyor ama artık Helvetica/Inter Tight başlık yazı tipi (ince 300, sıkı harf aralığı); gövde `font-sans` aynı aile. `font-serif italic` ve `gold-text italic` otomatik **Roboto Slab** olur (globals.css). Sıra önemli: Windows "Helvetica"yı Arial'a çevirir, bu yüzden yığında Inter Tight "Helvetica"dan önce. Küçük üst etiketler: `eyebrow` sınıfı (büyük harf, geniş harf aralığı, gold).
- Köşeler keskin veya çok az yuvarlak (lüks mimari hissi). Butonlar dikdörtgen, ince kenarlı.
- Hareketler `ease-lux` eğrisiyle (`[0.22, 1, 0.36, 1]`), yavaş ve akıcı (0.6–1.4 sn). Zıplama/dönme yok.
- **Uydurma içerik yok:** sahte istatistik ("500+ proje"), sahte referans/müşteri adı, uydurma ödül/sertifika, sahte telefon/adres ekleme. Müşteriden gelmeyen bilgi siteye girmez.
- Görseller şu an **Unsplash yer tutucularıdır** (`lib/images.ts`). Proje adları bu yüzden genel ("Modern Villa" vb.). Gerçek proje fotoğrafları gelince `public/img/projeler/` altına koyup `lib/images.ts`'i güncelle.

## Referanslar

- Veri: `lib/site.ts` → `references` (`partners`: iş ortakları, `brands`: uygulamalarda kullanılan malzeme markaları). İkisi ayrı başlıkta durur; malzeme markaları "müşteri" gibi gösterilmez.
- Logolar **markaların resmî sitelerinden** alındı, elle çizilmedi. Şekli bozulmadan tek renkli (beyaz, şeffaf zeminli) maskeye çevrildi; sitede CSS `mask-image` ile fildişi, üzerine gelince gold boyanır. Rozet biçimli logolarda (Marshall, Filli Boya) yalnızca rozet içindeki yazı alındı; Jotun'da yalnızca lacivert yazı + amblem (`jotun.svg`).
- Yeni logo eklerken: şeffaf PNG/SVG al → beyaz siluet yap → `public/img/referanslar/` → `ratio` (en/boy) yaz; ince çizgili logolara `scale` ver.
- **Artı Grup** bağlantısı kapalı: sitelerinin SSL sertifikası süresi dolmuş (Eylül 2026). Yenilenince `url` alanını doldur.
- Sayfalar: Anasayfa `/` · Kurumsal `/kurumsal` · Uzmanlıklarımız `/uzmanliklar` (hizmetler + 3D kapsam) · Projelerimiz `/projeler` · Referanslar `/referanslar` · İletişim `/iletisim`. Bölüm numaraları (`no`) sayfa içinde 01'den başlar.
- Anasayfa özetleri: `About more`, `Services more`, `Projects limit={6}`, `References compact` → "Detaylı Bilgi / Tüm …" düğmeleri (`ui/MoreLink`).
- "Teklif Alın" düğmesi bilerek yok (müşteri isteği). Bilgi linkleri `contactHref(konu)` → `/iletisim?konu=…` (form Konu'yu seçer).

## 3D

- Sahneler yalnızca tarayıcıda yüklenir (`next/dynamic`, `ssr: false`). WebGL yoksa yerine fotoğraf gösterilir (`three/webgl.ts`).
- `Stage`: ekran dışındayken çizim durur (`frameloop="never"`), düşük performansta çözünürlük düşer (`PerformanceMonitor`). Fare konumu `document.body`'den okunur (metin katmanı tuvalin üstünde).
- `Grow`: nesneyi yerden yükselterek "inşa eder"; `on` kapanınca geri söker. Pivot alttadır.
- **Hero (`VillaScene`)**: prosedürel villa maketi, gold halkalı mermer **döner tabla** üzerinde (selviler, şimşirler, şezlonglar, bahçe aydınlatmaları, basamak taşları, çatı pergolası). Yatay sürükleme ile 360° döner (`HeroCanvas` → `Spin` ref), bırakınca yavaşça kendi döner; telefonda dikey kaydırma bozulmaz (`touch-pan-y`). Kamera sabit açı + hafif paralaks. Kadraj `setViewOffset` ile kaydırılır (geniş ekranda sağa, dar ekranda yukarı) — bakış açısı bozulmaz.
- **Kapsam (`BuildScene`)**: kesiti açık oda; aşamalar 0–6 = mimari plan · tesisat · elektrik · duvar · zemin (şap + parke) · doğrama · mobilya. Her aşamanın kamera planı `shots` dizisinde.
- Renkler `lib/palette.ts`'ten; yeni renk gerekiyorsa önce oraya (ve gerekiyorsa `@theme`'e) ekle.
- "Hareketi azalt": sahneler animasyonsuz son hâlinde (`instant`), toz parçacıkları ve yansıma kapalı.
- **Zed Renovasyon görselleri kullanılmaz** (müşteri kararı, telif). Kapsam bölümündeki kalem adları müşterinin onayıyla eklendi; açıklama metinleri ARAS'a özgü yazıldı. Sitede "kol" ifadesi geçmez.

## Duyarlı tasarım

Kontrol genişlikleri: **1440 · 1024 · 768 · 375 · 320**. 375px'te yatay kaydırma olmamalı.
- `< xl (1280)`: menü hamburger + tam ekran; hizmetler genişleyen panel yerine kart.
- `short:` (yatay telefon, yükseklik ≤ 520px): hero kısalır, mobil menü iki sütun ve kaydırılabilir.
- `< lg (1024)`: hakkımızda, iletişim tek sütun.
- `< md (768)`: hizmetler tek sütun, galeri 2 sütun, üst şerit gizli.
- Dokunulabilir öğeler en az 44px.

## Kod kuralları

- Bileşenler PascalCase, `components/` altında. İstemci bileşenleri `"use client"` ile başlar; gerekmedikçe sunucu bileşeni bırak.
- İçerik metnini bileşene gömme; `lib/site.ts`'e koy.
- Kaydırmayla gelen öğeler için `<Reveal>` kullan.
- "Hareketi azalt": `MotionConfig reducedMotion="user"` global; Lenis bu durumda kapalı. Yeni CSS animasyonlarını `motion-safe:` ile yaz.
- Erişilebilirlik: dekoratif ikon/görsel `aria-hidden` / `alt=""`; butonlarda anlamlı etiket; `:focus-visible` stilini bozma.
- Harici link: `target="_blank" rel="noopener noreferrer"`.
- **Tasarım imzası:** footer'ın en alt satırında "Bu site weblift.tr tarafından tasarlanmıştır." (https://weblift.tr/ linkli) her zaman bulunur; kaldırma. `rel="noopener"` (noreferrer yok, weblift.tr yönlendirmeyi görebilsin).

## İletişim formu (e-posta gönderimi)

Mesajlar `site.email` (**erbakanaras@gmail.com**) adresine gider. Gönderim katmanları, sırasıyla:

1. **Gmail SMTP — önerilen.** `SMTP_USER` + `SMTP_PASS` tanımlıysa `POST /api/iletisim` nodemailer ile gönderir. `SMTP_PASS` normal şifre değil, Google'ın 16 haneli **Uygulama Şifresi**dir (2 Adımlı Doğrulama açık olmalı). Şifreyi yalnızca `.env.local` / Vercel ortam değişkenine yaz; asla koda veya commit'e koyma.
2. **Resend** — `RESEND_API_KEY` tanımlıysa.
3. **FormSubmit (kurulumsuz yedek)** — sunucuda yöntem yoksa (503) ya da gönderim hata verirse (502) form, tarayıcıdan `https://formsubmit.co/ajax/<site.email>` adresine gönderir. İlk gönderimde e-posta adresine tek seferlik **"Activate Form"** e-postası gelir; tıklanana kadar mesaj iletilmez. Yeni bir alan adında ilk gönderimde onay tekrar istenebilir.
4. **Son çare:** ziyaretçinin e-posta uygulaması mesaj hazır açılır (`mailto:`).

Sahte "gönderildi" mesajı gösterilmez; "Teşekkürler" yalnızca gerçek gönderim başarılıysa çıkar.
- Hizmet kartlarındaki "Bilgi Alın", `selectTopic()` ile formdaki Konu'yu otomatik seçer (`lib/site.ts` → `services[].topic`).
- KVKK onay kutusu `/kvkk` sayfasına bağlanır.
- Ortam değişkenleri için `.env.example`'a bak.

## Güvenlik ve erişilebilirlik

- `next.config.ts`: güvenlik başlıkları (nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS), `X-Powered-By` kapalı.
- Klavye kullanıcıları için "İçeriğe geç" bağlantısı (`#icerik`).
- Açılış perdesi oturum başına bir kez uzun gösterilir (`sessionStorage`).

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Yayına alma

Vercel önerilir (Next.js'in yerel ortamı). Ortam değişkenlerini Vercel panelinden gir.

## Açık işler

- [ ] Açık adres → `lib/site.ts`
- [ ] Gerçek proje fotoğrafları → galeri ve hizmet görselleri
- [ ] Alan adı kesinleşince `metadataBase` + OG görseli
- [ ] Gmail Uygulama Şifresi → `.env.local` ve Vercel'e `SMTP_PASS` (form bunu kullanır; yoksa FormSubmit yedeği)
- [ ] FormSubmit "Activate Form" e-postasını onayla (erbakanaras@gmail.com)
- [ ] KVKK metnini hukukçuya kontrol ettir (`lib/kvkk.ts`)
- [ ] Alan adı kesinleşince `robots.ts` + `sitemap.ts`
- [ ] Logo vektör (SVG) hâli gelirse PNG'lerin yerine koy
- [ ] Artı Grup SSL sertifikasını yenileyince referans kartına bağlantıyı aç

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
