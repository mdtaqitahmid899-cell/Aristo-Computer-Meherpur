import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Grid } from "lucide-react";
import { CATEGORY_DETAILS } from "@/lib/constants";

export default function CategorySection() {
  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-slate-50 dark:bg-[#090d16] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              <Grid className="w-4 h-4" />
              <span>Hardware Catalog</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              From flagship laptops to individual PC components, find genuine hardware backed by official brand warranty.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group self-start md:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
          {CATEGORY_DETAILS.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 p-2.5 sm:p-4 shadow-2xs hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all duration-300 flex flex-col overflow-hidden text-center items-center cursor-pointer"
            >
              {/* Category Image */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800/80 mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300 border border-slate-100 dark:border-slate-800">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-contain p-2"
                />
                <div className="absolute inset-0 bg-blue-900/5 dark:bg-slate-950/20 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Title & Short Description */}
              <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-xs sm:text-sm line-clamp-1 mb-1">
                {cat.name}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {cat.description}
              </p>

              {/* Action hint */}
              <div className="mt-2 sm:mt-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
                <span>Browse</span>
                <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
