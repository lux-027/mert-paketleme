import { optimizePhoto, photoError } from "./photo-upload";

type UploadedMedia = { url: string; token: string };
const uploaded = new WeakMap<File, UploadedMedia>();

async function upload(file: File, kind: "image" | "video"): Promise<UploadedMedia> {
  const cached = uploaded.get(file);
  if (cached) return cached;
  const original = file;
  if (kind === "image") file = await optimizePhoto(file);
  const signedResponse = await fetch("/api/admin/uploads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ operation: "sign", kind }), signal: AbortSignal.timeout(20000) });
  const signed = await signedResponse.json();
  if (!signedResponse.ok) throw new Error(signed.error || "Yükleme yetkisi alınamadı.");
  const body = new FormData();
  body.set("file", file);
  body.set("api_key", signed.apiKey);
  body.set("signature", signed.signature);
  for (const [name, value] of Object.entries(signed.params)) body.set(name, String(value));
  const response = await fetch(signed.url, { method: "POST", body, signal: AbortSignal.timeout(300000) });
  if (!response.ok) throw new Error("Dosya Cloudinary’ye yüklenemedi. Bağlantıyı, hesap kotasını ve dosya boyutunu kontrol edin.");
  const verifiedResponse = await fetch("/api/admin/uploads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ operation: "verify", kind, publicId: signed.params.public_id }), signal: AbortSignal.timeout(30000) });
  const verified = await verifiedResponse.json();
  if (!verifiedResponse.ok) throw new Error(verified.error || "Yüklenen dosya doğrulanamadı.");
  uploaded.set(original, verified);
  return verified;
}

export async function prepareMedia(data: FormData, status: (text: string) => void) {
  const files = [...data.entries()].filter((entry): entry is [string, File] => ["image", "gallery", "video"].includes(entry[0]) && entry[1] instanceof File && entry[1].size > 0);
  if (data.getAll("retainedImage").length + files.filter(([name]) => name === "gallery").length > 6) throw new Error("Kapak dışında en fazla 6 galeri fotoğrafı ekleyebilirsiniz.");
  for (const [name, file] of files) {
    const video = name === "video";
    const error = video ? (!["video/mp4", "video/webm"].includes(file.type) || file.size > 15 * 1024 * 1024 ? "Video MP4/WebM ve en fazla 15 MB olmalıdır." : "") : photoError(file);
    if (error) throw new Error(error);
  }
  for (const name of ["image", "gallery", "video"]) data.delete(name);
  for (const [index, [name, file]] of files.entries()) {
    status(`Dosyalar yükleniyor (${index + 1}/${files.length})…`);
    const receipt = await upload(file, name === "video" ? "video" : "image");
    data.append(name === "gallery" ? "galleryUpload" : `${name}Upload`, receipt.token);
  }
}
