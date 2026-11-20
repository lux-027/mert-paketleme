"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Genel Bakış", path: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" },
  { href: "/admin/categories", label: "Kategoriler", path: "M3 7V5a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2ZM3 10h18" },
  { href: "/admin/products", label: "Ürünler", path: "m12 3 9 5v9l-9 5-9-5V8ZM3 8l9 5 9-5M12 13v9M7.5 5.5l9 5" },
];

export default function AdminNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Yönetim menüsü" className="flex w-full sm:w-auto items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
      {links.map(({ href, label, path }) => {
        const active = pathname === href;
        return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex flex-1 sm:flex-none items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-white ${active ? "bg-white text-black shadow-sm" : "text-zinc-400 hover:bg-white/10 hover:text-white"}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" className="h-4 w-4"><path d={path} /></svg>{label}</Link>;
      })}
    </nav>
  );
}
