import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        navy: {
          50: "#eef3fb",
          100: "#d6e2f5",
          200: "#aec4ea",
          300: "#7a9dd9",
          400: "#4c74c2",
          500: "#2f57a6",
          600: "#224385",
          700: "#1b356b",
          800: "#142851",
          900: "#0d1b38",
          950: "#071026",
        },
        brand: {
          50: "#fff8eb",
          100: "#ffecc6",
          200: "#ffd688",
          300: "#ffbb4a",
          400: "#ffa220",
          500: "#f98207",
          600: "#dd5d02",
          700: "#b73e06",
          800: "#94300c",
          900: "#7a290d",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,162,32,.25), 0 20px 60px -15px rgba(249,130,7,.45)",
        card: "0 1px 2px rgba(13,27,56,.06), 0 12px 32px -12px rgba(13,27,56,.18)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
        "fade-up": { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        draw: { to: { strokeDashoffset: "0" } },
        swing: { "0%,100%": { transform: "rotate(-4deg)" }, "50%": { transform: "rotate(4deg)" } },
        rise: { from: { transform: "scaleY(0)" }, to: { transform: "scaleY(1)" } },
        "pulse-ring": { "0%": { transform: "scale(.8)", opacity: ".8" }, "100%": { transform: "scale(2.2)", opacity: "0" } },
        shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "fade-up": "fade-up .8s cubic-bezier(.2,.7,.2,1) both",
        marquee: "marquee 35s linear infinite",
        draw: "draw 3s ease-out forwards",
        swing: "swing 5s ease-in-out infinite",
        rise: "rise 1.2s cubic-bezier(.2,.7,.2,1) both",
        "pulse-ring": "pulse-ring 2s cubic-bezier(.2,.7,.2,1) infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
