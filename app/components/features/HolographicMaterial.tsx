"use client";

import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

export const HolographicMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uTexture: null,
    uColor: new THREE.Color("#00ffea"),
    uOpacity: 1.0,
    uHover: 0.0,
  },

  // =======================
  // VERTEX SHADER
  // =======================
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    uniform float uTime;
    uniform float uHover;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);

      vec3 pos = position;

      // subtelne falowanie hologramu
      pos.z += sin(pos.y * 10.0 + uTime * 2.0) * 0.03;
      pos.z += uHover * 0.15;

      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,

  // =======================
  // FRAGMENT SHADER
  // =======================
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float uTime;
    uniform float uOpacity;
    uniform float uHover;

    void main() {

      // --- tekstura (Twoje JPG)
      vec3 texColor = texture2D(uTexture, vUv).rgb;

      // --- scanlines
      float scanline = sin(vUv.y * 300.0 - uTime * 6.0) * 0.15 + 0.85;

      // --- fresnel (krawędzie świecą)
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);

      // --- miks hologram + obraz
      vec3 color = mix(uColor * 0.25, texColor, 0.85);
      color += fresnel * uColor * 2.5;

      // --- hover boost
      color += uHover * 0.4;

      float alpha = (0.75 + fresnel * 0.25) * uOpacity;

      gl_FragColor = vec4(color * scanline, alpha);
    }
  `
);

extend({ HolographicMaterialImpl });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      holographicMaterialImpl: any;
    }
  }
}

export const HolographicMaterial = HolographicMaterialImpl;
