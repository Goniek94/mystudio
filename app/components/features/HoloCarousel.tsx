"use client";

import React, { useState, useRef } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { Text, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { PROJECTS_DATA } from "@/app/components/data/ProjectsData";
import { HolographicMaterialImpl } from "./HolographicMaterial";
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

// Rejestracja materiału
extend({ HolographicMaterialImpl });

const projectsList = Object.values(PROJECTS_DATA);
const RADIUS = 8.5;

// --- KARTA PROJEKTU ---
function HoloCard({
  project,
  index,
  currentRotation,
  onClick,
  isGranted,
  glitchIntensity,
}: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<any>(null!);
  const [hovered, setHovered] = useState(false);

  const count = projectsList.length;
  const angle = (index / count) * Math.PI * 2;

  const textureUrl =
    project.images && project.images.length > 0
      ? project.images[0].src
      : "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop";

  const texture = useTexture(textureUrl);

  useFrame((state, delta) => {
    // Obliczanie pozycji na kole
    const finalAngle = angle + currentRotation;
    const x = Math.sin(finalAngle) * RADIUS;
    const z = Math.cos(finalAngle) * RADIUS - RADIUS;

    let normAngle = finalAngle % (Math.PI * 2);
    if (normAngle > Math.PI) normAngle -= Math.PI * 2;
    if (normAngle < -Math.PI) normAngle += Math.PI * 2;

    const distanceFromCenter = Math.abs(normAngle);
    // Karty po bokach są widoczne (min 0.3)
    const isActive = Math.max(0.3, 1 - distanceFromCenter * 0.7);
    const isCenter = distanceFromCenter < 0.2;

    // Ruch
    meshRef.current.position.set(x, 0, z);
    meshRef.current.rotation.y = finalAngle;

    // Shader Update
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;

      // Kolory (Twoje ulubione Additive Blending sprawi, że będą świecić)
      const activeColor =
        isGranted && isCenter
          ? new THREE.Color("#00ff88")
          : new THREE.Color("#00ccff");
      const inactiveColor = new THREE.Color("#0033aa");

      const finalColor = new THREE.Color().lerpColors(
        inactiveColor,
        activeColor,
        isCenter ? 1.0 : 0.0
      );

      easing.dampC(materialRef.current.uColor, finalColor, 0.2, delta);
      easing.damp(
        materialRef.current,
        "uHover",
        hovered ? 1.0 : 0.0,
        0.2,
        delta
      );

      // Opacity - zawsze widoczne (min 0.5)
      const targetOpacity = isCenter ? 1.0 : 0.5;
      easing.damp(materialRef.current, "uOpacity", targetOpacity, 0.2, delta);

      materialRef.current.uGlitch = glitchIntensity;
    }
  });

  return (
    <group>
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

        {/* PRZYWRACAMY BLENDING, KTÓRY CI SIĘ PODOBAŁ + NOWY SHADER */}
        {/* @ts-ignore */}
        <holographicMaterialImpl
          ref={materialRef}
          uTexture={texture}
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending} // TO SPRAWIA ŻE ŚWIECI
          depthWrite={false}
        />
      </mesh>
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
    easing.damp(
      { val: rotation },
      "val",
      targetRotation,
      smoothTime,
      delta,
      undefined,
      (v) => setRotation(v)
    );

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
    <div className="w-full h-screen bg-black relative animate-in fade-in duration-1000 cursor-grab active:cursor-grabbing">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2, 14], fov: 40 }}>
        {/* TŁO */}
        <React.Suspense
          fallback={<color attach="background" args={["#000510"]} />}
        >
          <HoloBackground />
        </React.Suspense>

        {/* KARTY */}
        <React.Suspense fallback={null}>
          <SpinningCarousel onSelect={onSelect} />
        </React.Suspense>

        {/* EFEKTY */}
        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={0.1}
            mipmapBlur
            intensity={2.0}
            radius={0.5}
          />
          <ChromaticAberration
            offset={new THREE.Vector2(0.002, 0.002)}
            radialModulation={false}
            modulationOffset={0}
          />
          <Noise opacity={0.06} />
          <Vignette eskil={false} offset={0.1} darkness={0.7} />
        </EffectComposer>

        <ambientLight intensity={2.0} />
      </Canvas>

      <div className="absolute bottom-8 w-full flex justify-center opacity-40 animate-pulse pointer-events-none">
        <Hand className="text-cyan-500" size={32} />
        <span className="ml-4 text-cyan-500 font-mono text-xs tracking-widest mt-2">
          INTERACTIVE 3D SYSTEM
        </span>
      </div>
    </div>
  );
};
