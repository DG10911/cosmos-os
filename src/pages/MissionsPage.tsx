import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useApp } from "../state/AppState";
import { useToast } from "../components/Toast";
import { Confetti } from "../components/Confetti";
import { CountUp } from "../components/CountUp";
import { Flame, KarmaCoin } from "../components/Glyphs";
import { CheckButton, DrawTick } from "../components/CheckButton";

const WEEKLY = [
  { id: "parents", label: "Call your parents", when: "Sunday", karma: 5 },
  { id: "donate", label: "Donate ₹51 to a temple", when: "", karma: 5 },
  { id: "gratitude", label: "Write 3 gratitudes in your journal", when: "", karma: 5 },
  { id: "surya", label: "Do 15-min Surya Namaskar", when: "", karma: 5 },
  { id: "detox", label: "Skip social media for 4 hours", when: "", karma: 5 },
];

const REDEEM = [
  { label: "5 free consultation minutes", cost: 500 },
  { label: "30% off any ritual purchase", cost: 200 },
  { label: "Cosmos+ 1 month free", cost: 2000 },
];

export default function MissionsPage() {
  const app = useApp();
  const nav = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState<"missions" | "karma">("missions");
  const [confetti, setConfetti] = useState(0);

  return (
    <div className="px-4 pt-3 pb-4">
      <Confetti fire={confetti} />

      {/* Streak strip */}
      <div className="cosmic-card flex items-center justify-between p-4">
        <div className="flex items-center gap-2.5">
          <Flame size={30} className="animate-flame-flicker" />
          <div>
            <div className="mono text-2xl font-bold text-gold">
              {app.streak}
              <span className="ml-1 text-sm font-normal text-text-primary">days</span>
            </div>
            <span className="text-[11px] text-text-muted">
              Longest: {app.longestStreak} days
            </span>
          </div>
        </div>
        <button
          onClick={() => nav("/league")}
          className="rounded-full px-3 py-1.5 text-[11px] font-bold text-white active:scale-95"
          style={{ background: "linear-gradient(135deg,#7C3AED,#E11D74)" }}
        >
          🏆 Shukra League
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-2 rounded-full bg-bg-card p-1">
        {(["missions", "karma"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium capitalize transition ${
              tab === t ? "bg-gold text-white" : "text-text-muted"
            }`}
          >
            {t === "karma" && <KarmaCoin size={16} />}
            {t === "karma" ? "Karma" : "Missions"}
          </button>
        ))}
      </div>

      {tab === "missions" ? (
        <Missions app={app} setConfetti={setConfetti} toast={toast} />
      ) : (
        <Karma app={app} toast={toast} />
      )}
    </div>
  );
}

function Missions({
  app,
  setConfetti,
  toast,
}: {
  app: ReturnType<typeof useApp>;
  setConfetti: (fn: (c: number) => number) => void;
  toast: (t: string) => void;
}) {
  return (
    <div className="mt-4">
      <h3 className="mb-2 text-sm font-semibold text-text-primary">Today</h3>
      <div className="cosmic-card p-4">
        <p className="text-[15px] text-text-primary">Meditate 7 minutes today</p>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-black/[0.05]">
          <div
            className="h-full rounded-full bg-gold transition-all duration-500"
            style={{ width: `${(app.missionProgress / 7) * 100}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-text-muted">
            {app.missionProgress} of 7 days
          </span>
          <CheckButton
            done={app.missionProgress >= 7}
            label="Complete Today"
            doneLabel="Completed"
            onClick={() => {
              app.completeMissionDay();
              setConfetti((c) => c + 1);
              toast("The universe noticed · +10 Karma");
            }}
          />
        </div>
      </div>

      <h3 className="mb-2 mt-5 text-sm font-semibold text-text-primary">This Week</h3>
      <div className="space-y-2">
        {WEEKLY.map((m) => {
          const done = app.weeklyDone.includes(m.id);
          return (
            <button
              key={m.id}
              onClick={() => {
                app.toggleWeekly(m.id, m.karma);
                if (!done) toast("Karma received");
              }}
              className="cosmic-card flex w-full items-center gap-3 p-3.5 text-left"
            >
              <DrawTick checked={done} />
              <span
                className={`flex-1 text-sm ${
                  done ? "text-text-muted line-through" : "text-text-primary"
                }`}
              >
                {m.label}
                {m.when && (
                  <span className="ml-1 text-xs text-text-muted">({m.when})</span>
                )}
              </span>
              <span className="text-xs text-gold">+{m.karma}</span>
            </button>
          );
        })}
      </div>

      <h3 className="mb-2 mt-5 flex items-center gap-1.5 text-sm font-semibold text-text-muted">
        <Lock size={13} /> Unlocks at 20-day streak
      </h3>
      <div className="space-y-2 opacity-40">
        {["Group ritual with friends", "Reserved monthly consultation", "Rare astrologer access"].map(
          (l) => (
            <div key={l} className="cosmic-card flex items-center gap-3 p-3.5">
              <Lock size={16} className="text-text-muted" />
              <span className="text-sm text-text-primary">{l}</span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function Karma({
  app,
  toast,
}: {
  app: ReturnType<typeof useApp>;
  toast: (t: string) => void;
}) {
  return (
    <div className="mt-4">
      {/* Balance */}
      <div className="cosmic-card relative flex flex-col items-center overflow-hidden py-7">
        <div
          className="pointer-events-none absolute -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl"
          style={{ background: "radial-gradient(circle,#F4C430,transparent 70%)" }}
        />
        <CountUp
          value={app.karma}
          className="serif grad-text text-6xl"
        />
        <span className="mt-1 text-sm text-text-muted">Karma</span>
      </div>

      {/* Recent */}
      <h3 className="mb-2 mt-5 text-sm font-semibold text-text-primary">Recent</h3>
      <div className="cosmic-card divide-y divide-gold/10">
        {app.karmaLog.slice(0, 6).map((e, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-2.5">
            <div>
              <span
                className={`mono text-sm font-semibold ${
                  e.delta >= 0 ? "text-success" : "text-danger"
                }`}
              >
                {e.delta >= 0 ? "+" : ""}
                {e.delta}
              </span>
              <span className="ml-2 text-sm text-text-primary">{e.reason}</span>
            </div>
            <span className="text-[11px] text-text-muted">{e.at}</span>
          </div>
        ))}
      </div>

      {/* Redeem */}
      <h3 className="mb-2 mt-5 text-sm font-semibold text-text-primary">Redeem</h3>
      <div className="space-y-2">
        {REDEEM.map((r) => {
          const affordable = app.karma >= r.cost;
          return (
            <div
              key={r.label}
              className="cosmic-card flex items-center justify-between p-3.5"
            >
              <div>
                <p className="text-sm text-text-primary">{r.label}</p>
                <p className="mono text-xs text-gold">{r.cost} K</p>
              </div>
              <button
                disabled={!affordable}
                onClick={() => {
                  app.addKarma(-r.cost, `Redeemed: ${r.label}`);
                  toast("Blessing unlocked ✦");
                }}
                className="rounded-btn bg-gold px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-30"
              >
                Redeem
              </button>
            </div>
          );
        })}
      </div>

      {/* Karma Gullak — auto micro-savings, breaks on festivals */}
      <div
        className="mt-5 flex items-center gap-3 rounded-card p-4 text-white"
        style={{
          background: "linear-gradient(135deg,#B45309,#FF6B2C)",
          boxShadow: "0 10px 26px rgba(180,83,9,0.3)",
        }}
      >
        <span className="text-3xl">🏺</span>
        <div className="flex-1">
          <p className="text-sm font-bold">Karma Gullak</p>
          <p className="text-[11px] text-white/85">
            10% of every karma you earn drops in automatically
          </p>
          <p className="mono mt-1 text-lg font-bold">
            {Math.round(app.karma * 0.12).toLocaleString("en-IN")} saved
          </p>
        </div>
        <div className="text-center">
          <span className="block rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold backdrop-blur">
            breaks on Diwali 🪔
          </span>
          <span className="mt-1 block text-[9px] text-white/70">
            jackpot ×2 multiplier
          </span>
        </div>
      </div>

      {/* Gift */}
      <div
        className="mt-5 rounded-card p-4"
        style={{
          background: "linear-gradient(145deg,#FFF2E2,#FFE9CE)",
          border: "1px solid rgba(244,196,48,0.3)",
        }}
      >
        <p className="text-sm font-semibold text-text-primary">
          Gift 100 Karma, get 200 back
        </p>
        <p className="mt-1 text-xs text-text-muted">
          When a friend joins via your invite, you both earn Karma.
        </p>
        <button
          onClick={() => toast("Good karma multiplies — link copied")}
          className="btn-gold mt-3 w-full rounded-btn text-sm"
        >
          Invite Friends
        </button>
      </div>
    </div>
  );
}
