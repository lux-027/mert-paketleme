"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { prepareMedia } from "@/lib/media-upload";
import type { ActionResult } from "@/lib/types";

export default function AdminForm({ action, children, className, id, confirmMessage, submitLabel, submitDisabled = false }: { action: (data: FormData) => Promise<ActionResult>; children: React.ReactNode; className?: string; id?: string; confirmMessage?: string; submitLabel?: string; submitDisabled?: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();
  const generatedId = useId();
  const formId = id ?? generatedId;
  const [footer, setFooter] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!submitLabel) return;
    const timer = setTimeout(() => setFooter(document.getElementById("admin-editor-footer")), 0);
    return () => clearTimeout(timer);
  }, [submitLabel]);
  const feedback = <>{status && <p role="status" className="col-span-full text-xs text-zinc-500">{status}</p>}{error && <p role="alert" className="col-span-full max-h-24 overflow-y-auto rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-700">{error}</p>}</>;
  const controls = <div className="col-span-full space-y-2">{feedback}<button type="submit" form={formId} disabled={pending || submitDisabled} className="w-full rounded-xl bg-black py-3 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-60 sm:text-sm">{pending ? "İşlem sürüyor…" : submitLabel}</button></div>;
  return <form id={formId} method="post" className={className} aria-busy={pending} onSubmit={(event) => {
    event.preventDefault();
    if (pending || (confirmMessage && !window.confirm(confirmMessage))) return;
    const data = new FormData(event.currentTarget);
    setError("");
    setStatus("Kaydediliyor…");
    startTransition(async () => {
      try {
        await prepareMedia(data, setStatus);
        setStatus("Kaydediliyor…");
        const result = await action(data);
        if (result.error) { setError(result.error); setStatus(""); return; }
        setStatus(result.success || "Kaydedildi.");
        if (result.redirectTo) router.replace(result.redirectTo, { scroll: false });
        router.refresh();
      } catch (error) {
        setStatus("");
        setError(error instanceof Error ? error.message : "İşlem tamamlanamadı. Lütfen tekrar deneyin.");
      }
    });
  }}>
    <fieldset disabled={pending} className="contents">{children}</fieldset>
    {submitLabel ? (footer ? createPortal(controls, footer) : controls) : feedback}
  </form>;
}
