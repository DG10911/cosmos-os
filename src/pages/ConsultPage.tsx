import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Phone, MessageCircle } from "lucide-react";
import { ASTROLOGERS, avatarUrl } from "../data/seed";
import { TrustSigil } from "./TodayPage";

const FILTERS = ["Language", "System", "Price", "Available"];

export default function ConsultPage() {
  const nav = useNavigate();
  const [query, setQuery] = useState("");

  const list = ASTROLOGERS.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => b.trust - a.trust);

  return (
    <div className="px-4 pt-3">
      <h1 className="serif mb-3 text-3xl text-white">Consult</h1>

      {/* Search */}
      <div className="cosmic-card flex items-center gap-2 px-3">
        <Search size={18} className="text-text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search astrologers…"
          className="h-11 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-text-muted/60"
        />
      </div>

      {/* Filter chips */}
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f}
            className="whitespace-nowrap rounded-full border border-white/12 bg-bg-card px-3 py-1.5 text-xs text-text-muted"
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between px-1">
        <span className="text-xs text-text-muted">{list.length} astrologers</span>
        <span className="text-xs font-medium text-gold">Sort: Trust Score ↓</span>
      </div>

      {/* Cards */}
      <div className="mt-2 space-y-3 pb-4">
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
                  <span className="truncate text-sm font-semibold text-white">
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
                  <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] text-text-muted">
                    {a.languages}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      a.online ? "bg-success" : "bg-white/25"
                    }`}
                  />
                  <span className={a.online ? "text-success" : "text-text-muted"}>
                    {a.online ? "Online" : "Offline"}
                  </span>
                  <span className="text-text-muted">
                    · {a.accuracy}% ✓ · {(a.sessions / 1000).toFixed(1)}k sessions
                  </span>
                </div>
              </div>
            </div>

            <div
              className="mt-3 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => nav(`/session/${a.id}`)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-btn bg-gold py-2 text-xs font-semibold text-bg"
              >
                <MessageCircle size={14} /> Chat ₹{a.price}/min
              </button>
              <button
                onClick={() => nav(`/session/${a.id}`)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-btn border border-white/15 py-2 text-xs font-medium text-white"
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
