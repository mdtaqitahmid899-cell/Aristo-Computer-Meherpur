"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  CreditCard,
  PackageCheck,
  MapPin,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice, SHOP_CONFIG } from "@/lib/constants";
import { createOrder, generateWhatsAppOrderInvoiceUrl } from "@/services/orderService";
import { CustomerOrder, PaymentMethod } from "@/types/order";

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();

  // Form states
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [upazila, setUpazila] = useState<
    "Meherpur Sadar" | "Gangni" | "Mujibnagar" | "Store Pickup"
  >("Meherpur Sadar");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Cash on Delivery");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CustomerOrder | null>(null);

  const deliveryFee = upazila === "Meherpur Sadar" || upazila === "Store Pickup" ? 0 : 100;
  const totalAmount = subtotal + deliveryFee;

  const handleSubmitOrder = async (openWhatsApp = false) => {
    if (!customerName.trim() || !customerPhone.trim() || !deliveryAddress.trim()) {
      alert("Please fill in your name, phone number, and delivery address.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productBrand: item.product.brand,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.images?.[0]?.url || "",
      }));

      const newOrder = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        deliveryAddress: deliveryAddress.trim(),
        upazila,
        deliveryFee,
        paymentMethod,
        notes: notes.trim() || undefined,
        items: orderItems,
        subtotal,
        totalAmount,
      });

      setCompletedOrder(newOrder);
      clearCart();

      if (openWhatsApp) {
        const url = generateWhatsAppOrderInvoiceUrl(newOrder);
        window.open(url, "_blank");
      }
    } catch (err: unknown) {
      console.error("Order submission error:", err);
      alert("There was an error placing your order. Please try again or message us on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Success Screen
  if (completedOrder) {
    return (
      <div className="min-h-[80vh] bg-slate-50 dark:bg-[#090d16] flex items-center justify-center p-6 transition-colors">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-xl transition-colors">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
            <PackageCheck className="w-9 h-9" />
          </div>

          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Order Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              Thank You for Your Order!
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your order has been recorded in our system. Our team in Meherpur will contact you shortly.
            </p>
          </div>

          {/* Order Details Receipt Box */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 text-left space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 font-bold">
              <span className="text-slate-600 dark:text-slate-400">Order ID:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 text-sm">{completedOrder.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Customer:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{completedOrder.customerName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Phone:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{completedOrder.customerPhone}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Delivery Area:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{completedOrder.upazila}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Payment:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{completedOrder.paymentMethod}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm">
              <span className="font-bold text-slate-900 dark:text-white">Total Payable:</span>
              <span className="font-black text-blue-600 dark:text-blue-400 font-mono">
                {formatPrice(completedOrder.totalAmount)}
              </span>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <a
              href={generateWhatsAppOrderInvoiceUrl(completedOrder)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Invoice on WhatsApp</span>
            </a>

            <Link
              href="/"
              className="w-full py-3 px-6 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors block"
            >
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 dark:bg-[#090d16] flex items-center justify-center p-6 transition-colors">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center max-w-md mx-auto space-y-4 transition-colors">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Your cart is currently empty.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-[#090d16] min-h-screen py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <Link href="/cart" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cart</Link>
            <span className="text-slate-400 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-slate-200 font-semibold">Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Checkout & Order Confirmation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Confirm your delivery details in Meherpur and select your preferred payment method.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Customer Information Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>1. Customer & Delivery Address</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shakil Ahmed"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 text-base sm:text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 017XXXXXXXX"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 font-mono text-base sm:text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Delivery Area / Upazila <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={upazila}
                      onChange={(e) =>
                        setUpazila(
                          e.target.value as
                            | "Meherpur Sadar"
                            | "Gangni"
                            | "Mujibnagar"
                            | "Store Pickup"
                        )
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-blue-500 font-medium text-base sm:text-xs"
                    >
                      <option value="Meherpur Sadar">Meherpur Sadar (Free Delivery)</option>
                      <option value="Gangni">Gangni Upazila (+৳100)</option>
                      <option value="Mujibnagar">Mujibnagar Upazila (+৳100)</option>
                      <option value="Store Pickup">Store Pickup (Hotel Bazar Shop - Free)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. shakil@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 text-base sm:text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Street Address / Landmark <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House / Shop name, Road name, Village, Thana, Meherpur"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 resize-none text-base sm:text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Special Order Instructions / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Please call before delivery, deliver in the evening"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 text-base sm:text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>2. Payment Option</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === "Cash on Delivery"
                      ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={() => setPaymentMethod("Cash on Delivery")}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Cash on Delivery</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Pay cash when items are delivered to your doorstep in Meherpur</span>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === "bKash / Nagad"
                      ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "bKash / Nagad"}
                    onChange={() => setPaymentMethod("bKash / Nagad")}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">bKash / Nagad</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Direct mobile banking transfer ({SHOP_CONFIG.phone})</span>
                  </div>
                </label>

                <label
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === "Store Pickup"
                      ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "Store Pickup"}
                    onChange={() => setPaymentMethod("Store Pickup")}
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Pay at Shop</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">Collect hardware directly from our Hotel Bazar shop (Front of Shamoli Counter)</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Review Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
                Items in Order ({cart.length})
              </h3>

              {/* Items scroll list */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-slate-100 dark:divide-slate-800">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-2 first:pt-0 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                      <Image
                        src={
                          item.product.images?.[0]?.url ||
                          "/images/products/placeholder.jpg"
                        }
                        alt={item.product.name}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-slate-500 dark:text-slate-400">
                        {item.quantity} × {formatPrice(item.product.price)}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Cost summary */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Delivery ({upazila}):</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 text-base">
                  <span className="font-black text-slate-900 dark:text-white">Total BDT:</span>
                  <span className="font-black text-blue-600 dark:text-blue-400 font-mono">
                    {formatPrice(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmitOrder(false)}
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>{isSubmitting ? "Processing Order..." : "Confirm & Place Order"}</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSubmitOrder(true)}
                  className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Place Order & Open in WhatsApp</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 dark:text-slate-500 text-center pt-2">
                By placing this order, you will receive an official brand warranty invoice.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
