"use client";

import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { PROJECTS_DATA } from "@/app/components/data/ProjectsData";
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
import { ShieldCheck, Hand } from "lucide-react";
import { HoloBackgroundScene } from "./HoloBackground"; // IMPORT SCENY
import { HoloParticles } from "./HoloParticles";
import { HoloFrame } from "./HoloFrame";

const projectsList = Object.values(PROJECTS_DATA);
const RADIUS = 8.5;

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

  React.useEffect(() => {
    new THREE.TextureLoader().load("/img/hologram-cards.jpg", (tex) =>
      setTexture(tex)
    );
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const finalAngle = angle + currentRotation;
    const x = Math.sin(finalAngle) * RADIUS;
    const z = Math.cos(finalAngle) * RADIUS - RADIUS;

    let normAngle = finalAngle % (Math.PI * 2);
    if (normAngle > Math.PI) normAngle -= Math.PI * 2;
    if (normAngle < -Math.PI) normAngle += Math.PI * 2;
    const isCenter = Math.abs(normAngle) < 0.3;

    groupRef.current.position.set(x, 0, z);
    groupRef.current.rotation.y = finalAngle;

    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      const activeColor =
        isGranted && isCenter
          ? new THREE.Color("#00ff88")
          : new THREE.Color("#00ddff");
      const inactiveColor = new THREE.Color("#0066cc");
      easing.dampC(
        materialRef.current.uColor,
        isCenter ? activeColor : inactiveColor,
        0.2,
        delta
      );
      easing.damp(
        materialRef.current,
        "uHover",
        hovered || isCenter ? 1.0 : 0.0,
        0.2,
        delta
      );
      easing.damp(
        materialRef.current,
        "uOpacity",
        isCenter ? 1.0 : 0.8,
        0.2,
        delta
      );
      materialRef.current.uGlitch = glitchIntensity;
    }
  });

  const isActive = index === activeIndex;

  return (
    <group ref={groupRef}>
      <HoloFrame
        width={5.4}
        height={3.6}
        position={[0, 0, -0.05]}
        color={isActive ? "#00ffea" : "#0088cc"}
        isActive={isActive || hovered}
      />
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
          // @ts-ignore
          <holographicMaterialImpl
            ref={materialRef}
            uTexture={texture}
            transparent
            side={THREE.DoubleSide}
            blending={THREE.NormalBlending}
            depthWrite={true}
          />
        ) : (
          <meshBasicMaterial color="cyan" wireframe />
        )}
      </mesh>
    </group>
  );
}

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

  const bind = useDrag(
    ({ active, movement: [mx], tap, down }) => {
      if (tap) return;
      if (down && !isDragging) {
        setIsDragging(true);
        dragStartRotation.current = targetRotation;
      }
      if (active) {
        setTargetRotation(
          dragStartRotation.current + (mx / size.width) * Math.PI * 2
        );
      } else {
        setIsDragging(false);
        setTargetRotation(
          -Math.round(-targetRotation / anglePerCard) * anglePerCard
        );
      }
    },
    { filterTaps: true }
  );

  useFrame((state, delta) => {
    setRotation(
      THREE.MathUtils.damp(
        rotation,
        targetRotation,
        isDragging ? 0.05 : 0.4,
        delta
      )
    );
    let index = Math.round(-rotation / anglePerCard) % count;
    if (index < 0) index += count;
    setActiveIndex(index);
    if (Math.random() > 0.98) glitchIntensity.current = Math.random() * 0.3;
    else glitchIntensity.current *= 0.9;
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
          >
            {projectsList[activeIndex].title.en.toUpperCase()}
          </Text>
        </group>
      )}
      {accessState === "granted" && (
        <Html center style={{ pointerEvents: "none" }}>
          <div className="text-emerald-400 animate-pulse">
            <ShieldCheck size={100} /> ACCESS GRANTED
          </div>
        </Html>
      )}
    </group>
  );
};

export const HoloCarousel = ({ onSelect }: { onSelect: () => void }) => {
  return (
    <div className="w-full h-screen relative animate-in fade-in duration-1000 cursor-grab active:cursor-grabbing">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 2, 12], fov: 45 }}>
        {/* TŁO 3D: POKÓJ */}
        <Suspense fallback={null}>
          <HoloBackgroundScene />
        </Suspense>

        {/* CONTROLS: MOŻLIWOŚĆ ROZGLĄDANIA SIĘ */}
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />

        <SpinningCarousel onSelect={onSelect} />

        <Suspense fallback={null}>
          <HoloParticles count={300} radius={10} color="#00ffea" />
        </Suspense>

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.05}
            intensity={2.0}
            radius={0.8}
            mipmapBlur
          />
          <ChromaticAberration offset={new THREE.Vector2(0.002, 0.002)} />
          <Noise opacity={0.1} />
          <Vignette eskil={false} offset={0.1} darkness={0.7} />
        </EffectComposer>

        <ambientLight intensity={2.0} />
        <pointLight
          position={[0, 0, 0]}
          intensity={3}
          color="#00ffea"
          distance={20}
        />
      </Canvas>

      <div className="absolute bottom-8 w-full flex justify-center opacity-40 pointer-events-none">
        <Hand className="text-cyan-500" size={32} />
      </div>
    </div>
  );
};
