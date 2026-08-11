import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { brand, locale, seo, themeToCss } from "@/site.config";
import { StructuredData } from "./structured-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(seo.url),
  title: seo.title,
  description: seo.description,
  // Gerados por `npm run icons` a partir de public/assets/brand-logo.webp
  icons: {
    icon: [
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    title: seo.title,
    description: seo.description,
    siteName: brand.name,
    locale: locale.lang.replace("-", "_"),
    type: "website",
    images: [{ url: seo.ogImage }],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: [seo.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={locale.lang}>
      <head>
        {/* Tema da marca vindo de site.config.ts — sobrescreve os padrões do CSS. */}
        <style dangerouslySetInnerHTML={{ __html: themeToCss() }} />
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
