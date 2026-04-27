import type { Metadata } from "next";
import { Bungee, Fraunces, DM_Mono } from "next/font/google";
import "./globals.css";
import { Marquee } from "./components/Marquee";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";

const bungee = Bungee({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bungee",
  display: "swap"
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap"
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "PEGOTE — Stickers con gracia",
  description:
    "Marketplace de stickers ilustrados por artistas peruanos. Compra, descarga, pega. La autoría siempre queda con el artista.",
  openGraph: {
    title: "PEGOTE — Stickers con gracia",
    description:
      "Marketplace de stickers ilustrados peruanos. La autoría no se toca.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${bungee.variable} ${fraunces.variable} ${dmMono.variable}`}>
      <body className="font-serif">
        <Marquee />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
