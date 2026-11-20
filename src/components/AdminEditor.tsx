"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminEditorState } from "./AdminEditorState";

export default function AdminEditor({ editing, title, back, children, compact = false, formFooter = false, wide = false }: { editing: boolean; title: string; back: string; children: React.ReactNode; compact?: boolean; formFooter?: boolean; wide?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const busyRef = useRef(false);
  const dirtyRef = useRef(false);
  const jobsRef = useRef(0);
  const [busy, setBusyState] = useState(false);
  const [photoJobs, setPhotoJobs] = useState(0);
  const [footer, setFooter] = useState<HTMLDivElement | null>(null);
  const [overlay, setOverlay] = useState<HTMLDivElement | null>(null);
  const router = useRouter();
  const titleId = useId();
  const setBusy = useCallback((value: boolean) => { busyRef.current = value; setBusyState(value); }, []);
  const markDirty = useCallback(() => { dirtyRef.current = true; }, []);
  const markClean = useCallback(() => { dirtyRef.current = false; }, []);
  const beginPhotoTask = useCallback(() => {
    jobsRef.current++;
    setPhotoJobs(jobsRef.current);
    let active = true;
    return () => {
      if (!active) return;
      active = false;
      jobsRef.current--;
      setPhotoJobs(jobsRef.current);
    };
  }, []);
  useEffect(() => {
    if (!editing) return;
    const element = dialog.current;
    element?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!busyRef.current && !dirtyRef.current && !jobsRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      element?.close();
      document.body.style.overflow = overflow;
    };
  }, [editing]);
  if (!editing) return <>{children}</>;
  const close = () => {
    if (busyRef.current || jobsRef.current > 0) return;
    if (formFooter && dirtyRef.current && !window.confirm("Kaydedilmemiş bilgiler var. Pencereyi kapatmak istiyor musunuz?")) return;
    router.push(back, { scroll: false });
  };
  return (
    <AdminEditorState.Provider value={{ footer, overlay, photoJobs, setBusy, markDirty, markClean, beginPhotoTask }}>
    <dialog ref={dialog} aria-labelledby={titleId} onInputCapture={formFooter ? markDirty : undefined} onChangeCapture={formFooter ? markDirty : undefined} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (!formFooter && event.target === event.currentTarget) close(); }} className={`m-auto w-[calc(100%-2rem)] ${compact ? "max-w-lg" : wide ? "max-w-5xl" : "max-w-3xl"} max-h-[75svh] sm:max-h-[85svh] overflow-hidden rounded-2xl sm:rounded-3xl border border-zinc-200 bg-zinc-50 p-0 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm`}>
      <div className="relative flex max-h-[75svh] sm:max-h-[85svh] flex-col">
      <div className="shrink-0 z-10 flex items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950 text-white px-4 sm:px-5 py-3 sm:py-4">
        <div><p className="text-[10px] uppercase tracking-[.2em] text-zinc-400">İçerik yönetimi</p><h2 id={titleId} className="mt-1 text-base sm:text-lg font-semibold">{title}</h2></div>
        <button type="button" onClick={close} disabled={busy || photoJobs > 0} aria-label="Düzenlemeyi kapat" className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-30"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5"><path d="m6 6 12 12M6 18 18 6" /></svg></button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-6">{children}</div>
      {formFooter && <div ref={setFooter} id="admin-editor-footer" className="shrink-0 border-t border-zinc-200 bg-white px-3 py-3 sm:px-6 sm:py-4" />}
      {formFooter && <div ref={setOverlay} className="pointer-events-none absolute inset-0 z-30" />}
      </div>
    </dialog>
    </AdminEditorState.Provider>
  );
}
