"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Car,
  Lock,
  Smartphone,
  Globe,
  Search,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Terminal as TerminalIcon,
  Zap,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/app/lib/cn";
import { BackendTerminal } from "@/app/components/features/BackendTerminal";
// IMPORTUJEMY NOWĄ KARUZELĘ
import { HoloCarousel } from "@/app/components/features/HoloCarousel";

type Language = "pl" | "en";

// --- DANE (Twoje dane, bez zmian) ---
const MARKETPLACE_IMAGES = [
  {
    src: "/img/marketplace/Ogłoszenia.webp",
    title: { en: "Main Listings Grid", pl: "Główna lista ogłoszeń" },
  },
  {
    src: "/img/marketplace/Panel - Admina Dashboard.webp",
    title: { en: "Admin Dashboard Analytics", pl: "Analityka Panelu Admina" },
  },
  {
    src: "/img/marketplace/Formularz.webp",
    title: {
      en: "Listing Creation Wizard",
      pl: "Kreator dodawania ogłoszenia",
    },
  },
  {
    src: "/img/marketplace/Wiadomości.webp",
    title: { en: "Real-time Chat System", pl: "System wiadomości na żywo" },
  },
  {
    src: "/img/marketplace/Wyszukiwarka.webp",
    title: {
      en: "Advanced Search Filters",
      pl: "Zaawansowane filtry wyszukiwania",
    },
  },
  {
    src: "/img/marketplace/Formularz 1.webp",
    title: { en: "Vehicle Details Form", pl: "Formularz szczegółów pojazdu" },
  },
  {
    src: "/img/marketplace/Ogłoszenia - lista.png",
    title: { en: "List View Layout", pl: "Widok listy ogłoszeń" },
  },
  {
    src: "/img/marketplace/Panel Admina - lista użytkowników.webp",
    title: { en: "User Management", pl: "Zarządzanie użytkownikami" },
  },
  {
    src: "/img/marketplace/Panel admina - ogłoszenia.webp",
    title: { en: "Listing Moderation", pl: "Moderacja ogłoszeń" },
  },
  {
    src: "/img/marketplace/Powiadomienia.webp",
    title: { en: "Notification Center", pl: "Centrum powiadomień" },
  },
  {
    src: "/img/marketplace/Sekcja moje ogłoszenia.webp",
    title: {
      en: "My Listings Management",
      pl: "Zarządzanie moimi ogłoszeniami",
    },
  },
];

const FEATURES_DATA = {
  en: [
    { icon: Globe, title: "Modern SPA", desc: "React 18, TypeScript, Next.js" },
    { icon: Zap, title: "Real-time", desc: "Socket.IO chat & notifications" },
    {
      icon: Search,
      title: "Marketplace Core",
      desc: "Advanced listings & filters",
    },
    { icon: Smartphone, title: "Mobile First", desc: "PWA ready & responsive" },
  ],
  pl: [
    {
      icon: Globe,
      title: "Nowoczesne SPA",
      desc: "React 18, TypeScript, Next.js",
    },
    { icon: Zap, title: "Real-time", desc: "Czat Socket.IO i powiadomienia" },
    {
      icon: Search,
      title: "Rdzeń Marketplace",
      desc: "Zaawansowane ogłoszenia i filtry",
    },
    { icon: Smartphone, title: "Mobile First", desc: "Gotowość PWA i RWD" },
  ],
};

// --- KARTA SZCZEGÓŁÓW (Twoja implementacja bez zmian) ---
function AutomotiveProjectCard({ lang }: { lang: Language }) {
  const [viewMode, setViewMode] = useState<"showroom" | "engine">("showroom");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && viewMode === "showroom" && !lightboxOpen) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % MARKETPLACE_IMAGES.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, viewMode, lightboxOpen]);

  const nextSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % MARKETPLACE_IMAGES.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? MARKETPLACE_IMAGES.length - 1 : prev - 1
    );
  };

  const sideFeatures = FEATURES_DATA[lang];

  return (
    <>
      <div className="relative rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl mt-8 mb-20 group/card animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="border-b border-white/10 bg-zinc-900/50 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 backdrop-blur-sm relative z-20">
          <div className="flex gap-2 p-1 bg-black/40 rounded-lg border border-white/5">
            <button
              onClick={() => setViewMode("showroom")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                viewMode === "showroom"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Car size={16} /> Showroom
            </button>
            <button
              onClick={() => setViewMode("engine")}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                viewMode === "engine"
                  ? "bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <TerminalIcon size={16} /> Backend Source
            </button>
          </div>

          <div className="flex gap-4 text-xs font-mono text-gray-500">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  viewMode === "showroom" ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {viewMode === "showroom" ? "LIVE PREVIEW" : "SOURCE CODE ACCESS"}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 min-h-[600px]">
          <div className="p-6 md:p-8 border-r border-white/5 bg-gradient-to-b from-zinc-900/20 to-black flex flex-col relative z-10">
            <h3
              className={cn(
                "text-xl font-bold mb-6 flex items-center gap-2",
                viewMode === "showroom" ? "text-emerald-400" : "text-amber-500"
              )}
            >
              {viewMode === "showroom"
                ? lang === "pl"
                  ? "Warstwa Wizualna"
                  : "Visual Layer"
                : lang === "pl"
                ? "Logika Backend"
                : "Backend Logic"}
            </h3>

            <div className="space-y-4 flex-grow">
              {sideFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/5"
                >
                  <div
                    className={cn(
                      "p-3 rounded-lg h-fit",
                      viewMode === "showroom"
                        ? "text-emerald-400 bg-emerald-500/10"
                        : "text-amber-500 bg-amber-500/10"
                    )}
                  >
                    <feat.icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">
                      {feat.title}
                    </h4>
                    <p className="text-sm text-gray-400">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex gap-2 text-xs font-mono text-gray-500 items-end h-full pb-2">
                <span>VER: 2.4.0-PROD</span>
                <span>|</span>
                <span>REGION: EU-CENTRAL</span>
              </div>
            </div>
          </div>

          <div className="relative bg-black flex flex-col overflow-hidden h-full min-h-[500px]">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(#333 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {viewMode === "showroom" ? (
              <div
                className="relative w-full h-full flex flex-col group/gallery"
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <div
                  className="relative flex-grow w-full overflow-hidden cursor-zoom-in"
                  onClick={() => setLightboxOpen(true)}
                >
                  <Image
                    src={MARKETPLACE_IMAGES[currentImageIndex].src}
                    alt="App Screen"
                    fill
                    className="object-cover object-top transition-transform duration-700 hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="bg-emerald-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                            LIVE
                          </span>
                          <span className="text-xs text-emerald-400 font-mono uppercase">
                            CHANNEL {currentImageIndex + 1}/
                            {MARKETPLACE_IMAGES.length}
                          </span>
                        </div>
                        <h4 className="text-white font-bold text-lg drop-shadow-md">
                          {MARKETPLACE_IMAGES[currentImageIndex].title[lang]}
                        </h4>
                      </div>
                      <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md text-white transition-colors">
                        <Maximize2 size={20} />
                      </button>
                    </div>
                    <div className="mt-3 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      {isAutoPlaying && (
                        <div
                          className="h-full bg-emerald-500 animate-progress-bar"
                          style={{ animationDuration: "3500ms" }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                  {MARKETPLACE_IMAGES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(idx);
                      }}
                      className={cn(
                        "w-8 h-1 rounded-full transition-all backdrop-blur-sm",
                        idx === currentImageIndex
                          ? "bg-emerald-500"
                          : "bg-white/20 hover:bg-white/40"
                      )}
                    />
                  ))}
                </div>

                <button
                  onClick={prevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover/gallery:opacity-100 transition-opacity hover:bg-black/80"
                >
                  <ChevronRight />
                </button>
              </div>
            ) : (
              <BackendTerminal lang={lang} />
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-xl animate-fade-in">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white rounded-full transition-all z-50"
          >
            <X size={24} />
          </button>
          <div className="relative w-full max-w-7xl h-[80vh]">
            <Image
              src={MARKETPLACE_IMAGES[currentImageIndex].src}
              alt="Full View"
              fill
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-8 flex items-center gap-6">
            <button
              onClick={prevSlide}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 text-white transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-center">
              <h3 className="text-white font-bold text-xl">
                {MARKETPLACE_IMAGES[currentImageIndex].title[lang]}
              </h3>
              <p className="text-gray-500 text-sm">
                Image {currentImageIndex + 1} of {MARKETPLACE_IMAGES.length}
              </p>
            </div>
            <button
              onClick={nextSlide}
              className="p-3 bg-white/10 rounded-full hover:bg-white/20 text-white transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes progress-bar {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
        .animate-progress-bar {
          animation-name: progress-bar;
          animation-timing-function: linear;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

// --- GŁÓWNA SEKCJA (ZINTEGROWANA) ---
export function Projects({ lang }: { lang: Language }) {
  const [viewMode, setViewMode] = useState<"carousel" | "details">("carousel");

  return (
    <section className="relative min-h-screen w-full bg-black">
      {/* 1. KARUZELA 3D (Hologramy) */}
      {viewMode === "carousel" && (
        <div className="relative w-full h-screen z-10">
          <HoloCarousel onSelect={() => setViewMode("details")} />

          {/* Opcjonalny przycisk pominięcia */}
          <button
            onClick={() => setViewMode("details")}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-zinc-600 hover:text-cyan-500 uppercase tracking-widest transition-colors z-20"
          >
            [ SKIP TO LIST ]
          </button>
        </div>
      )}

      {/* 2. SZCZEGÓŁY PROJEKTU */}
      {viewMode === "details" && (
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-12 lg:p-20 xl:p-24 animate-in fade-in slide-in-from-bottom-10 duration-700">
          {/* Przycisk powrotu do hologramów */}
          <button
            onClick={() => setViewMode("carousel")}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 bg-black/80 backdrop-blur border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-xs font-mono uppercase hover:bg-cyan-500/10 hover:border-cyan-500 transition-all shadow-lg"
          >
            <ArrowLeft size={14} />{" "}
            {lang === "pl" ? "Wróć do hologramów" : "Back to Holo-View"}
          </button>

          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {lang === "pl" ? "Wybrane " : "Featured "}
              <span className="text-emerald-500">
                {lang === "pl" ? "Projekty" : "Projects"}
              </span>
            </h2>
            <div className="h-1 w-20 bg-emerald-500 rounded-full mb-8" />
            <p className="text-gray-400 max-w-2xl text-lg">
              {lang === "pl"
                ? "Realizacje komercyjne łączące zaawansowaną inżynierię backendową z nowoczesnym frontendem."
                : "Commercial implementations combining advanced backend engineering with modern frontend."}
            </p>
          </div>

          <div className="space-y-32">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 text-[10px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rounded-full animate-pulse uppercase">
                  COMMERCIAL PRODUCT
                </span>
                <span className="px-3 py-1 text-[10px] font-mono border border-red-500/30 bg-red-500/10 text-red-400 rounded-full flex items-center gap-2 uppercase">
                  <Lock size={10} /> NDA PROTECTED
                </span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Automotive Marketplace
              </h3>
              <p className="text-gray-400 max-w-3xl mb-8 leading-relaxed">
                {lang === "pl"
                  ? "Kompleksowa platforma ogłoszeniowa zaprojektowana i wdrożona od zera jako produkt komercyjny. System łączy sprzedających i kupujących w jeden skalowalny ekosystem."
                  : "A full-scale automotive marketplace platform designed and implemented from scratch as a commercial product. The system connects sellers and buyers in a single, scalable ecosystem."}
              </p>

              <AutomotiveProjectCard lang={lang} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
