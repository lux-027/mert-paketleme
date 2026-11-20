"use client";

import { useEffect, useState } from "react";
import { Rajdhani } from "next/font/google";

const brandFont = Rajdhani({ subsets: ["latin", "latin-ext"], weight: "600", display: "swap" });

const MIN_DURATION = 5000;
const TIP_INTERVAL = 1800;

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
    const start = setTimeout(() => setGone(false), 0);
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) finish();
    };
    window.addEventListener("pageshow", onPageShow);
    const stepMs = 50;
    const step = 100 / (MIN_DURATION / stepMs);
    const iv = setInterval(() => {
      setProgress((p) => Math.min(100, p + step));
    }, stepMs);

    const isEnPath = window.location.pathname.startsWith("/en");
    const tips = isEnPath ? tipsEN : tipsTR;
    const order = tips.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    let cursor = 0;
    const showTip = () => {
      setTip(tips[order[cursor % order.length]]);
      cursor++;
    };
    const initialTip = setTimeout(showTip, 0);
    const tipIv = setInterval(showTip, TIP_INTERVAL);
    const t1 = setTimeout(() => setHiding(true), MIN_DURATION);
    const t2 = setTimeout(finish, MIN_DURATION + 700);

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
