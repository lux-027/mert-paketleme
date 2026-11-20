"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { AdminEditorState } from "./AdminEditorState";

export default function ProductVideoField({ video = "", uploadsEnabled }: { video?: string; uploadsEnabled: boolean }) {
  const editor = useContext(AdminEditorState);
  const [preview, setPreview] = useState(video);
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState("");
  const selected = useRef<File | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const ownedUrl = useRef("");
  useEffect(() => () => { if (ownedUrl.current) URL.revokeObjectURL(ownedUrl.current); }, []);
  const release = () => { if (ownedUrl.current) URL.revokeObjectURL(ownedUrl.current); ownedUrl.current = ""; };
  return <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 sm:p-4">
    {removed && <input type="hidden" name="removeVideo" value="on" />}
    <div className="flex items-center justify-between gap-2"><h3 className="text-xs font-semibold">Ürün videosu</h3><span className="text-[10px] text-zinc-400">MP4 / WebM · En fazla 100 MB</span></div>
    <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">Video otomatik açılmaz. İzlemek isterseniz önizlemeyi başlatın.</p>
    {preview && <div className="mt-3 flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 shrink-0 text-zinc-400"><rect x="3" y="4" width="18" height="16" rx="3" /><path d="m10 8 6 4-6 4Z" /></svg><div className="min-w-0 flex-1"><p className="truncate text-xs font-medium">{name || "Kayıtlı ürün videosu"}</p><button type="button" onClick={() => setShow(!show)} className="mt-1 text-[10px] text-zinc-500 underline">{show ? "Önizlemeyi kapat" : "Videoyu önizle"}</button></div></div>}
    {show && preview && <video key={preview} src={preview} controls playsInline preload="none" className="mt-3 max-h-40 sm:max-h-56 w-full rounded-lg bg-black" />}
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <label className={`relative rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-medium ${uploadsEnabled ? "cursor-pointer hover:bg-zinc-100" : "opacity-50"}`}>{preview ? "Videoyu değiştir" : "+ Video dosyası seç"}<input ref={input} type="file" name="video" accept="video/mp4,video/webm" disabled={!uploadsEnabled} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" onChange={(event) => {
        const file = event.currentTarget.files?.[0];
        if (!file) return;
        if (!["video/mp4", "video/webm"].includes(file.type) || file.size === 0 || file.size > 100 * 1024 * 1024) {
          setError("Video MP4 veya WebM biçiminde ve en fazla 100 MB olmalıdır.");
          const transfer = new DataTransfer();
          if (selected.current) transfer.items.add(selected.current);
          event.currentTarget.files = transfer.files;
          return;
        }
        setShow(false);
        setError("");
        release();
        ownedUrl.current = URL.createObjectURL(file);
        selected.current = file;
        setPreview(ownedUrl.current);
        setName(file.name);
        setRemoved(false);
      }} /></label>
      {preview && <button type="button" onClick={() => { editor?.markDirty(); setShow(false); release(); if (input.current) input.current.value = ""; selected.current = null; setPreview(""); setName(""); setRemoved(true); setError(""); }} className="px-3 py-2 text-xs text-red-600">Videoyu kaldır</button>}
    </div>
    {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
  </section>;
}
