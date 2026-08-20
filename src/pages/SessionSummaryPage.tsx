import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target,
  CalendarPlus,
  ListChecks,
  Share2,
  CalendarClock,
  Rocket,
  Check,
} from "lucide-react";
import { Confetti } from "../components/Confetti";
import { useToast } from "../components/Toast";
import { getSession } from "../lib/session";

// Fallback recap if the user reaches this page without a generated session.
const FALLBACK = {
  astrologerName: "Pt. Suresh Sharma",
  minutes: 12,
  said: [
    "Your Mahadasha is a period of transformation, not just anxiety.",
    "The timing depends on your current transit — a supportive window opens soon.",
    "A chart-matched gemstone, correctly energised, will stabilise this period.",
  ],
  todo: [
    "Wear the recommended gemstone on its planetary day",
    "Chant your remedy mantra 108 times on your lucky day",
    "Meditate 10 min daily this week",
    "Follow up on the key decision before it passes",
  ],
  prediction: {
    text: "You'll get clarity on your key question",
    dueOn: "22 Nov 2026",
  },
};

export default function SessionSummaryPage() {
  const nav = useNavigate();
  const toast = useToast();
  const [confetti, setConfetti] = useState(0);
  const [checked, setChecked] = useState<number[]>([]);

  const session = getSession();
  const astrologerName = session?.astrologerName ?? FALLBACK.astrologerName;
  const minutes = session?.minutes ?? FALLBACK.minutes;
  const SAID = session?.said ?? FALLBACK.said;
  const ACTIONS = session?.todo ?? FALLBACK.todo;
  const prediction = session?.prediction ?? FALLBACK.prediction;

  useEffect(() => {
    setConfetti(1);
  }, []);

  function toggle(i: number) {
    setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));
  }

  return (
    <div className="px-4 pt-3 pb-8">
      <Confetti fire={confetti} />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="serif text-[26px] text-text-primary">Session Complete</h1>
        <p className="text-sm text-text-muted">{minutes} min with {astrologerName}</p>
      </motion.div>

      {/* What was said */}
      <Card>
        <CardTitle icon={<ListChecks size={16} className="text-gold" />}>
          What was said
        </CardTitle>
        <ul className="mt-2 space-y-2">
          {SAID.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-text-primary">
              <span className="text-gold">•</span>
              {s}
            </li>
          ))}
        </ul>
      </Card>

      {/* Action plan */}
      <Card>
        <CardTitle icon={<Target size={16} className="text-cosmic" />}>
          What to do this week
        </CardTitle>
        <div className="mt-2 space-y-2">
          {ACTIONS.map((a, i) => (
            <div key={i} className="rounded-xl bg-bg/40 p-2.5">
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-start gap-2 text-left"
              >
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    checked.includes(i)
                      ? "border-success bg-success text-white"
                      : "border-white/30"
                  }`}
                >
                  {checked.includes(i) && <Check size={12} />}
                </span>
                <span
                  className={`text-sm ${
                    checked.includes(i)
                      ? "text-text-muted line-through"
                      : "text-text-primary"
                  }`}
                >
                  {a}
                </span>
              </button>
              <div className="mt-2 flex gap-2 pl-6">
                <MiniBtn
                  icon={<CalendarPlus size={12} />}
                  label="Calendar"
                  onClick={() => toast("Added to Calendar ✓")}
                />
                <MiniBtn
                  icon={<Target size={12} />}
                  label="Missions"
                  onClick={() => toast("Added to Missions ✓")}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Prediction locked */}
      <button
        onClick={() => nav("/predictions")}
        className="mt-4 w-full rounded-card p-4 text-left"
        style={{
          background: "linear-gradient(145deg,#FFE9CE,#FFFFFF)",
          border: "1px solid rgba(139,124,252,0.35)",
        }}
      >
        <div className="flex items-center gap-2">
          <Target size={16} className="text-gold" />
          <span className="text-sm font-semibold text-text-primary">
            Prediction locked in
          </span>
        </div>
        <p className="mt-2 text-sm text-text-primary">
          {astrologerName.split(" ").slice(-1)[0]} predicted: {prediction.text} by{" "}
          <span className="text-gold">{prediction.dueOn}</span>.
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-text-muted">
          <CalendarClock size={12} /> We'll check in with you shortly after. Tap to
          track →
        </p>
      </button>

      {/* Next */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => nav("/consult")}
          className="btn-gold flex-1 rounded-btn text-sm"
        >
          Book Follow-up
        </button>
        <button
          onClick={() => nav("/circle")}
          className="btn-outline flex flex-1 items-center justify-center gap-1.5 rounded-btn text-sm"
        >
          <Share2 size={15} /> Share Reading
        </button>
      </div>

      {/* Cosmos+ upsell */}
      <div
        className="mt-4 flex items-center gap-3 rounded-card p-4"
        style={{
          background: "linear-gradient(145deg,#FFF2E2,#FFE9CE)",
          border: "1px solid rgba(139,124,252,0.3)",
        }}
      >
        <Rocket size={22} className="shrink-0 text-gold" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary">
            Unlock unlimited AI Twin + 10% off consultations
          </p>
          <p className="text-xs text-text-muted">
            Cosmos+ · ₹199/mo · 7-day free trial
          </p>
        </div>
        <button
          onClick={() => nav("/me")}
          className="shrink-0 rounded-btn bg-gold px-3 py-2 text-xs font-semibold text-white"
        >
          Try Free
        </button>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="cosmic-card mt-4 p-4"
    >
      {children}
    </motion.div>
  );
}

function CardTitle({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm font-semibold text-text-primary">{children}</span>
    </div>
  );
}

function MiniBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 rounded-full border border-gold/20 px-2.5 py-1 text-[11px] text-text-muted hover:text-gold"
    >
      {icon} {label}
    </button>
  );
}
