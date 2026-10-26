import React from "react";
import PCBuilderClient from "@/components/pc-builder/PCBuilderClient";
import { getProducts } from "@/services/productService";

export const metadata = {
  title: "Custom PC Builder | Aristo Computer Meherpur",
  description:
    "Assemble your custom gaming or workstation desktop PC with live BDT pricing, power wattage estimation, and official warranty assembly in Meherpur.",
};

export default async function PCBuilderPage() {
  const products = await getProducts();

  return <PCBuilderClient initialProducts={products} />;
}
