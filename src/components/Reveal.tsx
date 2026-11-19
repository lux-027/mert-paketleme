"use client";

import { useEffect, useRef } from "react";

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal-visible");
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    const observe = () => io.observe(el);
    if (document.documentElement.dataset.introReady === "true") observe();
    else window.addEventListener("intro-ready", observe, { once: true });
    return () => {
      io.disconnect();
      window.removeEventListener("intro-ready", observe);
    };
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
