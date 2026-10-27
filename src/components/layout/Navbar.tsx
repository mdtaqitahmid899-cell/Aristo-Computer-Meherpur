"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Monitor,
  Search,
  Menu,
  X,
  Phone,
  MessageCircle,
  Sparkles,
  ShoppingCart,
  Heart,
  Cpu,
  ArrowRight,
  Camera,
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
  const { cartCount, wishlistCount } = useCart();
  const { t, isBangla } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  // Live search autocomplete
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showLiveSearch, setShowLiveSearch] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
        setSearchResults(matches.slice(0, 5));
      } catch (err) {
        console.error("Live search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close live search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowLiveSearch(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard accessibility: Escape key to close menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        setCategoriesOpen(false);
        setShowLiveSearch(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowLiveSearch(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setShowLiveSearch(false);
    setSearchQuery("");
    router.push(`/products/${productId}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2 sm:gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group min-w-0">
            <Logo variant="badge" size="sm" className="sm:hidden shrink-0" />
            <Logo variant="badge" size="md" className="hidden sm:flex shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-base sm:text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  ARISTO
                </span>
                <span className="text-base sm:text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                  COMPUTER
                </span>
              </div>
              <p className="text-[9px] sm:text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400 truncate max-w-[130px] sm:max-w-none">
                {isBangla ? "হোটেল বাজার, মেহেরপুর" : "Hotel Bazar, Meherpur"}
              </p>
            </div>
          </Link>

          {/* Desktop Search Bar with Live Autocomplete */}
          <div
            ref={searchContainerRef}
            className="hidden md:flex flex-1 max-w-xs lg:max-w-md mx-2 lg:mx-4 relative"
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder={t.nav.searchPlaceholder}
                value={searchQuery}
                onFocus={() => setShowLiveSearch(true)}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  setShowLiveSearch(true);
                  if (val.trim().length < 2) {
                    setSearchResults([]);
                    setIsSearching(false);
                  }
                }}
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white dark:bg-slate-800 dark:hover:bg-slate-750 dark:focus:bg-slate-800 text-slate-900 dark:text-white pl-11 pr-24 py-2.5 rounded-full text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
              >
                {t.nav.search}
              </button>
            </form>

            {/* Live Autocomplete Dropdown */}
            {showLiveSearch && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                    <span>Searching inventory...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2 divide-y divide-slate-100 dark:divide-slate-800">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-between">
                      <span>Matching Products</span>
                      <span>{searchResults.length} results</span>
                    </div>
                    {searchResults.map((product) => {
                      const img = product.images?.[0]?.url || "";
                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => handleSelectProduct(product.id)}
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
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700"
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

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-4 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
              {t.nav.home}
            </Link>

            <Link href="/products" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
              {t.nav.products}
            </Link>

            {/* Categories dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 cursor-pointer"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
              >
                <span>{t.nav.categories}</span>
                <span className="text-[10px]">▼</span>
              </button>

              {categoriesOpen && (
                <div className="absolute top-full -left-12 w-64 pt-2 z-50">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 grid gap-1">
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

            {/* PC Builder Button with Tech Badge */}
            <Link
              href="/pc-builder"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 font-bold text-xs transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t.nav.pcBuilder}</span>
            </Link>

            {/* Camera Setup Service Button with Tech Badge */}
            <Link
              href="/camera-setup"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 font-bold text-xs transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{t.nav.cameraSetup}</span>
            </Link>

            <Link
              href="/products?featured=true"
              className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors py-1 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.nav.offers}</span>
            </Link>

            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1">
              {t.nav.contact}
            </Link>
          </nav>

          {/* Right Action Icons: Language, Theme Toggle, Compare, Wishlist, Cart */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Language Switcher - on tablets/desktop */}
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>

            {/* Dark/Light Theme Toggle - on tablets/desktop */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            {/* Wishlist Link - on tablets/desktop */}
            <Link
              href="/wishlist"
              className="hidden sm:flex relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
              title="Saved wishlist items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link with Badge - always accessible */}
            <Link
              href="/cart"
              className="relative flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors shrink-0"
              title="View shopping cart"
            >
              <ShoppingCart className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-slate-700 dark:text-slate-300 shrink-0" />
              {cartCount > 0 && (
                <span className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full bg-blue-600 text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center font-mono shrink-0">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden lg:hidden cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products in Meherpur..."
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.trim().length < 2) {
                  setSearchResults([]);
                  setIsSearching(false);
                }
              }}
              className="w-full bg-slate-100 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white pl-10 pr-20 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:outline-hidden placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-slate-800 transition-colors">
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
                  className="px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t.nav.home}
                </Link>
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t.nav.products}
                </Link>
                <Link
                  href="/pc-builder"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-between border border-blue-200/50 dark:border-blue-900/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{t.nav.pcBuilder}</span>
                  </div>
                  <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-mono">
                    CUSTOM
                  </span>
                </Link>
                <Link
                  href="/camera-setup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-between border border-indigo-200/50 dark:border-indigo-900/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>{t.nav.cameraSetup}</span>
                  </div>
                  <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-mono">
                    CCTV
                  </span>
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between transition-colors"
                >
                  <span>{t.nav.cart}</span>
                  {cartCount > 0 && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold font-mono">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-slate-800 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
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
                  href="/products?featured=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between transition-colors"
                >
                  <span>{t.nav.offers}</span>
                  <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    HOT
                  </span>
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t.nav.contact}
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
    </header>
  );
}
