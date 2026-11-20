"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PhotoPicker from "./PhotoPicker";

type FeaturedProduct = { id: string; name: string; categoryId: string; image?: string };

export default function ProductMediaFields({ existingImage, defaultFeatured, defaultCategoryId, productId, featuredProducts, uploadsEnabled = true }: { existingImage: string; defaultFeatured: boolean; defaultCategoryId: string; productId?: string; featuredProducts: FeaturedProduct[]; uploadsEnabled?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(existingImage);
  const [featured, setFeatured] = useState(defaultFeatured);
  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const replaced = featuredProducts.find((product) => product.categoryId === categoryId && product.id !== productId);

  useEffect(() => {
    const form = container.current?.closest("form");
    if (!form) return;
    const onChange = () => setCategoryId(String(new FormData(form).get("categoryId") ?? ""));
    const onSubmit = (event: SubmitEvent) => {
      const data = new FormData(form);
      const current = featuredProducts.find((product) => product.categoryId === data.get("categoryId") && product.id !== productId);
      const confirmation = form.elements.namedItem("confirmedFeaturedId") as HTMLInputElement;
      confirmation.value = "";
      if (data.get("featured") !== "on" || !current) return;
      if (!window.confirm(`Bu kategoride “${current.name}” öne çıkıyor. Bu ürün onun yerini alsın mı? Eski ürün silinmeyecek, yalnızca öne çıkarılması kaldırılacak.`)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      confirmation.value = current.id;
    };
    form.addEventListener("change", onChange);
    form.addEventListener("submit", onSubmit, true);
    return () => {
      form.removeEventListener("change", onChange);
      form.removeEventListener("submit", onSubmit, true);
    };
  }, [featuredProducts, productId]);

  return (
    <div ref={container} className="sm:col-span-2 lg:col-span-3 min-w-0 grid sm:grid-cols-[180px_1fr] gap-3 sm:gap-5">
      <input type="hidden" name="confirmedFeaturedId" defaultValue="" />
      <PhotoPicker existingImage={existingImage} disabled={!uploadsEnabled} onPreviewChange={setPreview} />
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <label className="flex cursor-pointer items-center gap-3 bg-zinc-950 p-3 sm:p-4 text-white">
          <input type="checkbox" name="featured" checked={featured} onChange={(event) => setFeatured(event.target.checked)} className="h-4 w-4 accent-zinc-500" />
          <span><span className="block text-sm font-semibold">Çok satan ürün</span><span className="mt-1 block text-[10px] text-zinc-400">Her kategoriden yalnızca bir ürün.</span></span>
        </label>
        <div className="p-3 sm:p-4">
          <p className="text-[10px] uppercase tracking-wider text-zinc-400">Örnek görünüm</p>
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">{preview ? <Image src={preview} alt="" fill unoptimized className="object-contain" /> : <svg aria-hidden="true" viewBox="0 0 80 64" className="h-full w-full text-zinc-300" fill="none" stroke="currentColor" strokeWidth="2"><rect x="20" y="12" width="40" height="38" rx="4" /><path d="M30 12V6h20v6M25 50v8m30-8v8M20 30h40" /></svg>}</div>
            <div><p className="text-xs font-semibold">Ürününüz</p><span className={`mt-2 inline-block rounded-full px-2 py-1 text-[9px] ${featured ? "bg-black text-white" : "bg-zinc-100 text-zinc-400"}`}>{featured ? "ÇOK SATAN" : "Standart ürün"}</span></div>
          </div>
          {featured && replaced && <div role="status" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900"><strong>{replaced.name}</strong> şu an bu kategorinin çok satan ürünü. Kaydederken değiştirme onayı istenecek.</div>}
          {!categoryId && <p className="mt-3 text-xs text-zinc-400">Öne çıkarma durumunu görmek için bir kategori seçin.</p>}
        </div>
      </div>
    </div>
  );
}
