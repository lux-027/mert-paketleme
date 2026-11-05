import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { getDict, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as "tr" | "en")) notFound();
  const dict = getDict(locale);

  return (
    <>
      <Navbar locale={locale} dict={dict} />
      <main className="min-h-screen">{children}</main>
      <Footer locale={locale} dict={dict} />
      <FloatingButtons />
    </>
  );
}
