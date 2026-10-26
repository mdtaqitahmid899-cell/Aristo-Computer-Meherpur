import React from "react";
import { Metadata } from "next";
import CameraSetupClient from "@/components/camera/CameraSetupClient";

export const metadata: Metadata = {
  title: "CCTV & IP Camera Security Setup Services | Aristo Computer Meherpur",
  description:
    "Professional CCTV camera installation, ColorVu night vision, IP PoE cameras, DVR/NVR repair, and mobile live view configuration in Meherpur, Bangladesh by Aristo Computer (Hotel Bazar).",
  keywords: [
    "CCTV Camera Setup Meherpur",
    "IP Camera Installation Bangladesh",
    "Hikvision Dahua Camera Meherpur",
    "Hotel Bazar Camera Shop",
    "Security Surveillance Meherpur",
    "ColorVu Camera Setup",
    "সিসিটিভি ক্যামেরা মেহেরপুর",
    "ক্যামেরা সেটআপ",
  ],
};

export default function CameraSetupPage() {
  return <CameraSetupClient />;
}
