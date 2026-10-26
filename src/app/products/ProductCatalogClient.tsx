"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  PackageX,
  MessageCircle,
} from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { Product, PRODUCT_CATEGORIES } from "@/types/product";
import { getProducts } from "@/services/productService";
import { SHOP_CONFIG } from "@/lib/constants";

export default function ProductCatalogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search & Filter state
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "All";
  const initialFeatured = searchParams.get("featured") === "true";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(initialFeatured);
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "name-asc">("newest");

  // Mobile filter drawer toggle
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Fetch all products
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await getProducts();
        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error loading catalog:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Extract available brands
  const availableBrands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand && p.brand.trim()) brandSet.add(p.brand.trim());
    });
    return Array.from(brandSet).sort();
  }, [products]);

  // Filter & Sort computation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const tokens = search.toLowerCase().trim().split(/\s+/);
      result = result.filter((p) => {
        const full = `${p.name} ${p.brand} ${p.category} ${p.description}`.toLowerCase();
        return tokens.every((t) => full.includes(t));
      });
    }

    // Category
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Brand
    if (selectedBrand && selectedBrand !== "All") {
      result = result.filter(
        (p) => p.brand.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Price
    const minVal = parseFloat(minPrice);
    if (!isNaN(minVal)) {
      result = result.filter((p) => p.price >= minVal);
    }
    const maxVal = parseFloat(maxPrice);
    if (!isNaN(maxVal)) {
      result = result.filter((p) => p.price <= maxVal);
    }

    // In Stock
    if (inStockOnly) {
      result = result.filter((p) => p.inStock && p.stock > 0);
    }

    // Featured
    if (featuredOnly) {
      result = result.filter((p) => Boolean(p.featured));
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
    }

    return result;
  }, [
    products,
    search,
    selectedCategory,
    selectedBrand,
    minPrice,
    maxPrice,
    inStockOnly,
    featuredOnly,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedBrand("All");
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setFeaturedOnly(false);
    setSortBy("newest");
    router.push("/products");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedBrand !== "All" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    inStockOnly ||
    featuredOnly;

  return (
    <div className="bg-slate-50 dark:bg-[#090d16] min-h-screen py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Home</span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">Products</span>
            {selectedCategory !== "All" && (
              <>
                <span>/</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{selectedCategory}</span>
              </>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Computer Hardware & Components
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} available at Aristo Computer Meherpur
              </p>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Filters & Sort</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-600" />
              )}
            </button>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Filter Hardware
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
              </div>

              {/* Search Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search model, brand..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Category
                </label>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("All")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory === "All"
                        ? "bg-blue-600 text-white font-semibold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>All Categories</span>
                    <span>{products.length}</span>
                  </button>
                  {PRODUCT_CATEGORIES.map((cat) => {
                    const count = products.filter((p) => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-blue-600 text-white font-semibold"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className="truncate">{cat}</span>
                        <span className="text-[11px] opacity-80">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brand Filter */}
              {availableBrands.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Brand
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="All">All Brands</option>
                    {availableBrands.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Range Filter */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Price Range (BDT)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min ৳"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max ৳"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Availability & Offers */}
              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                  />
                  <span>In Stock Only</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded border-slate-300 dark:border-slate-600 focus:ring-amber-500"
                  />
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Featured Items Only</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Listing Main Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort & Quick Filter Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
              {/* Active Filter Tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {selectedCategory !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium">
                    <span>{selectedCategory}</span>
                    <button
                      onClick={() => setSelectedCategory("All")}
                      className="hover:text-blue-900 dark:hover:text-blue-100 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand !== "All" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-medium">
                    <span>Brand: {selectedBrand}</span>
                    <button
                      onClick={() => setSelectedBrand("All")}
                      className="hover:text-blue-900 dark:hover:text-blue-100 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
                    <span>In Stock</span>
                    <button
                      onClick={() => setInStockOnly(false)}
                      className="hover:text-emerald-900 dark:hover:text-emerald-100 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {featuredOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
                    <span>Featured</span>
                    <button
                      onClick={() => setFeaturedOnly(false)}
                      className="hover:text-amber-900 dark:hover:text-amber-100 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline ml-1 cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "newest" | "price-asc" | "price-desc" | "name-asc"
                    )
                  }
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 focus:outline-hidden focus:border-blue-500 font-medium"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse"
                  >
                    <div className="aspect-4/3 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                  <PackageX className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                  {products.length === 0 ? "New Products Arriving Soon" : "No Matching Products Found"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                  {products.length === 0
                    ? "Our store catalog is currently being updated with genuine computer hardware. Contact our Meherpur shop directly for immediate stock availability and prices."
                    : "We couldn't find any products matching your current filters. Try searching for different keywords or resetting filters."}
                </p>
                {products.length === 0 ? (
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                    <a
                      href={`https://wa.me/${SHOP_CONFIG.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Inquire via WhatsApp</span>
                    </a>
                  </div>
                ) : (
                  <button
                    onClick={handleResetFilters}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white dark:bg-slate-900 h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between shadow-2xl border-l border-slate-200 dark:border-slate-800">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white text-base">Filter Products</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                >
                  <option value="All">All Categories</option>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Brand */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                >
                  <option value="All">All Brands</option>
                  {availableBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Price Range (BDT)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min ৳"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Max ৳"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span>In Stock Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span>Featured Items Only</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs cursor-pointer"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
