import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#08090d",
        surface: "#0f1118",
        surfaceHover: "#161924",
        borderSubtle: "#1e2230",
        borderActive: "#2d354b",
        neon: {
          cyan: "#00f2fe",
          blue: "#4facfe",
          violet: "#9d4edd",
          emerald: "#00f59b",
          rose: "#ff3b5c",
          amber: "#ffb703",
        },
      },
      boxShadow: {
        neonCyan: "0 0 20px -3px rgba(0, 242, 254, 0.4)",
        neonViolet: "0 0 20px -3px rgba(157, 78, 221, 0.4)",
        neonEmerald: "0 0 20px -3px rgba(0, 245, 155, 0.4)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
