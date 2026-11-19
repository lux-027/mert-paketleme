import PageHeader from "@/components/PageHeader";
import RobotIllustration from "@/components/RobotIllustration";
import Reveal from "@/components/Reveal";
import { getDict } from "@/lib/i18n";

const industryImages = [
  "/industries/taneli.jpg",
  "/industries/toz.jpg",
  "/industries/sivi.jpg",
  "/industries/granullu.jpg",
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDict(locale);
  return (
    <div className="pb-20">
      <PageHeader title={dict.about.title} />
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <Reveal className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 md:p-8">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-4">{dict.about.title}</div>
            <p className="text-zinc-600 leading-relaxed">{dict.about.text}</p>
          </Reveal>
          <div className="mt-5 grid sm:grid-cols-3 gap-4">
            {dict.home.features.map((f, i) => (
              <Reveal key={f.title} delay={i * 90}>
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 h-full">
                  <div className="w-8 h-1 rounded bg-zinc-950 mb-4" />
                  <div className="font-semibold">{f.title}</div>
                  <div className="mt-2 text-sm leading-relaxed text-zinc-500">{f.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={150} className="rounded-2xl overflow-hidden border border-zinc-800">
          <RobotIllustration className="w-full h-full" />
        </Reveal>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {dict.home.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="border border-zinc-200 rounded-2xl px-6 py-8 text-center bg-white hover:border-zinc-950 transition-colors h-full">
                <div className="text-4xl font-bold tracking-tight">{s.value}</div>
                <div className="w-8 h-0.5 bg-zinc-950 rounded mx-auto mt-3" />
                <div className="text-xs text-zinc-500 mt-3 uppercase tracking-wider">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="text-2xl font-bold tracking-tight mb-8">{dict.home.industriesTitle}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {dict.home.industries.map((t, i) => (
            <Reveal key={t} delay={i * 90} className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={industryImages[i]}
                alt={t}
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="w-8 h-0.5 bg-white/70 rounded mb-2" />
                <div className="text-white font-semibold leading-tight">{t}</div>
                <div className="text-xs text-zinc-300 mt-1">{dict.home.industriesText}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
