"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Trash2,
  PackageOpen,
  MessageCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, generateWhatsAppOrderUrl } from "@/lib/constants";

export default function WishlistPage() {
  const { wishlist, wishlistCount, toggleWishlist, addToCart } = useCart();

  const handleAddAllToCart = () => {
    wishlist.forEach((item) => {
      addToCart(item, 1);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#090d16] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <span className="text-slate-400 dark:text-slate-600">/</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">Saved Wishlist</span>
        </nav>

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-rose-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>My Saved Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-mono">
                    {wishlistCount}
                  </span>
                )}
              </h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Keep track of components and computers you plan to buy from Aristo Computer Meherpur.
            </p>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add All to Cart</span>
              </button>
            </div>
          )}
        </div>

        {/* Wishlist Content */}
        {wishlist.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 max-w-lg mx-auto shadow-xs transition-colors">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              You haven&apos;t saved any hardware components yet. Click the heart icon on any product card while browsing to save it here.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/10"
            >
              <PackageOpen className="w-4 h-4" />
              <span>Explore Computer Hardware</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map((product) => {
              const primaryImage =
                product.images && product.images.length > 0
                  ? product.images[0].url
                  : "/images/products/placeholder.jpg";

              const discountPercent =
                product.originalPrice && product.originalPrice > product.price
                  ? Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100
                    )
                  : null;

              const productPath = `/products/${product.id}`;
              const whatsAppUrl = generateWhatsAppOrderUrl(
                product.name,
                product.price,
                productPath
              );

              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
                >
                  {/* Image container */}
                  <div className="relative aspect-square bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden">
                    <Link
                      href={`/products/${product.id}`}
                      className="relative w-full h-full block"
                    >
                      <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {discountPercent && (
                      <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        -{discountPercent}%
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      title="Remove from wishlist"
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-rose-500 shadow-sm transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 text-rose-600" />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{product.brand}</span>
                        <span>{product.category}</span>
                      </div>
                      <Link
                        href={`/products/${product.id}`}
                        className="block font-bold text-slate-900 dark:text-white text-xs sm:text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                      >
                        {product.name}
                      </Link>
                    </div>

                    <div>
                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-slate-400 line-through font-mono">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => addToCart(product, 1)}
                          disabled={product.stock === 0}
                          className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 sm:px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 text-[11px] sm:text-xs font-bold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed min-w-0"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
                        </button>

                        <a
                          href={whatsAppUrl}
                          onClick={(e) => {
                            if (typeof window !== "undefined") {
                              e.preventDefault();
                              const liveUrl = `${window.location.origin}${productPath}`;
                              const dynamicWhatsAppUrl = generateWhatsAppOrderUrl(
                                product.name,
                                product.price,
                                liveUrl
                              );
                              window.open(dynamicWhatsAppUrl, "_blank", "noopener,noreferrer");
                            }
                          }}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 sm:px-3 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 text-[11px] sm:text-xs font-bold rounded-xl transition-colors min-w-0"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
