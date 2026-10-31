"use client";

import React from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageToggleProps {
  className?: string;
  showFullLabel?: boolean;
}

export default function LanguageToggle({
  className = "",
  showFullLabel = false,
}: LanguageToggleProps) {
  const { language, setLanguage, toggleLanguage, isBangla } = useLanguage();

  if (showFullLabel) {
    return (
      <div className={`flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            language === "en"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setLanguage("bn")}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
            language === "bn"
              ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          বাংলা
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`group relative flex items-center gap-1.5 px-2 xl:px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs hover:border-blue-500/50 cursor-pointer ${className}`}
      title={isBangla ? "Switch to English" : "বাংলায় পরিবর্তন করুন (Switch to Bangla)"}
      aria-label="Toggle language"
    >
      <Languages className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
      <span className="tracking-wide">{isBangla ? "বাংলা" : "EN"}</span>
    </button>
  );
}
