"use server";

import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, ALLOWED_EMAILS } from "@/auth";
import {
  saveCategory,
  deleteCategory,
  saveProduct,
  deleteProduct,
  getProducts,
  getCategories,
} from "@/lib/store";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || !ALLOWED_EMAILS.includes(session.user.email)) throw new Error("Unauthorized");
}

const imageTypes: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif", "image/avif": ".avif" };
const videoTypes: Record<string, string> = { "video/mp4": ".mp4", "video/webm": ".webm" };

function validateUpload(file: File | null, video = false) {
  if (!file || file.size === 0) return;
  if (!(file instanceof File) || !(video ? videoTypes : imageTypes)[file.type]) throw new Error(video ? "Yalnızca MP4 veya WebM video yükleyin." : "Yalnızca JPG, PNG, WebP, GIF veya AVIF fotoğraf yükleyin.");
  if (file.size > (video ? 15 : 2) * 1024 * 1024) throw new Error(video ? "Video en fazla 15 MB olabilir." : "Her fotoğraf en fazla 2 MB olabilir.");
}

async function saveUpload(file: File | null, video = false): Promise<string | null> {
  validateUpload(file, video);
  if (!file || file.size === 0) return null;
  if (process.env.VERCEL) throw new Error("Canlı medya yüklemeleri için kalıcı depolama bağlantısı gereklidir.");
  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  const name = `${randomUUID()}${(video ? videoTypes : imageTypes)[file.type]}`;
  fs.writeFileSync(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  const image = await saveUpload(formData.get("image") as File | null);
  saveCategory({
    id: (formData.get("id") as string) || undefined,
    name: formData.get("name") as string,
    nameEn: (formData.get("nameEn") as string) || "",
    image: image ?? (formData.get("existingImage") as string) ?? "",
  });
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  deleteCategory(formData.get("id") as string);
  revalidatePath("/");
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const id = (formData.get("id") as string) || undefined;
  const name = (formData.get("name") as string)?.trim();
  const categoryId = formData.get("categoryId") as string;
  const description = (formData.get("description") as string) || "";
  const featured = formData.get("featured") === "on";
  if (!name || !getCategories().some((category) => category.id === categoryId)) throw new Error("Ürün adı ve geçerli bir kategori gereklidir.");
  const products = getProducts();
  const existing = products.find((product) => product.id === id);
  const replaced = products.find((product) => product.featured && product.categoryId === categoryId && product.id !== id);
  if (featured && replaced && formData.get("confirmedFeaturedId") !== replaced.id) throw new Error("Bu kategorinin çok satan ürünü değişti. Sayfayı yenileyip değiştirme işlemini onaylayın.");
  const galleryFiles = (formData.getAll("gallery") as File[]).filter((file) => file.size > 0);
  const retained = formData.has("mediaFields") ? (existing?.images ?? []).filter((url) => formData.getAll("retainedImage").includes(url)) : existing?.images ?? [];
  if (retained.length + galleryFiles.length > 6) throw new Error("Kapak dışında en fazla 6 galeri fotoğrafı ekleyebilirsiniz.");
  validateUpload(formData.get("image") as File | null);
  validateUpload(formData.get("video") as File | null, true);
  galleryFiles.forEach((file) => validateUpload(file));
  const image = await saveUpload(formData.get("image") as File | null);
  const images = [...retained];
  for (const file of galleryFiles) images.push((await saveUpload(file))!);
  const video = await saveUpload(formData.get("video") as File | null, true);
  const currentFeatured = getProducts().find((product) => product.featured && product.categoryId === categoryId && product.id !== id);
  if (featured && currentFeatured && formData.get("confirmedFeaturedId") !== currentFeatured.id) throw new Error("Çok satan ürün değişti. Lütfen yeniden onaylayın.");
  saveProduct({
    id,
    name,
    nameEn: existing?.name === name ? existing.nameEn : "",
    categoryId,
    description,
    descriptionEn: existing?.description === description ? existing.descriptionEn : "",
    image: image ?? existing?.image ?? "",
    images,
    video: video ?? (formData.get("removeVideo") === "on" ? "" : existing?.video ?? ""),
    featured,
  });
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  deleteProduct(formData.get("id") as string);
  revalidatePath("/");
}
