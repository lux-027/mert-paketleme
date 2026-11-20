import Link from "next/link";
import { auth } from "@/auth";
import { getStore } from "@/lib/store";
import fs from "fs";
import path from "path";

export default async function AdminPage() {
  const session = await auth();
  const store = getStore();
  let messages: { name: string; email: string; message: string; date: string }[] = [];
  try {
    messages = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "data", "messages.json"), "utf-8")
    ).reverse();
  } catch {
    messages = [];
  }

  return (
    <div>
      <div className="relative isolate overflow-hidden rounded-3xl bg-black p-6 sm:p-10 text-white">
        <svg aria-hidden="true" viewBox="0 0 600 300" className="pointer-events-none absolute right-0 top-0 -z-10 h-full w-full sm:w-2/3 text-zinc-800" fill="none" stroke="currentColor"><path d="M0 60h600M0 120h600M0 180h600M0 240h600M60 0v300M120 0v300M180 0v300M240 0v300M300 0v300M360 0v300M420 0v300M480 0v300M540 0v300" strokeWidth=".5" /><circle cx="490" cy="160" r="110" /><circle cx="490" cy="160" r="75" /><circle cx="490" cy="160" r="35" /></svg>
        <p className="text-[10px] uppercase tracking-[.3em] text-zinc-400">Mert Makina / Yönetim merkezi</p>
        <h1 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight">Hoş geldin, {session?.user?.name ?? "Admin"}</h1>
        <p className="mt-3 text-sm text-zinc-400 max-w-lg leading-relaxed">Kategorilerinizi düzenleyin, ürünlerinizi yönetin ve müşterilerinizden gelen mesajları takip edin.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/products" className="rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-black hover:bg-zinc-200 transition-colors">+ Ürün ekle</Link>
          <Link href="/tr" className="rounded-xl border border-zinc-600 px-4 py-2.5 text-xs sm:text-sm text-zinc-200 hover:border-white transition-colors">Siteyi görüntüle ↗</Link>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <Link href="/admin/categories" className="group bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-md hover:border-zinc-400 transition-all">
          <div className="text-3xl font-bold text-brand">{store.categories.length}</div>
          <div className="text-sm text-zinc-500 mt-1">Kategori</div>
        </Link>
        <Link href="/admin/products" className="group bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-md hover:border-zinc-400 transition-all">
          <div className="text-3xl font-bold text-brand">{store.products.length}</div>
          <div className="text-sm text-zinc-500 mt-1">Ürün</div>
        </Link>
        <div className="bg-white border border-zinc-200 rounded-2xl p-6">
          <div className="text-3xl font-bold text-brand">{messages.length}</div>
          <div className="text-sm text-zinc-500 mt-1">İletişim Mesajı</div>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-[1.3fr_1fr] gap-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3"><h2 className="font-semibold">Kategori özeti</h2><Link href="/admin/categories" className="text-xs text-zinc-500 hover:text-black">Tümünü yönet →</Link></div>
          <div className="mt-5 divide-y divide-zinc-100">
            {store.categories.map((category) => {
              const count = store.products.filter((product) => product.categoryId === category.id).length;
              return <Link key={category.id} href={`/admin/categories?edit=${category.id}`} className="flex items-center gap-3 py-3 group">
                {category.image && <div role="img" aria-label={category.name} style={{ backgroundImage: `url(${JSON.stringify(category.image)})` }} className="h-11 w-11 shrink-0 rounded-xl bg-zinc-100 bg-cover bg-center border border-zinc-100" />}
                <span className="min-w-0 flex-1 text-xs sm:text-sm font-medium group-hover:underline underline-offset-4">{category.name}</span><span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] text-zinc-500">{count} ürün</span>
              </Link>;
            })}
          </div>
        </section>
        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm"><h2 className="font-semibold">Hızlı işlemler</h2><p className="text-xs text-zinc-500 mt-2">Sık kullandığınız alanlara doğrudan ulaşın.</p><div className="mt-5 space-y-3">{[{ href: "/admin/products", title: "Ürün yönetimi", desc: "Makine ekleyin, bilgileri güncelleyin." }, { href: "/admin/categories", title: "Kategori yönetimi", desc: "Makine gruplarını ve kapakları düzenleyin." }, { href: "/tr", title: "Canlı siteyi incele", desc: "Ziyaretçi görünümünü kontrol edin." }].map((item) => <Link key={item.href} href={item.href} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 p-4 hover:bg-zinc-50 transition-colors"><div><h3 className="text-sm font-medium">{item.title}</h3><p className="mt-1 text-xs text-zinc-500">{item.desc}</p></div><span aria-hidden="true" className="text-zinc-400">↗</span></Link>)}</div></section>
          <section className="rounded-2xl border border-zinc-200 bg-zinc-100/70 p-5 sm:p-6"><p className="text-[10px] uppercase tracking-[.2em] text-zinc-500">Yayın öncesi kontrol</p><h2 className="mt-3 text-sm font-semibold">İçeriğinizi eksiksiz hazırlayın</h2><ul className="mt-3 space-y-2 text-xs leading-relaxed text-zinc-500"><li>01 — Türkçe ve İngilizce alanları doldurun.</li><li>02 — Doğru kategori ve net bir görsel seçin.</li><li>03 — Kaydettikten sonra sitedeki görünümü inceleyin.</li></ul><p className="mt-4 border-t border-zinc-200 pt-3 text-xs leading-relaxed text-zinc-600">Not: Mevcut dosya tabanlı kayıt sistemi Vercel üzerinde kalıcı depolama sağlamaz. Canlı içerik yönetimi için veritabanı ve görsel depolama bağlantısı gereklidir.</p></section>
        </div>
      </div>
      {messages.length === 0 && <section className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-6 text-center"><h2 className="text-sm font-semibold">Gelen kutunuz boş</h2><p className="mt-2 text-xs text-zinc-500">Kaydedilen iletişim mesajları bu alanda listelenecek.</p></section>}
      {messages.length > 0 && (
        <div className="mt-10">
          <h2 className="font-bold text-lg mb-4">Son Mesajlar</h2>
          <div className="space-y-3">
            {messages.slice(0, 10).map((m, i) => (
              <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4 text-sm">
                <div className="font-semibold">
                  {m.name} <span className="text-zinc-400 font-normal">({m.email})</span>
                </div>
                <div className="text-zinc-600 mt-1">{m.message}</div>
                <div className="text-xs text-zinc-400 mt-2">{m.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
