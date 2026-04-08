import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib_supabase/cart-context";
import { PageTransitionProvider } from "@/components/page-transition-provider";

/* Body Font */
const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

/* Mono  */
const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

/* PREMIUM HEADING FONT */
const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

import { SettingsProvider } from "@/components/settings-context";

export const metadata: Metadata = {
  title: "Aryam Maps",
  description: "Handcrafted wooden maps that bring your walls to life — by Aryam Maps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${playfair.variable}
          font-sans
          antialiased
        `}
      >
        <SettingsProvider>
          <CartProvider>
            <PageTransitionProvider>
              {children}
            </PageTransitionProvider>
          </CartProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
