"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MessageCircle,
  Cpu,
  Sparkles,
  ShieldCheck,
  Zap,
  Truck,
  Layers,
  Monitor,
  Laptop,
  Camera,
} from "lucide-react";
import { SHOP_CONFIG } from "@/lib/constants";

interface SlideData {
  id: string;
  badge: string;
  badgeIcon: React.ComponentType<{ className?: string }>;
  titleHighlight: string;
  titleEnd: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
    isExternal?: boolean;
    isWhatsApp?: boolean;
  };
  imageUrl: string;
  imageAlt: string;
  tagText: string;
}

const SLIDES: SlideData[] = [
  {
    id: "gaming-pc",
    badge: "Custom PC Specialist",
    badgeIcon: Cpu,
    titleHighlight: "Elite Gaming PCs",
    titleEnd: "& High-Power Workstations",
    description:
      "Hand-built, benchmarked, and stress-tested in Meherpur. Featuring AMD Ryzen 9000, Intel 14th Gen, and NVIDIA RTX graphics with official brand warranties.",
    primaryAction: {
      label: "Build Custom PC",
      href: "/pc-builder",
    },
    secondaryAction: {
      label: "Order on WhatsApp",
      href: `https://wa.me/${(process.env.NEXT_PUBLIC_SHOP_WHATSAPP || SHOP_CONFIG.whatsapp).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        "Hello Aristo Computer Meherpur, I want to inquire about custom gaming PC setups and quotations."
      )}`,
      isExternal: true,
      isWhatsApp: true,
    },
    imageUrl: "/images/hero/hero-desktop.jpg",
    imageAlt: "Custom Gaming PC at Aristo Computer Meherpur",
    tagText: "Custom RTX & Ryzen Rigs",
  },
  {
    id: "laptops",
    badge: "100% Genuine Laptops",
    badgeIcon: Laptop,
    titleHighlight: "Next-Gen Laptops",
    titleEnd: "For Gaming, Study & Work",
    description:
      "Official brand laptops from Asus ROG, Lenovo Legion, HP Victus, Acer Predator, and Apple MacBook. Genuine boxed units with official manufacturer warranty.",
    primaryAction: {
      label: "Explore Laptops",
      href: "/products?category=Laptops",
    },
    secondaryAction: {
      label: "Special Offers",
      href: "/products?featured=true",
    },
    imageUrl: "/images/hero/hero-laptop.jpg",
    imageAlt: "Gaming and Ultrabook Laptops in Meherpur",
    tagText: "Official Brand Warranty",
  },
  {
    id: "components",
    badge: "Extreme Performance Hardware",
    badgeIcon: Zap,
    titleHighlight: "Ryzen & Intel Core",
    titleEnd: "CPUs, DDR5 & Gen4 SSDs",
    description:
      "Level up your rig with top-tier processors, high-frequency DDR5 memory modules, ultra-fast NVMe storage, and durable motherboards backed by official local support.",
    primaryAction: {
      label: "View Processors",
      href: "/products?category=Processors",
    },
    secondaryAction: {
      label: "Motherboards",
      href: "/products?category=Motherboards",
    },
    imageUrl: "/images/hero/hero-components.jpg",
    imageAlt: "High Performance Processors and Motherboards",
    tagText: "Top Tier Components",
  },
  {
    id: "monitors-accessories",
    badge: "Pro Esports Gear",
    badgeIcon: Monitor,
    titleHighlight: "240Hz Gaming Displays",
    titleEnd: "& Mechanical Peripherals",
    description:
      "Experience lightning-fast response times with curved gaming monitors, customizable RGB mechanical keyboards, high-precision mice, and noise-cancelling headsets.",
    primaryAction: {
      label: "Shop Monitors",
      href: "/products?category=Monitors",
    },
    secondaryAction: {
      label: "Accessories",
      href: "/products?category=Accessories",
    },
    imageUrl: "/images/hero/hero-monitors.jpg",
    imageAlt: "Gaming Monitors and Mechanical Peripherals",
    tagText: "High Refresh Displays",
  },
  {
    id: "camera-setup",
    badge: "Surveillance & CCTV Specialist",
    badgeIcon: Camera,
    titleHighlight: "CCTV & IP Cameras",
    titleEnd: "Full Security Setup in Meherpur",
    description:
      "24/7 ColorVu night vision cameras, neat conduit wiring, and mobile live streaming for homes, shops, offices, and factories. Professional setup by certified technicians.",
    primaryAction: {
      label: "View Camera Packages",
      href: "/camera-setup",
    },
    secondaryAction: {
      label: "Book on WhatsApp",
      href: `https://wa.me/${(process.env.NEXT_PUBLIC_SHOP_WHATSAPP || SHOP_CONFIG.whatsapp).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        "Hello Aristo Computer Meherpur, I want to inquire about CCTV camera setup and installation packages at Hotel Bazar."
      )}`,
      isExternal: true,
      isWhatsApp: true,
    },
    imageUrl: "/images/hero/hero-cctv.jpg",
    imageAlt: "CCTV Camera Setup in Meherpur",
    tagText: "24/7 ColorVu Night Vision",
  },
];

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Automatic slide rotation every 6 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch gesture handlers for mobile horizontal swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative overflow-hidden bg-slate-950 text-white select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Computer hardware promotions and featured gear"
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Horizontal Side-by-Side Sliding Track */}
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {SLIDES.map((slide, index) => {
          const BadgeIcon = slide.badgeIcon;

          return (
            <div
              key={slide.id}
              className="min-w-full w-full shrink-0 relative flex flex-col justify-between py-8 sm:py-14 lg:py-20 px-4 sm:px-6 lg:px-8 min-h-[520px] sm:min-h-[560px] lg:min-h-[600px]"
            >
              <div className="max-w-7xl mx-auto w-full my-auto">
                {/* Mobile & Tablet: Image on Top, Text on Bottom. Desktop: Text on Left, Image on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
                  {/* Image Column: order-1 on mobile/tablet (TOP), order-2 on desktop (RIGHT) */}
                  <div className="order-1 lg:order-2 lg:col-span-5 flex items-center justify-center relative">
                    {/* Glowing backlight */}
                    <div className="absolute w-56 h-56 sm:w-80 sm:h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                    {/* Image Card Container */}
                    <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none aspect-16/10 sm:aspect-16/9 lg:aspect-4/3 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800/80 shadow-2xl bg-slate-900/60 group/card mx-auto">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.imageAlt}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 45vw"
                        className="object-cover object-center group-hover/card:scale-105 transition-transform duration-700"
                      />

                      {/* Subtle overlay shading for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20 pointer-events-none" />

                      {/* Overlaid Floating Specs Tag */}
                      <div className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 z-10 flex items-center gap-2 px-3 py-1 sm:py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-md shadow-lg text-[11px] sm:text-xs font-semibold text-slate-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{slide.tagText}</span>
                      </div>
                    </div>
                  </div>

                  {/* Text Column: order-2 on mobile/tablet (BOTTOM), order-1 on desktop (LEFT) */}
                  <div className="order-2 lg:order-1 lg:col-span-7 space-y-3.5 sm:space-y-6">
                    {/* Top Badges */}
                    <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 flex-wrap">
                      <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-semibold backdrop-blur-md shadow-xs">
                        <BadgeIcon className="w-3.5 h-3.5 text-blue-400" />
                        <span>{slide.badge}</span>
                      </div>

                      <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/60 text-slate-300 text-xs backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Aristo Computer Meherpur</span>
                      </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white leading-tight text-center sm:text-left">
                      <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-sky-300 to-indigo-300">
                        {slide.titleHighlight}
                      </span>{" "}
                      <span>{slide.titleEnd}</span>
                    </h1>

                    {/* Subtitle / Description */}
                    <p className="text-xs sm:text-base text-slate-300 leading-relaxed font-light max-w-xl mx-auto sm:mx-0 text-center sm:text-left">
                      {slide.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-start gap-2.5 sm:gap-3 pt-2 w-full sm:w-auto">
                      <Link
                        href={slide.primaryAction.href}
                        className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-102 active:scale-98 transition-all cursor-pointer w-full sm:w-auto text-center"
                      >
                        <span>{slide.primaryAction.label}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>

                      {slide.secondaryAction && (
                        slide.secondaryAction.isExternal ? (
                          <a
                            href={slide.secondaryAction.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer w-full sm:w-auto text-center ${
                              slide.secondaryAction.isWhatsApp
                                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                                : "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 backdrop-blur-md"
                            }`}
                          >
                            {slide.secondaryAction.isWhatsApp && <MessageCircle className="w-4 h-4" />}
                            <span>{slide.secondaryAction.label}</span>
                          </a>
                        ) : (
                          <Link
                            href={slide.secondaryAction.href}
                            className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 backdrop-blur-md transition-all cursor-pointer w-full sm:w-auto text-center"
                          >
                            <span>{slide.secondaryAction.label}</span>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side Floating Next & Previous Navigation Arrows */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-2xl bg-slate-900/80 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-2xl bg-slate-900/80 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Bottom Bar: Trust Badges & Slide Indicator Controls */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          {/* Trust Value Props */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:gap-6 text-xs text-slate-400 font-medium w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>100% Genuine</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Official Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Meherpur Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Local Service</span>
            </div>
          </div>

          {/* Dots Indicator & Mobile Navigation Controls */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
            {/* Mobile Prev Button */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="sm:hidden p-2 rounded-xl bg-slate-900/80 hover:bg-blue-600 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Slide Dots */}
            <div className="flex items-center gap-2">
              {SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentSlide
                      ? "w-8 bg-blue-500 shadow-sm shadow-blue-500/50"
                      : "w-2 bg-slate-700 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>

            {/* Mobile Next Button */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="sm:hidden p-2 rounded-xl bg-slate-900/80 hover:bg-blue-600 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
