"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  LogOut,
  ExternalLink,
  Package,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  X,
  RefreshCw,
  Eye,
  AlertCircle,
  ClipboardList,
  Phone,
  MessageCircle,
  Settings,
  Clock,
  MapPin,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/ui/Logo";
import ProductForm from "@/components/admin/ProductForm";
import { Product, PRODUCT_CATEGORIES } from "@/types/product";
import { CustomerOrder, OrderStatus } from "@/types/order";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  clearAllProductsFromFirestore,
} from "@/services/productService";
import { getAllOrders, updateOrderStatus } from "@/services/orderService";
import { formatPrice, SHOP_CONFIG } from "@/lib/constants";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading, logout, isFirebaseActive } = useAuth();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "settings">("products");

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Orders state
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("All");

  // Search & Filter for products
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [stockFilter, setStockFilter] = useState<"all" | "inStock" | "outOfStock">("all");

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Seeding state
  const [isSeeding, setIsSeeding] = useState(false);

  // Authentication Guard
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push("/admin/login");
    }
  }, [isAdmin, authLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const showNotification = useCallback((type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  }, []);

  // Load products list
  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: unknown) {
      console.error("Failed to load products:", err);
      showNotification("error", "Failed to load products from database.");
    } finally {
      setLoadingProducts(false);
    }
  }, [showNotification]);

  // Load customer orders
  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err: unknown) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!isAdmin) return;
    let isMounted = true;

    getProducts()
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setLoadingProducts(false);
        }
      })
      .catch((err: unknown) => {
        console.error("Failed to load products:", err);
        if (isMounted) {
          showNotification("error", "Failed to load products from database.");
          setLoadingProducts(false);
        }
      });

    getAllOrders()
      .then((data) => {
        if (isMounted) setOrders(data);
      })
      .catch((err) => console.warn("Orders fetch err:", err));

    return () => {
      isMounted = false;
    };
  }, [isAdmin, showNotification]);

  // Stats computation
  const stats = useMemo(() => {
    const total = products.length;
    const inStock = products.filter((p) => p.inStock && p.stock > 0).length;
    const outOfStock = products.filter((p) => !p.inStock || p.stock <= 0).length;
    const featured = products.filter((p) => p.featured).length;
    return { total, inStock, outOfStock, featured };
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (stockFilter === "inStock") {
      result = result.filter((p) => p.inStock && p.stock > 0);
    } else if (stockFilter === "outOfStock") {
      result = result.filter((p) => !p.inStock || p.stock <= 0);
    }

    return result;
  }, [products, searchTerm, selectedCategory, stockFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderStatusFilter === "All") return orders;
    return orders.filter((o) => o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  // Handlers for Add / Edit
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsAddEditModalOpen(true);
  };

  const handleSaveProduct = async (
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    setIsSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        showNotification("success", `Product "${productData.name}" updated successfully!`);
      } else {
        await createProduct(productData);
        showNotification("success", `Product "${productData.name}" added successfully!`);
      }
      setIsAddEditModalOpen(false);
      setEditingProduct(null);
      await loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving product.";
      showNotification("error", msg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  // Handler for Delete
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      showNotification("success", `Product "${productToDelete.name}" deleted successfully.`);
      setProductToDelete(null);
      await loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete product.";
      showNotification("error", msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler for Clearing all products from Firestore
  const handleClearAllProducts = async () => {
    if (products.length === 0) {
      showNotification("error", "There are no products in the catalog to delete.");
      return;
    }
    if (
      !confirm(
        `Are you sure you want to delete ALL ${products.length} products from your Firestore database? This action cannot be undone.`
      )
    ) {
      return;
    }
    setIsSeeding(true);
    try {
      const count = await clearAllProductsFromFirestore();
      showNotification("success", `Removed ${count} products from Firestore. Your catalog is now clean.`);
      await loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to clear products.";
      showNotification("error", msg);
    } finally {
      setIsSeeding(false);
    }
  };

  // Handler for Order status update
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showNotification("success", `Order ${orderId} status set to ${newStatus}`);
      await loadOrders();
    } catch (err) {
      console.error("Order status update failed:", err);
      showNotification("error", "Failed to update order status");
    }
  };

  // Direct WhatsApp Customer message
  const handleMessageCustomer = (order: CustomerOrder) => {
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, "");
    const msg = `Hello ${order.customerName},\nThis is Aristo Computer Meherpur regarding your order ${order.id}.\nYour order status is currently: *${order.status}*.\nTotal Amount: ${formatPrice(order.totalAmount)}.\n\nThank you for choosing Aristo Computer!`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-300">
          <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-xs">Checking administrator session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#090d16] flex flex-col transition-colors">
      {/* Top Admin Header Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo variant="badge" size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">Aristo Admin Portal</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isFirebaseActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {isFirebaseActive ? "Firestore Connected" : "Local Mode"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in as: <span className="text-slate-200">{user?.email || "Admin"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Floating Notification */}
        {notification && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-center justify-between shadow-lg transition-all animate-bounce-subtle ${
              notification.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === "success" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Total Products</span>
              <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {stats.total}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Across 10 categories</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Customer Orders</span>
              <ClipboardList className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {orders.length}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Placed online</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Out of Stock</span>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {stats.outOfStock}
            </div>
            <div className="text-[11px] text-amber-700/80 dark:text-amber-400/80 mt-1">Needs reordering</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Featured Deals</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-500 font-mono">
              {stats.featured}
            </div>
            <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Homepage promotions</div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 bg-white dark:bg-slate-900 px-4 sm:px-6 pt-3 rounded-t-2xl border-t border-x dark:border-t-slate-800 dark:border-x-slate-800 transition-colors overflow-x-auto scrollbar-none whitespace-nowrap">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === "products"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <Package className="w-4 h-4 shrink-0" />
            <span>Products Inventory ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === "orders"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <ClipboardList className="w-4 h-4 shrink-0" />
            <span>Customer Orders ({orders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`pb-3 px-3 sm:px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === "settings"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-500"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Shop Configuration</span>
          </button>
        </div>

        {/* TAB 1: Products Inventory */}
        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Action & Filter Toolbar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    Product Inventory Management
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Manage products, update prices, upload gallery images, and adjust stock counts.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Clear All Products Button */}
                  {isFirebaseActive && products.length > 0 && (
                    <button
                      onClick={handleClearAllProducts}
                      disabled={isSeeding}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-colors cursor-pointer border border-rose-200 dark:border-rose-900/50"
                      title="Clear all products from Firestore"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>{isSeeding ? "Clearing..." : "Clear All Products"}</span>
                    </button>
                  )}

                  {/* Reload Button */}
                  <button
                    onClick={loadProducts}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    title="Refresh product list"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingProducts ? "animate-spin" : ""}`} />
                  </button>

                  {/* Add Product Button */}
                  <button
                    onClick={handleOpenAddModal}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* Search & Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                {/* Search Input */}
                <div className="sm:col-span-2 relative">
                  <input
                    type="text"
                    placeholder="Search products by title, brand, or model..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-750 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="All">All Categories</option>
                    {PRODUCT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock Filter */}
                <div>
                  <select
                    value={stockFilter}
                    onChange={(e) =>
                      setStockFilter(e.target.value as "all" | "inStock" | "outOfStock")
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500 font-medium"
                  >
                    <option value="all">All Stock Statuses</option>
                    <option value="inStock">In Stock Only</option>
                    <option value="outOfStock">Out of Stock Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
              {loadingProducts ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500 dark:text-slate-400">Loading products from Firestore...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price (BDT)</th>
                        <th className="py-3 px-4">Stock Status</th>
                        <th className="py-3 px-4">Featured</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredProducts.map((p) => {
                        const primaryImage =
                          p.images && p.images.length > 0
                            ? p.images[0].url
                            : "/images/products/placeholder.jpg";

                        return (
                          <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                            {/* Thumbnail & Title */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                                  <Image
                                    src={primaryImage}
                                    alt={p.name}
                                    fill
                                    sizes="48px"
                                    className="object-contain p-1"
                                  />
                                </div>
                                <div className="max-w-xs sm:max-w-sm">
                                  <Link
                                    href={`/products/${p.id}`}
                                    target="_blank"
                                    className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 block"
                                  >
                                    {p.name}
                                  </Link>
                                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                                    {p.brand}
                                  </span>
                                  <span className="text-[10px] text-slate-400 ml-2">
                                    ({p.images?.length || 0} images)
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-medium">
                              {p.category}
                            </td>

                            {/* Price */}
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-slate-900 dark:text-white">
                                {formatPrice(p.price)}
                              </span>
                              {p.originalPrice && p.originalPrice > p.price && (
                                <span className="block text-[10px] text-slate-400 line-through font-mono">
                                  {formatPrice(p.originalPrice)}
                                </span>
                              )}
                            </td>

                            {/* Stock */}
                            <td className="py-3 px-4">
                              {p.inStock && p.stock > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                                  <span>{p.stock} in stock</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                  <AlertTriangle className="w-3 h-3 text-rose-500" />
                                  <span>Out of stock</span>
                                </span>
                              )}
                            </td>

                            {/* Featured */}
                            <td className="py-3 px-4">
                              {p.featured ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                                  <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                  Featured
                                </span>
                              ) : (
                                <span className="text-slate-400 text-xs">—</span>
                              )}
                            </td>

                            {/* Action buttons */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/products/${p.id}`}
                                  target="_blank"
                                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                                  title="View product on storefront"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  onClick={() => handleOpenEditModal(p)}
                                  className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
                                  title="Edit product"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setProductToDelete(p)}
                                  className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                                  title="Delete product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
                    <Package className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                    No Products in Inventory
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Your product catalog is empty. Click &quot;Add Product&quot; to publish your first genuine computer hardware item to Firestore.
                  </p>
                  <div>
                    <button
                      onClick={handleOpenAddModal}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Product</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Customer Orders */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  Customer Orders Management
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage incoming orders, update status, and communicate directly with customers.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-hidden focus:border-blue-500"
                >
                  <option value="All">All Order Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <button
                  onClick={loadOrders}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                  title="Refresh orders"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingOrders ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors">
              {orders.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <ClipboardList className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Orders Yet</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    When customers place orders via the website cart or checkout, they will appear here.
                  </p>
                </div>
              ) : filteredOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Order ID</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Items Ordered</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Order Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">
                              {order.id}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {order.customerName}
                            </span>
                            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300 block">
                              {order.customerPhone}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5">
                              {order.upazila} • {order.deliveryAddress}
                            </span>
                          </td>

                          <td className="py-3 px-4 max-w-xs">
                            <div className="space-y-1">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="truncate text-[11px] text-slate-700 dark:text-slate-300">
                                  <span className="font-semibold">{it.quantity}x</span> {it.productName}
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-slate-900 dark:text-white block text-sm">
                              {formatPrice(order.totalAmount)}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                              {order.paymentMethod}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateStatus(order.id, e.target.value as OrderStatus)
                              }
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${
                                order.status === "Pending"
                                  ? "bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                  : order.status === "Confirmed"
                                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                  : order.status === "Shipped"
                                  ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                                  : order.status === "Delivered"
                                  ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                  : "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleMessageCustomer(order)}
                                className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                                title="WhatsApp Customer"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={`tel:${order.customerPhone}`}
                                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                                title="Call Customer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
                  No orders matching status filter &ldquo;{orderStatusFilter}&rdquo;
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Store Configuration */}
        {activeTab === "settings" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Store Information & Configuration</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Physical Address</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{SHOP_CONFIG.address}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Business Hours</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{SHOP_CONFIG.openingHours}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Helpline Number</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-mono">{SHOP_CONFIG.phone}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                  <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>WhatsApp Business</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-mono">{SHOP_CONFIG.whatsapp}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-800 dark:text-blue-300 space-y-1">
              <span className="font-bold block">How to Update Contact Numbers & Firebase Keys:</span>
              <p>
                Update the values in <code className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-700 font-mono text-[11px]">.env.local</code> and restart the development server.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  {editingProduct ? "Edit Product Details" : "Add New Hardware Product"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {editingProduct
                    ? "Update hardware specs, pricing, and photo gallery"
                    : "Fill in product specifications and upload up to 8 images"}
                </p>
              </div>
              <button
                onClick={() => {
                  if (!isSaving) {
                    setIsAddEditModalOpen(false);
                    setEditingProduct(null);
                  }
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ProductForm
              initialProduct={editingProduct}
              onSubmit={handleSaveProduct}
              onCancel={() => {
                setIsAddEditModalOpen(false);
                setEditingProduct(null);
              }}
              isSaving={isSaving}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Delete Product?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete:
                <br />
                <span className="font-semibold text-slate-900 dark:text-white">
                  &ldquo;{productToDelete.name}&rdquo;
                </span>
                ?
              </p>
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium pt-1">
                This action will delete the Firestore document and remove all associated images from Firebase Cloud Storage.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
