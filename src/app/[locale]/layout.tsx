import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import BackToTop from "@/components/BackToTop";
import PageTransition from "@/components/PageTransition";
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
      <main className="min-h-screen"><PageTransition>{children}</PageTransition></main>
      <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0"><Footer locale={locale} dict={dict} /></div>
      <FloatingButtons locale={locale} />
      <BackToTop locale={locale} />
    </>
  );
}
