import { photoError, PHOTO_UPLOAD_LIMIT } from "./photo-settings";
export { PHOTO_TYPES, PHOTO_UPLOAD_LIMIT, PHOTO_SOURCE_LIMIT, photoError } from "./photo-settings";

type Mode = "preview" | "upload";
let queue: Promise<unknown> = Promise.resolve();

function workerPhoto(file: File, mode: Mode, signal?: AbortSignal): Promise<Blob | null> {
  if (typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined") return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    let worker: Worker;
    try { worker = new Worker(new URL("./photo-worker.ts", import.meta.url), { type: "module" }); } catch { resolve(null); return; }
    const cancel = () => { finish(); reject(new DOMException("Yükleme durduruldu.", "AbortError")); };
    const finish = () => { clearTimeout(timer); signal?.removeEventListener("abort", cancel); worker.terminate(); };
    const timer = setTimeout(() => { finish(); reject(new Error("Fotoğrafın işlenmesi çok uzun sürdü. Farklı bir fotoğrafla deneyin.")); }, 60000);
    signal?.addEventListener("abort", cancel, { once: true });
    if (signal?.aborted) { cancel(); return; }
    worker.onmessage = ({ data }) => {
      finish();
      if (data.unsupported) resolve(null);
      else if (data.error) reject(new Error(data.error));
      else if (data.blob instanceof Blob) resolve(data.blob);
      else reject(new Error("Fotoğraf işlenemedi."));
    };
    worker.onerror = (event) => { event.preventDefault(); finish(); resolve(null); };
    worker.onmessageerror = () => { finish(); reject(new Error("Fotoğraf işleme sonucu okunamadı.")); };
    try { worker.postMessage({ file, mode }); } catch { finish(); reject(new Error("Fotoğraf işleme başlatılamadı.")); }
  });
}

async function decode(file: File) {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);
    return { source: bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close() };
  }
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => { image.onload = () => resolve(); image.onerror = () => reject(new Error("Fotoğraf açılamadı.")); image.src = url; });
    return { source: image, width: image.naturalWidth, height: image.naturalHeight, close: () => URL.revokeObjectURL(url) };
  } catch (error) { URL.revokeObjectURL(url); throw error; }
}

async function mainThreadPhoto(file: File, mode: Mode, signal?: AbortSignal): Promise<Blob> {
  let image;
  try { image = await decode(file); } catch { throw new Error("Fotoğraf açılamadı. JPG, PNG veya WebP olarak yeniden kaydedip deneyin."); }
  let canvas: HTMLCanvasElement | undefined;
  try {
    if (!image.width || !image.height) throw new Error("Fotoğraf boyutları okunamadı.");
    canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Tarayıcı fotoğrafı işleyemedi. Başka bir tarayıcıyla deneyin.");
    const edge = mode === "preview" ? 480 : 2400;
    const limit = mode === "preview" ? 120 * 1024 : PHOTO_UPLOAD_LIMIT;
    let scale = Math.min(1, edge / Math.max(image.width, image.height));
    let quality = mode === "preview" ? 0.75 : 0.88;
    for (let attempt = 0; attempt < 12; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (signal?.aborted) throw new DOMException("Yükleme durduruldu.", "AbortError");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      context.drawImage(image.source, 0, 0, canvas.width, canvas.height);
      const target = canvas;
      const blob = await new Promise<Blob | null>((resolve) => target.toBlob(resolve, "image/webp", quality));
      if (!blob) throw new Error("Fotoğraf küçültülemedi. Başka bir fotoğrafla deneyin.");
      if (blob.size <= limit) return blob;
      if (quality > 0.6) quality -= 0.12; else scale *= 0.75;
    }
    throw new Error("Fotoğraf yeterince küçültülemedi. Farklı bir fotoğraf seçin.");
  } finally {
    image.close();
    if (canvas) { canvas.width = 1; canvas.height = 1; }
  }
}

function processPhoto(file: File, mode: Mode, signal?: AbortSignal): Promise<Blob> {
  const error = photoError(file);
  if (error) return Promise.reject(new Error(error));
  const job = queue.then(async () => {
    if (signal?.aborted) throw new DOMException("Yükleme durduruldu.", "AbortError");
    return (await workerPhoto(file, mode, signal)) ?? mainThreadPhoto(file, mode, signal);
  });
  queue = job.then(() => undefined, () => undefined);
  return job;
}

export function photoPreview(file: File): Promise<Blob> {
  return processPhoto(file, "preview");
}

export async function optimizePhoto(file: File, signal?: AbortSignal): Promise<File> {
  const error = photoError(file);
  if (error) throw new Error(error);
  if (file.size <= PHOTO_UPLOAD_LIMIT) return file;
  const blob = await processPhoto(file, "upload", signal);
  const extension = blob.type === "image/webp" ? "webp" : blob.type === "image/jpeg" ? "jpg" : "png";
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.${extension}`, { type: blob.type, lastModified: file.lastModified });
}
