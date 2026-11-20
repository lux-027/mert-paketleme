"use client";

import { useEffect, useState } from "react";
import { Rajdhani } from "next/font/google";

const brandFont = Rajdhani({ subsets: ["latin", "latin-ext"], weight: "600", display: "swap" });

const MIN_DURATION = 5000;
const TIP_INTERVAL = 1800;
const ADMIN_DURATION = 2400;
const adminTips = ["Yönetim arayüzü hazırlanıyor…", "İçerik yönetim alanı açılıyor…", "Panel görünümü tamamlanıyor…"];

const tipsTR = [
  "0,25 g – 50 kg hassas gramajlama sistemi kalibre ediliyor…",
  "Vidalı dolum ünitesi devreye alınıyor…",
  "Konveyör hattı senkronize ediliyor…",
  "Etiket baskı kafası hizalanıyor…",
  "Mikser karıştırıcı devir ayarı yapılıyor…",
  "Paketleme hattı son kontrolden geçiyor…",
  "Paslanmaz gövde panelleri yerleştiriliyor…",
  "Pnömatik piston basıncı ayarlanıyor…",
  "Sensörler ürün akışına kalibre ediliyor…",
  "Hazne seviye kontrolü yapılıyor…",
  "Dozajlama valfleri test ediliyor…",
  "Servo motorlar referans pozisyonuna alınıyor…",
  "Üretim hattı güvenlik protokolleri kontrol ediliyor…",
  "Ambalaj filmi rulosu takılıyor…",
  "Soğutma fanları devreye alınıyor…",
  "Operatör paneli başlatılıyor…",
];

const tipsEN = [
  "Calibrating precision weighing system 0.25 g – 50 kg…",
  "Bringing the auger filling unit online…",
  "Synchronizing the conveyor line…",
  "Aligning the label print head…",
  "Setting mixer agitator speed…",
  "Final checks on the packaging line…",
  "Mounting stainless body panels…",
  "Adjusting pneumatic piston pressure…",
  "Calibrating sensors to product flow…",
  "Checking hopper level control…",
  "Testing dosing valves…",
  "Homing servo motors to reference position…",
  "Verifying production line safety protocols…",
  "Loading the packaging film roll…",
  "Bringing cooling fans online…",
  "Starting the operator panel…",
];

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState("");
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(true);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const scrollRestoration = window.history.scrollRestoration;
    const finish = () => {
      window.history.scrollRestoration = scrollRestoration;
      setGone(true);
      document.documentElement.dataset.introReady = "true";
      window.dispatchEvent(new Event("intro-ready"));
    };
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (navigation?.type === "reload") {
      const pathname = window.location.pathname;
      const home = pathname === "/admin" || pathname.startsWith("/admin/") ? "/admin" : pathname === "/en" || pathname.startsWith("/en/") ? "/en" : "/tr";
      if (pathname !== home || window.location.search || window.location.hash) {
        window.location.replace(home);
        return;
      }
      window.history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    const skip = document.documentElement.dataset.introReady === "true" || navigation?.type === "back_forward";
    if (skip) {
      const ready = setTimeout(finish, 0);
      return () => clearTimeout(ready);
    }
    const pathname = window.location.pathname;
    const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");
    const duration = isAdminPath ? ADMIN_DURATION : MIN_DURATION;
    const start = setTimeout(() => { setAdmin(isAdminPath); setGone(false); }, 0);
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) finish();
    };
    window.addEventListener("pageshow", onPageShow);
    const stepMs = 50;
    const step = 100 / (duration / stepMs);
    const iv = setInterval(() => {
      setProgress((p) => Math.min(100, p + step));
    }, stepMs);

    const isEnPath = window.location.pathname.startsWith("/en");
    const tips = isAdminPath ? adminTips : isEnPath ? tipsEN : tipsTR;
    const order = tips.map((_, i) => i);
    if (!isAdminPath) {
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
    }
    let cursor = 0;
    const showTip = () => {
      setTip(tips[order[cursor % order.length]]);
      cursor++;
    };
    const initialTip = setTimeout(showTip, 0);
    const tipIv = setInterval(showTip, isAdminPath ? 800 : TIP_INTERVAL);
    const t1 = setTimeout(() => setHiding(true), duration);
    const t2 = setTimeout(finish, duration + 700);

    return () => {
      window.history.scrollRestoration = scrollRestoration;
      clearTimeout(start);
      window.removeEventListener("pageshow", onPageShow);
      clearInterval(iv);
      clearInterval(tipIv);
      clearTimeout(initialTip);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  if (admin) return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#1c2533_0%,#09090b_65%)] px-5 text-white transition-opacity duration-700 motion-reduce:transition-none ${hiding ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.035] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div aria-hidden="true" className="pointer-events-none absolute h-72 w-72 rounded-full bg-slate-500/10 blur-3xl" />
      <section aria-label="Admin paneli yükleniyor" className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-950/70 p-6 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-8">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4"><span className={`${brandFont.className} text-sm tracking-[.2em] text-zinc-300`}>MERT MAKİNA</span><span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[9px] uppercase tracking-widest text-zinc-400">Yönetim</span></div>
        <div className="relative mx-auto mt-8 flex h-24 w-24 items-center justify-center">
          <svg aria-hidden="true" viewBox="0 0 100 100" fill="none" className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite] text-zinc-600 motion-reduce:animate-none"><circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth=".7" strokeDasharray="3 7" /></svg>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-600/60 bg-gradient-to-br from-slate-700 via-zinc-800 to-zinc-950 shadow-xl shadow-black/40"><svg aria-hidden="true" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className="h-10 w-10 text-zinc-100"><path d="m16 3 11 4v9c0 7-11 13-11 13S5 23 5 16V7Z" /><circle cx="16" cy="12" r="3" /><path d="M10 23v-2a6 6 0 0 1 12 0v2" /></svg></div>
        </div>
        <div className="mt-5 text-center"><p className="text-[9px] uppercase tracking-[.28em] text-zinc-500">Yönetici alanı</p><h1 className={`${brandFont.className} mt-2 text-3xl font-semibold tracking-wide`}>Admin Panel Girişi</h1><p className="mt-2 text-xs leading-5 text-zinc-400">Ürünler, kategoriler ve içerikler<br />tek bir yönetim merkezinde.</p></div>
        <div className="mt-7">
          <div className="flex items-center justify-between gap-3 text-[10px]"><span className="text-zinc-500">PANEL HAZIRLANIYOR</span><span aria-hidden="true" className="font-mono tabular-nums text-zinc-300">{Math.floor(progress)}%</span></div>
          <div role="progressbar" aria-label="Panel yükleniyor" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.floor(progress)} className="mt-2 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-slate-500 via-zinc-200 to-white transition-[width] duration-100 ease-linear motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div>
          <p role="status" key={tip} className="mt-3 min-h-8 text-center text-[11px] leading-5 text-zinc-400">{tip}</p>
        </div>
        <div aria-hidden="true" className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">{["Arayüz", "İçerikler", "Panel"].map((label, index) => <div key={label} className={`flex items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-[9px] transition-colors ${progress >= index * 34 ? "bg-white/5 text-zinc-300" : "text-zinc-700"}`}><span className={`h-1 w-1 rounded-full ${progress >= index * 34 ? "bg-zinc-300" : "bg-zinc-700"}`} />{label}</div>)}</div>
      </section>
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center transition-opacity duration-700 ${
        hiding ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className={`${brandFont.className} text-zinc-100 text-3xl md:text-4xl uppercase tracking-[.16em]`}>
        Mert Makina
      </div>
      <div
        key={tip}
        className="text-zinc-400 text-sm md:text-base mt-3 min-h-12 w-full max-w-sm px-6 text-center leading-6 text-balance preloader-tip"
      >
        {tip}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" className="h-16 md:h-20 w-auto invert mix-blend-screen mt-10" />
      <div className="w-64 h-[3px] bg-zinc-800 rounded-full mt-10 overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-[width] duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-zinc-600 text-xs mt-3 font-mono">{Math.floor(progress)}%</div>
    </div>
  );
}
