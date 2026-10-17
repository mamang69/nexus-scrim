import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NexusScrim | Esports Matchmaking Platform & Scrim Finder",
  description:
    "Platform matchmaking scrim profesional untuk game Valorant, Mobile Legends, PUBG Mobile, Free Fire, dan Dota 2. Temukan lawan tanding, atur jadwal scrim, dan pantau hasil pertandingan.",
  keywords: [
    "Scrim Valorant",
    "Scrim MLBB",
    "Scrim PUBG Mobile",
    "Esports Tournament",
    "Matchmaking Scrim Indonesia",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#08090d] text-slate-100 min-h-screen flex flex-col font-sans`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
