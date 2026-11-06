export const locales = ["tr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "tr";

export const site = {
  name: "Mert Paketleme Makinaları",
  phone: "+90 530 168 57 27",
  email: "info@mertpaketleme.com",
  address: "Sanayi Mah. 60042. Cad. No:23/A, 27110 Şehitkamil / Gaziantep",
  mapsEmbed:
    "https://www.google.com/maps?q=Mert+Paketleme+Makinalar%C4%B1,+3CCM%2BCP,+60042.+Cd.+23a,+27110+%C5%9Eehitkamil,+Gaziantep&z=17&output=embed",
  hours: "Pzt - Cmt: 09:00 - 19:00",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Mert+Paketleme+Makinalar%C4%B1+3CCM%2BCP+%C5%9Eehitkamil+Gaziantep",
};

const tr = {
  nav: {
    home: "Anasayfa",
    about: "Hakkımızda",
    mission: "Misyon & Vizyon",
    products: "Ürünlerimiz",
    gallery: "Galeri",
    blog: "Blog",
    contact: "İletişim",
  },
  hero: {
    title: "İleri Teknoloji Paketleme Makinaları",
    subtitle:
      "0,25 gramdan 50 kg'a kadar taneli, toz, sıvı ve granüllü ürünleri hassas gramajlama sistemleri ile ambalajlayan makineler üretiyoruz.",
    cta: "Ürünlerimizi İnceleyin",
    cta2: "Bize Ulaşın",
  },
  home: {
    featuresTitle: "Neden Mert Paketleme?",
    features: [
      { title: "Teknik Destek", desc: "Kesintisiz teknik destek sağlıyoruz." },
      { title: "Çözüm Odaklılık", desc: "Çözüm odaklı çalışma prensibiyle hareket ediyoruz." },
      { title: "En Yeni Teknoloji", desc: "Makinelerimiz en yeni teknoloji ürünüdür." },
      { title: "Çevre Dostu", desc: "Makinelerimiz çevre dostudur." },
    ],
    categoriesTitle: "Ürün Kategorileri",
    featuredTitle: "Öne Çıkan Ürünler",
    allProducts: "Tüm Ürünler",
    aboutTitle: "Bizi Yakından Tanıyın",
    aboutText:
      "Mert Makina, paketleme makineleri alanında uzun yıllara dayanan tecrübesiyle ambalaj makineleri sektörüne yönelik ürünler üretmektedir. Son teknoloji ve kalite ile müşterilerimizin talepleri doğrultusunda onlarca çeşit makine üretiyoruz.",
    aboutCta: "Hakkımızda",
    blogTitle: "Blog'dan Son Yazılar",
    stats: [
      { value: "17+", label: "Yıllık Deneyim" },
      { value: "170+", label: "Mutlu Müşteri" },
      { value: "20+", label: "Makine Modeli" },
      { value: "%100", label: "Müşteri Memnuniyeti" },
    ],
    ctaTitle: "Projeniz için doğru makineyi birlikte bulalım",
    ctaText: "İhtiyacınıza en uygun paketleme ve dolum çözümü için uzman ekibimizle görüşün.",
    ctaCall: "Bizi Arayın",
    industriesTitle: "Her ürün için doğru çözüm",
    industries: ["Taneli ürünler", "Toz ürünler", "Sıvı ürünler", "Granüllü ürünler"],
    industriesText: "0,25 g – 50 kg arası hassas gramajlama",
  },
  about: {
    title: "Hakkımızda",
    text: "Mert Makina, paketleme makineleri alanında uzun yıllara dayanan tecrübesiyle ambalaj makineleri sektörüne yönelik ürünler üretmektedir. Firmamız, son teknoloji ve kalite ile müşterilerinin talepleri doğrultusunda 0,25 gramdan 50 kg'a kadar her türlü taneli, toz, sıvı ve granüllü ürünleri hassas gramajlama sistemleri ile ambalajlayabilen, doldurabilen ve kutulayabilen onlarca çeşit makineyi üretmektedir.",
  },
  mission: {
    title: "Misyonumuz & Vizyonumuz",
    mission: "Misyonumuz",
    missionText:
      "Paketleme ve dolum makinaları sektöründe en yüksek kalitede ürünler üreterek %100 müşteri memnuniyeti sağlamak.",
    vision: "Vizyonumuz",
    visionText:
      "İleri teknoloji paketleme makinaları ile sektöründe öncü, çevre dostu ve güvenilir bir dünya markası olmak.",
    valuesTitle: "Değerlerimiz",
    values: [
      { title: "Kalite", desc: "Ürettiğimiz her makinede en yüksek kalite standartlarını uygularız." },
      { title: "Güven", desc: "Müşterilerimizle uzun vadeli, güvene dayalı ilişkiler kurarız." },
      { title: "İnovasyon", desc: "En yeni teknolojileri takip eder, sürekli gelişiriz." },
      { title: "Çözüm Odaklılık", desc: "Her ihtiyaca özel, pratik ve etkili çözümler üretiriz." },
    ],
  },
  products: {
    title: "Ürünlerimiz",
    selectCategory: "Kategori seçin",
    viewProduct: "İncele",
    backToCategories: "Tüm Kategoriler",
    relatedCategory: "Kategori",
  },
  blog: { title: "Blog", readMore: "Devamını Oku" },
  contact: {
    title: "İletişim",
    subtitle: "Detaylı bilgi için bizimle iletişime geçin.",
    name: "Adınız",
    email: "E-Posta",
    phone: "Telefon",
    message: "Mesajınız",
    send: "Gönder",
    address: "Adres",
    workingHours: "Çalışma Saatleri",
    closed: "Kapalı",
    sunday: "Pazar",
    sent: "Mesajınız alındı. En kısa sürede dönüş yapacağız.",
  },
  footer: {
    rights: "Tüm Hakları Saklıdır.",
    quickMenu: "Hızlı Menü",
    contact: "İletişim",
    workingHours: "Çalışma Saatleri",
    weekdays: "Pazartesi – Cumartesi",
    sundayClosed: "Pazar: Kapalı",
  },
  lang: { switchTo: "EN" },
};

export type Dict = typeof tr;

const en: Dict = {
  nav: {
    home: "Home",
    about: "About Us",
    mission: "Mission & Vision",
    products: "Products",
    gallery: "Gallery",
    blog: "Blog",
    contact: "Contact",
  },
  hero: {
    title: "Advanced Packaging Machines",
    subtitle:
      "We manufacture machines that package granular, powder, liquid and granulated products from 0.25 g to 50 kg with precision weighing systems.",
    cta: "Explore Our Products",
    cta2: "Contact Us",
  },
  home: {
    featuresTitle: "Why Mert Paketleme?",
    features: [
      { title: "Technical Support", desc: "We provide uninterrupted technical support." },
      { title: "Solution-Oriented", desc: "We work with a solution-oriented approach." },
      { title: "Latest Technology", desc: "Our machines are built with the latest technology." },
      { title: "Eco-Friendly", desc: "Our machines are environmentally friendly." },
    ],
    categoriesTitle: "Product Categories",
    featuredTitle: "Featured Products",
    allProducts: "All Products",
    aboutTitle: "Get to Know Us",
    aboutText:
      "Mert Makina manufactures packaging machinery backed by years of experience in the packaging industry. We produce dozens of machine types tailored to our customers' needs with the latest technology and quality.",
    aboutCta: "About Us",
    blogTitle: "Latest Blog Posts",
    stats: [
      { value: "17+", label: "Years of Experience" },
      { value: "170+", label: "Happy Customers" },
      { value: "20+", label: "Machine Models" },
      { value: "100%", label: "Customer Satisfaction" },
    ],
    ctaTitle: "Let's find the right machine for your project",
    ctaText: "Talk to our expert team for the most suitable packaging and filling solution.",
    ctaCall: "Call Us",
    industriesTitle: "The right solution for every product",
    industries: ["Granular products", "Powder products", "Liquid products", "Granulated products"],
    industriesText: "Precise weighing from 0.25 g to 50 kg",
  },
  about: {
    title: "About Us",
    text: "Mert Makina manufactures packaging machinery backed by years of experience in the packaging industry. Our company produces dozens of machine types capable of packaging, filling and boxing granular, powder, liquid and granulated products from 0.25 g to 50 kg with precision weighing systems.",
  },
  mission: {
    title: "Our Mission & Vision",
    mission: "Our Mission",
    missionText:
      "To ensure 100% customer satisfaction by manufacturing the highest quality products in the packaging and filling machinery sector.",
    vision: "Our Vision",
    visionText:
      "To be a pioneering, eco-friendly and reliable world brand in the sector with advanced packaging machines.",
    valuesTitle: "Our Values",
    values: [
      { title: "Quality", desc: "We apply the highest quality standards in every machine we build." },
      { title: "Trust", desc: "We build long-term, trust-based relationships with our customers." },
      { title: "Innovation", desc: "We follow the latest technologies and continuously improve." },
      { title: "Solution-Oriented", desc: "We produce practical and effective solutions for every need." },
    ],
  },
  products: {
    title: "Our Products",
    selectCategory: "Select a category",
    viewProduct: "View",
    backToCategories: "All Categories",
    relatedCategory: "Category",
  },
  blog: { title: "Blog", readMore: "Read More" },
  contact: {
    title: "Contact",
    subtitle: "Contact us for detailed information.",
    name: "Your Name",
    email: "E-Mail",
    phone: "Phone",
    message: "Your Message",
    send: "Send",
    address: "Address",
    workingHours: "Working Hours",
    closed: "Closed",
    sunday: "Sunday",
    sent: "Your message has been received. We will get back to you shortly.",
  },
  footer: {
    rights: "All Rights Reserved.",
    quickMenu: "Quick Menu",
    contact: "Contact",
    workingHours: "Working Hours",
    weekdays: "Monday – Saturday",
    sundayClosed: "Sunday: Closed",
  },
  lang: { switchTo: "TR" },
};

const dicts: Record<Locale, Dict> = { tr, en };

export function getDict(locale: string): Dict {
  return dicts[(locale as Locale) in dicts ? (locale as Locale) : defaultLocale];
}
