import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { getDict, site } from "@/lib/i18n";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDict(locale);
  return (
    <div>
      <PageHeader title={dict.contact.title} subtitle={dict.contact.subtitle} />
      <div className="max-w-7xl mx-auto px-4 grid gap-10 md:grid-cols-2">
        <div className="space-y-5 text-sm">
          <div>
            <div className="font-semibold">{dict.contact.address}</div>
            <a href={site.mapsUrl} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-brand">
              {site.address}
            </a>
          </div>
          <div>
            <div className="font-semibold">{dict.contact.phone}</div>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-zinc-500 hover:text-brand">
              {site.phone}
            </a>
          </div>
          <div>
            <div className="font-semibold">E-Posta</div>
            <a href={`mailto:${site.email}`} className="text-zinc-500 hover:text-brand">
              {site.email}
            </a>
          </div>
          <div>
            <div className="font-semibold">{dict.contact.workingHours}</div>
            <div className="text-zinc-500">
              {dict.footer.weekdays}: 09:00 – 19:00
              <br />
              {dict.contact.sunday}: {dict.contact.closed}
            </div>
          </div>
        </div>
        <ContactForm dict={dict} />
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pb-20">
        <iframe
          title="Harita"
          src={site.mapsEmbed}
          className="w-full h-80 rounded-2xl border border-zinc-200"
          loading="lazy"
        />
      </div>
    </div>
  );
}
