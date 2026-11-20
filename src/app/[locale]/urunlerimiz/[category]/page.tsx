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
          <div className="mt-6 grid min-w-0 grid-cols-1 gap-3 sm:gap-4">
            {products.map((p, i) => (
              <Reveal key={p.id} delay={i * 80} className="h-full min-w-0">
                <ProductCard product={p} locale={locale} cta={dict.products.viewProduct} horizontal />
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

        <div className="mt-10 sm:mt-12">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-3 sm:mb-5">
              <div className="h-1 w-7 rounded bg-white" />
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  {dict.products.relatedCategory}
                </div>
                <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">{dict.home.categoriesTitle}</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
              {others.map((c, i) => (
                <Reveal key={c.id} delay={i * 80} className="h-full min-w-0">
                  <CategoryCard category={c} locale={locale} compact />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
