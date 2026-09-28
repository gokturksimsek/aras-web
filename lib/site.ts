// Firma bilgileri ve site içeriği — tek doğru kaynak.
// Müşteriden gelmeyen bilgi buraya eklenmez (bkz. CLAUDE.md → Uydurma içerik yok).

export const FOUNDED = 1994;
export const yearsOfExperience = () => new Date().getFullYear() - FOUNDED;

export const site = {
  name: "ARAS İNŞAAT",
  shortName: "ARAS",
  slogan: "Özenle ve Güvenle",
  founder: "Erbakan ARAS",
  founded: FOUNDED,
  region: "Ankara geneli",
  city: "Ankara",
  instagram: {
    url: "https://www.instagram.com/aras.insaatt/",
    handle: "@aras.insaatt",
  },
  // Boş kalan alanlar sitede gösterilmez.
  phone: "0532 630 46 77",
  phoneHref: "tel:+905326304677",
  email: "erbakanaras@gmail.com",
  address: "" as string,
  description:
    "ARAS İNŞAAT, 1994'ten bu yana Ankara genelinde konut ve villa projeleri, A'dan Z'ye anahtar teslim iç mimari ve dekorasyon işleri yapan köklü bir inşaat firmasıdır.",
};

export const nav = [
  { href: "#anasayfa", label: "Anasayfa" },
  { href: "#kurumsal", label: "Kurumsal" },
  { href: "#uzmanliklar", label: "Uzmanlıklarımız" },
  { href: "#projeler", label: "Projelerimiz" },
  { href: "#referanslar", label: "Referanslar" },
  { href: "#iletisim", label: "İletişim" },
] as const;

export const hero = {
  eyebrow: "ARAS İNŞAAT",
  // İngilizce "Since" ayrı: lang="tr" altında büyük harfe "SİNCE" diye çevrilmesin.
  eyebrowEn: "Since 1994",
  titleLines: ["1994'ten Bugüne", "İhtişamlı", "Yaşam Alanları"],
  text: "Ankara genelinde villa ve konut projelerinde, kaba inşaattan anahtar teslime kadar her detayı özenle ve güvenle inşa ediyoruz.",
};

export const manifesto =
  "Bir yapıyı değerli kılan, ilk bakışta görünmeyen detaylardır. 1994'ten bu yana her projeye aynı titizlikle yaklaşıyor; kaba inşaatın bittiği yerde başlayan ince işçilikle, yaşam alanlarını içinde yaşayacak insanlar için özenle şekillendiriyoruz.";

export const about = {
  eyebrow: "Kurumsal",
  title: ["Köklü tecrübe,", "kalıcı yapılar."],
  paragraphs: [
    "ARAS İNŞAAT, 1994 yılında Erbakan ARAS tarafından Ankara'da kuruldu. Kuruluşumuzdan bu yana sayısız başarılı projeye ve büyük firmalarla iş ortaklıklarına imza attık.",
    "Konut ve villa projelerinde uzmanlaştık. Kaba inşaat sonrasındaki tüm ince işçilikleri ve dekoratif uygulamaları kendi profesyonel ekibimizle, titizlikle hayata geçiriyoruz. İç mimari ve dekorasyonu A'dan Z'ye, anahtar teslim olarak üstleniyoruz.",
  ],
  // Kurucu kartı: gerçek bir alıntı gelene kadar yalnızca doğrulanmış bilgi (kuruluş + logodaki slogan).
  founderText: "1994'te Erbakan ARAS'ın kurduğu firmamız, bugün de ilk günkü ilkeyle çalışıyor:",
  founderMotto: "Özenle ve Güvenle.",
  founderNote: "Kurucu",
};

export const services = [
  {
    id: "anahtar-teslim",
    no: "01",
    title: "A'dan Z'ye Anahtar Teslim",
    text: "Projenin ilk çiziminden anahtarın teslimine kadar tüm süreci tek elden yönetiyoruz. Siz yalnızca yeni yaşam alanınızın keyfini çıkarın.",
    icon: "KeyRound",
    image: "turnkey",
    topic: "Anahtar Teslim İç Mimari",
  },
  {
    id: "ince-iscilik",
    no: "02",
    title: "İnce İşçilik",
    text: "Kaba inşaat sonrasındaki tüm ince işleri profesyonel ekibimizle, milimetrik bir titizlikle uyguluyoruz. Kalıcı kaliteyi detaylarda arıyoruz.",
    icon: "Ruler",
    image: "finework",
    topic: "İnce İşçilik",
  },
  {
    id: "villa-konut",
    no: "03",
    title: "Villa ve Konut Projeleri",
    text: "Ankara genelinde, yaşayanların ihtiyaçlarına göre şekillenen; estetik, konforlu ve uzun ömürlü villa ve konut projeleri hayata geçiriyoruz.",
    icon: "House",
    image: "villa",
    topic: "Villa Projesi",
  },
  {
    id: "dekoratif",
    no: "04",
    title: "Dekoratif Hizmetler",
    text: "İç mimari ve dekorasyonda yüzey, tavan ve duvar uygulamalarından özel detaylara kadar mekâna karakter katan dokunuşlar tasarlıyoruz.",
    icon: "PaintRoller",
    image: "decor",
    topic: "Dekoratif Uygulamalar",
  },
] as const;

// Referanslar. Logolar markaların resmî sitelerinden alındı ve tek renkli maskeye
// çevrildi (public/img/referanslar). ratio = logonun en/boy oranı (boyut dengeleme için);
// scale = ince çizgili logolar için göz kararı büyütme.
export const references = {
  intro:
    "Kuruluşumuzdan bu yana büyük firmalarla iş ortaklıklarına imza attık. Projelerimizde yalnızca kalitesine güvendiğimiz markaları kullanıyoruz.",
  partners: [
    {
      name: "Artı Grup",
      city: "Ankara",
      logo: "/img/referanslar/arti-grup.png",
      ratio: 4.139,
      // Sitenin SSL sertifikası süresi dolmuş (Eylül 2026); tarayıcı uyarı verdiği için
      // bağlantı kapalı. Sertifika yenilenince: "https://www.artigrupinsaat.com.tr/"
      url: "",
    },
    {
      name: "Yıldırım Grup",
      city: "Ankara",
      logo: "/img/referanslar/yildirim-grup.png",
      ratio: 4.846,
      url: "https://yildirimgrup.com.tr/",
    },
    {
      name: "Enam İnşaat",
      city: "Ankara",
      logo: "/img/referanslar/enam.png",
      ratio: 4.036,
      url: "https://enam.com.tr/",
    },
  ],
  brands: [
    { name: "Albera Boya", logo: "/img/referanslar/albera.png", ratio: 1.658, scale: 1.2 },
    { name: "Bien Seramik", logo: "/img/referanslar/bien.png", ratio: 2.52 },
    { name: "Jotun", logo: "/img/referanslar/jotun.svg", ratio: 4.424 },
    { name: "Filli Boya", logo: "/img/referanslar/filli-boya.png", ratio: 1.446, scale: 1.25 },
    { name: "Marshall", logo: "/img/referanslar/marshall.png", ratio: 2.205, scale: 1.15 },
    { name: "Kale Seramik", logo: "/img/referanslar/kale.png", ratio: 2.988 },
    { name: "DYO", logo: "/img/referanslar/dyo.png", ratio: 1.91 },
    { name: "Polisan", logo: "/img/referanslar/polisan.png", ratio: 3.713 },
  ],
};

export const marquee = [
  "Villa Projeleri",
  "Konut Projeleri",
  "İç Mimari",
  "Anahtar Teslim",
  "İnce İşçilik",
  "Dekorasyon",
];

// Hizmet kartındaki "Bilgi Alın" tıklanınca formdaki Konu'yu seçer.
export const TOPIC_EVENT = "aras:konu";
export const selectTopic = (topic: string) =>
  window.dispatchEvent(new CustomEvent(TOPIC_EVENT, { detail: topic }));

export const contactTopics = [
  "Villa Projesi",
  "Konut Projesi",
  "Anahtar Teslim İç Mimari",
  "İnce İşçilik",
  "Dekoratif Uygulamalar",
  "Diğer",
];
