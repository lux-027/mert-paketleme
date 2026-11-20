import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict, site } from "@/lib/i18n";
import { getProduct, getCategory, getProducts } from "@/lib/store";
import { PlaceholderImage, ProductCard } from "@/components/Cards";
import Reveal from "@/components/Reveal";
import ProductGallery from "@/components/ProductGallery";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dict = getDict(locale);
  const product = await getProduct(slug);
  if (!product) notFound();
  const cat = await getCategory(product.categoryId);
  const name = locale === "en" && product.nameEn ? product.nameEn : product.name;
  const desc = locale === "en" && product.descriptionEn ? product.descriptionEn : product.description;
  const catName = cat ? (locale === "en" && cat.nameEn ? cat.nameEn : cat.name) : "";
  const related = (await getProducts(product.categoryId)).filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-8 pb-12 sm:py-12 sm:pb-16">
      {cat && (
        <Link
          href={`/${locale}/urunlerimiz/${cat.slug}`}
          className="inline-flex max-w-full items-center gap-2 rounded-full bg-zinc-950 px-4 py-2.5 text-left text-xs font-semibold text-white hover:bg-zinc-800 sm:px-5 sm:text-sm"
        >
          <span aria-hidden="true">←</span><span className="min-w-0 break-words [overflow-wrap:anywhere]">{catName}</span>
        </Link>
      )}
      <div className="mt-5 grid min-w-0 grid-cols-1 gap-5 md:mt-6 md:grid-cols-2 md:gap-10">
        <Reveal className="min-w-0 max-w-full">
        {product.images?.length || product.video ? <ProductGallery key={product.id} image={product.image} images={product.images} video={product.video} name={name} locale={locale} /> : product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={name} decoding="async" className="h-60 max-h-[55svh] w-full rounded-2xl border border-zinc-200 bg-zinc-100 object-contain p-2 sm:aspect-[4/3] sm:h-auto sm:max-h-none sm:p-3" />
        ) : (
          <div className="w-full overflow-hidden rounded-2xl border border-zinc-200">
            <PlaceholderImage dark />
          </div>
        )}
        </Reveal>
        <Reveal delay={120} className="min-w-0 max-w-full">
        <div className="min-w-0">
          {product.featured && <span className="mb-3 inline-block rounded-full bg-zinc-950 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white">{locale === "en" ? "BEST SELLER" : "ÇOK SATAN"}</span>}
          <h1 className="break-words text-2xl font-bold tracking-tight [overflow-wrap:anywhere] sm:text-3xl">{name}</h1>
          {catName && (
            <div className="mt-1 break-words text-xs text-zinc-400 sm:text-sm">
              {dict.products.relatedCategory}: {catName}
            </div>
          )}
          <p className="mt-4 whitespace-pre-line break-words text-sm leading-relaxed text-zinc-600 [overflow-wrap:anywhere] sm:mt-5 sm:text-base">{desc}</p>
          <div className="mt-6 sm:mt-8">
            <Link
              href={`/${locale}/iletisim`}
              className="inline-flex max-w-full items-center justify-center rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 sm:px-6"
            >
              {dict.hero.cta2}
            </Link>
            <div className="mt-4 text-sm text-zinc-500">{site.phone}</div>
          </div>
        </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <div className="mt-10 min-w-0 border-t border-zinc-200 pt-7 sm:mt-16 sm:pt-10">
          <h2 className="mb-5 break-words text-lg font-bold tracking-tight sm:text-xl">{catName}</h2>
          <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-2">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 80} className="h-full min-w-0">
                <ProductCard product={p} locale={locale} cta={dict.products.viewProduct} horizontal />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
