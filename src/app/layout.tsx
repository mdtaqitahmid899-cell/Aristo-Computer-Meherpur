import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ToastNotification from "@/components/ui/ToastNotification";
import BackToTop from "@/components/ui/BackToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Aristo Computer Meherpur | Laptops, Desktop PCs & Hardware Components",
  description:
    "Leading computer store in Meherpur, Bangladesh. Genuine laptops, custom desktop PCs, processors, motherboards, graphics cards, RAM, SSDs with official brand warranty.",
  keywords: [
    "Aristo Computer",
    "Computer Shop Meherpur",
    "Laptop Price in Meherpur",
    "Desktop PC Bangladesh",
    "Graphics Card Meherpur",
    "Ryzen Processor Bangladesh",
    "Intel Core i5 Meherpur",
    "Computer Accessories Meherpur",
  ],
  authors: [{ name: "Aristo Computer" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col font-sans antialiased bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200`}
      >
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var stored=localStorage.getItem('aristo_theme');var supportDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var isDark=stored==='dark'||((!stored||stored==='system')&&supportDark);var root=document.documentElement;if(isDark){root.classList.add('dark');root.setAttribute('data-theme','dark');root.style.colorScheme='dark';}else{root.classList.remove('dark');root.setAttribute('data-theme','light');root.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                <AnnouncementBar />
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
                <BackToTop />
                <ToastNotification />
              </CartProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
