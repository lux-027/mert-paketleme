import { optimizePhoto, photoError } from "./photo-upload";

type UploadedMedia = { url: string; token: string };
export type UploadProgress = { stage: "processing" | "signing" | "uploading" | "verifying" | "saving" | "complete"; index: number; total: number; name?: string; percent?: number };
type FileProgress = Pick<UploadProgress, "stage" | "percent">;
const uploaded = new WeakMap<File, UploadedMedia>();
const awaitingVerification = new WeakMap<File, { publicId: string; kind: "image" | "video" }>();

function aborted() { return new DOMException("Yükleme durduruldu. Seçtiğiniz dosyalar ve bilgiler korunuyor.", "AbortError"); }

async function request(body: object, signal?: AbortSignal, timeout = 20000) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  const timer = setTimeout(cancel, timeout);
  signal?.addEventListener("abort", cancel, { once: true });
  if (signal?.aborted) controller.abort();
  try {
    const response = await fetch("/api/admin/uploads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: controller.signal });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Yükleme hizmeti yanıt vermedi. Tekrar deneyin.");
    return data;
  } catch (error) {
    if (signal?.aborted) throw aborted();
    if (controller.signal.aborted) throw new Error("Bağlantı zaman aşımına uğradı. Dosyalarınız seçili duruyor; tekrar deneyebilirsiniz.");
    if (error instanceof TypeError || error instanceof SyntaxError) throw new Error("Yükleme hizmetine bağlanılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.");
    throw error;
  } finally { clearTimeout(timer); signal?.removeEventListener("abort", cancel); }
}

function transfer(url: string, body: FormData, report: (progress: FileProgress) => void, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(aborted()); return; }
    const xhr = new XMLHttpRequest();
    const cancel = () => xhr.abort();
    const finish = () => signal?.removeEventListener("abort", cancel);
    xhr.open("POST", url);
    xhr.timeout = 300000;
    xhr.upload.onprogress = (event) => { if (event.lengthComputable) report({ stage: "uploading", percent: Math.round(event.loaded / event.total * 100) }); };
    xhr.onload = () => { finish(); if (xhr.status >= 200 && xhr.status < 300) resolve(); else reject(new Error("Dosya Cloudinary’ye yüklenemedi. Hesap kotasını kontrol edip tekrar deneyin.")); };
    xhr.onerror = () => { finish(); reject(new Error("Dosya aktarımı kesildi. Bilgileriniz korunuyor; bağlantınızı kontrol edip yeniden deneyin.")); };
    xhr.ontimeout = () => { finish(); reject(new Error("Dosya yüklemesi zaman aşımına uğradı. Daha iyi bir bağlantıyla tekrar deneyin.")); };
    xhr.onabort = () => { finish(); reject(aborted()); };
    signal?.addEventListener("abort", cancel, { once: true });
    try { xhr.send(body); } catch { finish(); reject(new Error("Dosya yüklemesi başlatılamadı. Tekrar deneyin.")); }
  });
}

async function upload(file: File, kind: "image" | "video", report: (progress: FileProgress) => void, signal?: AbortSignal): Promise<UploadedMedia> {
  if (signal?.aborted) throw aborted();
  const cached = uploaded.get(file);
  if (cached) return cached;
  const original = file;
  let pending = awaitingVerification.get(original);
  if (!pending) {
    report({ stage: "processing" });
    if (kind === "image") file = await optimizePhoto(file, signal);
    report({ stage: "signing" });
    const signed = await request({ operation: "sign", kind }, signal);
    const body = new FormData();
    body.set("file", file); body.set("api_key", signed.apiKey); body.set("signature", signed.signature);
    for (const [name, value] of Object.entries(signed.params)) body.set(name, String(value));
    report({ stage: "uploading", percent: 0 });
    await transfer(signed.url, body, report, signal);
    pending = { publicId: signed.params.public_id, kind };
    awaitingVerification.set(original, pending);
  }
  report({ stage: "verifying" });
  const verified = await request({ operation: "verify", kind: pending.kind, publicId: pending.publicId }, signal, 30000);
  uploaded.set(original, verified);
  awaitingVerification.delete(original);
  return verified;
}

export async function prepareMedia(data: FormData, status: (progress: UploadProgress) => void, signal?: AbortSignal) {
  const files = [...data.entries()].filter((entry): entry is [string, File] => ["image", "gallery", "video"].includes(entry[0]) && entry[1] instanceof File && entry[1].size > 0);
  if (data.getAll("retainedImage").length + files.filter(([name]) => name === "gallery").length > 6) throw new Error("Kapak dışında en fazla 6 galeri fotoğrafı ekleyebilirsiniz.");
  for (const [name, file] of files) {
    const video = name === "video";
    const error = video ? (!["video/mp4", "video/webm"].includes(file.type) || file.size > 100 * 1024 * 1024 ? "Video MP4/WebM ve en fazla 100 MB olmalıdır." : "") : photoError(file);
    if (error) throw new Error(error);
  }
  for (const name of ["image", "gallery", "video"]) data.delete(name);
  for (const [index, [name, file]] of files.entries()) {
    const report = (progress: FileProgress) => status({ ...progress, index: index + 1, total: files.length, name: file.name });
    const receipt = await upload(file, name === "video" ? "video" : "image", report, signal);
    data.append(name === "gallery" ? "galleryUpload" : `${name}Upload`, receipt.token);
  }
}
