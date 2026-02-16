import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const geistSans = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Carmona Studio | Legal Budgeting",
  description: "Next-gen budgeting compliant with Spanish 2026 laws",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.className} antialiased bg-slate-50 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-10">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}