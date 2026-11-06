"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId } from "react";
import type { Dict } from "@/lib/i18n";
import { site } from "@/lib/i18n";

function FlagTR() {
  const id = useId().replace(/:/g, "");
  return (
    <svg width="36" height="26" viewBox="-1 -3 26 22" role="img" aria-label="Türk bayrağı" style={{ flexShrink: 0, overflow: "visible" }}>
      <defs>
        <filter id={id} x="-20%" y="-30%" width="140%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.01" numOctaves="1" seed="3" result="wave">
            <animate attributeName="baseFrequency" values="0.035 0.01;0.09 0.04;0.035 0.01" dur="3s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="wave" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <linearGradient id={`${id}-light`}>
          <stop offset="0" stopColor="#000" stopOpacity="0.12" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <g filter={`url(#${id})`}>
        <rect width="24" height="16" rx="0.5" fill="#E30A17" />
        <circle cx="9" cy="8" r="4.5" fill="#fff" />
        <circle cx="10" cy="8" r="3.6" fill="#E30A17" />
        <path d="m15.4 5.4.62 1.91h2.01l-1.63 1.18.63 1.91-1.63-1.18-1.63 1.18.63-1.91-1.63-1.18h2.01Z" fill="#fff" />
        <rect width="24" height="16" fill={`url(#${id}-light)`} />
      </g>
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
  const otherLocale = locale === "tr" ? "en" : "tr";
  const langHref = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const links = [
    { href: `/${locale}`, label: dict.nav.home, icon: "m3 10 9-7 9 7v10H15v-7H9v7H3Z" },
    { href: `/${locale}/hakkimizda`, label: dict.nav.about, icon: "M4 21V3h12v18M16 9h4v12M8 7h4M8 11h4M8 15h4M2 21h20" },
    { href: `/${locale}/misyon-vizyon`, label: dict.nav.mission, icon: "M12 3a9 9 0 1 0 9 9M12 7a5 5 0 1 0 5 5M12 12l9-9M16 3h5v5" },
    { href: `/${locale}/urunlerimiz`, label: dict.nav.products, icon: "m3 7 9-4 9 4v10l-9 4-9-4Zm0 0 9 4 9-4M12 11v10M7 5l10 4" },
    { href: `/${locale}/blog`, label: dict.nav.blog, icon: "M4 3h16v18H4ZM8 7h8M8 11h8M8 15h5" },
    { href: `/${locale}/iletisim`, label: dict.nav.contact, icon: "M3 5h18v14H3ZM3 6l9 7 9-7" },
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
      <div className="bg-white border-b border-zinc-200">
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
          <details className="mobile-menu lg:hidden group/menu">
            <summary aria-label={locale === "en" ? "Navigation menu" : "Gezinme menüsü"} className="list-none p-3 -mr-2 cursor-pointer relative z-10 [&::-webkit-details-marker]:hidden">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path className="group-open/menu:hidden" d="M4 8h16M4 16h10" />
                <path className="hidden group-open/menu:block" d="M6 6l12 12M6 18L18 6" />
              </svg>
            </summary>
            <button type="button" aria-label={locale === "en" ? "Close menu" : "Menüyü kapat"} className="fixed inset-x-0 bottom-0 top-[100px] bg-black/20 backdrop-blur-md" onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")} />
            <nav className="absolute z-10 top-full inset-x-0 max-h-[55dvh] overflow-y-auto border-t border-zinc-200 rounded-b-3xl px-5 py-4 flex flex-col gap-1 text-sm bg-white/95 shadow-xl">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2.5 hover:bg-zinc-100 font-medium" onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" className="w-4 h-4 shrink-0" aria-hidden="true"><path d={l.icon} /></svg>
                  {l.label}
                </Link>
              ))}
              <Link href={langHref} onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")} className="font-semibold flex items-center gap-3 px-4 py-3">
                {locale === "en" ? <FlagEN /> : <FlagTR />}
                {locale.toUpperCase()}
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
