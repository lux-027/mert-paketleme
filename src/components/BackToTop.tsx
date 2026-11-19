"use client";

import { useEffect, useState } from "react";

export default function BackToTop({ locale }: { locale: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 600);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <button type="button" aria-label={locale === "en" ? "Back to top" : "Yukarı çık"} disabled={!visible} onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })} className={`fixed right-5 bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-36 z-40 w-10 h-10 rounded-xl border border-zinc-300 bg-white text-zinc-950 shadow-md transition duration-300 hover:-translate-y-1 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}><span aria-hidden="true">↑</span></button>;
}
