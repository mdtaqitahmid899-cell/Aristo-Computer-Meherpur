"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Cpu,
  CircuitBoard,
  Layers,
  HardDrive,
  Monitor,
  Zap,
  Box,
  Plus,
  Trash2,
  Check,
  Printer,
  MessageCircle,
  ShoppingCart,
  X,
  Search,
} from "lucide-react";
import { Product, ProductCategory } from "@/types/product";
import { formatPrice, SHOP_CONFIG } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import Logo from "@/components/ui/Logo";

interface PCBuilderClientProps {
  initialProducts: Product[];
}

interface ComponentSlot {
  id: string;
  name: string;
  category: ProductCategory;
  required: boolean;
  icon: React.ComponentType<{ className?: string }>;
  wattageEstimate: number;
}

const SLOTS: ComponentSlot[] = [
  {
    id: "cpu",
    name: "Processor (CPU)",
    category: "Processors",
    required: true,
    icon: Cpu,
    wattageEstimate: 125,
  },
  {
    id: "motherboard",
    name: "Motherboard",
    category: "Motherboards",
    required: true,
    icon: CircuitBoard,
    wattageEstimate: 60,
  },
  {
    id: "ram",
    name: "RAM (Memory)",
    category: "RAM",
    required: true,
    icon: Layers,
    wattageEstimate: 30,
  },
  {
    id: "storage",
    name: "Storage (SSD / HDD)",
    category: "SSD and HDD",
    required: true,
    icon: HardDrive,
    wattageEstimate: 20,
  },
  {
    id: "gpu",
    name: "Graphics Card (GPU)",
    category: "Graphics Cards",
    required: false,
    icon: Layers,
    wattageEstimate: 200,
  },
  {
    id: "psu",
    name: "Power Supply (PSU)",
    category: "Accessories",
    required: true,
    icon: Zap,
    wattageEstimate: 0,
  },
  {
    id: "casing",
    name: "Casing & Cooling",
    category: "Accessories",
    required: false,
    icon: Box,
    wattageEstimate: 15,
  },
  {
    id: "monitor",
    name: "Monitor / Display",
    category: "Monitors",
    required: false,
    icon: Monitor,
    wattageEstimate: 40,
  },
];

export default function PCBuilderClient({ initialProducts }: PCBuilderClientProps) {
  const { addToCart } = useCart();

  // Selected components: slotId -> Product
  const [selectedParts, setSelectedParts] = useState<{ [slotId: string]: Product }>({});

  // Component picker modal
  const [activeSlot, setActiveSlot] = useState<ComponentSlot | null>(null);
  const [modalSearch, setModalSearch] = useState("");

  // Print modal
  const [showPrintQuote, setShowPrintQuote] = useState(false);

  const handleSelectProduct = (slotId: string, product: Product) => {
    setSelectedParts((prev) => ({ ...prev, [slotId]: product }));
    setActiveSlot(null);
    setModalSearch("");
  };

  const handleRemoveProduct = (slotId: string) => {
    setSelectedParts((prev) => {
      const copy = { ...prev };
      delete copy[slotId];
      return copy;
    });
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear your custom PC configuration?")) {
      setSelectedParts({});
    }
  };

  // Calculations
  const totalPrice = useMemo(() => {
    return Object.values(selectedParts).reduce((sum, p) => sum + p.price, 0);
  }, [selectedParts]);

  const estimatedWattage = useMemo(() => {
    let watt = 100; // baseline system draw
    SLOTS.forEach((slot) => {
      if (selectedParts[slot.id]) {
        watt += slot.wattageEstimate;
      }
    });
    return watt;
  }, [selectedParts]);

  const selectedCount = Object.keys(selectedParts).length;

  // Filter products for active slot picker modal
  const modalFilteredProducts = useMemo(() => {
    if (!activeSlot) return [];
    let list = initialProducts.filter((p) => p.category === activeSlot.category);

    if (modalSearch.trim()) {
      const q = modalSearch.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeSlot, initialProducts, modalSearch]);

  // WhatsApp Order Build
  const handleOrderPCWhatsApp = () => {
    const cleanPhone = (process.env.NEXT_PUBLIC_SHOP_WHATSAPP || SHOP_CONFIG.whatsapp).replace(/[^0-9]/g, "");

    let msg = `🖥️ *CUSTOM PC BUILD QUOTATION - ARISTO COMPUTER MEHERPUR*\n\n`;
    msg += `I have customized a desktop computer build on your website:\n\n`;

    SLOTS.forEach((slot) => {
      const part = selectedParts[slot.id];
      if (part) {
        msg += `• *${slot.name}:* ${part.name} - ${formatPrice(part.price)}\n`;
      }
    });

    msg += `\n*Total Estimated Wattage:* ~${estimatedWattage}W`;
    msg += `\n*Total PC Build Price:* *${formatPrice(totalPrice)}*\n\n`;
    msg += `Please verify availability and let me know the assembly and delivery details in Meherpur. Thank you!`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Add all selected PC parts to cart
  const handleAddAllToCart = () => {
    const parts = Object.values(selectedParts);
    if (parts.length === 0) return;

    parts.forEach((product) => {
      addToCart(product, 1);
    });
  };

  return (
    <div className="bg-slate-50 dark:bg-[#090d16] min-h-screen py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
              <span className="text-slate-400 dark:text-slate-600">/</span>
              <span className="text-slate-900 dark:text-slate-200 font-semibold">Custom PC Builder</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Assemble Your Dream Desktop PC
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Choose genuine processors, motherboards, GPUs, and components. Get live BDT pricing, power calculations, and free professional assembly in Meherpur.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {selectedCount > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Clear Build
              </button>
            )}

            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={() => setShowPrintQuote(true)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>Print Quote</span>
            </button>
          </div>
        </div>

        {/* Builder Status Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors">
          <div className="flex items-center gap-6 divide-x divide-slate-100 dark:divide-slate-800 flex-wrap">
            <div>
              <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">Estimated Total</span>
              <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <div className="pl-6">
              <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">Power Estimate</span>
              <span className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200 font-mono flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>~{estimatedWattage}W</span>
              </span>
            </div>

            <div className="pl-6">
              <span className="text-xs text-slate-400 dark:text-slate-500 block font-medium">Components</span>
              <span className="text-base font-bold text-slate-700 dark:text-slate-300">
                {selectedCount} of {SLOTS.length} selected
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={handleAddAllToCart}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 border border-blue-200 dark:border-blue-800/50"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={handleOrderPCWhatsApp}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order on WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Component Slots Grid */}
        <div className="space-y-3">
          {SLOTS.map((slot) => {
            const Icon = slot.icon;
            const selectedPart = selectedParts[slot.id];

            return (
              <div
                key={slot.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  selectedPart
                    ? "bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-700/60 shadow-xs"
                    : "bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Slot Icon & Title */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                        selectedPart
                          ? "bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                          : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {slot.name}
                        </h3>
                        {slot.required && !selectedPart && (
                          <span className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full font-semibold border border-amber-200 dark:border-amber-800/60">
                            Required
                          </span>
                        )}
                      </div>

                      {selectedPart ? (
                        <div className="mt-1 flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                            <Image
                              src={
                                selectedPart.images?.[0]?.url ||
                                "/images/products/placeholder.jpg"
                              }
                              alt={selectedPart.name}
                              fill
                              sizes="36px"
                              className="object-contain p-1"
                            />
                          </div>
                          <div className="truncate">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs truncate block">
                              {selectedPart.name}
                            </span>
                            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold uppercase">
                              {selectedPart.brand}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                          Click choose to pick compatible {slot.category.toLowerCase()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                    {selectedPart ? (
                      <>
                        <div className="text-right">
                          <span className="text-sm font-black font-mono text-slate-900 dark:text-white block">
                            {formatPrice(selectedPart.price)}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">In Stock</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActiveSlot(slot)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(slot.id)}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                            title="Remove component"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveSlot(slot)}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Choose</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Component Picker Modal */}
      {activeSlot && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Select {activeSlot.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Showing available {activeSlot.category} at Aristo Computer
                </p>
              </div>
              <button
                onClick={() => setActiveSlot(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${activeSlot.name.toLowerCase()}...`}
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            {/* Product Choices List */}
            <div className="space-y-2 overflow-y-auto flex-1 pr-1 divide-y divide-slate-100 dark:divide-slate-800">
              {modalFilteredProducts.length > 0 ? (
                modalFilteredProducts.map((p) => {
                  const img =
                    p.images?.[0]?.url ||
                    "/images/products/placeholder.jpg";

                  return (
                    <div
                      key={p.id}
                      className="pt-2 first:pt-0 flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                          <Image
                            src={img}
                            alt={p.name}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 block">
                            {p.brand}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {p.name}
                          </h4>
                          <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 block mt-0.5">
                            {formatPrice(p.price)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectProduct(activeSlot.id, p)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Select</span>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
                  No components found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Print / Quotation Preview Modal */}
      {showPrintQuote && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 transition-colors">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Logo variant="badge" size="md" />
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    ARISTO COMPUTER
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Hotel Bazar (Front of Shamoli Counter), Meherpur • Phone: {SHOP_CONFIG.phone}
                  </p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                    Custom PC Build Quotation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPrintQuote(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Itemized Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Component</th>
                    <th className="py-2.5 px-3">Selected Model</th>
                    <th className="py-2.5 px-3 text-right">Price (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {SLOTS.map((slot) => {
                    const part = selectedParts[slot.id];
                    if (!part) return null;
                    return (
                      <tr key={slot.id} className="text-slate-800 dark:text-slate-200">
                        <td className="py-2.5 px-3 font-bold text-slate-700 dark:text-slate-300">{slot.name}</td>
                        <td className="py-2.5 px-3">{part.name}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                          {formatPrice(part.price)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-sm font-bold border-t border-slate-200 dark:border-slate-800 pt-3 text-slate-900 dark:text-white">
              <span>Total Quotation Amount:</span>
              <span className="text-lg text-blue-600 dark:text-blue-400 font-mono font-black">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
