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

// Her bölüm kendi sayfasında (OBES düzeni). Etkin link pathname ile belirlenir.
export const nav = [
  { href: "/", label: "Anasayfa" },
  { href: "/kurumsal", label: "Kurumsal" },
  { href: "/uzmanliklar", label: "Uzmanlıklarımız" },
  { href: "/projeler", label: "Projelerimiz" },
  { href: "/referanslar", label: "Referanslar" },
  { href: "/iletisim", label: "İletişim" },
] as const;

/** İletişim sayfasına konu seçili gider: /iletisim?konu=... (form Konu'yu otomatik seçer) */
export const contactHref = (topic?: string) => (topic ? `/iletisim?konu=${encodeURIComponent(topic)}` : "/iletisim");

// Alt sayfaların başlık bandı (breadcrumb + başlık + kısa açıklama)
export const pages = {
  kurumsal: {
    crumb: "Kurumsal",
    title: ["1994'ten bu yana", "özenle ve güvenle."],
    lead: "Erbakan ARAS'ın kurduğu firmamız; Ankara genelinde konut, villa ve anahtar teslim iç mimari işlerini kendi ekibiyle yürütür.",
  },
  uzmanliklar: {
    crumb: "Uzmanlıklarımız",
    title: ["Kaba inşaattan", "anahtar teslime."],
    lead: "Villa ve konut projelerinden anahtar teslim iç mimariye; kaba inşaat sonrasındaki tüm ince işçilik ve dekoratif uygulamalar tek elden.",
  },
  projeler: {
    crumb: "Projelerimiz",
    title: ["Seçkin", "yaşam alanları."],
    lead: "Villa, konut, iç mimari ve dekorasyon işlerimizden seçkiler.",
  },
  referanslar: {
    crumb: "Referanslar",
    title: ["Birlikte", "değer katıyoruz."],
    lead: "Birlikte çalıştığımız firmalar ve uygulamalarımızda tercih ettiğimiz markalar.",
  },
  iletisim: {
    crumb: "İletişim",
    title: ["Her proje", "bir sohbetle başlar."],
    lead: "Ankara merkezli ekibimizle Ankara genelindeki villa, konut ve iç mimari projeleriniz için buradayız.",
  },
  kvkk: {
    crumb: "KVKK Aydınlatma Metni",
    title: ["KVKK", "Aydınlatma Metni"],
    lead: "Kişisel verilerinizin korunması ve işlenmesine ilişkin bilgilendirme.",
  },
} as const;

// Kurumsal → Yaklaşımımız. Yalnızca firmanın kendi verdiği bilgilere dayanır.
export const approach = [
  {
    title: "Özenle",
    text: "Kaba inşaatın bittiği yerde başlayan ince işçiliği, kalıcı kaliteyi detaylarda arayan bir titizlikle uygularız.",
  },
  {
    title: "Güvenle",
    text: "1994'ten bu yana aynı ilkeyle çalışıyor; büyük firmalarla kurduğumuz iş ortaklıklarını bu güvene borçluyuz.",
  },
  {
    title: "Tek elden",
    text: "Projenin ilk çiziminden anahtar teslimine kadar bütün süreci tek ekip ve tek sorumlulukla yürütürüz.",
  },
  {
    title: "Kendi ekibimizle",
    text: "İnce işçilik ve dekoratif uygulamalar, işin başından sonuna kendi profesyonel ekibimiz tarafından yapılır.",
  },
];

export const hero = {
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

// Anahtar teslim kapsamı: bir iç mekânın baştan sona yapım sırası (43 iş kalemi).
// Kalem adları firmanın onayladığı hizmet listesidir; açıklamalar ARAS'a özgüdür.
// Sitede "kol" ifadesi kullanılmaz.
export const disciplines = [
  {
    no: "01",
    title: "Mimari Tasarım & Projelendirme",
    short: "Mimari tasarım",
    lead: "Her iş ölçüyle ve çizimle başlar. Mekânı uygulamadan önce üç boyutlu olarak birlikte görür, kararları kâğıt üzerinde netleştiririz.",
    items: [
      "İç mimari tasarım ve uygulama çözümleri",
      "Mimari proje geliştirme ve uygulama yönetimi",
      "3D görselleştirme ve konsept tasarım",
      "Keşif, metraj ve teknik analiz hizmetleri",
    ],
  },
  {
    no: "02",
    title: "Mekanik Tesisat Sistemleri",
    short: "Mekanik tesisat",
    lead: "Duvarlar kapanmadan tamamlanan, görünmeyen ama her gün hissedilen altyapı: su, ısıtma ve yangın hatları projesine uygun döşenir.",
    items: [
      "Sıhhi tesisat sistemleri",
      "Temiz ve pis su tesisat uygulamaları",
      "Doğalgaz ve ısıtma sistemleri",
      "Yerden ısıtma sistemleri",
      "Yangın tesisat sistemleri",
    ],
  },
  {
    no: "03",
    title: "Elektrik & Zayıf Akım Sistemleri",
    short: "Elektrik & zayıf akım",
    lead: "Aydınlatmadan akıllı ev otomasyonuna, güvenlikten data altyapısına; mekânın tüm elektrik sistemleri tek projede kurgulanır.",
    items: [
      "Elektrik altyapı ve tesisat sistemleri",
      "Aydınlatma tasarım ve uygulamaları",
      "Akıllı ev otomasyon sistemleri",
      "Kamera ve güvenlik sistemleri",
      "Alarm ve yangın algılama sistemleri",
      "Data ve network altyapı sistemleri",
      "Görüntülü diafon sistemleri",
    ],
  },
  {
    no: "04",
    title: "Duvar & Yüzey Uygulamaları",
    short: "Duvar & yüzey",
    lead: "Sıvadan son kat boyaya, alçıpandan dekoratif panele; mekânın karakterini belirleyen yüzeyler aynı ustalıkla işlenir.",
    items: [
      "Seramik ve fayans duvar kaplama uygulamaları",
      "Kaba ve ince sıva uygulamaları",
      "Alçı ve saten alçı yüzey uygulamaları",
      "Alçıpan bölme duvar sistemleri",
      "Dekoratif duvar paneli sistemleri",
      "Ahşap, MDF ve taş kaplama uygulamaları",
      "Duvar kâğıdı uygulamaları",
      "Dekoratif boya ve yüzey kaplama sistemleri",
      "Profesyonel boya ve badana uygulamaları",
    ],
  },
  {
    no: "05",
    title: "Zemin Sistemleri",
    short: "Zemin sistemleri",
    lead: "Doğru kotta hazırlanan şap üzerine seramik, doğal taş, parke ya da epoksi; her zemin yıllarca ilk günkü gibi kalacak şekilde uygulanır.",
    items: [
      "Seramik zemin kaplama uygulamaları",
      "Şap ve zemin hazırlık sistemleri",
      "Porselen kaplama uygulamaları",
      "Doğal taş, mermer ve granit zemin uygulamaları",
      "Epoksi ve endüstriyel zemin sistemleri",
      "Laminat, lamine ve masif parke sistemleri",
      "Mozaik ve özel tasarım zemin uygulamaları",
    ],
  },
  {
    no: "06",
    title: "Kapı, Cam & Doğrama Sistemleri",
    short: "Kapı, cam & doğrama",
    lead: "Ölçüsü yerinde alınan kapı, doğrama ve cam sistemleri, mekâna kusursuz oturacak şekilde üretilir ve monte edilir.",
    items: [
      "İç ve dış kapı sistemleri",
      "PVC ve alüminyum doğrama sistemleri",
      "Cam balkon ve sürme sistem çözümleri",
      "Duşakabin ve cam bölme sistemleri",
      "Cam, ayna ve vitrin uygulamaları",
    ],
  },
  {
    no: "07",
    title: "Mobilya & Özel İmalat",
    short: "Mobilya & özel imalat",
    lead: "Mutfaktan giyinme odasına, ölçüye özel üretilen mobilyalarla mekân tamamlanır ve anahtar teslim edilir.",
    items: [
      "Özel tasarım mobilya üretim ve uygulama çözümleri",
      "Mutfak ve banyo sistemleri tasarım ve uygulamaları",
      "Gardırop, vestiyer ve giyinme odası sistemleri",
      "TV ünitesi ve özel yaşam alanı tasarımları",
      "Lake yüzey ve özel boya uygulama sistemleri",
      "Ahşap mimari üretim ve detay çözümleri",
    ],
  },
] as const;

/** Toplam iş kalemi — elle sayılmaz. */
export const disciplineItemCount = disciplines.reduce((n, d) => n + d.items.length, 0);

export const scope = {
  eyebrow: "Anahtar Teslim Kapsamı",
  title: ["Çizimden anahtara,", "her aşama tek elden."],
  lead: "Bir iç mekânın baştan sona bütün işleri, yapıldıkları sırayla ve tek bir ekiple. Taşeronlar arasında koordinasyon aramazsınız; sorumluluk baştan sona bizdedir.",
};

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

export const contactTopics = [
  "Komple Anahtar Teslim",
  "Villa Projesi",
  "Konut Projesi",
  "Anahtar Teslim İç Mimari",
  "İnce İşçilik",
  "Dekoratif Uygulamalar",
  // Anahtar teslim kapsamındaki uygulama alanları
  ...disciplines.map((d) => d.title),
  "Diğer",
];
