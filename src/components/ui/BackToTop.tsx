"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top of page"
      title="Back to top"
      className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-400"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
