import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { getDict, site } from "@/lib/i18n";

const valueIcons = [
  // kalite - rozet
  <svg key="0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><circle cx="12" cy="9" r="5" /><path d="m9 13-2 8 5-3 5 3-2-8" /></svg>,
  // güven - kalkan
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M12 2 4 6v6c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-4Z" /><path d="m9 12 2 2 4-4" /></svg>,
  // inovasyon - ampul
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3Z" /></svg>,
  // çözüm - yapboz
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7"><path d="M14 3v3a2 2 0 1 0 4 0h3v4h-3a2 2 0 1 1 0 4h3v4h-4v-3a2 2 0 1 0-4 0v3h-4v-4h3a2 2 0 1 0 0-4H6V6h4V3a2 2 0 1 1 4 0Z" /></svg>,
];

export default async function MissionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDict(locale);
  return (
    <div className="pb-20">
      <PageHeader title={dict.mission.title} />

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 grid gap-6 md:grid-cols-2">
        {/* Mission — dark card */}
        <div className="relative overflow-hidden rounded-2xl bg-zinc-950 text-white p-10 min-h-[320px] flex flex-col justify-between group">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/m-mark.png" alt="" className="absolute -right-16 -bottom-16 h-64 w-64 object-contain opacity-10 invert rotate-12 transition-transform duration-500 group-hover:rotate-6" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-zinc-950 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" fill="currentColor" />
              </svg>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-zinc-400">01</div>
              <h2 className="font-bold text-2xl tracking-tight">{dict.mission.mission}</h2>
            </div>
          </div>
          <p className="relative mt-8 text-zinc-300 leading-relaxed text-lg max-w-md">{dict.mission.missionText}</p>
          <div className="relative mt-8 flex items-center gap-3">
            <div className="w-12 h-1 bg-white rounded" />
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
        </div>

        {/* Vision — light card */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-zinc-950 bg-white p-10 min-h-[320px] flex flex-col justify-between group">
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.8) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/m-mark.png" alt="" className="absolute -right-16 -bottom-16 h-64 w-64 object-contain opacity-[0.07] -rotate-12 transition-transform duration-500 group-hover:-rotate-6" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-zinc-400">02</div>
              <h2 className="font-bold text-2xl tracking-tight">{dict.mission.vision}</h2>
            </div>
          </div>
          <p className="relative mt-8 text-zinc-600 leading-relaxed text-lg max-w-md">{dict.mission.visionText}</p>
          <div className="relative mt-8 flex items-center gap-3">
            <div className="w-12 h-1 bg-zinc-950 rounded" />
            <div className="w-3 h-3 rounded-full border-2 border-zinc-950" />
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{dict.mission.valuesTitle}</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {dict.mission.values.map((v, i) => (
            <div
              key={v.title}
              className="border border-zinc-200 rounded-2xl p-6 hover:border-zinc-950 hover:shadow-lg transition-all"
            >
              <div className="text-zinc-950">{valueIcons[i]}</div>
              <div className="font-semibold mt-4">{v.title}</div>
              <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-200 border border-zinc-200 rounded-2xl bg-white">
          {dict.home.stats.map((s) => (
            <div key={s.label} className="px-6 py-8 text-center">
              <div className="text-3xl font-bold tracking-tight">{s.value}</div>
              <div className="text-xs text-zinc-500 mt-2 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="bg-zinc-950 text-white rounded-2xl px-10 py-12 flex flex-col md:flex-row md:items-center gap-8">
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight">{dict.home.ctaTitle}</h3>
            <p className="text-zinc-400 mt-3">{dict.home.ctaText}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold px-5 py-2.5 text-sm rounded-lg text-center transition-colors"
            >
              {dict.home.ctaCall}
            </a>
            <Link
              href={`/${locale}/iletisim`}
              className="border border-zinc-700 hover:border-white font-semibold px-5 py-2.5 text-sm rounded-lg text-center transition-colors"
            >
              {dict.hero.cta2}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
