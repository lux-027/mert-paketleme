import Link from "next/link";
import Image from "next/image";
import AdminEditor from "@/components/AdminEditor";
import ProductMediaFields from "@/components/ProductMediaFields";
import CategoryPicker from "@/components/CategoryPicker";
import ProductCategoryFilter from "@/components/ProductCategoryFilter";
import ProductGalleryFields from "@/components/ProductGalleryFields";
import ProductGallery from "@/components/ProductGallery";
import { getCategories, getProducts } from "@/lib/store";
import AdminForm from "@/components/AdminForm";
import { cloudinaryConfigured } from "@/lib/cloudinary";
import { saveProductAction, deleteProductAction } from "../actions";

const input =
  "mt-1.5 border border-zinc-200 bg-zinc-50 rounded-xl px-3 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:border-zinc-500 transition-colors file:mr-3 file:border-0 file:rounded-md file:bg-zinc-200 file:px-2 file:py-1 file:text-xs";

export default async function ProductsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; new?: string; category?: string; view?: string }>;
}) {
  const { edit, new: create, category, view } = await searchParams;
  const categories = await getCategories();
  const selectedCategory = categories.find((item) => item.id === category);
  const allProducts = await getProducts();
  const products = selectedCategory ? allProducts.filter((product) => product.categoryId === selectedCategory.id) : allProducts;
  const editing = allProducts.find((p) => p.id === edit);
  const viewing = !editing && create !== "1" ? allProducts.find((p) => p.id === view) : undefined;
  const basePath = selectedCategory ? `/admin/products?category=${encodeURIComponent(selectedCategory.id)}` : "/admin/products";
  const querySeparator = selectedCategory ? "&" : "?";

  return (
    <div>
      <div className="mb-5 sm:mb-8 flex items-end justify-between gap-3 sm:gap-4"><div><p className="text-[10px] uppercase tracking-[.25em] text-zinc-500">Katalog yönetimi</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Ürünler</h1><p className="mt-2 text-sm text-zinc-500">Makine bilgilerini, görsellerini ve kategori yerleşimini yönetin.</p></div><span className="shrink-0 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-500">{products.length} ürün</span></div>
      {selectedCategory && <div className="mb-5 flex flex-wrap items-center gap-3"><span className="rounded-full bg-zinc-950 px-4 py-2 text-xs text-white">{selectedCategory.name}</span><Link href="/admin/products" className="text-xs text-zinc-500 hover:text-black">Tüm ürünleri göster</Link></div>}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <ProductCategoryFilter categories={categories.map((item) => ({ id: item.id, name: item.name, count: allProducts.filter((product) => product.categoryId === item.id).length }))} selectedId={selectedCategory?.id ?? ""} total={allProducts.length} refreshWhenVisible={!editing && create !== "1" && !viewing} />
        <Link href={`${basePath}${querySeparator}new=1`} scroll={false} className="self-end rounded-lg sm:rounded-xl bg-black px-3.5 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-zinc-800 transition-colors">+ Yeni ürün ekle</Link>
      </div>
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

      {viewing && <AdminEditor editing title="Ürün detayları" back={basePath} wide>
        <div className="grid gap-5 md:grid-cols-[1.2fr_1fr] md:gap-7">
          <div className="min-w-0">{viewing.image || viewing.images?.length || viewing.video ? <ProductGallery key={viewing.id} image={viewing.image} images={viewing.images} video={viewing.video} name={viewing.name} locale="tr" /> : <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-100 text-sm text-zinc-400">Henüz görsel eklenmedi</div>}</div>
          <div className="min-w-0">
            <p className="text-xs text-zinc-500">{categories.find((item) => item.id === viewing.categoryId)?.name ?? "Kategori bulunamadı"}</p>
            <h3 className="mt-2 break-words text-xl font-semibold leading-snug sm:text-2xl">{viewing.name}</h3>
            {viewing.featured && <span className="mt-3 inline-block rounded-full bg-zinc-950 px-3 py-1 text-[10px] font-semibold text-white">ÇOK SATAN</span>}
            <dl className="mt-5 grid grid-cols-2 gap-3 rounded-xl border border-zinc-200 bg-white p-4 text-xs"><div><dt className="text-zinc-400">Ürün no</dt><dd className="mt-1 font-medium">{viewing.id}</dd></div><div><dt className="text-zinc-400">Video</dt><dd className="mt-1 font-medium">{viewing.video ? "Mevcut" : "Eklenmedi"}</dd></div></dl>
            <h4 className="mt-5 text-xs font-semibold uppercase tracking-wider text-zinc-400">Ürün açıklaması</h4>
            <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-zinc-600">{viewing.description || "Henüz açıklama eklenmedi."}</p>
            <div className="mt-6 flex flex-wrap gap-2"><Link href={`${basePath}${querySeparator}edit=${encodeURIComponent(viewing.id)}`} scroll={false} className="rounded-xl bg-zinc-950 px-4 py-3 text-xs font-semibold text-white hover:bg-zinc-800">Ürünü düzenle</Link><Link href={`/tr/urun/${viewing.slug}`} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-xs font-semibold hover:bg-zinc-100">Canlı sitede gör ↗</Link></div>
          </div>
        </div>
      </AdminEditor>}

      <div className="mt-8 flex items-center justify-between rounded-t-2xl bg-zinc-950 px-5 py-4 text-white"><h2 className="text-sm font-semibold">Ürün kütüphanesi</h2><span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-300">{products.filter((p) => p.featured).length} çok satan</span></div>
      <div className="grid grid-cols-1 gap-4 rounded-b-2xl border border-zinc-200 bg-zinc-50 p-3 shadow-sm sm:grid-cols-2 sm:p-4 lg:grid-cols-3">
        {products.length === 0 && <div className="col-span-full p-8 sm:p-12 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-2xl text-zinc-400">+</div><h3 className="mt-4 font-semibold">Henüz ürün eklenmedi</h3><p className="mt-2 text-sm text-zinc-500">İlk makinenizi eklemek için “Yeni ürün ekle” butonuna tıklayın.</p></div>}
        {products.map((p) => {
          const cat = categories.find((category) => category.id === p.categoryId);
          return (
            <article key={p.id} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
              <Link href={`${basePath}${querySeparator}view=${encodeURIComponent(p.id)}`} scroll={false} className="group flex min-w-0 sm:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-zinc-800">
                <div className="relative flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden border-r border-zinc-100 bg-white p-2 sm:h-44 sm:w-full sm:border-b sm:border-r-0 sm:p-3 lg:h-52">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} width={640} height={480} loading="lazy" decoding="async" className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none" />
                  ) : (
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-10 w-10 text-zinc-300 sm:h-14 sm:w-14"><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="8" cy="9" r="1.5" /><path d="m3 17 5-5 4 4 4-5 5 6" /></svg>
                  )}
                  {p.featured && <span className="absolute left-1.5 top-1.5 rounded-full bg-zinc-950 px-2 py-1 text-[8px] font-semibold tracking-wide text-white sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[9px]">ÇOK SATAN</span>}
                  {p.video && <span className="absolute bottom-1.5 right-1.5 rounded-lg bg-zinc-950/80 px-2 py-1 text-[8px] text-white sm:bottom-3 sm:right-3 sm:text-[10px]">Video mevcut</span>}
                </div>
                <div className="min-w-0 flex-1 p-3 sm:p-4"><p className="truncate text-[10px] text-zinc-400">{cat?.name ?? "Kategori bulunamadı"}</p><h3 className="mt-1.5 break-words text-xs font-semibold leading-5 text-zinc-950 sm:min-h-10 sm:text-sm lg:text-base">{p.name}</h3><div className="mt-2 flex items-center justify-between gap-2 border-t border-zinc-100 pt-2 text-[9px] sm:mt-3 sm:pt-3 sm:text-[10px]"><span className="text-zinc-400">{new Set([p.image, ...(p.images ?? [])].filter(Boolean)).size} fotoğraf</span><span className="font-semibold text-zinc-700 group-hover:text-black">Detayları incele →</span></div></div>
              </Link>
              <div className="mt-auto flex items-center gap-2 border-t border-zinc-100 bg-zinc-50 p-3">
                <Link href={`${basePath}${querySeparator}edit=${encodeURIComponent(p.id)}`} scroll={false} className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-center text-xs font-semibold text-zinc-700 hover:bg-zinc-100">Düzenle</Link>
                <AdminForm action={deleteProductAction} confirmMessage={`“${p.name}” ürünü silinsin mi? Bu işlem geri alınamaz.`}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="rounded-lg px-3 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50">Sil</button>
                </AdminForm>
              </div>
            </article>
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
