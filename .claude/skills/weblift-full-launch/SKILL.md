---
name: weblift-full-launch
description: WebLift uçtan uca lansman paketi. İşletme adı, sektör ve hedef bölge verildiğinde sırayla lüks web sitesi mimari planını, SEO site haritasını (sayfa/anahtar kelime/şema eşlemesi) ve açılış günü Google Ads + Meta Ads kampanya paketini tek belgede çıkarır. "/weblift-full-launch", "lansman planı", "yeni müşteri için site + reklam planı" isteklerinde kullan.
argument-hint: "<İşletme adı> | <sektör> | <hedef bölge> [| aylık reklam bütçesi]"
disable-model-invocation: true
---

# /weblift-full-launch

Girdi: `$ARGUMENTS` → `İşletme adı | sektör | hedef bölge | (isteğe bağlı) aylık reklam bütçesi`.
Eksik alan varsa **tek mesajda** sor; varsayımla ilerleme. Bütçe yoksa reklam bölümünü 15.000 / 30.000 / 50.000 TL senaryolarıyla ver.

## Kurallar

- Uydurma veri yok: müşteriden gelmeyen rakam, referans, ödül, adres, yorum plana "içerik" olarak girmez; gerekiyorsa **"Müşteriden istenecek"** listesine yazılır.
- Bu dizinde bir proje varsa (`CLAUDE.md`) onun kuralları önceliklidir (palet, CTA dili, yasak ifadeler).
- Planda TBM/hacim rakamları **aralık + kaynak/varsayım** etiketiyle verilir.
- Bu komut **plan** üretir; kod yazmaz, reklam hesabına dokunmaz.

## Akış

### 1. Keşif (kısa)
- Sektörün B2B / B2C ağırlığı, karar vericiler, satış döngüsü, ortalama iş büyüklüğü (müşteriden), rakip 3–5 site (WebSearch ile — yalnızca gözlem, metin kopyalanmaz).
- Bölgesel arama niyeti: il + ilçe varyasyonları.

### 2. Site mimarisi → `luxury-web-architect` ajanı
Ajanı `Agent` aracıyla çağır (subagent_type: `luxury-web-architect`) ve şunları iste:
- Sanat yönü (konsept cümlesi, renk rolleri, tipografi çifti, hareket dili, 3D kullanılacaksa nerede ve neden).
- Sayfa ağacı ve her sayfanın bölüm sırası.
- Lead hunisi: CTA hiyerarşisi, form alanları, tıkla-ara/WhatsApp, mobil sabit CTA, ölçülecek olaylar.
- Performans bütçesi (LCP/INP/CLS hedefleri, 3D yükleme stratejisi).

### 3. SEO site haritası → `seo-gsc-strategist` ajanı
(subagent_type: `seo-gsc-strategist`) Yeni site olduğu için GSC verisi beklenmez; şunları iste:
- Sayfa ↔ birincil/ikincil anahtar kelime ↔ arama niyeti ↔ önerilen title/description ↔ şema türü tablosu.
- Yamyamlaşmayı önleyen tek-sayfa-tek-niyet eşlemesi, iç link hub/spoke haritası.
- JSON-LD planı (`Organization`, doğru `LocalBusiness` alt türü, `WebSite`, `Service`, `BreadcrumbList`, görünür S-C varsa `FAQPage`).
- Teknik temel kontrol listesi (canonical, OG, robots, sitemap, llms.txt, tek h1).

### 4. Açılış günü reklam paketi → `ads-performance-director` ajanı
(subagent_type: `ads-performance-director`) Site haritasındaki açılış sayfalarıyla eşleşecek şekilde:
- Google Ads: kampanya/reklam grubu yapısı, Exact/Phrase kelimeler, hesap düzeyi negatif liste, her grup için RSA (karakter sayılı), öğeler, teklif planı.
- Meta Ads: soğuk/ılık/sıcak huni, 3 metin varyasyonu (Hook → Ağrı → Otorite/Çözüm → CTA), 2 kreatif brifi.
- Bütçe dağılımı ve ölçüm ön koşulları.

Adım 2–4 birbirinden bağımsız bölümler üretir ama 4. adım 3'ün açılış sayfalarını kullanır: 2 ve 3'ü paralel çalıştır, 4'ü 3 bitince başlat.

### 5. Birleştir ve teslim et
Tek Markdown belgesi olarak `docs/launch/<işletme-slug>-lansman.md` dosyasına yaz (klasör yoksa oluştur):

```
# <İşletme> — Lansman Paketi (<tarih>)
## 0. Özet ve 30 günlük yol haritası
## 1. Sanat yönü ve site mimarisi
## 2. Lead hunisi ve ölçüm planı
## 3. SEO site haritası (tablo) + şema planı + iç link haritası
## 4. Google Ads açılış paketi
## 5. Meta Ads açılış paketi
## 6. Bütçe dağılımı ve tahminler (aralık + kaynak)
## 7. Müşteriden istenecekler (logo vektör, gerçek fotoğraf, adres, referans izni…)
## 8. Yayın öncesi kontrol (Search Console, Bing Webmaster, Google İşletme Profili, dönüşüm etiketleri)
## Doğrulanmadı
```

Sohbette yalnızca kısa özet + dosya bağlantısı ver.
