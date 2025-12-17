import React from "react";

export function Stack() {
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
