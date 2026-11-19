import Link from "next/link";
import { auth, ALLOWED_EMAILS } from "@/auth";
import PageHeader from "@/components/PageHeader";
import { CategoryCard } from "@/components/Cards";
import ProductsScroller from "@/components/ProductsScroller";
import { getDict, site } from "@/lib/i18n";
import { getCategories, getProducts } from "@/lib/store";

const industryImages = [
  "/industries/taneli.jpg",
  "/industries/toz.jpg",
  "/industries/sivi.jpg",
  "/industries/granullu.jpg",
];

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDict(locale);
  const categories = getCategories();
  const products = getProducts();
  const session = await auth();
  const isAdmin = !!session?.user?.email && ALLOWED_EMAILS.includes(session.user.email);

  return (
    <div className="pb-20">
      <PageHeader title={dict.products.title} subtitle={dict.products.selectCategory} />

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold tracking-tight">{dict.home.categoriesTitle}</h2>
          <Link href={isAdmin ? "/admin/products" : "/admin/login"} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold hover:bg-zinc-950 hover:text-white">
            {isAdmin ? (locale === "en" ? "+ Add product" : "+ Ürün Ekle") : (locale === "en" ? "Admin sign in" : "Yönetici Girişi")}
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {categories.map((c) => (
          <CategoryCard
            key={c.id}
            category={c}
            locale={locale}
            count={products.filter((p) => p.categoryId === c.id).length}
          />
        ))}
        </div>
      </div>

      {/* Banner */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="relative overflow-hidden rounded-2xl bg-zinc-950 text-white px-10 py-14">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/m-mark.png"
            alt=""
            className="absolute -right-16 -top-16 h-72 w-72 object-contain opacity-10 invert pointer-events-none"
          />
          <div className="relative flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex-1">
              <div className="text-xs uppercase tracking-[0.25em] text-zinc-500 font-semibold">
                {dict.home.industriesText}
              </div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight mt-3">
                {dict.home.industriesTitle}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:min-w-[34rem]">
              {dict.home.industries.map((t, i) => (
                <div
                  key={t}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-zinc-800"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={industryImages[i]}
                    alt={t}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-sm font-semibold leading-tight">
                    {t}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* All products */}
      {products.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-16 border-t border-zinc-200 pt-12">
          <h2 className="text-2xl font-bold tracking-tight mb-8">{dict.home.allProducts}</h2>
          <ProductsScroller products={products} locale={locale} cta={dict.products.viewProduct} />
        </div>
      )}

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="bg-zinc-950 text-white rounded-2xl px-10 py-12 flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">{dict.home.ctaTitle}</h3>
            <p className="text-zinc-400 mt-3">{dict.home.ctaText}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold px-5 py-2.5 text-sm rounded-lg text-center transition-colors"
            >
              {dict.home.ctaCall}
            </a>
            <Link
              href={`/${locale}/iletisim`}
              className="border border-zinc-700 hover:border-white font-semibold px-5 py-2.5 text-sm rounded-lg text-center transition-colors"
            >
              {dict.hero.cta2}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
