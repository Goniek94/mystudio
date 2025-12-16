"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/app/lib/cn";

// --- KONFIGURACJA DANYCH ---
// Precyzyjne koordynaty (w % szerokości/wysokości kontenera)
const NODES = [
  { id: "NYC", x: 29, y: 35, label: "US_EAST" },
  { id: "LON", x: 49, y: 26, label: "EU_WEST" },
  { id: "WAW", x: 53.5, y: 27, label: "WAW_MAIN" }, // Nasza baza
  { id: "TKY", x: 86, y: 32, label: "ASIA_HUB" },
  { id: "SGP", x: 79, y: 55, label: "SGP_NODE" },
  { id: "CPT", x: 53, y: 75, label: "AFR_LINK" },
];

export function MatrixWorldMap() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center select-none pointer-events-none overflow-hidden">
      {/* 1. KONTENER GŁÓWNY */}
      <div className="relative w-full max-w-4xl aspect-[1.8/1] group">
        {/* TŁO SIATKI (GRID) - Bardziej subtelne */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] border-x border-emerald-500/10" />

        {/* 2. MAPA ŚWIATA (High-Tech Dot Matrix) */}
        <svg
          viewBox="0 0 1000 500"
          className="absolute inset-0 w-full h-full drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]"
        >
          <defs>
            {/* WZÓR PUNKTÓW (To sprawia, że mapa jest z kropek) */}
            <pattern
              id="grid-pattern"
              x="0"
              y="0"
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.2" className="fill-emerald-500/30" />
            </pattern>

            {/* MASKA - Używamy kształtów kontynentów jako przycięcia dla wzoru kropek */}
            <mask id="world-mask">
              <path
                fill="white"
                d="M270,120 Q200,80 150,150 T50,200 L60,250 L160,450 L300,380 L350,220 L270,120 Z 
                   M450,100 L600,80 L650,200 L550,280 L480,250 L420,150 Z
                   M480,280 L600,450 L700,350 L620,220 Z
                   M620,100 L900,100 L950,250 L800,400 L700,300 L650,200 Z
                   M800,380 L900,450 L950,420 L850,320 Z"
              />
              {/* Tutaj stosujemy "oszukane" uproszczone ścieżki, które wyglądają PRO,
                  bo są zamieniane na kropki przez pattern. Dzięki temu plik jest lekki. */}
            </mask>
          </defs>

          {/* RYSOWANIE MAPY PRZEZ MASKĘ */}
          {/* To jest klucz: Wielki prostokąt wypełniony kropkami, przycięty do kształtu świata */}
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#grid-pattern)"
            mask="url(#world-mask)"
            className="opacity-60"
          />

          {/* POŁĄCZENIA (LINES) */}
          <g className="stroke-emerald-400/40 stroke-[1] fill-none">
            {/* Linie z Warszawy do innych hubów */}
            {NODES.map((node, i) => {
              if (node.id === "WAW") return null;
              // Koordynaty startowe (Warszawa)
              const startX = NODES[2].x * 10;
              const startY = NODES[2].y * 5;
              // Koordynaty końcowe
              const endX = node.x * 10;
              const endY = node.y * 5;

              // Obliczanie łuku (Bezier Curve)
              const midX = (startX + endX) / 2;
              // Im dalszy punkt, tym wyższy łuk
              const dist = Math.abs(endX - startX);
              const midY = Math.min(startY, endY) - dist * 0.2;

              return (
                <path
                  key={node.id}
                  d={`M${startX},${startY} Q${midX},${midY} ${endX},${endY}`}
                  strokeDasharray="4,4"
                  className="animate-[dash_30s_linear_infinite]"
                />
              );
            })}
          </g>
        </svg>

        {/* 3. SKANER RADAROWY */}
        {/* Pionowa linia przelatująca przez mapę + poświata */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 bottom-0 w-[40px] bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -skew-x-12 animate-[scan_5s_linear_infinite]" />
          <div className="absolute top-0 bottom-0 w-[1px] bg-emerald-400/50 shadow-[0_0_20px_#10b981] animate-[scan_5s_linear_infinite]" />
        </div>

        {/* 4. PUNKTY (NODES) HTML/CSS */}
        {/* Renderujemy je nad SVG dla łatwiejszego stylowania */}
        {NODES.map((node) => (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            {/* Punkt centralny */}
            <div className="relative flex items-center justify-center w-6 h-6">
              {/* Ping animation */}
              <div
                className={cn(
                  "absolute inset-0 rounded-full bg-emerald-500/40 animate-ping",
                  node.id === "WAW"
                    ? "animation-duration-[1s]"
                    : "animation-duration-[3s]"
                )}
              />
              {/* Core dot */}
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)] z-10" />

              {/* Ring wokół Warszawy */}
              {node.id === "WAW" && (
                <div className="absolute inset-[-4px] border border-emerald-500/50 rounded-full animate-[spin_4s_linear_infinite]" />
              )}
            </div>

            {/* Label (Etykieta) */}
            <div
              className={cn(
                "absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-all duration-500",
                node.id === "WAW"
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100"
              )}
            >
              <div className="h-4 w-[1px] bg-emerald-500/30" />{" "}
              {/* Linia łącząca kropkę z tekstem */}
              <div className="px-2 py-1 bg-black/90 border border-emerald-500/40 text-[9px] text-emerald-400 font-bold tracking-widest uppercase whitespace-nowrap shadow-lg backdrop-blur-sm">
                {node.label}
              </div>
            </div>
          </div>
        ))}

        {/* 5. DEKORACJE HUD (Narożniki) */}
        {/* Lewy górny */}
        <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-emerald-500/30 rounded-tl-lg" />
        {/* Prawy dolny */}
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-emerald-500/30 rounded-br-lg" />

        {/* Dół - statystyki */}
        <div className="absolute bottom-4 left-8 text-[10px] text-emerald-600/70 font-mono flex gap-6">
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            SERVER_STATUS: ACTIVE
          </span>
          <span className="hidden sm:inline">TRAFFIC: 450 TB/s</span>
        </div>
      </div>
    </div>
  );
}
