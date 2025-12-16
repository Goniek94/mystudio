"use client";

import React, { useEffect, useRef } from "react";

export function PixelatingLogo({
  src,
  onComplete,
}: {
  src: string;
  onComplete?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Skalowanie: zdjęcie będzie miało max 300px szerokości, zachowując proporcje
      const displayWidth = Math.min(window.innerWidth * 0.8, 300);
      const scale = displayWidth / img.width;
      const displayHeight = img.height * scale;

      canvas.width = displayWidth;
      canvas.height = displayHeight;

      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
      const imageData = ctx.getImageData(
        0,
        0,
        displayWidth,
        displayHeight
      ).data;
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      const particles: any[] = [];
      const skip = 3; // Gęstość pikseli

      for (let y = 0; y < displayHeight; y += skip) {
        for (let x = 0; x < displayWidth; x += skip) {
          const alpha = imageData[(y * displayWidth + x) * 4 + 3];
          if (alpha > 128) {
            particles.push({
              targetX: x,
              targetY: y,
              curX: -Math.random() * 600 - 100, // Start poza ekranem z lewej
              curY: y + (Math.random() - 0.5) * 400,
              size: Math.random() * 2 + 1,
              speed: 0.02 + Math.random() * 0.03,
              color: `rgba(16, 185, 129, ${Math.random() * 0.5 + 0.5})`, // Zielone odcienie
            });
          }
        }
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let finished = true;

        particles.forEach((p) => {
          const dx = p.targetX - p.curX;
          const dy = p.targetY - p.curY;
          p.curX += dx * p.speed;
          p.curY += dy * p.speed;

          if (Math.abs(dx) > 0.5) finished = false;

          ctx.fillStyle = p.color;
          ctx.fillRect(p.curX, p.curY, p.size, p.size);
        });

        if (!finished) {
          requestAnimationFrame(animate);
        } else {
          if (onComplete) onComplete();
        }
      };
      animate();
    };

    img.onerror = () => {
      console.error("Nie znaleziono pliku pod ścieżką:", src);
      if (onComplete) onComplete();
    };
  }, [src, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"
    />
  );
}
