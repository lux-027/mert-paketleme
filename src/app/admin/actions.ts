"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import {
  saveCategory,
  deleteCategory,
  saveProduct,
  deleteProduct,
  slugify,
} from "@/lib/store";

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
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
  revalidatePath("/");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  deleteCategory(formData.get("id") as string);
  revalidatePath("/");
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const image = await saveUpload(formData.get("image") as File | null);
  saveProduct({
    id: (formData.get("id") as string) || undefined,
    name: formData.get("name") as string,
    nameEn: (formData.get("nameEn") as string) || "",
    categoryId: formData.get("categoryId") as string,
    description: (formData.get("description") as string) || "",
    descriptionEn: (formData.get("descriptionEn") as string) || "",
    image: image ?? (formData.get("existingImage") as string) ?? "",
    featured: formData.get("featured") === "on",
  });
  revalidatePath("/");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  deleteProduct(formData.get("id") as string);
  revalidatePath("/");
}
