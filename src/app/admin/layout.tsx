import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 font-bold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Mert Packing Machine" className="h-7 w-auto invert" />
              <span className="text-sm text-zinc-400">Admin</span>
            </Link>
            {session && (
              <nav className="flex gap-4 text-sm text-zinc-300">
                <Link href="/admin" className="hover:text-white">Panel</Link>
                <Link href="/admin/categories" className="hover:text-white">Kategoriler</Link>
                <Link href="/admin/products" className="hover:text-white">Ürünler</Link>
                <Link href="/tr" className="hover:text-white">Siteyi Gör →</Link>
              </nav>
            )}
          </div>
          {session && (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button className="text-sm text-zinc-300 hover:text-white">
                Çıkış ({session.user?.email})
              </button>
            </form>
          )}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
