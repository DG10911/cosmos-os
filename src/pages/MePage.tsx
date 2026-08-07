import { useNavigate } from "react-router-dom";
import {
  CalendarRange,
  Clapperboard,
  Crown,
  Flame,
  Coins,
  Target,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Check,
} from "lucide-react";
import { useApp } from "../state/AppState";
import { clearUser } from "../data/user";
import { store } from "../lib/utils";
import { ChartWheel } from "../components/ChartWheel";
import { CountUp } from "../components/CountUp";
import { Orb } from "./CosmosAIPage";

export default function MePage() {
  const nav = useNavigate();
  const app = useApp();

  const stats: { icon: React.ReactNode; label: string; node: React.ReactNode }[] = [
    {
      icon: <Flame size={18} className="text-gold" />,
      label: "Streak",
      node: <CountUp value={app.streak} format={(n) => `${Math.round(n)}d`} />,
    },
    {
      icon: <Coins size={18} className="text-gold" />,
      label: "Karma",
      node: <CountUp value={app.karma} />,
    },
    {
      icon: <Target size={18} className="text-cosmic" />,
      label: "Predictions",
      node: <CountUp value={12} />,
    },
  ];

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Passport header with live natal chart */}
      <div className="cosmic-card flex flex-col items-center overflow-hidden p-5 text-center">
        <div className="-mb-2 -mt-2">
          <ChartWheel size={200} />
        </div>
        <h1 className="serif mt-1 text-2xl text-white">Anya Sharma</h1>
        <p className="text-xs text-text-muted">
          Cancer · Rohini · Rahu Mahadasha
        </p>
        <div className="mt-4 grid w-full grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-bg/40 py-3">
              <div className="flex justify-center">{s.icon}</div>
              <div className="mono mt-1 text-base font-bold text-white">
                {s.node}
              </div>
              <div className="text-[10px] text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav rows */}
      <div className="mt-4 space-y-2">
        <button
          onClick={() => nav("/twin")}
          className="aura-border flex w-full items-center gap-3 rounded-card p-4 text-left"
          style={{ background: "linear-gradient(150deg,#1e0d38,#12081f)" }}
        >
          <Orb size={40} />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">Cosmos Twin</p>
            <p className="text-xs text-text-muted">
              Your AI companion · knows your whole chart
            </p>
          </div>
          <Sparkles size={16} className="text-cosmic" />
        </button>
        <Row
          icon={<Target size={18} className="text-gold" />}
          title="Prediction Tracker"
          sub="Every prediction, held accountable"
          onClick={() => nav("/predictions")}
        />
        <Row
          icon={<CalendarRange size={18} className="text-cosmic" />}
          title="Destiny Timeline"
          sub="Your past & predicted future"
          onClick={() => nav("/timeline")}
        />
        <Row
          icon={<Clapperboard size={18} className="text-gold" />}
          title="Destiny Replay 2026"
          sub="Your cosmic year, wrapped"
          onClick={() => nav("/replay")}
        />
      </div>

      {/* Cosmos+ upsell */}
      <div
        className="mt-4 rounded-card p-5"
        style={{
          background: "linear-gradient(145deg,#2d1b4e,#1a0b2e)",
          border: "1px solid rgba(244,196,48,0.4)",
        }}
      >
        <div className="flex items-center gap-2">
          <Crown size={20} className="text-gold" />
          <span className="serif text-xl text-white">Cosmos+</span>
        </div>
        <ul className="mt-3 space-y-2 text-sm text-white/85">
          {[
            "Unlimited AI Twin conversations",
            "Full Destiny Timeline & Prediction Tracker",
            "Streak Insurance + 10% off consultations",
          ].map((b) => (
            <li key={b} className="flex items-center gap-2">
              <Check size={15} className="shrink-0 text-gold" />
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-white">
            <span className="text-lg font-bold text-gold">₹199</span>/mo
          </span>
          <button className="btn-gold rounded-btn text-sm">
            Try Free 7 Days
          </button>
        </div>
      </div>

      {/* Reset demo */}
      <button
        onClick={() => {
          clearUser();
          store.remove("cosmos_state");
          nav("/splash");
        }}
        className="mt-6 flex w-full items-center justify-center gap-1.5 text-xs text-text-muted"
      >
        <RotateCcw size={13} /> Reset demo (re-run onboarding)
      </button>
    </div>
  );
}

function Row({
  icon,
  title,
  sub,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="cosmic-card flex w-full items-center gap-3 p-4 text-left"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-text-muted">{sub}</p>
      </div>
      <ChevronRight size={18} className="text-text-muted" />
    </button>
  );
}
