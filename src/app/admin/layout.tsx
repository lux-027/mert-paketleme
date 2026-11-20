import Link from "next/link";
import { auth, signOut } from "@/auth";
import AdminNavigation from "@/components/AdminNavigation";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-zinc-200/70">
      <header className="bg-black border-b border-white/10 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap w-full lg:w-auto items-center gap-4 lg:gap-6">
            <Link href="/admin" className="flex items-center gap-2 font-bold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Mert Packing Machine" className="h-7 w-auto invert" />
              <span className="ml-2 inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-gradient-to-b from-zinc-800 to-zinc-950 px-2.5 py-1.5 text-[10px] font-medium tracking-wide text-zinc-200 shadow-sm">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5 text-zinc-400"><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></svg>
                Admin
                <span aria-label={session ? "Oturum açık" : "Giriş gerekli"} className={`h-1.5 w-1.5 rounded-full ${session ? "bg-emerald-400 shadow-[0_0_6px_#34d39980]" : "bg-zinc-500"}`} />
              </span>
            </Link>
            {session && <AdminNavigation />}
          </div>
          {session && (
            <div className="flex w-full lg:w-auto flex-wrap items-center gap-3">
            <Link href="/tr" className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300 hover:border-zinc-400 hover:text-white transition-colors">Siteyi Gör ↗</Link>
            <div className="hidden xl:block max-w-44 truncate text-xs text-zinc-500" title={session.user?.email ?? ""}>{session.user?.email}</div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4"><path d="M9 4H4v16h5m6-13 5 5-5 5m-6-5h11" /></svg>Çıkış yap
              </button>
            </form>
            </div>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
