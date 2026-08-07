import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Share2,
  Clock,
  Laptop,
  TrendingUp,
  Heart,
  Flame,
  Target,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { TODAY, ASTROLOGERS, avatarUrl } from "../data/seed";
import { useApp } from "../state/AppState";
import { useToast } from "../components/Toast";
import { Confetti } from "../components/Confetti";

export default function TodayPage() {
  const nav = useNavigate();
  const app = useApp();
  const toast = useToast();
  const [confetti, setConfetti] = useState(0);
  const [panchangOpen, setPanchangOpen] = useState(false);
  const suggested = ASTROLOGERS[0];

  function onRitualDone() {
    if (app.ritualDone) return;
    app.completeRitual();
    setConfetti((c) => c + 1);
    toast("Ritual complete · +10 Karma ✨");
  }

  return (
    <div className="px-4 pt-3">
      <Confetti fire={confetti} />

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-card border border-cosmic/30 p-5"
        style={{
          background:
            "linear-gradient(145deg, #1a0b2e 0%, #0B0B14 70%)",
          minHeight: 210,
          boxShadow: "0 0 40px rgba(139,124,252,0.15)",
        }}
      >
        <Sparkles
          className="absolute right-4 top-4 text-gold/60"
          size={20}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">{TODAY.dateLabel}</span>
        </div>
        <div className="mt-10 flex min-h-[110px] flex-col justify-center">
          <h2 className="serif text-[27px] leading-snug text-white">
            {TODAY.heroTitle}
          </h2>
          <p className="mt-2 text-[15px] text-text-muted">{TODAY.heroSub}</p>
        </div>
        <button
          onClick={() => {
            nav("/circle");
          }}
          className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 hover:text-gold"
        >
          <Share2 size={16} />
        </button>
      </motion.div>

      {/* Weather grid */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Tile
          icon={<Sparkles size={18} className="text-gold" />}
          label="Mood Reading"
          value={TODAY.mood}
        />
        <Tile
          icon={<Clock size={18} className="text-cosmic" />}
          label="Lucky Hour"
          value={TODAY.luckyHour}
          mono
        />
        <Tile
          icon={<Laptop size={18} className="text-cosmic" />}
          label="Best Work"
          value={TODAY.bestWork}
          mono
        />
        <Tile
          icon={<TrendingUp size={18} className="text-success" />}
          label="Money Energy"
          value={`${TODAY.moneyEnergy} ↑`}
        />
        <Tile
          icon={<Heart size={18} className="text-danger" />}
          label="Love Energy"
          value={`${TODAY.loveEnergy} ↑`}
        />
        {/* Ritual tile */}
        <div className="cosmic-card flex flex-col justify-between p-4">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-gold" />
            <span className="text-xs text-text-muted">Today's Ritual</span>
          </div>
          <p className="mt-1 text-[13px] font-medium leading-snug text-white">
            {TODAY.ritual}
          </p>
          <button
            onClick={onRitualDone}
            disabled={app.ritualDone}
            className={`mt-2 rounded-btn px-2 py-1.5 text-xs font-semibold transition ${
              app.ritualDone
                ? "bg-success/15 text-success"
                : "bg-gold text-bg"
            }`}
          >
            {app.ritualDone ? "Done ✓ +10 Karma" : "Done ✓ +10 Karma"}
          </button>
        </div>
      </div>

      {/* Mission of the day */}
      <div className="cosmic-card mt-4 p-4">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-cosmic" />
          <span className="text-sm font-medium text-white">
            Mission of the Day
          </span>
        </div>
        <p className="mt-2 text-[15px] text-white">Meditate 7 minutes today</p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gold transition-all duration-500"
            style={{ width: `${(app.missionProgress / 7) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            {app.missionProgress} of 7 days · +10 Karma/day
          </span>
          <button
            onClick={() => nav("/missions")}
            className="text-xs font-semibold text-gold"
          >
            View →
          </button>
        </div>
      </div>

      {/* Suggested astrologer */}
      <div className="cosmic-card mt-4 flex items-center gap-3 p-4">
        <img
          src={avatarUrl(suggested.id)}
          alt={suggested.name}
          className="h-14 w-14 rounded-full bg-bg-elevated"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">
              {suggested.name}
            </span>
            <TrustSigil score={suggested.trust} />
          </div>
          <p className="text-xs text-text-muted">Best for career questions</p>
        </div>
        <button
          onClick={() => nav(`/session/${suggested.id}`)}
          className="rounded-btn bg-gold px-3 py-2 text-xs font-semibold text-bg"
        >
          Chat ₹{suggested.price}/min
        </button>
      </div>

      {/* Panchang strip */}
      <button
        onClick={() => setPanchangOpen((o) => !o)}
        className="cosmic-card mt-4 flex w-full items-center justify-between p-4"
      >
        <span className="text-sm text-white">Today's Panchang</span>
        <ChevronDown
          size={18}
          className={`text-text-muted transition-transform ${
            panchangOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {panchangOpen && (
        <div className="cosmic-card mt-2 space-y-2 p-4 text-sm">
          <Row k="Tithi" v={TODAY.panchang.tithi} />
          <Row k="Nakshatra" v={TODAY.panchang.nakshatra} />
          <Row k="Rahu Kaal" v={TODAY.panchang.rahuKaal} danger />
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}

function Tile({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="cosmic-card flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-text-muted">{label}</span>
      </div>
      <span
        className={`text-[15px] font-semibold text-white ${mono ? "mono !text-sm" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function Row({ k, v, danger }: { k: string; v: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-muted">{k}</span>
      <span className={danger ? "text-danger" : "text-white"}>{v}</span>
    </div>
  );
}

export function TrustSigil({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-gold/15 px-1.5 py-0.5 text-[10px] font-bold text-gold">
      <Sparkles size={9} /> {score}
    </span>
  );
}
