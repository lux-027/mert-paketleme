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
      <h1 className="text-2xl font-bold">Hoş geldin, {session?.user?.name ?? "Admin"}</h1>
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        <Link href="/admin/categories" className="bg-white border border-zinc-200 rounded-xl p-5 hover:shadow">
          <div className="text-3xl font-bold text-brand">{store.categories.length}</div>
          <div className="text-sm text-zinc-500 mt-1">Kategori</div>
        </Link>
        <Link href="/admin/products" className="bg-white border border-zinc-200 rounded-xl p-5 hover:shadow">
          <div className="text-3xl font-bold text-brand">{store.products.length}</div>
          <div className="text-sm text-zinc-500 mt-1">Ürün</div>
        </Link>
        <div className="bg-white border border-zinc-200 rounded-xl p-5">
          <div className="text-3xl font-bold text-brand">{messages.length}</div>
          <div className="text-sm text-zinc-500 mt-1">İletişim Mesajı</div>
        </div>
      </div>

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
