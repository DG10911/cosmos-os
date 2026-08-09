import { PageHeader } from "../components/PageHeader";
import { motion } from "framer-motion";
import { Share2, TrendingUp } from "lucide-react";
import { NAVAGRAHA, auraScore } from "../data/planets";
import { useApp } from "../state/AppState";
import { CountUp } from "../components/CountUp";
import { useToast } from "../components/Toast";

export default function AuraPage() {
  const app = useApp();
  const toast = useToast();
  const score = auraScore(app.streak, app.karma);
  const pct = Math.min(1, score / 999);

  // radial ring geometry
  const R = 62;
  const C = 2 * Math.PI * R;

  return (
    <div className="px-4 pt-3 pb-6">
      <PageHeader title="Aura & Navagraha" sub="Your energy across the 9 planets" />

      {/* Aura Score hero */}
      <div
        className="relative overflow-hidden rounded-card p-6 text-center text-white"
        style={{
          background: "linear-gradient(150deg,#7C3AED 0%,#E11D74 55%,#FF6B2C 100%)",
          boxShadow: "0 16px 40px rgba(124,58,237,0.3)",
        }}
      >
        <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white/85">
          Your Aura Score
        </p>
        <div className="relative mx-auto mt-3 flex h-40 w-40 items-center justify-center">
          <svg width="160" height="160" className="absolute -rotate-90">
            <circle cx="80" cy="80" r={R} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
            <motion.circle
              cx="80" cy="80" r={R} fill="none" stroke="#FFC53D" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C * (1 - pct) }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </svg>
          <div className="flex flex-col items-center">
            <CountUp value={score} className="serif text-5xl leading-none" />
            <span className="text-[11px] text-white/70">/ 999</span>
          </div>
        </div>
        <p className="mt-2 flex items-center justify-center gap-1 text-sm text-white/90">
          <TrendingUp size={14} /> Rising · Top 12% this week
        </p>
        <button
          onClick={() => toast("Aura card saved · share your glow ✦")}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#7C3AED] active:scale-95"
        >
          <Share2 size={14} /> Share my Aura
        </button>
      </div>

      {/* Navagraha levels */}
      <div className="mb-2 mt-6 flex items-center justify-between px-1">
        <span className="serif text-lg text-text-primary">Your Navagraha</span>
        <span className="text-[11px] text-text-muted">level up your 9 planets</span>
      </div>
      <div className="space-y-2.5">
        {NAVAGRAHA.map((g, i) => (
          <motion.div
            key={g.key}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="cosmic-card flex items-center gap-3 p-3"
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white"
              style={{ background: g.color, boxShadow: `0 6px 16px ${g.color}55` }}
            >
              {g.glyph}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-text-primary">{g.name}</span>
                <span className="mono text-[11px] font-bold" style={{ color: g.color }}>
                  Lv {g.level}
                </span>
              </div>
              <p className="text-[11px] text-text-muted">{g.domain}</p>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-black/[0.06]">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${g.xp}%`, background: g.color }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="cosmic-card mt-4 p-4 text-center text-xs text-text-muted">
        Every ritual, mission & good habit feeds a planet. Strengthen all nine to raise your Aura.
      </div>
    </div>
  );
}
