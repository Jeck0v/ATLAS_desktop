import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#EFEBCE",
        ink: "#191716",
        inkHov: "#262321",
        inkMid: "#211F1D",
      },
      fontFamily: {
        sans: ["Sansation", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      borderRadius: {
        window: "30px",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(5px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.22s ease both",
        fadeUpFast: "fadeUp 0.15s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
