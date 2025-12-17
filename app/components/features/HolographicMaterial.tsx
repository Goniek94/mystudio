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
  // Vertex Shader - Enhanced with more dynamic movement
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    uniform float uTime;
    uniform float uGlitch;
    uniform float uHover;

    // Noise function for organic movement
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // 3D Noise
    float noise(vec3 p) {
        vec3 i = floor(p);
        vec3 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float n = i.x + i.y * 57.0 + 113.0 * i.z;
        return mix(
            mix(mix(random(vec2(n + 0.0, 0.0)), random(vec2(n + 1.0, 0.0)), f.x),
                mix(random(vec2(n + 57.0, 0.0)), random(vec2(n + 58.0, 0.0)), f.x), f.y),
            mix(mix(random(vec2(n + 113.0, 0.0)), random(vec2(n + 114.0, 0.0)), f.x),
                mix(random(vec2(n + 170.0, 0.0)), random(vec2(n + 171.0, 0.0)), f.x), f.y),
            f.z
        );
    }

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vec3 pos = position;
      
      // Holographic wave distortion - more pronounced
      float wave1 = sin(pos.y * 8.0 + uTime * 2.5) * 0.03;
      float wave2 = sin(pos.x * 6.0 - uTime * 1.8) * 0.02;
      pos.z += wave1 + wave2;
      
      // Organic noise displacement
      float noiseDisp = noise(vec3(pos.xy * 3.0, uTime * 0.5)) * 0.015;
      pos.z += noiseDisp;

      // Hover effect - card lifts and expands
      pos.z += uHover * 0.3;
      pos.xy *= 1.0 + uHover * 0.05;

      // Glitch effect - more dramatic
      if (uGlitch > 0.0) {
          float jerk = step(0.92, random(vec2(uTime * 10.0, pos.y)));
          pos.x += (random(vec2(uTime, pos.y)) - 0.5) * 0.15 * uGlitch * jerk;
          pos.y += (random(vec2(uTime * 1.3, pos.x)) - 0.5) * 0.1 * uGlitch * jerk;
      }
      
      vPosition = pos;
      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader - Enhanced with more holographic effects
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    uniform float uTime;
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uHover;
    uniform float uGlitch;

    // Improved noise function
    float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // Chromatic aberration effect
    vec3 chromaticAberration(sampler2D tex, vec2 uv, float amount) {
        vec2 direction = uv - vec2(0.5);
        vec3 color;
        color.r = texture2D(tex, uv + direction * amount * 0.01).r;
        color.g = texture2D(tex, uv).g;
        color.b = texture2D(tex, uv - direction * amount * 0.01).b;
        return color;
    }

    void main() {
      // Chromatic aberration on texture
      float aberrationAmount = uHover * 2.0 + uGlitch * 3.0;
      vec3 texColor = chromaticAberration(uTexture, vUv, aberrationAmount);
      
      // HOLOGRAPHIC SCANLINES - Multiple layers
      float scanline1 = sin(vUv.y * 300.0 - uTime * 4.0) * 0.5 + 0.5;
      float scanline2 = sin(vUv.y * 150.0 + uTime * 2.0) * 0.3 + 0.7;
      float scanlines = scanline1 * scanline2;
      
      // FRESNEL - Enhanced edge glow
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
      
      // RGB SHIFT EFFECT (holographic rainbow)
      float shift = sin(vUv.y * 10.0 + uTime) * 0.5 + 0.5;
      vec3 rainbow = vec3(
          sin(shift * 3.14159 + 0.0) * 0.5 + 0.5,
          sin(shift * 3.14159 + 2.0) * 0.5 + 0.5,
          sin(shift * 3.14159 + 4.0) * 0.5 + 0.5
      );
      
      // GRID PATTERN - Holographic grid
      float grid = 0.0;
      float gridSize = 40.0;
      vec2 gridUv = fract(vUv * gridSize);
      float gridLine = step(0.95, max(gridUv.x, gridUv.y));
      grid = gridLine * 0.3;

      // NOISE TEXTURE - Digital artifacts
      float noisePattern = noise(vUv * 100.0 + uTime * 0.5) * 0.1;
      
      // COLOR COMPOSITION
      vec3 contentColor = mix(uColor * 0.3, texColor, 0.85);
      
      vec3 finalColor = contentColor;
      finalColor += uColor * scanlines * 0.4;           // Scanlines
      finalColor += uColor * fresnel * 2.5;             // Strong edge glow
      finalColor += rainbow * fresnel * 0.6;            // Rainbow edges
      finalColor += uColor * grid;                      // Grid overlay
      finalColor += noisePattern;                       // Digital noise
      finalColor += vec3(1.0) * uHover * 0.8;          // Hover brightness
      
      // Pulsing effect
      float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
      finalColor *= pulse;

      // Glitch color distortion
      if (uGlitch > 0.0) {
           finalColor.r += 0.4 * uGlitch;
           finalColor.g -= 0.2 * uGlitch;
           finalColor.b += 0.4 * uGlitch;
           
           // Digital blocks
           float blockNoise = step(0.7, noise(floor(vUv * 20.0 + uTime * 10.0)));
           finalColor += vec3(blockNoise) * uGlitch * 0.5;
      }

      // ALPHA - MAKSYMALNA WIDOCZNOŚĆ!
      float alpha = (0.85 + fresnel * 0.15) * uOpacity;
      alpha += uHover * 0.15;
      
      // Minimalna edge mask - karty muszą być widoczne!
      float edgeMask = smoothstep(0.0, 0.02, vUv.x) * 
                       smoothstep(0.0, 0.02, vUv.y) * 
                       smoothstep(0.0, 0.02, 1.0 - vUv.x) * 
                       smoothstep(0.0, 0.02, 1.0 - vUv.y);
      alpha *= edgeMask;
      
      // Minimum alpha - karty MUSZĄ być widoczne!
      alpha = max(alpha, 0.6);

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
