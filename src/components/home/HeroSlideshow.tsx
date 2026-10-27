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
    imageAlt: "CCTV Camera and Security Surveillance Setup in Meherpur",
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

  // Autoplay timer with pause on hover & visibility check
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Pause when browser tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch swipe support for mobile
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

  const active = SLIDES[currentSlide];
  const BadgeIcon = active.badgeIcon;

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
      {/* Background slide imagery with smooth cross-fade */}
      <div className="absolute inset-0">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10 scale-100" : "opacity-0 z-0 scale-105"
            } transition-transform duration-7000`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Rich gradient overlays for crisp text legibility */}
            <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-950/80 to-slate-950/30" />
            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950/40" />
          </div>
        ))}
      </div>

      {/* Slide Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-24 lg:py-32 flex flex-col justify-between min-h-[480px] sm:min-h-[580px] lg:min-h-[640px]">
        {/* Top Badges & Announcement */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-semibold backdrop-blur-md shadow-xs animate-fade-in-up">
            <BadgeIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>{active.badge}</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/60 text-slate-300 text-xs backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Aristo Computer Meherpur</span>
          </div>
        </div>

        {/* Center Headline & Actions */}
        <div className="max-w-2xl sm:max-w-3xl my-auto py-4 sm:py-6 space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-sky-300 to-indigo-300">
              {active.titleHighlight}
            </span>{" "}
            <span>{active.titleEnd}</span>
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-slate-300 leading-relaxed font-light max-w-xl">
            {active.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2 w-full sm:w-auto">
            <Link
              href={active.primaryAction.href}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-102 active:scale-98 transition-all cursor-pointer w-full sm:w-auto text-center"
            >
              <span>{active.primaryAction.label}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {active.secondaryAction && (
              active.secondaryAction.isExternal ? (
                <a
                  href={active.secondaryAction.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer w-full sm:w-auto text-center ${
                    active.secondaryAction.isWhatsApp
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20"
                      : "bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 backdrop-blur-md"
                  }`}
                >
                  {active.secondaryAction.isWhatsApp && <MessageCircle className="w-4 h-4" />}
                  <span>{active.secondaryAction.label}</span>
                </a>
              ) : (
                <Link
                  href={active.secondaryAction.href}
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 backdrop-blur-md transition-all cursor-pointer w-full sm:w-auto text-center"
                >
                  <span>{active.secondaryAction.label}</span>
                </Link>
              )
            )}
          </div>
        </div>

        {/* Bottom Bar: Trust Badges & Slide Indicator Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 pt-4 sm:pt-6 border-t border-slate-800/80">
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

          {/* Dots Indicator & Navigation Controls */}
          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
            {/* Prev Button */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              title="Previous slide"
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
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

            {/* Next Button */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              title="Next slide"
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-blue-600 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white backdrop-blur-md transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
