import React, { Suspense } from "react";
import ProductCatalogClient from "./ProductCatalogClient";

export const metadata = {
  title: "Products Catalog | Aristo Computer Meherpur",
  description:
    "Browse our full range of laptops, custom desktop PCs, processors, graphics cards, motherboards, RAM, SSDs, and peripherals in Meherpur.",
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading hardware catalog...</p>
          </div>
        </div>
      }
    >
      <ProductCatalogClient />
    </Suspense>
  );
}
