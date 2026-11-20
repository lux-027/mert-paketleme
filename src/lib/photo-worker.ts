import { photoError, PHOTO_UPLOAD_LIMIT } from "./photo-settings";

type PhotoJob = { file: File; mode: "preview" | "upload" };
const scope = globalThis as unknown as { onmessage: (event: MessageEvent<PhotoJob>) => void; postMessage: (value: object) => void };

scope.onmessage = async ({ data }) => {
  if (typeof OffscreenCanvas === "undefined" || typeof createImageBitmap !== "function") { scope.postMessage({ unsupported: true }); return; }
  let bitmap: ImageBitmap | undefined;
  let canvas: OffscreenCanvas | undefined;
  try {
    const error = photoError(data.file);
    if (error) throw new Error(error);
    bitmap = await createImageBitmap(data.file);
    const edge = data.mode === "preview" ? 480 : 2400;
    const limit = data.mode === "preview" ? 120 * 1024 : PHOTO_UPLOAD_LIMIT;
    let scale = Math.min(1, edge / Math.max(bitmap.width, bitmap.height));
    let quality = data.mode === "preview" ? 0.75 : 0.88;
    canvas = new OffscreenCanvas(1, 1);
    const context = canvas.getContext("2d");
    if (!context || !bitmap.width || !bitmap.height) throw new Error("Fotoğraf açılamadı.");
    for (let attempt = 0; attempt < 12; attempt++) {
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await canvas.convertToBlob({ type: "image/webp", quality });
      if (blob.size <= limit) { scope.postMessage({ blob }); return; }
      if (quality > 0.6) quality -= 0.12; else scale *= 0.75;
    }
    throw new Error("Fotoğraf küçültülemedi. Farklı bir fotoğraf seçin.");
  } catch (error) {
    scope.postMessage({ error: error instanceof Error ? error.message : "Fotoğraf işlenemedi." });
  } finally {
    bitmap?.close();
    if (canvas) { canvas.width = 1; canvas.height = 1; }
  }
};
