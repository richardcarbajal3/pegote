import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f4ead2",
        "paper-2": "#ecdfb8",
        ink: "#1a1410",
        tomato: "#e63946",
        mustard: "#f4a261",
        blue: "#264e8a",
        pink: "#ff3d8b",
        mint: "#06b894",
        violet: "#7e3bff"
      },
      fontFamily: {
        display: ["var(--font-bungee)", "sans-serif"],
        serif: ["var(--font-fraunces)", "serif"],
        mono: ["var(--font-dm-mono)", "monospace"]
      },
      boxShadow: {
        ink: "6px 6px 0 #1a1410",
        "ink-sm": "4px 4px 0 #1a1410",
        "ink-lg": "10px 10px 0 #1a1410",
        tomato: "6px 6px 0 #e63946",
        blue: "6px 6px 0 #264e8a",
        violet: "6px 6px 0 #7e3bff",
        mustard: "6px 6px 0 #f4a261"
      },
      keyframes: {
        scroll: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        },
        bob: {
          "0%,100%": { transform: "rotate(var(--rot,0deg)) translateY(0)" },
          "50%": { transform: "rotate(var(--rot,0deg)) translateY(-12px)" }
        }
      },
      animation: {
        scroll: "scroll 30s linear infinite",
        bob: "bob 5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
