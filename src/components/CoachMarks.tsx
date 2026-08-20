import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Compass, Sparkles } from "lucide-react";
import { store } from "../lib/utils";

/**
 * First-run coach marks on the Today screen — a 3-step spotlight tour pointing
 * at the streak, the feature tour, and the Cosmos Twin. Shown once (gated by a
 * localStorage flag), skippable, and anchored to the phone screen's corners so
 * it needs no element refs.
 */
const KEY = "cosmos_coach_seen";

type Step = {
  icon: typeof Flame;
  title: string;
  body: string;
  // where the callout card sits + which corner the glow points to
  pos: string;
  glow: string;
};

const STEPS: Step[] = [
  {
    icon: Flame,
    title: "Your daily streak 🔥",
    body: "Open COSMOS OS every day to keep your streak alive and earn Karma.",
    pos: "top-[calc(3.6rem+var(--safe-top))] right-4",
    glow: "top-[calc(0.9rem+var(--safe-top))] right-6",
  },
  {
    icon: Compass,
    title: "Explore everything",
    body: "Tap the tour banner anytime to discover every feature — consult, tools, muhurat & more.",
    pos: "top-[7.5rem] left-4 right-4",
    glow: "top-[8.5rem] left-1/2 -translate-x-1/2",
  },
  {
    icon: Sparkles,
    title: "Meet Cosmos Twin",
    body: "Your 24×7 AI astrologer — it already knows your whole chart. Ask it anything.",
    pos: "bottom-[9.5rem] right-4",
    glow: "bottom-[86px] right-6",
  },
];

export function CoachMarks() {
  // Show once, but only AFTER the feature guide has been seen — so the coach
  // doesn't stack on top of the auto-opened tour for brand-new users.
  const [i, setI] = useState(() => {
    if (store.get(KEY, false)) return -1;
    if (!store.get("cosmos_guide_seen", false)) return -1;
    return 0;
  });
  if (i < 0) return null;
  const step = STEPS[i];

  function end() {
    store.set(KEY, true);
    setI(-1);
  }
  function next() {
    if (i >= STEPS.length - 1) end();
    else setI(i + 1);
  }

  return (
    <AnimatePresence>
      <motion.div
        key="coach"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80]"
        onClick={next}
      >
        <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />

        <div className="pointer-events-none relative mx-auto h-full w-full max-w-[420px]">
          {/* pulsing target ring */}
          <span
            className={`absolute h-11 w-11 rounded-full ${step.glow}`}
            style={{
              boxShadow: "0 0 0 3px rgba(255,255,255,0.9), 0 0 30px 8px rgba(255,138,61,0.6)",
              animation: "coach-pulse 1.6s ease-in-out infinite",
            }}
          />

          {/* callout card */}
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`absolute w-[260px] rounded-2xl bg-bg-elevated p-4 shadow-[0_18px_50px_rgba(0,0,0,0.5)] ${step.pos}`}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/15 text-gold">
                <step.icon size={16} />
              </span>
              <span className="serif text-[16px] text-text-primary">{step.title}</span>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-text-muted">{step.body}</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1">
                {STEPS.map((_, k) => (
                  <span
                    key={k}
                    className={`h-1.5 rounded-full transition-all ${k === i ? "w-4 bg-gold" : "w-1.5 bg-black/15"}`}
                  />
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="rounded-full bg-gold px-3.5 py-1.5 text-xs font-bold text-white active:scale-95"
              >
                {i >= STEPS.length - 1 ? "Got it" : "Next"}
              </button>
            </div>
          </motion.div>

          {/* skip */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              end();
            }}
            className="pointer-events-auto absolute left-1/2 top-[calc(0.7rem+var(--safe-top))] -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-medium text-white"
          >
            Skip tour
          </button>
        </div>
        <style>{`@keyframes coach-pulse{0%,100%{transform:scale(1);opacity:.95}50%{transform:scale(1.18);opacity:.5}}`}</style>
      </motion.div>
    </AnimatePresence>
  );
}
