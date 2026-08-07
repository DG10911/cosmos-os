import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronUp } from "lucide-react";
import { StarField } from "../components/StarField";
import { avatarUrl } from "../data/seed";
import { useToast } from "../components/Toast";

const AXES = [
  { label: "Career", delta: "+18%" },
  { label: "Finance", delta: "+12%" },
  { label: "Love", delta: "+9%" },
  { label: "Health", delta: "+21%" },
  { label: "Spirituality", delta: "+27%" },
  { label: "Confidence", delta: "+24%" },
  { label: "Learning", delta: "+15%" },
  { label: "Goals", delta: "+19%" },
];

export default function ReplayPage() {
  const nav = useNavigate();
  const toast = useToast();
  const [slide, setSlide] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);

  // auto-advance
  useEffect(() => {
    if (slide >= 2) return;
    const t = setTimeout(() => setSlide((s) => s + 1), 5000);
    return () => clearTimeout(t);
  }, [slide]);

  function advance() {
    if (slide < 2) setSlide((s) => s + 1);
    else setShowUpsell(true);
  }

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg,#0B0B14 0%,#4c1d95 50%,#1a0b2e 100%)",
      }}
      onClick={advance}
    >
      <StarField count={120} />

      {/* progress bars */}
      <div className="relative z-10 flex gap-1.5 p-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-white transition-all"
              style={{ width: i < slide ? "100%" : i === slide ? "100%" : "0%" }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          nav("/me");
        }}
        className="absolute right-3 top-8 z-20 text-white/70"
      >
        <X size={22} />
      </button>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 text-center">
        <AnimatePresence mode="wait">
          {slide === 0 && (
            <Slide key={0}>
              <h1 className="serif text-5xl leading-tight text-white">
                Your Cosmic Year 2026
              </h1>
              <p className="mt-6 text-lg text-white/80">
                47 rituals · 4 astrologers · 118-day streak
              </p>
            </Slide>
          )}
          {slide === 1 && (
            <Slide key={1}>
              <h2 className="serif text-4xl text-white">
                Your Predictions Scoreboard
              </h2>
              <div className="mt-8 flex items-center justify-center gap-8">
                <div>
                  <div className="serif text-6xl text-white">12</div>
                  <div className="text-xs text-white/60">made</div>
                </div>
                <div>
                  <div className="serif text-6xl text-gold gold-glow">8</div>
                  <div className="text-xs text-white/60">came true</div>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <img src={avatarUrl(1)} className="h-8 w-8 rounded-full" alt="" />
                <span className="text-sm text-white">
                  Astrologer of the Year: Pt. Suresh · 94%
                </span>
              </div>
            </Slide>
          )}
          {slide === 2 && (
            <Slide key={2}>
              <h2 className="serif text-4xl text-white">Your Growth Story</h2>
              <div className="mt-6 grid w-full max-w-[300px] grid-cols-2 gap-x-6 gap-y-2.5">
                {AXES.map((a) => (
                  <div
                    key={a.label}
                    className="flex items-center justify-between border-b border-white/10 pb-1"
                  >
                    <span className="text-sm text-white/80">{a.label}</span>
                    <span className="mono text-sm font-semibold text-gold">
                      {a.delta}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-white/60">
                Top 12% on the Confidence axis
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toast("Cosmic Year card saved ✨");
                }}
                className="btn-gold mt-6 rounded-full text-sm"
              >
                Share Your Cosmic Year ✨
              </button>
            </Slide>
          )}
        </AnimatePresence>
      </div>

      {slide < 2 && (
        <div className="relative z-10 flex items-center justify-center pb-8 text-white/50">
          <ChevronUp size={16} className="animate-bounce" />
          <span className="ml-1 text-xs">tap to continue</span>
        </div>
      )}

      {/* upsell */}
      <AnimatePresence>
        {showUpsell && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 px-8"
          >
            <div className="rounded-2xl border border-gold/30 bg-bg-elevated p-6 text-center">
              <h3 className="serif text-2xl text-white">
                Unlock the full 12-slide Replay
              </h3>
              <p className="mt-2 text-sm text-text-muted">
                Plus weekly recaps & your full growth chart with Cosmos+.
              </p>
              <button
                onClick={() => nav("/me")}
                className="btn-gold mt-5 w-full rounded-btn"
              >
                Try Cosmos+ Free
              </button>
              <button
                onClick={() => nav("/me")}
                className="mt-3 text-xs text-text-muted"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Slide({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      {children}
    </motion.div>
  );
}
