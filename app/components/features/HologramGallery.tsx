"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { PROJECTS_DATA } from "@/app/components/data/ProjectsData";
import { HoloProjectCard } from "./HoloProjectCard";

export const HologramGallery = ({ onEnterProject, lang }: any) => {
  const projectsList = Object.values(PROJECTS_DATA);

  return (
    <div className="w-full h-screen bg-[#020617]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        <ambientLight intensity={0.5} />

        <group>
          {projectsList.map((project, idx) => (
            <group
              key={project.id}
              position={[(idx - (projectsList.length - 1) / 2) * 7, 0, 0]}
            >
              <HoloProjectCard
                project={project}
                lang={lang}
                onSelect={() => onEnterProject(project.id)}
              />
            </group>
          ))}
        </group>

        <EffectComposer>
          <Bloom luminanceThreshold={0.5} intensity={1.5} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
