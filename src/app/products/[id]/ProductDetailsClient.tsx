"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Phone,
  Check,
  AlertCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  Copy,
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  Star,
} from "lucide-react";
import { Product } from "@/types/product";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductCard from "@/components/products/ProductCard";
import ProductReviews from "@/components/products/ProductReviews";
import {
  formatPrice,
  generateWhatsAppOrderUrl,
  generatePhoneCallUrl,
  SHOP_CONFIG,
} from "@/lib/constants";
import { useCart } from "@/context/CartContext";

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailsClient({
  product,
  relatedProducts,
}: ProductDetailsClientProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "desc" | "reviews">("specs");
  const [quantity, setQuantity] = useState(1);

  const productPath = `/products/${product.id}`;
  const whatsAppUrl = generateWhatsAppOrderUrl(
    product.name,
    product.price,
    productPath
  );

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined") {
      e.preventDefault();
      const liveUrl = window.location.href;
      const dynamicWhatsAppUrl = generateWhatsAppOrderUrl(
        product.name,
        product.price,
        liveUrl
      );
      window.open(dynamicWhatsAppUrl, "_blank", "noopener,noreferrer");
    }
  };

  const phoneCallUrl = generatePhoneCallUrl();

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const discountAmount =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="bg-slate-50 dark:bg-[#090d16] min-h-screen py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto pb-1">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
          <Link href="/products" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
          <span className="text-slate-900 dark:text-slate-200 font-semibold truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Product Hero Grid: Gallery (Left) & Summary/Actions (Right) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 lg:p-8 transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left: Product Images Gallery */}
            <div className="lg:col-span-6">
              <ProductImageGallery
                images={product.images}
                productName={product.name}
              />
            </div>

            {/* Right: Product Details & Buying Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Brand & Stock Status Bar */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                      {product.brand}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Category: {product.category}
                    </span>
                  </div>

                  {product.inStock && product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>In Stock ({product.stock} available)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>Currently Out of Stock</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex items-baseline gap-4 flex-wrap">
                  <div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5">Special Price</span>
                    <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
                      <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5">Regular Price</span>
                      <span className="text-sm text-slate-400 dark:text-slate-500 line-through font-mono">
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>
                  )}

                  {discountAmount > 0 && (
                    <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold self-center">
                      Save {formatPrice(discountAmount)}
                    </span>
                  )}
                </div>

                {/* Quick Highlights / Specifications Pill Grid */}
                {product.specifications && product.specifications.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    {product.specifications.slice(0, 4).map((spec, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800"
                      >
                        <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">
                          {spec.key}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quantity Stepper & Cart / Wishlist Actions */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  {/* Quantity Stepper + Mobile Wishlist */}
                  <div className="flex items-center gap-3">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 p-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 sm:w-12 text-center text-xs font-bold font-mono text-slate-900 dark:text-white">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        disabled={quantity >= product.stock}
                        className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Wishlist Button (mobile next to stepper) */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      className={`sm:hidden p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                        isSaved
                          ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                          : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                      }`}
                      title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                    >
                      <Heart className={`w-5 h-5 ${isSaved ? "fill-rose-600" : ""}`} />
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!product.inStock || product.stock <= 0}
                    className="flex-1 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 min-w-0"
                  >
                    <ShoppingCart className="w-4 h-4 shrink-0" />
                    <span className="truncate">Add to Cart ({quantity})</span>
                  </button>

                  {/* Wishlist Button (desktop & tablet) */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className={`hidden sm:flex p-3 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                      isSaved
                        ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
                        : "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                    title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? "fill-rose-600" : ""}`} />
                  </button>
                </div>

                {/* Direct WhatsApp & Phone Call Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href={whatsAppUrl}
                    onClick={handleWhatsAppClick}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Quick Order</span>
                  </a>

                  <a
                    href={phoneCallUrl}
                    className="flex items-center justify-center gap-2.5 py-3 px-6 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer border border-transparent dark:border-slate-700"
                  >
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span>Call Shop ({SHOP_CONFIG.phone})</span>
                  </a>
                </div>

                {/* Share Link */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Physical Store Support in Meherpur</span>
                  </div>

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied Link!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Share Product</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Assurance strip */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-600 dark:text-slate-400">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">100% Genuine</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-slate-200 dark:border-slate-800">
                  <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Official Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Specifications, Description & Reviews */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
          {/* Tab Selector */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 overflow-x-auto">
            <button
              onClick={() => setActiveTab("specs")}
              className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 shrink-0 ${
                activeTab === "specs"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Full Specifications
            </button>
            <button
              onClick={() => setActiveTab("desc")}
              className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 shrink-0 ${
                activeTab === "desc"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Description & Overview
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-4 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 shrink-0 flex items-center gap-1.5 ${
                activeTab === "reviews"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Customer Reviews</span>
            </button>
          </div>

          <div className="p-6 lg:p-8">
            {activeTab === "specs" ? (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Technical Specifications Table
                </h3>
                {product.specifications && product.specifications.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <tbody>
                        {product.specifications.map((spec, idx) => (
                          <tr
                            key={idx}
                            className={`border-b border-slate-200 dark:border-slate-800 last:border-0 ${
                              idx % 2 === 0
                                ? "bg-white dark:bg-slate-900"
                                : "bg-slate-50/70 dark:bg-slate-800/40"
                            }`}
                          >
                            <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300 w-1/3 sm:w-1/4">
                              {spec.key}
                            </td>
                            <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-medium">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No individual specifications listed for this product.
                  </p>
                )}
              </div>
            ) : activeTab === "desc" ? (
              <div className="space-y-4 max-w-4xl text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Product Overview
                </h3>
                <p className="whitespace-pre-line text-xs sm:text-sm">
                  {product.description}
                </p>
              </div>
            ) : (
              <ProductReviews
                productId={product.id}
                productName={product.name}
              />
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Related {product.category}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Similar hardware you might consider
                </p>
              </div>
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View all {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.slice(0, 4).map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
