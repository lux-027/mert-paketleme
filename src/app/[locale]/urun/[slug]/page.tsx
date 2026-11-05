import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, site } from "@/lib/i18n";
import { getProduct, getCategory, getProducts } from "@/lib/store";
import { PlaceholderImage, ProductCard } from "@/components/Cards";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dict = getDict(locale);
  const product = getProduct(slug);
  if (!product) notFound();
  const cat = getCategory(product.categoryId);
  const name = locale === "en" && product.nameEn ? product.nameEn : product.name;
  const desc = locale === "en" && product.descriptionEn ? product.descriptionEn : product.description;
  const catName = cat ? (locale === "en" && cat.nameEn ? cat.nameEn : cat.name) : "";
  const related = getProducts(product.categoryId).filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-16">
      {cat && (
        <Link
          href={`/${locale}/urunlerimiz/${cat.slug}`}
          className="inline-flex items-center gap-2 bg-zinc-950 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-zinc-800 transition-colors"
        >
          ← {catName}
        </Link>
      )}
      <div className="grid md:grid-cols-2 gap-10 mt-6">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={name} className="w-full aspect-[4/3] object-cover rounded-2xl border border-zinc-200" />
        ) : (
          <div className="rounded-2xl overflow-hidden border border-zinc-200">
            <PlaceholderImage dark />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
          {catName && (
            <div className="text-sm text-zinc-400 mt-1">
              {dict.products.relatedCategory}: {catName}
            </div>
          )}
          <p className="mt-5 text-zinc-600 leading-relaxed">{desc}</p>
          <div className="mt-8">
            <Link
              href={`/${locale}/iletisim`}
              className="inline-block bg-zinc-950 hover:bg-zinc-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              {dict.hero.cta2}
            </Link>
            <div className="text-sm text-zinc-500 mt-4">{site.phone}</div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-zinc-200 pt-10">
          <h2 className="text-xl font-bold tracking-tight mb-6">{catName}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} cta={dict.products.viewProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
