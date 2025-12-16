/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Ścieżki dla struktury bez folderu src (którą widzę u Ciebie w pasku bocznym)
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        // Animacja skanera na mapie (pionowa linia)
        scan: {
          "0%": { left: "0%" },
          "100%": { left: "100%" },
        },
        // Animacja przerywanych linii łączących miasta (SVG)
        dash: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        // Mruganie kursora "_" w Hero section
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        // Animacja tła w sekcji Stack (delikatny gradient)
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        // Efekt połysku na paskach umiejętności
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        scan: "scan 4s linear infinite",
        dash: "dash 20s linear infinite",
        blink: "blink 1s step-end infinite",
        gradient: "gradient 15s ease infinite",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};
