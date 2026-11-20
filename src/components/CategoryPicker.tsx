"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Category } from "@/lib/types";

export default function CategoryPicker({ categories, defaultValue = "" }: { categories: Category[]; defaultValue?: string }) {
  const details = useRef<HTMLDetailsElement>(null);
  const [selectedId, setSelectedId] = useState(defaultValue);
  const selected = categories.find((category) => category.id === selectedId);
  return (
    <fieldset className="sm:col-span-2 lg:col-span-3 min-w-0">
      <legend className="mb-2 text-xs font-medium text-zinc-600">Kategori</legend>
      <details ref={details} className="group rounded-xl border border-zinc-200 bg-zinc-50">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-3 text-xs sm:text-sm font-medium [&::-webkit-details-marker]:hidden focus-visible:outline-2 focus-visible:outline-zinc-600 rounded-xl">
          {selected?.image ? <Image src={selected.image} alt="" width={40} height={40} unoptimized className="h-9 w-9 shrink-0 rounded-lg object-cover" /> : <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-200"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-zinc-500"><path d="M3 7V5h6l3 3h9v12H3ZM3 11h18" /></svg></span>}
          <span className="min-w-0 flex-1 break-words">{selected?.name ?? "Kategori seç"}</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0 text-zinc-400 group-open:rotate-180 transition-transform"><path d="m6 9 6 6 6-6" /></svg>
        </summary>
        <div className="max-h-60 overflow-y-auto border-t border-zinc-200 p-1.5 space-y-1">
          {categories.map((category) => <label key={category.id} className={`relative flex cursor-pointer items-center gap-3 rounded-lg p-2 text-xs sm:text-sm hover:bg-zinc-200/60 focus-within:ring-2 focus-within:ring-zinc-500 ${selectedId === category.id ? "bg-zinc-200/80" : ""}`}>
            <input type="radio" name="categoryId" value={category.id} checked={selectedId === category.id} required className="peer sr-only" onInvalid={() => { if (details.current) details.current.open = true; }} onChange={() => { setSelectedId(category.id); if (details.current) details.current.open = false; }} />
            {category.image ? <Image src={category.image} alt="" width={40} height={40} unoptimized className="h-10 w-10 shrink-0 rounded-lg object-cover" /> : <span className="h-10 w-10 shrink-0 rounded-lg bg-zinc-200" />}
            <span className="min-w-0 flex-1 break-words leading-5">{category.name}</span>
            {selectedId === category.id && <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0"><path d="m5 12 4 4 10-10" /></svg>}
          </label>)}
          {categories.length === 0 && <p className="p-3 text-xs text-zinc-500">Önce Kategoriler sayfasından bir kategori ekleyin.</p>}
        </div>
      </details>
    </fieldset>
  );
}
