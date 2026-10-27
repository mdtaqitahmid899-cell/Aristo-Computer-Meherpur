"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Check,
  AlertCircle,
  Sparkles,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice, generateWhatsAppOrderUrl } from "@/lib/constants";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "/images/products/placeholder.jpg";

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const productPath = `/products/${product.id}`;
  const whatsAppUrl = generateWhatsAppOrderUrl(
    product.name,
    product.price,
    productPath
  );

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
  };

  const isSaved = isInWishlist(product.id);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Top Badges & Action Icons */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1.5 items-start">
          {product.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
          {discountPercent && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-600 text-white shadow-xs">
              Save {discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist floating button */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            type="button"
            suppressHydrationWarning
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer ${
              isSaved
                ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50"
                : "bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200/80 dark:border-slate-700 backdrop-blur-xs"
            }`}
            title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-rose-600 dark:fill-rose-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Product Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-4/3 w-full bg-slate-50 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center p-4 pt-10 border-b border-slate-100 dark:border-slate-800"
      >
        <Image
          src={imageError ? "/images/products/placeholder.jpg" : primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          onError={() => setImageError(true)}
          priority={false}
        />
        {product.images && product.images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-slate-900/70 dark:bg-slate-950/80 text-white text-[10px] px-2 py-0.5 rounded-full font-medium backdrop-blur-xs">
            +{product.images.length - 1} photos
          </span>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4.5 flex flex-col flex-1">
        {/* Brand & Stock Status */}
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <span className="text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[11px] font-bold">
            {product.brand}
          </span>
          {product.inStock && product.stock > 0 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Check className="w-3 h-3" />
              In Stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              <AlertCircle className="w-3 h-3" />
              Out of Stock
            </span>
          )}
        </div>

        {/* Product Title */}
        <Link
          href={`/products/${product.id}`}
          className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 text-xs sm:text-sm leading-snug mb-2.5 sm:mb-3 flex-1"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Key Specs Preview */}
        {product.specifications && product.specifications.length > 0 && (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2 mb-2.5 sm:mb-3 text-[11px] text-slate-600 dark:text-slate-300 space-y-1 border border-slate-100 dark:border-slate-800">
            {product.specifications.slice(0, 2).map((spec, i) => (
              <div key={i} className="truncate">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{spec.key}: </span>
                <span>{spec.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price Section */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mb-2.5 sm:mb-3">
          <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 line-through font-mono">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Add to Cart & WhatsApp Order */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mt-auto">
          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            disabled={!product.inStock || product.stock <= 0}
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3 rounded-xl border border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 hover:bg-blue-600 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-300 hover:text-white dark:hover:text-white text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-0"
          >
            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Add to Cart</span>
          </button>

          <a
            href={whatsAppUrl}
            onClick={handleWhatsAppClick}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer min-w-0"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
