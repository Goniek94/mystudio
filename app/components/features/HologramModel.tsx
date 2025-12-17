"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
  PerspectiveCamera,
  OrbitControls,
  Sparkles,
  Cylinder,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { Power } from "lucide-react";

// --- KOMPONENT Z NAKŁADANIEM TEKSTURY ---
function HologramPlane({ onEnter }: { onEnter: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  // BEZPIECZNA ŚCIEŻKA:
  // Używamy publicznego obrazka z Unsplash jako placeholder, żeby kod się nie wysypał.
  // Jak już wrzucisz swój plik, zmień ten adres z powrotem na "/img/hologram-texture.png"
  const textureUrl =
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop";
  // const textureUrl = "/img/hologram-texture.png"; // <-- ODKOMENTUJ TO, JAK DODASZ PLIK

  const texture = useLoader(THREE.TextureLoader, textureUrl);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Delikatne falowanie (lewitacja)
    if (meshRef.current) {
      meshRef.current.position.y = 1.8 + Math.sin(t) * 0.05;
      meshRef.current.rotation.y = Math.sin(t / 2) * 0.05; // Bardzo subtelny obrót
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[0, 1.8, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onEnter}
      >
        {/* Zakrzywiona płaszczyzna (cylinder otwarty) */}
        <cylinderGeometry
          args={[5, 5, 3.5, 64, 1, true, -Math.PI / 6, Math.PI / 3]}
        />

        {/* Materiał z nałożonym zdjęciem + świecenie (emissive) */}
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive={"#00ffea"}
          emissiveIntensity={hovered ? 3.0 : 2.0} // Jaśniej po najechaniu
          toneMapped={false}
          transparent={true}
          opacity={0.95}
          side={THREE.DoubleSide}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Przycisk HTML pod modelem */}
      <Html position={[0, -0.5, 0]} center transform distanceFactor={5}>
        <button
          onClick={onEnter}
          className={`
                flex items-center gap-2 px-8 py-3 
                bg-black/50 backdrop-blur-md border border-cyan-400/50 
                text-cyan-400 font-mono font-bold uppercase tracking-widest 
                hover:bg-cyan-400 hover:text-black transition-all duration-300
                ${
                  hovered
                    ? "scale-110 shadow-[0_0_30px_rgba(0,255,234,0.5)]"
                    : ""
                }
            `}
        >
          <Power size={18} />
          Initialize System
        </button>
      </Html>
    </group>
  );
}

// --- BAZA PROJEKTORA ---
function ProjectorBase() {
  return (
    <group position={[0, -1, 0]}>
      {/* Główny korpus */}
      <Cylinder args={[1, 1.2, 0.5, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </Cylinder>
      {/* Świecący środek */}
      <Cylinder args={[0.8, 0.8, 0.51, 32]} position={[0, 0.01, 0]}>
        <meshStandardMaterial
          color="#00ffea"
          emissive="#00ffea"
          emissiveIntensity={2}
        />
      </Cylinder>
      {/* Stożek światła (wolumetryczny) */}
      <mesh position={[0, 2.5, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[4, 0.8, 5, 32, 1, true]} />
        <meshBasicMaterial
          color="#00ffea"
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// --- GŁÓWNY KOMPONENT EXPORTOWANY ---
export const HologramModel = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <div className="w-full h-screen relative bg-black animate-in fade-in duration-1000">
      <Canvas dpr={[1, 1.5]}>
        <PerspectiveCamera makeDefault position={[0, 1, 6.5]} fov={50} />
        <color attach="background" args={["#010505"]} />
        <fog attach="fog" args={["#010505", 5, 20]} />

        <ambientLight intensity={0.5} />
        <spotLight
          position={[0, 5, 2]}
          intensity={2}
          color="#00ffea"
          penumbra={0.5}
        />
        <pointLight
          position={[0, -2, 2]}
          intensity={5}
          color="#00ffea"
          distance={5}
        />

        {/* Suspense zapobiega białemu ekranowi podczas ładowania tekstury */}
        <React.Suspense
          fallback={
            <Html center>
              <span className="text-cyan-500 font-mono animate-pulse tracking-widest">
                LOADING SYSTEM...
              </span>
            </Html>
          }
        >
          <HologramPlane onEnter={onEnter} />
        </React.Suspense>

        <ProjectorBase />

        <Sparkles
          count={100}
          scale={[4, 5, 2]}
          position={[0, 1.5, 0]}
          size={3}
          speed={0.4}
          opacity={0.5}
          color="#00ffea"
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
          rotateSpeed={0.5}
        />

        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={0.1}
            mipmapBlur
            intensity={2.0}
            radius={0.6}
          />
          <Noise opacity={0.05} />
        </EffectComposer>
      </Canvas>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10" />
    </div>
  );
};
