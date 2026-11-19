import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import ContactDetails from "@/components/ContactDetails";
import Reveal from "@/components/Reveal";
import { getDict, site } from "@/lib/i18n";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDict(locale);
  return (
    <div>
      <PageHeader title={dict.contact.title} subtitle={dict.contact.subtitle} />
      <div className="max-w-7xl mx-auto px-4 grid gap-10 md:grid-cols-2">
        <Reveal>
          <ContactDetails locale={locale} />
        </Reveal>
        <Reveal delay={120}>
          <ContactForm dict={dict} />
        </Reveal>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pb-20">
        <Reveal>
        <iframe
          title="Harita"
          src={site.mapsEmbed}
          className="w-full h-80 rounded-2xl border border-zinc-200"
          loading="lazy"
        />
        </Reveal>
      </div>
    </div>
  );
}
