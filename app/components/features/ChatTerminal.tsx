"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/app/lib/cn";

type Message = {
  role: "system" | "user" | "bot";
  text: string;
};

export function ChatTerminal({ className }: { className?: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", text: "INICJALIZACJA POŁĄCZENIA..." },
    { role: "system", text: "SZYFROWANIE TLS 1.3: AKTYWNE" },
    {
      role: "bot",
      text: "Witaj, Operatorze. Wpisz 'pomoc', aby zobaczyć listę komend.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");

    // Symulacja "myślenia" bota
    setTimeout(() => {
      let response = "Nieznana komenda. Wpisz 'pomoc'.";
      const lower = userMsg.toLowerCase();

      if (lower.includes("pomoc")) {
        response =
          "Dostępne komendy: \n- 'oferta': Zobacz zakres usług\n- 'kontakt': Dane kontaktowe\n- 'stack': Technologie";
      } else if (lower.includes("kontakt")) {
        response = "Email: contact@mystudio.dev | GitHub: github.com/goniek94";
      } else if (lower.includes("oferta")) {
        response =
          "Tworzenie aplikacji webowych (React/Next.js), Audyty kodu, Integracje API.";
      } else if (lower.includes("stack")) {
        response = "Core: TypeScript, React, Node.js, AWS, TailwindCSS.";
      }

      setMessages((prev) => [...prev, { role: "bot", text: response }]);
    }, 500);
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-emerald-500/30 bg-zinc-950/90 font-mono text-sm shadow-2xl backdrop-blur-md",
        className
      )}
    >
      {/* Pasek tytułowy */}
      <div className="flex items-center justify-between border-b border-emerald-500/20 bg-emerald-950/30 px-4 py-2">
        <span className="text-xs font-bold tracking-widest text-emerald-400">
          TERMINAL_V2
        </span>
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-500/50" />
          <div className="h-2 w-2 rounded-full bg-yellow-500/50" />
          <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
        </div>
      </div>

      {/* Obszar wiadomości */}
      <div className="flex-1 space-y-2 overflow-y-auto p-4 h-[300px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-emerald-900/50">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[90%] break-words",
              m.role === "user" ? "ml-auto text-right" : "text-left"
            )}
          >
            <span
              className={cn(
                "inline-block px-2 py-1 rounded",
                m.role === "system" && "text-xs text-zinc-500 italic",
                m.role === "bot" && "text-emerald-300",
                m.role === "user" &&
                  "bg-emerald-900/20 text-emerald-100 border border-emerald-500/20"
              )}
            >
              {m.role === "bot" && (
                <span className="mr-2 select-none text-emerald-600">{">"}</span>
              )}
              {m.text}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex border-t border-emerald-500/30 bg-black/40 p-2"
      >
        <span className="py-2 pl-2 pr-2 text-emerald-500 animate-pulse">
          {">"}
        </span>
        <input
          className="flex-1 bg-transparent text-emerald-100 placeholder-emerald-800/50 focus:outline-none"
          placeholder="Wpisz komendę..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}
