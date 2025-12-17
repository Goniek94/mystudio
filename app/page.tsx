"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/app/lib/cn";
import { MatrixBackground } from "@/app/components/ui/MatrixBackground";
import { Logo } from "@/app/components/ui/Logo";
import { CONTENT, Language } from "@/app/lib/ui-content";
import { MainContentWrapper } from "@/app/components/ui/MainContentWrapper";
import { Hero } from "@/app/components/sections/Hero";
import { Services } from "@/app/components/sections/Services";
import { About } from "@/app/components/sections/About";
import { Projects } from "@/app/components/sections/Projects";
import { Stack } from "@/app/components/sections/Stack";
import { Contact } from "@/app/components/sections/Contact";

type SectionId =
  | "home"
  | "services"
  | "about"
  | "projects"
  | "stack"
  | "contact";

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [lang, setLang] = useState<Language>("pl");

  // Sprawdzamy, czy jesteśmy w projektach
  const isProjects = activeSection === "projects";

  const MENU_ITEMS = useMemo(
    () => [
      { id: "home", label: CONTENT[lang].menu.home },
      { id: "services", label: CONTENT[lang].menu.services },
      { id: "about", label: CONTENT[lang].menu.about },
      { id: "projects", label: CONTENT[lang].menu.projects },
      { id: "stack", label: CONTENT[lang].menu.stack },
      { id: "contact", label: CONTENT[lang].menu.contact },
    ],
    [lang]
  );

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="animate-in fade-in zoom-in-95 duration-500 w-full h-full">
            <Hero
              lang={lang}
              onStartClick={() => setActiveSection("services")}
            />
          </div>
        );
      case "projects":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
            <Projects lang={lang} />
          </div>
        );
      default:
        const menuKey = activeSection as
          | "services"
          | "about"
          | "stack"
          | "contact";
        return (
          <MainContentWrapper title={CONTENT[lang].menu[menuKey]}>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              {activeSection === "services" && <Services />}
              {activeSection === "about" && <About />}
              {activeSection === "stack" && <Stack />}
              {activeSection === "contact" && <Contact />}
            </div>
          </MainContentWrapper>
        );
    }
  };

  return (
    <main className="relative min-h-screen w-full text-zinc-300 font-mono overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. WAŻNE: Renderujemy Matrixa TYLKO, gdy NIE jesteśmy w projektach */}
      {!isProjects && <MatrixBackground />}

      {/* 2. WAŻNE: Czarną zasłonę też zdejmujemy w projektach, żeby było widać 3D */}
      {!isProjects && (
        <div className="fixed inset-0 bg-black/85 -z-10 backdrop-blur-[2px]" />
      )}

      <div className="relative z-10 mx-auto w-full min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr]">
        <aside className="relative md:h-screen md:sticky md:top-0 flex flex-col justify-between p-6 md:p-10 border-r border-emerald-500/20 bg-black/20 backdrop-blur-md z-20">
          <div>
            <Logo className="mb-12" />
            <div className="flex items-center gap-4 mb-8 text-xs font-bold tracking-widest font-mono">
              {(["pl", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "transition-colors uppercase",
                    lang === l
                      ? "text-emerald-400 underline decoration-2 underline-offset-4"
                      : "text-zinc-600 hover:text-zinc-400"
                  )}
                >
                  {l}
                </button>
              ))}
              <span className="text-zinc-700 absolute left-[38px] pointer-events-none">
                /
              </span>
            </div>
          </div>
          <nav className="mt-4 md:mt-0">
            <ul className="flex flex-col gap-3">
              {MENU_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id as SectionId)}
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

        <section className="relative w-full h-screen overflow-y-auto overflow-x-hidden flex flex-col scroll-smooth">
          <div className="flex-grow flex flex-col">{renderSection()}</div>
        </section>
      </div>
    </main>
  );
}
