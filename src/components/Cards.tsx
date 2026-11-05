import Link from "next/link";
import type { Category, Product } from "@/lib/types";

export function PlaceholderImage({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={`w-full aspect-[4/3] flex items-center justify-center ${
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

export function CategoryCard({ category, locale, count }: { category: Category; locale: string; count?: number }) {
  return (
    <Link
      href={`/${locale}/urunlerimiz/${category.slug}`}
      className="group block rounded-2xl overflow-hidden bg-zinc-900 hover:bg-zinc-800 transition-colors"
    >
      {category.image ? (
        <div className="bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={category.image} alt={category.name} className="w-full aspect-[4/3] object-cover" />
        </div>
      ) : (
        <PlaceholderImage dark />
      )}
      <div className="p-4 flex items-center justify-between">
        <div>
          <div className="font-semibold text-white">{category.name}</div>
          {count !== undefined && (
            <div className="text-xs text-zinc-500 mt-1">{count} {locale === "en" ? "products" : "ürün"}</div>
          )}
        </div>
        <span className="text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
      </div>
    </Link>
  );
}

export function ProductCard({ product, locale, cta }: { product: Product; locale: string; cta: string }) {
  return (
    <Link
      href={`/${locale}/urun/${product.slug}`}
      className="group block border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-zinc-300 transition-all bg-white"
    >
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={product.image} alt={product.name} className="w-full aspect-[4/3] object-cover" />
      ) : (
        <PlaceholderImage />
      )}
      <div className="p-4">
        <div className="font-semibold group-hover:underline underline-offset-4">{product.name}</div>
        <div className="text-sm text-zinc-400 mt-2 flex items-center gap-1">
          {cta} <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </Link>
  );
}
