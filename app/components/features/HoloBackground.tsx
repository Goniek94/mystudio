"use client";

import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Sparkles, Grid, Stars } from "@react-three/drei";
import * as THREE from "three";

export const HoloBackground = () => {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Użyj fallbacka, jeśli nie masz zdjęcia, żeby się nie wywaliło
  const texture = useLoader(THREE.TextureLoader, "/img/holo-bg.jpg");

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group>
      {/* 1. KOPUŁA TŁA */}
      <mesh ref={meshRef} scale={[-1, 1, 1]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[50, 64, 64]} />
        <meshBasicMaterial
          map={texture}
          side={THREE.BackSide}
          transparent
          opacity={0.3} // Ciemne tło (30%), żeby neonowe karty świeciły
          color="#0066ff"
          toneMapped={false}
        />
      </mesh>

      {/* 2. SIATKA */}
      <Grid
        position={[0, -5, 0]}
        args={[60, 60]}
        cellSize={1.0}
        sectionSize={5.0}
        cellThickness={1.0}
        sectionThickness={1.5}
        cellColor="#001133"
        sectionColor="#004488"
        fadeDistance={40}
        fadeStrength={1}
        infiniteGrid
      />

      {/* 3. CZĄSTECZKI */}
      <Sparkles
        count={300}
        scale={[40, 20, 40]}
        size={4}
        speed={0.5}
        opacity={0.5}
        color="#00ffff"
      />
      <Stars
        radius={60}
        depth={50}
        count={1000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
    </group>
  );
};
