import Link from "next/link";
import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/admin");

  return (
    <div className="mx-auto flex min-h-[calc(100svh-8rem)] max-w-5xl items-center py-4 sm:py-10">
      <div className="grid w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 md:grid-cols-2">
        <div className="relative isolate overflow-hidden bg-black p-7 sm:p-10 text-white flex flex-col justify-between min-h-48 md:min-h-[440px]">
          <svg aria-hidden="true" viewBox="0 0 480 480" className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-zinc-800" fill="none" stroke="currentColor">
            <path d="M0 80h480M0 160h480M0 240h480M0 320h480M0 400h480M80 0v480M160 0v480M240 0v480M320 0v480M400 0v480" strokeWidth=".5" />
            <circle cx="410" cy="350" r="150" /><circle cx="410" cy="350" r="115" /><circle cx="410" cy="350" r="65" /><path d="M410 170v70m0 220v20M230 350h80m160 0h10" />
          </svg>
          <span className="text-[10px] uppercase tracking-[.3em] text-zinc-400">Mert Packing Machine</span>
          <div className="mt-8 md:mt-16">
            <p className="text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">Üretimin gücü,<br />yönetimin kontrolü.</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-400">Ürünlerinizi ve kategorilerinizi tek bir yerden yönetin.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 mt-10 text-xs text-zinc-500"><span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />Yetkilendirilmiş yönetim alanı</div>
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-zinc-800"><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></svg>
          </div>
          <p className="text-[10px] uppercase tracking-[.2em] text-zinc-500">Yönetim paneli</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">Hoş geldiniz</h1>
          <p className="text-sm leading-relaxed text-zinc-500 mt-3">Devam etmek için yetkili Google hesabınızla giriş yapın.</p>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/admin" });
        }}
        className="mt-6"
      >
        <button className="flex w-full items-center justify-center gap-3 bg-black text-white text-sm font-semibold px-4 py-3.5 rounded-xl hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900 transition-colors">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36ZM12 22c2.7 0 4.96-.9 6.62-2.41l-3.24-2.51c-.9.6-2.04.97-3.38.97-2.6 0-4.8-1.76-5.59-4.13H3.07v2.59A10 10 0 0 0 12 22ZM6.41 13.92A6 6 0 0 1 6.1 12c0-.67.11-1.31.31-1.92V7.49H3.07A10 10 0 0 0 2 12c0 1.61.39 3.14 1.07 4.51l3.34-2.59ZM12 5.95c1.47 0 2.79.51 3.83 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.93 5.49l3.34 2.59C7.2 7.71 9.4 5.95 12 5.95Z" /></svg>
          Google ile giriş yap
        </button>
      </form>
          <p className="mt-5 text-xs leading-relaxed text-zinc-400">Bu alan yalnızca yetkili yöneticilere açıktır. Ziyaretçiler için üyelik gerekmez.</p>
          <Link href="/tr" className="mt-8 text-xs font-medium text-zinc-500 hover:text-black transition-colors">← Siteye geri dön</Link>
        </div>
      </div>
    </div>
  );
}
