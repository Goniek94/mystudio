"use client";

import React, { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";

// --- 1. SCENA (GEOMETRIA) ---
// Tego używamy wewnątrz <HoloCarousel>, bo tam już jest Canvas
export function HoloBackgroundScene() {
  const texture = useLoader(THREE.TextureLoader, "/img/Holo-bg.jpg");
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh>
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial
        map={texture}
        side={THREE.BackSide}
        toneMapped={false}
      />
    </mesh>
  );
}

// --- 2. WRAPPER (KOMPONENT) ---
// Tego używamy w <Projects>, żeby stworzyć nowy Canvas w tle
export const HoloBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full -z-10">
      <Canvas
        camera={{ position: [0, 0, 0.1], fov: 75 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <HoloBackgroundScene />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        <Preload all />
      </Canvas>
    </div>
  );
};
