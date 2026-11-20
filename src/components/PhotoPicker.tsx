"use client";

import Image from "next/image";
import { useContext, useEffect, useId, useRef, useState } from "react";
import { photoError, photoPreview } from "@/lib/photo-upload";
import { AdminEditorState } from "./AdminEditorState";

export default function PhotoPicker({ existingImage = "", disabled = false, onPreviewChange }: { existingImage?: string; disabled?: boolean; onPreviewChange?: (url: string) => void }) {
  const editor = useContext(AdminEditorState);
  const id = useId();
  const currentUrl = useRef("");
  const sequence = useRef(0);
  const selected = useRef<File | null>(null);
  const [preview, setPreview] = useState(existingImage);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => () => { sequence.current++; if (currentUrl.current) URL.revokeObjectURL(currentUrl.current); }, []);
  const restore = (input: HTMLInputElement) => {
    const transfer = new DataTransfer();
    if (selected.current) transfer.items.add(selected.current);
    input.files = transfer.files;
    setName(selected.current?.name ?? "");
  };
  return <div>
    <p className="mb-2 text-xs font-medium text-zinc-600">Kapak fotoğrafı</p>
    <label htmlFor={id} className={`relative flex aspect-square w-36 sm:w-44 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-zinc-300 bg-zinc-100 transition-colors focus-within:ring-2 focus-within:ring-zinc-600 ${disabled || busy ? "cursor-wait opacity-60" : "cursor-pointer hover:border-zinc-600"}`}>
      <input id={id} type="file" name="image" disabled={disabled || busy} accept="image/jpeg,image/png,image/webp,image/gif,image/avif" aria-label="Kapak fotoğrafı seç" className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0" onChange={async (event) => {
        const input = event.currentTarget;
        const file = input.files?.[0];
        input.setCustomValidity("");
        const issue = file ? photoError(file) : "";
        setError(issue);
        if (issue) { restore(input); return; }
        if (!file) return;
        const version = ++sequence.current;
        const finish = editor?.beginPhotoTask();
        setBusy(true);
        setName(file.name);
        try {
          const blob = await photoPreview(file);
          if (sequence.current !== version) return;
          if (currentUrl.current) URL.revokeObjectURL(currentUrl.current);
          currentUrl.current = URL.createObjectURL(blob);
          selected.current = file;
          setPreview(currentUrl.current);
          onPreviewChange?.(currentUrl.current);
        } catch {
          if (sequence.current !== version) return;
          restore(input);
          setError("Fotoğrafın önizlemesi hazırlanamadı. Farklı bir fotoğraf seçin; diğer bilgileriniz korunuyor.");
        } finally {
          if (sequence.current === version) setBusy(false);
          finish?.();
        }
      }} />
      {preview ? <Image src={preview} alt="Kapak fotoğrafı önizlemesi" fill unoptimized draggable={false} className="object-contain p-2" /> : <><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-9 w-9 text-zinc-400"><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="8" cy="9" r="1.5" /><path d="m3 17 5-5 4 4 4-5 5 6" /></svg><span className="mt-3 text-xs font-medium text-zinc-600">Fotoğraf seç</span></>}
      {busy && <span role="status" className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-zinc-100/95 text-[10px] text-zinc-500"><span className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 motion-reduce:animate-none" />Önizleme hazırlanıyor…</span>}
      {preview && !busy && <span className="absolute bottom-0 inset-x-0 bg-black/75 p-2 text-center text-[10px] text-white">Değiştirmek için dokunun</span>}
    </label>
    <p className="mt-2 break-all text-[10px] text-zinc-400">{name || "En fazla 20 MB. Fotoğraf otomatik küçültülür."}</p>
    {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
  </div>;
}
