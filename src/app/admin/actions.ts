"use server";

import { revalidatePath } from "next/cache";
import { auth, ALLOWED_EMAILS } from "@/auth";
import { saveCategory, deleteCategory, saveProduct, deleteProduct, getCategories, getProducts } from "@/lib/store";
import { initializeDatabase } from "@/lib/database";
import { readMediaReceipt } from "@/lib/cloudinary";
import { orderedGallery } from "@/lib/gallery-order";
import { UserError } from "@/lib/types";
import type { ActionResult } from "@/lib/types";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || !ALLOWED_EMAILS.includes(session.user.email)) throw new UserError("Yönetici oturumunuz sona erdi. Yeniden giriş yapın.");
  return session.user.email;
}

function text(data: FormData, key: string, max: number, required = false) {
  const value = data.get(key);
  if (value !== null && typeof value !== "string") throw new UserError("Geçersiz form bilgisi.");
  const result = (value ?? "").trim();
  if ((required && !result) || result.length > max) throw new UserError("Gerekli alanları doldurun ve metin uzunluklarını kontrol edin.");
  return result;
}

async function run(operation: (email: string) => Promise<ActionResult>): Promise<ActionResult> {
  try {
    return await operation(await requireAdmin());
  } catch (error) {
    return { error: error instanceof UserError ? error.message : "Kayıt tamamlanamadı. Neon bağlantısını ve veritabanı kurulumunu kontrol edin; sonra yeniden deneyin." };
  }
}

export async function initializeDatabaseAction(): Promise<ActionResult> {
  return run(async () => {
    await initializeDatabase();
    revalidatePath("/", "layout");
    return { success: "Veritabanı hazır. Mevcut kayıtlar korunarak başlangıç içerikleri aktarıldı." };
  });
}

export async function saveCategoryAction(data: FormData): Promise<ActionResult> {
  return run(async (email) => {
    const id = text(data, "id", 80) || undefined;
    const existing = (await getCategories()).find((category) => category.id === id);
    const image = readMediaReceipt(data.get("imageUpload"), "image", email);
    const name = text(data, "name", 160, true);
    await saveCategory({ id, name, nameEn: existing?.name === name ? existing.nameEn : "", image: image ?? existing?.image ?? "" });
    revalidatePath("/", "layout");
    return { redirectTo: "/admin/categories" };
  });
}

export async function deleteCategoryAction(data: FormData): Promise<ActionResult> {
  return run(async () => {
    await deleteCategory(text(data, "id", 80, true));
    revalidatePath("/", "layout");
    return { success: "Kategori silindi." };
  });
}

export async function saveProductAction(data: FormData): Promise<ActionResult> {
  return run(async (email) => {
    const id = text(data, "id", 80) || undefined;
    const name = text(data, "name", 160, true);
    const categoryId = text(data, "categoryId", 80, true);
    const description = text(data, "description", 10000);
    const featured = data.get("featured") === "on";
    const [categories, products] = await Promise.all([getCategories(), getProducts()]);
    if (!categories.some((category) => category.id === categoryId)) throw new UserError("Geçerli bir kategori seçin.");
    const existing = products.find((product) => product.id === id);
    const tokens = data.getAll("galleryUpload");
    if (tokens.length > 6) throw new UserError("En fazla 6 galeri fotoğrafı ekleyebilirsiniz.");
    const retained = data.has("mediaFields") ? (existing?.images ?? []).filter((url) => data.getAll("retainedImage").includes(url)) : existing?.images ?? [];
    const images = orderedGallery(retained, tokens.map((token) => readMediaReceipt(token, "image", email)!), data.getAll("galleryOrder"));
    if (images.length > 6) throw new UserError("Kapak dışında en fazla 6 galeri fotoğrafı ekleyebilirsiniz.");
    const image = readMediaReceipt(data.get("imageUpload"), "image", email);
    const video = readMediaReceipt(data.get("videoUpload"), "video", email);
    await saveProduct({ id, name, nameEn: existing?.name === name ? existing.nameEn : "", categoryId, description,
      descriptionEn: existing?.description === description ? existing.descriptionEn : "", image: image ?? existing?.image ?? "", images,
      video: video ?? (data.get("removeVideo") === "on" ? "" : existing?.video ?? ""), featured,
    }, text(data, "confirmedFeaturedId", 80) || undefined);
    revalidatePath("/", "layout");
    return { redirectTo: "/admin/products" };
  });
}

export async function deleteProductAction(data: FormData): Promise<ActionResult> {
  return run(async () => {
    await deleteProduct(text(data, "id", 80, true));
    revalidatePath("/", "layout");
    return { success: "Ürün silindi." };
  });
}
