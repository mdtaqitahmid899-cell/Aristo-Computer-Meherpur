"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";
import { Language, translations } from "@/lib/translations";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: typeof translations.en;
  isBangla: boolean;
}

const LANGUAGE_STORAGE_KEY = "aristo_language";
const LANGUAGE_EVENT = "aristo_language_changed";

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: translations.en,
  isBangla: false,
});

function subscribeToLanguage(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(LANGUAGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LANGUAGE_EVENT, callback);
  };
}

function getLanguageSnapshot(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const val = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (val === "bn" || val === "en") {
      return val;
    }
  } catch {}
  return "en";
}

function getLanguageServerSnapshot(): Language {
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getLanguageServerSnapshot
  );

  const setLanguage = useCallback((lang: Language) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        window.dispatchEvent(new Event(LANGUAGE_EVENT));
      }
    } catch (e) {
      console.warn("Could not persist language:", e);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const current = getLanguageSnapshot();
    const next: Language = current === "en" ? "bn" : "en";
    setLanguage(next);
  }, [setLanguage]);

  const t = translations[language] || translations.en;
  const isBangla = language === "bn";

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isBangla,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
