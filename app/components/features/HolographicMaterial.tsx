"use client";

import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

export const HolographicMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color("#00ffea"),
    uOpacity: 1.0,
    uHover: 0.0,
    uGlitch: 0.0,
  },
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
      pos.z += sin(pos.y * 10.0 + uTime * 2.0) * 0.02 + (uHover * 0.1);
      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uHover;

    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
      float scanline = sin(vUv.y * 200.0 - uTime * 5.0) * 0.1 + 0.9;
      vec3 color = uColor + fresnel * 2.0;
      gl_FragColor = vec4(color * scanline, (0.7 + fresnel * 0.3) * uOpacity + uHover * 0.2);
    }
  `
);

extend({ HolographicMaterialImpl });
export const HolographicMaterial = HolographicMaterialImpl;
