"use client";

import React, { useState } from "react";
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Mail,
  Copy,
  Check,
  ShieldCheck,
  Wrench,
  Camera,
  ExternalLink,
} from "lucide-react";
import { SHOP_CONFIG } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function LocationContactSection() {
  const { t, isBangla } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(SHOP_CONFIG.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(SHOP_CONFIG.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const cleanWhatsapp = SHOP_CONFIG.whatsapp.replace(/[^0-9]/g, "");

  return (
    <section
      className="py-16 sm:py-20 bg-slate-50 dark:bg-[#090d16] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200"
      id="contact"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/60">
            {isBangla ? "সরাসরি যোগাযোগ ও ঠিকানা" : "Visit & Contact Us"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            {isBangla
              ? "মেহেরপুর শোরুমে আপনাকে স্বাগতম"
              : "Come to Our Shop in Meherpur"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {isBangla
              ? "পণ্য যাচাই, কম্পিউটার বিল্ড, সিসিটিভি ক্যামেরা সেটআপ বা ওয়ারেন্টির যেকোনো প্রয়োজনে সরাসরি আমাদের সাথে যোগাযোগ করুন।"
              : "Have questions about product availability, custom PC builds, CCTV setup, or warranty claims? Get in touch with us anytime."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Shop Details & Map Box (Left Column) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <h3 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
                {isBangla ? "দোকানের তথ্য ও ঠিকানা" : "Store Information"}
              </h3>

              <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
                {/* Store Address */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {isBangla ? "দোকানের ঠিকানা:" : "Store Address:"}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {isBangla ? SHOP_CONFIG.addressBn : SHOP_CONFIG.address}
                    </span>
                  </div>
                </div>

                {/* Phone Helpline */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {isBangla ? "ফোন হেল্পলাইন:" : "Phone Helpline:"}
                    </span>
                    <a
                      href={`tel:${SHOP_CONFIG.phone}`}
                      className="text-sky-600 dark:text-sky-400 font-semibold hover:underline font-mono text-sm"
                    >
                      {SHOP_CONFIG.phone}
                    </a>
                    <span className="text-slate-400 text-[11px] block">
                      {isBangla ? "(সরাসরি কল দিন)" : "(Direct Call)"}
                    </span>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {isBangla ? "হোয়াটসঅ্যাপ সাপোর্ট:" : "WhatsApp Support:"}
                    </span>
                    <a
                      href={`https://wa.me/${cleanWhatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline font-mono"
                    >
                      {SHOP_CONFIG.whatsapp}
                    </a>
                    <span className="text-slate-400 text-[11px] block">
                      {isBangla ? "(মেসেজ ও ফটো পাঠান)" : "(Chat & Send Photos)"}
                    </span>
                  </div>
                </div>

                {/* Official Email */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {isBangla ? "অফিশিয়াল ইমেইল:" : "Official Email:"}
                    </span>
                    <a
                      href={`mailto:${SHOP_CONFIG.email}`}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline break-all"
                    >
                      {SHOP_CONFIG.email}
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {isBangla ? "দোকান খোলা থাকে:" : "Operating Hours:"}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      {isBangla ? SHOP_CONFIG.openingHoursBn : SHOP_CONFIG.openingHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${SHOP_CONFIG.phone}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>{SHOP_CONFIG.phone}</span>
                </a>

                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.common.inquireWhatsApp}</span>
                </a>
              </div>
            </div>

            {/* Google Map Box Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {isBangla ? "ম্যাপ ও লোকেশন" : "Map & Location"}
                </span>
                <a
                  href={SHOP_CONFIG.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>{isBangla ? "গুগল ম্যাপে খুলুন" : "Open in Google Maps"}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="w-full h-44 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative flex items-center justify-center">
                <iframe
                  title="Aristo Computer Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.82512398418!2d88.6234!3d23.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f96c21e6462719%3A0x90f67fa4757c2a71!2sMeherpur!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Direct Communication & Services Center (Right Column) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Email Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {isBangla ? "অফিশিয়াল ইমেইল" : "Official Email"}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      {isBangla ? "সরাসরি ইমেইল পাঠাতে পারেন" : "Connect Directly via Email"}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                    {isBangla ? "ইমেইল অ্যাড্রেস:" : "Email Address:"}
                  </span>
                  <a
                    href={`mailto:${SHOP_CONFIG.email}`}
                    className="text-sm sm:text-base font-bold text-indigo-600 dark:text-indigo-400 hover:underline break-all font-mono"
                  >
                    {SHOP_CONFIG.email}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {isBangla ? "কপি হয়েছে!" : "Copied!"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isBangla ? "ইমেইল কপি" : "Copy Email"}</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${SHOP_CONFIG.email}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{isBangla ? "মেইল ওপেন করুন" : "Open Mail"}</span>
                  </a>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isBangla
                  ? "যেকোনো কর্পোরেট অর্ডার, সরকারি/বেসরকারি কোটেশন, অথবা প্রডাক্ট ইনকোয়ারির জন্য সরাসরি আমাদের ইমেইল করতে পারেন।"
                  : "For corporate purchase orders, institutional quotations, or product inquiries, feel free to write directly to our official email address."}
              </p>
            </div>

            {/* Phone & Hotline Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-900/50 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    {isBangla ? "সরাসরি হটলাইন" : "Direct Hotline"}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {isBangla ? "ফোন কল ও ইনস্ট্যান্ট সাপোর্ট" : "Fastest Response via Call"}
                  </h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                    {isBangla ? "মোবাইল নম্বর:" : "Mobile Number:"}
                  </span>
                  <a
                    href={`tel:${SHOP_CONFIG.phone}`}
                    className="text-base sm:text-lg font-black text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-mono tracking-wide"
                  >
                    {SHOP_CONFIG.phone}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyPhone}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedPhone ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {isBangla ? "কপি হয়েছে!" : "Copied!"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isBangla ? "নম্বর কপি" : "Copy"}</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`tel:${SHOP_CONFIG.phone}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{isBangla ? "কল দিন" : "Call Now"}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Services Scope Overview Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {isBangla
                      ? "অ্যারিস্টো কম্পিউটারের পূর্ণাঙ্গ সেবা সমূহ"
                      : "Aristo Computer Full Services"}
                  </h4>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  Hotel Bazar, Meherpur
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {isBangla ? "ল্যাপটপ ও ডেস্কটপ সেলস & সার্ভিস" : "Laptop & Desktop Sales & Service"}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Brand warranty & expert technician servicing
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <Camera className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {isBangla ? "DSLR, CCTV ও IP ক্যামেরা সেটআপ" : "DSLR, CCTV & IP Camera Setup"}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      24/7 ColorVu night vision & mobile live view
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <Wrench className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {isBangla ? "IPS, UPS & AC সল্যুশন" : "IPS, UPS & AC Solutions"}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Power backup & cooling equipment sales
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {isBangla ? "প্রিন্টার, টোনার, ফটোকপি মেশিন" : "Printer, Toner & Photocopier"}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Cartridge refill, projector & machine sales
                    </span>
                  </div>
                </div>
              </div>

              {/* Scope note */}
              <p className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                &ldquo;{t.announcement.servicesText}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
