"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./Cards";

export default function ProductsScroller({
  products,
  locale,
  cta,
}: {
  products: Product[];
  locale: string;
  cta: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function scrollBy(dir: number) {
    const el = ref.current;
    if (!el) return;
    const col = el.querySelector<HTMLElement>("[data-col]");
    const w = col ? col.offsetWidth + 20 : el.clientWidth / 2;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
    if (dir > 0 && atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({ left: dir * w, behavior: "smooth" });
    }
  }

  useEffect(() => {
    const t = setInterval(() => scrollBy(1), 10000);
    const el = ref.current;
    const stop = () => clearInterval(t);
    el?.addEventListener("pointerenter", stop);
    return () => {
      clearInterval(t);
      el?.removeEventListener("pointerenter", stop);
    };
  }, []);

  const btn =
    "absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-zinc-300 shadow-md flex items-center justify-center hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-colors";

  return (
    <div className="relative">
      <button onClick={() => scrollBy(-1)} aria-label="Önceki" className={`${btn} -left-2 sm:-left-5`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M15 6l-6 6 6 6" /></svg>
      </button>
      <button onClick={() => scrollBy(1)} aria-label="Sonraki" className={`${btn} -right-2 sm:-right-5`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M9 6l6 6-6 6" /></svg>
      </button>

      <div
        ref={ref}
        className="grid grid-rows-2 grid-flow-col gap-5 overflow-x-auto pb-4 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden auto-cols-[48%] sm:auto-cols-[calc(50%-10px)] lg:auto-cols-[calc(25%-15px)] snap-x snap-mandatory"
      >
        {products.map((p) => (
          <div key={p.id} data-col className="snap-start">
            <ProductCard product={p} locale={locale} cta={cta} />
          </div>
        ))}
      </div>
    </div>
  );
}
