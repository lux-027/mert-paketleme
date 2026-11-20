import Link from "next/link";
import AdminEditor from "@/components/AdminEditor";
import { getCategories, getProducts } from "@/lib/store";
import { saveCategoryAction, deleteCategoryAction } from "../actions";

const input =
  "mt-1.5 border border-zinc-200 bg-zinc-50 rounded-xl px-3 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-500 transition-colors file:mr-3 file:border-0 file:rounded-md file:bg-zinc-200 file:px-2 file:py-1 file:text-xs";

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
      <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.25em] text-zinc-500">Katalog yönetimi</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Kategoriler</h1><p className="mt-2 text-sm text-zinc-500">Makine gruplarını ve kategori kapaklarını düzenleyin.</p></div><span className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-500">{categories.length} kategori</span></div>
      {!editing && <h2 className="mb-4 text-sm font-semibold">Yeni kategori oluştur</h2>}
      <AdminEditor editing={!!editing} title="Kategoriyi düzenle" back="/admin/categories">
      <form
        key={editing?.id ?? "new"}
        id="category-form"
        action={saveCategoryAction}
        className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-5 sm:p-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 items-end"
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
        <button className="bg-black hover:bg-zinc-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors">
          {editing ? "Güncelle" : "Ekle"}
        </button>
      </form>
      </AdminEditor>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {categories.map((c) => (
          <div key={c.id} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt={c.name} className="w-full aspect-[4/3] object-cover" />
            ) : (
              <div className="w-full aspect-[4/3] bg-zinc-100 flex items-center justify-center text-zinc-400 text-sm">
                Resim yok
              </div>
            )}
            <div className="p-4 flex flex-col flex-1 bg-zinc-950 text-white">
              <div className="font-semibold text-sm">{c.name}</div>
              <div className="text-xs text-zinc-400">
                {getProducts(c.id).length} ürün
              </div>
              <div className="flex items-center gap-3 mt-auto pt-4">
                <Link
                  href={`/admin/categories?edit=${c.id}`}
                  scroll={false}
                  className="rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800"
                >
                  Düzenle
                </Link>
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
