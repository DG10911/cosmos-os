import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Phone, MessageCircle, Star } from "lucide-react";
import { ASTROLOGERS, avatarUrl } from "../data/seed";
import { TrustSigil } from "./TodayPage";
import { AstrologerCardSkeleton } from "../components/Skeleton";
import { FestiveBanner } from "../components/FestiveBits";

const FILTERS = [
  { key: "online", label: "Online now" },
  { key: "hindi", label: "Hindi" },
  { key: "vedic", label: "Vedic" },
  { key: "cheap", label: "Under ₹20" },
] as const;

const SORTS = [
  { key: "trust", label: "Trust Score ↓" },
  { key: "price", label: "Price ↑" },
  { key: "rating", label: "Rating ↓" },
] as const;

export default function ConsultPage() {
  const nav = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string[]>([]);
  const [sortI, setSortI] = useState(0);

  // brief simulated load to show the premium skeleton state
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  function toggleFilter(k: string) {
    setActive((f) => (f.includes(k) ? f.filter((x) => x !== k) : [...f, k]));
  }

  const sort = SORTS[sortI];
  const list = ASTROLOGERS.filter((a) => {
    if (!a.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (active.includes("online") && !a.online) return false;
    if (active.includes("hindi") && !a.languages.toLowerCase().includes("hindi"))
      return false;
    if (active.includes("vedic") && !a.systems.includes("Vedic")) return false;
    if (active.includes("cheap") && a.price >= 20) return false;
    return true;
  }).sort((a, b) => {
    if (sort.key === "price") return a.price - b.price;
    if (sort.key === "rating") return b.accuracy - a.accuracy;
    return b.trust - a.trust;
  });

  return (
    <div className="px-4 pt-3">
      <FestiveBanner
        eyebrow="✓ 15,000+ verified astrologers"
        title="Your first chat is FREE"
        sub="Chat or call — trusted, private, 24×7"
      />

      {/* Live story rings — Instagram-style */}
      <div className="no-scrollbar -mx-4 mt-4 flex gap-3 overflow-x-auto px-4">
        {ASTROLOGERS.filter((a) => a.online)
          .concat(ASTROLOGERS.filter((a) => !a.online))
          .slice(0, 8)
          .map((a) => (
            <button
              key={a.id}
              onClick={() => nav(a.online ? `/call/${a.id}?type=video` : `/astrologer/${a.id}`)}
              className="flex w-[64px] shrink-0 flex-col items-center gap-1"
            >
              <span
                className="relative rounded-full p-[2.5px]"
                style={{
                  background: a.online
                    ? "conic-gradient(from 0deg,#FF6B2C,#E11D74,#7C3AED,#FF9A1F,#FF6B2C)"
                    : "rgba(140,122,104,0.25)",
                }}
              >
                <img
                  src={avatarUrl(a.id)}
                  alt={a.name}
                  className="h-14 w-14 rounded-full border-2 border-bg bg-bg-elevated"
                />
                {a.online && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                    <span className="inline-block animate-flame-flicker rounded-[4px] bg-danger px-1.5 py-[1px] text-[8px] font-black tracking-wide text-white shadow">
                      LIVE
                    </span>
                  </span>
                )}
              </span>
              <span className="w-full truncate text-center text-[10px] text-text-muted">
                {a.name.split(" ")[1] ?? a.name}
              </span>
            </button>
          ))}
      </div>

      {/* Search */}
      <div className="cosmic-card mt-4 flex items-center gap-2 px-3">
        <Search size={18} className="text-text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search astrologers…"
          className="h-11 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted/60"
        />
      </div>

      {/* Filter chips — tap to apply */}
      <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => {
          const on = active.includes(f.key);
          return (
            <button
              key={f.key}
              onClick={() => toggleFilter(f.key)}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                on
                  ? "border-gold bg-gold text-white shadow-[0_4px_12px_rgba(255,107,44,0.3)]"
                  : "border-gold/20 bg-bg-card text-text-muted"
              }`}
            >
              {on ? "✓ " : ""}
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between px-1">
        <span className="text-xs text-text-muted">
          {loading ? "Finding your best matches…" : `${list.length} astrologers`}
        </span>
        <button
          onClick={() => setSortI((i) => (i + 1) % SORTS.length)}
          className="rounded-full bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold active:scale-95"
        >
          Sort: {sort.label}
        </button>
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
          <p className="text-sm text-text-primary">
            No astrologers match{query ? ` "${query}"` : " these filters"}
          </p>
          <button
            onClick={() => {
              setQuery("");
              setActive([]);
            }}
            className="mt-1 text-xs font-semibold text-gold"
          >
            Clear search & filters
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
                onClick={() => nav(`/call/${a.id}?type=audio`)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-btn border border-gold/30 py-2 text-xs font-bold text-gold"
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
