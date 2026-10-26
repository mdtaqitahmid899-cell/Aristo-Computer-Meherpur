import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/config";
import { Product, ProductFilterOptions, AdminStats } from "@/types/product";
import { deleteProductImagesFromStorage } from "./storageService";

const PRODUCTS_COLLECTION = "products";
const PRODUCTS_CACHE_KEY = "aristo_products_cache";

function loadLocalCache(): Product[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PRODUCTS_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCache(prods: Product[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(prods));
  } catch {}
}

// Local in-memory cache for fast UI updates
let localProducts: Product[] = [];

export async function getProducts(options: ProductFilterOptions = {}): Promise<Product[]> {
  let products: Product[] = [];

  if (isFirebaseConfigured() && db) {
    try {
      const colRef = collection(db, PRODUCTS_COLLECTION);
      let q = query(colRef);

      // Category filter query if specified
      if (options.category && options.category !== "All") {
        q = query(colRef, where("category", "==", options.category));
      }

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        products = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Product[];
        localProducts = [...products];
        saveLocalCache(localProducts);
      } else {
        const cached = loadLocalCache();
        products = cached.length > 0 ? [...cached] : [];
        localProducts = [...products];
      }
    } catch (error) {
      console.warn("Firestore getProducts error, falling back to local cache:", error);
      if (localProducts.length === 0) {
        localProducts = loadLocalCache();
      }
      products = [...localProducts];
    }
  } else {
    if (localProducts.length === 0) {
      localProducts = loadLocalCache();
    }
    products = [...localProducts];
  }

  // Apply filters
  if (options.category && options.category !== "All") {
    products = products.filter((p) => p.category === options.category);
  }

  if (options.brand && options.brand !== "All") {
    products = products.filter(
      (p) => p.brand.toLowerCase() === options.brand!.toLowerCase()
    );
  }

  if (options.search && options.search.trim()) {
    const searchTerms = options.search.toLowerCase().trim().split(/\s+/);
    products = products.filter((p) => {
      const targetText = `${p.name} ${p.brand} ${p.category} ${p.description}`.toLowerCase();
      return searchTerms.every((term) => targetText.includes(term));
    });
  }

  if (typeof options.minPrice === "number" && !isNaN(options.minPrice)) {
    products = products.filter((p) => p.price >= options.minPrice!);
  }

  if (typeof options.maxPrice === "number" && !isNaN(options.maxPrice)) {
    products = products.filter((p) => p.price <= options.maxPrice!);
  }

  if (options.inStockOnly) {
    products = products.filter((p) => p.inStock && p.stock > 0);
  }

  if (options.featuredOnly) {
    products = products.filter((p) => p.featured);
  }

  // Sorting
  switch (options.sortBy) {
    case "price-asc":
      products.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      products.sort((a, b) => b.price - a.price);
      break;
    case "name-asc":
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "newest":
    default:
      products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      break;
  }

  return products;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Product;
      }
    } catch (err) {
      console.warn(`Firestore getProductById(${id}) error:`, err);
    }
  }

  // Fallback to local
  const found = localProducts.find((p) => p.id === id);
  return found || null;
}

export async function createProduct(
  productData: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product> {
  const newId = `aristo-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const now = Date.now();

  const newProduct: Product = {
    ...productData,
    id: newId,
    inStock: productData.stock > 0,
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, newId);
      await setDoc(docRef, newProduct);
    } catch (err: unknown) {
      console.warn("Firestore setDoc warning in createProduct:", err);
      if (err instanceof Error && err.message.toLowerCase().includes("longer than")) {
        try {
          const sanitizedImages = newProduct.images.map((img) => {
            if (img.url && img.url.length > 500000) {
              return { ...img, url: "/images/products/placeholder.jpg" };
            }
            return img;
          });
          const sanitizedProduct: Product = { ...newProduct, images: sanitizedImages };
          const docRef = doc(db, PRODUCTS_COLLECTION, newId);
          await setDoc(docRef, sanitizedProduct);
        } catch (innerErr) {
          console.error("Fallback setDoc error:", innerErr);
        }
      } else {
        console.error("Firestore createProduct failed, saving to local cache:", err);
      }
    }
  }

  localProducts = [newProduct, ...localProducts.filter((p) => p.id !== newId)];
  saveLocalCache(localProducts);
  return newProduct;
}

export async function updateProduct(
  id: string,
  productData: Partial<Product>
): Promise<Product> {
  const now = Date.now();
  const updatedData: Partial<Product> = {
    ...productData,
    updatedAt: now,
  };

  if (typeof updatedData.stock === "number") {
    updatedData.inStock = updatedData.stock > 0;
  }

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await setDoc(docRef, updatedData, { merge: true });
    } catch (err: unknown) {
      console.warn("Firestore updateProduct warning:", err);
      if (err instanceof Error && err.message.toLowerCase().includes("longer than")) {
        try {
          const sanitizedImages = (updatedData.images || []).map((img) => {
            if (img.url && img.url.length > 500000) {
              return { ...img, url: "/images/products/placeholder.jpg" };
            }
            return img;
          });
          const sanitizedData = { ...updatedData, images: sanitizedImages };
          const docRef = doc(db, PRODUCTS_COLLECTION, id);
          await setDoc(docRef, sanitizedData, { merge: true });
        } catch (innerErr) {
          console.error("Fallback updateDoc error:", innerErr);
        }
      }
    }
  }

  const idx = localProducts.findIndex((p) => p.id === id);
  if (idx !== -1) {
    localProducts[idx] = { ...localProducts[idx], ...updatedData };
    saveLocalCache(localProducts);
    return localProducts[idx];
  }

  const fullProduct = (await getProductById(id)) || ({} as Product);
  const merged = { ...fullProduct, ...updatedData };
  localProducts.unshift(merged);
  saveLocalCache(localProducts);
  return merged;
}

export async function deleteProduct(id: string): Promise<void> {
  const targetProduct = await getProductById(id);

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn("Firestore deleteDoc error:", err);
    }
  }

  // Safely delete associated storage images if any
  if (targetProduct && targetProduct.images && targetProduct.images.length > 0) {
    const imagePaths = targetProduct.images
      .map((img) => img.path)
      .filter((p): p is string => Boolean(p));
    if (imagePaths.length > 0) {
      try {
        await deleteProductImagesFromStorage(imagePaths);
      } catch (err) {
        console.warn("Storage deletion error:", err);
      }
    }
  }

  localProducts = localProducts.filter((p) => p.id !== id);
  saveLocalCache(localProducts);
}

export async function clearAllProductsFromFirestore(): Promise<number> {
  if (!isFirebaseConfigured() || !db) {
    localProducts = [];
    saveLocalCache([]);
    return 0;
  }

  const colRef = collection(db, PRODUCTS_COLLECTION);
  const snapshot = await getDocs(colRef);
  let count = 0;

  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
    count++;
  }

  localProducts = [];
  saveLocalCache([]);
  return count;
}

export async function getAdminStats(): Promise<AdminStats> {
  const all = await getProducts();
  const totalProducts = all.length;
  const inStockCount = all.filter((p) => p.inStock && p.stock > 0).length;
  const outOfStockCount = all.filter((p) => !p.inStock || p.stock <= 0).length;
  const featuredCount = all.filter((p) => p.featured).length;

  const categories = new Set(all.map((p) => p.category));

  return {
    totalProducts,
    inStockCount,
    outOfStockCount,
    featuredCount,
    totalCategories: categories.size,
  };
}
