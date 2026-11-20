"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ image, images = [], video, name, locale }: { image: string; images?: string[]; video?: string; name: string; locale: string }) {
  const [active, setActive] = useState(0);
  const en = locale === "en";
  const photos = [...new Set([image, ...images].filter(Boolean))];
  const count = photos.length + (video ? 1 : 0);
  const selected = Math.min(active, Math.max(0, count - 1));
  const showVideo = Boolean(video) && selected === photos.length;
  if (!count) return null;
  return (
    <div className="w-full min-w-0 max-w-full">
      <div className="relative flex h-60 max-h-[55svh] w-full min-w-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 sm:aspect-[4/3] sm:h-auto sm:max-h-none">
        {showVideo ? <video src={video} controls playsInline preload="metadata" aria-label={en ? `${name} video` : `${name} videosu`} className="h-full w-full max-w-full bg-black object-contain" /> : <Image src={photos[selected] ?? photos[0]} alt={`${name} — ${selected + 1}`} fill unoptimized priority sizes="(max-width: 767px) 100vw, 50vw" className="object-contain p-2 sm:p-3" />}
        {!showVideo && count > 1 && <div className="absolute bottom-2 right-2 rounded-full bg-black/70 px-2.5 py-1 text-[9px] text-white sm:bottom-3 sm:right-3 sm:text-[10px]">{selected + 1} / {count}</div>}
      </div>
      {count > 1 && <div role="group" tabIndex={0} aria-label={en ? "Product media" : "Ürün görselleri"} className="mt-2 flex w-full min-w-0 max-w-full gap-1.5 overflow-x-auto overscroll-x-contain pb-2 sm:mt-3 sm:gap-2">
        {photos.map((photo, index) => <button key={photo} type="button" aria-label={en ? `View photo ${index + 1}` : `${index + 1}. fotoğrafı göster`} aria-pressed={selected === index} onClick={() => setActive(index)} className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-white sm:h-16 sm:w-16 lg:h-20 lg:w-20 ${selected === index ? "border-zinc-950" : "border-zinc-200 hover:border-zinc-400"}`}><Image src={photo} alt="" fill unoptimized className="object-contain p-1" /></button>)}
        {video && <button type="button" aria-label={en ? "Play product video" : "Ürün videosunu göster"} aria-pressed={showVideo} onClick={() => setActive(photos.length)} className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 bg-zinc-950 text-white sm:h-16 sm:w-16 lg:h-20 lg:w-20 ${showVideo ? "border-zinc-500" : "border-zinc-200"}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="m8 4 12 8-12 8Z" /></svg><span className="text-[10px]">Video</span></button>}
      </div>}
    </div>
  );
}
