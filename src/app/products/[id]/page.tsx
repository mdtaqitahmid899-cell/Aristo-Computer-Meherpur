import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowLeft, PackageX } from "lucide-react";
import ProductDetailsClient from "./ProductDetailsClient";
import { getProductById, getProducts } from "@/services/productService";
import { formatPrice } from "@/lib/constants";

export const dynamicParams = true;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | Aristo Computer Meherpur",
      description: "The requested computer product could not be found.",
    };
  }

  return {
    title: `${product.name} - Price ${formatPrice(product.price)} | Aristo Computer`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Aristo Computer Meherpur`,
      description: product.description.slice(0, 160),
      images: product.images?.[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-md mx-auto space-y-5 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <PackageX className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Product Not Found
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            The product you are looking for is either discontinued, out of stock, or has been removed from our catalog.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Available Products</span>
          </Link>
        </div>
      </div>
    );
  }

  // Fetch related products in the same category
  const allCategoryProducts = await getProducts({ category: product.category });
  const relatedProducts = allCategoryProducts.filter((p) => p.id !== product.id);

  return (
    <ProductDetailsClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
