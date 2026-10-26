import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aristo Computer Meherpur",
    short_name: "Aristo Computer",
    description:
      "Leading computer store in Meherpur, Bangladesh. Genuine laptops, custom desktop PCs, processors, motherboards, graphics cards, RAM, SSDs with official warranty.",
    start_url: "/",
    display: "standalone",
    background_color: "#051228",
    theme_color: "#0B2550",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
