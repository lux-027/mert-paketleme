"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { prepareMedia } from "@/lib/media-upload";
import type { ActionResult } from "@/lib/types";

export default function AdminForm({ action, children, className, id, confirmMessage }: { action: (data: FormData) => Promise<ActionResult>; children: React.ReactNode; className?: string; id?: string; confirmMessage?: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();
  return <form id={id} method="post" className={className} aria-busy={pending} onSubmit={(event) => {
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
    {status && <p role="status" className="col-span-full text-xs text-zinc-500">{status}</p>}
    {error && <p role="alert" className="col-span-full rounded-xl border border-red-200 bg-red-50 p-3 text-xs leading-relaxed text-red-700">{error}</p>}
  </form>;
}
