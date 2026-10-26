import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Clock, Package, MessageCircle, Phone } from "lucide-react";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import ServicesBanner from "@/components/home/ServicesBanner";
import CategorySection from "@/components/home/CategorySection";
import SpecialOffersSection from "@/components/home/SpecialOffersSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CameraSetupPreview from "@/components/home/CameraSetupPreview";
import LocationContactSection from "@/components/home/LocationContactSection";
import ProductCard from "@/components/products/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { getProducts } from "@/services/productService";
import { SHOP_CONFIG } from "@/lib/constants";

export default async function HomePage() {
  const [featuredProducts, latestProducts] = await Promise.all([
    getProducts({ featuredOnly: true }),
    getProducts({ sortBy: "newest" }),
  ]);

  const displayFeatured = featuredProducts.slice(0, 4);
  const displayLatest = latestProducts.slice(0, 8);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Animated Hero Slideshow */}
      <HeroSlideshow />

      {/* 2. Full Services & Scope Showcase */}
      <ScrollReveal>
        <ServicesBanner />
      </ScrollReveal>

      {/* 3. Hardware Category Grid with Scroll Reveal */}
      <ScrollReveal>
        <CategorySection />
      </ScrollReveal>

      {/* 3. Featured Products Showcase */}
      {displayFeatured.length > 0 && (
        <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Handpicked Hardware</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    Featured Products
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    High-demand gaming rigs, processors, and laptops with verified availability in Meherpur.
                  </p>
                </div>

                <Link
                  href="/products?featured=true"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group self-start sm:self-auto"
                >
                  <span>View All Featured</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayFeatured.map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 100}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Special Offers Promotional Banner */}
      <ScrollReveal>
        <SpecialOffersSection />
      </ScrollReveal>

      {/* 5. Latest Arrivals Section */}
      <section className="py-16 sm:py-20 bg-slate-50 dark:bg-[#090d16] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Fresh Stock</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Latest Products & Hardware
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Recently arrived laptops, graphic cards, desktop accessories, and storage drives.
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group self-start sm:self-auto"
              >
                <span>Explore All Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          {displayLatest.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayLatest.map((product, index) => (
                  <ScrollReveal key={product.id} delay={index * 50}>
                    <ProductCard product={product} />
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal delay={200}>
                <div className="mt-12 text-center">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    <span>View All Store Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollReveal>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 sm:p-14 text-center space-y-4 max-w-xl mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                New Stock Arriving Soon
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                We are actively updating our store catalog with brand-new laptops, custom desktop PCs, and genuine components. Contact our Meherpur shop directly for immediate pricing and stock availability.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={`https://wa.me/${SHOP_CONFIG.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Inquiries</span>
                </a>
                <a
                  href={`tel:${SHOP_CONFIG.phone}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {SHOP_CONFIG.phone}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. CCTV Camera Setup Specialized Skill & Services */}
      <ScrollReveal>
        <CameraSetupPreview />
      </ScrollReveal>

      {/* 7. Why Choose Us Section */}
      <ScrollReveal>
        <WhyChooseUs />
      </ScrollReveal>

      {/* 8. Shop Location and Direct Contact Form */}
      <ScrollReveal>
        <LocationContactSection />
      </ScrollReveal>
    </div>
  );
}
