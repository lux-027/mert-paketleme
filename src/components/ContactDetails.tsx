"use client";

import { useState } from "react";
import { site } from "@/lib/i18n";

export default function ContactDetails({ locale }: { locale: string }) {
  const en = locale === "en";
  const [copyState, setCopyState] = useState("");
  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(site.address);
      setCopyState(en ? "Address copied" : "Adres kopyalandı");
    } catch {
      setCopyState(en ? "Could not copy. Select the address to copy it manually." : "Kopyalanamadı. Adresi seçerek elle kopyalayabilirsiniz.");
    }
  }
  const cards = [
    { title: en ? "Visit us" : "Bizi ziyaret edin", text: site.address, href: site.mapsUrl, path: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" },
    { title: en ? "Call us" : "Bizi arayın", text: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}`, path: "M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4c-9 3-19-7-16-16Z" },
    { title: en ? "Email" : "E-posta", text: site.email, href: `mailto:${site.email}`, path: "M3 5h18v14H3ZM3 6l9 7 9-7" },
    { title: en ? "Working hours" : "Çalışma saatleri", text: en ? "Monday – Saturday: 09:00 – 19:00 · Sunday: Closed" : "Pazartesi – Cumartesi: 09:00 – 19:00 · Pazar: Kapalı", href: "", path: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2" },
  ];
  return <div className="grid sm:grid-cols-2 gap-4">{cards.map((card, i) => <div key={card.title} className={`rounded-2xl border p-5 md:p-6 ${i === 0 ? "sm:col-span-2 bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-50 border-zinc-200"}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 mb-5" aria-hidden="true"><path d={card.path}/></svg><h2 className="font-semibold">{card.title}</h2>{card.href ? <a className="block mt-2 text-sm leading-relaxed opacity-75 hover:opacity-100 break-words" href={card.href} target={i === 0 ? "_blank" : undefined} rel="noreferrer">{card.text}</a> : <p className="mt-2 text-sm leading-relaxed text-zinc-500">{card.text}</p>}{i === 0 && <><div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={copyAddress} className="rounded-lg border border-zinc-600 px-4 py-2 text-xs hover:bg-zinc-800 transition">{en ? "Copy address" : "Adresi kopyala"}</button><a href={site.mapsUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-white text-zinc-950 px-4 py-2 text-xs font-semibold hover:bg-zinc-200 transition">{en ? "Get directions" : "Yol tarifi al"} ↗</a></div><p role="status" className="text-xs text-zinc-300 mt-2">{copyState}</p></>}</div>)}</div>;
}
