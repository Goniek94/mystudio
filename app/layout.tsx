// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// DODANY IMPORT KOMPONENTU HEADER
import { Header } from "./components/ui/Header";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// Zaktualizowane meta-dane
export const metadata: Metadata = {
  title: "MyStudio - Kompleksowe Aplikacje Webowe",
  description:
    "Buduję skalowalne, bezpieczne i stabilne systemy end-to-end (React, Node.js, MongoDB). Od koncepcji po wdrożenie produkcyjne.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950`}
      >
        {/* DODANY KOMPONENT HEADER */}
        <Header />

        {/* Dzieci (page.tsx i inne strony) będą renderowane poniżej Header */}
        {children}
      </body>
    </html>
  );
}
