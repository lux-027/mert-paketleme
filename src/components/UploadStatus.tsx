"use client";

import type { UploadProgress } from "@/lib/media-upload";

const titles = { processing: "Dosya hazırlanıyor", signing: "Yükleme bağlantısı alınıyor", uploading: "Dosya yükleniyor", verifying: "Yükleme doğrulanıyor", saving: "Bilgiler kaydediliyor", complete: "Kayıt tamamlandı" };

export default function UploadStatus({ progress, onCancel }: { progress: UploadProgress; onCancel: () => void }) {
  const percent = progress.stage === "uploading" ? progress.percent : undefined;
  return <div className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-zinc-950/95 p-5 text-white backdrop-blur-sm">
    <section aria-label="Kaydetme durumu" className="w-full max-w-sm rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800/80 to-zinc-950 p-5 text-center shadow-2xl sm:p-7">
      <div aria-hidden="true" className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5"><span className="absolute -inset-2 animate-spin rounded-3xl border border-white/5 border-t-white/60 motion-reduce:animate-none" /><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-zinc-200"><path d="M12 16V3m-4 4 4-4 4 4M4 14v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /></svg></div>
      <p className="mt-6 text-[9px] uppercase tracking-[.25em] text-zinc-500">İçerik yönetimi</p>
      <h3 aria-live="polite" className="mt-2 text-lg font-semibold">{titles[progress.stage]}</h3>
      {progress.total > 0 && progress.stage !== "saving" && progress.stage !== "complete" && <p className="mt-2 text-xs text-zinc-400">Dosya {progress.index} / {progress.total}</p>}
      {progress.name && progress.stage !== "saving" && <p title={progress.name} className="mt-2 truncate text-[10px] text-zinc-500">{progress.name}</p>}
      {percent !== undefined ? <div className="mt-5"><div role="progressbar" aria-label="Dosya aktarımı" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-white transition-[width] duration-150 motion-reduce:transition-none" style={{ width: `${percent}%` }} /></div><p aria-hidden="true" className="mt-2 font-mono text-xs tabular-nums text-zinc-400">{percent}%</p></div> : <div aria-hidden="true" className="mx-auto mt-5 h-1 w-24 animate-pulse rounded-full bg-zinc-500 motion-reduce:animate-none" />}
      <p className="mt-5 text-[10px] leading-relaxed text-zinc-500">İşlem tamamlanmadan pencere kapanmaz.<br />Bir hata olursa bilgileriniz ve dosya seçiminiz korunur.</p>
      {progress.stage !== "saving" && progress.stage !== "complete" && <button type="button" onClick={onCancel} className="mt-4 rounded-lg border border-zinc-700 px-3 py-2 text-[10px] text-zinc-400 hover:border-zinc-400 hover:text-white">Yüklemeyi durdur</button>}
    </section>
  </div>;
}
