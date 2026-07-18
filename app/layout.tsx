import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/lib/AudioContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingPlayer from "@/components/FloatingPlayer";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Pare Memories | Some journeys end, but memories never do.",
  description: "A premium, minimalist scrapbook documenting a two-month journey in Kampung Inggris Pare. Built to preserve moments.",
  metadataBase: new URL("https://pare-memories.vercel.app"),
  openGraph: {
    title: "Pare Memories",
    description: "A digital memory journal of Kampung Inggris Pare. Beautiful because of simplicity.",
    type: "website",
    locale: "en_US",
    siteName: "Pare Memories"
  },
  twitter: {
    card: "summary_large_image",
    title: "Pare Memories"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} dark`}>
      <body className="font-sans antialiased text-text-primary bg-bg-primary">
        <ThemeProvider>
          <AudioProvider>
            {/* Subtle organic noise overlay */}
            <div className="noise-overlay" />
            
            {/* Minimal floating theme switcher */}
            <ThemeToggle />

            {/* Smooth scrolling container */}
            <SmoothScroll />
            
            <main className="relative w-full">{children}</main>
            
            {/* Floating playing pill controls */}
            <FloatingPlayer />
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
