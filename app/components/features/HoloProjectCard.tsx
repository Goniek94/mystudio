"use client";

import React, { useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { HolographicMaterial } from "./HolographicMaterial";

export function HoloProjectCard({ onSelect }: any) {
  // 🔹 ŁADUJEMY STRUKTURĘ
  const texture = useTexture("/img/hologram-cards.jpg");

  // 🔹 MATERIAŁ
  const material = useMemo(() => new HolographicMaterial() as any, []);

  useEffect(() => {
    material.uTexture = texture;
  }, [material, texture]);

  useFrame((state) => {
    material.uTime = state.clock.elapsedTime;
  });

  return (
    <group onClick={onSelect}>
      <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh>
          {/* 🔥 DUŻO SEGMENTÓW — OBRAZ RZEŹBI GEOMETRIĘ */}
          <planeGeometry args={[4, 5.5, 250, 250]} />

          <primitive
            object={material}
            attach="material"
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      </Float>
    </group>
  );
}
