import { getCategories, getProducts, getCategory } from "@/lib/store";
import { saveProductAction, deleteProductAction } from "../actions";

const input =
  "border border-zinc-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand/40";

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
      <h1 className="text-2xl font-bold mb-6">Ürünler</h1>

      <form
        action={saveProductAction}
        className="bg-white border border-zinc-200 rounded-xl p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
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
        <button className="bg-brand hover:bg-brand-dark text-white font-semibold py-2 rounded-lg self-end">
          {editing ? "Güncelle" : "Ekle"}
        </button>
      </form>

      <div className="mt-6 bg-white border border-zinc-200 rounded-xl divide-y divide-zinc-100">
        {products.map((p) => {
          const cat = getCategory(p.categoryId);
          return (
            <div key={p.id} className="flex items-center gap-4 p-3 text-sm">
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
              <a href={`/admin/products?edit=${p.id}`} className="text-xs font-semibold text-brand">
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
