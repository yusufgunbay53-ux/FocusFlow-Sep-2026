import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0b111e",
        neon: "#00d2ff",
        panel: "rgba(16, 24, 40, 0.72)",
      },
      boxShadow: {
        glow: "0 0 24px rgba(0, 210, 255, 0.25)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
