import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Link2, Bell, Check } from "lucide-react";
import { Spark, Flame } from "../components/Glyphs";
import { avatarUrl } from "../data/seed";
import { useToast } from "../components/Toast";

/** Bonded friends — two-player streak mechanic (Snapchat/Duolingo-style). */
const BONDS = [
  { id: 21, name: "Riya", streak: 34, youDone: true, themDone: false, boost: "Venus-aligned · 2× karma" },
  { id: 34, name: "Aarav", streak: 12, youDone: true, themDone: true, boost: "Moon brothers · +50%" },
  { id: 47, name: "Maa", streak: 87, youDone: false, themDone: true, boost: "Family bond · blessings" },
];

/** Friend constellation — ambient presence (Zenly-style, but cosmic). */
const FRIENDS = [
  { name: "Riya", x: 22, y: 30, aura: 0.9 },
  { name: "Aarav", x: 68, y: 18, aura: 0.55 },
  { name: "Maa", x: 45, y: 55, aura: 0.75 },
  { name: "Kabir", x: 80, y: 62, aura: 0.3 },
  { name: "Sana", x: 12, y: 70, aura: 0.6 },
];

export default function CirclePage() {
  const nav = useNavigate();
  const toast = useToast();
  const [nudged, setNudged] = useState<number[]>([]);

  return (
    <div className="px-4 pt-3 pb-6">
      <h1 className="serif text-3xl text-text-primary">Circle</h1>
      <p className="mt-1 text-sm text-text-muted">
        Your people, written in the same sky
      </p>

      {/* ── Bond Streaks ── */}
      <div className="mt-4 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-text-primary">Bond Streaks</h3>
        <button
          onClick={() => toast("Invite copied — bond a friend, both earn 2×")}
          className="text-xs font-semibold text-gold"
        >
          + New bond
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {BONDS.map((b, i) => {
          const alive = b.youDone && b.themDone;
          const atRisk = !b.themDone || !b.youDone;
          return (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="cosmic-card flex items-center gap-3 p-3.5"
            >
              <div className="relative">
                <img
                  src={avatarUrl(b.id)}
                  className="h-12 w-12 rounded-full bg-bg-elevated"
                  alt={b.name}
                />
                <span className="absolute -bottom-1 -right-1 flex items-center gap-0.5 rounded-full bg-white px-1.5 py-0.5 shadow">
                  <Flame size={12} className={alive ? "animate-flame-flicker" : "opacity-40 grayscale"} />
                  <span className="mono text-[11px] font-bold text-gold">{b.streak}</span>
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">{b.name}</p>
                <p className="truncate text-[11px] text-cosmic">{b.boost}</p>
                <div className="mt-1 flex items-center gap-2 text-[10px]">
                  <Tick done={b.youDone} label="You" />
                  <Tick done={b.themDone} label={b.name} />
                </div>
              </div>
              {atRisk && !b.themDone ? (
                <button
                  disabled={nudged.includes(b.id)}
                  onClick={() => {
                    setNudged((n) => [...n, b.id]);
                    toast(`${b.name} felt your energy — nudge sent ✦`);
                  }}
                  className="flex items-center gap-1 rounded-btn bg-gold px-2.5 py-2 text-[11px] font-bold text-white disabled:opacity-40"
                >
                  <Bell size={12} /> {nudged.includes(b.id) ? "Sent" : "Nudge"}
                </button>
              ) : !b.youDone ? (
                <button
                  onClick={() => nav("/brief")}
                  className="rounded-btn border border-gold/30 px-2.5 py-2 text-[11px] font-bold text-gold"
                >
                  Do yours
                </button>
              ) : (
                <span className="rounded-full bg-success/12 px-2 py-1 text-[10px] font-bold text-success">
                  Safe today
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Friend constellation ── */}
      <h3 className="mt-6 px-1 text-sm font-semibold text-text-primary">
        Your constellation tonight
      </h3>
      <div
        className="relative mt-2 h-44 overflow-hidden rounded-card"
        style={{
          background: "linear-gradient(160deg,#241243 0%,#3B0764 60%,#4C1D95 100%)",
        }}
      >
        {/* connecting lines */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <g stroke="rgba(255,255,255,0.18)" strokeWidth="0.4">
            <line x1="22" y1="30" x2="45" y2="55" />
            <line x1="45" y1="55" x2="68" y2="18" />
            <line x1="45" y1="55" x2="80" y2="62" />
            <line x1="12" y1="70" x2="45" y2="55" />
          </g>
        </svg>
        {FRIENDS.map((f) => (
          <button
            key={f.name}
            onClick={() =>
              toast(
                f.aura < 0.5
                  ? `You sent ${f.name} strength ✦`
                  : `${f.name}'s stars are bright today`
              )
            }
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
          >
            <span
              className="h-3 w-3 rounded-full"
              style={{
                background: f.aura < 0.5 ? "#8C7A68" : "#FFC53D",
                boxShadow: `0 0 ${8 + f.aura * 14}px ${f.aura < 0.5 ? "rgba(140,122,104,0.5)" : "rgba(255,197,61,0.9)"}`,
                opacity: 0.4 + f.aura * 0.6,
              }}
            />
            <span className="mt-1 text-[9px] font-medium text-white/80">{f.name}</span>
          </button>
        ))}
        <span className="absolute bottom-2 right-3 text-[9px] text-white/50">
          dim star = rough day · tap to send strength
        </span>
      </div>

      {/* ── Share the cosmos ── */}
      <h3 className="mt-6 px-1 text-sm font-semibold text-text-primary">
        Share the cosmos
      </h3>

      {/* ── Ask My Stars (NGL-style) ── */}
      <button
        onClick={() => toast("Your link is copied — post it on your Story ✦")}
        className="relative mt-4 w-full overflow-hidden rounded-card p-5 text-left text-white"
        style={{
          background: "linear-gradient(140deg,#7C3AED 0%,#E11D74 70%,#FF6B2C 100%)",
          boxShadow: "0 14px 36px rgba(124,58,237,0.32)",
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
          <Link2 size={22} className="text-white" />
        </div>
        <h3 className="serif mt-3 text-2xl">Ask My Stars</h3>
        <p className="mt-1 text-sm text-white/90">
          Friends ask anything, anonymously. Your kundli answers.
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-cosmic">
          <Spark size={14} /> Copy my link
        </span>
        <p className="mt-3 text-xs text-white/85">💌 3 unanswered questions waiting</p>
      </button>

      {/* ── Compatibility (viral atom) ── */}
      <button
        onClick={() => nav("/circle/compat")}
        className="relative mt-3 w-full overflow-hidden rounded-card p-5 text-left text-white"
        style={{
          background: "linear-gradient(140deg,#FF6B2C 0%,#E11D74 60%,#FF9A1F 100%)",
          boxShadow: "0 14px 36px rgba(225,29,116,0.32)",
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
          <Heart size={24} className="fill-white text-white" />
        </div>
        <h3 className="serif mt-3 text-2xl">Check with a friend</h3>
        <p className="mt-1 text-sm text-white/90">
          Beautiful, shareable compatibility cards
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#E11D74]">
          <Spark size={14} /> Create Card
        </span>
        <p className="mt-3 text-xs text-white/85">🔥 12,483 cards created today</p>
        <Heart className="absolute -bottom-4 -right-3 fill-white/10 text-white/10" size={96} />
      </button>
    </div>
  );
}

function Tick({ done, label }: { done: boolean; label: string }) {
  return (
    <span
      className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold ${
        done ? "bg-success/12 text-success" : "bg-black/[0.05] text-text-muted"
      }`}
    >
      {done ? <Check size={9} /> : <span className="h-1.5 w-1.5 rounded-full bg-current opacity-50" />}
      {label}
    </span>
  );
}
