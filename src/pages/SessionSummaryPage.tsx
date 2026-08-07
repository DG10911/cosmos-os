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

const SAID = [
  "Your Rahu Mahadasha is a period of transformation, not just anxiety.",
  "The promotion timing depends on your Saturn transit — pointing to Nov 2026.",
  "A Neelam ring, correctly energized, will stabilize your Rahu period.",
];

const ACTIONS = [
  "Wear the Neelam ring from Aug 15",
  "Chant Rahu mantra 108 times on Saturday",
  "Meditate 10 min daily this week",
  "Follow up on the promotion talk before Diwali",
];

export default function SessionSummaryPage() {
  const nav = useNavigate();
  const toast = useToast();
  const [confetti, setConfetti] = useState(0);
  const [checked, setChecked] = useState<number[]>([]);

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
        <h1 className="serif text-[26px] text-white">Session Complete ✨</h1>
        <p className="text-sm text-text-muted">12 min with Pt. Suresh Sharma</p>
      </motion.div>

      {/* What was said */}
      <Card>
        <CardTitle icon={<ListChecks size={16} className="text-gold" />}>
          What was said
        </CardTitle>
        <ul className="mt-2 space-y-2">
          {SAID.map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-white/90">
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
                      ? "border-success bg-success text-bg"
                      : "border-white/30"
                  }`}
                >
                  {checked.includes(i) && <Check size={12} />}
                </span>
                <span
                  className={`text-sm ${
                    checked.includes(i)
                      ? "text-text-muted line-through"
                      : "text-white"
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
      <div
        className="mt-4 rounded-card p-4"
        style={{
          background: "linear-gradient(145deg,#1a0b2e,#161629)",
          border: "1px solid rgba(139,124,252,0.35)",
        }}
      >
        <div className="flex items-center gap-2">
          <Target size={16} className="text-gold" />
          <span className="text-sm font-semibold text-white">
            Prediction locked in
          </span>
        </div>
        <p className="mt-2 text-sm text-white/90">
          Pt. Suresh predicted: you'll get clarity on the promotion by{" "}
          <span className="text-gold">22 Nov 2026</span>.
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-text-muted">
          <CalendarClock size={12} /> We'll check in with you on 23 Nov.
        </p>
      </div>

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
          background: "linear-gradient(145deg,#2d1b4e,#1a0b2e)",
          border: "1px solid rgba(139,124,252,0.3)",
        }}
      >
        <Rocket size={22} className="shrink-0 text-gold" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">
            Unlock unlimited AI Twin + 10% off consultations
          </p>
          <p className="text-xs text-text-muted">
            Cosmos+ · ₹199/mo · 7-day free trial
          </p>
        </div>
        <button
          onClick={() => nav("/me")}
          className="shrink-0 rounded-btn bg-gold px-3 py-2 text-xs font-semibold text-bg"
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
      <span className="text-sm font-semibold text-white">{children}</span>
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
      className="flex items-center gap-1 rounded-full border border-white/12 px-2.5 py-1 text-[11px] text-text-muted hover:text-gold"
    >
      {icon} {label}
    </button>
  );
}
