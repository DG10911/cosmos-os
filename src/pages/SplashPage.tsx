import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { StarField } from "../components/StarField";
import { Spark, Mandala } from "../components/Glyphs";

const FEATURES = [
  { emoji: "🔮", text: "An AI that remembers your whole chart" },
  { emoji: "✓", text: "15,000+ verified astrologers, 94% accurate" },
  { emoji: "🪔", text: "Your daily cosmic habit — like morning chai" },
];

export default function SplashPage() {
  const nav = useNavigate();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-bg">
      <StarField count={110} />

      {/* rotating mandala halo */}
      <div
        className="pointer-events-none absolute left-1/2 top-[26%] z-0 -translate-x-1/2 -translate-y-1/2"
        style={{ animation: "mandala-spin 60s linear infinite" }}
      >
        <Mandala size={360} className="text-gold/12" />
      </div>
      <style>{`
        @keyframes mandala-spin{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}
        @keyframes splash-orbit-1{from{transform:rotate(0) translateX(88px) rotate(0)}to{transform:rotate(360deg) translateX(88px) rotate(-360deg)}}
        @keyframes splash-orbit-2{from{transform:rotate(140deg) translateX(120px) rotate(-140deg)}to{transform:rotate(500deg) translateX(120px) rotate(-500deg)}}
        @keyframes splash-orbit-3{from{transform:rotate(250deg) translateX(150px) rotate(-250deg)}to{transform:rotate(610deg) translateX(150px) rotate(-610deg)}}
        @keyframes wordmark-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      `}</style>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[420px] flex-col items-center justify-between px-6 py-16">
        {/* Center block */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {/* Orbiting-planet emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.34, 1.3, 0.64, 1] }}
            className="relative mb-10 flex h-40 w-40 items-center justify-center"
          >
            {/* orbit rings */}
            <span className="absolute h-[176px] w-[176px] rounded-full border border-gold/20" />
            <span className="absolute h-[240px] w-[240px] rounded-full border border-cosmic/15" />
            {/* sun core */}
            <span
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                background: "radial-gradient(circle at 34% 30%,#FFD873,#FF6B2C 75%)",
                boxShadow: "0 0 44px rgba(255,154,31,0.75), inset 0 0 20px rgba(255,255,255,0.4)",
                animation: "flame-flicker 2.4s ease-in-out infinite",
              }}
            >
              <Spark size={34} className="text-white" />
            </span>
            {/* orbiting planets */}
            <span className="absolute h-3.5 w-3.5 rounded-full bg-cosmic" style={{ animation: "splash-orbit-1 7s linear infinite", boxShadow: "0 0 12px rgba(124,58,237,0.9)" }} />
            <span className="absolute h-3 w-3 rounded-full bg-rose" style={{ animation: "splash-orbit-2 11s linear infinite", boxShadow: "0 0 12px rgba(244,63,110,0.9)" }} />
            <span className="absolute h-2.5 w-2.5 rounded-full bg-amber" style={{ animation: "splash-orbit-3 15s linear infinite", boxShadow: "0 0 12px rgba(255,197,61,0.9)" }} />
          </motion.div>

          {/* wordmark with shimmer sweep */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="serif text-6xl leading-none"
            style={{
              fontSize: "60px",
              background:
                "linear-gradient(110deg,#FF6B2C 20%,#FFD873 40%,#FF6B2C 60%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "wordmark-shimmer 3.5s linear infinite",
            }}
          >
            COSMOS OS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="serif mt-4 text-[20px] italic text-text-primary"
          >
            Your Life Operating System
          </motion.p>

          {/* staggered value props */}
          <div className="mt-9 space-y-2.5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.18, duration: 0.6 }}
                className="glass flex items-center gap-2.5 rounded-full px-4 py-2.5"
              >
                <span className="text-base">{f.emoji}</span>
                <span className="text-[13px] font-medium text-text-primary">
                  {f.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.7 }}
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
