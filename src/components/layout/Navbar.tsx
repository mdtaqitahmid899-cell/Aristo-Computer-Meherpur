"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Monitor,
  Search,
  Menu,
  X,
  Phone,
  MessageCircle,
  ShoppingCart,
  Heart,
  Cpu,
  ArrowRight,
  Camera,
  Home,
  Grid,
  ChevronDown,
  Clock,
  MapPin,
} from "lucide-react";
import { SHOP_CONFIG, PRODUCT_CATEGORIES, formatPrice } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { getProducts } from "@/services/productService";
import { Product } from "@/types/product";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Logo from "@/components/ui/Logo";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount, wishlistCount } = useCart();
  const { t, isBangla } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  // Live search autocomplete
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Active route helper
  const isActive = useCallback(
    (path: string) => {
      if (path === "/") return pathname === "/";
      return pathname.startsWith(path);
    },
    [pathname]
  );

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Focus search input when search is opened
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [searchOpen]);

  // Debounced search
  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const matches = await getProducts({ search: query });
        setSearchResults(matches.slice(0, 6));
      } catch (err) {
        console.error("Live search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close search dropdown / overlay
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setSearchOpen(false);
      }
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [searchOpen]);

  // Keyboard accessibility: Escape key to close menus & search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
        setCategoriesOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/products/${productId}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    searchInputRef.current?.focus();
  };

  const visibleResults = searchQuery.trim().length >= 2 ? searchResults : [];

  return (
    <>
      {/* Main Top Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 xl:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 gap-1.5 sm:gap-2.5 xl:gap-4 relative w-full">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 xl:gap-3 shrink-0 group min-w-0"
              title="Aristo Computer Meherpur"
            >
              <Logo variant="badge" size="sm" className="xl:hidden shrink-0" />
              <Logo variant="badge" size="md" className="hidden xl:flex shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-base sm:text-lg xl:text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    ARISTO
                  </span>
                  <span className="text-base sm:text-lg xl:text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                    COMPUTER
                  </span>
                </div>
                <p className="hidden sm:block lg:hidden xl:block text-[9px] sm:text-[10px] xl:text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400 truncate max-w-[130px] sm:max-w-none">
                  {isBangla ? "হোটেল বাজার, মেহেরপুর" : "Hotel Bazar, Meherpur"}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links - Full Width & Beautifully Spaced */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-3 text-xs xl:text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
              <Link
                href="/"
                className={`px-2 py-1.5 xl:px-2.5 rounded-xl transition-colors ${
                  isActive("/")
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-bold"
                    : "hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {t.nav.home}
              </Link>

              <Link
                href="/products"
                className={`px-2 py-1.5 xl:px-2.5 rounded-xl transition-colors ${
                  pathname === "/products"
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-bold"
                    : "hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {t.nav.products}
              </Link>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoriesOpen(true)}
                onMouseLeave={() => setCategoriesOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-2 py-1.5 xl:px-2.5 rounded-xl hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                >
                  <span>{t.nav.categories}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {categoriesOpen && (
                  <div className="absolute top-full -left-4 w-64 pt-2 z-50">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 grid gap-1">
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <Link
                          key={cat}
                          href={`/products?category=${encodeURIComponent(cat)}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-blue-400 rounded-lg transition-colors flex items-center justify-between"
                        >
                          <span>{t.categories[cat] || cat}</span>
                          <span className="text-slate-300 dark:text-slate-600">→</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* PC Builder Pill */}
              <Link
                href="/pc-builder"
                className={`flex items-center gap-1.5 px-2.5 py-1 xl:px-3 xl:py-1.5 rounded-full border transition-all ${
                  isActive("/pc-builder")
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border-blue-200 dark:border-blue-800/80"
                }`}
              >
                <Cpu className="w-3.5 h-3.5 shrink-0" />
                <span>{t.nav.pcBuilder}</span>
              </Link>

              {/* Camera Setup Pill */}
              <Link
                href="/camera-setup"
                className={`flex items-center gap-1.5 px-2.5 py-1 xl:px-3 xl:py-1.5 rounded-full border transition-all ${
                  isActive("/camera-setup")
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border-indigo-200 dark:border-indigo-800/80"
                }`}
              >
                <Camera className="w-3.5 h-3.5 shrink-0" />
                <span className="lg:hidden xl:inline">{t.nav.cameraSetup}</span>
                <span className="hidden lg:inline xl:hidden">{isBangla ? "ক্যামেরা" : "Camera"}</span>
              </Link>

              {/* Contact Link */}
              <Link
                href="/contact"
                className={`px-2 py-1.5 xl:px-2.5 rounded-xl transition-colors ${
                  isActive("/contact")
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-bold"
                    : "hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {t.nav.contact}
              </Link>
            </nav>

            {/* Right Action Icons & Toggle Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 shrink-0">
              {/* Search Toggle Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1.5 p-2 xl:px-3 xl:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-semibold transition-colors cursor-pointer"
                title="Search products"
                aria-label="Open search bar"
              >
                <Search className="w-4 h-4 shrink-0" />
                <span className="hidden xl:inline">Search</span>
              </button>

              {/* Language Switcher - on tablets/desktop */}
              <div className="hidden sm:block">
                <LanguageToggle />
              </div>

              {/* Dark/Light Theme Toggle - available on mobile and desktop */}
              <ThemeToggle showDropdown={false} />

              {/* Wishlist Link - on tablets/desktop */}
              <Link
                href="/wishlist"
                className={`hidden sm:flex relative p-2 xl:p-2.5 rounded-xl transition-colors ${
                  isActive("/wishlist")
                    ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                    : "text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800"
                }`}
                title="Saved wishlist items"
              >
                <Heart className={`w-5 h-5 ${isActive("/wishlist") ? "fill-rose-600" : ""}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Link with Live Count */}
              <Link
                href="/cart"
                className={`relative flex items-center gap-1.5 p-2 sm:px-2.5 xl:px-3 py-2 rounded-xl transition-colors shrink-0 ${
                  isActive("/cart")
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
                title="View shopping cart"
              >
                <ShoppingCart className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0" />
                {cartCount > 0 && (
                  <span
                    className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full text-[10px] sm:text-[11px] font-bold flex items-center justify-center font-mono shrink-0 ${
                      isActive("/cart")
                        ? "bg-white text-blue-600"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden lg:hidden cursor-pointer shrink-0"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>

            {/* FULL-WIDTH EXPANDABLE SEARCH OVERLAY (TRIGGERED BY SEARCH BUTTON) */}
            {searchOpen && (
              <div
                ref={searchContainerRef}
                className="absolute inset-0 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md z-50 flex items-center px-3 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-200 shadow-md"
              >
                <div className="max-w-4xl mx-auto w-full relative">
                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 sm:gap-3">
                    <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder={t.nav.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden py-2"
                    />

                    {searchQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                        title="Clear text"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer"
                    >
                      {t.nav.search}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        handleClearSearch();
                      }}
                      className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer transition-colors"
                      title="Close search"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </form>

                  {/* Live Autocomplete Dropdown under search overlay */}
                  {searchQuery.trim().length >= 2 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                      {isSearching ? (
                        <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                          <span>Searching inventory...</span>
                        </div>
                      ) : visibleResults.length > 0 ? (
                        <div className="p-2 divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
                          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                            <span>Matching Products</span>
                            <span>{visibleResults.length} results</span>
                          </div>
                          {visibleResults.map((product) => {
                            const img = product.images?.[0]?.url || "";
                            return (
                              <button
                                key={product.id}
                                type="button"
                                onClick={() => {
                                  setSearchOpen(false);
                                  handleSelectProduct(product.id);
                                }}
                                className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors cursor-pointer group"
                              >
                                <div className="relative w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                                  {img ? (
                                    <Image
                                      src={img}
                                      alt={product.name}
                                      fill
                                      sizes="44px"
                                      className="object-contain p-1"
                                    />
                                  ) : (
                                    <Monitor className="w-5 h-5 text-slate-400 m-auto mt-3" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                                    {product.name}
                                  </h4>
                                  <div className="flex items-center gap-2 text-[11px]">
                                    <span className="font-semibold text-blue-600 dark:text-blue-400 font-mono">
                                      {formatPrice(product.price)}
                                    </span>
                                    <span className="text-slate-400 dark:text-slate-600">•</span>
                                    <span className="text-slate-500 dark:text-slate-400 truncate">
                                      {product.category}
                                    </span>
                                  </div>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                              </button>
                            );
                          })}
                          <div className="p-2 text-center">
                            <button
                              type="button"
                              onClick={handleSearchSubmit}
                              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 cursor-pointer"
                            >
                              View all results for &ldquo;{searchQuery}&rdquo; →
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
                          <p className="font-semibold text-slate-700 dark:text-slate-300">No hardware found</p>
                          <p className="text-[11px]">Try checking for typos or broader keywords</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer (mounted at root level outside header containing block) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-900 h-dvh max-h-screen shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-slate-800 transition-colors animate-in slide-in-from-right duration-300 overscroll-contain">
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Logo variant="badge" size="sm" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm leading-tight">
                      {t.common.shopName}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {isBangla ? "হোটেল বাজার, মেহেরপুর" : "Hotel Bazar, Meherpur"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Shop Status Strip */}
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>{isBangla ? SHOP_CONFIG.openingHoursBn : SHOP_CONFIG.openingHours}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Open Now
                </span>
              </div>

              {/* Drawer Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Mobile Controls: Language & Theme */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t.nav.language}
                    </span>
                    <LanguageToggle />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {t.nav.theme}
                    </span>
                    <ThemeToggle showDropdown={true} />
                  </div>
                </div>

                {/* Main Links */}
                <div className="grid gap-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-2.5 ${
                      isActive("/")
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>{t.nav.home}</span>
                  </Link>

                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-2.5 ${
                      pathname === "/products"
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    <span>{t.nav.products}</span>
                  </Link>

                  <Link
                    href="/pc-builder"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-between border transition-colors ${
                      isActive("/pc-builder")
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-900/60 hover:bg-blue-100 dark:hover:bg-blue-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-4 h-4" />
                      <span>{t.nav.pcBuilder}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        isActive("/pc-builder")
                          ? "bg-white text-blue-600 font-bold"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      CUSTOM
                    </span>
                  </Link>

                  <Link
                    href="/camera-setup"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-xl font-bold flex items-center justify-between border transition-colors ${
                      isActive("/camera-setup")
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-900/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Camera className="w-4 h-4" />
                      <span>{t.nav.cameraSetup}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                        isActive("/camera-setup")
                          ? "bg-white text-indigo-600 font-bold"
                          : "bg-indigo-600 text-white"
                      }`}
                    >
                      CCTV
                    </span>
                  </Link>

                  <Link
                    href="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                      isActive("/cart")
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ShoppingCart className="w-4 h-4" />
                      <span>{t.nav.cart}</span>
                    </div>
                    {cartCount > 0 && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold font-mono">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                      isActive("/wishlist")
                        ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>{t.nav.wishlist}</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold font-mono">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-2.5 ${
                      isActive("/contact")
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{t.nav.contact}</span>
                  </Link>
                </div>

                {/* Hardware Categories Section */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Hardware Categories
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        href={`/products?category=${encodeURIComponent(cat)}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Sticky Footer with Quick Actions */}
              <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex gap-2 shrink-0">
                <a
                  href={`tel:${SHOP_CONFIG.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Shop</span>
                </a>
                <a
                  href={`https://wa.me/${SHOP_CONFIG.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}

      {/* Mobile Bottom Navigation App Bar (Phone Only: < md) */}
      <nav
        aria-label="Mobile Bottom Quick Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] pb-[env(safe-area-inset-bottom,0px)] transition-colors"
      >
        <div className="grid grid-cols-5 items-center h-14 max-w-lg mx-auto px-1">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center h-full gap-0.5 text-center transition-colors ${
              isActive("/")
                ? "text-blue-600 dark:text-blue-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold leading-tight">Home</span>
          </Link>

          {/* 2. Catalog / Products */}
          <Link
            href="/products"
            className={`flex flex-col items-center justify-center h-full gap-0.5 text-center transition-colors ${
              pathname === "/products"
                ? "text-blue-600 dark:text-blue-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="text-[10px] font-semibold leading-tight">Catalog</span>
          </Link>

          {/* 3. PC Builder (Special Highlight Tab) */}
          <Link
            href="/pc-builder"
            className="flex flex-col items-center justify-center h-full gap-0.5 text-center -mt-3 group cursor-pointer"
          >
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-active:scale-90 ${
                isActive("/pc-builder")
                  ? "bg-blue-600 text-white shadow-blue-600/40"
                  : "bg-linear-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-600/30"
              }`}
            >
              <Cpu className="w-5 h-5" />
            </div>
            <span
              className={`text-[10px] font-bold leading-tight ${
                isActive("/pc-builder")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              Build PC
            </span>
          </Link>

          {/* 4. Wishlist */}
          <Link
            href="/wishlist"
            className={`relative flex flex-col items-center justify-center h-full gap-0.5 text-center transition-colors ${
              isActive("/wishlist")
                ? "text-rose-600 dark:text-rose-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <div className="relative">
              <Heart
                className={`w-5 h-5 ${
                  isActive("/wishlist") ? "fill-rose-600" : ""
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold leading-tight">Saved</span>
          </Link>

          {/* 5. Cart */}
          <Link
            href="/cart"
            className={`relative flex flex-col items-center justify-center h-full gap-0.5 text-center transition-colors ${
              isActive("/cart")
                ? "text-blue-600 dark:text-blue-400 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold leading-tight">Cart</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
