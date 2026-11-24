---
name: gsc-audit-boost
description: Google Search Console denetimi ve hızlandırma. GSC MCP'den son 28 gün ile önceki 28 günü karşılaştırır; düşüşteki sayfaları, düşük CTR sorgularını, 8–20. sıradaki ticari fırsatları ve yamyamlaşmayı tablo halinde sunar, ardından ilgili sayfaların meta/şema/iç link güncellemelerini kod tabanında uygular. "/gsc-audit-boost", "GSC raporu", "sıralamalar düştü", "CTR artır" isteklerinde kullan.
argument-hint: "[mülk, ör. sc-domain:alanadi.com] [--uygula]"
disable-model-invocation: true
---

# /gsc-audit-boost

Girdi: `$ARGUMENTS` → isteğe bağlı GSC mülkü ve `--uygula` bayrağı.
Bayrak yoksa önce rapor + değişiklik planı sunulur, onay sonrası uygulanır.

## 0. Ön kontrol
- `gsc` MCP araçları yüklü mü? (`mcp__gsc__list_sites`). Yoksa dur ve şunu söyle: `.mcp.json`'daki `gsc` sunucusu onaylanmalı ve `GSC_CREDENTIALS_PATH` / `GOOGLE_APPLICATION_CREDENTIALS` gerçek JSON yoluna işaret etmeli. **Sahte veriyle rapor üretme.**
- Mülk verilmediyse `list_sites` sonucunu göster; projedeki kök URL (ör. `lib/seo.ts` → `siteUrl` / `NEXT_PUBLIC_SITE_URL`) ile eşleşeni öner.

## 1. Veri çekme
GSC gecikmesi için bitiş = son kesin veri günü (`search_analytics` `endDate` boş bırakılırsa otomatik).
- **Dönem A (güncel):** son 28 gün. **Dönem B (önceki):** A'dan önceki 28 gün.
- `mcp__gsc__compare_periods` → A↔B kazananlar/kaybedenler (sayfa ve sorgu).
- `mcp__gsc__detect_traffic_drops` → olası nedenli düşüşler; `mcp__gsc__detect_content_decay` → süregelen erime.
- `mcp__gsc__detect_quick_wins` (sıra 4–10, düşük CTR) + `mcp__gsc__find_ctr_opportunities`.
- `mcp__gsc__find_cannibalization`.
- Sıra 8–20 ticari fırsatlar için `mcp__gsc__search_analytics` (`dimensions: query,page`, `rowLimit` 5000) ham veriyle filtrele.
- Gerekirse `device` kırılımı (mobil düşüşü ayrı mı?) ve `brand_split` (markasız trafik ayrı).

## 2. Analiz (`seo-gsc-strategist` mantığıyla)
Tabloları üret:

**A. Düşüşteki sayfalar** — tıklama değişimi en negatif 10 sayfa
| Sayfa | Tıklama A | Tıklama B | Δ% | Gösterim Δ% | CTR A→B | Sıra A→B | Olası neden |

Olası neden ayrımı: gösterim düştü (sıra/talep) mi, CTR düştü (SERP/başlık) mu? Gerekirse `mcp__gsc__index_inspect` ile dizin/canonical kontrolü.

**B. Düşük CTR fırsatları** — sıra ≤ 10, yüksek gösterim, CTR sitenin kendi sıra kovası beklentisinin altında
| Sorgu | Sayfa | Gösterim | CTR | Beklenen CTR (site verisi) | Sıra | Önerilen title / description |

**C. Hızlı sıralama (8–20, ticari niyet)**
| Sorgu | Sayfa | Gösterim | Sıra | Niyet | Aksiyon (bölüm, H2, iç link, FAQ) |

**D. Yamyamlaşma**
| Sorgu | Yarışan URL'ler (gösterim/sıra) | Önerilen birincil | Aksiyon |

Veri azsa (yeni site) bunu açıkça yaz ve teknik temel denetimine (seo-geo-master kontrol listesi) geç.

## 3. Kod tabanında uygulama
Projenin `CLAUDE.md`'sindeki SEO düzenine uy (ör. ARAS: `pageMeta()` → `lib/seo.ts`, içerik `lib/site.ts`, şema `organizationLd()` / `pageLd()`).
- **Doğrudan uygulanır:** `title` / `description` / OG metni, JSON-LD (`Service`, `BreadcrumbList`, görünür S-C için `FAQPage`), iç link eklemesi (mevcut metindeki doğal çapalarla), canonical düzeltmesi.
- **Onay ister:** görünür metin değişikliği (başlık, paragraf, yeni SSS), URL değişikliği / 301, sayfa birleştirme/silme, sitemap gönderimi (yazma araçları varsayılan kapalı; Search Console'dan elle veya `GSC_ALLOW_WRITE=true` ile).
- Uydurma yok: sahte rakam, yorum/puan, adres eklenmez.
- Sonra `npm run build` temiz geçmeli; üretilen JSON-LD ayrıştırılıp doğrulanmalı.

## 4. Rapor
```
Ajan: SEO_GSC_Strategist
## Dönemler ve kapsam
## Özet (tıklama/gösterim/CTR/sıra A↔B)
## Tablolar A–D
## Uygulanan değişiklikler (dosya:satır → ne)
## Onay bekleyenler
## İzleme planı (14 ve 28 gün sonra hangi sorgu/sayfaya bakılacak)
## Doğrulanmadı
```
Raporu `docs/seo/gsc-<YYYY-MM-DD>.md` olarak da kaydet.
