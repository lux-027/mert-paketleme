"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProductionBanner({ locale }: { locale: string }) {
  const en = locale === "en";
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onReady = () => setReady(true);
    if (document.documentElement.dataset.introReady === "true") {
      const timer = setTimeout(onReady, 0);
      return () => clearTimeout(timer);
    }
    window.addEventListener("intro-ready", onReady);
    return () => window.removeEventListener("intro-ready", onReady);
  }, []);

  useEffect(() => {
    if (!ready || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (!document.hidden) setActive((current) => (current + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, [ready]);

  return (
    <div className="relative isolate min-w-0 w-full py-2">
    <section
      aria-label={en ? "Our production facility" : "Üretim tesisimiz"}
      aria-roledescription={en ? "carousel" : "slayt gösterisi"}
      className="relative isolate mx-auto md:ml-auto md:mr-0 w-[92%] sm:w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-zinc-600/70 ring-4 ring-white/5 shadow-2xl shadow-black/60 overflow-hidden bg-zinc-950 text-white"
    >
      <div className="relative aspect-video max-h-[340px] bg-black">
      {[1, 2, 3, 4].map((image, index) => (
        <div key={image} aria-hidden={active !== index} className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 motion-reduce:transition-none ${active === index ? "opacity-100" : "opacity-0"}`}>
          <Image src={`/production-${image}.webp${image === 3 ? "?v=2" : ""}`} alt={en ? `Mert Makina production facility ${image}` : `Mert Makina üretim tesisi ${image}`} width={1376} height={768} unoptimized priority={index === 0} className="block w-auto h-auto rounded-2xl sm:rounded-3xl max-h-[90%] max-w-[90%] md:max-h-full md:max-w-full" />
        </div>
      ))}
      </div>
      <div className="relative border-t border-white/10 bg-zinc-950 px-3 py-2 sm:px-4 sm:py-3 w-full">
        <div className="flex items-center justify-between gap-2">
          <span aria-hidden="true" className="text-[10px] sm:text-xs font-mono text-zinc-400">0{active + 1} / 04</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((index) => (
              <button key={index} type="button" aria-label={en ? `Show image ${index + 1}` : `${index + 1}. görseli göster`} aria-pressed={active === index} onClick={() => setActive(index)} className="flex h-8 w-10 items-center justify-center rounded focus-visible:outline-2 focus-visible:outline-white">
                <span className={`h-0.5 w-8 rounded-full transition-colors ${active === index ? "bg-white" : "bg-white/35"}`} />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" aria-label={en ? "Previous image" : "Önceki görsel"} onClick={() => setActive((active + 3) % 4)} className="h-9 w-9 sm:h-11 sm:w-11 rounded-full border border-white/40 bg-black/20 hover:bg-white/20 transition-colors">←</button>
            <button type="button" aria-label={en ? "Next image" : "Sonraki görsel"} onClick={() => setActive((active + 1) % 4)} className="h-9 w-9 sm:h-11 sm:w-11 rounded-full border border-white/40 bg-black/20 hover:bg-white/20 transition-colors">→</button>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
