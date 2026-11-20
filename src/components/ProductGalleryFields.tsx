"use client";

import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import { PHOTO_TYPES as photoTypes, photoError, photoPreview } from "@/lib/photo-upload";
import { movePhoto } from "@/lib/gallery-order";
import { AdminEditorState } from "./AdminEditorState";
import ProductVideoField from "./ProductVideoField";

type Photo = { url: string; file?: File };

export default function ProductGalleryFields({ images = [], video = "", uploadsEnabled }: { images?: string[]; video?: string; uploadsEnabled: boolean }) {
  const editor = useContext(AdminEditorState);
  const [photos, setPhotos] = useState<Photo[]>(images.map((url) => ({ url })));
  const photosRef = useRef(photos);
  const gallery = useRef<HTMLDivElement>(null);
  const dragging = useRef<Photo | null>(null);
  const [dragged, setDragged] = useState<string | null>(null);
  const [preparing, setPreparing] = useState("");
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const urls = useRef(new Set<string>());
  const sequence = useRef(0);
  useEffect(() => {
    const allocated = urls.current;
    return () => { sequence.current += 1; allocated.forEach((url) => URL.revokeObjectURL(url)); };
  }, []);
  const syncPhotos = (next: Photo[]) => {
    const transfer = new DataTransfer();
    next.forEach((photo) => { if (photo.file) transfer.items.add(photo.file); });
    if (input.current) input.current.files = transfer.files;
    photosRef.current = next;
    setPhotos(next);
    editor?.markDirty();
  };
  const move = (from: number, to: number) => {
    const next = movePhoto(photosRef.current, from, to);
    if (next !== photosRef.current) syncPhotos(next);
  };
  return (
    <div className="sm:col-span-2 lg:col-span-3 min-w-0 space-y-4">
      <input type="hidden" name="mediaFields" value="1" />
      {photos.filter((photo) => !photo.file).map((photo) => <input key={photo.url} type="hidden" name="retainedImage" value={photo.url} />)}
      {photos.map((photo, index) => <input key={`order-${photo.url}`} type="hidden" name="galleryOrder" value={photo.file ? `new:${photos.slice(0, index).filter((item) => item.file).length}` : `existing:${photo.url}`} />)}
      <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-xs font-semibold">Diğer fotoğraflar</h3><span className="text-[10px] text-zinc-400">{photos.length}/6 fotoğraf · En fazla 20 MB/adet</span></div>
        <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">Fotoğraflar küçük önizlemelerle hazırlanır. Sıralamak için alttaki tutma simgesini basılı tutup sürükleyin.</p>
        {preparing && <p role="status" className="mt-3 flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-3 text-xs text-zinc-500"><span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-800 motion-reduce:animate-none" />{preparing}</p>}
        <div ref={gallery} className="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2" onPointerMove={(event) => {
          const photo = dragging.current;
          if (!photo) return;
          const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-photo-index]");
          if (!target || !gallery.current?.contains(target)) return;
          move(photosRef.current.findIndex((item) => item.url === photo.url), Number(target.dataset.photoIndex));
        }} onPointerUp={() => { dragging.current = null; setDragged(null); }} onPointerCancel={() => { dragging.current = null; setDragged(null); }} onLostPointerCapture={() => { dragging.current = null; setDragged(null); }}>
          {photos.map((photo, index) => <div key={photo.url} data-photo-index={index} className={`relative aspect-square overflow-hidden rounded-lg border bg-white ${dragged === photo.url ? "border-zinc-950 ring-2 ring-zinc-500 opacity-60" : "border-zinc-200"}`}>
            <Image src={photo.url} alt={`Galeri fotoğrafı ${index + 1}`} fill unoptimized draggable={false} className="object-contain p-1 pb-8" />
            <button type="button" aria-label={`${index + 1}. fotoğrafı kaldır`} onClick={() => { if (photo.file) { URL.revokeObjectURL(photo.url); urls.current.delete(photo.url); } syncPhotos(photosRef.current.filter((item) => item !== photo)); }} className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-bl-lg bg-black/80 text-white"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4"><path d="m6 6 12 12M6 18 18 6" /></svg></button>
            <button type="button" aria-label={`${index + 1}. fotoğrafı sürükleyerek veya sağ/sol ok tuşlarıyla taşı`} className="absolute bottom-0 inset-x-0 flex h-8 touch-none items-center justify-between border-t border-zinc-200 bg-zinc-100 px-2 text-[10px] text-zinc-600 cursor-grab active:cursor-grabbing" onPointerDown={(event) => {
              if (event.button !== 0) return;
              event.preventDefault(); dragging.current = photo; setDragged(photo.url); gallery.current?.setPointerCapture(event.pointerId);
            }} onKeyDown={(event) => {
              if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
              event.preventDefault();
              const from = photosRef.current.findIndex((item) => item.url === photo.url);
              move(from, from + (event.key === "ArrowLeft" ? -1 : 1));
            }}><span>{index + 1}</span><svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" /><circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" /></svg></button>
          </div>)}
          {photos.length < 6 && <label className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-zinc-300 bg-white text-zinc-500 ${uploadsEnabled && !preparing ? "cursor-pointer hover:border-zinc-600" : "opacity-50"}`} htmlFor="product-gallery"><span aria-hidden="true" className="text-xl">+</span><span className="text-[10px]">Fotoğraf ekle</span></label>}
        </div>
        <input ref={input} id="product-gallery" type="file" name="gallery" multiple disabled={!uploadsEnabled || Boolean(preparing)} accept={photoTypes.join(",")} className="sr-only" aria-label="Galeri fotoğrafları ekle" onChange={async (event) => {
          const files = Array.from(event.currentTarget.files ?? []);
          const fileError = files.map(photoError).find(Boolean);
          if (fileError || photosRef.current.length + files.length > 6) { setError(fileError || "En fazla 6 galeri fotoğrafı ekleyebilirsiniz."); syncPhotos(photosRef.current); return; }
          if (!files.length) { syncPhotos(photosRef.current); return; }
          const version = ++sequence.current;
          const finish = editor?.beginPhotoTask();
          const batch: Photo[] = [];
          let applied = false;
          setError("");
          setPreparing("Önizlemeler hazırlanıyor…");
          try {
            for (const [index, file] of files.entries()) {
              setPreparing(`Önizlemeler hazırlanıyor (${index + 1}/${files.length})…`);
              const blob = await photoPreview(file);
              if (version !== sequence.current) return;
              batch.push({ file, url: URL.createObjectURL(blob) });
            }
            syncPhotos([...photosRef.current, ...batch]);
            batch.forEach((photo) => urls.current.add(photo.url));
            applied = true;
          } catch {
            if (version === sequence.current) { setError("Fotoğraflardan biri açılamadı. Farklı bir fotoğrafla deneyin; mevcut fotoğraflar ve bilgiler korunuyor."); syncPhotos(photosRef.current); }
          } finally {
            if (!applied) batch.forEach((photo) => URL.revokeObjectURL(photo.url));
            if (version === sequence.current) setPreparing("");
            finish?.();
          }
        }} />
      </section>
      <ProductVideoField video={video} uploadsEnabled={uploadsEnabled} />
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>}
      {!uploadsEnabled && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">Cloudinary bağlantısı henüz yapılandırılmadı. CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY ve CLOUDINARY_API_SECRET ortam değişkenlerini ekleyip yeniden dağıtım yapın. Mevcut görseller korunur.</p>}
    </div>
  );
}
