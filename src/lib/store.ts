import fs from "fs";
import path from "path";
import type { Store, Category, Product, Post } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "store.json");

function read(): Store {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function write(store: Store) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const getStore = read;

export function getCategories(): Category[] {
  return read().categories;
}

export function getCategory(idOrSlug: string): Category | undefined {
  return read().categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
}

export function getProducts(categoryId?: string): Product[] {
  const { products } = read();
  return categoryId ? products.filter((p) => p.categoryId === categoryId) : products;
}

export function getProduct(slug: string): Product | undefined {
  return read().products.find((p) => p.slug === slug || p.id === slug);
}

export function getPosts(): Post[] {
  return read().posts.sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return read().posts.find((p) => p.slug === slug);
}

function nextId(items: { id: string }[]): string {
  return String(Math.max(0, ...items.map((i) => parseInt(i.id) || 0)) + 1);
}

export function saveCategory(input: Partial<Category> & { name: string }): Category {
  const store = read();
  if (input.id) {
    const idx = store.categories.findIndex((c) => c.id === input.id);
    if (idx >= 0) {
      store.categories[idx] = { ...store.categories[idx], ...input, slug: slugify(input.name) };
      write(store);
      return store.categories[idx];
    }
  }
  const cat: Category = {
    id: nextId(store.categories),
    slug: slugify(input.name),
    name: input.name,
    nameEn: input.nameEn ?? "",
    image: input.image ?? "",
  };
  store.categories.push(cat);
  write(store);
  return cat;
}

export function deleteCategory(id: string) {
  const store = read();
  store.categories = store.categories.filter((c) => c.id !== id);
  store.products = store.products.filter((p) => p.categoryId !== id);
  write(store);
}

export function saveProduct(input: Partial<Product> & { name: string; categoryId: string }): Product {
  const store = read();
  if (input.id) {
    const idx = store.products.findIndex((p) => p.id === input.id);
    if (idx >= 0) {
      store.products[idx] = { ...store.products[idx], ...input, slug: slugify(input.name) };
      write(store);
      return store.products[idx];
    }
  }
  const product: Product = {
    id: nextId(store.products),
    slug: slugify(input.name),
    name: input.name,
    nameEn: input.nameEn ?? "",
    categoryId: input.categoryId,
    description: input.description ?? "",
    descriptionEn: input.descriptionEn ?? "",
    image: input.image ?? "",
    featured: input.featured ?? false,
  };
  store.products.push(product);
  write(store);
  return product;
}

export function deleteProduct(id: string) {
  const store = read();
  store.products = store.products.filter((p) => p.id !== id);
  write(store);
}
