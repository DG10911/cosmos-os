import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronUp, ChevronDown, Trophy } from "lucide-react";
import { useApp } from "../state/AppState";
import { avatarUrl } from "../data/seed";

const TIERS = ["Chandra", "Budha", "Shukra", "Surya", "Brahma"];
const CURRENT_TIER = 2; // Shukra League

const RIVALS = [
  { id: 61, name: "Ishaan", karma: 2140 },
  { id: 62, name: "Priya", karma: 1876 },
  { id: 63, name: "Rohan", karma: 1642 },
  { id: 64, name: "Sana", karma: 1490 },
  { id: 65, name: "Aditya", karma: 1105 },
  { id: 66, name: "Meera", karma: 987 },
  { id: 67, name: "Kabir", karma: 764 },
  { id: 68, name: "Divya", karma: 590 },
  { id: 69, name: "Arnav", karma: 342 },
];

export default function LeaguePage() {
  const nav = useNavigate();
  const app = useApp();

  const board = [...RIVALS, { id: -1, name: "You", karma: app.karma }].sort(
    (a, b) => b.karma - a.karma
  );
  const myRank = board.findIndex((r) => r.id === -1) + 1;

  // days until Sunday midnight
  const now = new Date();
  const daysLeft = ((7 - now.getDay()) % 7) || 7;

  return (
    <div className="px-4 pt-3 pb-8">
      <button
        onClick={() => nav(-1)}
        className="mb-2 flex items-center gap-1 text-sm text-text-muted"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Tier ladder */}
      <div className="flex items-end justify-between px-2">
        {TIERS.map((t, i) => (
          <div key={t} className="flex flex-col items-center gap-1">
            <span
              className={`flex items-center justify-center rounded-full ${
                i === CURRENT_TIER
                  ? "h-12 w-12 bg-gradient-to-br from-gold to-marigold shadow-[0_6px_18px_rgba(255,107,44,0.4)]"
                  : "h-9 w-9 bg-black/[0.06]"
              }`}
            >
              <Trophy
                size={i === CURRENT_TIER ? 22 : 15}
                className={i === CURRENT_TIER ? "text-white" : "text-text-muted/50"}
              />
            </span>
            <span
              className={`text-[9px] font-bold ${
                i === CURRENT_TIER ? "text-gold" : "text-text-muted/60"
              }`}
            >
              {t}
            </span>
          </div>
        ))}
      </div>

      <h1 className="serif mt-4 text-center text-2xl text-text-primary">
        Shukra League
      </h1>
      <p className="mt-1 text-center text-xs text-text-muted">
        Top 3 rise to Surya · bottom 3 fall to Budha · resets in{" "}
        <b className="text-gold">{daysLeft} day{daysLeft > 1 ? "s" : ""}</b>
      </p>

      {/* board */}
      <div className="mt-4 space-y-1.5">
        {board.map((r, i) => {
          const me = r.id === -1;
          const zone = i < 3 ? "up" : i >= board.length - 3 ? "down" : "mid";
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3 rounded-card p-3 ${
                me
                  ? "aura-border bg-white"
                  : zone === "up"
                    ? "bg-success/8"
                    : zone === "down"
                      ? "bg-danger/5"
                      : "bg-white/60"
              }`}
            >
              <span
                className={`w-6 text-center text-sm font-bold ${
                  i === 0 ? "text-gold" : "text-text-muted"
                }`}
              >
                {i + 1}
              </span>
              {zone === "up" && <ChevronUp size={14} className="text-success" />}
              {zone === "down" && <ChevronDown size={14} className="text-danger" />}
              {zone === "mid" && <span className="w-3.5" />}
              <img
                src={avatarUrl(me ? 99 : r.id)}
                className="h-9 w-9 rounded-full bg-bg-elevated"
                alt={r.name}
              />
              <span
                className={`flex-1 text-sm ${
                  me ? "font-bold text-gold" : "font-medium text-text-primary"
                }`}
              >
                {r.name}
                {me && " ✦"}
              </span>
              <span className="mono text-sm font-bold text-text-primary">
                {r.karma.toLocaleString("en-IN")}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div
        className="mt-4 rounded-card p-4 text-center text-white"
        style={{ background: "linear-gradient(135deg,#7C3AED,#E11D74)" }}
      >
        <p className="text-sm font-bold">
          {myRank <= 3
            ? `You're promoting at #${myRank} — hold the line!`
            : `${board[2].karma - app.karma + 1} karma to reach the promotion zone`}
        </p>
        <button
          onClick={() => nav("/missions")}
          className="mt-2.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-cosmic active:scale-95"
        >
          Earn karma now →
        </button>
      </div>
    </div>
  );
}
