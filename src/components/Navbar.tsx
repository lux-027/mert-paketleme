"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Dict } from "@/lib/i18n";
import { site } from "@/lib/i18n";

function FlagTR() {
  return (
    <svg viewBox="0 0 24 16" className="w-8 h-5 rounded-[2px] overflow-hidden shrink-0 flag-wave">
      <rect width="24" height="16" fill="#E30A17" />
      <circle cx="9" cy="8" r="4.5" fill="#fff" />
      <circle cx="10" cy="8" r="3.6" fill="#E30A17" />
      <path d="m14.5 5.7.8 2.4 2.5-.9-1.6 2 1.6 2-2.5-.9-.8 2.4-.6-2.5-2.6.7 1.7-1.9-1.7-1.9 2.6.7.6-2.5Z" fill="#fff" transform="rotate(-15 14 8) scale(0.8) translate(3 1.2)" />
    </svg>
  );
}

function FlagEN() {
  return (
    <svg viewBox="0 0 24 16" className="w-8 h-5 rounded-[2px] overflow-hidden shrink-0">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#fff" strokeWidth="3" />
      <path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.4" />
      <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5" />
      <path d="M12 0v16M0 8h24" stroke="#C8102E" strokeWidth="2.6" />
    </svg>
  );
}

export default function Navbar({ locale, dict }: { locale: string; dict: Dict }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const otherLocale = locale === "tr" ? "en" : "tr";
  const langHref = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/hakkimizda`, label: dict.nav.about },
    { href: `/${locale}/misyon-vizyon`, label: dict.nav.mission },
    { href: `/${locale}/urunlerimiz`, label: dict.nav.products },

    { href: `/${locale}/blog`, label: dict.nav.blog },
    { href: `/${locale}/iletisim`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top info bar */}
      <div className="bg-zinc-950 text-zinc-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a href={`mailto:${site.email}`} className="hover:text-white transition-colors">
              {site.email}
            </a>
            <span className="hidden sm:inline">{site.hours}</span>
          </div>
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors font-semibold">
            {site.phone}
          </a>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white/95 backdrop-blur border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Mert Packing Machine" className="h-9 md:h-10 w-auto" />
          </Link>
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  pathname === l.href
                    ? "text-zinc-950 font-semibold border-b-2 border-zinc-950 pb-1"
                    : "text-zinc-500 hover:text-zinc-950 transition-colors"
                }
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={langHref}
              className="flex items-center gap-2 border border-zinc-300 rounded-full px-3 py-1.5 text-xs font-semibold hover:border-zinc-950 hover:text-zinc-950 text-zinc-500 transition-colors"
            >
              {locale === "en" ? <FlagEN /> : <FlagTR />}
              {locale.toUpperCase()}
            </Link>
          </nav>
          <button
            type="button"
            className="lg:hidden p-3 -mr-2 relative z-10 cursor-pointer"
            onClick={() => setOpen(!open)}
            aria-label="Menü"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
        {open && (
          <nav className="lg:hidden border-t border-zinc-200 px-4 py-4 flex flex-col gap-4 text-sm bg-white">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link href={langHref} className="font-semibold flex items-center gap-2">
              {locale === "en" ? <FlagEN /> : <FlagTR />}
              {locale.toUpperCase()}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
