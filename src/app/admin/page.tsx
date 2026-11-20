import Link from "next/link";
import AdminEditor from "@/components/AdminEditor";
import { auth } from "@/auth";
import { getStore } from "@/lib/store";
import fs from "fs";
import path from "path";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ messages?: string }> }) {
  const { messages: showMessages } = await searchParams;
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
          <Link href="/admin/products?new=1" className="rounded-xl bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-black hover:bg-zinc-200 transition-colors">+ Ürün ekle</Link>
          <Link href="/tr" className="rounded-xl border border-zinc-600 px-4 py-2.5 text-xs sm:text-sm text-zinc-200 hover:border-white transition-colors">Siteyi görüntüle ↗</Link>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {[
          { label: "Kategori", count: store.categories.length, detail: "Makine gruplarını yönetin", href: "/admin/categories", icon: "M3 7V5a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2ZM3 10h18" },
          { label: "Ürün", count: store.products.length, detail: "Ürün kütüphanesini inceleyin", href: "/admin/products", icon: "m12 3 9 5v9l-9 5-9-5V8ZM3 8l9 5 9-5M12 13v9M7.5 5.5l9 5" },
          { label: "İletişim Mesajı", count: messages.length, detail: "Müşteri taleplerini görüntüleyin", href: "/admin?messages=1", icon: "M3 5h18v14H3ZM3 5l9 8 9-8" },
        ].map((stat, index) => (
          <Link key={stat.label} href={stat.href} scroll={index !== 2} aria-haspopup={index === 2 ? "dialog" : undefined} className={`group relative isolate overflow-hidden rounded-2xl border p-5 sm:p-6 text-white shadow-md hover:shadow-xl transition-all duration-300 ${["border-zinc-700 bg-gradient-to-br from-zinc-800 via-zinc-950 to-black hover:border-zinc-500", "border-slate-600/60 bg-gradient-to-br from-slate-700 via-slate-900 to-zinc-950 hover:border-slate-400", "border-teal-800/70 bg-gradient-to-br from-teal-900 via-[#102c2c] to-zinc-950 hover:border-teal-600"][index]}`}>
            <svg aria-hidden="true" viewBox="0 0 220 180" fill="none" stroke="currentColor" className={`pointer-events-none absolute right-0 top-0 h-full w-44 opacity-20 group-hover:opacity-35 transition-opacity ${["text-zinc-400", "text-sky-300", "text-teal-300"][index]}`}>
              {index === 0 && <g><circle cx="195" cy="80" r="72" /><circle cx="195" cy="80" r="51" /><circle cx="195" cy="80" r="28" /><path d="M195 0v180M100 80h120M0 145h85l40-40M35 0v180M75 0v180" strokeWidth=".7" /><circle cx="85" cy="145" r="4" /></g>}
              {index === 1 && <g strokeLinejoin="round"><path d="m150 20 57 32v64l-57 32-57-32V52Zm-57 32 57 32 57-32M150 84v64m-29-112 57 32v23M35 157h130M50 163v-12m100 12v-12M35 30v100m-5-90 5-10 5 10m-10 80 5 10 5-10" /><path d="M0 130h220M0 170h220" strokeWidth=".5" /></g>}
              {index === 2 && <g><rect x="80" y="35" width="124" height="80" rx="12" /><path d="m80 45 62 42 62-42M80 106l38-35m86 35-38-35M100 115v18l23-18M20 145h65m-45 15h85" /><circle cx="142" cy="75" r="76" strokeDasharray="3 8" /><circle cx="20" cy="145" r="4" /></g>}
            </svg>
            <div className="relative flex items-start justify-between gap-3"><span className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 shadow-inner ${["text-zinc-200", "text-sky-200", "text-teal-200"][index]}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="h-5 w-5"><path d={stat.icon} /></svg></span>{index === 2 && messages.length > 0 ? <span aria-label={`${messages.length} kayıtlı mesaj`} className="flex min-w-6 h-6 items-center justify-center rounded-full border border-red-300/30 bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-lg shadow-red-950/30">{messages.length > 99 ? "99+" : messages.length}</span> : <span aria-hidden="true" className="text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all">↗</span>}</div>
            <div className="relative mt-5 flex items-baseline gap-3"><span className="text-4xl font-semibold tracking-tight tabular-nums">{stat.count}</span><span className="text-sm text-white/65">{stat.label}</span></div>
            <p className="relative mt-4 border-t border-white/10 pt-3 text-[11px] text-white/50">{stat.detail}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid lg:grid-cols-[1.3fr_1fr] gap-6">
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3"><h2 className="font-semibold">Kategori özeti</h2><Link href="/admin/categories" className="text-xs text-zinc-500 hover:text-black">Tümünü yönet →</Link></div>
          <div className="mt-5 divide-y divide-zinc-100">
            {store.categories.map((category) => {
              const count = store.products.filter((product) => product.categoryId === category.id).length;
              return <Link key={category.id} href={`/admin/products?category=${encodeURIComponent(category.id)}`} className="flex items-center gap-3 py-3 group">
                {category.image && <div role="img" aria-label={category.name} style={{ backgroundImage: `url(${JSON.stringify(category.image)})` }} className="h-11 w-11 shrink-0 rounded-xl bg-zinc-100 bg-cover bg-center border border-zinc-100" />}
                <span className="min-w-0 flex-1 text-xs sm:text-sm font-medium group-hover:underline underline-offset-4">{category.name}</span><span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] text-zinc-500">{count} ürün</span>
              </Link>;
            })}
          </div>
        </section>
        <div className="space-y-6">
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm"><h2 className="font-semibold">Hızlı işlemler</h2><p className="text-xs text-zinc-500 mt-2">Sık kullandığınız alanlara doğrudan ulaşın.</p><div className="mt-5 space-y-3">{[{ href: "/admin/products", title: "Ürün yönetimi", desc: "Makine ekleyin, bilgileri güncelleyin." }, { href: "/admin/categories", title: "Kategori yönetimi", desc: "Makine gruplarını ve kapakları düzenleyin." }, { href: "/tr", title: "Canlı siteyi incele", desc: "Ziyaretçi görünümünü kontrol edin." }].map((item) => <Link key={item.href} href={item.href} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 p-4 hover:bg-zinc-50 transition-colors"><div><h3 className="text-sm font-medium">{item.title}</h3><p className="mt-1 text-xs text-zinc-500">{item.desc}</p></div><span aria-hidden="true" className="text-zinc-400">↗</span></Link>)}</div></section>
          <section className="rounded-2xl border border-zinc-200 bg-zinc-100/70 p-5 sm:p-6"><p className="text-[10px] uppercase tracking-[.2em] text-zinc-500">Yayın öncesi kontrol</p><h2 className="mt-3 text-sm font-semibold">İçeriğinizi eksiksiz hazırlayın</h2><ul className="mt-3 space-y-2 text-xs leading-relaxed text-zinc-500"><li>01 — Ürün adını ve açıklamasını Türkçe girin.</li><li>02 — Doğru kategori ve net bir görsel seçin.</li><li>03 — Kaydettikten sonra sitedeki görünümü inceleyin.</li></ul><p className="mt-4 border-t border-zinc-200 pt-3 text-xs leading-relaxed text-zinc-600">Not: Mevcut dosya tabanlı kayıt sistemi Vercel üzerinde kalıcı depolama sağlamaz. Canlı içerik yönetimi için veritabanı ve görsel depolama bağlantısı gereklidir.</p></section>
        </div>
      </div>
      {showMessages === "1" && (
        <AdminEditor editing title="İletişim mesajları" back="/admin" compact>
          <div className="mb-4 flex items-center justify-between gap-3"><p className="text-xs text-zinc-500">En yeni mesajlar üstte listelenir.</p><span className="shrink-0 rounded-full bg-zinc-950 px-3 py-1 text-[10px] text-white">{messages.length} mesaj</span></div>
          {messages.length === 0 ? <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto h-10 w-10 text-zinc-300"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 6 9 7 9-7" /></svg><h3 className="mt-4 text-sm font-semibold">Gelen kutunuz boş</h3><p className="mt-2 text-xs leading-relaxed text-zinc-500">İletişim formundan kaydedilen mesajlar burada görünecek.</p></div> : (
            <div className="space-y-3">
              {messages.map((m, i) => (
                <article key={i} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 text-sm">
                  <div className="flex items-start gap-3"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-xs font-semibold text-white">{m.name.slice(0, 1).toLocaleUpperCase("tr")}</span><div className="min-w-0"><h3 className="font-semibold break-words">{m.name}</h3><p className="mt-1 break-all text-xs text-zinc-500">{m.email}</p></div></div>
                  <p className="mt-4 border-t border-zinc-100 pt-3 whitespace-pre-wrap break-words text-zinc-600 leading-relaxed">{m.message}</p>
                  <time dateTime={m.date} className="mt-3 block text-[10px] text-zinc-400">{Number.isNaN(Date.parse(m.date)) ? m.date : new Date(m.date).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul", dateStyle: "medium", timeStyle: "short" })}</time>
                </article>
              ))}
            </div>
          )}
        </AdminEditor>
      )}
    </div>
  );
}
