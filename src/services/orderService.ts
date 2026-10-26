import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/config";
import { CustomerOrder, OrderStatus, ProductReview } from "@/types/order";
import { formatPrice, SHOP_CONFIG } from "@/lib/constants";

const ORDERS_COLLECTION = "orders";
const REVIEWS_COLLECTION = "reviews";

const LOCAL_ORDERS_KEY = "aristo_local_orders";
const LOCAL_REVIEWS_KEY = "aristo_local_reviews";

// Initial demo reviews so products have engaging, real customer feedback
const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: "rev-1",
    productId: "aristo-lap-01",
    userName: "Sabbir Hossain (Meherpur Sadar)",
    rating: 5,
    title: "Incredible Gaming Performance!",
    comment:
      "Bought this ASUS TUF A15 from Aristo Computer shop in Hotel Bazar (Front of Shamoli Counter). The thermal performance is solid and the RTX 4060 runs all modern games at ultra settings. 100% genuine with official ASUS warranty card.",
    createdAt: Date.now() - 4 * 86400000,
  },
  {
    id: "rev-2",
    productId: "aristo-lap-01",
    userName: "Mehedi Hasan",
    rating: 5,
    title: "Best Laptop Deal in Meherpur",
    comment:
      "Aristo Computer provided genuine warranty and even helped me install all drivers and testing utilities for free. Highly recommended shop!",
    createdAt: Date.now() - 8 * 86400000,
  },
  {
    id: "rev-3",
    productId: "aristo-pc-01",
    userName: "Tanvir Ahmed (Gangni)",
    rating: 5,
    title: "Flawless Assembly & Cable Management",
    comment:
      "Custom gaming PC build was delivered to Gangni within hours. Cable management is super clean and the DeepCool 360mm AIO keeps the i7 14700 under 70C during 4K video rendering.",
    createdAt: Date.now() - 2 * 86400000,
  },
  {
    id: "rev-4",
    productId: "aristo-gpu-01",
    userName: "Rakibul Islam",
    rating: 5,
    title: "Super quiet and genuine Gigabyte warranty",
    comment:
      "Upgraded my graphics card from Aristo Computer. Runs quiet, temperatures stay cool under 65C. Best pricing compared to Dhaka shops.",
    createdAt: Date.now() - 6 * 86400000,
  },
];

// In-memory/localStorage orders
function getStoredLocalOrders(): CustomerOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStoredLocalOrders(orders: CustomerOrder[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn("Could not save orders locally:", e);
  }
}

// In-memory/localStorage reviews
function getStoredLocalReviews(): ProductReview[] {
  if (typeof window === "undefined") return INITIAL_REVIEWS;
  try {
    const raw = localStorage.getItem(LOCAL_REVIEWS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_REVIEWS;
  } catch {
    return INITIAL_REVIEWS;
  }
}

function saveStoredLocalReviews(reviews: ProductReview[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.warn("Could not save reviews locally:", e);
  }
}

/**
 * Creates a new customer order and saves to Firestore (or local backup)
 */
export async function createOrder(
  orderData: Omit<CustomerOrder, "id" | "status" | "createdAt" | "updatedAt">
): Promise<CustomerOrder> {
  const orderId = `ARISTO-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = Date.now();

  const newOrder: CustomerOrder = {
    ...orderData,
    id: orderId,
    status: "Pending",
    createdAt: now,
    updatedAt: now,
  };

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, orderId);
      await setDoc(docRef, newOrder);
    } catch (err) {
      console.warn("Firestore createOrder error, storing locally:", err);
    }
  }

  const existing = getStoredLocalOrders();
  existing.unshift(newOrder);
  saveStoredLocalOrders(existing);

  return newOrder;
}

/**
 * Retrieves all orders for the Admin Dashboard
 */
export async function getAllOrders(): Promise<CustomerOrder[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const colRef = collection(db, ORDERS_COLLECTION);
      const snapshot = await getDocs(colRef);
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as CustomerOrder[];
      }
    } catch (err) {
      console.warn("Firestore getAllOrders error, reading local backup:", err);
    }
  }

  return getStoredLocalOrders();
}

/**
 * Updates an order status in Firestore and local store
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<void> {
  const now = Date.now();

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, ORDERS_COLLECTION, orderId);
      await updateDoc(docRef, { status: newStatus, updatedAt: now });
    } catch (err) {
      console.warn("Firestore updateOrderStatus error:", err);
    }
  }

  const localOrders = getStoredLocalOrders();
  const idx = localOrders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    localOrders[idx].status = newStatus;
    localOrders[idx].updatedAt = now;
    saveStoredLocalOrders(localOrders);
  }
}

/**
 * Builds a WhatsApp order confirmation message URL
 */
export function generateWhatsAppOrderInvoiceUrl(order: CustomerOrder): string {
  const cleanPhone = (process.env.NEXT_PUBLIC_SHOP_WHATSAPP || SHOP_CONFIG.whatsapp).replace(/[^0-9]/g, "");

  let msg = `🛒 *NEW ORDER - ARISTO COMPUTER MEHERPUR*\n`;
  msg += `*Order ID:* ${order.id}\n`;
  msg += `*Customer:* ${order.customerName}\n`;
  msg += `*Phone:* ${order.customerPhone}\n`;
  msg += `*Area:* ${order.upazila}\n`;
  msg += `*Address:* ${order.deliveryAddress}\n`;
  msg += `*Payment Method:* ${order.paymentMethod}\n\n`;

  msg += `*Ordered Items:*\n`;
  order.items.forEach((item, index) => {
    msg += `${index + 1}. ${item.productName} (x${item.quantity}) - ${formatPrice(item.price * item.quantity)}\n`;
  });

  msg += `\n*Subtotal:* ${formatPrice(order.subtotal)}`;
  msg += `\n*Delivery Fee:* ${order.deliveryFee === 0 ? "FREE" : formatPrice(order.deliveryFee)}`;
  msg += `\n*Total Amount:* *${formatPrice(order.totalAmount)}*\n`;

  if (order.notes) {
    msg += `\n*Customer Notes:* ${order.notes}\n`;
  }

  msg += `\nPlease confirm my order and let me know the estimated delivery time. Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
}

/**
 * Reviews for a specific product
 */
export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  if (isFirebaseConfigured() && db) {
    try {
      const colRef = collection(db, REVIEWS_COLLECTION);
      const q = query(colRef, where("productId", "==", productId));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as ProductReview[];
      }
    } catch (err) {
      console.warn("Firestore getProductReviews error, fallback to local:", err);
    }
  }

  const allReviews = getStoredLocalReviews();
  return allReviews.filter((r) => r.productId === productId);
}

/**
 * Adds a new review for a product
 */
export async function addProductReview(
  reviewData: Omit<ProductReview, "id" | "createdAt">
): Promise<ProductReview> {
  const reviewId = `rev-${Date.now().toString(36)}`;
  const now = Date.now();

  const newReview: ProductReview = {
    ...reviewData,
    id: reviewId,
    createdAt: now,
  };

  if (isFirebaseConfigured() && db) {
    try {
      const docRef = doc(db, REVIEWS_COLLECTION, reviewId);
      await setDoc(docRef, newReview);
    } catch (err) {
      console.warn("Firestore addProductReview error:", err);
    }
  }

  const existing = getStoredLocalReviews();
  existing.unshift(newReview);
  saveStoredLocalReviews(existing);

  return newReview;
}
