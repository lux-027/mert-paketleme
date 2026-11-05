import PageHeader from "@/components/PageHeader";
import RobotIllustration from "@/components/RobotIllustration";
import { getDict } from "@/lib/i18n";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDict(locale);
  return (
    <div className="pb-20">
      <PageHeader title={dict.about.title} />
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-zinc-600 leading-relaxed text-lg">{dict.about.text}</p>
          <ul className="mt-8 space-y-3">
            {dict.home.features.map((f) => (
              <li key={f.title} className="flex gap-3">
                <span className="w-2 h-2 bg-zinc-950 rounded-full mt-2 shrink-0" />
                <span><strong>{f.title}:</strong> {f.desc}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl overflow-hidden border border-zinc-800">
          <RobotIllustration className="w-full h-full" />
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {dict.home.stats.map((s) => (
            <div
              key={s.label}
              className="border border-zinc-200 rounded-2xl px-6 py-8 text-center bg-white hover:border-zinc-950 transition-colors"
            >
              <div className="text-4xl font-bold tracking-tight">{s.value}</div>
              <div className="w-8 h-0.5 bg-zinc-950 rounded mx-auto mt-3" />
              <div className="text-xs text-zinc-500 mt-3 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <h2 className="text-2xl font-bold tracking-tight mb-8">{dict.home.industriesTitle}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {dict.home.industries.map((t) => (
            <div key={t} className="border border-zinc-200 rounded-2xl p-6 text-center">
              <div className="w-10 h-1 bg-zinc-950 rounded mx-auto mb-4" />
              <div className="font-semibold">{t}</div>
              <div className="text-xs text-zinc-400 mt-2">{dict.home.industriesText}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
