import React from "react";
import Image from "next/image";
import { cn } from "@/app/lib/cn";

interface LogoProps {
  className?: string;
  showStatus?: boolean;
}

export function Logo({ className, showStatus = true }: LogoProps) {
  return (
    // ZMIANA: Zamiast ujemnego marginesu (-ml...), dajemy dodatni (ml-1 md:ml-2).
    // To wyraźnie odsunie logo od lewej krawędzi ekranu.
    <div className={cn("flex flex-col select-none ml-10 md:ml-2", className)}>
      {/* GÓRNA CZĘŚĆ: DIODA + OBRAZEK */}
      <div className="flex items-center gap-6 mb-2">
        {/* 1. DIODA STATUSU */}
        <div className="relative flex h-6 w-6 items-center justify-center shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40 duration-1000"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]"></span>
        </div>

        {/* 2. LOGO */}
        <div className="relative w-80 h-32">
          <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full opacity-60 -z-10 translate-y-2" />
          <Image
            src="/img/code.png"
            alt="Studio Logo"
            fill
            className="object-contain object-left drop-shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-110 origin-left"
            priority
          />
        </div>
      </div>

      {/* DOLNA CZĘŚĆ: STATUS */}
      {showStatus && (
        <div className="pl-3 mt-[-10px]">
          <p className="text-sm text-emerald-400/90 uppercase tracking-[0.3em] font-bold border-l-[3px] border-emerald-500/50 pl-5 py-1 ml-3 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            System Online{" "}
            <span className="text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
              //
            </span>{" "}
            v2.0
          </p>
        </div>
      )}
    </div>
  );
}
