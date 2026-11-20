import Link from "next/link";
import type { Category, Product } from "@/lib/types";

export function PlaceholderImage({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <div
      className={`w-full ${compact ? "aspect-[16/10]" : "aspect-[4/3]"} flex items-center justify-center ${
        dark ? "bg-zinc-800" : "bg-zinc-100"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/m-mark.png"
        alt=""
        className={`h-16 w-16 object-contain ${dark ? "opacity-20 invert" : "opacity-15"}`}
      />
    </div>
  );
}

export function CategoryCard({ category, locale, count, compact = false }: { category: Category; locale: string; count?: number; compact?: boolean }) {
  const name = locale === "en" && category.nameEn ? category.nameEn : category.name;
  return (
    <Link
      href={`/${locale}/urunlerimiz/${category.slug}`}
      className="group flex flex-col h-full rounded-2xl overflow-hidden bg-zinc-900 hover:bg-zinc-800 transition-colors"
    >
      {category.image ? (
        <div className="bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={category.image} alt={name} loading="lazy" decoding="async" className={`w-full object-cover ${compact ? "aspect-[16/10]" : "aspect-[4/3]"}`} />
        </div>
      ) : (
        <PlaceholderImage dark compact={compact} />
      )}
      <div className={`${compact ? "px-2.5 py-2 sm:px-3 sm:py-2.5" : "px-3 py-2.5 sm:px-4 sm:py-3"} flex flex-1 items-center justify-between gap-2`}>
        <div className="min-w-0">
          <div className={`font-semibold text-white flex items-center ${compact ? "min-h-8 text-[10px] leading-4 sm:text-xs" : "text-xs sm:text-sm min-h-10 leading-5"}`}>
            <span>{name.includes(" (") ? <>{name.slice(0, name.indexOf(" ("))}<span className="block">{name.slice(name.indexOf(" (") + 1)}</span></> : name}</span>
          </div>
          {count !== undefined && (
            <div className="text-xs text-zinc-500 mt-1">{count} {locale === "en" ? "products" : "ürün"}</div>
          )}
        </div>
        <span className="text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
      </div>
    </Link>
  );
}

export function ProductCard({ product, locale, cta, horizontal = false }: { product: Product; locale: string; cta: string; horizontal?: boolean }) {
  const name = locale === "en" && product.nameEn ? product.nameEn : product.name;
  const description = locale === "en" && product.descriptionEn ? product.descriptionEn : product.description;
  return (
    <Link
      href={`/${locale}/urun/${product.slug}`}
      className={`group border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-zinc-300 transition-all bg-white ${horizontal ? "flex w-full min-w-0 min-h-36 sm:min-h-44 lg:min-h-48" : "block"}`}
    >
      <div className={horizontal ? "relative flex w-28 shrink-0 items-center justify-center border-r border-zinc-100 bg-zinc-50 sm:w-44 lg:w-52" : "w-full"}>
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image} alt={name} loading="lazy" decoding="async" className={horizontal ? "absolute inset-0 h-full w-full object-contain p-2 sm:p-3" : "w-full aspect-[4/3] object-cover"} />
      ) : (
        <PlaceholderImage />
      )}
      </div>
      <div className={horizontal ? "flex min-w-0 flex-1 flex-col p-3 sm:p-5" : "p-4"}>
        {product.featured && <span className="mb-2 inline-block self-start rounded-full bg-zinc-950 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white">{locale === "en" ? "BEST SELLER" : "ÇOK SATAN"}</span>}
        <div className={`font-semibold group-hover:underline underline-offset-4 ${horizontal ? "break-words text-sm leading-5 sm:text-lg sm:leading-6" : ""}`}>{name}</div>
        {horizontal && description && <p className="mt-2 hidden text-xs leading-relaxed text-zinc-500 sm:line-clamp-2 sm:text-sm">{description}</p>}
        <div className={`text-zinc-400 flex items-center gap-1 ${horizontal ? "mt-auto pt-3 text-xs sm:text-sm" : "text-sm mt-2"}`}>
          {cta} <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
