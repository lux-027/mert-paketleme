"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type FeaturedProduct = { id: string; name: string; categoryId: string; image?: string };

export default function ProductMediaFields({ existingImage, defaultFeatured, defaultCategoryId, productId, featuredProducts }: { existingImage: string; defaultFeatured: boolean; defaultCategoryId: string; productId?: string; featuredProducts: FeaturedProduct[] }) {
  const container = useRef<HTMLDivElement>(null);
  const previewUrl = useRef("");
  const [preview, setPreview] = useState(existingImage);
  const [fileName, setFileName] = useState("");
  const [featured, setFeatured] = useState(defaultFeatured);
  const [categoryId, setCategoryId] = useState(defaultCategoryId);
  const replaced = featuredProducts.find((product) => product.categoryId === categoryId && product.id !== productId);

  useEffect(() => () => { if (previewUrl.current) URL.revokeObjectURL(previewUrl.current); }, []);

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
    <div ref={container} className="sm:col-span-2 lg:col-span-3 grid sm:grid-cols-[180px_1fr] gap-5">
      <input type="hidden" name="confirmedFeaturedId" defaultValue="" />
      <div>
        <p className="mb-2 text-xs font-medium text-zinc-600">Ürün fotoğrafı</p>
        <label className="relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-100 hover:border-zinc-600 transition-colors focus-within:ring-2 focus-within:ring-zinc-600">
          <input type="file" name="image" accept="image/*" aria-label="Ürün fotoğrafı seç" className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" onChange={(event) => {
            const file = event.target.files?.[0];
            if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
            previewUrl.current = file ? URL.createObjectURL(file) : "";
            setPreview(previewUrl.current || existingImage);
            setFileName(file?.name ?? "");
          }} />
          {preview ? <Image src={preview} alt="Seçilen ürün fotoğrafı" fill unoptimized className="object-contain p-2" /> : <><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9 text-zinc-400"><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="8" cy="9" r="1.5" /><path d="m3 17 5-5 4 4 4-5 5 6" /></svg><span className="mt-3 text-xs font-medium text-zinc-600">Fotoğraf seç</span></>}
          {preview && <span className="absolute bottom-0 inset-x-0 bg-black/75 p-2 text-center text-[10px] text-white">Fotoğrafı değiştirmek için tıklayın</span>}
        </label>
        <p className="mt-2 truncate text-[10px] text-zinc-400">{fileName || "Kare veya yatay, net bir görsel seçin."}</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        <label className="flex cursor-pointer items-center gap-3 bg-zinc-950 p-4 text-white">
          <input type="checkbox" name="featured" checked={featured} onChange={(event) => setFeatured(event.target.checked)} className="h-4 w-4 accent-zinc-500" />
          <span><span className="block text-sm font-semibold">Öne çıkan ürün</span><span className="mt-1 block text-[10px] text-zinc-400">Her kategoriden yalnızca bir ürün.</span></span>
        </label>
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-wider text-zinc-400">Örnek görünüm</p>
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-zinc-200 p-3">
            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">{preview ? <Image src={preview} alt="" fill unoptimized className="object-contain" /> : <svg aria-hidden="true" viewBox="0 0 80 64" className="h-full w-full text-zinc-300" fill="none" stroke="currentColor" strokeWidth="2"><rect x="20" y="12" width="40" height="38" rx="4" /><path d="M30 12V6h20v6M25 50v8m30-8v8M20 30h40" /></svg>}</div>
            <div><p className="text-xs font-semibold">Ürününüz</p><span className={`mt-2 inline-block rounded-full px-2 py-1 text-[9px] ${featured ? "bg-black text-white" : "bg-zinc-100 text-zinc-400"}`}>{featured ? "Öne çıkan" : "Standart ürün"}</span></div>
          </div>
          {featured && replaced && <div role="status" className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900"><strong>{replaced.name}</strong> şu an bu kategorinin öne çıkan ürünü. Kaydederken değiştirme onayı istenecek.</div>}
          {!categoryId && <p className="mt-3 text-xs text-zinc-400">Öne çıkarma durumunu görmek için bir kategori seçin.</p>}
        </div>
      </div>
    </div>
  );
}
