"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&^*";

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleSpeed?: number; // Szybkość zmian liter
  revealSpeed?: number; // Szybkość odsłaniania
}

export function ScrambleText({
  text,
  className = "",
  scrambleSpeed = 30,
  revealSpeed = 50,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const startScramble = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }

      iteration += 1 / (revealSpeed / 10); // Kontrola tempa odsłaniania
    }, scrambleSpeed);
  };

  useEffect(() => {
    startScramble();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return (
    <span
      className={`inline-block font-mono cursor-default ${className}`}
      onMouseEnter={() => startScramble()} // Ponowne szyfrowanie po najechaniu
    >
      {displayText}
    </span>
  );
}
