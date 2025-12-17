"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileCode, GitBranch, Cpu, FastForward } from "lucide-react";
import { cn } from "@/app/lib/cn";
import { REAL_CODE_SNIPPETS } from "@/app/components/data/RealProjectCode";

type Language = "pl" | "en";

export function BackendTerminal({ lang }: { lang: Language }) {
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Refy
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Funkcja czyszcząca timeout bezpiecznie
  const clearTypingTimeout = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  // Funkcja: Pomiń animację (Pokaż cały kod od razu)
  const handleSkip = () => {
    if (!isTyping) return; // Jeśli już skończył, nic nie rób

    clearTypingTimeout();

    const snippet = REAL_CODE_SNIPPETS[currentSnippetIndex];
    setDisplayedCode(snippet.code);
    setIsTyping(false);

    // Przewiń na dół, żeby pokazać koniec pliku
    if (codeContainerRef.current) {
      codeContainerRef.current.scrollTop =
        codeContainerRef.current.scrollHeight;
    }

    // Ustaw timer do następnego slajdu (tak jakby skończył pisać naturalnie)
    typingTimeoutRef.current = setTimeout(() => {
      setCurrentSnippetIndex((prev) => (prev + 1) % REAL_CODE_SNIPPETS.length);
    }, 12000); // 12 sekund na przeczytanie całości
  };

  // Efekt pisania (Slow Motion)
  useEffect(() => {
    const snippet = REAL_CODE_SNIPPETS[currentSnippetIndex];
    const fullCode = snippet.code;
    let charIndex = 0;

    setDisplayedCode("");
    setIsTyping(true);
    clearTypingTimeout();

    const typeNextChar = () => {
      if (charIndex < fullCode.length) {
        const char = fullCode.charAt(charIndex);

        setDisplayedCode((prev) => prev + char);
        charIndex++;

        // Auto-scroll na dół
        if (codeContainerRef.current) {
          codeContainerRef.current.scrollTop =
            codeContainerRef.current.scrollHeight;
        }

        // --- ALGORYTM "LUDZKIEGO PISANIA" ---
        let delay = 40;

        if (char === "\n") {
          delay = Math.random() * 500 + 300; // Długa pauza przy nowej linii
        } else if (char === "{" || char === "}" || char === ";") {
          delay += 100;
        } else if (char === " ") {
          delay = 10;
        } else {
          delay += Math.random() * 40 - 10;
        }

        typingTimeoutRef.current = setTimeout(typeNextChar, delay);
      } else {
        setIsTyping(false);
        // Czekamy 12 sekund po zakończeniu pliku
        typingTimeoutRef.current = setTimeout(() => {
          setCurrentSnippetIndex(
            (prev) => (prev + 1) % REAL_CODE_SNIPPETS.length
          );
        }, 12000);
      }
    };

    // Start pisania po sekundzie
    typingTimeoutRef.current = setTimeout(typeNextChar, 1000);

    return () => {
      clearTypingTimeout();
    };
  }, [currentSnippetIndex]);

  const currentSnippet = REAL_CODE_SNIPPETS[currentSnippetIndex];

  return (
    <div
      className="absolute inset-0 bg-[#0d1117] flex flex-col font-mono text-xs md:text-sm text-gray-300 group/terminal"
      onClick={handleSkip} // Kliknięcie w dowolnym miejscu pomija
    >
      {/* Wskaźnik "Click to Skip" (pojawia się na hover, gdy pisze) */}
      {isTyping && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-white text-xs opacity-0 group-hover/terminal:opacity-100 transition-opacity pointer-events-none z-50 flex items-center gap-2">
          <FastForward size={12} className="text-amber-500 animate-pulse" />
          Click to Show Full Code
        </div>
      )}

      {/* Pasek zakładek (Tabs) */}
      <div className="flex items-center bg-[#010409] border-b border-white/10 overflow-x-auto no-scrollbar z-10">
        {REAL_CODE_SNIPPETS.map((snip, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation(); // Żeby klik w tab nie wywołał skipu
              setCurrentSnippetIndex(i);
            }}
            className={cn(
              "px-4 py-2 border-r border-white/5 flex items-center gap-2 whitespace-nowrap transition-colors min-w-fit hover:bg-[#161b22]",
              i === currentSnippetIndex
                ? "bg-[#0d1117] text-white border-t-2 border-t-amber-500"
                : "text-gray-500 opacity-50 bg-[#010409]"
            )}
          >
            <FileCode
              size={14}
              className={cn(
                "text-blue-400",
                i === currentSnippetIndex && "text-yellow-400"
              )}
            />
            {snip.file.split("/").pop()?.replace(".js", ".ts")}
          </button>
        ))}
      </div>

      {/* Obszar kodu */}
      <div
        ref={codeContainerRef}
        className={cn(
          "flex-grow p-4 overflow-y-auto custom-scrollbar relative scroll-smooth",
          isTyping && "cursor-pointer" // Kursor rączki gdy pisze
        )}
      >
        {/* Numery linii */}
        <div className="absolute left-2 top-4 bottom-4 w-6 text-right text-gray-700 select-none hidden md:block text-[10px] leading-relaxed font-mono opacity-50">
          {Array.from({ length: displayedCode.split("\n").length + 5 }).map(
            (_, i) => (
              <div key={i}>{i + 1}</div>
            )
          )}
        </div>

        <div className="md:pl-8">
          <pre className="whitespace-pre-wrap font-mono leading-relaxed text-[11px] md:text-xs text-gray-300">
            <code
              dangerouslySetInnerHTML={{
                __html: displayedCode
                  .replace(
                    /import|from|export|class|const|let|var|async|await|return|if|try|catch|new|function|static|constructor/g,
                    '<span class="text-purple-400 font-bold">$&</span>'
                  )
                  .replace(
                    /this\./g,
                    '<span class="text-blue-300">this.</span>'
                  )
                  .replace(
                    /\/\/.*/g,
                    '<span class="text-gray-500 italic">$&</span>'
                  )
                  .replace(/'.*?'/g, '<span class="text-green-400">$&</span>')
                  .replace(/".*?"/g, '<span class="text-green-400">$&</span>')
                  .replace(
                    /\b(console|logger|socket|io)\b/g,
                    '<span class="text-yellow-300">$&</span>'
                  )
                  .replace(/=>/g, '<span class="text-blue-400">=></span>')
                  .replace(/{|}/g, '<span class="text-yellow-500">$&</span>'),
              }}
            />
            <span
              className={cn(
                "inline-block w-2 h-4 bg-amber-500 align-middle ml-1",
                isTyping ? "animate-pulse" : "opacity-0"
              )}
            ></span>
          </pre>
        </div>
      </div>

      {/* Panel Informacyjny */}
      <div
        className="border-t border-white/10 bg-[#161b22] p-3 animate-fade-in transition-all duration-500 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 text-amber-500 mb-1 font-mono text-[10px] uppercase tracking-widest">
          <Cpu size={12} className={isTyping ? "animate-spin" : ""} />
          {isTyping ? "WRITING SOURCE CODE..." : "COMPILATION FINISHED"}
        </div>
        <div className="flex justify-between items-start gap-4">
          <div>
            <h4 className="text-white font-bold text-xs mb-1 flex items-center gap-2">
              {currentSnippet.type}
            </h4>
            <p className="text-gray-400 text-[10px] leading-relaxed font-sans max-w-xl">
              {currentSnippet.insight[lang]}
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-[10px] text-gray-600 bg-black/20 px-2 py-1 rounded border border-white/5 font-mono">
              {currentSnippet.file.replace(".js", ".ts")}
            </span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-[#010409] border-t border-white/10 p-1 px-3 flex justify-between items-center text-[9px] text-gray-600 select-none z-10">
        <div className="flex gap-3">
          <span className="flex items-center gap-1">
            <GitBranch size={10} /> main
          </span>
          <span>utf-8</span>
        </div>
        <div className="flex gap-3">
          <span>TypeScript</span>
          <span>Ln {displayedCode.split("\n").length}, Col 1</span>
        </div>
      </div>
    </div>
  );
}
