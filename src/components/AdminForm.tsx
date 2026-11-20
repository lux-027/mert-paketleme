"use client";

import { useContext, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { prepareMedia } from "@/lib/media-upload";
import type { UploadProgress } from "@/lib/media-upload";
import type { ActionResult } from "@/lib/types";
import { AdminEditorState } from "./AdminEditorState";
import UploadStatus from "./UploadStatus";

export default function AdminForm({ action, children, className, id, confirmMessage, submitLabel, submitDisabled = false }: { action: (data: FormData) => Promise<ActionResult>; children: React.ReactNode; className?: string; id?: string; confirmMessage?: string; submitLabel?: string; submitDisabled?: boolean }) {
  const editor = useContext(AdminEditorState);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState<UploadProgress>({ stage: "processing", index: 0, total: 0 });
  const progressRef = useRef<UploadProgress>({ stage: "processing", index: 0, total: 0 });
  const inFlight = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const setEditorBusy = editor?.setBusy;
  useEffect(() => () => { controller.current?.abort(); setEditorBusy?.(false); }, [setEditorBusy]);
  const router = useRouter();
  const generatedId = useId();
  const formId = id ?? generatedId;
  const preparing = (editor?.photoJobs ?? 0) > 0;
  const feedback = <>{(status || (pending && !editor?.overlay)) && <p role="status" className="col-span-full text-xs text-zinc-500">{pending ? "İşlem sürüyor…" : status}</p>}{error && <p role="alert" className="col-span-full max-h-24 overflow-y-auto rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-700">{error}</p>}</>;
  const controls = <div className="col-span-full space-y-2">{feedback}<button type="submit" form={formId} disabled={pending || preparing || submitDisabled} className="w-full rounded-xl bg-black py-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60 sm:text-sm">{preparing ? "Fotoğraflar hazırlanıyor…" : pending ? "İşlem sürüyor…" : error ? "Yeniden dene" : submitLabel}</button></div>;
  const cancel = () => { if (progressRef.current.stage !== "saving" && progressRef.current.stage !== "complete") controller.current?.abort(); };
  return <form id={formId} method="post" className={className} aria-busy={pending || preparing} onSubmit={async (event) => {
    event.preventDefault();
    if (inFlight.current || preparing || submitDisabled || (confirmMessage && !window.confirm(confirmMessage))) return;
    const data = new FormData(event.currentTarget);
    const activeController = new AbortController();
    controller.current = activeController;
    inFlight.current = true;
    editor?.setBusy(true);
    setPending(true);
    setError("");
    setStatus("");
    const report = (value: UploadProgress) => { progressRef.current = value; setProgress(value); };
    report({ stage: "processing", index: 0, total: 0 });
    try {
      await prepareMedia(data, report, activeController.signal);
      if (activeController.signal.aborted) throw new DOMException("Yükleme durduruldu.", "AbortError");
      report({ stage: "saving", index: 0, total: 0 });
      const result = await action(data);
      if (result.error) { setError(result.error); return; }
      report({ stage: "complete", index: 0, total: 0 });
      setStatus(result.success || "Kaydedildi.");
      editor?.markClean();
      if (result.redirectTo) router.replace(result.redirectTo, { scroll: false }); else router.refresh();
    } catch (error) {
      if (activeController.signal.aborted) setStatus("Yükleme durduruldu. Bilgiler ve dosyalar seçili duruyor; yeniden deneyebilirsiniz.");
      else setError(error instanceof Error ? error.message : "İşlem tamamlanamadı. Bilgileriniz korunuyor; tekrar deneyin.");
    } finally {
      inFlight.current = false;
      setPending(false);
      editor?.setBusy(false);
      if (controller.current === activeController) controller.current = null;
    }
  }}>
    <fieldset disabled={pending} className="contents">{children}</fieldset>
    {submitLabel ? (editor?.footer ? createPortal(controls, editor.footer) : controls) : feedback}
    {pending && editor?.overlay && createPortal(<UploadStatus progress={progress} onCancel={cancel} />, editor.overlay)}
  </form>;
}
