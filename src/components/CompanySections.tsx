import Reveal from "@/components/Reveal";

export default function CompanySections({ locale }: { locale: string }) {
  const en = locale === "en";
  const steps = en
    ? [["Needs analysis", "We discuss your production needs."], ["Design", "We plan a solution for your workflow."], ["Manufacturing", "We turn the design into a machine."], ["Testing", "We check operation before delivery."], ["Delivery", "We support installation and operator training."]]
    : [["İhtiyaç analizi", "Üretim ihtiyaçlarınızı birlikte değerlendiriyoruz."], ["Tasarım", "İş akışınıza uygun çözümü planlıyoruz."], ["İmalat", "Tasarımı makineye dönüştürüyoruz."], ["Test", "Teslimat öncesinde çalışma kontrollerini yapıyoruz."], ["Teslimat", "Kurulum ve operatör eğitimiyle yanınızdayız."]];
  const questions = en
    ? [["Do you provide on-site installation?", "Yes. We provide on-site installation for our machines. Contact us to discuss the arrangements."], ["Is operator training available?", "Yes. We provide operator training on using the machine."], ["Do you offer after-sales support?", "Yes. After-sales service and spare parts support are available. Contact our team for your needs."], ["What information is needed for a quote?", "Only your company and billing details are required. Share them directly with our team through our contact channels; do not post them publicly."]]
    : [["Yerinde kurulum yapıyor musunuz?", "Evet, makinelerimiz için yerinde kurulum hizmeti veriyoruz. Kurulum planlaması için ekibimizle iletişime geçebilirsiniz."], ["Operatör eğitimi veriliyor mu?", "Evet, makinenin kullanımına yönelik operatör eğitimi veriyoruz."], ["Satış sonrası servis ve yedek parça desteği var mı?", "Evet, satış sonrası servis ve yedek parça desteği sunuyoruz. İhtiyacınız için ekibimizle iletişime geçebilirsiniz."], ["Teklif almak için hangi bilgiler gerekli?", "Yalnızca firma ve fatura bilgileriniz gerekiyor. Bu bilgileri herkese açık alanlarda paylaşmadan, iletişim kanallarımız üzerinden doğrudan ekibimize iletebilirsiniz."]];
  return (
    <>
      <section className="bg-zinc-950 text-white py-10 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal><p className="text-[10px] md:text-xs uppercase tracking-[.25em] text-zinc-400">Mert Makina</p><h2 className="text-xl md:text-4xl font-bold mt-2 md:mt-3 mb-5 md:mb-10">{en ? "From idea to production" : "Fikirden üretime, birlikte"}</h2></Reveal>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-4">
            {steps.map(([title, text], i) => <li key={title}><Reveal delay={i * 90} className="h-full"><div className="h-full grid grid-cols-[2rem_1fr] md:block gap-x-3 rounded-xl md:rounded-2xl border border-zinc-700 bg-zinc-900/70 p-4 md:p-6 hover:-translate-y-1 hover:border-zinc-400 transition duration-300"><span className="row-span-2 text-2xl md:text-4xl font-light text-zinc-500">0{i + 1}</span><div className="hidden md:block h-px bg-zinc-700 my-6"/><h3 className="font-semibold text-sm md:text-lg">{title}</h3><p className="text-xs md:text-sm text-zinc-400 leading-relaxed mt-1 md:mt-3">{text}</p></div></Reveal></li>)}
          </ol>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-10 md:py-24 grid md:grid-cols-[1fr_2fr] gap-5 md:gap-10">
        <Reveal><p className="text-xs uppercase tracking-[.25em] text-zinc-500">{en ? "Good to know" : "Merak ettikleriniz"}</p><h2 className="text-2xl md:text-3xl font-bold mt-3">{en ? "Frequently asked questions" : "Sık sorulan sorular"}</h2></Reveal>
        <div className="space-y-3">{questions.map(([q, a], i) => <Reveal key={q} delay={i * 60}><details className="group rounded-2xl border border-zinc-200 bg-zinc-50 open:bg-white open:shadow-sm transition"><summary className="cursor-pointer list-none p-4 md:p-5 text-sm md:text-base font-semibold flex items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">{q}<span aria-hidden="true" className="text-xl font-light group-open:rotate-45 transition-transform">+</span></summary><p className="px-5 pb-5 text-sm leading-relaxed text-zinc-600">{a}</p></details></Reveal>)}</div>
      </section>
    </>
  );
}
