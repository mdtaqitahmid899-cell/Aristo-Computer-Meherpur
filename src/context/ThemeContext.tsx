"use client";

import React, { createContext, useContext, useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

export const THEME_STORAGE_KEY = "aristo_theme";

const themeListeners = new Set<() => void>();

function notifyThemeChange() {
  themeListeners.forEach((listener) => {
    try {
      listener();
    } catch {}
  });
}

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const val = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (val === "light" || val === "dark" || val === "system") {
      return val;
    }
  } catch {}
  return "system";
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getResolvedTheme(): ResolvedTheme {
  const mode = getStoredTheme();
  if (mode === "dark") return "dark";
  if (mode === "light") return "light";
  return getSystemTheme();
}

export function applyThemeToDOM(resolved: ResolvedTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
    root.setAttribute("data-theme", "dark");
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.setAttribute("data-theme", "light");
    root.style.colorScheme = "light";
  }
}

export function setThemeMode(mode: ThemeMode) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {}
  const resolved = mode === "system" ? getSystemTheme() : mode;
  applyThemeToDOM(resolved);
  notifyThemeChange();
}

export function toggleThemeMode() {
  const current = getResolvedTheme();
  const next: ThemeMode = current === "dark" ? "light" : "dark";
  setThemeMode(next);
}

function subscribeTheme(callback: () => void) {
  themeListeners.add(callback);

  if (typeof window === "undefined") {
    return () => {
      themeListeners.delete(callback);
    };
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleMediaChange = () => {
    if (getStoredTheme() === "system") {
      applyThemeToDOM(getSystemTheme());
      callback();
    }
  };

  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) {
      applyThemeToDOM(getResolvedTheme());
      callback();
    }
  };

  mediaQuery.addEventListener("change", handleMediaChange);
  window.addEventListener("storage", handleStorageChange);

  return () => {
    themeListeners.delete(callback);
    mediaQuery.removeEventListener("change", handleMediaChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
  mounted: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getStoredTheme,
    () => "system" as ThemeMode
  );

  const resolvedTheme = useSyncExternalStore(
    subscribeTheme,
    getResolvedTheme,
    () => "light" as ResolvedTheme
  );

  const mounted = useSyncExternalStore(
    subscribeTheme,
    () => true,
    () => false
  );

  React.useEffect(() => {
    applyThemeToDOM(getResolvedTheme());
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme: setThemeMode,
        toggleTheme: toggleThemeMode,
        mounted,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
