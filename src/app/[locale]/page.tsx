import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { getCategories, getProducts, getPosts } from "@/lib/store";
import { CategoryCard, ProductCard } from "@/components/Cards";
import Reveal from "@/components/Reveal";
import CompanySections from "@/components/CompanySections";
import ProductionBanner from "@/components/ProductionBanner";
import TechIllustration from "@/components/TechIllustration";
import { site } from "@/lib/i18n";

const featureIcons = [
  // wrench / support
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.7 2.7-2.3-.7-.7-2.3 2.7-2.7Z" /></svg>,
  // target / solution
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" fill="currentColor" /></svg>,
  // chip / technology
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><rect x="6" y="6" width="12" height="12" rx="2" /><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" /></svg>,
  // leaf / eco
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M5 19c0-9 4-14 14-14 0 10-5 14-14 14Z" /><path d="M5 19c4-4 7-7 10-10" /></svg>,
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDict(locale);
  const [categories, products, allPosts] = await Promise.all([getCategories(), getProducts(), getPosts()]);
  const featured = products.filter((p) => p.featured).slice(0, 6);
  const posts = allPosts.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-zinc-950 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/m-mark.png"
          alt=""
          className="absolute -right-24 top-1/2 -translate-y-1/2 h-[480px] w-[480px] object-contain opacity-15 invert pointer-events-none"
        />
        <div className="relative max-w-7xl mx-auto px-4 pt-14 pb-8 md:pt-24 md:pb-12 grid lg:grid-cols-[1.05fr_1fr] items-center gap-8 lg:gap-10">
          <Reveal>
          <div className="inline-flex items-center gap-2 border border-zinc-700 rounded-full px-4 py-1.5 text-xs text-zinc-300 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            {site.name}
          </div>
          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl leading-[1.1]">
            {dict.hero.title}
          </h1>
          <p className="mt-6 text-zinc-400 max-w-xl text-lg leading-relaxed">{dict.hero.subtitle}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/urunlerimiz`}
              className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold px-5 py-2.5 text-sm rounded-lg transition-colors"
            >
              {dict.hero.cta}
            </Link>
            <Link
              href={`/${locale}/iletisim`}
              className="border border-zinc-700 hover:border-white font-semibold px-5 py-2.5 text-sm rounded-lg transition-colors"
            >
              {dict.hero.cta2}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-zinc-800 pt-10 max-w-3xl">
            {dict.home.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 100}>
                <div className="text-2xl md:text-3xl font-bold">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">{s.label}</div>
              </Reveal>
            ))}
          </div>
          </Reveal>
          <div className="min-w-0">
            <div aria-hidden="true" className="h-px mb-6 bg-gradient-to-r from-transparent via-zinc-600 to-transparent lg:hidden" />
            <ProductionBanner locale={locale} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <Reveal><h2 className="text-2xl md:text-3xl font-bold tracking-tight">{dict.home.featuresTitle}</h2></Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mt-10">
          {dict.home.features.map((f, i) => (
            <Reveal key={f.title} delay={i * 90} className="h-full">
              <div className="group relative isolate overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 sm:p-6 text-zinc-950 h-full hover:border-zinc-400 hover:shadow-xl transition-all duration-300">
                <svg aria-hidden="true" viewBox="0 0 240 200" className="pointer-events-none absolute right-0 top-0 h-40 w-48 text-zinc-400 opacity-30 group-hover:opacity-50 transition-opacity duration-500" fill="none" stroke="currentColor" strokeWidth=".8">
                  <path d="M0 30h240M0 70h240M0 110h240M0 150h240M40 0v200M80 0v200M120 0v200M160 0v200M200 0v200" opacity=".3" />
                  {i === 0 && <g><circle cx="190" cy="52" r="34" /><circle cx="190" cy="52" r="22" /><path d="M190 8v18m0 52v18m-44-44h18m52 0h18M100 160h50l30-30V96" /><circle cx="100" cy="160" r="4" /></g>}
                  {i === 1 && <g><circle cx="185" cy="60" r="45" /><circle cx="185" cy="60" r="30" /><circle cx="185" cy="60" r="13" /><path d="M125 60h120M185 0v120M95 165l60-60" /><circle cx="95" cy="165" r="4" /></g>}
                  {i === 2 && <g><rect x="148" y="24" width="65" height="65" rx="8" /><rect x="165" y="41" width="31" height="31" rx="3" /><path d="M160 8v16m20-16v16m20-16v16M160 89v25m20-25v40m20-40v25M130 40h18m-18 20h18m65-20h25m-25 20h25M180 129l-30 30H95" /><circle cx="95" cy="159" r="4" /></g>}
                  {i === 3 && <g><path d="M145 108c-5-60 25-85 80-90 0 57-20 91-80 90ZM130 130l70-86M169 86V60m0 26h28M130 130v30H95" /><circle cx="95" cy="160" r="4" /><circle cx="185" cy="65" r="64" strokeDasharray="3 7" /></g>}
                </svg>
                <div className="relative flex items-center justify-between gap-2">
                  <div className="flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl border border-zinc-200 bg-gradient-to-br from-white to-zinc-100 shadow-sm group-hover:border-zinc-400 transition-colors">{featureIcons[i]}</div>
                  <span className="font-mono text-[10px] tracking-widest text-zinc-500">0{i + 1}</span>
                </div>
                <div className="relative mt-4 sm:mt-9 h-px bg-gradient-to-r from-zinc-300 via-zinc-100 to-transparent" />
                <h3 className="relative font-semibold text-sm sm:text-base mt-3 sm:mt-4">{f.title}</h3>
                <p className="relative text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Industries band */}
      <section className="bg-zinc-900 border-y border-zinc-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row lg:items-center gap-8">
          <div className="lg:w-72 shrink-0">
            <h3 className="text-xl font-bold tracking-tight">{dict.home.industriesTitle}</h3>
            <p className="text-sm text-zinc-400 mt-2">{dict.home.industriesText}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
            {dict.home.industries.map((t, i) => (
              <Reveal key={t} delay={i * 90}>
                <div className="bg-zinc-800 border border-zinc-700 rounded-xl px-2.5 py-3 text-xs font-medium text-zinc-200 hover:border-zinc-400 transition-colors flex items-center justify-center gap-2">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0 text-zinc-300">
                    {i === 0 && <g><ellipse cx="7" cy="7" rx="2.5" ry="4" transform="rotate(-35 7 7)" /><ellipse cx="17" cy="9" rx="2.5" ry="4" transform="rotate(30 17 9)" /><ellipse cx="10" cy="18" rx="2.5" ry="4" transform="rotate(65 10 18)" /></g>}
                    {i === 1 && <g><path d="m3 20 7-11a2.3 2.3 0 0 1 4 0l7 11ZM8 13l4 2 4-2" /><circle cx="8" cy="4" r=".6" /><circle cx="15" cy="3" r=".6" /><circle cx="12" cy="6" r=".6" /><path d="M8 18h.01M12 17h.01M15 19h.01" /></g>}
                    {i === 2 && <g><path d="M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12Z" /><path d="M8.5 15.5a3.5 3.5 0 0 0 3 3" /></g>}
                    {i === 3 && <g><path d="m7 3 4 2.3v4.4L7 12 3 9.7V5.3ZM17 12l4 2.3v4.4L17 21l-4-2.3v-4.4ZM6 15l3 1.7v3.6L6 22l-3-1.7v-3.6Z" /><path d="m3 5.3 4 2.4 4-2.4M7 7.7V12m6 2.3 4 2.4 4-2.4M17 16.7V21" /></g>}
                  </svg>
                  {t}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{dict.home.categoriesTitle}</h2>
          <Link href={`/${locale}/urunlerimiz`} className="text-sm font-semibold hover:underline underline-offset-4">
            {dict.home.allProducts} →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 80} className="h-full">
              <CategoryCard category={c} locale={locale} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-zinc-50 border-y border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{dict.home.featuredTitle}</h2>
            <Link href={`/${locale}/urunlerimiz`} className="text-sm font-semibold hover:underline underline-offset-4">
              {dict.home.allProducts} →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 80} className="h-full">
                <ProductCard product={p} locale={locale} cta={dict.products.viewProduct} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row md:items-center gap-10">
          <Reveal className="flex-1">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight max-w-xl">{dict.home.ctaTitle}</h2>
            <p className="mt-4 text-zinc-400 max-w-lg">{dict.home.ctaText}</p>
          </Reveal>
          <div className="flex flex-col gap-4 shrink-0">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold px-8 py-4 rounded-lg text-center transition-colors"
            >
              {dict.home.ctaCall}: <span className="text-sm font-medium">{site.phone}</span>
            </a>
            <Link
              href={`/${locale}/iletisim`}
              className="border border-zinc-700 hover:border-white font-semibold px-8 py-4 rounded-lg text-center transition-colors"
            >
              {dict.hero.cta2}
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <Reveal className="rounded-2xl overflow-hidden border border-zinc-800">
          <TechIllustration className="w-full" />
        </Reveal>
        <Reveal delay={120}>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{dict.home.aboutTitle}</h2>
          <p className="mt-5 text-zinc-500 leading-relaxed">{dict.home.aboutText}</p>
          <ul className="mt-6 space-y-2.5 text-sm">
            {dict.home.features.map((f) => (
              <li key={f.title} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-zinc-950 text-white flex items-center justify-center text-[10px]">✓</span>
                <span className="font-medium">{f.title}</span>
              </li>
            ))}
          </ul>
          <Link
            href={`/${locale}/hakkimizda`}
            className="block mt-8 w-full bg-zinc-950 text-white hover:bg-zinc-800 text-center font-semibold px-6 py-3.5 rounded-lg transition-colors"
          >
            {dict.home.aboutCta}
          </Link>
        </div>
        </Reveal>
      </section>

      <CompanySections locale={locale} />

      {/* Map */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="rounded-2xl overflow-hidden border border-zinc-200">
          <iframe
            title="Konum"
            src={site.mapsEmbed}
            className="w-full h-96"
            loading="lazy"
          />
        </div>
      </section>

      {/* Blog */}
      <section className="bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{dict.home.blogTitle}</h2>
            <Link href={`/${locale}/blog`} className="text-sm font-semibold hover:underline underline-offset-4">
              {dict.blog.title} →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 90} className="h-full">
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.slug}`}
                className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-zinc-300 transition-all"
              >
                {post.image && (
                  <div className="aspect-[16/9] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                <div className="text-xs text-zinc-400">{post.date}</div>
                <div className="font-semibold mt-3 line-clamp-2 leading-snug">
                  {locale === "en" && post.titleEn ? post.titleEn : post.title}
                </div>
                <p className="text-sm text-zinc-500 mt-3 line-clamp-3 leading-relaxed">
                  {locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt}
                </p>
                <div className="text-sm font-semibold mt-4 underline underline-offset-4">
                  {dict.blog.readMore}
                </div>
                </div>
              </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
