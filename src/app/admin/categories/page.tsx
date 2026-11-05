import { getCategories, getProducts } from "@/lib/store";
import { saveCategoryAction, deleteCategoryAction } from "../actions";

const input =
  "border border-zinc-300 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand/40";

export default async function CategoriesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const categories = getCategories();
  const editing = categories.find((c) => c.id === edit);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Kategoriler</h1>

      <form
        action={saveCategoryAction}
        className="bg-white border border-zinc-200 rounded-xl p-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 items-end"
      >
        <input type="hidden" name="id" value={editing?.id ?? ""} />
        <input type="hidden" name="existingImage" value={editing?.image ?? ""} />
        <div>
          <label className="text-xs text-zinc-500">Kategori Adı (TR)</label>
          <input name="name" required defaultValue={editing?.name ?? ""} className={input} />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Kategori Adı (EN)</label>
          <input name="nameEn" defaultValue={editing?.nameEn ?? ""} className={input} />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Kapak Resmi</label>
          <input name="image" type="file" accept="image/*" className={input} />
        </div>
        <button className="bg-brand hover:bg-brand-dark text-white font-semibold py-2 rounded-lg">
          {editing ? "Güncelle" : "Ekle"}
        </button>
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {categories.map((c) => (
          <div key={c.id} className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt={c.name} className="w-full aspect-[4/3] object-cover" />
            ) : (
              <div className="w-full aspect-[4/3] bg-zinc-100 flex items-center justify-center text-zinc-400 text-sm">
                Resim yok
              </div>
            )}
            <div className="p-3">
              <div className="font-semibold text-sm">{c.name}</div>
              <div className="text-xs text-zinc-400">
                {getProducts(c.id).length} ürün
              </div>
              <div className="flex gap-2 mt-3">
                <a
                  href={`/admin/categories?edit=${c.id}`}
                  className="text-xs font-semibold text-brand"
                >
                  Düzenle
                </a>
                <form action={deleteCategoryAction}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="text-xs font-semibold text-red-500">Sil</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
