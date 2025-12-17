"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Cylinder, Cone } from "@react-three/drei";

export const ProjectorBeam = () => {
  const beamRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Migotanie wiązki
    if (beamRef.current) {
      const opacity = 0.1 + Math.sin(t * 10) * 0.05;
      // @ts-ignore
      beamRef.current.material.opacity = opacity;
      beamRef.current.scale.setScalar(1 + Math.sin(t * 5) * 0.02);
    }
  });

  return (
    <group position={[0, -2.5, 0]}>
      {/* Baza fizyczna (urządzenie) */}
      <Cylinder args={[1.2, 1.5, 0.5, 32]}>
        <meshStandardMaterial color="#050505" metalness={0.9} roughness={0.2} />
      </Cylinder>

      {/* Pierścień świecący */}
      <Cylinder args={[1.0, 1.0, 0.55, 32]}>
        <meshBasicMaterial color="#00ffea" />
      </Cylinder>

      {/* WIĄZKA ŚWIATŁA (Cone) */}
      <mesh ref={beamRef} position={[0, 3.5, 0]} rotation={[0, 0, 0]}>
        {/* Cylinder otwarty górą, symulujący promień */}
        <cylinderGeometry args={[4.0, 1.0, 7, 32, 1, true]} />
        <meshBasicMaterial
          color="#00ffea"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* "Dno" światła (intensywne) */}
      <mesh position={[0, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
