"use client";

import { useEffect, useState } from "react";

const MIN_DURATION = 5000;
const TIP_INTERVAL = 1800;

const tipsTR = [
  "0,25 g – 50 kg hassas gramajlama sistemi kalibre ediliyor…",
  "Vidalı dolum ünitesi devreye alınıyor…",
  "Konveyör hattı senkronize ediliyor…",
  "Etiket baskı kafası hizalanıyor…",
  "Mikser karıştırıcı devir ayarı yapılıyor…",
  "Paketleme hattı son kontrolden geçiyor…",
];

const tipsEN = [
  "Calibrating precision weighing system 0.25 g – 50 kg…",
  "Bringing the auger filling unit online…",
  "Synchronizing the conveyor line…",
  "Aligning the label print head…",
  "Setting mixer agitator speed…",
  "Final checks on the packaging line…",
];

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const stepMs = 50;
    const step = 100 / (MIN_DURATION / stepMs);
    const iv = setInterval(() => {
      setProgress((p) => Math.min(100, p + step));
    }, stepMs);

    const tipIv = setInterval(() => setTipIndex((i) => i + 1), TIP_INTERVAL);
    const t1 = setTimeout(() => setHiding(true), MIN_DURATION);
    const t2 = setTimeout(() => setGone(true), MIN_DURATION + 700);

    return () => {
      clearInterval(iv);
      clearInterval(tipIv);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (gone) return null;

  const isEn = typeof window !== "undefined" && window.location.pathname.startsWith("/en");
  const tips = isEn ? tipsEN : tipsTR;
  const tip = tips[tipIndex % tips.length];

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center transition-opacity duration-700 ${
        hiding ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="text-white text-2xl md:text-3xl font-bold tracking-tight">
        Mert Makina
      </div>
      <div
        key={tip}
        className="text-zinc-400 text-sm md:text-base mt-3 h-6 preloader-tip"
      >
        {tip}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" className="h-16 md:h-20 w-auto invert mt-10" />
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
