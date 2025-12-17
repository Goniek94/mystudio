"use client";

import React from "react";
import { ScrambleText } from "@/app/components/ui/ScrambleText";
import { MatrixWorldMap } from "@/app/components/ui/MatrixWorldMap";
import { CONTENT, Language } from "@/app/lib/ui-content";

export function Hero({
  lang,
  onStartClick,
}: {
  lang: Language;
  onStartClick: () => void;
}) {
  const txt = CONTENT[lang].hero;

  return (
    <div className="relative w-full min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full [mask-image:linear-gradient(to_right,transparent_0%,transparent_10%,black_60%,black_100%)]">
          <MatrixWorldMap className="w-full h-full opacity-70" />
        </div>
      </div>

      <div className="relative z-10 w-full lg:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col justify-center h-full pointer-events-none">
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

      <div className="absolute bottom-10 left-6 md:left-20 text-[10px] text-emerald-600/50 tracking-widest z-20 font-mono">
        COORDINATES: 52.2297° N, 21.0122° E [WAW]
      </div>
      <div className="absolute top-10 right-10 text-[8rem] font-black text-white/[0.02] pointer-events-none select-none leading-none -z-10 blur-sm font-mono hidden lg:block">
        SYS
      </div>
    </div>
  );
}
