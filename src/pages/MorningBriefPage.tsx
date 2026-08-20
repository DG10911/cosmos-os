import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sun, Target, ShieldAlert, Clock, Flame, Sparkles, Volume2, VolumeX } from "lucide-react";
import { ttsSupported, speak, stopSpeaking } from "../lib/voice";
import { useApp } from "../state/AppState";
import { useToast } from "../components/Toast";
import { Confetti } from "../components/Confetti";

const CARDS = [
  {
    icon: Sun,
    tint: "#FFC53D",
    kicker: "Good morning, Anya",
    title: "The universe noticed you woke up.",
    body: "Your Moon is illuminated today. Trust intuition over strategy.",
  },
  {
    icon: Sparkles,
    tint: "#FF9A1F",
    kicker: "Today's energy",
    title: "Bright & rising ☀",
    body: "Rahu Mahadasha keeps you driven. Channel it into one big thing.",
  },
  {
    icon: Target,
    tint: "#7C3AED",
    kicker: "Your one focus",
    title: "Have the promotion conversation.",
    body: "Jupiter favours bold asks before noon. This is your window.",
  },
  {
    icon: ShieldAlert,
    tint: "#E5484D",
    kicker: "Gentle caution",
    title: "Don't overcommit after 4 PM.",
    body: "Rahu Kaal (4:30–6:00) — pause big decisions, breathe.",
  },
  {
    icon: Clock,
    tint: "#0EA5E9",
    kicker: "Lucky window",
    title: "14:22 – 15:47",
    body: "Money & luck align. Send that message, make that call.",
  },
  {
    icon: Flame,
    tint: "#FF6B2C",
    kicker: "Today's ritual",
    title: "Light a diya at sunset.",
    body: "A small offering. A big shift. +10 Karma when you're done.",
  },
];

export default function MorningBriefPage() {
  const nav = useNavigate();
  const app = useApp();
  const toast = useToast();
  const [i, setI] = useState(0);
  const [confetti, setConfetti] = useState(0);
  const [narrate, setNarrate] = useState(false);
  const last = i >= CARDS.length;

  // Voice RJ — read each card aloud as it appears when narration is on.
  useEffect(() => {
    if (narrate && !last) {
      const c = CARDS[i];
      speak(`${c.title}. ${c.body}`, "en-IN");
    }
    return () => stopSpeaking();
  }, [i, narrate, last]);

  function next() {
    if (i < CARDS.length) setI((v) => v + 1);
  }

  function finish() {
    app.addKarma(5, "Completed morning brief");
    setConfetti((c) => c + 1);
    toast("Morning brief complete · +5 Karma ✦");
    setTimeout(() => nav("/today"), 900);
  }

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(120% 70% at 50% -10%, rgba(255,197,61,0.5), transparent 60%), linear-gradient(165deg,#FF6B2C 0%,#FF9A1F 50%,#FFB84D 100%)",
      }}
      onClick={next}
    >
      <Confetti fire={confetti} />

      {/* progress */}
      <div
        className="relative z-10 flex gap-1.5 p-3"
        style={{ paddingTop: "calc(0.75rem + var(--safe-top))" }}
      >
        {CARDS.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
            <div className="h-full bg-white" style={{ width: idx < i ? "100%" : "0%" }} />
          </div>
        ))}
      </div>
      {ttsSupported() && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setNarrate((v) => {
              if (v) stopSpeaking();
              else if (!last) speak(`${CARDS[i].title}. ${CARDS[i].body}`, "en-IN");
              return !v;
            });
          }}
          className="absolute left-3 top-8 z-20 flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur"
        >
          {narrate ? <Volume2 size={14} /> : <VolumeX size={14} />}
          {narrate ? "Listening" : "Listen"}
        </button>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); stopSpeaking(); nav("/today"); }}
        className="absolute right-3 top-8 z-20 text-white/85"
      >
        <X size={22} />
      </button>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 text-center">
        <AnimatePresence mode="wait">
          {!last ? (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <span
                className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur"
                style={{ boxShadow: `0 0 40px ${CARDS[i].tint}88` }}
              >
                {(() => {
                  const Icon = CARDS[i].icon;
                  return <Icon size={38} />;
                })()}
              </span>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-white/85">
                {CARDS[i].kicker}
              </p>
              <h1 className="serif mt-2 text-[32px] leading-tight">{CARDS[i].title}</h1>
              <p className="mt-3 max-w-[300px] text-[15px] text-white/90">{CARDS[i].body}</p>
            </motion.div>
          ) : (
            <motion.div
              key="end"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              {/* lockscreen widget mock */}
              <div className="w-64 rounded-3xl bg-black/25 p-4 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-lg">☽</span>
                  <div className="text-left">
                    <p className="text-[11px] text-white/70">COSMOS OS · 6:30 AM</p>
                    <p className="text-sm font-bold">Your Moon is rising. Big day.</p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2 text-[10px]">
                  <span className="rounded-full bg-white/15 px-2 py-0.5">🔥 {app.streak}</span>
                  <span className="rounded-full bg-white/15 px-2 py-0.5">Lucky 14:22</span>
                  <span className="rounded-full bg-white/15 px-2 py-0.5">1 ritual</span>
                </div>
              </div>
              <p className="mt-5 text-xs text-white/80">Add this widget → never miss a morning</p>
              <h2 className="serif mt-4 text-2xl">Your day is mapped.</h2>
              <button
                onClick={(e) => { e.stopPropagation(); finish(); }}
                className="mt-5 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#FF6B2C] active:scale-95"
              >
                Start my day ✦
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!last && (
        <div className="relative z-10 pb-8 text-center text-xs text-white/70">tap to continue</div>
      )}
    </div>
  );
}
