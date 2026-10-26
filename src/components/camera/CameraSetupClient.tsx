"use client";

import React, { useState } from "react";
import {
  Camera,
  ShieldCheck,
  Eye,
  Smartphone,
  HardDrive,
  Wrench,
  CheckCircle2,
  Phone,
  MessageCircle,
  Sparkles,
  Video,
  HelpCircle,
} from "lucide-react";
import { SHOP_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function CameraSetupClient() {
  const { t, isBangla } = useLanguage();
  const c = t.cameraSetup;

  // State for interactive quotation calculator
  const [selectedProperty, setSelectedProperty] = useState("Home");
  const [cameraCount, setCameraCount] = useState("4");
  const [cameraType, setCameraType] = useState("colorVu"); // "hd", "colorVu", "ipPoE", "wifi"
  const [storageDays, setStorageDays] = useState("15"); // "15", "30", "60"
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerLocation, setCustomerLocation] = useState("");

  const handleCustomQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = (process.env.NEXT_PUBLIC_SHOP_WHATSAPP || SHOP_CONFIG.whatsapp).replace(
      /[^0-9]/g,
      ""
    );

    let msg = `📹 *NEW CAMERA SETUP INQUIRY - ARISTO COMPUTER MEHERPUR*\n\n`;
    msg += `• *Customer Name:* ${customerName || "Customer"}\n`;
    msg += `• *Contact Phone:* ${customerPhone || "Not provided"}\n`;
    msg += `• *Location / Area:* ${customerLocation || "Meherpur"}\n`;
    msg += `• *Premises Type:* ${selectedProperty}\n`;
    msg += `• *Cameras Needed:* ${cameraCount} Units\n`;
    msg += `• *Preferred Camera Type:* ${
      cameraType === "colorVu"
        ? "ColorVu 24/7 Color Night Vision"
        : cameraType === "ipPoE"
        ? "Ultra HD IP PoE Camera"
        : cameraType === "wifi"
        ? "Smart Wireless 360° WiFi"
        : "Standard HD Night Vision"
    }\n`;
    msg += `• *Backup Storage Required:* ${storageDays} Days Recording\n\n`;
    msg += `Please provide me a quotation and technician availability for site visit at Hotel Bazar shop.`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handlePackageInquiry = (pkgName: string, channels: string) => {
    const cleanPhone = (process.env.NEXT_PUBLIC_SHOP_WHATSAPP || SHOP_CONFIG.whatsapp).replace(
      /[^0-9]/g,
      ""
    );
    const msg = `Hello Aristo Computer Meherpur,\nI am interested in your *${pkgName}* (${channels}).\nPlease send me current package price, brand options (Dahua/Hikvision/Ezviz), and installation schedule.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const faqs = [
    {
      q: isBangla ? "ক্যামেরা সেটআপ করতে কত সময় লাগে?" : "How long does a camera installation take?",
      a: isBangla
        ? "৪ বা ৮ ক্যামেরার প্যাকেজ সাধারণত ১ দিনের মধ্যেই সম্পূর্ণ ওয়্যারিং ও মোবাইল লাইভ ভিউসহ ইনস্টলেশন সম্পন্ন করা হয়।"
        : "Standard 4-to-8 camera setups for homes and shops are usually completed within a single working day with clean cabling and mobile setup.",
    },
    {
      q: isBangla ? "বিদ্যুৎ চলে গেলে ক্যামেরা কি রেকর্ড করবে?" : "Do cameras continue recording during power outages?",
      a: isBangla
        ? "হ্যাঁ! আমরা সিসিটিভি ক্যামেরার জন্য উচ্চ ক্ষমতাসম্পন্ন আইপিএস (IPS) ও ইউপিএস (UPS) পাওয়ার ব্যাকআপ সরবরাহ করি।"
        : "Yes, we integrate dedicated IPS and UPS power backup units that keep your security cameras recording seamlessly during load-shedding.",
    },
    {
      q: isBangla ? "মোবাইলে লাইভ দেখার জন্য কি ইন্টারনেট লাগবে?" : "Is internet required for live phone viewing?",
      a: isBangla
        ? "স্থানীয়ভাবে রেকর্ডিংয়ের জন্য ইন্টারনেটের প্রয়োজন নেই। তবে বিশ্বের যেকোনো প্রান্ত থেকে মোবাইলে লাইভ দেখার জন্য দোকানে বা বাসায় একটি সাধারণ ওয়াইফাই সংযোগ প্রয়োজন।"
        : "No internet is required for 24/7 continuous local recording. An active WiFi connection is only needed to stream live video to your smartphone from outside.",
    },
    {
      q: isBangla ? "কোন কোন ব্র্যান্ডের ক্যামেরা আপনারা ইনস্টল করেন?" : "Which brands of cameras do you provide?",
      a: isBangla
        ? "আমরা বিশ্ববিখ্যাত ও বিশ্বস্ত ব্র্যান্ড যেমন Dahua, Hikvision, CP Plus, IMOU, ও Ezviz এর ১০০% অরিজিনাল ক্যামেরা অফিশিয়াল ওয়ারেন্টিসহ সরবরাহ করি।"
        : "We supply 100% genuine products with official manufacturer warranties from top global leaders including Hikvision, Dahua, IMOU, CP Plus, and Ezviz.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 sm:py-24 border-b border-slate-800">
        <div className="absolute inset-0 bg-radial from-indigo-950/60 via-slate-950/90 to-slate-950 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Video className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>{c.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {c.headline}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
            {c.subtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <a
              href={`https://wa.me/${(process.env.NEXT_PUBLIC_SHOP_WHATSAPP || SHOP_CONFIG.whatsapp).replace(
                /[^0-9]/g,
                ""
              )}?text=${encodeURIComponent(
                isBangla
                  ? "হ্যালো অ্যারিস্টো কম্পিউটার! আমি মেহেরপুরে সিসিটিভি ক্যামেরা সেটআপ করাতে চাই।"
                  : "Hello Aristo Computer! I want to consult regarding CCTV Camera Setup in Meherpur."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{c.bookButton}</span>
            </a>

            <a
              href={`tel:${SHOP_CONFIG.phone}`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-blue-400" />
              <span>{c.callTechnician}: {SHOP_CONFIG.phone}</span>
            </a>
          </div>

          {/* Quick trust bar */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 border-t border-slate-900 max-w-2xl mx-auto">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBangla ? "মেহেরপুর শহর ও উপজেলায় অন-সাইট সার্ভিস" : "On-site Service in Meherpur"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBangla ? "১০০% আসল ডাহুয়া ও হিকভিশন ক্যামেরা" : "Genuine Dahua & Hikvision"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBangla ? "মোবাইলে সার্বক্ষণিক লাইভ ভিউ" : "Phone App Live Streaming"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Technical Features Grid */}
      <section className="py-14 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/60">
              {c.whyUsTitle}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isBangla ? "নিখুঁত নজরদারিতে আমাদের বিশেষ প্রযুক্তি সুবিধা" : "Engineered for Complete Security & Reliability"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.featuresList.map((item, idx) => {
              const icons = [Eye, ShieldCheck, HardDrive, Smartphone, Wrench, Sparkles];
              const Icon = icons[idx % icons.length];
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 dark:bg-blue-950/60 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Packages & Setup Options */}
      <section className="py-16 sm:py-20 bg-slate-100/60 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/60">
              {c.packagesTitle}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isBangla ? "আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন" : "Pre-Configured Packages Ready for Setup"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {c.packagesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.packages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-xs hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      {pkg.badge}
                    </span>
                    <Camera className="w-5 h-5 text-indigo-500" />
                  </div>

                  <div>
                    <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
                      {pkg.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                      {pkg.channels}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                      {isBangla ? "প্যাকেজে যা যা অন্তর্ভুক্ত:" : "Package Includes:"}
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      {pkg.features.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handlePackageInquiry(pkg.name, pkg.channels)}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isBangla ? "হোয়াটসঅ্যাপে বুকিং করুন" : "Book This Setup"}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Quotation & Site Inspection Form */}
      <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-linear-to-br from-slate-900 via-slate-950 to-indigo-950 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
                {isBangla ? "কাস্টম সমাধান ও অন-সাইট ভিজিট" : "Custom Blueprint & Quotation"}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {c.customQuoteTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-light">
                {c.customQuoteDesc}
              </p>
            </div>

            <form onSubmit={handleCustomQuoteSubmit} className="space-y-6">
              {/* Step 1: Select property type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {isBangla ? "১. ভবনের ধরন নির্বাচন করুন:" : "1. Select Premises Type:"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: isBangla ? "বাসা-বাড়ি" : "Home / Flat", value: "Home" },
                    { label: isBangla ? "দোকান / শোরুম" : "Shop / Showroom", value: "Shop" },
                    { label: isBangla ? "অফিস / ব্যাংক" : "Office / Corporate", value: "Office" },
                    { label: isBangla ? "কারখানা / গোডাউন" : "Factory / Warehouse", value: "Factory" },
                  ].map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setSelectedProperty(p.value)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedProperty === p.value
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30"
                          : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Camera count, type & storage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isBangla ? "২. ক্যামেরার সংখ্যা:" : "2. Camera Units:"}
                  </label>
                  <select
                    value={cameraCount}
                    onChange={(e) => setCameraCount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="2">2 Cameras (Small Area / Entry)</option>
                    <option value="4">4 Cameras (Standard Home / Shop)</option>
                    <option value="8">8 Cameras (Large Showroom / Building)</option>
                    <option value="16">16 Cameras (Factory / Floor / Office)</option>
                    <option value="32+">32+ Cameras (Commercial Institution)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isBangla ? "৩. ক্যামেরার ধরন:" : "3. Technology:"}
                  </label>
                  <select
                    value={cameraType}
                    onChange={(e) => setCameraType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="colorVu">ColorVu (24/7 Color Night Vision)</option>
                    <option value="ipPoE">IP PoE (Digital 4K Cameras)</option>
                    <option value="hd">Standard Full HD (Night Vision)</option>
                    <option value="wifi">Smart 360° Wireless WiFi</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isBangla ? "৪. রেকর্ডিং ব্যাকআপ সময়:" : "4. Recording Storage:"}
                  </label>
                  <select
                    value={storageDays}
                    onChange={(e) => setStorageDays(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="15">15 Days (1TB Surveillance HDD)</option>
                    <option value="30">30 Days (2TB Surveillance HDD)</option>
                    <option value="60">60 Days (4TB Surveillance HDD)</option>
                  </select>
                </div>
              </div>

              {/* Step 3: Contact details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder={isBangla ? "আপনার নাম" : "Your Name"}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
                <input
                  type="tel"
                  placeholder={isBangla ? "মোবাইল নাম্বার" : "Mobile Phone Number"}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
                <input
                  type="text"
                  placeholder={isBangla ? "ঠিকানা / এলাকা (যেমন: মেহেরপুর সদর)" : "Location (e.g. Meherpur Sadar)"}
                  value={customerLocation}
                  onChange={(e) => setCustomerLocation(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-900/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>{c.requestInspection}</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 5. FAQs Section */}
      <section className="py-14 sm:py-20 bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {isBangla ? "প্রশ্ন ও উত্তর" : "Frequently Asked Questions"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isBangla ? "সিসিটিভি ক্যামেরা সম্পর্কে সাধারণ জিজ্ঞাসা" : "Everything You Need to Know"}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
              >
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Shop visit card */}
          <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                {isBangla ? "সরাসরি দোকানে এসে ক্যামেরার লাইভ কোয়ালিটি দেখুন" : "Visit our Shop to Inspect Live Camera Demo"}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isBangla ? SHOP_CONFIG.addressBn : SHOP_CONFIG.address}
              </p>
            </div>
            <a
              href={`tel:${SHOP_CONFIG.phone}`}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 transition-colors cursor-pointer"
            >
              {isBangla ? "কল করুন" : "Call Shop"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
