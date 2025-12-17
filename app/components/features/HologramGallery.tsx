"use client";

import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Html,
  Text,
  Float,
  OrbitControls,
  PerspectiveCamera,
  Stars,
  Sparkles,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { PROJECTS_DATA } from "@/app/components/data/ProjectsData";
import { cn } from "@/app/lib/cn";
import { Lock, ArrowRight, Zap, Globe, Cpu, Layers } from "lucide-react";

const projectsList = Object.values(PROJECTS_DATA);

// --- KARTA 3D ---
function HologramCard({ project, index, total, onEnter, lang }: any) {
  const [hovered, setHovered] = useState(false);

  // Rozmieszczenie kart w okręgu (karuzela)
  const radius = 5.5;
  const angle = (index / total) * Math.PI * 2;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    // Karty zawsze patrzą w środek (0,0,0)
    if (groupRef.current) {
      groupRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Niewidzialna płaszczyzna do łapania hovera */}
          <planeGeometry args={[4.5, 3]} />
          <meshBasicMaterial transparent opacity={0} />

          {/* HTML Overlay - To jest właściwy wygląd karty */}
          <Html
            transform
            occlude="blending"
            distanceFactor={3}
            position={[0, 0, 0]}
            style={{
              transition: "all 0.4s",
              transform: hovered ? "scale(1.1)" : "scale(1)",
              opacity: hovered ? 1 : 0.7,
            }}
          >
            <div
              className={cn(
                "w-[450px] h-[300px] flex flex-col justify-between p-6 select-none overflow-hidden border-2 bg-black/80 backdrop-blur-md",
                hovered
                  ? "border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.4)]"
                  : "border-emerald-500/30 grayscale-[0.5]"
              )}
            >
              {/* Scanlines tła */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none z-0" />

              {/* Nagłówek */}
              <div className="relative z-10 flex justify-between items-start border-b border-emerald-500/30 pb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/20 p-2 rounded border border-emerald-500/50">
                    <Globe className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-500/60 font-mono tracking-widest">
                      PROJECT ID: {project.id.toUpperCase()}
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-100 font-mono uppercase truncate w-[240px]">
                      {lang === "pl" ? project.title.pl : project.title.en}
                    </h3>
                  </div>
                </div>
                {project.nda && (
                  <div className="flex items-center gap-1 px-2 py-1 border border-red-500/50 bg-red-500/10 rounded text-red-400 text-[10px] font-mono animate-pulse">
                    <Lock size={10} /> RESTRICTED
                  </div>
                )}
              </div>

              {/* Opis */}
              <div className="relative z-10 mt-2">
                <p className="text-sm text-emerald-500/80 font-mono leading-relaxed line-clamp-3">
                  {lang === "pl" ? project.desc.pl : project.desc.en}
                </p>
              </div>

              {/* Stopka i Przycisk */}
              <div className="relative z-10 mt-auto flex justify-between items-end">
                <div className="flex gap-2 text-emerald-500/40">
                  <Cpu size={16} />
                  <Layers size={16} />
                  <Zap size={16} />
                </div>

                <button
                  onClick={() => onEnter(project.id)}
                  className={cn(
                    "group/btn px-6 py-2 bg-emerald-500/10 border border-emerald-500/50 hover:bg-emerald-500 text-emerald-400 hover:text-black font-mono font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                    hovered ? "shadow-[0_0_20px_rgba(16,185,129,0.4)]" : ""
                  )}
                >
                  <span>{lang === "pl" ? "Otwórz" : "Initialize"}</span>
                  <ArrowRight
                    size={16}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </Html>
        </mesh>
      </Float>
    </group>
  );
}

// --- GŁÓWNA SCENA ---
interface HologramGalleryProps {
  onEnterProject: (id: string) => void;
  lang: "pl" | "en";
}

export const HologramGallery = ({
  onEnterProject,
  lang,
}: HologramGalleryProps) => {
  return (
    <div className="w-full h-[85vh] relative animate-in fade-in duration-1000">
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)]" />

      {/* Instrukcja na dole */}
      <div className="absolute bottom-10 w-full text-center z-20 pointer-events-none">
        <p className="text-emerald-500/50 text-xs font-mono uppercase tracking-[0.3em] animate-pulse">
          {lang === "pl" ? "< PRZECIĄGNIJ ABY OBRÓCIĆ >" : "< DRAG TO ROTATE >"}
        </p>
      </div>

      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 2, 9]} fov={55} />

        {/* Efekty Środowiskowe */}
        <color attach="background" args={["#000500"]} />
        <fog attach="fog" args={["#000500", 5, 25]} />
        <Stars
          radius={50}
          depth={50}
          count={2000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
        <Sparkles
          count={150}
          scale={12}
          size={2}
          speed={0.2}
          opacity={0.5}
          color="#10b981"
        />

        {/* Oświetlenie */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#10b981" />
        <pointLight position={[-10, 0, -10]} intensity={0.5} color="#059669" />

        {/* Centralny Hologram (Dekoracja środka) */}
        <mesh position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[6, 32]} />
          <meshBasicMaterial
            color="#064e3b"
            transparent
            opacity={0.15}
            wireframe
          />
        </mesh>

        {/* Karuzela Kart */}
        <group position={[0, 0, 0]}>
          {projectsList.map((project, idx) => (
            <HologramCard
              key={project.id}
              index={idx}
              total={projectsList.length}
              project={project}
              onEnter={onEnterProject}
              lang={lang}
            />
          ))}
        </group>

        {/* Sterowanie */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2.5}
        />

        {/* Post-processing (GLOW) */}
        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={0.2}
            mipmapBlur
            intensity={1.2}
            radius={0.5}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
