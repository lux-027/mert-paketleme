import { UserError } from "./types";

export function movePhoto<T>(items: T[], from: number, to: number): T[] {
  if (from < 0 || to < 0 || from >= items.length || to >= items.length || from === to) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function orderedGallery(retained: string[], uploaded: string[], order: FormDataEntryValue[]) {
  if (!order.length) return [...new Set([...retained, ...uploaded])];
  const refs = [...retained.map((url) => `existing:${url}`), ...uploaded.map((_, index) => `new:${index}`)];
  if (order.length !== refs.length || new Set(order).size !== refs.length || order.some((ref) => typeof ref !== "string" || !refs.includes(ref))) throw new UserError("Fotoğraf sıralaması geçersiz. Sayfayı yenileyip tekrar deneyin.");
  return [...new Set(order.map((ref) => {
    const value = String(ref);
    return value.startsWith("new:") ? uploaded[Number(value.slice(4))] : value.slice(9);
  }))];
}
