"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { ProductImage } from "@/types/product";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const fallbackImage = "/images/products/placeholder.jpg";

  const safeImages = images && images.length > 0 ? images : [{ url: fallbackImage, path: "" }];

  const currentImage = safeImages[selectedIndex] || safeImages[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display Box */}
      <div className="relative aspect-4/3 sm:aspect-square w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs flex items-center justify-center p-6 group">
        <Image
          src={currentImage.url}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-contain transition-transform duration-300 p-4 ${
            isZoomed ? "scale-125 cursor-zoom-out" : "group-hover:scale-105 cursor-zoom-in"
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
          priority
        />

        {/* Prev & Next Controls */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 cursor-pointer"
              aria-label="Previous product image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-md flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-110 cursor-pointer"
              aria-label="Next product image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Zoom Hint Icon */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute bottom-3 right-3 p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-xs text-xs flex items-center gap-1 cursor-pointer"
          title="Toggle Zoom"
        >
          <ZoomIn className="w-4 h-4" />
          <span className="text-[11px] font-medium hidden sm:inline">
            {isZoomed ? "Reset" : "Zoom"}
          </span>
        </button>

        {/* Image Counter */}
        {safeImages.length > 1 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 dark:bg-slate-800/90 text-white text-xs font-mono">
            {selectedIndex + 1} / {safeImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedIndex(idx);
                setIsZoomed(false);
              }}
              className={`relative w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-white dark:bg-slate-900 border-2 overflow-hidden p-1 transition-all cursor-pointer ${
                selectedIndex === idx
                  ? "border-blue-600 ring-2 ring-blue-100 dark:ring-blue-900/50 shadow-sm"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
