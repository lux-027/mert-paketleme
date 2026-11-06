import Link from "next/link";
import type { Dict } from "@/lib/i18n";
import { site } from "@/lib/i18n";
import { getCategories } from "@/lib/store";

const icons = {
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 mt-0.5 shrink-0">
      <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 mt-0.5 shrink-0">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c1 .3 1.9.5 2.9.7a2 2 0 0 1 1.6 1.9Z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 mt-0.5 shrink-0">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6L22 7" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4 mt-0.5 shrink-0">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
    </svg>
  ),
};

export default function Footer({ locale, dict }: { locale: string; dict: Dict }) {
  const categories = getCategories();

  return (
    <footer className="bg-zinc-950 text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-14 grid grid-cols-2 gap-x-6 gap-y-7 md:gap-10 md:grid-cols-12">
        {/* Brand */}
        <div className="col-span-2 md:col-span-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Mert Packing Machine" className="h-10 w-auto invert" />
          <p className="text-zinc-400 mt-4 leading-relaxed text-xs md:text-sm max-w-sm">
            {locale === "en" ? "Reliable filling, packaging and mixing solutions for your production." : "Üretiminiz için güvenilir dolum, paketleme ve karıştırma çözümleri."}
          </p>
          <div className="flex gap-3 mt-6">
            <a
              href={`https://wa.me/${site.phone.replace(/[\s+]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.6-1.3.1-.2 0-.4 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.1 2.2-.2 3.9a11.6 11.6 0 0 0 4.5 4.3c1.7.8 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z" />
              </svg>
            </a>
            <a
              href={`tel:+${site.phone.replace(/[\s+]/g, "")}`}
              aria-label="Ara"
              className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-colors"
            >
              {icons.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              aria-label="E-posta"
              className="w-10 h-10 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-colors"
            >
              {icons.mail}
            </a>
          </div>
        </div>

        {/* Quick menu */}
        <div className="md:col-span-2">
          <div className="font-semibold text-white mb-3 uppercase tracking-wider text-[11px] flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-zinc-400">
            {dict.footer.quickMenu}
          </div>
          <ul className="space-y-2 text-xs md:text-sm">
            <li><Link href={`/${locale}`} className="text-zinc-400 hover:text-white transition-colors">{dict.nav.home}</Link></li>
            <li><Link href={`/${locale}/hakkimizda`} className="text-zinc-400 hover:text-white transition-colors">{dict.nav.about}</Link></li>
            <li><Link href={`/${locale}/misyon-vizyon`} className="text-zinc-400 hover:text-white transition-colors">{dict.nav.mission}</Link></li>
            <li><Link href={`/${locale}/urunlerimiz`} className="text-zinc-400 hover:text-white transition-colors">{dict.nav.products}</Link></li>

            <li><Link href={`/${locale}/blog`} className="text-zinc-400 hover:text-white transition-colors">{dict.nav.blog}</Link></li>
            <li><Link href={`/${locale}/iletisim`} className="text-zinc-400 hover:text-white transition-colors">{dict.nav.contact}</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="md:col-span-3">
          <div className="font-semibold text-white mb-3 uppercase tracking-wider text-[11px] flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-zinc-400">
            {dict.home.categoriesTitle}
          </div>
          <ul className="space-y-2 text-xs md:text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/${locale}/urunlerimiz/${c.slug}`}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  {locale === "en" && c.nameEn ? c.nameEn : c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-2 md:col-span-3 border-t border-zinc-800 pt-5 md:border-0 md:pt-0">
          <div className="font-semibold text-white mb-3 uppercase tracking-wider text-[11px] flex items-center gap-2 before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-zinc-400">
            {dict.footer.contact}
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3 text-xs md:text-sm text-zinc-400">
            <li className="flex gap-3">
              {icons.pin}
              <span>{site.address}</span>
            </li>
            <li className="flex gap-3">
              {icons.phone}
              <a href={`tel:+${site.phone.replace(/[\s+]/g, "")}`} className="hover:text-white">{site.phone}</a>
            </li>
            <li className="flex gap-3">
              {icons.mail}
              <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </li>
            <li className="flex gap-3">
              {icons.clock}
              <span>
                {dict.footer.weekdays}: 09:00 – 19:00
                <br />
                {dict.footer.sundayClosed}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-800/70 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <span>© {site.name} — {dict.footer.rights}</span>
          <Link href="/admin" className="hover:text-zinc-300 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
