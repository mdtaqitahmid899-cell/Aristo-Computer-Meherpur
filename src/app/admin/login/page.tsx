"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Database,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdmin, login, error, clearError, isFirebaseActive } = useAuth();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect straight to admin panel
  useEffect(() => {
    if (isAdmin) {
      router.push("/admin");
    }
  }, [isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!password.trim()) return;

    setIsSubmitting(true);
    const success = await login(password.trim());
    setIsSubmitting(false);

    if (success) {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <Logo variant="badge" size="xl" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-semibold mb-2">
              <Lock className="w-3 h-3" />
              <span>Private Management Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Aristo Computer
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Meherpur • Store Administration Access
            </p>
          </div>
        </div>

        {/* Password Unlock Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-5">
          {/* Cloud Database Status */}
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-300 font-medium">Firestore Database</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isFirebaseActive ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                }`}
              />
              <span
                className={`text-[11px] font-semibold ${
                  isFirebaseActive ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {isFirebaseActive ? "Connected" : "Local Ready"}
              </span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-password-input"
                className="block text-xs font-semibold text-slate-300 mb-1.5"
              >
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) clearError();
                  }}
                  placeholder="Enter admin password"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white text-sm placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-mono tracking-wider"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Password...</span>
                </>
              ) : (
                <>
                  <span>Unlock Admin Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Direct URL access only. Public admin buttons are removed from the storefront for privacy.
            </span>
          </div>
        </div>

        {/* Back to storefront link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Return to Public Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
