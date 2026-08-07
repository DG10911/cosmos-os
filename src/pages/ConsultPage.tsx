import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Phone, MessageCircle, Star } from "lucide-react";
import { ASTROLOGERS, avatarUrl } from "../data/seed";
import { TrustSigil } from "./TodayPage";
import { AstrologerCardSkeleton } from "../components/Skeleton";

const FILTERS = ["Language", "System", "Price", "Available"];

export default function ConsultPage() {
  const nav = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // brief simulated load to show the premium skeleton state
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const list = ASTROLOGERS.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => b.trust - a.trust);

  return (
    <div className="px-4 pt-3">
      <h1 className="serif mb-3 text-3xl text-text-primary">Consult</h1>

      {/* Search */}
      <div className="cosmic-card flex items-center gap-2 px-3">
        <Search size={18} className="text-text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search astrologers…"
          className="h-11 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted/60"
        />
      </div>

      {/* Filter chips */}
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f}
            className="whitespace-nowrap rounded-full border border-gold/20 bg-bg-card px-3 py-1.5 text-xs text-text-muted"
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between px-1">
        <span className="text-xs text-text-muted">
          {loading ? "Finding your best matches…" : `${list.length} astrologers`}
        </span>
        <span className="text-xs font-medium text-gold">Sort: Trust Score ↓</span>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="mt-2 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <AstrologerCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && list.length === 0 && (
        <div className="cosmic-card mt-6 flex flex-col items-center gap-2 p-8 text-center">
          <Search size={24} className="text-text-muted" />
          <p className="text-sm text-text-primary">No astrologers match "{query}"</p>
          <button
            onClick={() => setQuery("")}
            className="mt-1 text-xs font-semibold text-gold"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Cards */}
      <div className={`mt-2 space-y-3 pb-4 ${loading ? "hidden" : ""}`}>
        {list.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => nav(`/astrologer/${a.id}`)}
            className="cosmic-card cursor-pointer p-3.5"
          >
            <div className="flex gap-3">
              <img
                src={avatarUrl(a.id)}
                alt={a.name}
                className="h-14 w-14 shrink-0 rounded-full bg-bg-elevated"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-text-primary">
                    {a.name}
                  </span>
                  <TrustSigil score={a.trust} />
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {a.systems.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-cosmic/15 px-2 py-0.5 text-[10px] text-cosmic"
                    >
                      {s}
                    </span>
                  ))}
                  <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[10px] text-text-muted">
                    {a.languages}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${a.online ? "bg-success" : "bg-black/20"}`} />
                    <span className={a.online ? "font-semibold text-success" : "text-text-muted"}>
                      {a.online ? "Online" : "Offline"}
                    </span>
                  </span>
                  <span className="flex items-center gap-0.5 rounded-full bg-amber/20 px-1.5 py-0.5 font-bold text-[#B45309]">
                    <Star size={9} className="fill-current" /> {(a.accuracy / 20).toFixed(1)}
                  </span>
                  <span className="rounded-full bg-success/12 px-1.5 py-0.5 font-bold text-success">
                    1st chat FREE
                  </span>
                  <span className="text-text-muted">{(a.sessions / 1000).toFixed(0)}k+ consults</span>
                </div>
              </div>
            </div>

            <div
              className="mt-3 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => nav(`/session/${a.id}`)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-btn bg-gold py-2 text-xs font-semibold text-white"
              >
                <MessageCircle size={14} /> Chat ₹{a.price}/min
              </button>
              <button
                onClick={() => nav(`/session/${a.id}`)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-btn border border-gold/20 py-2 text-xs font-medium text-text-primary"
              >
                <Phone size={14} /> Call ₹{Math.round(a.price * 2.3)}/min
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
