"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/app/lib/cn";

// Import Globe (SSR false)
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

// --- KROK 1: Baza Danych Miast i Ciekawostek ---
// Możesz tu dodawać dowolne miasta.
const CITIES = [
  {
    text: "WARSZAWA",
    lat: 52.2297,
    lng: 21.0122,
    fact: "Pałac Kultury i Nauki ma drugie co do wielkości zegary milenijne w Europie na szczycie wieży.",
  },
  {
    text: "NOWY JORK",
    lat: 40.7128,
    lng: -74.006,
    fact: "W nowojorskim metrze żyje około 15 152 form życia (od bakterii po insekty), których nauka wcześniej nie znała.",
  },
  {
    text: "LOS ANGELES",
    lat: 34.0522,
    lng: -118.2437,
    fact: "Pierwotna nazwa miasta to: 'El Pueblo de Nuestra Señora la Reina de los Ángeles del Río Porciúncula'.",
  },
  {
    text: "CHICAGO",
    lat: 41.8781,
    lng: -87.6298,
    fact: "Rzeka Chicago jest jedyną rzeką na świecie, której kierunek przepływu inżynierowie trwale odwrócili dla higieny miasta.",
  },
  {
    text: "SAN FRANCISCO",
    lat: 37.7749,
    lng: -122.4194,
    fact: "Most Golden Gate miał być pomalowany w żółto-czarne pasy (jak trzmiel), aby był widoczny we mgle. Architekt się sprzeciwił.",
  },
  {
    text: "LONDYN",
    lat: 51.5074,
    lng: -0.1278,
    fact: "W Londynie jest nielegalne umieranie w Pałacu Westminsterskim (siedzibie parlamentu).",
  },
  {
    text: "BERLIN",
    lat: 52.52,
    lng: 13.405,
    fact: "Berlin ma więcej mostów (ok. 1700) niż Wenecja.",
  },
  {
    text: "AMSTERDAM",
    lat: 52.3676,
    lng: 4.9041,
    fact: "Co roku z kanałów w Amsterdamie wyławia się około 12-15 tysięcy rowerów.",
  },
  {
    text: "MADRYT",
    lat: 40.4168,
    lng: -3.7038,
    fact: "To jedyna europejska stolica założona przez Muzułmanów (pierwotnie: Mayrit).",
  },
  {
    text: "BARCELONA",
    lat: 41.3851,
    lng: 2.1734,
    fact: "Plaże w Barcelonie są sztuczne. Stworzono je dopiero na Igrzyska Olimpijskie w 1992 roku.",
  },
  {
    text: "TOKIO",
    lat: 35.6762,
    lng: 139.6503,
    fact: "W Tokio są kawiarnie, gdzie płacisz za czas spędzony z kotami, sowami, a nawet jeżami.",
  },
];

export function MatrixWorldMap({ className }: { className?: string }) {
  const globeEl = useRef<any>(null); // Poprawiony ref
  const [mounted, setMounted] = useState(false);

  // Stan do przechowywania wybranego miasta
  const [selectedCity, setSelectedCity] = useState<(typeof CITIES)[0] | null>(
    null
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5; // Lekko przyspieszyłem, żeby szybciej zobaczyć inne miasta
      globeEl.current.controls().enableZoom = false;
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
    }
  }, [mounted]);

  if (!mounted)
    return (
      <div className="w-full h-full min-h-[500px] bg-black/20 animate-pulse rounded-xl" />
    );

  return (
    <div
      className={cn(
        "relative w-full h-full min-h-[500px] flex items-center justify-center overflow-hidden rounded-xl border border-emerald-500/20 bg-black",
        className
      )}
    >
      <div className="absolute inset-0 cursor-move">
        <Globe
          ref={globeEl}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="/textures/lights.jpg"
          atmosphereColor="#3a7bd5"
          atmosphereAltitude={0.15}
          // --- KONFIGURACJA PUNKTÓW ---
          labelsData={CITIES}
          labelLat={(d: any) => d.lat}
          labelLng={(d: any) => d.lng}
          labelText={(d: any) => d.text}
          labelSize={1.5}
          labelDotRadius={0.6}
          // Kolor: żółty dla wybranego, biały dla reszty
          labelColor={(d: any) => (d === selectedCity ? "#fbbf24" : "white")}
          labelResolution={2}
          // --- INTERAKCJA ---
          onLabelClick={(d: any) => {
            setSelectedCity(d);
            // Opcjonalnie: Zatrzymaj obrót po kliknięciu, żeby łatwiej czytać
            if (globeEl.current) {
              globeEl.current.controls().autoRotate = false;
            }
          }}
          // Opcjonalnie: Wznów obrót po kliknięciu w tło
          onGlobeClick={() => {
            setSelectedCity(null);
            if (globeEl.current) {
              globeEl.current.controls().autoRotate = true;
            }
          }}
        />
      </div>

      {/* --- CYBER-OKNO Z CIEKAWOSTKĄ --- */}
      {selectedCity && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] bg-black/90 border border-emerald-500 p-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] backdrop-blur-md z-10 rounded-sm">
          <div className="flex justify-between items-start mb-4 border-b border-emerald-500/30 pb-2">
            <h3 className="text-emerald-400 font-mono text-lg tracking-widest font-bold">
              DATA_LINK: {selectedCity.text}
            </h3>
            <button
              onClick={() => {
                setSelectedCity(null);
                if (globeEl.current)
                  globeEl.current.controls().autoRotate = true;
              }}
              className="text-emerald-500/50 hover:text-emerald-400 transition-colors font-mono text-xs"
            >
              [ZAMKNIJ]
            </button>
          </div>
          <p className="text-gray-300 font-mono text-sm leading-relaxed typing-effect">
            {selectedCity.fact}
          </p>
          <div className="mt-4 text-[10px] text-emerald-500/40 text-right font-mono">
            COORDS: {selectedCity.lat.toFixed(2)} |{" "}
            {selectedCity.lng.toFixed(2)}
          </div>
        </div>
      )}

      {/* Nakładka UI */}
      <div className="absolute bottom-6 right-6 font-mono text-emerald-500/50 text-[10px] pointer-events-none text-right">
        <div>STATUS: {selectedCity ? "DATA_RETRIVED" : "SCANNING..."}</div>
        <div>OBJECTS: {CITIES.length}</div>
      </div>
    </div>
  );
}
