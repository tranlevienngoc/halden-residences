import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, Instrument_Serif, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://haldenresidences.com"),
  title: "Halden Residences — A Private Way of Living",
  description:
    "Eighteen architectural residences shaped by landscape, light and silence. Register for private access to floor plans, pricing and viewing appointments.",
  openGraph: {
    title: "Halden Residences — A Private Way of Living",
    description:
      "A limited collection of architectural residences shaped by landscape, light and silence.",
    images: ["/images/hero_villa.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${instrument.variable} ${inter.variable} ${plexMono.variable} is-loading antialiased`}
      suppressHydrationWarning
    >
      <body>
        <noscript>
          <style>{`html.is-loading,html.is-loading body{overflow:auto!important}#preloader{display:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
