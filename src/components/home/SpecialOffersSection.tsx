import React from "react";
import Link from "next/link";
import { ArrowRight, Tag, ShieldCheck, Flame } from "lucide-react";
import { SHOP_CONFIG } from "@/lib/constants";

export default function SpecialOffersSection() {
  return (
    <section className="py-12 bg-linear-to-r from-blue-700 via-indigo-700 to-blue-800 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-950 text-white relative overflow-hidden border-y border-transparent dark:border-slate-800 transition-colors duration-200">
      {/* Decorative background shapes */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-sky-400/10 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white/10 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/20 dark:border-slate-800/80 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-slate-950" />
              <span>Special Hardware Offers</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Looking for a Custom PC Build or Laptop Deal in Meherpur?
            </h2>

            <p className="text-sm sm:text-base text-blue-100 dark:text-slate-300 leading-relaxed font-light">
              Get free assembly, free thermal paste application, official brand warranty, and custom budget consultation. Contact our shop directly on WhatsApp for live price quotes.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-blue-200 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-amber-300" />
                <span>Special Discounts in BDT</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Up to 3-5 Years Warranty</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            <Link
              href="/products?featured=true"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-blue-600 text-blue-800 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-500 font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Offers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${SHOP_CONFIG.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                "Hello Aristo Computer! I would like to get a quote for a custom computer build."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ask for PC Quote</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
