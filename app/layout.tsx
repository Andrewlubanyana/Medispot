import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MediSpot — Find & Book Trusted Doctors in KwaZulu-Natal",
  description:
    "Browse verified doctors across Durban and the South Coast. Read real patient reviews, compare services, and book your appointment online. Free for patients.",
  keywords: [
    "doctors durban",
    "book doctor south africa",
    "find doctor kwazulu-natal",
    "medical appointments durban",
    "south coast doctors",
    "medispot",
  ],
  openGraph: {
    title: "MediSpot — Find & Book Trusted Doctors in KwaZulu-Natal",
    description:
      "Browse verified doctors across Durban and the South Coast. Read real patient reviews and book your appointment online.",
    type: "website",
    locale: "en_ZA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}