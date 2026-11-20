import "server-only";
import { createHash, createHmac, randomUUID, timingSafeEqual } from "crypto";
import { UserError } from "./types";

export type MediaKind = "image" | "video";
type Receipt = { url: string; publicId: string; kind: MediaKind; owner: string; expires: number };
const formats = { image: ["jpg", "jpeg", "png", "webp", "gif", "avif"], video: ["mp4", "webm"] };
const maxBytes = { image: 2 * 1024 * 1024, video: 100 * 1024 * 1024 };

export function cloudinaryConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

function config() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud || !key || !secret || !/^[a-zA-Z0-9_-]+$/.test(cloud)) throw new UserError("Cloudinary ortam değişkenleri eksik veya geçersiz.");
  return { cloud, key, secret };
}

export function signUpload(kind: MediaKind) {
  const { cloud, key, secret } = config();
  const params = { allowed_formats: formats[kind].join(","), overwrite: "false", public_id: `mert-paketleme/${kind}/${randomUUID()}`, timestamp: String(Math.floor(Date.now() / 1000)) };
  const value = Object.entries(params).sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => `${name}=${value}`).join("&");
  return { url: `https://api.cloudinary.com/v1_1/${cloud}/${kind}/upload`, apiKey: key, params, signature: createHash("sha1").update(value + secret).digest("hex") };
}

function validPublicId(publicId: string, kind: MediaKind) {
  return new RegExp(`^mert-paketleme/${kind}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`).test(publicId);
}

function validUrl(value: string, kind: MediaKind) {
  const { cloud } = config();
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com" && url.pathname.startsWith(`/${cloud}/${kind}/upload/`) && !url.username && !url.password && !url.search && !url.hash;
  } catch { return false; }
}

function signReceipt(value: string) {
  return createHmac("sha256", config().secret).update(`mert-media-receipt:${value}`).digest("base64url");
}

export async function verifyUpload(publicId: string, kind: MediaKind, owner: string) {
  const { cloud, key, secret } = config();
  if (!validPublicId(publicId, kind)) throw new UserError("Yükleme kimliği geçersiz.");
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/resources/${kind}/upload/${encodeURIComponent(publicId)}`, {
    headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` }, cache: "no-store", signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new UserError("Cloudinary yüklemesi doğrulanamadı. Hesap bilgilerini ve kotayı kontrol edin.");
  const asset = await response.json();
  if (asset.public_id !== publicId || asset.resource_type !== kind || asset.type !== "upload" || typeof asset.bytes !== "number" || asset.bytes < 1 || asset.bytes > maxBytes[kind] || !formats[kind].includes(asset.format) || typeof asset.secure_url !== "string" || !validUrl(asset.secure_url, kind)) throw new UserError("Yüklenen dosyanın türü veya boyutu uygun değil.");
  const receipt: Receipt = { url: asset.secure_url, publicId, kind, owner, expires: Date.now() + 24 * 60 * 60 * 1000 };
  const payload = Buffer.from(JSON.stringify(receipt)).toString("base64url");
  return { url: receipt.url, token: `${payload}.${signReceipt(payload)}` };
}

export function readMediaReceipt(value: FormDataEntryValue | null, kind: MediaKind, owner: string): string | null {
  if (!value) return null;
  if (typeof value !== "string" || value.length > 12000) throw new UserError("Dosya doğrulaması geçersiz. Dosyayı yeniden seçin.");
  const [payload, signature, extra] = value.split(".");
  const expected = Buffer.from(signReceipt(payload || ""));
  const actual = Buffer.from(signature || "");
  if (extra || expected.length !== actual.length || !timingSafeEqual(expected, actual)) throw new UserError("Dosya doğrulaması geçersiz. Dosyayı yeniden seçin.");
  let receipt: Receipt;
  try { receipt = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")); } catch { throw new UserError("Dosya doğrulaması okunamadı."); }
  if (receipt.kind !== kind || receipt.owner !== owner || !Number.isFinite(receipt.expires) || receipt.expires < Date.now() || !validPublicId(receipt.publicId, kind) || !validUrl(receipt.url, kind)) throw new UserError("Dosyanın doğrulama süresi doldu veya dosya uygun değil. Yeniden yükleyin.");
  return receipt.url;
}
