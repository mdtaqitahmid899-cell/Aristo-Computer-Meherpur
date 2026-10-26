"use client";

import React from "react";
import Link from "next/link";
import {
  Camera,
  Eye,
  Smartphone,
  HardDrive,
  Wrench,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { SHOP_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function CameraSetupPreview() {
  const { t, isBangla } = useLanguage();
  const c = t.cameraSetup;

  const highlights = [
    {
      icon: Eye,
      title: isBangla ? "কালার নাইট ভিশন" : "Color Night Vision",
      desc: isBangla ? "অন্ধকারেও পূর্ণ রঙিন ছবি" : "Clear 24/7 color in total dark",
    },
    {
      icon: Smartphone,
      title: isBangla ? "মোবাইলে লাইভ ভিউ" : "Phone App Live View",
      desc: isBangla ? "বিশ্বের যেকোনো প্রান্ত থেকে" : "Monitor from anywhere worldwide",
    },
    {
      icon: HardDrive,
      title: isBangla ? "সার্ভিলেন্স রেকর্ডিং" : "Surveillance Storage",
      desc: isBangla ? "১৫-৩০ দিনের ব্যাকআপ" : "Continuous HDD recording",
    },
    {
      icon: Wrench,
      title: isBangla ? "নিখুঁত ওয়্যারিং" : "Neat Conduit Cabling",
      desc: isBangla ? "অভিজ্ঞ টেকনিশিয়ান দ্বারা" : "Professional aesthetic casing",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-linear-to-b from-slate-900 to-slate-950 text-white border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800/80 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Camera className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isBangla ? "আমাদের বিশেষ সেবা ও দক্ষতা" : "Specialized In-House Skill"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
              {c.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              {c.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/camera-setup"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <span>{isBangla ? "সকল প্যাকেজ ও বুকিং দেখুন" : "View Packages & Pricing"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${(process.env.NEXT_PUBLIC_SHOP_WHATSAPP || SHOP_CONFIG.whatsapp).replace(
                /[^0-9]/g,
                ""
              )}?text=${encodeURIComponent(
                isBangla
                  ? "হ্যালো অ্যারিস্টো কম্পিউটার! আমি মেহেরপুরে সিসিটিভি ক্যামেরা সেটআপ সেবা নিতে চাই।"
                  : "Hello Aristo Computer! I want to inquire about your CCTV Camera Setup Services."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isBangla ? "হোয়াটসঅ্যাপ বুকিং" : "WhatsApp Booking"}</span>
            </a>
          </div>
        </div>

        {/* 4 Feature Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500 transition-colors space-y-2.5"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Location Note */}
        <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span>{isBangla ? "অন-সাইট সেবা ও পরামর্শের জন্য আমাদের দোকানে আসুন:" : "Visit our store for on-site consultation:"}</span>
          <span className="font-bold text-white">
            {isBangla ? SHOP_CONFIG.locationShortBn : SHOP_CONFIG.locationShort}
          </span>
        </div>
      </div>
    </section>
  );
}
