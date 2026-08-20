import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Sunrise, ArrowRight } from "lucide-react";
import { StarField } from "../components/StarField";
import { Spark, Mandala } from "../components/Glyphs";
import { moonPhase } from "../lib/services";

const FEATURES = [
  { Icon: Sparkles, tint: "#7C3AED", text: "An AI that remembers your entire chart" },
  { Icon: ShieldCheck, tint: "#16A34A", text: "Verified Vedic astrologers, 24×7" },
  { Icon: Sunrise, tint: "#FF6B2C", text: "A daily cosmic habit — like morning chai" },
];

export default function SplashPage() {
  const nav = useNavigate();
  const moon = moonPhase();

  return (
    <div className="relative h-full w-full overflow-y-auto overflow-x-hidden bg-bg">
      <StarField count={110} />

      {/* rotating mandala halo */}
      <div
        className="pointer-events-none absolute left-1/2 top-[28%] z-0 -translate-x-1/2 -translate-y-1/2"
        style={{ animation: "mandala-spin 60s linear infinite" }}
      >
        <Mandala size={380} className="text-gold/10" />
      </div>
      <style>{`
        @keyframes mandala-spin{from{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}
        @keyframes splash-orbit-1{from{transform:rotate(0) translateX(84px) rotate(0)}to{transform:rotate(360deg) translateX(84px) rotate(-360deg)}}
        @keyframes splash-orbit-2{from{transform:rotate(140deg) translateX(116px) rotate(-140deg)}to{transform:rotate(500deg) translateX(116px) rotate(-500deg)}}
        @keyframes splash-orbit-3{from{transform:rotate(250deg) translateX(146px) rotate(-250deg)}to{transform:rotate(610deg) translateX(146px) rotate(-610deg)}}
        @keyframes wordmark-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes core-breathe{0%,100%{transform:scale(1);filter:brightness(1)}50%{transform:scale(1.05);filter:brightness(1.12)}}
      `}</style>

      <div className="relative z-10 mx-auto flex min-h-full w-full max-w-[420px] flex-col items-center px-6 pb-14 pt-14">
        {/* Live moon-phase chip — signals real data from second one */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="glass flex items-center gap-2 rounded-full px-3.5 py-1.5"
        >
          <span className="text-sm">{moon.emoji}</span>
          <span className="text-[11px] font-medium text-text-primary">
            Tonight · {moon.name} · {moon.illum}%
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-success">
            <span className="h-1.5 w-1.5 animate-flame-flicker rounded-full bg-success" />
            live
          </span>
        </motion.div>

        {/* Center block */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {/* Orbiting-planet emblem */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.34, 1.3, 0.64, 1] }}
            className="relative mb-11 flex h-40 w-40 items-center justify-center"
          >
            {/* orbit rings */}
            <span className="absolute h-[168px] w-[168px] rounded-full border border-gold/18" />
            <span className="absolute h-[232px] w-[232px] rounded-full border border-cosmic/12" />
            <span className="absolute h-[292px] w-[292px] rounded-full border border-rose/10" />
            {/* sun core */}
            <span
              className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full"
              style={{
                background: "radial-gradient(circle at 34% 30%,#FFE08A,#FF6B2C 78%)",
                boxShadow:
                  "0 0 48px rgba(255,154,31,0.7), inset 0 0 20px rgba(255,255,255,0.45)",
                animation: "core-breathe 3.6s ease-in-out infinite",
              }}
            >
              <Spark size={32} className="text-white" />
            </span>
            {/* orbiting planets */}
            <span
              className="absolute h-3 w-3 rounded-full bg-cosmic"
              style={{ animation: "splash-orbit-1 7s linear infinite", boxShadow: "0 0 12px rgba(124,58,237,0.9)" }}
            />
            <span
              className="absolute h-2.5 w-2.5 rounded-full bg-rose"
              style={{ animation: "splash-orbit-2 11s linear infinite", boxShadow: "0 0 12px rgba(244,63,110,0.9)" }}
            />
            <span
              className="absolute h-2 w-2 rounded-full bg-amber"
              style={{ animation: "splash-orbit-3 15s linear infinite", boxShadow: "0 0 12px rgba(255,197,61,0.9)" }}
            />
          </motion.div>

          {/* wordmark with shimmer sweep */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="serif leading-none"
            style={{
              fontSize: "56px",
              letterSpacing: "-0.02em",
              background: "linear-gradient(110deg,#FF6B2C 20%,#FFD873 40%,#FF6B2C 60%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "wordmark-shimmer 3.8s linear infinite",
            }}
          >
            COSMOS OS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="serif mt-3 text-[19px] italic text-text-muted"
          >
            Your Life Operating System
          </motion.p>

          {/* staggered value props */}
          <div className="mt-10 w-full space-y-2.5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.85 + i * 0.16, duration: 0.55 }}
                className="glass flex items-center gap-3 rounded-2xl px-4 py-3"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${f.tint}1a`, color: f.tint }}
                >
                  <f.Icon size={17} />
                </span>
                <span className="text-left text-[13px] font-medium text-text-primary">
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
            Begin Your Journey <ArrowRight size={18} />
          </button>
          <p className="mt-3 text-center text-xs text-text-muted">
            As personal as your chart. As habitual as your morning.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
