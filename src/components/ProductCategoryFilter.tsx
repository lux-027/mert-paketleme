"use client";

import { useEffect, useId, useTransition } from "react";
import { useRouter } from "next/navigation";

type CategoryOption = { id: string; name: string; count: number };

export default function ProductCategoryFilter({ categories, selectedId = "", total, refreshWhenVisible = true }: { categories: CategoryOption[]; selectedId?: string; total: number; refreshWhenVisible?: boolean }) {
  const router = useRouter();
  const id = useId();
  const [pending, startTransition] = useTransition();
  const value = categories.some((category) => category.id === selectedId) ? selectedId : "";
  useEffect(() => {
    if (!refreshWhenVisible) return;
    let lastRefresh = 0;
    const refresh = () => {
      if (document.visibilityState !== "visible" || Date.now() - lastRefresh < 1000) return;
      lastRefresh = Date.now();
      startTransition(() => router.refresh());
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => { window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); };
  }, [refreshWhenVisible, router, startTransition]);
  return <div className="w-full sm:max-w-sm" aria-busy={pending}>
    <label htmlFor={id} className="mb-1.5 block text-[10px] font-medium text-zinc-500">Kategoriye göre filtrele</label>
    <div className="flex items-center gap-2">
      <select id={id} name="category" value={value} disabled={pending} onChange={(event) => {
        const category = event.currentTarget.value;
        startTransition(() => router.push(category ? `/admin/products?category=${encodeURIComponent(category)}` : "/admin/products", { scroll: false }));
      }} className="min-w-0 flex-1 rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:opacity-60 sm:text-sm">
        <option value="">Tüm kategoriler ({total})</option>
        {categories.map((category) => <option key={category.id} value={category.id}>{category.name} ({category.count})</option>)}
      </select>
      <button type="button" disabled={pending} onClick={() => startTransition(() => router.refresh())} aria-label="Kategori ve ürün listesini yenile" title="Listeyi yenile" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-300 bg-white text-zinc-500 hover:bg-zinc-100 disabled:opacity-50"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`h-4 w-4 ${pending ? "animate-spin motion-reduce:animate-none" : ""}`}><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 6.1A8 8 0 0 1 20 12M4 12a8 8 0 0 0 13.9 5.9" /></svg></button>
    </div>
    {pending && <p role="status" className="sr-only">Kategori ve ürün listesi güncelleniyor…</p>}
  </div>;
}
