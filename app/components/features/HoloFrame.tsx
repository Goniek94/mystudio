"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HoloFrameProps {
  width?: number;
  height?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  isActive?: boolean;
}

export function HoloFrame({
  width = 5.2,
  height = 3.4,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = "#00ffea",
  isActive = false,
}: HoloFrameProps) {
  const frameRef = useRef<THREE.Group>(null!);
  const cornerRefs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    if (!frameRef.current) return;

    const time = state.clock.elapsedTime;

    // Pulsing effect
    const pulse = Math.sin(time * 2) * 0.5 + 0.5;
    const scale = 1 + pulse * 0.02;

    frameRef.current.scale.setScalar(scale);

    // Animate corners
    cornerRefs.current.forEach((corner, i) => {
      if (corner) {
        const offset = i * Math.PI * 0.5;
        corner.rotation.z = time + offset;
      }
    });
  });

  const w = width / 2;
  const h = height / 2;
  const thickness = 0.02;
  const cornerSize = 0.3;

  return (
    <group ref={frameRef} position={position} rotation={rotation}>
      {/* Top line */}
      <mesh position={[0, h, 0.01]}>
        <boxGeometry args={[width, thickness, thickness]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.8 : 0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Bottom line */}
      <mesh position={[0, -h, 0.01]}>
        <boxGeometry args={[width, thickness, thickness]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.8 : 0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Left line */}
      <mesh position={[-w, 0, 0.01]}>
        <boxGeometry args={[thickness, height, thickness]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.8 : 0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Right line */}
      <mesh position={[w, 0, 0.01]}>
        <boxGeometry args={[thickness, height, thickness]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isActive ? 0.8 : 0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Corner decorations */}
      {[
        [-w, h, 0.02],
        [w, h, 0.02],
        [-w, -h, 0.02],
        [w, -h, 0.02],
      ].map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) cornerRefs.current[i] = el;
          }}
          position={pos as [number, number, number]}
        >
          <torusGeometry args={[cornerSize * 0.15, 0.015, 8, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={isActive ? 1.0 : 0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Corner brackets */}
      {[
        { pos: [-w, h, 0.02], rot: [0, 0, 0] },
        { pos: [w, h, 0.02], rot: [0, 0, Math.PI / 2] },
        { pos: [-w, -h, 0.02], rot: [0, 0, -Math.PI / 2] },
        { pos: [w, -h, 0.02], rot: [0, 0, Math.PI] },
      ].map((corner, i) => (
        <group
          key={`bracket-${i}`}
          position={corner.pos as [number, number, number]}
          rotation={corner.rot as [number, number, number]}
        >
          {/* Horizontal bracket */}
          <mesh position={[cornerSize / 2, 0, 0]}>
            <boxGeometry args={[cornerSize, thickness * 2, thickness]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={isActive ? 0.9 : 0.5}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Vertical bracket */}
          <mesh position={[0, cornerSize / 2, 0]}>
            <boxGeometry args={[thickness * 2, cornerSize, thickness]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={isActive ? 0.9 : 0.5}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}

      {/* Glow effect when active */}
      {isActive && (
        <>
          <pointLight
            position={[0, 0, 0.5]}
            color={color}
            intensity={2}
            distance={3}
          />
          <pointLight
            position={[-w, h, 0.5]}
            color={color}
            intensity={1}
            distance={2}
          />
          <pointLight
            position={[w, h, 0.5]}
            color={color}
            intensity={1}
            distance={2}
          />
          <pointLight
            position={[-w, -h, 0.5]}
            color={color}
            intensity={1}
            distance={2}
          />
          <pointLight
            position={[w, -h, 0.5]}
            color={color}
            intensity={1}
            distance={2}
          />
        </>
      )}
    </group>
  );
}
