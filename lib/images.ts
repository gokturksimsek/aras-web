// Görseller — şu an Unsplash yer tutucular. Gerçek proje fotoğrafları gelince
// public/img/projeler/ altına koyup buradaki `src` değerlerini değiştirin.

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop`;

export const img = {
  hero: [
    { src: u("1600585154340-be6161a56a0c"), alt: "Akşam ışığında modern villa" },
    { src: u("1600585154526-990dced4db0d"), alt: "Koyu tonlu modern konut cephesi" },
    { src: u("1616594039964-ae9021a400a0"), alt: "Lüks yatak odası iç mimarisi" },
  ],
  aboutMain: { src: u("1503387762-592deb58ef4e"), alt: "Mimari proje çizimi üzerinde çalışma" },
  aboutSide: { src: u("1600607687644-c7171b42498f"), alt: "Aydınlık, minimal yatak odası" },
  turnkey: { src: u("1600607687939-ce8a6c25118c"), alt: "Anahtar teslim modern salon" },
  finework: { src: u("1600566752355-35792bedcfea"), alt: "İnce işçilikle tamamlanmış banyo" },
  villa: { src: u("1613490493576-7fde63acd811"), alt: "Havuzlu modern villa" },
  decor: { src: u("1617806118233-18e1de247200"), alt: "Dekoratif detaylı yemek alanı" },
  cta: { src: u("1600573472550-8090b5e0745e"), alt: "Cam cepheli, havuz manzaralı yaşam alanı" },
};

export type ProjectCategory = "Villa" | "Konut" | "İç Mimari" | "Dekorasyon";

export const projects: {
  src: string;
  alt: string;
  title: string;
  category: ProjectCategory;
  ratio: "tall" | "wide" | "square";
}[] = [
  { src: u("1600596542815-ffad4c1539a9"), alt: "Havuzlu beyaz modern villa", title: "Havuzlu Modern Villa", category: "Villa", ratio: "wide" },
  { src: u("1616594039964-ae9021a400a0"), alt: "Koyu tonlarda yatak odası", title: "Ebeveyn Yatak Odası", category: "İç Mimari", ratio: "tall" },
  { src: u("1600047509807-ba8f99d2cdde"), alt: "Ahşap ve gri kaplamalı konut cephesi", title: "Çağdaş Konut Cephesi", category: "Konut", ratio: "square" },
  { src: u("1618221195710-dd6b41faaea6"), alt: "Doğal tonlarda salon", title: "Doğal Tonlarda Salon", category: "Dekorasyon", ratio: "wide" },
  { src: u("1600566752355-35792bedcfea"), alt: "Siyah detaylı banyo", title: "Banyo Uygulaması", category: "İç Mimari", ratio: "tall" },
  { src: u("1580587771525-78b9dba3b914"), alt: "Sonsuzluk havuzlu villa", title: "Teraslı Villa", category: "Villa", ratio: "square" },
  { src: u("1618219908412-a29a1bb7b86e"), alt: "Aynalı ve bitkili konsol dekorasyonu", title: "Antre Dekorasyonu", category: "Dekorasyon", ratio: "tall" },
  { src: u("1604014237800-1c9102c219da"), alt: "Ahşap zeminli açık plan yemek ve oturma alanı", title: "Açık Plan Yaşam", category: "İç Mimari", ratio: "wide" },
  { src: u("1613977257363-707ba9348227"), alt: "Havuz başında iki katlı villa", title: "Bahçeli Villa", category: "Villa", ratio: "wide" },
  { src: u("1600563438938-a9a27216b4f5"), alt: "Modern müstakil konut", title: "Müstakil Konut", category: "Konut", ratio: "square" },
  { src: u("1617806118233-18e1de247200"), alt: "Yeşil sandalyeli yemek alanı", title: "Yemek Alanı", category: "Dekorasyon", ratio: "square" },
  { src: u("1600210492486-724fe5c67fb0"), alt: "Yüksek tavanlı oturma alanı", title: "Yüksek Tavanlı Salon", category: "İç Mimari", ratio: "tall" },
];
