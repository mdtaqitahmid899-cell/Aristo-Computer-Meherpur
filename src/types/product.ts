export interface ProductSpecification {
  key: string;
  value: string;
}

export interface ProductImage {
  url: string;
  path?: string; // Firebase Storage path for deletion/management
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stock: number;
  inStock: boolean;
  description: string;
  specifications: ProductSpecification[];
  images: ProductImage[];
  featured: boolean;
  createdAt: number;
  updatedAt: number;
}

export type ProductCategory =
  | "Laptops"
  | "Desktop Computers"
  | "Processors"
  | "Motherboards"
  | "RAM"
  | "SSD and HDD"
  | "Graphics Cards"
  | "Monitors"
  | "Keyboards and Mice"
  | "Accessories";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "Laptops",
  "Desktop Computers",
  "Processors",
  "Motherboards",
  "RAM",
  "SSD and HDD",
  "Graphics Cards",
  "Monitors",
  "Keyboards and Mice",
  "Accessories",
];

export const CATEGORY_DEFAULT_IMAGE_MAP: Record<ProductCategory, string> = {
  "Laptops": "/images/categories/laptops.jpg",
  "Desktop Computers": "/images/categories/desktop-computers.jpg",
  "Processors": "/images/categories/processors.jpg",
  "Motherboards": "/images/categories/motherboards.jpg",
  "RAM": "/images/categories/ram.jpg",
  "SSD and HDD": "/images/categories/ssd-and-hdd.png",
  "Graphics Cards": "/images/categories/graphics-cards.png",
  "Monitors": "/images/categories/monitors.jpg",
  "Keyboards and Mice": "/images/categories/keyboards-and-mice.jpg",
  "Accessories": "/images/categories/accessories.jpg",
};

export interface ProductFilterOptions {
  category?: ProductCategory | "All";
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  featuredOnly?: boolean;
  sortBy?: "newest" | "price-asc" | "price-desc" | "name-asc";
}

export interface AdminStats {
  totalProducts: number;
  inStockCount: number;
  outOfStockCount: number;
  featuredCount: number;
  totalCategories: number;
}
