"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function ToastNotification() {
  const { toast, dismissToast } = useCart();

  if (!toast) return null;

  const bgStyles =
    toast.type === "success"
      ? "bg-slate-900 text-white border-blue-500/40"
      : toast.type === "warning"
      ? "bg-amber-900 text-amber-100 border-amber-600/40"
      : "bg-slate-800 text-slate-100 border-slate-700";

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-subtle pointer-events-auto">
      <div
        className={`p-4 rounded-2xl border shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md ${bgStyles}`}
      >
        <div className="flex items-center gap-3">
          {toast.type === "success" ? (
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : toast.type === "warning" ? (
            <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
          )}
          <span className="text-xs font-semibold leading-snug">
            {toast.message}
          </span>
        </div>

        <button
          onClick={dismissToast}
          className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
