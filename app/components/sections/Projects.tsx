"use client";

import React, { useState } from "react";
import { HoloCarousel } from "@/app/components/features/HoloCarousel";
import { ProjectDetails } from "@/app/components/sections/ProjectDetails"; // Importujemy to, co stworzyliśmy wyżej

type Language = "pl" | "en";

export function Projects({ lang }: { lang: Language }) {
  // Stan decyduje: albo Lobby (carousel), albo Szczegóły (details)
  const [viewMode, setViewMode] = useState<"carousel" | "details">("carousel");

  return (
    <section className="relative min-h-screen w-full">
      {/* 1. WIDOK LOBBY (HOLOGRAMY) */}
      {viewMode === "carousel" && (
        <div className="relative w-full h-screen z-10">
          {/* Po kliknięciu karty (onSelect) przełączamy na 'details' */}
          <HoloCarousel onSelect={() => setViewMode("details")} />

          {/* Przycisk awaryjny / szybkie przejście */}
          <button
            onClick={() => setViewMode("details")}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600 hover:text-cyan-500 uppercase tracking-widest transition-colors z-20"
          >
            [ SKIP TO LIST ]
          </button>
        </div>
      )}

      {/* 2. WIDOK PROJEKTU (DOCELOWY) */}
      {viewMode === "details" && (
        <ProjectDetails
          lang={lang}
          onBack={() => setViewMode("carousel")} // Przekazujemy funkcję powrotu
        />
      )}
    </section>
  );
}
