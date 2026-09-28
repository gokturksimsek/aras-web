// KVKK Aydınlatma Metni — 6698 sayılı Kanun md. 10 kapsamında.
// Genel bir şablondur; yayından önce hukuki kontrol önerilir (bkz. CLAUDE.md → Açık işler).

import { site } from "./site";

export const kvkk = {
  title: "KVKK Aydınlatma Metni",
  updated: "Eylül 2026",
  intro: `${site.name} (“Şirket”) olarak, web sitemiz üzerinden bizimle paylaştığınız kişisel verilerinizin güvenliğine önem veriyoruz. Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca veri sorumlusu sıfatıyla sizi bilgilendirmek amacıyla hazırlanmıştır.`,
  sections: [
    {
      title: "1. Veri Sorumlusu",
      body: [
        `Veri sorumlusu: ${site.name}, ${site.city}.`,
        `İletişim: ${site.email}${site.phone ? ` · ${site.phone}` : ""}`,
      ],
    },
    {
      title: "2. İşlenen Kişisel Veriler",
      body: [
        "İletişim formu aracılığıyla ilettiğiniz ad soyad, telefon numarası, e-posta adresi, talep konusu ve mesaj içeriğiniz işlenmektedir.",
        "Sitemizde kişisel veri toplayan çerez veya ziyaretçi takip aracı kullanılmamaktadır.",
      ],
    },
    {
      title: "3. İşleme Amaçları",
      body: [
        "Bilgi ve teklif taleplerinize dönüş yapılması, projenize ilişkin ön görüşmenin planlanması ve talebinizle ilgili iletişimin yürütülmesi.",
      ],
    },
    {
      title: "4. Hukuki Sebep ve Toplama Yöntemi",
      body: [
        "Kişisel verileriniz, web sitemizdeki iletişim formu aracılığıyla elektronik ortamda toplanmaktadır.",
        "Verileriniz KVKK md. 5/2-(c) “bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması” ve md. 5/2-(f) “ilgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaati” hukuki sebeplerine dayanılarak işlenmektedir.",
      ],
    },
    {
      title: "5. Aktarım",
      body: [
        "Kişisel verileriniz üçüncü kişilere satılmaz ve pazarlama amacıyla paylaşılmaz.",
        "Form mesajlarının tarafımıza iletilmesi için e-posta hizmet sağlayıcılarından yararlanılmaktadır; bu hizmet sağlayıcıların sunucuları yurt dışında bulunabilir. Bu aktarım yalnızca talebinizin bize ulaştırılması amacıyla ve KVKK md. 9 hükümlerine uygun olarak gerçekleştirilir.",
        "Yasal bir zorunluluk halinde, verileriniz yetkili kamu kurum ve kuruluşlarıyla paylaşılabilir.",
      ],
    },
    {
      title: "6. Saklama Süresi",
      body: [
        "Verileriniz, işleme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen süreler kadar saklanır; süre sonunda silinir, yok edilir veya anonim hale getirilir.",
      ],
    },
    {
      title: "7. İlgili Kişi Olarak Haklarınız",
      body: [
        "KVKK md. 11 uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, KVKK md. 7 çerçevesinde silinmesini veya yok edilmesini isteme, bu işlemlerin aktarıldığı üçüncü kişilere bildirilmesini isteme, münhasıran otomatik sistemlerle analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme haklarına sahipsiniz.",
        `Taleplerinizi ${site.email} adresine e-posta ile iletebilirsiniz. Başvurunuz en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.`,
      ],
    },
  ],
};
