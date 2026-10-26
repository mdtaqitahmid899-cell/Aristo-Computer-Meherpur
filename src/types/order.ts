import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

export type PaymentMethod = "Cash on Delivery" | "bKash / Nagad" | "Bank Transfer" | "Store Pickup";

export interface CustomerOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  upazila: "Meherpur Sadar" | "Gangni" | "Mujibnagar" | "Store Pickup";
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  items: Array<{
    productId: string;
    productName: string;
    productBrand: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
  subtotal: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  createdAt: number;
}
