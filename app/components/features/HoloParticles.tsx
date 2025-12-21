"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HoloParticlesProps {
  count?: number;
  radius?: number;
  color?: string;
}

// WAŻNE: Musi być "export function", a nie "export default"
export function HoloParticles({
  count = 200,
  radius = 12,
  color = "#00ffea",
}: HoloParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions, sizes, colors, speeds] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 4;
      const y = (Math.random() - 0.5) * 8;

      positions[i * 3] = Math.sin(angle) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.cos(angle) * r - radius;

      sizes[i] = Math.random() * 0.08 + 0.02;

      const colorVariation = new THREE.Color(color);
      colorVariation.offsetHSL(0, 0, Math.random() * 0.3 - 0.15);
      colors[i * 3] = colorVariation.r;
      colors[i * 3 + 1] = colorVariation.g;
      colors[i * 3 + 2] = colorVariation.b;

      speeds[i] = Math.random() * 0.5 + 0.2;
    }

    return [positions, sizes, colors, speeds];
  }, [count, radius, color]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const speed = speeds[i];
      positions[i3 + 1] += Math.sin(time * speed + i) * 0.002;

      const angle = Math.atan2(positions[i3 + 2], positions[i3]);
      const r = Math.sqrt(
        positions[i3] * positions[i3] + positions[i3 + 2] * positions[i3 + 2]
      );
      const newAngle = angle + speed * 0.001;

      positions[i3] = Math.sin(newAngle) * r;
      positions[i3 + 2] = Math.cos(newAngle) * r;

      if (positions[i3 + 1] > 4) positions[i3 + 1] = -4;
      if (positions[i3 + 1] < -4) positions[i3 + 1] = 4;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
