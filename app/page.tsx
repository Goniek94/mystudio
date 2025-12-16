"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image"; // Importujemy komponent Image
import { cn } from "@/app/lib/cn";
import { portfolioData } from "@/app/components/data/content";
import { ScrambleText } from "@/app/components/ui/ScrambleText";
import { MatrixBackground } from "@/app/components/ui/MatrixBackground";

// --- TYPY I DANE NAWIGACJI ---
type SectionId = "about" | "projects" | "services" | "stack" | "contact";

const MENU_ITEMS: { id: SectionId; label: string }[] = [
  { id: "about", label: "01_About" },
  { id: "projects", label: "02_Selected Works" },
  { id: "services", label: "03_Capabilities" },
  { id: "stack", label: "04_Technology" },
  { id: "contact", label: "05_Contact" },
];

// --- GŁÓWNY KOMPONENT STRONY ---
export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>("about");

  return (
    <main className="relative min-h-screen w-full text-zinc-300 font-mono overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. WARSTWA TŁA: MATRIX RAIN (Najniżej) */}
      <MatrixBackground />

      {/* 2. WARSTWA CIENIA (Overlay) 
          To przyciemnia Matrixa, żeby tekst był czytelny. 
      */}
      <div className="fixed inset-0 bg-black/85 -z-10 backdrop-blur-[2px]" />

      {/* 3. WARSTWA TREŚCI (Najwyżej) */}
      <div className="relative z-10 mx-auto max-w-[1800px] min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
        {/* --- LEWA KOLUMNA: NAWIGACJA (Sticky) --- */}
        <aside className="relative md:h-screen md:sticky md:top-0 flex flex-col justify-between p-6 md:p-10 border-r border-emerald-500/20">
          <div>
            {/* --- LOGO STUDIO (ZMIANA NA OBRAZEK) --- */}
            <div className="flex items-center gap-3 mb-4">
              {/* Zielona dioda statusu */}
              <div className="w-2 h-2 bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]" />

              {/* Kontener na logo */}
              <div className="relative w-32 h-10">
                {/* PAMIĘTAJ: Zmień src na ścieżkę do swojego pliku w folderze public */}
                <Image
                  src="/img/code.png"
                  alt="Studio Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>

            <p className="text-[10px] text-emerald-500/80 uppercase tracking-widest pl-5 font-bold opacity-80 border-l border-emerald-500/30 ml-1">
              System Online // v2.0
            </p>
          </div>

          {/* Menu Nawigacyjne */}
          <nav className="mt-12 md:mt-0">
            <ul className="flex flex-col gap-2">
              {MENU_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "group relative flex items-center h-10 w-full text-left outline-none transition-all pl-4 border-l",
                      activeSection === item.id
                        ? "border-emerald-500 text-white bg-emerald-500/10 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]"
                        : "border-emerald-500/20 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/5"
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs tracking-[0.15em] uppercase transition-all duration-300",
                        activeSection === item.id
                          ? "font-bold translate-x-2"
                          : "group-hover:translate-x-1"
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Stopka boczna */}
          <div className="hidden md:block text-[9px] text-zinc-600 font-mono border-t border-emerald-500/20 pt-6">
            <p>LOCATION: PL, WAW</p>
            <p className="mt-1">LATENCY: 12ms</p>
          </div>
        </aside>

        {/* --- PRAWA KOLUMNA: TREŚĆ GŁÓWNA --- */}
        <section className="p-6 md:p-16 lg:p-24 min-h-[50vh] animate-in fade-in duration-700">
          <div className="max-w-5xl">
            {/* Nagłówek Sekcji (Breadcrumbs + RAM Usage) */}
            <header className="mb-12 border-b border-emerald-500/20 pb-4 flex justify-between items-end">
              <p className="text-[10px] text-emerald-500 uppercase tracking-[0.3em] opacity-70">
                // EXEC: {activeSection.toUpperCase()}
              </p>
              <div className="hidden md:block text-[9px] text-emerald-900 font-mono">
                MEM_USAGE: {Math.floor(Math.random() * 500) + 200}MB
              </div>
            </header>

            {/* Renderowanie Treści */}
            <div className="min-h-[400px]">
              {activeSection === "about" && <SectionAbout />}
              {activeSection === "projects" && <SectionProjects />}
              {activeSection === "services" && <SectionServices />}
              {activeSection === "stack" && <SectionStack />}
              {activeSection === "contact" && <SectionContact />}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// --- KOMPONENTY SEKCJI ---

function SectionAbout() {
  // Rotujące role (bez "Jestem")
  const titles = [
    "FULLSTACK DEVELOPER",
    "SYSTEM ARCHITECT",
    "PROBLEM SOLVER",
    "PERFORMANCE EXPERT",
  ];

  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
    }, 3000); // Co 3 sekundy zmiana
    return () => clearInterval(interval);
  }, [titles.length]);

  // Lista Capabilities
  const skills = [
    "Aplikacje Webowe",
    "Aplikacje Mobilne",
    "Optymalizacja",
    "Debugowanie",
    "Projektowanie UI/UX",
    "Strony WWW",
  ];

  return (
    <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-16">
      {/* LEWA STRONA: OPIS */}
      <div className="flex-1 space-y-8">
        {/* NAGŁÓWEK TYTUŁU */}
        <div className="relative">
          <p className="text-[10px] text-emerald-500 font-bold tracking-[0.2em] mb-2 animate-pulse">
            // DETECTED_ROLE:
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tighter min-h-[80px]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ScrambleText
                key={currentTitleIndex}
                text={titles[currentTitleIndex]}
                scrambleSpeed={30}
              />
            </span>
          </h2>
        </div>

        {/* OPIS TEKSTOWY */}
        <div className="relative p-6 border-l-[3px] border-emerald-500 bg-black/40 backdrop-blur-sm">
          <p className="text-base leading-7 text-zinc-300">
            Dostarczam kompletne rozwiązania cyfrowe. Nie ograniczam się do
            jednej technologii – dobieram narzędzia tak, aby projekt był szybki,
            bezpieczny i skalowalny. Twoja wizja, przekształcona w działający
            kod.
          </p>
        </div>

        {/* LISTA CAPABILITIES */}
        <div>
          <h3 className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4 border-b border-emerald-500/20 pb-2">
            Core_Capabilities_v2.0
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {skills.map((skill, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-xs md:text-sm text-zinc-300 group cursor-default"
              >
                <div className="w-1.5 h-1.5 bg-emerald-500/50 rotate-45 group-hover:bg-emerald-400 group-hover:shadow-[0_0_8px_#34d399] transition-all" />
                <span className="group-hover:text-white transition-colors">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* STATYSTYKI */}
        <div className="flex gap-8 pt-6 border-t border-emerald-500/20 opacity-80">
          <div>
            <div className="text-2xl font-bold text-white">2+</div>
            <div className="text-[9px] uppercase tracking-widest text-emerald-600 font-bold">
              Lata Exp
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">100%</div>
            <div className="text-[9px] uppercase tracking-widest text-emerald-600 font-bold">
              Code Quality
            </div>
          </div>
        </div>
      </div>

      {/* PRAWA STRONA: HOLOGRAM */}
      <div className="flex-1 flex justify-center items-center w-full min-h-[300px]">
        <Hologram />
      </div>
    </div>
  );
}

function SectionProjects() {
  return (
    <div className="grid grid-cols-1 gap-12">
      {portfolioData.projects.map((project, idx) => (
        <article
          key={idx}
          className="group relative border-t border-emerald-500/30 pt-8 hover:border-emerald-500 transition-colors duration-500"
        >
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-4">
            <h3 className="text-2xl md:text-3xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
              <ScrambleText text={project.title} />
            </h3>
            <span className="text-xs font-mono text-emerald-600 border border-emerald-500/20 px-2 py-1 rounded bg-emerald-900/10">
              SECURED_ACCESS
            </span>
          </div>

          <p className="text-sm text-zinc-400 max-w-xl mb-6 leading-relaxed">
            {project.desc}
          </p>

          <div className="flex flex-wrap gap-3">
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] text-emerald-500/80 font-mono uppercase tracking-wider bg-emerald-500/5 px-2 py-1 border border-emerald-500/10"
              >
                {t}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

function SectionServices() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {portfolioData.services.map((s, i) => (
        <div
          key={i}
          className="bg-black/40 border border-white/10 p-8 hover:border-emerald-500/50 hover:bg-emerald-900/10 transition-all group backdrop-blur-sm"
        >
          <span className="text-emerald-600 font-mono text-xs mb-4 block group-hover:text-emerald-400 transition-colors">
            0{i + 1}_INIT
          </span>
          <h3 className="text-xl text-white mb-3 font-bold uppercase">
            <ScrambleText text={s.title} />
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
        </div>
      ))}
    </div>
  );
}

function SectionStack() {
  return (
    <div className="p-8 border border-emerald-500/20 bg-black/40 backdrop-blur-sm">
      <h3 className="text-emerald-500 text-xs uppercase tracking-[0.3em] mb-8">
        System_Resources
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
        {[
          "React",
          "Next.js",
          "TypeScript",
          "Node.js",
          "AWS",
          "Docker",
          "PostgreSQL",
          "Tailwind",
        ].map((tech) => (
          <div key={tech} className="flex flex-col gap-2 group cursor-default">
            <div className="w-full h-[1px] bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
            <span className="text-sm text-zinc-300 font-bold uppercase tracking-wider group-hover:text-emerald-400 transition-colors">
              {tech}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionContact() {
  return (
    <div className="border border-emerald-500/30 p-12 bg-black/60 backdrop-blur-md text-center relative overflow-hidden group">
      {/* Ozdobne tło wewnątrz kontaktu */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <h3 className="text-3xl text-emerald-400 mb-2 font-bold uppercase tracking-wider font-mono relative z-10">
        <ScrambleText text="Connect()" />
      </h3>
      <p className="text-zinc-500 mb-8 text-sm max-w-md mx-auto relative z-10">
        Połączenie szyfrowane. Gotowość do transmisji danych projektowych.
      </p>
      <a
        href={`mailto:${portfolioData.contact.email}`}
        className="relative z-10 inline-block border border-emerald-500 text-emerald-500 px-10 py-4 text-xs font-bold tracking-[0.2em] hover:bg-emerald-500 hover:text-black transition-all uppercase"
      >
        Wyślij Sygnał
      </a>
    </div>
  );
}

// --- KOMPONENT WIZUALNY: HOLOGRAM 3D ---
function Hologram() {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center pointer-events-none select-none">
      {/* 1. Zewnętrzny pierścień (wolny obrót) */}
      <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
      <div className="absolute inset-0 border-t-2 border-emerald-500/60 rounded-full animate-[spin_10s_linear_infinite]" />

      {/* 2. Środkowy pierścień (przeciwny obrót) */}
      <div className="absolute inset-8 border border-dashed border-emerald-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

      {/* 3. Wewnętrzny rdzeń (szybki obrót) */}
      <div className="absolute inset-20 border-2 border-emerald-400/10 rounded-full flex items-center justify-center animate-[spin_3s_linear_infinite]">
        <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_15px_#34d399]" />
      </div>

      {/* 4. "Skaner" (radar) */}
      <div className="absolute inset-4 rounded-full overflow-hidden opacity-20 animate-pulse">
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent to-emerald-500/50 animate-[spin_2s_linear_infinite] origin-right" />
      </div>

      {/* 5. Ikona / Symbol w środku */}
      <div className="absolute z-10 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>

      {/* 6. Pływające cząsteczki (kropki) */}
      <div className="absolute top-0 left-1/2 w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
      <div className="absolute bottom-10 right-10 w-1 h-1 bg-emerald-400 rounded-full animate-ping delay-700" />
      <div className="absolute top-10 left-10 w-1 h-1 bg-emerald-400 rounded-full animate-ping delay-300" />
    </div>
  );
}
