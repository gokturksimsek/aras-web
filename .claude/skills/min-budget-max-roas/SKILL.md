---
name: min-budget-max-roas
description: Minimum bütçe / maksimum ROAS reklam planı. Verilen aylık bütçeye (ör. 15.000–50.000 TL) göre Google Ads ve Meta Ads bütçe dağılımını, negatif kelime kalkanını, TBM/CPC tahmin aralıklarını ve A/B test edilecek reklam varyasyonlarını üretir. "/min-budget-max-roas", "bütçe dağılımı", "reklam planı", "ROAS" isteklerinde kullan.
argument-hint: "<aylık bütçe TL> [| işletme | sektör | bölge | hedef: form/arama/satış]"
disable-model-invocation: true
---

# /min-budget-max-roas

Girdi: `$ARGUMENTS`. Bütçe zorunlu. İşletme/sektör/bölge verilmediyse ve bu dizinde proje varsa (`CLAUDE.md`, `lib/site.ts`) oradan oku; yoksa tek mesajda sor.
İşi `ads-performance-director` ajanının standartlarıyla yürüt (karmaşık sektörde `Agent` → subagent_type `ads-performance-director`).

## Kurallar
- Tahminler **aralık** + **kaynak/varsayım** etiketli. Kaynak önceliği: kullanıcının hesap geçmişi → Google Ads Anahtar Kelime Planlayıcı (kullanıcı çıktıyı verirse) → kamuya açık sektör raporu (bağlantılı) → açıkça "varsayım".
- ROAS/CPA garantisi yok. Lead işletmelerinde ROAS yerine **lead başı maliyet (EBM)** ve **lead → teklif → satış** oranı kullanılır; satış değeri müşteriden gelmezse ROAS hesaplanmaz, formül bırakılır.
- Reklam hesabına dokunulmaz; çıktı içe aktarılabilir plandır.
- Reklam metinlerinde uydurma iddia yok (sahte proje sayısı, "%100 memnuniyet", sahte indirim).

## Akış

### 1. Bütçe kademesi
| Aylık bütçe | Varsayılan dağılım | Neden |
|---|---|---|
| < 20.000 TL | Google Arama %80–100 · Meta retargeting %0–20 | Niyet en yüksek kanalda öğrenmeyi tamamla, bölme |
| 20.000–35.000 TL | Google Arama %65–75 · Meta %25–35 (TOF lead + retargeting) | Arama talebini yakala, Meta ile talep yarat |
| > 35.000 TL | Google Arama %55–65 · Meta %30–40 · Test havuzu %5–10 | Yeni kelime/kitle/kreatif testleri |

Sektöre göre gerekçeyle ayarla (ör. görsel ağırlıklı lüks konut/iç mimaride Meta payı artabilir; acil hizmetlerde Arama artar). Günlük bütçe = aylık / 30.4.

### 2. Google Ads planı
- Kampanya → reklam grubu → `[exact]` / `"phrase"` kelimeler (hizmet × bölge × niyet).
- **Negatif kalkan:** hesap düzeyi liste (iş/kariyer, eğitim/DIY, ücretsiz, bilgi amaçlı, alakasız bölge, sektöre özel) + kampanyalar arası çapraz negatifler (yamyamlaşmayı önler). En az 60 terim, gruplandırılmış.
- TBM tahmini: kelime grubu başına aralık + kaynak; beklenen tıklama = bütçe / ort. TBM; beklenen lead = tıklama × dönüşüm oranı aralığı (varsayım etiketli).
- Ayarlar: yalnızca Arama Ağı, ortaklar kapalı, konum "bulunan kişiler", zamanlama mesai + akşam (sektöre göre), başlangıç teklifi Tıklamaları Artır (TBM tavanlı) → 30+ dönüşüm sonrası Dönüşümleri Artır / Hedef EBM.

### 3. Meta Ads planı
- Soğuk (ilgi alanı + Advantage+ sinyali, bölge yarıçapı) / ılık (etkileşim, video %50) / sıcak (site ziyaretçisi, form başlatan; dönüşenler hariç).
- Bütçe: retargeting havuzu küçükse sıcak katman toplam Meta bütçesinin %20–30'u ile sınırlı.

### 4. A/B test matrisi
Her seferinde **tek değişken**. En az:
- Google RSA: 2 başlık açısı (fiyat/şeffaflık vs. kalite/otorite) — sabitlenmiş tek başlıkla.
- Google açılış sayfası: hizmet sayfası vs. özel açılış sayfası (varsa).
- Meta metin: 3 hook (soru / ağrı / sonuç görseli) aynı kreatifle.
- Meta kreatif: Reels video vs. carousel aynı metinle.
- Form: anlık form (yüksek hacim) vs. web sitesi formu (yüksek kalite).
| Test | Hipotez | Varyant A | Varyant B | Metrik | Minimum veri / süre |

### 5. Çıktı
```
Ajan: Ads_Performance_Director
## Varsayımlar ve ön koşullar (izleme, açılış sayfası, GİP)
## Bütçe dağılımı (aylık + günlük)
## Google Ads: yapı · kelimeler · negatif kalkan · RSA (karakter sayılı)
## Meta Ads: huni · metinler (Hook/Ağrı/Otorite/CTA) · kreatif brifleri
## Tahmin tablosu | Kanal | TBM | Tıklama | Dönüşüm oranı | Lead | EBM | Kaynak/Varsayım |
## A/B test matrisi
## Haftalık optimizasyon ritmi (1.–4. hafta)
## Doğrulanmadı
```
Planı `docs/ads/<işletme-slug>-<bütçe>TL-<YYYY-MM>.md` olarak kaydet; Google Ads Editor'e aktarılabilecek kelime ve negatif listelerini ayrıca CSV olarak ver (`Kampanya,Reklam grubu,Anahtar kelime,Eşleme türü`).
