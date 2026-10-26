import { ProductCategory, PRODUCT_CATEGORIES } from "@/types/product";

export { PRODUCT_CATEGORIES };

export const SHOP_CONFIG = {
  name: "Aristo Computer",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://aristocomputer.com",
  tagline: "Your Trusted Technology Partner in Meherpur",
  servicesText:
    "Laptop, Desktop Sales & Service, Network & Softwore Solution. DSLR,CCtv & IP Camara IPS, UPS, AC, Printer, Toner, Cartridge Projector & Photocopy Machine Saller",
  servicesList: [
    "Laptop & Desktop Sales & Service",
    "Network & Software Solution",
    "DSLR, CCTV & IP Camera",
    "IPS, UPS & AC",
    "Printer, Toner & Cartridge",
    "Projector & Photocopy Machine Seller",
  ],
  description:
    "Leading computer shop in Meherpur providing genuine laptops, custom desktop PCs, processors, graphics cards, components, and accessories with official warranty and expert support.",
  address: "Hotel Bazar (Front of Shamoli Counter), Meherpur - 7100, Bangladesh",
  addressBn: "হোটেল বাজার (শ্যামলী কাউন্টারের সামনে), মেহেরপুর - ৭১০০, বাংলাদেশ",
  locationShort: "Hotel Bazar (Front of Shamoli Counter), Meherpur",
  locationShortBn: "হোটেল বাজার (শ্যামলী কাউন্টারের সামনে), মেহেরপুর",
  phone: process.env.NEXT_PUBLIC_SHOP_PHONE || "01712556234",
  whatsapp: process.env.NEXT_PUBLIC_SHOP_WHATSAPP || "+8801712556234",
  email: "aristocomputermeherpur@gamil.com",
  openingHours: "Saturday – Thursday: 9:30 AM – 9:00 PM (Friday Closed)",
  openingHoursBn: "শনিবার – বৃহস্পতিবার: সকাল ৯:৩০ – রাত ৯:০০ (শুক্রবার বন্ধ)",
  googleMapsUrl: "https://maps.google.com/?q=Hotel+Bazar+Meherpur+Bangladesh",
  currencySymbol: "৳",
  currencyCode: "BDT",
};

export const CATEGORY_DETAILS: Array<{
  name: ProductCategory;
  slug: string;
  description: string;
  iconName: string;
  imageUrl: string;
}> = [
  {
    name: "Laptops",
    slug: "laptops",
    description: "Gaming, ultrabooks, student & business laptops with official warranty",
    iconName: "Laptop",
    imageUrl: "/images/categories/laptops.jpg",
  },
  {
    name: "Desktop Computers",
    slug: "desktop-computers",
    description: "Custom gaming rigs, workstation setups, and office desktop PCs",
    iconName: "Monitor",
    imageUrl: "/images/categories/desktop-computers.jpg",
  },
  {
    name: "Processors",
    slug: "processors",
    description: "Latest Intel Core & AMD Ryzen processors for high-performance computing",
    iconName: "Cpu",
    imageUrl: "/images/categories/processors.jpg",
  },
  {
    name: "Motherboards",
    slug: "motherboards",
    description: "Intel & AMD compatible motherboards with advanced power design",
    iconName: "CircuitBoard",
    imageUrl: "/images/categories/motherboards.jpg",
  },
  {
    name: "RAM",
    slug: "ram",
    description: "High-speed DDR4 & DDR5 desktop and laptop memory modules",
    iconName: "MemoryStick",
    imageUrl: "/images/categories/ram.jpg",
  },
  {
    name: "SSD and HDD",
    slug: "ssd-and-hdd",
    description: "Ultra-fast NVMe M.2 SSDs, SATA drives, and high-capacity hard disks",
    iconName: "HardDrive",
    imageUrl: "/images/categories/ssd-and-hdd.png",
  },
  {
    name: "Graphics Cards",
    slug: "graphics-cards",
    description: "NVIDIA RTX & AMD Radeon GPUs for gaming, rendering, and AI",
    iconName: "Layers",
    imageUrl: "/images/categories/graphics-cards.png",
  },
  {
    name: "Monitors",
    slug: "monitors",
    description: "IPS, 144Hz-240Hz gaming monitors, curved displays, and 4K screens",
    iconName: "Tv",
    imageUrl: "/images/categories/monitors.jpg",
  },
  {
    name: "Keyboards and Mice",
    slug: "keyboards-and-mice",
    description: "Mechanical RGB keyboards, ergonomic mice, and combo peripherals",
    iconName: "Keyboard",
    imageUrl: "/images/categories/keyboards-and-mice.jpg",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Power supplies, PC cases, coolers, headsets, cables, and webcams",
    iconName: "Headphones",
    imageUrl: "/images/categories/accessories.jpg",
  },
];

export function formatPrice(amount: number): string {
  if (typeof amount !== "number" || isNaN(amount)) return "৳0";
  return `৳${amount.toLocaleString("en-BD")}`;
}

export function generateWhatsAppOrderUrl(productName: string, price: number, productUrlOrPath?: string): string {
  const cleanPhone = (process.env.NEXT_PUBLIC_SHOP_WHATSAPP || SHOP_CONFIG.whatsapp).replace(/[^0-9]/g, "");
  const formattedPrice = formatPrice(price);
  
  let fullUrl = productUrlOrPath;
  if (fullUrl && fullUrl.startsWith("/")) {
    fullUrl = `${SHOP_CONFIG.siteUrl}${fullUrl}`;
  }

  let message = `Hello Aristo Computer Meherpur,\n\nI want to order this product:\n*${productName}*\nPrice: ${formattedPrice}`;
  if (fullUrl) {
    message += `\nProduct Link: ${fullUrl}`;
  }
  message += `\n\nPlease let me know about availability and delivery in Meherpur. Thank you!`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generatePhoneCallUrl(): string {
  const cleanPhone = (process.env.NEXT_PUBLIC_SHOP_PHONE || SHOP_CONFIG.phone).replace(/[^0-9+]/g, "");
  return `tel:${cleanPhone}`;
}
