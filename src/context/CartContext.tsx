"use client";

import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from "react";
import { Product } from "@/types/product";
import { CartItem } from "@/types/order";

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Wishlist
  wishlist: Product[];
  wishlistCount: number;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;

  // Toast
  toast: { message: string; type: "success" | "info" | "warning" } | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  cartCount: 0,
  subtotal: 0,
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  wishlist: [],
  wishlistCount: 0,
  toggleWishlist: () => {},
  isInWishlist: () => false,
  compareList: [],
  addToCompare: () => {},
  removeFromCompare: () => {},
  isInCompare: () => false,
  clearCompare: () => {},
  toast: null,
  dismissToast: () => {},
});

const CART_STORAGE_KEY = "aristo_cart";
const WISHLIST_STORAGE_KEY = "aristo_wishlist";
const COMPARE_STORAGE_KEY = "aristo_compare";

const emptySubscribe = () => () => {};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(CART_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [compareList, setCompareList] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(COMPARE_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info" | "warning";
  } | null>(null);

  // Sync cart to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch {}
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
      } catch {}
    }
  }, [wishlist]);

  // Sync compareList to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareList));
      } catch {}
    }
  }, [compareList]);

  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const dismissToast = () => setToast(null);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name.slice(0, 32)}..." to cart!`, "success");
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast("Item removed from cart", "info");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = isMounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Wishlist operations
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed from saved wishlist`, "info");
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`Saved to your wishlist!`, "success");
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    if (!isMounted) return false;
    return wishlist.some((p) => p.id === productId);
  };

  const wishlistCount = isMounted ? wishlist.length : 0;

  // Compare operations
  const addToCompare = (product: Product) => {
    if (compareList.some((p) => p.id === product.id)) {
      showToast("Product is already in comparison table", "info");
      return;
    }
    if (compareList.length >= 4) {
      showToast("You can compare up to 4 products at a time", "warning");
      return;
    }
    setCompareList((prev) => [...prev, product]);
    showToast(`Added "${product.name.slice(0, 24)}..." to compare list!`, "success");
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const isInCompare = (productId: string) => {
    if (!isMounted) return false;
    return compareList.some((p) => p.id === productId);
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        wishlistCount,
        toggleWishlist,
        isInWishlist,
        compareList: isMounted ? compareList : [],
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        toast,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
