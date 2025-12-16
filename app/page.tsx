"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/app/lib/cn";
import { portfolioData } from "@/app/components/data/content";
import { ScrambleText } from "@/app/components/ui/ScrambleText";
import { MatrixBackground } from "@/app/components/ui/MatrixBackground";
import { Logo } from "@/app/components/ui/Logo";
import { MatrixWorldMap } from "@/app/components/ui/MatrixWorldMap";

type SectionId =
  | "home"
  | "services"
  | "about"
  | "projects"
  | "stack"
  | "contact";
type Language = "pl" | "en";

const CONTENT = {
  pl: {
    menu: {
      home: "00_Start",
      services: "01_Oferta",
      about: "02_O mnie",
      projects: "03_Projekty",
      stack: "04_Technologia",
      contact: "05_Kontakt",
    },
    hero: {
      line1: "Jak chcesz dzisiaj",
      line2: "Zmienić Świat?",
      sub: "Pomożemy przekuć twoje myśli w działający projekt.",
      btn: "Zacznij tutaj_ [ENTER]",
    },
  },
  en: {
    menu: {
      home: "00_Home",
      services: "01_Services",
      about: "02_About",
      projects: "03_Projects",
      stack: "04_Tech Stack",
      contact: "05_Contact",
    },
    hero: {
      line1: "How do you want to",
      line2: "Change the World?",
      sub: "We help translate your thoughts into a working project.",
      btn: "Start Here_ [ENTER]",
    },
  },
};

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [lang, setLang] = useState<Language>("pl");

  const MENU_ITEMS: { id: SectionId; label: string }[] = [
    { id: "home", label: CONTENT[lang].menu.home },
    { id: "services", label: CONTENT[lang].menu.services },
    { id: "about", label: CONTENT[lang].menu.about },
    { id: "projects", label: CONTENT[lang].menu.projects },
    { id: "stack", label: CONTENT[lang].menu.stack },
    { id: "contact", label: CONTENT[lang].menu.contact },
  ];

  return (
    <main className="relative min-h-screen w-full text-zinc-300 font-mono overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      <MatrixBackground />
      <div className="fixed inset-0 bg-black/85 -z-10 backdrop-blur-[2px]" />

      <div className="relative z-10 mx-auto w-full min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr]">
        <aside className="relative md:h-screen md:sticky md:top-0 flex flex-col justify-between p-6 md:p-10 border-r border-emerald-500/20 bg-black/20 backdrop-blur-md z-20">
          <div>
            <Logo className="mb-12" />
            <div className="flex items-center gap-4 mb-8 text-xs font-bold tracking-widest font-mono">
              <button
                onClick={() => setLang("pl")}
                className={cn(
                  "transition-colors",
                  lang === "pl"
                    ? "text-emerald-400 underline decoration-2 underline-offset-4"
                    : "text-zinc-600 hover:text-zinc-400"
                )}
              >
                PL
              </button>
              <span className="text-zinc-700">/</span>
              <button
                onClick={() => setLang("en")}
                className={cn(
                  "transition-colors",
                  lang === "en"
                    ? "text-emerald-400 underline decoration-2 underline-offset-4"
                    : "text-zinc-600 hover:text-zinc-400"
                )}
              >
                EN
              </button>
            </div>
          </div>
          <nav className="mt-4 md:mt-0">
            <ul className="flex flex-col gap-3">
              {MENU_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "group relative flex items-center h-12 w-full text-left outline-none transition-all pl-5 border-l-2",
                      activeSection === item.id
                        ? "border-emerald-500 text-white bg-emerald-500/10 shadow-[inset_0_0_15px_rgba(16,185,129,0.15)]"
                        : "border-emerald-500/10 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/5 hover:border-emerald-500/50"
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs tracking-[0.2em] uppercase transition-all duration-300 font-medium",
                        activeSection === item.id
                          ? "translate-x-3 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]"
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
          <div className="hidden md:block text-[9px] text-zinc-600 border-t border-emerald-500/20 pt-6">
            <div className="flex justify-between items-center mb-1">
              <span>STATUS:</span>
              <span className="text-emerald-500/60 animate-pulse">ONLINE</span>
            </div>
          </div>
        </aside>

        <section className="relative w-full h-screen overflow-y-auto overflow-x-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent z-50" />

          <div className="flex-grow flex flex-col">
            {activeSection === "home" ? (
              <div className="animate-in fade-in zoom-in-95 duration-500 w-full h-full">
                <SectionHero
                  lang={lang}
                  onStartClick={() => setActiveSection("services")}
                />
              </div>
            ) : (
              <MainContentWrapper title={CONTENT[lang].menu[activeSection]}>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {activeSection === "services" && <SectionServices />}
                  {activeSection === "about" && <SectionAbout />}
                  {activeSection === "projects" && <SectionProjects />}
                  {activeSection === "stack" && <SectionStack />}
                  {activeSection === "contact" && <SectionContact />}
                </div>
              </MainContentWrapper>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function MainContentWrapper({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 md:p-12 lg:p-20 xl:p-24 flex flex-col justify-center min-h-screen">
      <header className="mb-16 border-b border-emerald-500/20 pb-6 animate-in fade-in slide-in-from-top-4 duration-700 font-mono">
        <p className="text-[10px] text-emerald-600/70 uppercase tracking-[0.4em] mb-2">
          // CURRENT_VIEW
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
          {title}
        </h1>
      </header>
      {children}
    </div>
  );
}

// --- POPRAWIONA SEKCJA HERO ---
function SectionHero({
  lang,
  onStartClick,
}: {
  lang: Language;
  onStartClick: () => void;
}) {
  const txt = CONTENT[lang].hero;

  return (
    <div className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* 1. TŁO - MAPA (Z MASKĄ CSS DLA PŁYNNEGO PRZEJŚCIA) */}
      <div className="absolute inset-0 z-0">
        {/* Kluczowa zmiana: [mask-image] 
            Gradient sprawia, że mapa jest niewidoczna po lewej (transparent) 
            i stopniowo pojawia się (black) w stronę prawej krawędzi.
         */}
        <div className="w-full h-full [mask-image:linear-gradient(to_right,transparent_0%,transparent_10%,black_60%,black_100%)]">
          <MatrixWorldMap className="w-full h-full opacity-70" />
        </div>
      </div>

      {/* 2. LEWA STRONA (TREŚĆ) */}
      <div className="relative z-10 w-full lg:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col justify-center h-full pointer-events-none">
        {/* pointer-events-auto na kontenerze tekstu, żeby dało się klikać przyciski, ale nie blokować tła */}
        <div className="max-w-xl space-y-8 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-black/40 backdrop-blur-sm text-emerald-400 text-[10px] tracking-widest uppercase mb-4 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Incoming_Transmission
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight drop-shadow-xl">
            <span className="block text-emerald-500/80 text-3xl md:text-4xl mb-2 font-normal">
              &gt; {txt.line1}
            </span>
            <span className="text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.6)] relative">
              <ScrambleText text={txt.line2} scrambleSpeed={35} />
              <span className="animate-[blink_1s_step-end_infinite] ml-1">
                _
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-300 leading-relaxed border-l-2 border-emerald-500/50 pl-6 bg-gradient-to-r from-black/50 to-transparent py-2">
            // {txt.sub}
          </p>

          <div className="pt-8">
            <button
              onClick={onStartClick}
              className="group relative px-8 py-4 bg-emerald-500/10 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black font-bold text-sm tracking-[0.2em] uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]"
            >
              {txt.btn}
            </button>
          </div>
        </div>
      </div>

      {/* Dodatki dekoracyjne */}
      <div className="absolute bottom-10 left-6 md:left-20 text-[10px] text-emerald-600/50 tracking-widest z-20 font-mono">
        COORDINATES: 52.2297° N, 21.0122° E [WAW]
      </div>
      <div className="absolute top-10 right-10 text-[8rem] font-black text-white/[0.02] pointer-events-none select-none leading-none -z-10 blur-sm font-mono hidden lg:block">
        SYS
      </div>
    </div>
  );
}

// --- POZOSTAŁE SEKCJE (BEZ ZMIAN) ---
function SectionAbout() {
  const titles = ["FULLSTACK DEV", "ARCHITECT", "CREATOR"];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setIdx((p) => (p + 1) % titles.length), 3000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-start">
      <div className="flex-1 space-y-8">
        <h2 className="text-4xl font-bold text-white">
          <span className="text-emerald-500">//</span> WHO_AM_I?
        </h2>
        <div className="text-xl text-emerald-400">
          {" "}
          &gt; <ScrambleText text={titles[idx]} />
        </div>
        <p className="text-zinc-400 leading-relaxed text-lg">
          Jestem programistą, który patrzy na kod jak na sztukę użytkową. Nie
          interesuje mnie tylko "dowiezienie" projektu – interesuje mnie
          stworzenie systemu, który będzie szybki, bezpieczny i gotowy na
          przyszłość.
        </p>
      </div>
      <div className="w-full lg:w-1/3 aspect-square bg-zinc-900 border border-zinc-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <span className="text-zinc-700 text-xs">IMG_PLACEHOLDER</span>
      </div>
    </div>
  );
}

function SectionServices() {
  return (
    <div className="space-y-12">
      <p className="text-xl text-emerald-400 max-w-2xl">
        Dostarczamy kompletny ekosystem rozwiązań. Od pierwszej linii kodu po
        wdrożenie na produkcję.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        {portfolioData.services.map((s, i) => (
          <div
            key={i}
            className="bg-black/40 border border-emerald-500/20 p-8 hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 text-4xl font-black text-emerald-500 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              0{i + 1}
            </div>
            <h3 className="text-xl text-white mb-4 font-bold uppercase tracking-wide group-hover:text-emerald-400 transition-colors">
              {s.title}
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionProjects() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {portfolioData.projects.map((project, idx) => (
        <article
          key={idx}
          className="border border-zinc-800 bg-zinc-900/30 p-8 hover:border-emerald-500/50 transition-all"
        >
          <h3 className="text-2xl font-bold text-zinc-100 mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-zinc-400 mb-6">{project.desc}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="text-xs text-emerald-500 bg-emerald-500/10 px-2 py-1 border border-emerald-500/20"
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

function SectionStack() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        "React",
        "Next.js",
        "TypeScript",
        "Node.js",
        "Tailwind",
        "Docker",
        "AWS",
        "Figma",
      ].map((tech) => (
        <div
          key={tech}
          className="p-4 border border-zinc-800 text-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-500 transition-all cursor-default uppercase tracking-widest text-sm font-bold"
        >
          {tech}
        </div>
      ))}
    </div>
  );
}

function SectionContact() {
  return (
    <div className="w-full max-w-2xl mx-auto border border-emerald-500/30 p-12 bg-black/60 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
      <h3 className="text-3xl text-white mb-6 font-black uppercase tracking-widest relative z-10">
        Start_Project()
      </h3>
      <p className="text-zinc-400 mb-8 relative z-10">
        Masz pomysł? My mamy technologię. Połączmy to.
      </p>
      <a
        href={`mailto:${portfolioData.contact.email}`}
        className="relative z-10 inline-block bg-emerald-500 text-black font-bold px-8 py-4 uppercase tracking-[0.2em] hover:bg-emerald-400 transition-colors"
      >
        Napisz do nas
      </a>
    </div>
  );
}
