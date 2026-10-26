import React from "react";
import {
  ShieldCheck,
  Wrench,
  Truck,
  HeartHandshake,
  MapPin,
  BadgeDollarSign,
} from "lucide-react";

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: ShieldCheck,
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900/50",
      title: "100% Genuine with Official Warranty",
      description:
        "Every processor, motherboard, GPU, and laptop comes straight from authorized distributors with authentic manufacturer warranty in Bangladesh.",
    },
    {
      icon: Wrench,
      color: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-900/50",
      title: "Expert PC Assembly & Optimization",
      description:
        "Our skilled technicians in Meherpur provide professional cable management, BIOS updates, thermal pasting, and rigorous benchmark testing.",
    },
    {
      icon: MapPin,
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900/50",
      title: "Local Meherpur Shop & Support",
      description:
        "No waiting weeks for distant services. Visit our physical shop in Meherpur Sadar for face-to-face support, repairs, and consultation.",
    },
    {
      icon: BadgeDollarSign,
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900/50",
      title: "Fair & Transparent BDT Pricing",
      description:
        "We offer the most competitive market prices in Bangladeshi Taka with zero hidden charges and honest advice suited to your budget.",
    },
    {
      icon: Truck,
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-900/50",
      title: "Fast Delivery & Safe Packaging",
      description:
        "Quick delivery across Meherpur town and surrounding upazilas with shockproof packaging to ensure your hardware arrives in mint condition.",
    },
    {
      icon: HeartHandshake,
      color: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/50",
      title: "Friendly WhatsApp Customer Care",
      description:
        "Direct one-on-one communication. Chat with our technicians on WhatsApp anytime for product inquiries, stock confirmation, or tech help.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/60">
            Why Aristo Computer
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            Your Most Reliable Tech Destination in Meherpur
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            We are dedicated to empowering students, gamers, creators, and business professionals with authentic computing hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg dark:hover:shadow-blue-900/10 transition-all duration-300 flex gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
