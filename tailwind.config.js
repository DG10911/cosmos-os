/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm, bright, festive — Indian-consumer palette
        bg: {
          DEFAULT: "#FFF6EC", // warm cream app background
          card: "#FFFFFF", // clean white cards
          elevated: "#FFF1E0", // soft cream for elevated surfaces
          hover: "#FFF3E6",
        },
        // "gold" = primary saffron (owns the app) — most CTAs use text-gold/bg-gold
        gold: {
          DEFAULT: "#FF6B2C", // saffron / Swiggy-orange primary
          dim: "#E8551C",
        },
        saffron: "#FF6B2C",
        marigold: "#FF9A1F",
        amber: "#FFC53D", // festive gold accent (streak, karma, "auspicious")
        // "cosmic" = mystic violet for AI / predictions
        cosmic: {
          DEFAULT: "#7C3AED",
          deep: "#5B21B6",
        },
        rose: "#F43F6E",
        text: {
          primary: "#2A1B10", // warm ink
          muted: "#8C7A68", // warm gray
          faint: "#BBA894",
        },
        success: "#16A34A", // WhatsApp-style green (online / money)
        danger: "#E5484D",
        cyan: "#0EA5E9",
      },
      fontFamily: {
        serif: ['"Fraunces"', "Georgia", "serif"], // sophisticated editorial display
        sans: ['"Inter"', "system-ui", "sans-serif"], // professional product body
        mono: ['"JetBrains Mono"', "monospace"],
      },
      borderRadius: {
        card: "20px",
        btn: "14px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        twinkle: { "0%,100%": { opacity: "0.25" }, "50%": { opacity: "0.9" } },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "pulse-gold": {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(255,107,44,0.4)" },
          "50%": { boxShadow: "0 0 22px 4px rgba(255,107,44,0.35)" },
        },
        "flame-flicker": {
          "0%,100%": { transform: "scale(1)" },
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
