"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { PROJECTS_DATA } from "@/app/components/data/ProjectsData";
import { HoloProjectCard } from "./HoloProjectCard";
import { MatrixBackground } from "@/app/components/ui/MatrixBackground";

export const HologramGallery = ({ onEnterProject, lang }: any) => {
  const projectsList = Object.values(PROJECTS_DATA);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Matrix Background */}
      <MatrixBackground />

      {/* Dark overlay for better card visibility */}
      <div className="absolute inset-0 bg-black/70 z-0" />

      {/* Title overlay */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center">
        <div className="relative">
          <h2
            className="text-5xl md:text-7xl font-black mb-3 tracking-tight"
            style={{
              background:
                "linear-gradient(135deg, #00ffff 0%, #00ff88 30%, #8a2be2 60%, #ff00ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 30px rgba(0, 255, 255, 0.5))",
            }}
          >
            {lang === "pl" ? "LOBBY PROJEKTÓW" : "PROJECT LOBBY"}
          </h2>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full" />
        </div>
        <p className="text-cyan-300/70 text-sm font-mono uppercase tracking-[0.3em] mt-4">
          {lang === "pl"
            ? "Wybierz projekt aby zobaczyć szczegóły"
            : "Select a project to view details"}
        </p>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
        <div
          className="px-6 py-3 rounded-full backdrop-blur-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(138, 43, 226, 0.1))",
            border: "1px solid rgba(0, 255, 255, 0.3)",
            boxShadow: "0 0 30px rgba(0, 255, 255, 0.2)",
          }}
        >
          <p className="text-cyan-300 text-xs font-mono uppercase tracking-wider flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {lang === "pl"
              ? "Kliknij w kartę aby zobaczyć szczegóły"
              : "Click on a card to view details"}
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </p>
        </div>
      </div>

      {/* 3D Canvas with cards */}
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
        {/* Fixed camera - no zoom/pan */}
        <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={50} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.8}
          color="#ff00ff"
        />
        <spotLight
          position={[0, 15, 5]}
          angle={0.5}
          penumbra={1}
          intensity={1.2}
          castShadow
          color="#ffffff"
        />

        {/* Stars background */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />

        {/* Project cards in a straight line */}
        <group position={[0, 0, 0]}>
          {projectsList.map((project, idx) => {
            // Smaller spacing to fit 5+ cards
            const spacing = 4;
            const totalWidth = (projectsList.length - 1) * spacing;
            const xPosition = idx * spacing - totalWidth / 2;

            return (
              <group key={project.id} position={[xPosition, 0, 0]}>
                <HoloProjectCard
                  project={project}
                  lang={lang}
                  onSelect={() => onEnterProject(project.id)}
                />
              </group>
            );
          })}
        </group>

        {/* Floor grid */}
        <gridHelper
          args={[60, 60, "#00ffff", "#003333"]}
          position={[0, -4, 0]}
          rotation={[0, 0, 0]}
        />

        {/* Post-processing effects */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.3}
            intensity={1.5}
            levels={9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
