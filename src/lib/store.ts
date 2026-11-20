import "server-only";
import fs from "fs";
import path from "path";
import { cache } from "react";
import { connection } from "next/server";
import { databaseConfigured, initialStore, readDatabaseStore, updateDatabaseStore } from "./database";
import { UserError } from "./types";
import type { Store, Category, Product, Post } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "store.json");

function localStore(): Store {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

export const getStore = cache(async (): Promise<Store> => {
  await connection();
  if (!databaseConfigured()) return process.env.VERCEL ? structuredClone(initialStore) : localStore();
  return (await readDatabaseStore())?.payload ?? structuredClone(initialStore);
});

async function mutate<T>(update: (store: Store) => T): Promise<T> {
  if (databaseConfigured()) return updateDatabaseStore(update);
  if (process.env.VERCEL) throw new UserError("Vercel ortam değişkenlerinde DATABASE_URL eksik.");
  const store = localStore();
  const result = update(store);
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
  return result;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getCategories(): Promise<Category[]> {
  return (await getStore()).categories;
}

export async function getCategory(idOrSlug: string): Promise<Category | undefined> {
  return (await getCategories()).find((c) => c.id === idOrSlug || c.slug === idOrSlug);
}

export async function getProducts(categoryId?: string): Promise<Product[]> {
  const { products } = await getStore();
  return (categoryId ? products.filter((p) => p.categoryId === categoryId) : [...products]).sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return (await getStore()).products.find((p) => p.slug === slug || p.id === slug);
}

export async function getPosts(): Promise<Post[]> {
  return [...(await getStore()).posts].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getStore()).posts.find((p) => p.slug === slug);
}

function nextId(items: { id: string }[]): string {
  return String(Math.max(0, ...items.map((i) => parseInt(i.id) || 0)) + 1);
}

function uniqueSlug(name: string, id: string, items: { id: string; slug: string }[]) {
  const base = slugify(name) || id;
  return items.some((item) => item.id !== id && item.slug === base) ? `${base}-${id}` : base;
}

export async function saveCategory(input: Partial<Category> & { name: string }): Promise<Category> {
  return mutate((store) => {
    const existing = store.categories.find((category) => category.id === input.id);
    if (input.id && !existing) throw new UserError("Kategori artık mevcut değil. Sayfayı yenileyin.");
    const id = existing?.id ?? nextId(store.categories);
    const category: Category = { nameEn: "", image: "", ...existing, ...input, id, slug: uniqueSlug(input.name, id, store.categories) };
    const index = store.categories.findIndex((item) => item.id === id);
    if (index < 0) store.categories.push(category); else store.categories[index] = category;
    return category;
  });
}

export async function deleteCategory(id: string) {
  return mutate((store) => {
    store.categories = store.categories.filter((category) => category.id !== id);
    store.products = store.products.filter((product) => product.categoryId !== id);
  });
}

export async function saveProduct(input: Partial<Product> & { name: string; categoryId: string }, confirmedFeaturedId?: string): Promise<Product> {
  return mutate((store) => {
    if (!store.categories.some((category) => category.id === input.categoryId)) throw new UserError("Kategori artık mevcut değil. Yeni bir kategori seçin.");
    const existing = store.products.find((product) => product.id === input.id);
    if (input.id && !existing) throw new UserError("Ürün artık mevcut değil. Sayfayı yenileyin.");
    if (input.featured) {
      const current = store.products.find((product) => product.categoryId === input.categoryId && product.id !== input.id && product.featured);
      if (current && current.id !== confirmedFeaturedId) throw new UserError("Bu kategorinin çok satan ürünü değişti. Sayfayı yenileyip yeniden onaylayın.");
      store.products = store.products.map((product) => product.categoryId === input.categoryId && product.id !== input.id ? { ...product, featured: false } : product);
    }
    const id = existing?.id ?? nextId(store.products);
    const product: Product = { nameEn: "", description: "", descriptionEn: "", image: "", images: [], video: "", featured: false, ...existing, ...input, id, slug: uniqueSlug(input.name, id, store.products) };
    const index = store.products.findIndex((item) => item.id === id);
    if (index < 0) store.products.push(product); else store.products[index] = product;
    return product;
  });
}

export async function deleteProduct(id: string) {
  return mutate((store) => { store.products = store.products.filter((product) => product.id !== id); });
}
