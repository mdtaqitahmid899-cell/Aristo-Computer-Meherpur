"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { useTheme, ThemeMode } from "@/context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showDropdown?: boolean;
}

export default function ThemeToggle({
  className = "",
  showDropdown = true,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectTheme = (mode: ThemeMode) => {
    setTheme(mode);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700/80 shadow-2xs">
        {/* Main Quick-Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            resolvedTheme === "dark"
              ? "Dark theme active. Click to switch to light theme"
              : "Light theme active. Click to switch to dark theme"
          }
          title={
            resolvedTheme === "dark"
              ? "Switch to Light Theme"
              : "Switch to Dark Theme"
          }
          className={`relative p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500/40 group ${className}`}
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            {/* Pure CSS toggle so icon displays instantly without hydration mismatch */}
            <Sun className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform hidden dark:block" />
            <Moon className="w-5 h-5 text-slate-700 group-hover:scale-110 transition-transform block dark:hidden" />
          </div>
        </button>

        {/* Dropdown Menu Trigger Arrow */}
        {showDropdown && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Select theme mode: light, dark, or system"
            title="Theme options"
            className="p-1 px-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
          >
            <span
              className="block transition-transform duration-200"
              style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              ▼
            </span>
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {showDropdown && isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 z-50 animate-fade-in-up">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 mb-1">
            Display Theme
          </div>

          <button
            type="button"
            onClick={() => handleSelectTheme("light")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              theme === "light"
                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Mode</span>
            </div>
            {theme === "light" && (
              <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSelectTheme("dark")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              theme === "dark"
                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-blue-400" />
              <span>Dark Mode</span>
            </div>
            {theme === "dark" && (
              <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSelectTheme("system")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              theme === "system"
                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>System Default</span>
            </div>
            {theme === "system" && (
              <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
