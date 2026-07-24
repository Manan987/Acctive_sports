import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Athletic brand palette
        ink: {
          50: "#f4f6fb",
          100: "#e7ebf5",
          200: "#c8d2e6",
          300: "#9aabce",
          400: "#647cb0",
          500: "#425a95",
          600: "#33477b",
          700: "#2a3a64",
          800: "#213052",
          900: "#0e1626",
          950: "#070b14",
        },
        flame: {
          50: "#fff5ed",
          100: "#ffe8d4",
          200: "#ffcda8",
          300: "#ffab70",
          400: "#ff7d36",
          500: "#ff5a0f",
          600: "#f03d05",
          700: "#c72c07",
          800: "#9e250e",
          900: "#7f210f",
        },
        electric: {
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        marquee: "marquee 24s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
