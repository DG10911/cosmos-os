import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Share2, X } from "lucide-react";
import { useToast } from "../components/Toast";

type Event = {
  year: string;
  cat: string;
  label: string;
  confidence?: number;
  color: string;
  past?: boolean;
  reason?: string;
  by?: string;
};

const EVENTS: Event[] = [
  { year: "2023", cat: "Career", label: "Joined first job", color: "#A1A1AA", past: true },
  { year: "2024", cat: "Love", label: "Ended a relationship", color: "#A1A1AA", past: true },
  { year: "2025", cat: "Family", label: "Grandmother passed", color: "#A1A1AA", past: true },
  { year: "Nov 2026", cat: "Career", label: "Promotion clarity", confidence: 82, color: "#F4C430", by: "Pt. Suresh", reason: "Saturn transit through the 10th house aligns with a Rahu Mahadasha turning point." },
  { year: "Feb 2027", cat: "Love", label: "New relationship window", confidence: 68, color: "#8B7CFC", by: "Acharya Deepa", reason: "Venus enters a favorable Nakshatra for your Moon sign." },
  { year: "Aug 2027", cat: "Finance", label: "Property opportunity", confidence: 75, color: "#4ADE80", by: "Guruji Anand", reason: "Jupiter's transit favors long-term asset decisions." },
  { year: "2028", cat: "Health", label: "Fitness milestone", confidence: 60, color: "#60A5FA", by: "AI Twin", reason: "Dasha shift supports sustained discipline." },
  { year: "2030", cat: "Marriage", label: "Auspicious marriage window", confidence: 90, color: "#F87171", by: "Kundli", reason: "7th-lord Dasha period with strong benefic aspects." },
];

const FILTERS = ["All", "Career", "Love", "Health", "Finance", "Family", "Marriage"];

export default function TimelinePage() {
  const nav = useNavigate();
  const toast = useToast();
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<Event | null>(null);

  const shown = EVENTS.filter((e) => filter === "All" || e.cat === filter);
  const nowIndex = shown.findIndex((e) => !e.past);

  return (
    <div className="px-4 pt-3 pb-4">
      <button
        onClick={() => nav(-1)}
        className="mb-2 flex items-center gap-1 text-sm text-text-muted"
      >
        <ChevronLeft size={16} /> Back
      </button>
      <h1 className="serif text-2xl text-white">Your Destiny Timeline</h1>

      {/* filters */}
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition ${
              filter === f
                ? "border-gold bg-gold/10 text-gold"
                : "border-white/12 text-text-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* vertical timeline */}
      <div className="relative mt-5 pl-6">
        <div className="absolute bottom-0 left-[7px] top-0 w-px bg-gradient-to-b from-white/10 via-cosmic/40 to-gold/40" />
        {shown.map((e, i) => (
          <div key={i}>
            {i === nowIndex && (
              <div className="relative mb-4 -ml-6 flex items-center gap-2">
                <div className="h-px flex-1 bg-gold/50" />
                <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-bg">
                  NOW
                </span>
              </div>
            )}
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActive(e)}
              className="relative mb-4 flex w-full items-start gap-3 text-left"
            >
              <span
                className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-bg"
                style={{ background: e.color, boxShadow: `0 0 8px ${e.color}` }}
              />
              <div className="cosmic-card flex-1 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">{e.year}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px]"
                    style={{ background: `${e.color}22`, color: e.color }}
                  >
                    {e.cat}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-white">{e.label}</p>
                {e.confidence && (
                  <p className="mt-0.5 text-[11px] text-text-muted">
                    {e.confidence}% confidence · {e.by}
                  </p>
                )}
              </div>
            </motion.button>
          </div>
        ))}
      </div>

      <button
        onClick={() => toast("Timeline image saved ✨")}
        className="btn-gold mt-2 flex w-full items-center justify-center gap-2 rounded-btn"
      >
        <Share2 size={16} /> Share your Timeline
      </button>

      {/* detail modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-6"
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              onClick={(ev) => ev.stopPropagation()}
              className="w-full max-w-[390px] rounded-2xl border border-white/10 bg-bg-elevated p-5"
            >
              <div className="flex items-start justify-between">
                <span
                  className="rounded-full px-2 py-0.5 text-[11px]"
                  style={{ background: `${active.color}22`, color: active.color }}
                >
                  {active.cat} · {active.year}
                </span>
                <button onClick={() => setActive(null)} className="text-text-muted">
                  <X size={18} />
                </button>
              </div>
              <h3 className="serif mt-3 text-xl text-white">{active.label}</h3>
              {active.confidence ? (
                <>
                  <p className="mt-1 text-sm text-gold">
                    {active.confidence}% confidence · predicted by {active.by}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-text-muted">
                    {active.reason}
                  </p>
                  <button
                    onClick={() => setActive(null)}
                    className="btn-gold mt-5 w-full rounded-btn text-sm"
                  >
                    Set reminder
                  </button>
                </>
              ) : (
                <p className="mt-3 text-sm text-text-muted">
                  A confirmed moment on your journey.
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
