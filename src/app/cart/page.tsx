"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageCircle,
  PackageOpen,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, SHOP_CONFIG } from "@/lib/constants";

export default function CartPage() {
  const { cart, cartCount, subtotal, updateQuantity, removeFromCart, clearCart } =
    useCart();

  const [deliveryArea, setDeliveryArea] = useState<
    "Meherpur Sadar" | "Gangni" | "Mujibnagar" | "Store Pickup"
  >("Meherpur Sadar");

  const deliveryFee = deliveryArea === "Meherpur Sadar" || deliveryArea === "Store Pickup" ? 0 : 100;
  const totalAmount = subtotal + deliveryFee;

  // WhatsApp Order generation from cart
  const handleOrderOnWhatsApp = () => {
    const cleanPhone = (process.env.NEXT_PUBLIC_SHOP_WHATSAPP || SHOP_CONFIG.whatsapp).replace(/[^0-9]/g, "");

    let msg = `🛒 *ARISTO COMPUTER MEHERPUR - CART ORDER*\n\n`;
    msg += `I would like to order the following items from my cart:\n\n`;

    cart.forEach((item, index) => {
      msg += `${index + 1}. *${item.product.name}*\n`;
      msg += `   Qty: ${item.quantity} × ${formatPrice(item.product.price)} = ${formatPrice(
        item.product.price * item.quantity
      )}\n`;
    });

    msg += `\n*Subtotal:* ${formatPrice(subtotal)}`;
    msg += `\n*Delivery Area:* ${deliveryArea} (${deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)})`;
    msg += `\n*Total Amount:* *${formatPrice(totalAmount)}*\n\n`;
    msg += `Please let me know how to confirm and receive the items. Thank you!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (cartCount === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 dark:bg-[#090d16] flex items-center justify-center p-6 transition-colors">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center max-w-md mx-auto space-y-5 shadow-xs transition-colors">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Your Cart is Empty
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Looks like you haven&apos;t added any laptops, PC components, or accessories to your shopping cart yet.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Browse Products</span>
            </Link>
            <Link
              href="/pc-builder"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              <span>Build Custom PC</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-[#090d16] min-h-screen py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Breadcrumb */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-slate-200 font-semibold">Shopping Cart</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Shopping Cart ({cartCount} {cartCount === 1 ? "item" : "items"})
            </h1>
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Main Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden transition-colors">
              {cart.map((item) => {
                const img =
                  item.product.images?.[0]?.url ||
                  "/images/products/placeholder.jpg";

                return (
                  <div
                    key={item.product.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Item Thumbnail & Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                        <Image
                          src={img}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                          {item.product.brand} • {item.product.category}
                        </span>
                        <Link
                          href={`/products/${item.product.id}`}
                          className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 block mt-0.5"
                        >
                          {item.product.name}
                        </Link>
                        <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mt-1">
                          {formatPrice(item.product.price)} each
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls & Item Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-xs font-bold font-mono text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total for this line */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-xs font-bold font-mono text-slate-900 dark:text-white block">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 ml-auto mt-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping in Meherpur</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
                Order Summary
              </h3>

              {/* Delivery Destination Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Delivery Destination
                </label>
                <select
                  value={deliveryArea}
                  onChange={(e) =>
                    setDeliveryArea(
                      e.target.value as
                        | "Meherpur Sadar"
                        | "Gangni"
                        | "Mujibnagar"
                        | "Store Pickup"
                    )
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-750 focus:outline-hidden focus:border-blue-500 font-medium"
                >
                  <option value="Meherpur Sadar">Meherpur Sadar (Free Delivery)</option>
                  <option value="Gangni">Gangni Upazila (+৳100)</option>
                  <option value="Mujibnagar">Mujibnagar Upazila (+৳100)</option>
                  <option value="Store Pickup">Store Pickup (Hotel Bazar Shop - Free)</option>
                </select>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Estimated Delivery Fee:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-sm">
                  <span className="font-bold text-slate-900 dark:text-white">Total BDT:</span>
                  <span className="font-black text-blue-600 dark:text-blue-400 font-mono text-base">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Checkout Actions */}
              <div className="space-y-2.5 pt-2">
                <Link
                  href="/checkout"
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={handleOrderOnWhatsApp}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp Directly</span>
                </button>
              </div>

              {/* Security & Warranty Notice */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Official Warranty on all hardware</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span>Fast delivery across Meherpur district</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
