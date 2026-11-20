import Link from "next/link";
import Image from "next/image";
import AdminEditor from "@/components/AdminEditor";
import ProductMediaFields from "@/components/ProductMediaFields";
import CategoryPicker from "@/components/CategoryPicker";
import ProductGalleryFields from "@/components/ProductGalleryFields";
import { getCategories, getProducts } from "@/lib/store";
import AdminForm from "@/components/AdminForm";
import { cloudinaryConfigured } from "@/lib/cloudinary";
import { saveProductAction, deleteProductAction } from "../actions";

const input =
  "mt-1.5 border border-zinc-200 bg-zinc-50 rounded-xl px-3 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-500 transition-colors file:mr-3 file:border-0 file:rounded-md file:bg-zinc-200 file:px-2 file:py-1 file:text-xs";

export default async function ProductsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string; category?: string }>;
}) {
  const { edit, new: create, category } = await searchParams;
  const categories = await getCategories();
  const selectedCategory = categories.find((item) => item.id === category);
  const allProducts = await getProducts();
  const products = selectedCategory ? allProducts.filter((product) => product.categoryId === selectedCategory.id) : allProducts;
  const editing = allProducts.find((p) => p.id === edit);
  const basePath = selectedCategory ? `/admin/products?category=${encodeURIComponent(selectedCategory.id)}` : "/admin/products";
  const querySeparator = selectedCategory ? "&" : "?";

  return (
    <div>
      <div className="mb-5 sm:mb-8 flex items-end justify-between gap-3 sm:gap-4"><div><p className="text-[10px] uppercase tracking-[.25em] text-zinc-500">Katalog yönetimi</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Ürünler</h1><p className="mt-2 text-sm text-zinc-500">Makine bilgilerini, görsellerini ve kategori yerleşimini yönetin.</p></div><span className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-500">{products.length} ürün</span></div>
      {selectedCategory && <div className="mb-5 flex flex-wrap items-center gap-3"><span className="rounded-full bg-zinc-950 px-4 py-2 text-xs text-white">{selectedCategory.name}</span><Link href="/admin/products" className="text-xs text-zinc-500 hover:text-black">Tüm ürünleri göster</Link></div>}
      <div className="mb-6 flex justify-end"><Link href={`${basePath}${querySeparator}new=1`} scroll={false} className="rounded-lg sm:rounded-xl bg-black px-3.5 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-zinc-800 transition-colors">+ Yeni ürün ekle</Link></div>
      {(editing || create === "1") && <AdminEditor editing title={editing ? "Ürünü düzenle" : "Yeni ürün ekle"} back={basePath} formFooter>
      <AdminForm
        key={editing?.id ?? "new"}
        action={saveProductAction}
        submitLabel={editing ? "Güncelle" : "Ekle"}
        submitDisabled={categories.length === 0}
        className="bg-white border border-zinc-200 shadow-sm rounded-2xl p-3 sm:p-6 grid gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <input type="hidden" name="id" value={editing?.id ?? ""} />
        <input type="hidden" name="existingImage" value={editing?.image ?? ""} />
        <div>
          <label className="text-xs text-zinc-500">Ürün adı</label>
          <input name="name" required defaultValue={editing?.name ?? ""} className={input} />
        </div>
        <CategoryPicker categories={categories} defaultValue={editing?.categoryId ?? selectedCategory?.id ?? ""} />
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="text-xs text-zinc-500">Açıklama</label>
          <textarea
            name="description"
            rows={2}
            defaultValue={editing?.description ?? ""}
            className={input}
          />
        </div>
        <ProductMediaFields uploadsEnabled={cloudinaryConfigured()} existingImage={editing?.image ?? ""} defaultFeatured={editing?.featured ?? false} defaultCategoryId={editing?.categoryId ?? selectedCategory?.id ?? ""} productId={editing?.id} featuredProducts={allProducts.filter((product) => product.featured).map(({ id, name, categoryId, image }) => ({ id, name, categoryId, image }))} />
        <ProductGalleryFields images={editing?.images} video={editing?.video} uploadsEnabled={cloudinaryConfigured()} />
      </AdminForm>
      </AdminEditor>}

      <div className="mt-8 flex items-center justify-between rounded-t-2xl bg-zinc-950 px-5 py-4 text-white"><h2 className="text-sm font-semibold">Ürün kütüphanesi</h2><span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-300">{products.filter((p) => p.featured).length} çok satan</span></div>
      <div className="bg-white border border-zinc-200 rounded-b-2xl shadow-sm divide-y divide-zinc-100 overflow-hidden">
        {products.length === 0 && <div className="p-8 sm:p-12 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-2xl text-zinc-400">+</div><h3 className="mt-4 font-semibold">Henüz ürün eklenmedi</h3><p className="mt-2 text-sm text-zinc-500">İlk makinenizi eklemek için “Yeni ürün ekle” butonuna tıklayın.</p></div>}
        {products.map((p) => {
          const cat = categories.find((category) => category.id === p.categoryId);
          return (
            <div key={p.id} className="flex flex-wrap items-center gap-2 sm:gap-4 p-3 sm:p-5 text-xs sm:text-sm hover:bg-zinc-50 transition-colors">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" className="w-12 h-12 object-cover rounded-lg" />
              ) : (
                <div className="w-12 h-12 bg-zinc-100 rounded-lg" />
              )}
              <div className="min-w-0 flex-1 basis-[calc(100%-4rem)] sm:basis-auto">
                <div className="font-semibold break-words">{p.name}</div>
                <div className="text-xs text-zinc-400">
                  {cat?.name ?? "—"} {p.featured && <span className="ml-1 inline-block rounded-full bg-zinc-950 px-2 py-0.5 text-[9px] font-semibold text-white">ÇOK SATAN</span>}
                </div>
              </div>
              <Link href={`${basePath}${querySeparator}edit=${encodeURIComponent(p.id)}`} scroll={false} className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100">
                Düzenle
              </Link>
              <AdminForm action={deleteProductAction}>
                <input type="hidden" name="id" value={p.id} />
                <button className="text-xs font-semibold text-red-500">Sil</button>
              </AdminForm>
            </div>
          );
        })}
      </div>
      {selectedCategory && categories.some((item) => item.id !== selectedCategory.id) && (
        <section className="mt-10 border-t border-zinc-300 pt-7" aria-labelledby="other-categories-title">
          <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.2em] text-zinc-500">Katalogda gezin</p><h2 id="other-categories-title" className="mt-2 text-lg font-semibold">Diğer kategoriler</h2></div><Link href="/admin/categories" className="text-xs text-zinc-500 hover:text-black">Tüm kategoriler →</Link></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
            {categories.filter((item) => item.id !== selectedCategory.id).map((item) => (
              <Link key={item.id} href={`/admin/products?category=${encodeURIComponent(item.id)}`} className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-950 hover:border-zinc-400 transition-colors">
                {item.image ? <Image src={item.image} alt="" width={320} height={240} unoptimized className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none" /> : <div className="aspect-[4/3] flex items-center justify-center bg-zinc-800 text-zinc-500"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8"><path d="M3 7V5h6l3 3h9v12H3ZM3 11h18" /></svg></div>}
                <div className="relative flex flex-1 flex-col bg-zinc-950 p-3"><h3 className="text-xs font-medium leading-5 text-zinc-200">{item.name}</h3><div className="mt-auto pt-3 flex items-center justify-between text-[10px] text-zinc-500"><span>{allProducts.filter((product) => product.categoryId === item.id).length} ürün</span><span aria-hidden="true" className="text-zinc-300 group-hover:translate-x-1 transition-transform">→</span></div></div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
