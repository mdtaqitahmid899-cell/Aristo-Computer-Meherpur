"use client";

import React from "react";
import { Phone, MessageCircle, MapPin, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { SHOP_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function AnnouncementBar() {
  const { t, isBangla } = useLanguage();
  const marqueeText = t.announcement.servicesText;
  const locationText = isBangla ? SHOP_CONFIG.locationShortBn : SHOP_CONFIG.locationShort;
  const hoursText = isBangla ? SHOP_CONFIG.openingHoursBn : SHOP_CONFIG.openingHours;

  return (
    <div className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Top Info Bar */}
      <div className="max-w-7xl mx-auto py-2 px-4 flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Location & Hours */}
        <div className="flex items-center flex-wrap justify-center gap-4 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-medium">{locationText}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>{hoursText}</span>
          </div>
        </div>

        {/* Right: Warranty, Phone, WhatsApp */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <div className="hidden lg:flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{t.common.genuineWarranty}</span>
          </div>

          <a
            href={`tel:${SHOP_CONFIG.phone}`}
            className="flex items-center gap-1.5 text-slate-700 hover:text-blue-600 dark:text-slate-200 dark:hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-medium">{SHOP_CONFIG.phone}</span>
          </a>

          <a
            href={`https://wa.me/${SHOP_CONFIG.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="font-semibold">{t.common.inquireWhatsApp}</span>
          </a>
        </div>
      </div>

      {/* Services & Solutions Marquee Ticker */}
      <div className="bg-slate-200/70 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 py-1.5 px-3 flex items-center overflow-hidden gap-3 transition-colors">
        {/* Static Badge */}
        <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/15 dark:bg-blue-600/20 border border-blue-500/25 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-[11px] font-bold tracking-wide z-10">
          <Sparkles className="w-3 h-3 text-sky-500 dark:text-sky-400 animate-pulse" />
          <span className="uppercase text-[10px]">{t.announcement.salesSolutionsBadge}</span>
        </div>

        {/* Animated Marquee Text */}
        <div className="relative overflow-hidden w-full flex-1">
          <div className="animate-marquee whitespace-nowrap text-[11px] text-slate-700 dark:text-slate-300 font-medium tracking-wide">
            <span className="inline-block px-4">
              {marqueeText}
            </span>
            <span className="inline-block text-blue-600 dark:text-blue-400 px-2">•</span>
            <span className="inline-block px-4 text-slate-500 dark:text-slate-400">
              {t.announcement.subNote}
            </span>
            <span className="inline-block text-blue-600 dark:text-blue-400 px-2">•</span>
            {/* Duplicated for seamless continuous loop */}
            <span className="inline-block px-4">
              {marqueeText}
            </span>
            <span className="inline-block text-blue-600 dark:text-blue-400 px-2">•</span>
            <span className="inline-block px-4 text-slate-500 dark:text-slate-400">
              {t.announcement.subNote}
            </span>
            <span className="inline-block text-blue-600 dark:text-blue-400 px-2">•</span>
          </div>
        </div>
      </div>
    </div>
  );
}
