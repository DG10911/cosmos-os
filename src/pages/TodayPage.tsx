import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  HeartHandshake,
  Hash,
  CalendarDays,
  Star,
  X,
  BadgeCheck,
  ChevronRight,
  Sun,
  Gauge,
  PartyPopper,
  Puzzle,
} from "lucide-react";
import { auraScore } from "../data/planets";
import { TODAY, ASTROLOGERS, avatarUrl } from "../data/seed";
import { getUser } from "../data/user";
import { useApp } from "../state/AppState";
import { useToast } from "../components/Toast";
import { Confetti } from "../components/Confetti";
import { ChartWheel } from "../components/ChartWheel";
import { CheckButton } from "../components/CheckButton";
import { DailyReward } from "../components/DailyReward";
import { Orb } from "./CosmosAIPage";

/* Free-tools funnel (AstroTalk's #1 acquisition loop) */
const TOOLS = [
  { key: "graha", label: "Daily\nGraha", icon: Puzzle, bg: "#F3E8FF", fg: "#9333EA" },
  { key: "kundli", label: "Free\nKundli", icon: Sparkles, bg: "#FFE7D6", fg: "#FF6B2C" },
  { key: "match", label: "Kundli\nMatch", icon: HeartHandshake, bg: "#FFE4EC", fg: "#F43F6E" },
  { key: "love", label: "Love\nCalc", icon: Heart, bg: "#EDE9FE", fg: "#7C3AED" },
  { key: "num", label: "Numero-\nlogy", icon: Hash, bg: "#DCFCE7", fg: "#16A34A" },
  { key: "panch", label: "Today\nPanchang", icon: CalendarDays, bg: "#E0F2FE", fg: "#0EA5E9" },
  { key: "horo", label: "Daily\nHoroscope", icon: Star, bg: "#FFF3D6", fg: "#F59E0B" },
];

export default function TodayPage() {
  const nav = useNavigate();
  const app = useApp();
  const toast = useToast();
  const [confetti, setConfetti] = useState(0);
  const [panchangOpen, setPanchangOpen] = useState(false);
  const [kundli, setKundli] = useState(false);
  const suggested = ASTROLOGERS[0];

  function onRitualDone() {
    if (app.ritualDone) return;
    app.completeRitual();
    setConfetti((c) => c + 1);
    toast("A small offering. A big shift · +10 Karma");
  }

  function tapTool(k: string) {
    if (k === "graha") nav("/nakshatra");
    else if (k === "kundli") setKundli(true);
    else if (k === "panch") setPanchangOpen(true);
    else if (k === "match" || k === "love") nav("/circle/compat");
    else if (k === "num") {
      // life-path number from the user's birth date
      const digits = (getUser()?.birthDate ?? "1999-03-14").replace(/\D/g, "");
      let n = digits.split("").reduce((a, d) => a + Number(d), 0);
      while (n > 9 && n !== 11 && n !== 22) {
        n = String(n).split("").reduce((a, d) => a + Number(d), 0);
      }
      toast(`Your Life Path number is ${n} — the seeker's path ✦`);
    } else if (k === "horo")
      toast("Moon favours you today — best window 2:00–3:30 PM ✦");
  }

  return (
    <div className="px-4 pt-3">
      <Confetti fire={confetti} />

      {/* Festive hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-card p-5 text-white"
        style={{
          background:
            "radial-gradient(120% 90% at 85% -10%, rgba(255,255,255,0.22), transparent 55%), linear-gradient(135deg,#FF6B2C 0%,#FF8A1F 55%,#FFB423 100%)",
          minHeight: 168,
          boxShadow: "0 14px 34px rgba(255,107,44,0.35)",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
            ☀ Auspicious day · {TODAY.dateLabel}
          </span>
          <button
            onClick={() => nav("/circle")}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur active:scale-90"
          >
            <Share2 size={15} />
          </button>
        </div>
        <h2 className="serif mt-4 text-[24px] leading-snug">{TODAY.heroTitle}</h2>
        <p className="mt-1 text-[13px] text-white/90">{TODAY.heroSub}</p>
        <button
          onClick={() => nav("/brief")}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-[#FF6B2C] active:scale-95"
        >
          <Sun size={14} /> Read your Morning Brief →
        </button>
        <Sparkles className="absolute -bottom-3 -right-3 text-white/15" size={90} />
      </motion.div>

      {/* Muhurat Window — BeReal-style daily scarcity */}
      <MuhuratWindow />

      {/* Free tools funnel */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="serif text-[15px] text-text-primary">Free for you</span>
          <span className="text-[11px] font-medium text-text-muted">no charges ✦</span>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {TOOLS.map((t) => (
            <button
              key={t.key}
              onClick={() => tapTool(t.key)}
              className="flex w-[68px] shrink-0 flex-col items-center gap-1.5 active:scale-95"
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: t.bg, color: t.fg }}
              >
                <t.icon size={24} strokeWidth={2} />
              </span>
              <span className="whitespace-pre-line text-center text-[10px] font-medium leading-tight text-text-muted">
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Aura + Festival */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => nav("/aura")}
          className="tint-tile flex flex-col justify-between p-4 text-left"
          style={{ background: "linear-gradient(150deg,#7C3AED,#E11D74)" }}
        >
          <div className="flex items-center justify-between text-white">
            <Gauge size={18} />
            <span className="mono text-xl font-bold">{auraScore(app.streak, app.karma)}</span>
          </div>
          <span className="mt-2 text-[12px] font-bold text-white">Your Aura Score →</span>
          <span className="text-[10px] text-white/80">level up your 9 planets</span>
        </button>
        <button
          onClick={() => nav("/festival")}
          className="tint-tile flex flex-col justify-between p-4 text-left"
          style={{ background: "linear-gradient(150deg,#FF6B2C,#FFB423)" }}
        >
          <PartyPopper size={18} className="text-white" />
          <span className="mt-2 text-[12px] font-bold text-white">Festival cards →</span>
          <span className="text-[10px] text-white/85">bless a friend, get shared</span>
        </button>
      </div>

      {/* Daily reward */}
      <div className="mt-4">
        <DailyReward />
      </div>

      {/* Cosmic Weather — colored tiles */}
      <div className="mb-2 mt-5 px-1">
        <span className="serif text-[15px] text-text-primary">Your Cosmic Weather</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Tile tint="#FFF3D6" fg="#F59E0B" icon={<Sparkles size={18} />} label="Mood" value={TODAY.mood} />
        <Tile tint="#E0F2FE" fg="#0EA5E9" icon={<Clock size={18} />} label="Lucky Hour" value={TODAY.luckyHour} mono />
        <Tile tint="#EDE9FE" fg="#7C3AED" icon={<Laptop size={18} />} label="Best Work" value={TODAY.bestWork} mono />
        <Tile tint="#DCFCE7" fg="#16A34A" icon={<TrendingUp size={18} />} label="Money Energy" value={`${TODAY.moneyEnergy} ↑`} />
        <Tile tint="#FFE4EC" fg="#F43F6E" icon={<Heart size={18} />} label="Love Energy" value={`${TODAY.loveEnergy} ↑`} />
        {/* Ritual tile */}
        <div className="tint-tile flex flex-col justify-between p-4" style={{ background: "#FFE7D6" }}>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white" style={{ color: "#FF6B2C" }}>
              <Flame size={17} />
            </span>
            <span className="text-[11px] font-medium text-text-muted">Today's Ritual</span>
          </div>
          <p className="mt-1.5 text-[13px] font-semibold leading-snug text-text-primary">
            {TODAY.ritual}
          </p>
          <CheckButton
            done={app.ritualDone}
            label="Mark done · +10"
            doneLabel="Done · +10 Karma"
            onClick={onRitualDone}
            className="mt-2 w-full"
          />
        </div>
      </div>

      {/* Mission of the day */}
      <div className="cosmic-card mt-4 p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cosmic/12 text-cosmic">
            <Target size={17} />
          </span>
          <span className="text-sm font-semibold text-text-primary">Mission of the Day</span>
        </div>
        <p className="mt-2 text-[15px] text-text-primary">Meditate 7 minutes today</p>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(app.missionProgress / 7) * 100}%`,
              background: "linear-gradient(90deg,#FF6B2C,#FFB423)",
            }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            {app.missionProgress} of 7 days · +10 Karma/day
          </span>
          <button onClick={() => nav("/missions")} className="text-xs font-bold text-gold">
            View →
          </button>
        </div>
      </div>

      {/* Suggested astrologer — trust badges */}
      <div className="mb-2 mt-5 flex items-center justify-between px-1">
        <span className="serif text-[15px] text-text-primary">Talk to an expert</span>
        <button onClick={() => nav("/consult")} className="text-[11px] font-bold text-gold">
          See all →
        </button>
      </div>
      <div className="cosmic-card flex items-center gap-3 p-4">
        <div className="relative">
          <img src={avatarUrl(suggested.id)} alt={suggested.name} className="h-14 w-14 rounded-full bg-bg-elevated" />
          <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-success" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-text-primary">{suggested.name}</span>
            <BadgeCheck size={15} className="text-success" />
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 rounded-full bg-amber/20 px-1.5 py-0.5 text-[10px] font-bold text-[#B45309]">
              <Star size={9} className="fill-current" /> {(suggested.accuracy / 20).toFixed(1)}
            </span>
            <span className="text-[11px] text-text-muted">
              {(suggested.sessions / 1000).toFixed(0)}k+ consults
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="rounded-full bg-success/12 px-2 py-0.5 text-[9px] font-bold text-success">
            1st chat FREE
          </span>
          <button
            onClick={() => nav(`/session/${suggested.id}`)}
            className="rounded-btn bg-gold px-3 py-1.5 text-xs font-bold text-white active:scale-95"
          >
            Chat ₹{suggested.price}/min
          </button>
        </div>
      </div>

      {/* Free Kundli / My Chart */}
      <button
        onClick={() => setKundli(true)}
        className="cosmic-card mt-4 flex w-full items-center gap-3 overflow-hidden p-4 text-left active:scale-[0.99]"
      >
        <div className="-my-2 shrink-0">
          <ChartWheel size={92} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-text-primary">Your Free Kundli</p>
          <p className="mt-0.5 text-xs text-text-muted">Cancer Asc · Rohini · Rahu Mahadasha</p>
          <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-gold">
            View full chart <ChevronRight size={13} />
          </span>
        </div>
      </button>

      {/* Panchang strip */}
      <button
        onClick={() => setPanchangOpen((o) => !o)}
        className="cosmic-card mt-4 flex w-full items-center justify-between p-4"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <CalendarDays size={16} className="text-cosmic" /> Today's Panchang
        </span>
        <ChevronDown
          size={18}
          className={`text-text-muted transition-transform ${panchangOpen ? "rotate-180" : ""}`}
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

      {/* Floating Cosmos Twin — living orb */}
      <div className="pointer-events-none fixed bottom-[92px] left-1/2 z-30 flex w-full max-w-[420px] -translate-x-1/2 justify-end px-4">
        <button
          onClick={() => nav("/twin")}
          className="glass pointer-events-auto relative flex items-center gap-2 rounded-full border border-cosmic/30 py-2 pl-2 pr-3.5 shadow-[0_8px_24px_rgba(124,58,237,0.28)] transition-transform duration-200 active:scale-95"
        >
          {/* pulsing halo */}
          <span
            className="pointer-events-none absolute -left-1 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(139,124,252,0.45), transparent 70%)",
              animation: "orb-halo 2.8s ease-in-out infinite",
            }}
          />
          <Orb size={30} />
          <span className="relative text-xs font-bold text-text-primary">Ask Twin</span>
          <style>{`@keyframes orb-halo{0%,100%{transform:translateY(-50%) scale(1);opacity:.7}50%{transform:translateY(-50%) scale(1.5);opacity:.15}}`}</style>
        </button>
      </div>

      {/* Free Kundli modal */}
      <AnimatePresence>
        {kundli && <KundliSheet onClose={() => setKundli(false)} />}
      </AnimatePresence>
    </div>
  );
}

function Tile({
  tint,
  fg,
  icon,
  label,
  value,
  mono,
}: {
  tint: string;
  fg: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="tint-tile flex flex-col gap-2 p-4" style={{ background: tint }}>
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white" style={{ color: fg }}>
          {icon}
        </span>
        <span className="text-[11px] font-medium text-text-muted">{label}</span>
      </div>
      <span className={`text-[15px] font-bold text-text-primary ${mono ? "mono !text-sm" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function Row({ k, v, danger }: { k: string; v: string; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-muted">{k}</span>
      <span className={danger ? "font-semibold text-danger" : "font-semibold text-text-primary"}>{v}</span>
    </div>
  );
}

/** Astrologer trust badge — used across Consult / Astrologer / Session screens. */
export function TrustSigil({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full bg-success/12 px-1.5 py-0.5 text-[10px] font-bold text-success">
      <BadgeCheck size={11} /> {score}
    </span>
  );
}

function KundliSheet({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-6"
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[390px] rounded-3xl bg-white p-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="serif text-xl text-text-primary">Your Free Kundli</h3>
          <button onClick={onClose} className="text-text-muted">
            <X size={20} />
          </button>
        </div>
        <div className="mt-2 flex justify-center">
          <ChartWheel size={200} />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          {[
            ["Ascendant", "Cancer"],
            ["Moon Sign", "Cancer"],
            ["Nakshatra", "Rohini"],
            ["Current Dasha", "Rahu"],
            ["Mangal Dosha", "No"],
            ["Sade Sati", "Active"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between rounded-xl bg-bg px-3 py-2">
              <span className="text-text-muted">{k}</span>
              <span className="font-semibold text-text-primary">{v}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="btn-gold mt-4 w-full rounded-btn">
          Get detailed reading
        </button>
      </motion.div>
    </motion.div>
  );
}

/** BeReal-style daily scarcity: a personal auspicious window, once a day. */
function MuhuratWindow() {
  const app = useApp();
  const toast = useToast();
  const [claimed, setClaimed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(11 * 60 - 137);

  useEffect(() => {
    const t = setInterval(
      () => setSecondsLeft((s) => Math.max(s - 1, 0)),
      1000
    );
    return () => clearInterval(t);
  }, []);

  const mm = Math.floor(secondsLeft / 60);
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="aura-border mt-3 flex items-center gap-3 rounded-card p-4"
      style={{ background: "linear-gradient(140deg,#F3E8FF,#FCE7F3)" }}
    >
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cosmic/15 text-xl">
        <span className="absolute inset-0 animate-flame-flicker rounded-full bg-cosmic/10" />
        🪔
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-text-primary">
          Your muhurat is OPEN
        </p>
        <p className="text-[11px] text-text-muted">
          {claimed
            ? "Blessing claimed · next window tomorrow"
            : "A rare auspicious window, only for your chart"}
        </p>
      </div>
      {claimed ? (
        <span className="rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-bold text-success">
          Claimed ✦
        </span>
      ) : (
        <button
          onClick={() => {
            setClaimed(true);
            app.addKarma(20, "Muhurat claimed");
            toast("Claimed in your muhurat · 2× karma ✦");
          }}
          className="btn-gold shrink-0 rounded-full px-3.5 py-2 text-xs"
        >
          Claim · {mm}:{ss}
        </button>
      )}
    </motion.div>
  );
}
