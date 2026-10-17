import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { ReactNode } from "react";
import { ControlsDock } from "@/components/controls-dock";
import { Navbar } from "@/components/navbar";
import { Preloader } from "@/components/preloader";
import { ScrollRail } from "@/components/scroll-rail";
import { AppProvider } from "@/providers/app-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://purezag.vercel.app"),
  title: "Guilherme Pureza — Desenvolvedor web & mobile",
  description:
    "Portfólio de Guilherme Pureza, desenvolvedor web e mobile. Sites, sistemas e aplicativos rápidos, responsivos e prontos para converter.",
  authors: [{ name: "Guilherme Pureza" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Guilherme Pureza — Desenvolvedor web & mobile",
    description: "Interfaces rápidas, acessíveis e bem construídas.",
    images: ["/media/work/euvatar-institucional/01-1600.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f6f4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="preload" as="image" href="/media/me/portrait-800.webp" type="image/webp" />
      </head>
      <body>
        <AppProvider>
          <Preloader />
          <Navbar />
          {children}
          <ScrollRail />
          <ControlsDock />
        </AppProvider>
      </body>
    </html>
  );
}
