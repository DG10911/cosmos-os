import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Briefcase,
  Heart,
  Coins,
  Activity,
  MessageCircle,
  Phone,
  Zap,
  Clock,
  BadgeCheck,
} from "lucide-react";
import { ASTROLOGERS, avatarUrl } from "../data/seed";
import { Orb } from "./CosmosAIPage";

const TOPICS = [
  { key: "career", label: "Career", sub: "Job moves, business timing, promotions", icon: Briefcase, tint: "#E0F2FE", fg: "#0EA5E9" },
  { key: "love", label: "Relationships", sub: "Marriage, compatibility, family friction", icon: Heart, tint: "#FFE4EC", fg: "#F43F6E" },
  { key: "money", label: "Money", sub: "Debt, investments, financial timing", icon: Coins, tint: "#DCFCE7", fg: "#16A34A" },
  { key: "health", label: "Health", sub: "Recovery timing, chronic worry", icon: Activity, tint: "#EDE9FE", fg: "#7C3AED" },
  { key: "general", label: "Just need to talk", sub: "Not sure — general guidance", icon: MessageCircle, tint: "#FFF3D6", fg: "#F59E0B" },
];

export default function MatchPage() {
  const nav = useNavigate();
  const [topic, setTopic] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<string | null>(null);
  const [matching, setMatching] = useState(false);
  const [matched, setMatched] = useState(false);

  // deterministic best match: online + highest trust, topic seeds the pick
  const pick =
    ASTROLOGERS.filter((a) => a.online).sort((a, b) => b.trust - a.trust)[
      (topic?.length ?? 0) % 2
    ] ?? ASTROLOGERS[0];

  useEffect(() => {
    if (matching) {
      const t = setTimeout(() => {
        setMatching(false);
        setMatched(true);
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [matching]);

  return (
    <div className="px-4 pt-3 pb-8">
      <button
        onClick={() => (matched ? setMatched(false) : nav(-1))}
        className="mb-2 flex items-center gap-1 text-sm text-text-muted"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <AnimatePresence mode="wait">
        {!matching && !matched && (
          <motion.div key="intake" exit={{ opacity: 0, y: -12 }}>
            <h1 className="serif text-2xl text-text-primary">
              What's on your mind?
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              We match you with someone who actually specialises in it — and
              show you their real accuracy record.
            </p>

            <div className="mt-4 space-y-2">
              {TOPICS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTopic(t.key)}
                  className={`cosmic-card flex w-full items-center gap-3 p-3.5 text-left transition ${
                    topic === t.key ? "ring-2 ring-gold" : ""
                  }`}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: t.tint, color: t.fg }}
                  >
                    <t.icon size={19} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-text-primary">
                      {t.label}
                    </span>
                    <span className="block text-[11px] text-text-muted">{t.sub}</span>
                  </span>
                  {topic === t.key && (
                    <BadgeCheck size={18} className="text-gold" />
                  )}
                </button>
              ))}
            </div>

            <h3 className="mt-5 text-sm font-semibold text-text-primary">How soon?</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => setUrgency("now")}
                className={`cosmic-card flex flex-col items-start gap-1 p-3.5 text-left ${
                  urgency === "now" ? "ring-2 ring-gold" : ""
                }`}
              >
                <Zap size={17} className="text-gold" />
                <span className="text-sm font-semibold text-text-primary">Now</span>
                <span className="text-[10px] text-text-muted">whoever is free</span>
              </button>
              <button
                onClick={() => setUrgency("wait")}
                className={`cosmic-card flex flex-col items-start gap-1 p-3.5 text-left ${
                  urgency === "wait" ? "ring-2 ring-gold" : ""
                }`}
              >
                <Clock size={17} className="text-cosmic" />
                <span className="text-sm font-semibold text-text-primary">Can wait</span>
                <span className="text-[10px] text-text-muted">best specialist</span>
              </button>
            </div>

            <button
              disabled={!topic || !urgency}
              onClick={() => setMatching(true)}
              className="btn-gold mt-6 w-full rounded-full disabled:opacity-40"
            >
              Find my astrologer
            </button>
            <button
              onClick={() => nav("/consult")}
              className="mt-3 w-full text-center text-xs font-semibold text-gold"
            >
              Or browse everyone →
            </button>
          </motion.div>
        )}

        {matching && (
          <motion.div
            key="matching"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center pt-24 text-center"
          >
            <Orb size={84} />
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="serif mt-6 text-xl text-text-primary"
            >
              Reading your chart against 15,000 specialists…
            </motion.p>
            <p className="mt-1 text-xs text-text-muted">
              matching your {topic} question to real accuracy records
            </p>
          </motion.div>
        )}

        {matched && (
          <motion.div
            key="matched"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="serif text-2xl text-text-primary">We found someone ✦</h1>
            <p className="mt-1 text-sm text-text-muted">
              Matched for {TOPICS.find((t) => t.key === topic)?.label.toLowerCase()} —
              online right now.
            </p>

            <div className="aura-border mt-4 rounded-card bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={avatarUrl(pick.id)}
                    className="h-16 w-16 rounded-full bg-bg-elevated"
                    alt={pick.name}
                  />
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-success" />
                </div>
                <div>
                  <p className="text-base font-bold text-text-primary">{pick.name}</p>
                  <p className="text-[11px] text-text-muted">
                    {pick.systems.join(" · ")} · {pick.languages}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-success">
                    ● Online · ~1 min wait
                  </p>
                </div>
              </div>

              {/* honest stats — our differentiator */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Stat v={`${pick.accuracy}%`} k="predictions accurate" />
                <Stat v={`${(pick.sessions / 1000).toFixed(0)}k+`} k="sessions" />
                <Stat v={`${pick.repeat}%`} k="come back" />
              </div>
              <p className="mt-2 text-center text-[10px] text-text-muted">
                Accuracy = predictions users marked "came true" in our public
                tracker · backed by 30-day warranty
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => nav(`/session/${pick.id}`)}
                  className="btn-gold flex flex-1 items-center justify-center gap-1.5 rounded-btn text-sm"
                >
                  <MessageCircle size={15} /> Start FREE chat
                </button>
                <button
                  onClick={() => nav(`/call/${pick.id}?type=audio`)}
                  className="btn-outline flex items-center justify-center gap-1.5 rounded-btn px-4 text-sm"
                >
                  <Phone size={15} />
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setMatched(false);
                setMatching(true);
              }}
              className="mt-4 w-full text-center text-xs font-semibold text-text-muted"
            >
              Not feeling it? Match me again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ v, k }: { v: string; k: string }) {
  return (
    <div className="rounded-xl bg-bg-elevated py-2.5">
      <div className="mono text-lg font-bold text-gold">{v}</div>
      <div className="text-[9px] leading-tight text-text-muted">{k}</div>
    </div>
  );
}
