import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientToaster } from "@/components/providers/client-toaster";
import { I18nProvider } from "@/components/shared/I18nProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LegalTech Platform",
  description: "Professional case management for law firms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <I18nProvider>
          {children}
          <ClientToaster />
        </I18nProvider>
      </body>
    </html>
  );
}
