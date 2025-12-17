"use client";
import React, { useState, useEffect } from "react";
import { ScrambleText } from "@/app/components/ui/ScrambleText";

export function About() {
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
