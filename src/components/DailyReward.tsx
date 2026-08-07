import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../state/AppState";
import { useToast } from "./Toast";
import { Confetti } from "./Confetti";
import { KarmaCoin } from "./Glyphs";
import { Check } from "lucide-react";

const REWARDS = [10, 15, 20, 30, 40, 60, 100]; // 7-day cycle

/** Daily check-in reward — a proven retention loop (streak of daily claims). */
export function DailyReward() {
  const app = useApp();
  const toast = useToast();
  const [confetti, setConfetti] = useState(0);

  const todayIdx = app.rewardDay; // next claimable index (0-based)
  const todayReward = REWARDS[Math.min(6, todayIdx)];

  function claim() {
    if (app.rewardClaimed) return;
    app.claimDaily(todayReward);
    setConfetti((c) => c + 1);
    toast(`The cosmos left you +${todayReward} Karma ✦`);
  }

  return (
    <div className="cosmic-card relative overflow-hidden p-4">
      <Confetti fire={confetti} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KarmaCoin size={18} />
          <span className="text-sm font-semibold text-text-primary">Daily Reward</span>
        </div>
        <span className="text-[11px] text-text-muted">
          Day {Math.min(7, todayIdx + (app.rewardClaimed ? 0 : 1))} of 7
        </span>
      </div>

      {/* 7-day coin row */}
      <div className="mt-3 flex items-center justify-between gap-1">
        {REWARDS.map((r, i) => {
          const claimed = i < todayIdx || (i === todayIdx && app.rewardClaimed);
          const isToday = i === todayIdx && !app.rewardClaimed;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                  claimed
                    ? "border-success/50 bg-success/10"
                    : isToday
                    ? "border-gold bg-gold/15"
                    : "border-gold/20 bg-black/[0.04]"
                }`}
                style={
                  isToday
                    ? { boxShadow: "0 0 14px rgba(244,196,48,0.4)" }
                    : undefined
                }
              >
                {claimed ? (
                  <Check size={15} className="text-success" />
                ) : (
                  <KarmaCoin size={isToday ? 22 : 16} />
                )}
              </div>
              <span
                className={`mono text-[9px] ${
                  isToday ? "text-gold" : "text-text-muted"
                }`}
              >
                +{r}
              </span>
            </div>
          );
        })}
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={claim}
        disabled={app.rewardClaimed}
        className={`mt-3 w-full rounded-btn py-2.5 text-sm font-semibold transition ${
          app.rewardClaimed
            ? "bg-success/15 text-success"
            : "btn-gold"
        }`}
      >
        {app.rewardClaimed
          ? "Claimed — see you tomorrow"
          : `Claim +${todayReward} Karma`}
      </motion.button>
    </div>
  );
}
