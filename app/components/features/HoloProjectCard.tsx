"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Html } from "@react-three/drei";
import * as THREE from "three";
import Image from "next/image";

interface Project {
  id: string;
  title: { en: string; pl: string };
  subtitle: string;
  desc: { en: string; pl: string };
  nda?: boolean;
  liveUrl?: string | null;
}

interface HoloProjectCardProps {
  project: Project;
  lang: "pl" | "en";
  onSelect: () => void;
}

export const HoloProjectCard: React.FC<HoloProjectCardProps> = ({
  project,
  lang,
  onSelect,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5 + meshRef.current.position.x) *
        0.3;
    }
    if (frameRef.current && hovered) {
      frameRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group ref={frameRef}>
      {/* Invisible hitbox for interactions */}
      <RoundedBox
        ref={meshRef}
        args={[3.2, 4.5, 0.1]}
        radius={0.15}
        smoothness={4}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onSelect}
        scale={hovered ? 1.08 : 1}
      >
        <meshBasicMaterial transparent opacity={0} />
      </RoundedBox>

      {/* Glow effect behind card */}
      {hovered && (
        <>
          <pointLight
            position={[0, 0, -1]}
            intensity={2}
            distance={6}
            color="#00ffff"
          />
          <pointLight
            position={[0, 0, 1.5]}
            intensity={1.5}
            distance={5}
            color="#ff00ff"
          />
        </>
      )}

      {/* HTML Content - Modern Card */}
      <Html
        transform
        occlude
        position={[0, 0, 0]}
        style={{
          width: "300px",
          height: "420px",
          pointerEvents: hovered ? "auto" : "none",
        }}
      >
        <div
          className="relative w-full h-full group cursor-pointer"
          onClick={onSelect}
          style={{
            transform: hovered ? "scale(1.02)" : "scale(1)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Modern glassmorphic card */}
          <div
            className="relative w-full h-full rounded-3xl overflow-hidden"
            style={{
              background: hovered
                ? "linear-gradient(135deg, rgba(0, 255, 255, 0.15) 0%, rgba(138, 43, 226, 0.15) 100%)"
                : "linear-gradient(135deg, rgba(0, 255, 255, 0.08) 0%, rgba(138, 43, 226, 0.08) 100%)",
              backdropFilter: "blur(20px)",
              border: hovered
                ? "2px solid rgba(0, 255, 255, 0.5)"
                : "2px solid rgba(0, 255, 255, 0.2)",
              boxShadow: hovered
                ? "0 25px 50px -12px rgba(0, 255, 255, 0.5), 0 0 100px rgba(0, 255, 255, 0.3), inset 0 0 60px rgba(0, 255, 255, 0.1)"
                : "0 20px 40px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 255, 255, 0.1)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Animated gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(45deg, transparent 30%, rgba(0, 255, 255, 0.1) 50%, transparent 70%)",
                backgroundSize: "200% 200%",
                animation: hovered ? "shimmer 2s infinite" : "none",
              }}
            />

            {/* Scan lines effect */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.1) 2px, rgba(0, 255, 255, 0.1) 4px)",
                animation: "scan 8s linear infinite",
              }}
            />

            {/* Content container */}
            <div className="relative z-10 flex flex-col h-full p-5">
              {/* Top badges */}
              <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                <span
                  className="px-3 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 200, 255, 0.3))",
                    border: "1px solid rgba(0, 255, 255, 0.4)",
                    color: "#00ffff",
                    boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
                  }}
                >
                  {project.subtitle}
                </span>
                {project.nda && (
                  <span
                    className="px-3 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider rounded-full flex items-center gap-1.5"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255, 0, 100, 0.2), rgba(200, 0, 100, 0.3))",
                      border: "1px solid rgba(255, 0, 100, 0.4)",
                      color: "#ff0066",
                      boxShadow: "0 0 20px rgba(255, 0, 100, 0.3)",
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                    </svg>
                    NDA
                  </span>
                )}
                {project.liveUrl && (
                  <span
                    className="px-3 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider rounded-full flex items-center gap-1.5"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0, 255, 100, 0.2), rgba(0, 200, 100, 0.3))",
                      border: "1px solid rgba(0, 255, 100, 0.4)",
                      color: "#00ff66",
                      boxShadow: "0 0 20px rgba(0, 255, 100, 0.3)",
                    }}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>

              {/* Project title */}
              <h3
                className="text-2xl font-black mb-3 leading-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #00ffff 0%, #00ff88 50%, #00ccff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: hovered
                    ? "drop-shadow(0 0 20px rgba(0, 255, 255, 0.8))"
                    : "drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))",
                  transition: "all 0.3s ease",
                }}
              >
                {project.title[lang]}
              </h3>

              {/* Description */}
              <p
                className="text-xs leading-relaxed mb-4 flex-grow"
                style={{
                  color: "rgba(200, 255, 255, 0.9)",
                  textShadow: "0 0 10px rgba(0, 255, 255, 0.3)",
                }}
              >
                {project.desc[lang]}
              </p>

              {/* Bottom CTA */}
              <div className="mt-auto">
                {hovered && (
                  <div
                    className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl animate-pulse"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(138, 43, 226, 0.2))",
                      border: "1px solid rgba(0, 255, 255, 0.4)",
                      boxShadow:
                        "0 0 30px rgba(0, 255, 255, 0.4), inset 0 0 20px rgba(0, 255, 255, 0.1)",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-cyan-400"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    <span className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                      {lang === "pl"
                        ? "Kliknij aby zobaczyć szczegóły"
                        : "Click to view details"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-3xl" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-3xl" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-400/50 rounded-br-3xl" />
          </div>
        </div>
      </Html>
    </group>
  );
};
