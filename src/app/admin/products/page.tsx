import Link from "next/link";
import Image from "next/image";
import AdminEditor from "@/components/AdminEditor";
import ProductMediaFields from "@/components/ProductMediaFields";
import { getCategories, getProducts, getCategory } from "@/lib/store";
import { saveProductAction, deleteProductAction } from "../actions";

const input =
  "mt-1.5 border border-zinc-200 bg-zinc-50 rounded-xl px-3 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-500 transition-colors file:mr-3 file:border-0 file:rounded-md file:bg-zinc-200 file:px-2 file:py-1 file:text-xs";

export default async function ProductsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string }>;
}) {
  const { edit, new: create } = await searchParams;
  const categories = getCategories();
  const products = getProducts();
  const editing = products.find((p) => p.id === edit);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.25em] text-zinc-500">Katalog yönetimi</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Ürünler</h1><p className="mt-2 text-sm text-zinc-500">Makine bilgilerini, görsellerini ve kategori yerleşimini yönetin.</p></div><span className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-500">{products.length} ürün</span></div>
      <div className="mb-6 flex justify-end"><Link href="/admin/products?new=1" scroll={false} className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800 transition-colors">+ Yeni ürün ekle</Link></div>
      {(editing || create === "1") && <AdminEditor editing title={editing ? "Ürünü düzenle" : "Yeni ürün ekle"} back="/admin/products">
      <form
        key={editing?.id ?? "new"}
        action={saveProductAction}
        className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-5 sm:p-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <input type="hidden" name="id" value={editing?.id ?? ""} />
        <input type="hidden" name="existingImage" value={editing?.image ?? ""} />
        <div>
          <label className="text-xs text-zinc-500">Ürün adı</label>
          <input name="name" required defaultValue={editing?.name ?? ""} className={input} />
        </div>
        <fieldset className="sm:col-span-2 lg:col-span-3 min-w-0">
          <legend className="text-xs font-medium text-zinc-600">Kategori seçin</legend>
          <p className="mt-1 mb-3 text-xs text-zinc-400">Ürünün ait olduğu makine grubunu seçin.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {categories.map((category) => (
              <label key={category.id} className="relative cursor-pointer">
                <input type="radio" name="categoryId" value={category.id} required defaultChecked={editing?.categoryId === category.id} className="peer sr-only" />
                <div className="h-full overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-400 peer-checked:border-black peer-checked:ring-2 peer-checked:ring-black peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-zinc-600">
                  {category.image ? (
                    <Image src={category.image} alt="" width={320} height={240} unoptimized className="aspect-[4/3] w-full object-cover bg-zinc-100" />
                  ) : <div className="aspect-[4/3] flex items-center justify-center bg-zinc-100 text-zinc-400"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8"><path d="M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6" /><circle cx="16" cy="9" r="1" /></svg></div>}
                  <span className="block p-3 text-xs font-medium leading-5">{category.name}</span>
                </div>
                <span aria-hidden="true" className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 bg-white text-transparent peer-checked:bg-black peer-checked:border-white peer-checked:text-white text-xs">✓</span>
              </label>
            ))}
          </div>
          {categories.length === 0 && <p className="rounded-xl border border-dashed border-zinc-300 p-4 text-sm text-zinc-500">Önce <Link href="/admin/categories" className="underline">bir kategori ekleyin</Link>.</p>}
        </fieldset>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="text-xs text-zinc-500">Açıklama</label>
          <textarea
            name="description"
            rows={2}
            defaultValue={editing?.description ?? ""}
            className={input}
          />
        </div>
        <ProductMediaFields existingImage={editing?.image ?? ""} defaultFeatured={editing?.featured ?? false} defaultCategoryId={editing?.categoryId ?? ""} productId={editing?.id} featuredProducts={products.filter((product) => product.featured).map(({ id, name, categoryId, image }) => ({ id, name, categoryId, image }))} />
        <button className="bg-black hover:bg-zinc-800 text-white text-sm font-semibold py-3 rounded-xl self-end transition-colors">
          {editing ? "Güncelle" : "Ekle"}
        </button>
      </form>
      </AdminEditor>}

      <div className="mt-8 flex items-center justify-between rounded-t-2xl bg-zinc-950 px-5 py-4 text-white"><h2 className="text-sm font-semibold">Ürün kütüphanesi</h2><span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-300">{products.filter((p) => p.featured).length} öne çıkan</span></div>
      <div className="bg-white border border-zinc-200 rounded-b-2xl shadow-sm divide-y divide-zinc-100 overflow-hidden">
        {products.length === 0 && <div className="p-8 sm:p-12 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-2xl text-zinc-400">+</div><h3 className="mt-4 font-semibold">Henüz ürün eklenmedi</h3><p className="mt-2 text-sm text-zinc-500">İlk makinenizi eklemek için “Yeni ürün ekle” butonuna tıklayın.</p></div>}
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
              <Link href={`/admin/products?edit=${p.id}`} scroll={false} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100">
                Düzenle
              </Link>
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
