"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  variant?: "horizontal" | "emblem" | "stacked" | "badge";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

export default function Logo({
  variant = "horizontal",
  size = "md",
  className = "",
  priority = true,
}: LogoProps) {
  // 1. Badge variant: Circuit "A" emblem inside glowing gradient tile
  if (variant === "badge") {
    const sizeClasses = {
      sm: "w-9 h-9 p-1.5 rounded-xl",
      md: "w-10 h-10 sm:w-11 sm:h-11 p-2 rounded-xl",
      lg: "w-14 h-14 p-2.5 rounded-2xl",
      xl: "w-16 h-16 p-3 rounded-2xl",
    }[size];

    return (
      <div
        className={`relative bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200 overflow-hidden ${sizeClasses} ${className}`}
      >
        <Image
          src="/images/emblem-dark.png"
          alt="Aristo Computer Emblem"
          width={80}
          height={60}
          priority={priority}
          className="w-full h-full object-contain drop-shadow-xs"
        />
      </div>
    );
  }

  // 2. Emblem only variant
  if (variant === "emblem") {
    const heightMap = { sm: 26, md: 34, lg: 46, xl: 60 }[size];
    const widthMap = Math.round(heightMap * (213 / 162));

    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        {/* Light theme emblem (navy blue) */}
        <Image
          src="/images/emblem-light.png"
          alt="Aristo Computer Emblem"
          width={widthMap}
          height={heightMap}
          priority={priority}
          className="dark:hidden object-contain"
        />
        {/* Dark theme emblem (bright white / cyan) */}
        <Image
          src="/images/emblem-dark.png"
          alt="Aristo Computer Emblem"
          width={widthMap}
          height={heightMap}
          priority={priority}
          className="hidden dark:block object-contain"
        />
      </div>
    );
  }

  // 3. Stacked / Full vertical logo
  if (variant === "stacked") {
    const heightMap = { sm: 48, md: 68, lg: 96, xl: 130 }[size];
    const widthMap = Math.round(heightMap * (328 / 307));

    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        {/* Light theme full logo */}
        <Image
          src="/images/logo-light.png"
          alt="Aristo Computer Meherpur"
          width={widthMap}
          height={heightMap}
          priority={priority}
          className="dark:hidden object-contain"
        />
        {/* Dark theme full logo */}
        <Image
          src="/images/logo-dark.png"
          alt="Aristo Computer Meherpur"
          width={widthMap}
          height={heightMap}
          priority={priority}
          className="hidden dark:block object-contain"
        />
      </div>
    );
  }

  // 4. Horizontal banner logo (Emblem + Typography)
  const heightMap = { sm: 32, md: 40, lg: 52, xl: 68 }[size];
  const widthMap = Math.round(heightMap * (406 / 120));

  return (
    <div className={`relative inline-flex items-center shrink-0 ${className}`}>
      {/* Light theme horizontal logo */}
      <Image
        src="/images/logo-horizontal-light.png"
        alt="Aristo Computer Meherpur"
        width={widthMap}
        height={heightMap}
        priority={priority}
        className="dark:hidden object-contain w-auto h-auto max-h-full"
        style={{ height: `${heightMap}px` }}
      />
      {/* Dark theme horizontal logo */}
      <Image
        src="/images/logo-horizontal-dark.png"
        alt="Aristo Computer Meherpur"
        width={widthMap}
        height={heightMap}
        priority={priority}
        className="hidden dark:block object-contain w-auto h-auto max-h-full"
        style={{ height: `${heightMap}px` }}
      />
    </div>
  );
}
