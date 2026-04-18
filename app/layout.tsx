import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ScrollToTop from "@/components/layout/ScrollToTop";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nanning-kazan-trading.online"),
  title: {
    default: "Nanning Kazan Trading Co., Ltd | Global Commodity Trade",
    template: "%s | Nanning Kazan Trading",
  },
  description:
    "Nanning Kazan Trading Co., Ltd (南宁市卡赞商贸有限公司) — Your trusted partner for oil, chemicals, metals, agricultural products, textiles, machinery, and more. Export & Import worldwide.",
  keywords: [
    "trading company", "oil", "petroleum", "chemicals", "metals", "metallurgy",
    "agricultural", "textiles", "machinery", "sulfur", "export", "import",
    "China", "Nanning", "Guangxi", "commodity trade", "international trade",
  ],
  authors: [{ name: "Nanning Kazan Trading Co., Ltd" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nanning-kazan-trading.online",
    siteName: "Nanning Kazan Trading",
    title: "Nanning Kazan Trading Co., Ltd | Global Commodity Trade",
    description:
      "Your trusted partner for oil, chemicals, metals, agricultural products, textiles, machinery, and more. Export & Import worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nanning Kazan Trading Co., Ltd",
    description: "Global trading company connecting markets across continents.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <LanguageProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <ScrollToTop />
        </LanguageProvider>
      </body>
    </html>
  );
}
