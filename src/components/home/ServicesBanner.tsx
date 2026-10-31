"use client";

import React from "react";
import Link from "next/link";
import {
  Laptop,
  Network,
  Camera,
  Printer,
  Zap,
  Projector,
  Phone,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { SHOP_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function ServicesBanner() {
  const { t, isBangla } = useLanguage();

  const serviceCategories = [
    {
      title: isBangla ? "ল্যাপটপ ও ডেস্কটপ" : "Laptop & Desktop",
      subtitle: isBangla ? "বিক্রয় ও সার্ভিসিং" : "Sales & Certified Service",
      icon: Laptop,
      href: "/products?category=Laptops",
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900/60",
    },
    {
      title: isBangla ? "নেটওয়ার্ক ও সফটওয়্যার" : "Network & Software",
      subtitle: isBangla ? "অফিস ও বাসা সমাধান" : "Office & Home Solutions",
      icon: Network,
      href: "/contact",
      color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-900/60",
    },
    {
      title: isBangla ? "সিসিটিভি ও আইপি ক্যামেরা" : "DSLR, CCTV & IP Camera",
      subtitle: isBangla ? "সিকিউরিটি ইনস্টলেশন" : "Security & Surveillance",
      icon: Camera,
      href: "/camera-setup",
      highlight: true,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900/60",
    },
    {
      title: isBangla ? "আইপিএস, ইউপিএস ও এসি" : "IPS, UPS & AC",
      subtitle: isBangla ? "পাওয়ার ব্যাকআপ সমাধান" : "Power Backup & Cooling",
      icon: Zap,
      href: "/contact",
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/60",
    },
    {
      title: isBangla ? "প্রিন্টার, টোনার ও কার্টিজ" : "Printer, Toner & Cartridge",
      subtitle: isBangla ? "প্রিন্টিং বিক্রয় ও রিফিল" : "Printing Sales & Refills",
      icon: Printer,
      href: "/products?category=Accessories",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/60",
    },
    {
      title: isBangla ? "প্রজেক্টর ও ফটোকপি মেশিন" : "Projector & Photocopy",
      subtitle: isBangla ? "কমার্শিয়াল মেশিন" : "Commercial Machines",
      icon: Projector,
      href: "/contact",
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/60",
    },
  ];

  return (
    <section className="py-10 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Main Service Highlight Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 dark:from-blue-900 dark:via-slate-900 dark:to-indigo-950 text-white p-6 sm:p-8 md:p-10 shadow-xl border border-blue-600/30 dark:border-blue-800/40 transition-colors duration-200">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>{t.home.servicesTitle}</span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-snug text-white">
                {t.home.servicesText}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {t.home.servicesSub}
              </p>
            </div>

            {/* Direct Contact & Camera CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 sm:gap-3 shrink-0 w-full lg:w-auto">
              <Link
                href="/camera-setup"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-900/30 transition-all cursor-pointer text-center"
              >
                <Camera className="w-4 h-4 shrink-0" />
                <span>{t.nav.cameraSetup}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href={`https://wa.me/${SHOP_CONFIG.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  isBangla
                    ? "হ্যালো অ্যারিস্টো কম্পিউটার! আমি আপনার সেলস ও সার্ভিসিং সম্পর্কে জানতে চাই।"
                    : "Hello Aristo Computer! I want to inquire about your Sales & Services."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all cursor-pointer text-center"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>{t.common.inquireWhatsApp}</span>
              </a>

              <a
                href={`tel:${SHOP_CONFIG.phone}`}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:hover:text-white font-semibold text-xs border border-white/20 dark:border-slate-700 transition-all cursor-pointer text-center"
              >
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{t.common.callNow}</span>
              </a>
            </div>
          </div>
        </div>

        {/* 6 Category Quick-Grid with Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {serviceCategories.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                href={item.href}
                className="group p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border group-hover:scale-105 transition-transform ${item.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {item.highlight && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      CCTV
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
