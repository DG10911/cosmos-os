import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StarField } from "../components/StarField";
import { Spark } from "../components/Glyphs";

export default function SplashPage() {
  const nav = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg">
      <StarField count={110} />

      {/* Milky-way arc */}
      <svg
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-1/3 w-full opacity-40"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="mw" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B7CFC" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#F4C430" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#8B7CFC" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,120 C120,40 280,40 400,110 L400,0 L0,0 Z"
          fill="url(#mw)"
        />
      </svg>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[420px] flex-col items-center justify-between px-6 py-16">
        {/* Center block */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="serif gold-glow text-6xl leading-none text-gold"
            style={{ fontSize: "64px" }}
          >
            COSMOS OS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="serif mt-6 text-[22px] italic text-text-primary"
          >
            Your Life Operating System
          </motion.p>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="flex w-full flex-col items-center"
        >
          <button
            className="btn-gold animate-pulse-gold flex w-full items-center justify-center gap-2 rounded-full text-lg"
            onClick={() => nav("/auth")}
          >
            <Spark size={18} /> Begin Your Journey
          </button>
          <p className="mt-3 text-center text-xs text-text-muted">
            As personal as your chart. As habitual as your morning.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
