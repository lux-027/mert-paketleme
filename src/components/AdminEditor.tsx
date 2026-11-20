"use client";

import { useEffect, useId, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AdminEditor({ editing, title, back, children, compact = false, formFooter = false }: { editing: boolean; title: string; back: string; children: React.ReactNode; compact?: boolean; formFooter?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const titleId = useId();
  useEffect(() => {
    if (!editing) return;
    const element = dialog.current;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
    };
  }, [editing]);
  if (!editing) return <>{children}</>;
  const close = () => router.push(back, { scroll: false });
  return (
    <dialog ref={dialog} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }} className={`m-auto w-[calc(100%-2rem)] ${compact ? "max-w-lg" : "max-w-3xl"} max-h-[75svh] sm:max-h-[85svh] overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200 bg-zinc-50 p-0 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm`}>
      <div className="flex max-h-[75svh] sm:max-h-[85svh] flex-col">
      <div className="shrink-0 z-10 flex items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950 text-white px-4 sm:px-5 py-3 sm:py-4">
        <div><p className="text-[10px] uppercase tracking-[.2em] text-zinc-400">İçerik yönetimi</p><h2 id={titleId} className="mt-1 text-base sm:text-lg font-semibold">{title}</h2></div>
        <button type="button" onClick={close} aria-label="Düzenlemeyi kapat" className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="m6 6 12 12M6 18 18 6" /></svg></button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-6">{children}</div>
      {formFooter && <div id="admin-editor-footer" className="shrink-0 border-t border-zinc-200 bg-white px-3 py-3 sm:px-6 sm:py-4" />}
      </div>
    </dialog>
  );
}
