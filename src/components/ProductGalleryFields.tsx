"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { PHOTO_TYPES as photoTypes, photoError } from "@/lib/photo-upload";
import { movePhoto } from "@/lib/gallery-order";

type Photo = { url: string; file?: File };

export default function ProductGalleryFields({ images = [], video = "", uploadsEnabled }: { images?: string[]; video?: string; uploadsEnabled: boolean }) {
  const [photos, setPhotos] = useState<Photo[]>(images.map((url) => ({ url })));
  const photosRef = useRef(photos);
  const gallery = useRef<HTMLDivElement>(null);
  const dragging = useRef<Photo | null>(null);
  const [dragged, setDragged] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState(video);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const urls = useRef(new Set<string>());
  useEffect(() => {
    const allocated = urls.current;
    return () => allocated.forEach((url) => URL.revokeObjectURL(url));
  }, []);
  const syncPhotos = (next: Photo[]) => {
    const transfer = new DataTransfer();
    next.forEach((photo) => { if (photo.file) transfer.items.add(photo.file); });
    if (input.current) input.current.files = transfer.files;
    photosRef.current = next;
    setPhotos(next);
  };
  return (
    <div className="sm:col-span-2 lg:col-span-3 min-w-0 space-y-4">
      <input type="hidden" name="mediaFields" value="1" />
      {photos.filter((photo) => !photo.file).map((photo) => <input key={photo.url} type="hidden" name="retainedImage" value={photo.url} />)}
      {photos.map((photo, index) => <input key={`order-${photo.url}`} type="hidden" name="galleryOrder" value={photo.file ? `new:${photos.slice(0, index).filter((item) => item.file).length}` : `existing:${photo.url}`} />)}
      {removeVideo && <input type="hidden" name="removeVideo" value="on" />}
      <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-xs font-semibold">Diğer fotoğraflar</h3><span className="text-[10px] text-zinc-400">{photos.length}/6 fotoğraf · En fazla 20 MB/adet</span></div>
        <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">Büyük fotoğraflar otomatik küçültülür. Sıralamak için fotoğrafın altındaki tutma simgesini basılı tutup sürükleyin.</p>
        <div ref={gallery} className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2" onPointerMove={(event) => {
          const photo = dragging.current;
          if (!photo) return;
          const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-photo-index]");
          if (!target || !gallery.current?.contains(target)) return;
          syncPhotos(movePhoto(photosRef.current, photosRef.current.findIndex((item) => item.url === photo.url), Number(target.dataset.photoIndex)));
        }} onPointerUp={() => { dragging.current = null; setDragged(null); }} onPointerCancel={() => { dragging.current = null; setDragged(null); }} onLostPointerCapture={() => { dragging.current = null; setDragged(null); }}>
          {photos.map((photo, index) => <div key={photo.url} data-photo-index={index} className={`relative aspect-square overflow-hidden rounded-lg border bg-white ${dragged === photo.url ? "border-zinc-950 ring-2 ring-zinc-500 opacity-60" : "border-zinc-200"}`}>
            <Image src={photo.url} alt={`Galeri fotoğrafı ${index + 1}`} fill unoptimized draggable={false} className="object-contain p-1 pb-8" />
            <button type="button" aria-label={`${index + 1}. fotoğrafı kaldır`} onClick={() => { if (photo.file) { URL.revokeObjectURL(photo.url); urls.current.delete(photo.url); } syncPhotos(photos.filter((item) => item !== photo)); }} className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-bl-lg bg-black/80 text-white"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4"><path d="m6 6 12 12M6 18 18 6" /></svg></button>
            <button type="button" aria-label={`${index + 1}. fotoğrafı sürükleyerek veya sağ/sol ok tuşlarıyla taşı`} className="absolute bottom-0 inset-x-0 flex h-8 touch-none items-center justify-between border-t border-zinc-200 bg-zinc-100 px-2 text-[10px] text-zinc-600 cursor-grab active:cursor-grabbing" onPointerDown={(event) => {
              if (event.button !== 0) return;
              event.preventDefault();
              dragging.current = photo;
              setDragged(photo.url);
              gallery.current?.setPointerCapture(event.pointerId);
            }} onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              event.preventDefault();
              const from = photosRef.current.findIndex((item) => item.url === photo.url);
              syncPhotos(movePhoto(photosRef.current, from, from + (event.key === "ArrowLeft" ? -1 : 1)));
            }}><span>{index + 1}</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" /><circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" /></svg></button>
          </div>)}
          {photos.length < 6 && <label className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-zinc-300 bg-white text-zinc-500 ${uploadsEnabled ? "cursor-pointer hover:border-zinc-600" : "opacity-50"}`} htmlFor="product-gallery"><span aria-hidden="true" className="text-xl">+</span><span className="text-[10px]">Fotoğraf ekle</span></label>}
        </div>
        <input ref={input} id="product-gallery" type="file" name="gallery" multiple disabled={!uploadsEnabled} accept={photoTypes.join(",")} className="sr-only" aria-label="Galeri fotoğrafları ekle" onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          const fileError = files.map(photoError).find(Boolean);
          if (fileError || photos.length + files.length > 6) {
            setError(fileError || "En fazla 6 galeri fotoğrafı ekleyebilirsiniz.");
            syncPhotos(photos);
            return;
          }
          setError("");
          syncPhotos([...photos, ...files.map((file) => { const url = URL.createObjectURL(file); urls.current.add(url); return { file, url }; })]);
        }} />
      </section>
      <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2"><h3 className="text-xs font-semibold">Ürün videosu</h3><span className="text-[10px] text-zinc-400">MP4 / WebM · En fazla 15 MB</span></div>
        {videoPreview && <video key={videoPreview} src={videoPreview} controls playsInline preload="metadata" className="mt-3 max-h-40 sm:max-h-56 w-full rounded-lg bg-black" />}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <label className={`relative rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium ${uploadsEnabled ? "cursor-pointer hover:bg-zinc-100" : "opacity-50"}`}>{videoPreview ? "Videoyu değiştir" : "+ Video dosyası seç"}<input ref={videoInput} type="file" name="video" accept="video/mp4,video/webm" disabled={!uploadsEnabled} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            if (!["video/mp4", "video/webm"].includes(file.type) || file.size > 15 * 1024 * 1024) { setError("Video MP4 veya WebM biçiminde ve en fazla 15 MB olmalıdır."); event.target.value = ""; setVideoPreview(removeVideo ? "" : video); return; }
            setError("");
            const url = URL.createObjectURL(file); urls.current.add(url); setVideoPreview(url); setRemoveVideo(false);
          }} /></label>
          {videoPreview && <button type="button" onClick={() => { if (videoInput.current) videoInput.current.value = ""; setVideoPreview(""); setRemoveVideo(true); }} className="px-3 py-2 text-xs text-red-600">Videoyu kaldır</button>}
        </div>
      </section>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
      {!uploadsEnabled && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">Cloudinary bağlantısı henüz yapılandırılmadı. CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY ve CLOUDINARY_API_SECRET ortam değişkenlerini ekleyip yeniden dağıtım yapın. Mevcut görseller korunur.</p>}
    </div>
  );
}
