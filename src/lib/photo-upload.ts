export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
export const PHOTO_UPLOAD_LIMIT = 2 * 1024 * 1024;
export const PHOTO_SOURCE_LIMIT = 20 * 1024 * 1024;

export function photoError(file: File): string {
  if (!PHOTO_TYPES.includes(file.type)) return "Fotoğraf JPG, PNG, WebP, GIF veya AVIF olmalıdır.";
  if (file.type === "image/gif" && file.size > PHOTO_UPLOAD_LIMIT) return "Hareketli GIF en fazla 2 MB olabilir. Büyük fotoğraflar için JPG, PNG veya WebP seçin.";
  if (file.size > PHOTO_SOURCE_LIMIT) return "Fotoğraf en fazla 20 MB olabilir.";
  return "";
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

export async function optimizePhoto(file: File): Promise<File> {
  const error = photoError(file);
  if (error) throw new Error(error);
  if (file.size <= PHOTO_UPLOAD_LIMIT) return file;
  let image;
  try { image = await decode(file); } catch { throw new Error("Fotoğraf açılamadı. JPG, PNG veya WebP olarak yeniden kaydedip deneyin."); }
  try {
    if (!image.width || !image.height) throw new Error("Fotoğraf boyutları okunamadı.");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Tarayıcı fotoğrafı işleyemedi. Başka bir tarayıcıyla deneyin.");
    let scale = Math.min(1, 2400 / Math.max(image.width, image.height));
    let quality = 0.88;
    for (let attempt = 0; attempt < 12; attempt++) {
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      context.drawImage(image.source, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
      if (!blob) throw new Error("Fotoğraf küçültülemedi. Başka bir fotoğrafla deneyin.");
      if (blob.size <= PHOTO_UPLOAD_LIMIT) {
        const extension = blob.type === "image/webp" ? "webp" : blob.type === "image/jpeg" ? "jpg" : "png";
        return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.${extension}`, { type: blob.type, lastModified: file.lastModified });
      }
      if (quality > 0.6) quality -= 0.12; else scale *= 0.75;
    }
    throw new Error("Fotoğraf yeterince küçültülemedi. Farklı bir fotoğraf seçin.");
  } finally { image.close(); }
}
