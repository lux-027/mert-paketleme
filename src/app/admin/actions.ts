"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, ALLOWED_EMAILS } from "@/auth";
import {
  saveCategory,
  deleteCategory,
  saveProduct,
  deleteProduct,
  slugify,
  getProducts,
  getCategories,
} from "@/lib/store";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email || !ALLOWED_EMAILS.includes(session.user.email)) throw new Error("Unauthorized");
}

async function saveUpload(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  const ext = path.extname(file.name) || ".jpg";
  const name = `${Date.now()}-${slugify(path.basename(file.name, ext))}${ext}`;
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
  if (featured && replaced && formData.get("confirmedFeaturedId") !== replaced.id) throw new Error("Bu kategorinin öne çıkan ürünü değişti. Sayfayı yenileyip değiştirme işlemini onaylayın.");
  const image = await saveUpload(formData.get("image") as File | null);
  saveProduct({
    id,
    name,
    nameEn: existing?.name === name ? existing.nameEn : "",
    categoryId,
    description,
    descriptionEn: existing?.description === description ? existing.descriptionEn : "",
    image: image ?? existing?.image ?? "",
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
