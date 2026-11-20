import Link from "next/link";
import { getCategories, getProducts, getCategory } from "@/lib/store";
import { saveProductAction, deleteProductAction } from "../actions";

const input =
  "mt-1.5 border border-zinc-200 bg-zinc-50 rounded-xl px-3 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-500 transition-colors file:mr-3 file:border-0 file:rounded-md file:bg-zinc-200 file:px-2 file:py-1 file:text-xs";

export default async function ProductsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const categories = getCategories();
  const products = getProducts();
  const editing = products.find((p) => p.id === edit);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.25em] text-zinc-500">Katalog yönetimi</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Ürünler</h1><p className="mt-2 text-sm text-zinc-500">Makine bilgilerini, görsellerini ve iki dilde açıklamalarını yönetin.</p></div><span className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-500">{products.length} ürün</span></div>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold">{editing ? "Ürünü düzenle" : "Yeni ürün oluştur"}</h2>{editing && <Link href="/admin/products" className="text-xs text-zinc-500 hover:text-black">Düzenlemeyi iptal et</Link>}</div>

      <form
        action={saveProductAction}
        className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-5 sm:p-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <input type="hidden" name="id" value={editing?.id ?? ""} />
        <input type="hidden" name="existingImage" value={editing?.image ?? ""} />
        <div>
          <label className="text-xs text-zinc-500">Ürün Adı (TR)</label>
          <input name="name" required defaultValue={editing?.name ?? ""} className={input} />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Ürün Adı (EN)</label>
          <input name="nameEn" defaultValue={editing?.nameEn ?? ""} className={input} />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Kategori</label>
          <select
            name="categoryId"
            required
            defaultValue={editing?.categoryId ?? ""}
            className={input}
          >
            <option value="">Seçin…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="text-xs text-zinc-500">Açıklama (TR)</label>
          <textarea
            name="description"
            rows={2}
            defaultValue={editing?.description ?? ""}
            className={input}
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="text-xs text-zinc-500">Açıklama (EN)</label>
          <textarea
            name="descriptionEn"
            rows={2}
            defaultValue={editing?.descriptionEn ?? ""}
            className={input}
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Ürün Resmi</label>
          <input name="image" type="file" accept="image/*" className={input} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" defaultChecked={editing?.featured ?? false} />
          Öne çıkan ürün
        </label>
        <button className="bg-black hover:bg-zinc-800 text-white text-sm font-semibold py-3 rounded-xl self-end transition-colors">
          {editing ? "Güncelle" : "Ekle"}
        </button>
      </form>

      <div className="mt-8 mb-4 flex items-center justify-between"><h2 className="text-sm font-semibold">Ürün kütüphanesi</h2><span className="text-xs text-zinc-500">{products.filter((p) => p.featured).length} öne çıkan</span></div>
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm divide-y divide-zinc-100 overflow-hidden">
        {products.length === 0 && <div className="p-8 sm:p-12 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-2xl text-zinc-400">+</div><h3 className="mt-4 font-semibold">Henüz ürün eklenmedi</h3><p className="mt-2 text-sm text-zinc-500">İlk makinenizi eklemek için yukarıdaki formu doldurun.</p></div>}
        {products.map((p) => {
          const cat = getCategory(p.categoryId);
          return (
            <div key={p.id} className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 sm:p-5 text-sm hover:bg-zinc-50 transition-colors">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" className="w-12 h-12 object-cover rounded-lg" />
              ) : (
                <div className="w-12 h-12 bg-zinc-100 rounded-lg" />
              )}
              <div className="flex-1">
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-zinc-400">
                  {cat?.name ?? "—"} {p.featured && "· ★ Öne çıkan"}
                </div>
              </div>
              <a href={`/admin/products?edit=${p.id}`} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100">
                Düzenle
              </a>
              <form action={deleteProductAction}>
                <input type="hidden" name="id" value={p.id} />
                <button className="text-xs font-semibold text-red-500">Sil</button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
