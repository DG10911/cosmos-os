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
} from "lucide-react";
import { avatarUrl } from "../data/seed";
import { useApp } from "../state/AppState";
import { clearUser } from "../data/user";
import { store } from "../lib/utils";

export default function MePage() {
  const nav = useNavigate();
  const app = useApp();

  const stats = [
    { icon: <Flame size={18} className="text-gold" />, label: "Streak", value: `${app.streak}d` },
    { icon: <Coins size={18} className="text-gold" />, label: "Karma", value: app.karma.toLocaleString("en-IN") },
    { icon: <Target size={18} className="text-cosmic" />, label: "Predictions", value: "12" },
  ];

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Passport header */}
      <div className="cosmic-card flex flex-col items-center p-5 text-center">
        <img
          src={avatarUrl(99)}
          alt="Anya"
          className="h-20 w-20 rounded-full border-2 border-gold/50 bg-bg-elevated"
        />
        <h1 className="serif mt-3 text-2xl text-white">Anya Sharma</h1>
        <p className="text-xs text-text-muted">
          Cancer · Rohini · Rahu Mahadasha
        </p>
        <div className="mt-4 grid w-full grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl bg-bg/40 py-3">
              <div className="flex justify-center">{s.icon}</div>
              <div className="mono mt-1 text-base font-bold text-white">
                {s.value}
              </div>
              <div className="text-[10px] text-text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav rows */}
      <div className="mt-4 space-y-2">
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
        <ul className="mt-3 space-y-1.5 text-sm text-white/85">
          <li>✨ Unlimited AI Twin conversations</li>
          <li>🔮 Full Destiny Timeline & Prediction Tracker</li>
          <li>🛡️ Streak Insurance + 10% off consultations</li>
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
