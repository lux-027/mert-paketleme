export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
export const PHOTO_UPLOAD_LIMIT = 2 * 1024 * 1024;
export const PHOTO_SOURCE_LIMIT = 20 * 1024 * 1024;

export function photoError(file: File): string {
  if (!PHOTO_TYPES.includes(file.type)) return "Fotoğraf JPG, PNG, WebP, GIF veya AVIF olmalıdır.";
  if (file.type === "image/gif" && file.size > PHOTO_UPLOAD_LIMIT) return "Hareketli GIF en fazla 2 MB olabilir. Büyük fotoğraflar için JPG, PNG veya WebP seçin.";
  if (file.size > PHOTO_SOURCE_LIMIT) return "Fotoğraf en fazla 20 MB olabilir.";
  return "";
}
