"use client";

import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";

const HolographicMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uTexture: new THREE.Texture(),
    uColor: new THREE.Color("#00ffea"),
    uOpacity: 1.0,
    uHover: 0.0,
    uGlitch: 0.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uGlitch;

    // Funkcja losowa
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec3 pos = position;
      
      // Delikatne falowanie
      pos.z += sin(pos.y * 5.0 + uTime * 2.0) * 0.02;

      // Glitch geometryczny
      if (uGlitch > 0.0) {
          float jerk = step(0.95, random(vec2(uTime * 10.0, pos.y)));
          pos.x += (random(vec2(uTime)) - 0.5) * 0.1 * uGlitch * jerk;
      }
      
      vPosition = pos;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uHover;
    uniform float uGlitch;

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // 1. EFEKTY WIZUALNE
      float scanline = sin(vUv.y * 200.0 - uTime * 3.0) * 0.5 + 0.5;
      vec3 viewDir = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.0);

      // 2. KOLOR
      // Baza: Kolor tekstury + Kolor hologramu.
      // Używamy max(), żeby ciemne piksele nie były czarne, tylko miały odcień hologramu
      vec3 contentColor = mix(uColor * 0.5, texColor.rgb, 0.8); 
      
      vec3 finalColor = contentColor;
      finalColor += uColor * scanline * 0.3; // Paski
      finalColor += uColor * fresnel * 1.5;  // Krawędzie (MOCNE)
      finalColor += vec3(1.0) * uHover * 0.5; // Hover

      // Glitch
      if (uGlitch > 0.0) {
           finalColor.r += 0.3 * uGlitch;
           finalColor.b += 0.3 * uGlitch;
      }

      // 3. ALPHA (KLUCZOWA ZMIANA)
      // Nie uzależniamy alphy od jasności zdjęcia!
      // Karta ma stałą bazową widoczność (0.4) + fresnel.
      float alpha = (0.4 + fresnel * 0.6) * uOpacity;

      gl_FragColor = vec4(finalColor, alpha);
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

export { HolographicMaterialImpl };
