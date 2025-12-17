import React from "react";
import { portfolioData } from "@/app/components/data/content";

export function Contact() {
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
