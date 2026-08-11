import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Check, X, Minus, Target } from "lucide-react";
import posthog from "posthog-js";
import { PageHeader } from "../components/PageHeader";
import { PREDICTIONS, type Prediction } from "../data/predictions";
import { ASTROLOGERS } from "../data/seed";
import { CountUp } from "../components/CountUp";
import { useToast } from "../components/Toast";
import { Confetti } from "../components/Confetti";

export default function PredictionsPage() {
  const toast = useToast();
  const [preds, setPreds] = useState<Prediction[]>(PREDICTIONS);
  const [confetti, setConfetti] = useState(0);

  const resolved = preds.filter((p) => p.status !== "open");
  const open = preds.filter((p) => p.status === "open");
  const hits = preds.filter((p) => p.status === "yes").length;
  const accuracy = resolved.length
    ? Math.round(
        ((hits + preds.filter((p) => p.status === "partial").length * 0.5) /
          resolved.length) *
          100
      )
    : 0;

  // per-astrologer accuracy
  const leaderboard = useMemo(() => {
    const map = new Map<number, { hit: number; total: number }>();
    preds
      .filter((p) => p.status !== "open")
      .forEach((p) => {
        const cur = map.get(p.astrologerId) ?? { hit: 0, total: 0 };
        cur.total += 1;
        if (p.status === "yes") cur.hit += 1;
        if (p.status === "partial") cur.hit += 0.5;
        map.set(p.astrologerId, cur);
      });
    return [...map.entries()]
      .map(([id, v]) => ({
        astro: ASTROLOGERS.find((a) => a.id === id)!,
        acc: Math.round((v.hit / v.total) * 100),
        total: v.total,
      }))
      .sort((a, b) => b.acc - a.acc);
  }, [preds]);

  function resolve(id: string, status: Prediction["status"]) {
    const prediction = preds.find((p) => p.id === id);
    posthog.capture("prediction_resolved", {
      prediction_category: prediction?.category,
      outcome: status,
    });
    setPreds((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    if (status === "yes") {
      setConfetti((c) => c + 1);
      toast("Your future came true · +20 Karma to trust");
    } else {
      toast("Outcome recorded");
    }
  }

  return (
    <div className="px-4 pt-3 pb-6">
      <Confetti fire={confetti} />
      <PageHeader
        title="Prediction Tracker"
        sub="Every prediction, held accountable — our promise"
      />

      {/* Accuracy hero */}
      <div
        className="aura-border mt-4 flex items-center gap-4 rounded-card p-5"
        style={{ background: "linear-gradient(150deg,#FFF0DC,#FFEAD2)" }}
      >
        <div className="text-center">
          <CountUp
            value={accuracy}
            format={(n) => `${Math.round(n)}%`}
            className="serif grad-text text-5xl"
          />
          <p className="mt-0.5 text-[11px] text-text-muted">accuracy</p>
        </div>
        <div className="h-12 w-px bg-black/[0.05]" />
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-text-primary">
            <ShieldCheck size={16} className="text-success" />
            30-day Prediction Warranty
          </div>
          <p className="mt-1 text-xs text-text-muted">
            If accuracy drops below 60%, your consultation is refunded.
          </p>
        </div>
      </div>

      {/* Stat row */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        <Stat label="Open" value={open.length} tint="text-cosmic" />
        <Stat label="Came true" value={hits} tint="text-success" />
        <Stat label="Tracked" value={preds.length} tint="text-gold" />
      </div>

      {/* Open predictions — resolvable */}
      <h3 className="serif mt-6 text-lg text-text-primary">Awaiting outcome</h3>
      <div className="mt-2 space-y-2">
        {open.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="cosmic-card p-4"
          >
            <div className="flex items-center justify-between">
              <span
                className="rounded-full bg-cosmic/15 px-2 py-0.5 text-[10px] text-cosmic"
              >
                {p.category}
              </span>
              <span className="text-[11px] text-text-muted">due {p.dueOn}</span>
            </div>
            <p className="mt-2 text-sm text-text-primary">{p.text}</p>
            <p className="mt-0.5 text-[11px] text-text-muted">by {p.by}</p>
            <div className="mt-3 flex gap-2">
              <ResolveBtn
                onClick={() => resolve(p.id, "yes")}
                icon={<Check size={14} />}
                label="Came true"
                color="#4ADE80"
              />
              <ResolveBtn
                onClick={() => resolve(p.id, "partial")}
                icon={<Minus size={14} />}
                label="Partly"
                color="#F4C430"
              />
              <ResolveBtn
                onClick={() => resolve(p.id, "no")}
                icon={<X size={14} />}
                label="No"
                color="#F87171"
              />
            </div>
          </motion.div>
        ))}
        {open.length === 0 && (
          <EmptyState text="No open predictions. Book a reading to receive one." />
        )}
      </div>

      {/* Leaderboard */}
      <h3 className="serif mt-6 text-lg text-text-primary">Astrologer accuracy</h3>
      <div className="mt-2 space-y-2">
        {leaderboard.map((row) => (
          <div key={row.astro.id} className="cosmic-card flex items-center gap-3 p-3">
            <span className="text-sm font-semibold text-text-primary">{row.astro.name}</span>
            <div className="ml-auto flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-black/[0.05]">
                <div
                  className="h-full rounded-full bg-gold"
                  style={{ width: `${row.acc}%` }}
                />
              </div>
              <span className="mono w-9 text-right text-sm text-gold">{row.acc}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Resolved history */}
      <h3 className="serif mt-6 text-lg text-text-primary">History</h3>
      <div className="mt-2 space-y-2">
        {resolved.map((p) => (
          <div key={p.id} className="cosmic-card flex items-start gap-3 p-3.5">
            <StatusChip status={p.status} />
            <div className="flex-1">
              <p className="text-sm text-text-primary">{p.text}</p>
              <p className="text-[11px] text-text-muted">
                {p.by} · resolved {p.dueOn}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, tint }: { label: string; value: number; tint: string }) {
  return (
    <div className="cosmic-card py-3 text-center">
      <CountUp value={value} className={`mono text-2xl font-bold ${tint}`} />
      <div className="text-[10px] text-text-muted">{label}</div>
    </div>
  );
}

function ResolveBtn({
  onClick,
  icon,
  label,
  color,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-1 rounded-btn border py-2 text-xs font-medium"
      style={{ borderColor: `${color}55`, color }}
    >
      {icon} {label}
    </button>
  );
}

function StatusChip({ status }: { status: Prediction["status"] }) {
  const map = {
    yes: { icon: <Check size={13} />, color: "#4ADE80", bg: "rgba(74,222,128,0.15)" },
    no: { icon: <X size={13} />, color: "#F87171", bg: "rgba(248,113,113,0.15)" },
    partial: { icon: <Minus size={13} />, color: "#F4C430", bg: "rgba(244,196,48,0.15)" },
    open: { icon: <Target size={13} />, color: "#8B7CFC", bg: "rgba(139,124,252,0.15)" },
  }[status];
  return (
    <span
      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
      style={{ background: map.bg, color: map.color }}
    >
      {map.icon}
    </span>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="cosmic-card flex flex-col items-center gap-2 p-6 text-center">
      <Target size={22} className="text-text-muted" />
      <p className="text-sm text-text-muted">{text}</p>
    </div>
  );
}
