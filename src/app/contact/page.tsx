import React from "react";
import LocationContactSection from "@/components/home/LocationContactSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export const metadata = {
  title: "Contact & Store Location | Aristo Computer Meherpur",
  description:
    "Visit Aristo Computer in Meherpur Sadar or reach out via WhatsApp and phone for pricing, genuine hardware components, and custom PC builds.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] transition-colors">
      {/* Contact Header */}
      <div className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Contact Aristo Computer Meherpur
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            We are here to assist with product inquiries, custom computer builds, component compatibility, and official warranty support.
          </p>
        </div>
      </div>

      <LocationContactSection />
      <WhyChooseUs />
    </div>
  );
}
