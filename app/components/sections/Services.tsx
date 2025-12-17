import React from "react";
import { portfolioData } from "@/app/components/data/content";

export function Services() {
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
