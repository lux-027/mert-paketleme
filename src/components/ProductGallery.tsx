"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ image, images = [], video, name, locale }: { image: string; images?: string[]; video?: string; name: string; locale: string }) {
  const [active, setActive] = useState(0);
  const en = locale === "en";
  const photos = [...new Set([image, ...images].filter(Boolean))];
  const count = photos.length + (video ? 1 : 0);
  const showVideo = Boolean(video) && active === photos.length;
  if (!count) return null;
  return (
    <div className="min-w-0">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
        {showVideo ? <video src={video} controls playsInline preload="metadata" aria-label={en ? `${name} video` : `${name} videosu`} className="h-full w-full bg-black object-contain" /> : <Image src={photos[active] ?? photos[0]} alt={`${name} — ${active + 1}`} fill unoptimized priority className="object-contain" />}
        {!showVideo && count > 1 && <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-[10px] text-white">{active + 1} / {count}</div>}
      </div>
      {count > 1 && <div aria-label={en ? "Product media" : "Ürün görselleri"} className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {photos.map((photo, index) => <button key={photo} type="button" aria-label={en ? `View photo ${index + 1}` : `${index + 1}. fotoğrafı göster`} aria-pressed={active === index} onClick={() => setActive(index)} className={`relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-white ${active === index ? "border-zinc-950" : "border-zinc-200 hover:border-zinc-400"}`}><Image src={photo} alt="" fill unoptimized className="object-contain p-1" /></button>)}
        {video && <button type="button" aria-label={en ? "Play product video" : "Ürün videosunu göster"} aria-pressed={showVideo} onClick={() => setActive(photos.length)} className={`flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 bg-zinc-950 text-white ${showVideo ? "border-zinc-500" : "border-zinc-200"}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="m8 4 12 8-12 8Z" /></svg><span className="text-[10px]">Video</span></button>}
      </div>}
    </div>
  );
}
