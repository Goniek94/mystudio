"use client";

import React, { useState, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { PROJECTS_DATA } from "@/app/components/data/ProjectsData";
// Import materiału - extend() jest już wywołane w HolographicMaterial.tsx
import "./HolographicMaterial";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { easing } from "maath";
import { useDrag } from "@use-gesture/react";
import { ShieldCheck, Hand, ArrowRight } from "lucide-react";
import { HoloBackground } from "./HoloBackground";
import { HoloParticles } from "./HoloParticles";
import { HoloFrame } from "./HoloFrame";

// Materiał jest już zarejestrowany w HolographicMaterial.tsx

const projectsList = Object.values(PROJECTS_DATA);
const RADIUS = 8.5;

// --- KARTA PROJEKTU Z RAMKĄ ---
function HoloCard({
  project,
  index,
  currentRotation,
  onClick,
  isGranted,
  glitchIntensity,
  activeIndex,
}: any) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  const count = projectsList.length;
  const angle = (index / count) * Math.PI * 2;

  // Ładowanie tekstury - UŻYWAMY HOLOGRAM-CARDS.JPG!
  React.useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      "/img/hologram-cards.jpg",
      (loadedTexture) => {
        console.log("✅ Tekstura załadowana:", "/img/hologram-cards.jpg");
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        console.error("❌ Błąd ładowania tekstury:", error);
      }
    );
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    // Obliczanie pozycji na kole
    const finalAngle = angle + currentRotation;
    const x = Math.sin(finalAngle) * RADIUS;
    const z = Math.cos(finalAngle) * RADIUS - RADIUS;

    let normAngle = finalAngle % (Math.PI * 2);
    if (normAngle > Math.PI) normAngle -= Math.PI * 2;
    if (normAngle < -Math.PI) normAngle += Math.PI * 2;

    const distanceFromCenter = Math.abs(normAngle);
    const isCenter = distanceFromCenter < 0.3;

    // Ruch
    groupRef.current.position.set(x, 0, z);
    groupRef.current.rotation.y = finalAngle;

    // Shader Update
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;

      // Kolory - bardziej widoczne
      const activeColor =
        isGranted && isCenter
          ? new THREE.Color("#00ff88")
          : new THREE.Color("#00ddff");
      const inactiveColor = new THREE.Color("#0066cc");

      const finalColor = new THREE.Color().lerpColors(
        inactiveColor,
        activeColor,
        isCenter ? 1.0 : 0.3
      );

      easing.dampC(materialRef.current.uColor, finalColor, 0.2, delta);
      easing.damp(
        materialRef.current,
        "uHover",
        hovered || isCenter ? 1.0 : 0.0,
        0.2,
        delta
      );

      // Opacity - MAKSYMALNA WIDOCZNOŚĆ!
      const targetOpacity = isCenter ? 1.0 : 0.9;
      easing.damp(materialRef.current, "uOpacity", targetOpacity, 0.2, delta);

      materialRef.current.uGlitch = glitchIntensity;
    }
  });

  const isActive = index === activeIndex;

  return (
    <group ref={groupRef}>
      {/* HOLOGRAFICZNA RAMKA */}
      <HoloFrame
        width={5.4}
        height={3.6}
        position={[0, 0, -0.05]}
        color={isActive ? "#00ffea" : "#0088cc"}
        isActive={isActive || hovered}
      />

      {/* KARTA Z OBRAZEM */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(index);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[5.2, 3.4, 30, 30]} />

        {texture ? (
          /* @ts-ignore */
          <holographicMaterialImpl
            ref={materialRef}
            uTexture={texture}
            transparent
            side={THREE.DoubleSide}
            blending={THREE.NormalBlending}
            depthWrite={true}
          />
        ) : (
          <meshStandardMaterial
            color="#00ffea"
            emissive="#00ffea"
            emissiveIntensity={2}
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        )}
      </mesh>

      {/* Dodatkowe światło dla aktywnej karty */}
      {isActive && (
        <pointLight
          position={[0, 0, 1]}
          color="#00ffea"
          intensity={3}
          distance={4}
        />
      )}
    </group>
  );
}

// --- LOGIKA KARUZELI (DRAG) ---
const SpinningCarousel = ({ onSelect }: { onSelect: () => void }) => {
  const { size } = useThree();
  const [rotation, setRotation] = useState(0);
  const [targetRotation, setTargetRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [accessState, setAccessState] = useState<"idle" | "granted">("idle");

  const dragStartRotation = useRef(0);
  const glitchIntensity = useRef(0);

  const count = projectsList.length;
  const anglePerCard = (Math.PI * 2) / count;

  // Obsługa przesuwania myszką (Twoje życzenie)
  const bind = useDrag(
    ({ active, movement: [mx], tap, down }) => {
      if (tap) return;

      if (down && !isDragging) {
        setIsDragging(true);
        dragStartRotation.current = targetRotation;
      }

      if (active) {
        const sensitivity = Math.PI * 2 * 1.0;
        const rotationDelta = (mx / size.width) * sensitivity;
        setTargetRotation(dragStartRotation.current + rotationDelta);
      } else {
        setIsDragging(false);
        const rawIndex = -targetRotation / anglePerCard;
        const snappedIndex = Math.round(rawIndex);
        setTargetRotation(-snappedIndex * anglePerCard);
      }
    },
    { filterTaps: true }
  );

  useFrame((state, delta) => {
    const smoothTime = isDragging ? 0.05 : 0.4;
    const newRotation = THREE.MathUtils.damp(
      rotation,
      targetRotation,
      smoothTime,
      delta
    );
    setRotation(newRotation);

    let index = Math.round(-rotation / anglePerCard) % count;
    if (index < 0) index += count;
    setActiveIndex(index);

    // Losowy glitch
    if (Math.random() > 0.98) glitchIntensity.current = Math.random() * 0.3;
    glitchIntensity.current = THREE.MathUtils.lerp(
      glitchIntensity.current,
      0,
      0.1
    );
  });

  const handleCardClick = (index: number) => {
    if (index !== activeIndex) {
      let diff = index - activeIndex;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;
      setTargetRotation(targetRotation - diff * anglePerCard);
    } else {
      setAccessState("granted");
      setTimeout(onSelect, 1500);
    }
  };

  return (
    <group position={[0, 0.5, 0]}>
      {/* Niewidzialny cylinder do łapania gestów */}
      <mesh {...bind()} position={[0, 0, 5]} visible={false}>
        <planeGeometry args={[20, 15]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {projectsList.map((project, i) => (
        <HoloCard
          key={project.id}
          index={i}
          project={project}
          currentRotation={rotation}
          onClick={handleCardClick}
          isGranted={accessState === "granted" && i === activeIndex}
          glitchIntensity={glitchIntensity.current}
          activeIndex={activeIndex}
        />
      ))}

      {accessState === "idle" && (
        <group position={[0, -3.5, 0]}>
          <Text
            font="/fonts/GeistMono-Bold.ttf"
            fontSize={0.35}
            color="#00aaff"
            anchorX="center"
            anchorY="middle"
            letterSpacing={0.1}
          >
            {projectsList[activeIndex].title.en
              ? projectsList[activeIndex].title.en.toUpperCase()
              : "PROJECT"}
          </Text>
          <Text
            position={[0, -0.5, 0]}
            fontSize={0.12}
            color="#00aaff"
            fillOpacity={0.7}
            anchorX="center"
          >
            {isDragging ? "< ... >" : "< DRAG TO SPIN • CLICK TO ACCESS >"}
          </Text>
        </group>
      )}

      {accessState === "granted" && (
        <Html center style={{ pointerEvents: "none" }}>
          <div className="flex flex-col items-center justify-center scale-150">
            <div className="text-emerald-400 animate-pulse mb-4">
              <ShieldCheck size={100} />
            </div>
            <h2 className="text-6xl font-black text-white font-mono tracking-tighter drop-shadow-[0_0_30px_rgba(16,185,129,1)] whitespace-nowrap">
              ACCESS GRANTED
            </h2>
          </div>
        </Html>
      )}
    </group>
  );
};

// --- GŁÓWNY KOMPONENT ---
export const HoloCarousel = ({ onSelect }: { onSelect: () => void }) => {
  return (
    <div className="w-full h-screen relative animate-in fade-in duration-1000 cursor-grab active:cursor-grabbing">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2, 12], fov: 45 }}>
        {/* HOLOGRAFICZNY POKÓJ 3D Z HOLO-BG.JPG */}
        <React.Suspense fallback={null}>
          <HoloBackground />
        </React.Suspense>

        {/* KARTY - BEZ SUSPENSE! */}
        <SpinningCarousel onSelect={onSelect} />

        {/* PARTICLE EFFECTS - WIĘCEJ CZĄSTECZEK! */}
        <React.Suspense fallback={null}>
          <HoloParticles count={400} radius={RADIUS * 1.5} color="#00ffea" />
          <HoloParticles count={200} radius={RADIUS * 0.8} color="#ff00ea" />
        </React.Suspense>

        {/* EFEKTY POST-PROCESSING - MOCNIEJSZE! */}
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.05}
            mipmapBlur
            intensity={3.5}
            radius={0.8}
          />
          <ChromaticAberration
            offset={new THREE.Vector2(0.005, 0.005)}
            radialModulation={true}
            modulationOffset={0.3}
          />
          <Noise opacity={0.12} />
          <Vignette eskil={false} offset={0.15} darkness={0.8} />
        </EffectComposer>

        {/* MOCNE ŚWIATŁO - karty muszą być widoczne! */}
        <ambientLight intensity={4.0} />
        <directionalLight
          position={[0, 5, 10]}
          intensity={2.5}
          color="#00ddff"
        />
        <directionalLight
          position={[0, -5, -10]}
          intensity={1.5}
          color="#0088ff"
        />
        <pointLight
          position={[0, 0, 0]}
          intensity={2}
          color="#00ffea"
          distance={20}
        />
      </Canvas>

      <div className="absolute bottom-8 w-full flex justify-center opacity-40 animate-pulse pointer-events-none">
        <Hand className="text-cyan-500" size={32} />
        <span className="ml-4 text-cyan-500 font-mono text-xs tracking-widest mt-2">
          INTERACTIVE 3D HOLOGRAPHIC SYSTEM
        </span>
      </div>
    </div>
  );
};
