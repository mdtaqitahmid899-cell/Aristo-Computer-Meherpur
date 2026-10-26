import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MessageCircle,
  Phone,
  ShieldCheck,
  Cpu,
  Zap,
  Truck,
  Sparkles,
} from "lucide-react";
import { SHOP_CONFIG } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white pt-8 pb-16 lg:py-20 border-b border-slate-800">
      {/* Background ambient light effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
              <span>Premier Computer Hardware Store in Meherpur</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Power Up Your Work & Gaming with{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-sky-300 to-indigo-300">
                Aristo Computer
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Explore the latest gaming laptops, high-performance processors, graphics cards, motherboards, and custom desktop builds. Certified genuine parts with official manufacturer warranties and local service in Meherpur.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${SHOP_CONFIG.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Order</span>
              </a>

              <a
                href={`tel:${SHOP_CONFIG.phone}`}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Direct Call</span>
              </a>
            </div>

            {/* Key Value Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">100% Genuine</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Official Warranty</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <Cpu className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Custom PC Builds</span>
              </div>
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-300 font-medium">Meherpur Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-linear-to-b from-slate-800/80 to-slate-900/90 p-4 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
              {/* Highlight image */}
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-950">
                <Image
                  src="/images/hero/hero-desktop.jpg"
                  alt="High Performance Gaming PC Aristo Computer"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-800/60 inline-block mb-1">
                    Featured Rig
                  </span>
                  <p className="text-sm font-bold text-white">Custom Gaming & Workstation Builds</p>
                  <p className="text-xs text-slate-300">Assembled & stress-tested in Meherpur</p>
                </div>
              </div>

              {/* Floating mini stat tag */}
              <div className="absolute -bottom-4 -left-4 bg-slate-900/95 border border-slate-700 p-3 rounded-2xl shadow-xl backdrop-blur-md hidden sm:flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">AMD & Intel Platforms</div>
                  <div className="text-[11px] text-slate-400">Latest Gen CPUs & GPUs</div>
                </div>
              </div>

              {/* Floating mini location tag */}
              <div className="absolute -top-4 -right-4 bg-slate-900/95 border border-slate-700 px-3.5 py-2 rounded-2xl shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-200">Shop Open in Meherpur</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
