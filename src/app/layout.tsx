import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mert Paketleme Makinaları",
  description:
    "Paketleme ve dolum makinaları sektöründe öncü firma. 0,25 g - 50 kg arası ürünler için hassas paketleme çözümleri.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
