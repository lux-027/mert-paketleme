import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { ProductCard, CategoryCard } from "@/components/Cards";
import Reveal from "@/components/Reveal";
import { getDict } from "@/lib/i18n";
import { getCategories, getCategory, getProducts } from "@/lib/store";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const dict = getDict(locale);
  const cat = await getCategory(category);
  if (!cat) notFound();
  const [products, categories] = await Promise.all([getProducts(cat.id), getCategories()]);
  const others = categories.filter((c) => c.id !== cat.id);
  const name = locale === "en" && cat.nameEn ? cat.nameEn : cat.name;

  return (
    <div className="pb-20">
      <PageHeader title={name} subtitle={`${products.length} ${dict.products.title.toLowerCase()}`} />
      <div className="max-w-7xl mx-auto px-4">
        <Link
          href={`/${locale}/urunlerimiz`}
          className="inline-flex items-center gap-2 bg-zinc-950 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-zinc-800 transition-colors"
        >
          ← {dict.products.backToCategories}
        </Link>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5 mt-6">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 80} className="h-full">
                <ProductCard product={p} locale={locale} cta={dict.products.viewProduct} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-16 text-center">
            <h2 className="text-lg font-semibold">{locale === "en" ? "No products in this category yet" : "Bu kategoride henüz ürün bulunmuyor"}</h2>
            <p className="mt-3 text-sm text-zinc-500">{locale === "en" ? "Contact us for information about our machines." : "Makinalarımız hakkında bilgi almak için bizimle iletişime geçebilirsiniz."}</p>
            <Link href={`/${locale}/iletisim`} className="inline-block mt-6 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white">{dict.nav.contact}</Link>
          </div>
        )}

        <div className="mt-16">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-1 bg-white rounded" />
              <div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                  {dict.products.relatedCategory}
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">{dict.home.categoriesTitle}</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
              {others.map((c, i) => (
                <Reveal key={c.id} delay={i * 80} className="h-full">
                  <CategoryCard category={c} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
