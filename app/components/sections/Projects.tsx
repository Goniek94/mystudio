"use client";

import React, { useState } from "react";
import { HologramGallery } from "@/app/components/features/HologramGallery";
import { ProjectDetails } from "@/app/components/sections/ProjectDetails";

export function Projects({ lang }: { lang: "pl" | "en" }) {
  const [viewMode, setViewMode] = useState<"lobby" | "details">("lobby");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setViewMode("details");
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {viewMode === "lobby" ? (
        <HologramGallery lang={lang} onEnterProject={handleSelect} />
      ) : (
        <ProjectDetails
          projectId={selectedId}
          lang={lang}
          onBack={() => setViewMode("lobby")}
        />
      )}
    </section>
  );
}
