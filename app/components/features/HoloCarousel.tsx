"use client";

import React, { useState, useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Html, OrbitControls, Grid } from "@react-three/drei";
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
import { ShieldCheck, Hand, MousePointer2 } from "lucide-react";
// Importujemy tło z projektu
import { MatrixBackground } from "@/app/components/ui/MatrixBackground";
import { HoloParticles } from "./HoloParticles";
import { HoloFrame } from "./HoloFrame";

const projectsList = Object.values(PROJECTS_DATA);
const RADIUS = 9; // Nieco szerszy krąg

// --- 1. POKÓJ 3D (CYFROWA SIATKA) ---
function DigitalRoom() {
  return (
    <group>
      {/* Podłoga - Siatka */}
      <Grid
        position={[0, -4, 0]}
        args={[40, 40]} // Rozmiar siatki
        cellSize={1}
        cellThickness={1}
        cellColor="#004433"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#00cc88"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
      />
      {/* Sufit - Odbicie siatki dla efektu zamknięcia */}
      <Grid
        position={[0, 10, 0]}
        rotation={[Math.PI, 0, 0]}
        args={[40, 40]}
        cellSize={1}
        cellThickness={1}
        cellColor="#004433"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#00cc88"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
      />
    </group>
  );
}

// --- 2. KARTA HOLOGRAMU ---
function HoloCard({
  project,
  index,
  total,
  onClick,
  isGranted,
  activeIndex,
}: any) {
  const groupRef = useRef<THREE.Group>(null!);
  const materialRef = useRef<any>(null!);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  // Rozmieszczenie w okręgu (statyczne, kamera się rusza)
  const angle = (index / total) * Math.PI * 2;
  const x = Math.sin(angle) * RADIUS;
  const z = Math.cos(angle) * RADIUS;

  React.useEffect(() => {
    new THREE.TextureLoader().load("/img/hologram-cards.jpg", (tex) =>
      setTexture(tex)
    );
  }, []);

  useFrame((state, delta) => {
    // Karta zawsze patrzy na środek (0,0,0)
    if (groupRef.current) {
      groupRef.current.lookAt(0, 0, 0);
    }

    // Animacja shadera
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      // Kolory: Aktywny (kliknięty) vs Zwykły vs Hover
      const targetColor = isGranted
        ? new THREE.Color("#00ff88") // Zielony (Access Granted)
        : hovered
        ? new THREE.Color("#00ffff") // Cyjan (Hover)
        : new THREE.Color("#0066cc"); // Niebieski (Idle)

      easing.dampC(materialRef.current.uColor, targetColor, 0.2, delta);
      easing.damp(
        materialRef.current,
        "uHover",
        hovered ? 1.0 : 0.0,
        0.2,
        delta
      );
      easing.damp(materialRef.current, "uOpacity", 0.9, 0.2, delta);
      materialRef.current.uGlitch = hovered ? 0.3 : 0.0;
    }
  });

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      {/* Ramka */}
      <HoloFrame
        width={5.4}
        height={3.6}
        position={[0, 0, -0.05]}
        color={hovered ? "#00ffff" : "#0088cc"}
        isActive={hovered || isGranted}
      />

      {/* Klikalna płaszczyzna */}
      <mesh
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
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        ) : (
          <meshBasicMaterial color="cyan" wireframe />
        )}
      </mesh>

      {/* Tytuł nad kartą */}
      <group position={[0, 2.2, 0]}>
        <Text
          font="/fonts/GeistMono-Bold.ttf"
          fontSize={0.3}
          color={hovered ? "#00ffff" : "#0088cc"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {project.title.en.toUpperCase()}
        </Text>
      </group>
    </group>
  );
}

// --- 3. SCENA Z KARTAMI ---
const RoomScene = ({ onSelect }: { onSelect: () => void }) => {
  const [accessState, setAccessState] = useState<"idle" | "granted">("idle");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
    setAccessState("granted");
    // Opóźnienie na animację wejścia
    setTimeout(onSelect, 1500);
  };

  return (
    <group>
      {projectsList.map((project, i) => (
        <HoloCard
          key={project.id}
          index={i}
          total={projectsList.length}
          project={project}
          onClick={handleCardClick}
          isGranted={accessState === "granted" && i === selectedIndex}
          activeIndex={selectedIndex}
        />
      ))}

      {/* EKRAN DOSTĘPU (UI 3D) */}
      {accessState === "granted" && (
        <Html center style={{ pointerEvents: "none", zIndex: 100 }}>
          <div className="flex flex-col items-center justify-center animate-pulse drop-shadow-[0_0_25px_rgba(0,255,128,1)]">
            <ShieldCheck size={120} className="text-emerald-400" />
            <h1 className="text-5xl md:text-7xl font-black text-emerald-400 tracking-[0.2em] font-mono mt-4 bg-black/50 backdrop-blur-md px-6 py-2 rounded border border-emerald-500/50">
              ACCESS GRANTED
            </h1>
          </div>
        </Html>
      )}
    </group>
  );
};

// --- 4. GŁÓWNY KOMPONENT ---
export const HoloCarousel = ({ onSelect }: { onSelect: () => void }) => {
  return (
    <div className="w-full h-screen relative animate-in fade-in duration-1000">
      {/* TŁO 2D (MATRIX) - Zostaje pod spodem */}
      <MatrixBackground />

      {/* WARSTWA 3D */}
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 5, 18], fov: 50 }} // Kamera wyżej i dalej
        gl={{ alpha: true, antialias: true }}
      >
        {/* INTERAKCJA JAK GLOBUS */}
        <OrbitControls
          enableZoom={true} // Można przybliżać
          minDistance={5} // Nie za blisko
          maxDistance={30} // Nie za daleko
          enablePan={false} // Zablokowane przesuwanie na boki (tylko obrót)
          autoRotate={true} // Delikatny automatyczny obrót
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 1.8} // Blokada, żeby nie wjechać pod podłogę
        />

        {/* ELEMENTY SCENY */}
        <DigitalRoom />
        <RoomScene onSelect={onSelect} />

        <Suspense fallback={null}>
          <HoloParticles count={150} radius={15} color="#00ffea" />
        </Suspense>

        {/* POST-PROCESSING (EFEKTY WIZUALNE) */}
        <EffectComposer disableNormalPass>
          <Bloom
            luminanceThreshold={0.2}
            intensity={1.5}
            radius={0.6}
            mipmapBlur
          />
          <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
          <Vignette eskil={false} offset={0.1} darkness={0.5} />
        </EffectComposer>

        {/* ŚWIATŁO */}
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00ffea" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#00ff88" />
      </Canvas>

      {/* INSTRUKCJA */}
      <div className="absolute bottom-8 w-full flex flex-col items-center justify-center opacity-60 pointer-events-none gap-2">
        <MousePointer2 className="text-cyan-400 animate-bounce" size={24} />
        <p className="text-cyan-500/80 font-mono text-xs tracking-widest uppercase">
          Drag to rotate &bull; Scroll to zoom
        </p>
      </div>
    </div>
  );
};
