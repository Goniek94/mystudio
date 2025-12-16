"use client";

import React, { useState, useCallback } from "react";
import { CyberBackground } from "@/app/components/features/CyberBackground";
import { PixelatingLogo } from "@/app/components/features/PixelatingLogo";
import { ChatTerminal } from "@/app/components/features/ChatTerminal";
import { Container } from "@/app/components/ui/Container";
import { ButtonLink } from "@/app/components/ui/Button";

export default function Home() {
  const [isEntered, setIsEntered] = useState(false);
  const [showUI, setShowUI] = useState(false);

  // Ścieżka do Twojego logo
  const LOGO_PATH = "/img/unnamed (5).jpg";

  const handleLogoComplete = useCallback(() => {
    setShowUI(true);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden text-emerald-100 font-mono bg-black">
      {/* 1. TŁO MIASTA (Widoczne tylko w Intro) */}
      {!isEntered && (
        <div className="fixed inset-0 z-0 opacity-80">
          <CyberBackground />
        </div>
      )}

      {/* 2. EKRAN INTRO (Logo + Pytanie + Przycisk) */}
      {!isEntered && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="mb-8">
            <PixelatingLogo src={LOGO_PATH} onComplete={handleLogoComplete} />
          </div>

          <div
            className={`text-center transition-all duration-1000 ${
              showUI ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h2 className="text-lg md:text-xl text-emerald-400 mb-10 tracking-[0.2em] uppercase">
              Jak dzisiaj chcesz zmienić świat?
            </h2>
            <button
              onClick={() => setIsEntered(true)}
              className="group relative px-14 py-4 border border-emerald-500/40 hover:bg-emerald-500 transition-all duration-300"
            >
              <span className="relative z-10 group-hover:text-black tracking-[0.4em] font-bold">
                [ KONTYNUUJ ]
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 3. GŁÓWNY LAYOUT (BENTO GRID - Po kliknięciu) */}
      {isEntered && (
        <div className="relative z-10 min-h-screen bg-[#020617] animate-in fade-in duration-1000">
          {/* Subtelna siatka w tle dla klimatu */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

          <Container className="pt-10 pb-20">
            {/* SYSTEM HEADER */}
            <header className="border-b border-emerald-500/20 pb-6 mb-12 flex justify-between items-end">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
                  MYSTUDIO<span className="text-emerald-500">_CORE</span>
                </h1>
                <p className="text-[10px] text-emerald-600 tracking-[0.3em] uppercase">
                  Status: System Operational // Link: Secured
                </p>
              </div>
              <div className="hidden md:block text-[10px] text-zinc-600 text-right font-mono">
                OS_VERSION: 2.0.5-STABLE <br />
                UPTIME: 99.9%
              </div>
            </header>

            {/* BENTO GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* KAFEL 1: GŁÓWNE BIO (Szeroki) */}
              <section className="lg:col-span-8 border border-emerald-500/10 bg-zinc-950/40 p-8 md:p-12 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-500/40" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-500/40" />

                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight leading-[1.1]">
                  Fullstack <br />
                  <span className="text-emerald-500">Developer</span>
                </h2>
                <p className="text-zinc-400 max-w-xl text-lg leading-relaxed mb-10">
                  Architekt rozwiązań cyfrowych. Buduję wydajne systemy webowe,
                  gdzie czysty kod spotyka się z nowoczesnym designem.
                  Specjalizuję się w technologiach{" "}
                  <span className="text-white">Next.js, Node.js i Cloud.</span>
                </p>
                <div className="flex gap-4">
                  <ButtonLink href="#contact" variant="primary">
                    Init_Contact()
                  </ButtonLink>
                </div>
              </section>

              {/* KAFEL 2: TERMINAL / CZAT (Boczny) */}
              <aside className="lg:col-span-4 min-h-[450px]">
                <ChatTerminal className="h-full border border-emerald-500/10 bg-black/60 shadow-2xl backdrop-blur-md" />
              </aside>

              {/* KAFEL 3: STACK TECHNOLOGICZNY (Mały) */}
              <div className="lg:col-span-4 border border-emerald-500/10 bg-zinc-950/40 p-6 flex flex-col justify-between">
                <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4">
                  Core_Technologies
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-400 font-mono">
                  <div className="border border-white/5 p-2 bg-white/5">
                    REACT / NEXT.JS
                  </div>
                  <div className="border border-white/5 p-2 bg-white/5">
                    TYPESCRIPT
                  </div>
                  <div className="border border-white/5 p-2 bg-white/5">
                    NODE.JS / NEST
                  </div>
                  <div className="border border-white/5 p-2 bg-white/5">
                    POSTGRES / REDIS
                  </div>
                </div>
              </div>

              {/* KAFEL 4: OSTATNIA MISJA / PORTFOLIO PREVIEW */}
              <div className="lg:col-span-5 border border-emerald-500/10 bg-zinc-950/40 p-6 relative group cursor-pointer">
                <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-4">
                  Latest_Deployment
                </h3>
                <div className="space-y-2">
                  <h4 className="text-white font-bold uppercase group-hover:text-emerald-400 transition-colors">
                    E-Commerce Platform B2B
                  </h4>
                  <p className="text-xs text-zinc-500 line-clamp-2">
                    Przebudowa silnika sprzedażowego. Optymalizacja Core Web
                    Vitals do 100/100.
                  </p>
                </div>
                <div className="mt-4 text-[10px] text-emerald-500/50">
                  VIEW_DETAILS &rarr;
                </div>
              </div>

              {/* KAFEL 5: STATUS SYSTEMU (Bardzo mały) */}
              <div className="lg:col-span-3 border border-emerald-500/10 bg-emerald-500/5 p-6 flex items-center justify-center text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-500">10+</div>
                  <div className="text-[10px] text-emerald-600 uppercase tracking-tighter">
                    Lat Doświadczenia
                  </div>
                </div>
              </div>
            </div>

            {/* SYSTEM FOOTER */}
            <footer className="mt-12 pt-6 border-t border-emerald-500/10 flex flex-col md:flex-row justify-between text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
              <div>© 2025 MYSTUDIO // ALL RIGHTS RESERVED</div>
              <div className="mt-2 md:mt-0">
                Encrypted Connection // Warsaw, PL
              </div>
            </footer>
          </Container>
        </div>
      )}
    </main>
  );
}
