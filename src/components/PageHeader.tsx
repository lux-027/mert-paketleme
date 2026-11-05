export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="relative bg-zinc-950 text-white py-12 md:py-16 mb-8 md:mb-12 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/m-mark.png"
        alt=""
        className="absolute -right-10 -top-10 h-64 w-64 object-contain opacity-10 invert pointer-events-none"
      />
      <div className="max-w-7xl mx-auto px-4 relative">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-3 text-zinc-400 max-w-2xl">{subtitle}</p>}
      </div>
    </div>
  );
}
