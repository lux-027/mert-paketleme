import { site } from "@/lib/i18n";

const phone = site.phone.replace(/[\s+]/g, "");

export default function FloatingButtons({ locale = "tr" }: { locale?: string }) {
  const en = locale === "en";
  return (
    <>
    <nav aria-label={en ? "Quick contact" : "Hızlı iletişim"} className="md:hidden fixed bottom-0 inset-x-0 z-50 grid grid-cols-3 divide-x divide-zinc-200 border-t border-zinc-200 bg-white/95 backdrop-blur-lg shadow-lg pb-[env(safe-area-inset-bottom)]">
      {[{ href: `tel:+${phone}`, label: en ? "Call" : "Ara", icon: "M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c-9 3-19-7-16-16Z" }, { href: `https://wa.me/${phone}`, label: "WhatsApp", icon: "M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5A9 9 0 1 1 21 11.5Z" }, { href: site.mapsUrl, label: en ? "Directions" : "Yol Tarifi", icon: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" }].map((item) => <a key={item.label} href={item.href} target={item.href.startsWith("https") ? "_blank" : undefined} rel="noreferrer" className="flex items-center justify-center gap-2 py-4 text-xs font-semibold active:bg-zinc-100"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5" aria-hidden="true"><path d={item.icon}/></svg>{item.label}</a>)}
    </nav>
    <div className="fixed right-5 bottom-5 z-50 hidden md:flex flex-col gap-3">
      <a
        href={`https://wa.me/${phone}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.6-1.3.1-.2 0-.4 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.9.9-1.1 2.2-.2 3.9a11.6 11.6 0 0 0 4.5 4.3c1.7.8 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z" />
        </svg>
      </a>
      <a
        href={`tel:+${phone}`}
        aria-label="Ara"
        className="w-12 h-12 rounded-full bg-zinc-500 text-white flex items-center justify-center shadow-lg shadow-zinc-950/25 hover:bg-zinc-400 hover:scale-105 transition-all"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c1 .3 1.9.5 2.9.7a2 2 0 0 1 1.6 1.9Z" />
        </svg>
      </a>
    </div>
    </>
  );
}
