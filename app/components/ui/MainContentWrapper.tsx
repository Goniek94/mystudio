import React from "react";

export function MainContentWrapper({
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
