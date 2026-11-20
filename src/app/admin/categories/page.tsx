import Link from "next/link";
import AdminEditor from "@/components/AdminEditor";
import { getCategories, getProducts } from "@/lib/store";
import { saveCategoryAction, deleteCategoryAction } from "../actions";

const input =
  "mt-1.5 border border-zinc-200 bg-zinc-50 rounded-xl px-3 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-500 transition-colors file:mr-3 file:border-0 file:rounded-md file:bg-zinc-200 file:px-2 file:py-1 file:text-xs";

export default async function CategoriesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  const { edit, new: create } = await searchParams;
  const categories = getCategories();
  const editing = categories.find((c) => c.id === edit);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.25em] text-zinc-500">Katalog yönetimi</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Kategoriler</h1><p className="mt-2 text-sm text-zinc-500">Makine gruplarını ve kategori kapaklarını düzenleyin.</p></div><span className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-500">{categories.length} kategori</span></div>
      <div className="mb-6 flex justify-end"><Link href="/admin/categories?new=1" scroll={false} className="rounded-lg sm:rounded-xl bg-black px-3.5 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-zinc-800 transition-colors">+ Yeni kategori ekle</Link></div>
      {(editing || create === "1") && <AdminEditor editing title={editing ? "Kategoriyi düzenle" : "Yeni kategori ekle"} back="/admin/categories" compact>
      <form
        key={editing?.id ?? "new"}
        id="category-form"
        action={saveCategoryAction}
        className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-3 sm:p-6 grid grid-cols-1 gap-3 sm:gap-5"
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
        <button className="bg-black hover:bg-zinc-800 text-white text-sm font-semibold py-2 sm:py-3 rounded-xl transition-colors">
          {editing ? "Güncelle" : "Ekle"}
        </button>
      </form>
      </AdminEditor>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 mt-4 sm:mt-6">
        {categories.map((c) => (
          <div key={c.id} className="relative bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <Link href={`/admin/products?category=${encodeURIComponent(c.id)}`} aria-label={`${c.name} ürünlerini aç`} className="block">
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt={c.name} className="w-full aspect-[4/3] object-cover" />
            ) : (
              <div className="w-full aspect-[4/3] bg-zinc-100 flex items-center justify-center text-zinc-400 text-sm">
                Resim yok
              </div>
            )}
            </Link>
            <div className="p-3 sm:p-4 flex flex-col flex-1 bg-zinc-950 text-white">
              <Link href={`/admin/products?category=${encodeURIComponent(c.id)}`} className="font-semibold text-xs sm:text-sm leading-5 break-words hover:underline underline-offset-4 after:absolute after:inset-0">{c.name}</Link>
              <div className="text-xs text-zinc-400">
                {getProducts(c.id).length} ürün
              </div>
              <div className="relative z-10 flex flex-wrap items-center gap-2 sm:gap-3 mt-auto pt-3 sm:pt-4">
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
