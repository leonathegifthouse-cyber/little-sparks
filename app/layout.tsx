import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Navbar from "@/components/Navbar";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-baloo",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Leona — Gifts kids actually love",
  description: "Bright, joyful gifts for babies, toddlers and kids — shipped across India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="min-h-screen font-body text-ink">
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="mt-16 border-t-4 border-ink bg-white/60 py-8 text-center font-body text-sm text-ink/60">
            <div className="mx-auto mb-4 flex h-1.5 max-w-6xl">
              <div className="flex-1 bg-bubblegum" />
              <div className="flex-1 bg-sky" />
              <div className="flex-1 bg-lime" />
              <div className="flex-1 bg-sunshine" />
              <div className="flex-1 bg-coral" />
              <div className="flex-1 bg-grape" />
              <div className="flex-1 bg-turquoise" />
            </div>
            Made with ✦ for the small humans in your life. Leona, India.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
