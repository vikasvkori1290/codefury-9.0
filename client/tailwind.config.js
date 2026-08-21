/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b",
        surface: "#121215",
        "surface-raised": "#18181b",
        border: "#27272a",
        "border-light": "#3f3f46",
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#d4500a",
          800: "#9a3412",
          900: "#7c2d12",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"Space Mono"', '"JetBrains Mono"', "monospace"],
        pixel: ['"Press Start 2P"', "monospace"],
      },
      boxShadow: {
        retro: "4px 4px 0px #1a1a1a",
        "retro-lg": "6px 6px 0px #1a1a1a",
        "retro-brand": "4px 4px 0px #d4500a",
      },
    },
  },
  plugins: [],
};