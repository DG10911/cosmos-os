/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0B0B14",
          card: "#161629",
          elevated: "#1E1E33",
        },
        gold: {
          DEFAULT: "#F4C430",
          dim: "#B8930F",
        },
        cosmic: {
          DEFAULT: "#8B7CFC",
          deep: "#4c1d95",
        },
        text: {
          primary: "#F5F5F7",
          muted: "#A1A1AA",
        },
        success: "#4ADE80",
        danger: "#F87171",
      },
      fontFamily: {
        serif: ['"Instrument Serif"', "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(244,196,48,0.4)" },
          "50%": { boxShadow: "0 0 20px 4px rgba(244,196,48,0.4)" },
        },
        "flame-flicker": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
      },
      animation: {
        twinkle: "twinkle 3s ease-in-out infinite",
        "slide-up": "slide-up 500ms cubic-bezier(0.4,0,0.2,1)",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "flame-flicker": "flame-flicker 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
