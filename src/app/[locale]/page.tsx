import Link from "next/link";
import { getDict } from "@/lib/i18n";
import { getCategories, getProducts, getPosts } from "@/lib/store";
import { CategoryCard, ProductCard } from "@/components/Cards";
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
  const categories = getCategories();
  const featured = getProducts().filter((p) => p.featured).slice(0, 6);
  const posts = getPosts().slice(0, 3);

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
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-28">
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
            {dict.home.stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl md:text-3xl font-bold">{s.value}</div>
                <div className="text-xs text-zinc-500 mt-1 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{dict.home.featuresTitle}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mt-10">
          {dict.home.features.map((f, i) => (
            <div
              key={f.title}
              className="border border-zinc-200 rounded-2xl p-6 hover:border-zinc-950 hover:shadow-lg transition-all"
            >
              <div className="text-zinc-950">{featureIcons[i]}</div>
              <div className="font-semibold mt-4">{f.title}</div>
              <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{f.desc}</p>
            </div>
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
            {dict.home.industries.map((t) => (
              <div
                key={t}
                className="bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-sm font-medium text-center text-zinc-200 hover:border-zinc-400 transition-colors"
              >
                {t}
              </div>
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
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} locale={locale} />
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
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} cta={dict.products.viewProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-zinc-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row md:items-center gap-10">
          <div className="flex-1">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight max-w-xl">{dict.home.ctaTitle}</h2>
            <p className="mt-4 text-zinc-400 max-w-lg">{dict.home.ctaText}</p>
          </div>
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
        <div className="rounded-2xl overflow-hidden border border-zinc-800">
          <TechIllustration className="w-full" />
        </div>
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
      </section>

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
            {posts.map((post) => (
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
