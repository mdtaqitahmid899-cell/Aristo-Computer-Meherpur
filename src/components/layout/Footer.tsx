"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  Wrench,
  CheckCircle2,
  Camera,
  ExternalLink,
} from "lucide-react";
import { SHOP_CONFIG, PRODUCT_CATEGORIES } from "@/lib/constants";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const currentYear = 2026;
  const { t, isBangla } = useLanguage();

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors duration-200">
      {/* Trust Badges Strip */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-900 dark:text-white text-sm font-semibold">{t.footer.trustGenuine}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.footer.trustGenuineSub}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-900 dark:text-white text-sm font-semibold">{t.footer.trustDelivery}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.footer.trustDeliverySub}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-sky-600/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-900 dark:text-white text-sm font-semibold">{t.footer.trustAssembly}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.footer.trustAssemblySub}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-900 dark:text-white text-sm font-semibold">{t.footer.trustPrice}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.footer.trustPriceSub}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Logo variant="badge" size="md" />
              <div>
                <div className="font-black text-lg text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  ARISTO <span className="text-blue-600 dark:text-blue-400">COMPUTER</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {isBangla ? "হোটেল বাজার, মেহেরপুর" : "Hotel Bazar, Meherpur"}
                </div>
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {t.footer.brandDesc}
            </p>

            <div className="pt-2 flex flex-col gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <span>{isBangla ? SHOP_CONFIG.addressBn : SHOP_CONFIG.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{isBangla ? SHOP_CONFIG.openingHoursBn : SHOP_CONFIG.openingHours}</span>
              </div>
            </div>
          </div>

          {/* Quick Hardware Categories */}
          <div>
            <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2.5">
              {t.footer.topCategories}
            </h3>
            <ul className="space-y-2 text-xs">
              {PRODUCT_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-between group"
                  >
                    <span>{t.categories[cat] || cat}</span>
                    <span className="text-slate-400 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Store Links */}
          <div>
            <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2.5">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.products}
                </Link>
              </li>
              <li>
                <Link href="/pc-builder" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                  <span>{t.nav.pcBuilder}</span>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-600/30 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded-sm border border-blue-200 dark:border-blue-500/40">Tool</span>
                </Link>
              </li>
              <li>
                <Link href="/camera-setup" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                  <Camera className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{t.nav.cameraSetup}</span>
                  <span className="text-[10px] bg-indigo-100 dark:bg-indigo-600/30 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.2 rounded-sm border border-indigo-200 dark:border-indigo-500/40">Security</span>
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.wishlist}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-slate-900 dark:text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-2.5">
              {t.footer.contactTitle}
            </h3>
            <div className="space-y-3">
              <a
                href={`https://wa.me/${SHOP_CONFIG.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all text-xs font-semibold"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 uppercase">WhatsApp Order</div>
                  <div className="text-slate-900 dark:text-white font-mono">{SHOP_CONFIG.whatsapp}</div>
                </div>
              </a>

              <a
                href={`tel:${SHOP_CONFIG.phone}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all text-xs font-semibold"
              >
                <Phone className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-[11px] text-blue-800/80 dark:text-blue-300/80 uppercase">Direct Helpline</div>
                  <div className="text-slate-900 dark:text-white font-mono">{SHOP_CONFIG.phone}</div>
                </div>
              </a>

              <a
                href={`mailto:${SHOP_CONFIG.email}`}
                className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors pt-1"
              >
                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <span className="font-mono">{SHOP_CONFIG.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Full Store Scope & Services Banner */}
        <div className="mt-12 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs dark:shadow-inner transition-colors">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {t.footer.offeringsBannerTitle}
            </span>
            <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {t.announcement.servicesText}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 font-semibold">
              {t.footer.meherpurTag}
            </span>
          </div>
        </div>

        {/* Bottom Bar with Developer Portfolio Credit */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 transition-colors">
          <p className="text-center sm:text-left">
            © {currentYear} {SHOP_CONFIG.name}. {t.footer.copyright}
          </p>

          {/* Developer Portfolio Link */}
          <div className="flex items-center gap-1.5 font-medium text-center sm:text-left">
            <span>{isBangla ? "ওয়েবসাইট ডেভেলপ করেছে:" : "Website Developed by"}</span>
            <a
              href="https://md-taqi-tahmid.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline inline-flex items-center gap-1 transition-colors group"
            >
              <span>Md Taqi Tahmid</span>
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500 dark:text-slate-400 font-medium">{t.common.allPricesBDT}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
